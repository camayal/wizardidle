"""Playtest runner: play the real game in simulation mode, many times, and summarise.

Serves this repository on a local port, runs headless Edge (or Chrome) on
index.html?sim=1 for every setting x seed, collects each run's report and writes a
summary into docs/playtests/<date>-<name>/ (summary.md and runs.csv).

    python tools/playtest.py --name baseline --seeds 10 --until 200 \\
        --setting idle:god=idle --setting active:god=active

A setting is "label:query", where query is added to the simulation URL (see
src/dev/sim.js), e.g. "boss3:god=idle&set=pGetBoss:0.03". Standard library only.
"""
import argparse
import collections, concurrent.futures, csv, datetime, functools, html, http.server, json, os, re, shutil
import statistics, subprocess, sys, tempfile, threading

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BROWSERS = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium',
]
MILESTONES = [25, 50, 100, 150, 200]


def serve():
    handler = functools.partial(QuietHandler, directory=REPO)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def run_one(browser, port, query, timeout):
    profile = tempfile.mkdtemp(prefix='wizplay-')
    try:
        url = f'http://127.0.0.1:{port}/index.html?sim=1&{query}'
        out = subprocess.run([browser, '--headless=new', '--disable-gpu', '--no-first-run', '--mute-audio',
                              f'--user-data-dir={profile}', '--virtual-time-budget=60000', '--dump-dom', url],
                             capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=timeout)
        m = re.search(r'<pre id="simReport">(.*?)</pre>', out.stdout, re.S)
        return json.loads(html.unescape(m.group(1))) if m else {'error': 'no report', 'query': query}
    except subprocess.TimeoutExpired:
        return {'error': 'timeout', 'query': query}
    finally:
        shutil.rmtree(profile, ignore_errors=True)


def hours_at(report, level):
    for line in report.get('history', []):
        if line['lvl'] >= level:
            return line['playTimeMs'] / 3600000
    return None


def row(label, seed, r):
    s = r.get('stats', {})
    out = {'setting': label, 'seed': seed, 'error': r.get('error', ''), 'reason': r.get('reason', ''),
           'level': r.get('level'), 'hours': r.get('playTimeHours'), 'freezes': r.get('freezes'),
           'kills': s.get('kill.enemies', 0) + s.get('kill.rare', 0), 'bossKills': s.get('kill.bosses', 0),
           'falls': s.get('death.falls', 0), 'selfRevives': s.get('death.selfRevive', 0),
           'godTouches': s.get('god.touches', 0), 'godHeals': s.get('god.heals', 0),
           'faith': round(r.get('player', {}).get('faith', 0)), 'gold': round(r.get('player', {}).get('gold', 0))}
    for level in MILESTONES:
        h = hours_at(r, level)
        out[f'h{level}'] = round(h, 2) if h is not None else ''
    # belief (src/belief.js): the level he ends at, when he first turned Doubter / Atheist, how
    # often he came back to Believer, and the hours at each level (the current one up to the end)
    p = r.get('player', {})
    first = lambda level: (s.get(f'first.belief.{level}') or {}).get('lvl', '')
    out.update({'beliefEnd': round(p.get('belief', 0), 1), 'levelEnd': p.get('beliefLevel') or 'believer',
                'firstDoubter': first('doubter'), 'firstAtheist': first('atheist'),
                'backToBeliever': s.get('belief.reached.believer', 0)})
    total_ms = (r.get('playTimeHours') or 0) * 3600000
    for level in ('devout', 'believer', 'doubter', 'atheist'):
        ms = s.get(f'belief.time.{level}', 0) + (total_ms - p.get('beliefSince', 0) if out['levelEnd'] == level else 0)
        out[f'h_{level}'] = round(ms / 3600000, 2)
    return out


def num(v):
    # short numbers for the tables: 0.45, 12.3, 456, 12k, 3.4M
    a = abs(v)
    if a >= 1e6: return f'{v / 1e6:.1f}M'
    if a >= 1e4: return f'{v / 1e3:.0f}k'
    if a >= 100: return f'{v:.0f}'
    return f'{v:.3g}'


def summarise(rows, columns):
    lines = ['| setting | runs | ' + ' | '.join(columns) + ' |', '|---|---|' + '---|' * len(columns)]
    for label in dict.fromkeys(r['setting'] for r in rows):
        mine = [r for r in rows if r['setting'] == label and not r['error']]
        cells = []
        for c in columns:
            values = [r[c] for r in mine if isinstance(r[c], (int, float))]
            cells.append(f'{num(statistics.median(values))} ({num(min(values))}–{num(max(values))})' if values else '–')
        lines.append(f'| {label} | {len(mine)} | ' + ' | '.join(cells) + ' |')
    return '\n'.join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--name', required=True, help='short name of the question, used for the folder')
    ap.add_argument('--setting', action='append', required=True, help='label:query, repeatable')
    ap.add_argument('--seeds', type=int, default=10)
    ap.add_argument('--until', type=int, default=200)
    ap.add_argument('--workers', type=int, default=4, help='browsers at once')
    ap.add_argument('--timeout', type=int, default=600, help='seconds per run')
    ap.add_argument('--browser', default=next((b for b in BROWSERS if os.path.exists(b)), None))
    ap.add_argument('--note', default='', help='a line saying what the playtest is for')
    args = ap.parse_args()
    if not args.browser:
        sys.exit('no Edge or Chrome found; pass --browser')

    server = serve()
    port = server.server_address[1]
    jobs = []
    for setting in args.setting:
        label, _, query = setting.partition(':')
        for seed in range(1, args.seeds + 1):
            jobs.append((label, seed, f'seed={seed}&until={args.until}&{query}'))
    print(f'{len(jobs)} runs on port {port}, {args.workers} at once')
    rows, reports = [], {}
    with concurrent.futures.ThreadPoolExecutor(args.workers) as pool:
        futures = {pool.submit(run_one, args.browser, port, q, args.timeout): (label, seed) for label, seed, q in jobs}
        for f in concurrent.futures.as_completed(futures):
            label, seed = futures[f]
            r = f.result()
            rows.append(row(label, seed, r))
            reports[(label, seed)] = r
            print(f'  {label} seed {seed}: ' + (r.get('error') or f"level {r['level']} in {r['playTimeHours']} h"))
    server.shutdown()
    order = {s.partition(':')[0]: i for i, s in enumerate(args.setting)}
    rows.sort(key=lambda r: (order[r['setting']], r['seed']))

    folder = os.path.join(REPO, 'docs', 'playtests', f'{datetime.date.today()}-{args.name}')
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, 'runs.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    pace = summarise(rows, ['hours'] + [f'h{m}' for m in MILESTONES])
    outcome = summarise(rows, ['kills', 'bossKills', 'falls', 'selfRevives', 'godTouches', 'godHeals', 'freezes', 'faith', 'gold'])
    belief = summarise(rows, ['beliefEnd', 'firstDoubter', 'firstAtheist', 'backToBeliever', 'h_devout', 'h_believer', 'h_doubter', 'h_atheist'])
    ends = {label: ', '.join(f'{k} {v}' for k, v in sorted(collections.Counter(r['levelEnd'] for r in rows if r['setting'] == label).items()))
            for label in dict.fromkeys(r['setting'] for r in rows)}
    with open(os.path.join(folder, 'summary.md'), 'w', encoding='utf-8') as f:
        f.write(f'# Playtest: {args.name} ({datetime.date.today()})\n\n')
        if args.note:
            f.write(args.note + '\n\n')
        f.write(f'{args.seeds} seeds per setting (1–{args.seeds}), to level {args.until}, '
                f'with `tools/playtest.py` (simulation mode, `src/dev/sim.js`).\n\n')
        f.write('Settings:\n\n' + '\n'.join(f'- **{s.partition(":")[0]}**: `{s.partition(":")[2] or "(defaults)"}`' for s in args.setting) + '\n\n')
        f.write('Each cell: median (min–max) over the seeds. Hours are play time in the game.\n\n')
        f.write('## Pace: hours played to reach each level\n\n' + pace + '\n\n')
        f.write('## What happened on the way\n\n' + outcome + '\n\n')
        f.write('## Belief\n\n' + belief + '\n\n')
        f.write('Level at the end: ' + '; '.join(f'**{k}**: {v}' for k, v in ends.items()) + '. '
                '*firstDoubter* / *firstAtheist*: the wizard\'s level when he first became one (empty: never); '
                '*backToBeliever*: times he climbed back to Believer; *h_*: hours of play at each level.\n\n')
        f.write('*kills* include rare enemies; *freezes* are the v1 guardian freeze above level 190 '
                '(the game would stop until a reload; the simulation goes on). Every run is in `runs.csv`.\n')
    errors = [r for r in rows if r['error']]
    print(f'written {os.path.relpath(folder, REPO)}' + (f' ({len(errors)} runs failed)' if errors else ''))


if __name__ == '__main__':
    main()
