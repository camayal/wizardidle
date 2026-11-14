"""Serve the game locally for testing, telling the browser never to cache anything.

    python tools/serve.py          (then open http://localhost:8000)
    python tools/serve.py 8080     (another port)

Python's plain `python -m http.server` sends no cache rules, so browsers may keep using old
copies of the code after it changes; with this server every reload gets the files on disk.

The dev tools' notes box (src/dev/notes.js) can save here: a POST to /notes/<mode> (sound, art
or dev) appends the note to docs/<mode>-notes.md. Only from this computer (localhost).
Standard library only.
"""
import functools, http.server, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTE_FILES = ('sound', 'art', 'dev')
NOTES_HEADER = """# {title} notes

Notes saved from the dev tools' notes box ({mode} mode), newest last: the technical details
filled in by the game, then the author's comment. A later note on the same test replaces an
earlier one.
"""


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        mode = self.path.rsplit('/', 1)[-1]
        local = self.client_address[0] in ('127.0.0.1', '::1')
        if not self.path.startswith('/notes/') or mode not in NOTE_FILES or not local:
            return self.send_error(404)
        length = int(self.headers.get('Content-Length') or 0)
        if not 0 < length <= 20000:
            return self.send_error(400)
        note = self.rfile.read(length).decode('utf-8', 'replace').replace('\r\n', '\n').strip()
        path = os.path.join(REPO, 'docs', f'{mode}-notes.md')
        new = not os.path.exists(path)
        with open(path, 'a', encoding='utf-8', newline='\n') as f:
            if new:
                f.write(NOTES_HEADER.format(title=mode.capitalize(), mode=mode))
            f.write('\n```\n' + note.replace('```', "'''") + '\n```\n')
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.end_headers()
        self.wfile.write(b'saved')


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(NoCacheHandler, directory=REPO)
    print(f'Wizard Idle on http://localhost:{port} (no caching; Ctrl+C to stop)')
    http.server.ThreadingHTTPServer(('', port), handler).serve_forever()
