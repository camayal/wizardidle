"""Faith playtest: faith in prayers (one prayer = the average calculateFe, hpBase x rGold x 3) at several levels.

    python tools/faith_sim.py --name faith-base --seeds 6 --until 200 --setting idle:god=idle --setting active:god=active
Settings can override any config value: set=faith.reviveFe:5,hand.costFe:1
"""
import argparse, concurrent.futures, datetime, os, statistics, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import playtest as pt

LEVELS = [10, 25, 50, 100, 150, 190]

def at(r, lvl, key='faith'):
    for l in r.get('history', []):
        if l['lvl'] >= lvl:
            return l[key] / max(1, l.get('pray', 1))
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--name', required=True); ap.add_argument('--setting', action='append', required=True)
    ap.add_argument('--seeds', type=int, default=6); ap.add_argument('--until', type=int, default=200)
    ap.add_argument('--workers', type=int, default=4)
    a = ap.parse_args()
    server = pt.serve(); port = server.server_address[1]
    browser = next(b for b in pt.BROWSERS if os.path.exists(b))
    res = {}
    with concurrent.futures.ThreadPoolExecutor(a.workers) as ex:
        fs = {}
        for st in a.setting:
            label, _, q = st.partition(':')
            for sd in range(1, a.seeds + 1):
                fs[ex.submit(pt.run_one, browser, port, f'seed={sd}&until={a.until}&{q}', 900)] = (label, sd)
        for f in concurrent.futures.as_completed(fs):
            res[fs[f]] = f.result(); print(fs[f], res[fs[f]].get('error') or res[fs[f]]['level'], flush=True)
    server.shutdown()
    out = [f'# Faith playtest: {a.name} ({datetime.date.today()})', '', 'Faith in prayers (median over seeds, min-max) at the moment of each level.', '',
           '| setting | ' + ' | '.join(f'L{l}' for l in LEVELS) + ' | end faith | falls | god touches |', '|---|' + '---|' * (len(LEVELS) + 3)]
    for st in a.setting:
        label = st.partition(':')[0]
        rs = [r for (l, _), r in res.items() if l == label and not r.get('error')]
        cells = []
        for lv in LEVELS:
            v = [x for x in (at(r, lv) for r in rs) if x is not None]
            cells.append(f'{statistics.median(v):.0f} ({min(v):.0f}-{max(v):.0f})' if v else '-')
        end = [r['history'][-1]['faith'] / max(1, r['history'][-1]['pray']) for r in rs if r.get('history')]
        fl = [r['stats'].get('death.falls', 0) for r in rs]; tc = [r['stats'].get('god.touches', 0) for r in rs]
        out.append(f'| {label} | ' + ' | '.join(cells) + f' | {statistics.median(end):.0f} | {statistics.median(fl):.0f} | {statistics.median(tc):.0f} |')
    folder = os.path.join(pt.REPO, 'docs', 'playtests', f'{datetime.date.today()}-{a.name}')
    os.makedirs(folder, exist_ok=True)
    open(os.path.join(folder, 'summary.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
    print('\n'.join(out))

if __name__ == '__main__':
    main()
