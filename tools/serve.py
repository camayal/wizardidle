"""Serve the game locally for testing, telling the browser never to cache anything.

    python tools/serve.py          (then open http://localhost:8000)
    python tools/serve.py 8080     (another port)

Python's plain `python -m http.server` sends no cache rules, so browsers may keep using old
copies of the code after it changes; with this server every reload gets the files on disk.

The dev tools ask for every file of img/ or snd/ (folders included) at /__list/img and
/__list/snd, as a JSON list of paths.

The review drop lives outside the project, in the folder wizardidle-review/ next to the main
folder (beside wizardidle-old-ideas/), so nothing a session drops there can get in git's way.
It is served at /review/ from any working folder; WIZARDIDLE_REVIEW can point elsewhere.

The game's own music is plain text, songs/<name>.txt (format in src/synth.js). The Music mode lists it at
/__list/songs and saves with a POST to /songs/<name> (letters, numbers and _ only; localhost only).

The dev tools' notes box (src/dev/notes.js) can save here: a POST to /notes/<mode> (sound, art,
dev, or history for the game's texts) appends the note to docs/<mode>-notes.md. Only from this computer (localhost).
Standard library only.
"""
import functools, http.server, json, os, re, subprocess, sys, urllib.parse

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def review_folder():
    if os.environ.get('WIZARDIDLE_REVIEW'):
        return os.environ['WIZARDIDLE_REVIEW']
    try:        # the main folder, also from a second working folder of the same repository
        common = subprocess.run(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'], cwd=REPO,
                                capture_output=True, text=True, check=True).stdout.strip()
        home = os.path.dirname(common)
    except (OSError, subprocess.CalledProcessError):
        home = REPO
    return os.path.join(os.path.dirname(home), 'wizardidle-review')


REVIEW = review_folder()
NOTE_FILES = ('sound', 'art', 'dev', 'history')     # history: the game's texts (Texts mode)
NOTES_HEADER = """# {title} notes

Notes saved from the dev tools' notes box ({mode} mode), newest last: the technical details
filled in by the game, then the author's comment. A later note on the same test replaces an
earlier one.
"""
HISTORY_HEADER = """# History notes

The game's texts as the author edited them in the dev tools' Texts mode, newest last: which
text, where it lives (docs/STORY.md, src/data/dreams.js, a line of the game code), then the
new text in HTML ([sprite] is an icon, {name} the wizard's name, a new line a line break).
The code is changed from here; a later note on the same text replaces an earlier one.
"""


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def translate_path(self, path):
        clean = urllib.parse.unquote(path.split('?', 1)[0].split('#', 1)[0])
        if clean.startswith('/review/'):
            parts = [x for x in clean[len('/review/'):].split('/') if x not in ('', '.', '..')]
            return os.path.join(REVIEW, *parts)
        return super().translate_path(path)

    def do_GET(self):
        if self.path in ('/__list/img', '/__list/snd', '/__list/songs'):
            top = self.path.rsplit('/', 1)[-1]
            files = []
            for root, dirs, names in os.walk(os.path.join(REPO, top)):
                dirs.sort()
                for name in sorted(names):
                    files.append(os.path.relpath(os.path.join(root, name), REPO).replace(os.sep, '/'))
            body = json.dumps(files).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        mode = self.path.rsplit('/', 1)[-1]
        local = self.client_address[0] in ('127.0.0.1', '::1')
        if self.path.startswith('/songs/'):
            if not local or not re.fullmatch(r'[a-z0-9_]{1,40}', mode):
                return self.send_error(404)
            length = int(self.headers.get('Content-Length') or 0)
            if not 0 < length <= 100000:
                return self.send_error(400)
            text = self.rfile.read(length).decode('utf-8', 'replace').replace('\r\n', '\n')
            os.makedirs(os.path.join(REPO, 'songs'), exist_ok=True)
            with open(os.path.join(REPO, 'songs', mode + '.txt'), 'w', encoding='utf-8', newline='\n') as f:
                f.write(text)
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'saved')
            return
        if self.path in ('/travel/overrides', '/travel/capture'):
            return self.travel_post(local)
        if not self.path.startswith('/notes/') or mode not in NOTE_FILES or not local:
            return self.send_error(404)
        length = int(self.headers.get('Content-Length') or 0)
        if not 0 < length <= 200000:
            return self.send_error(400)
        note = self.rfile.read(length).decode('utf-8', 'replace').replace('\r\n', '\n').strip()
        path = os.path.join(REPO, 'docs', f'{mode}-notes.md')
        new = not os.path.exists(path)
        with open(path, 'a', encoding='utf-8', newline='\n') as f:
            if new:
                f.write(HISTORY_HEADER if mode == 'history' else NOTES_HEADER.format(title=mode.capitalize(), mode=mode))
            f.write('\n```\n' + note.replace('```', "'''") + '\n```\n')
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b'saved')


    def travel_post(self, local):
        # The Travel mode (src/dev/travel.js): /travel/overrides rewrites src/data/travelOverrides.js; /travel/capture
        # writes a snapshot, docs/travel-captures/<time>-<stage>.png and .json (the picture and the verdicts).
        length = int(self.headers.get('Content-Length') or 0)
        if not local or not 0 < length <= 5000000:
            return self.send_error(400)
        data = json.loads(self.rfile.read(length).decode('utf-8'))
        if self.path.endswith('/overrides'):
            # {verdicts: {"a|b": move|dest|far}, positions: {name: [x, y]} in map pixels}. A stage's position goes to
            # zones.js (the source of truth); a waypoint's to travelPositions here; then the graph is regenerated.
            verdicts = {k: v for k, v in sorted(data.get('verdicts', {}).items())
                        if v in ('move', 'dest', 'far') and re.fullmatch(r'\w+\|\w+', k)}
            zones_path = os.path.join(REPO, 'src', 'data', 'zones.js')
            with open(zones_path, encoding='utf-8', newline='') as f:
                zones = f.read()
            positions, stages = {}, 0
            for name, xy in data.get('positions', {}).items():
                if not re.fullmatch(r'\w+', name) or len(xy) != 2:
                    continue
                x, y = max(0, min(250, round(float(xy[0])))), max(0, min(250, round(float(xy[1]))))
                new, n = re.subn(r'(\b' + name + r': \{zone:"\w+",x:)[\d.]+(,y:)[\d.]+', r'\g<1>%s\g<2>%s' % (round(x / 250, 3), round(y / 250, 3)), zones)
                if n:
                    zones, stages = new, stages + 1
                else:
                    positions[name] = [x, y]
            with open(zones_path, 'w', encoding='utf-8', newline='') as f:
                f.write(zones)
            target = os.path.join(REPO, 'src', 'data', 'travelOverrides.js')
            with open(target, encoding='utf-8') as f:
                head = f.read().split('export const')[0]
            with open(target, 'w', encoding='utf-8', newline='\n') as f:
                f.write(head + 'export const travelOverrides = ' + json.dumps(verdicts, indent=4) + ';\n'
                        + 'export const travelPositions = ' + json.dumps(positions, indent=4) + ';\n')
            done = subprocess.run([sys.executable, os.path.join(REPO, 'tools', 'travel_graph.py')], capture_output=True, text=True)
            msg = f'saved {len(verdicts)} verdicts, {stages} stage and {len(positions)} waypoint positions; graph ' + \
                ('regenerated: reload the page' if done.returncode == 0 else 'NOT regenerated: ' + done.stderr[-200:])
        else:
            import base64, time
            stage = re.sub(r'\W', '', str(data.get('stage', '')))[:40] or 'map'
            folder = os.path.join(REPO, 'docs', 'travel-captures')
            os.makedirs(folder, exist_ok=True)
            name = time.strftime('%Y%m%d-%H%M%S') + '-' + stage
            png = str(data.get('png', '')).split(',', 1)[-1]
            with open(os.path.join(folder, name + '.png'), 'wb') as f:
                f.write(base64.b64decode(png))
            with open(os.path.join(folder, name + '.json'), 'w', encoding='utf-8', newline='\n') as f:
                json.dump({'stage': data.get('stage'), 'layer': data.get('layer'), 'verdicts': data.get('overrides', {})}, f, indent=2)
            msg = 'saved docs/travel-captures/' + name
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(msg.encode('utf-8'))


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(NoCacheHandler, directory=REPO)
    os.makedirs(REVIEW, exist_ok=True)
    print(f'Wizard Idle on http://localhost:{port} (no caching; Ctrl+C to stop); review drop: {REVIEW}')
    http.server.ThreadingHTTPServer(('', port), handler).serve_forever()
