"""Achievement odds: how likely is a player to ever earn each achievement, in a second.

Takes the runs of a playtest (docs/playtests/<...>/odds-data.json, written by tools/playtest.py:
for every simulated run its hours, when each achievement came and the counters), then plays
thousands of imaginary players on top of them:

  * each player copies one real run (a bot that plays the way the setting says), with its
    achievement times stretched a little (--jitter) so a dozen seeds do not look like a dozen points;
  * each player leaves the game at a random moment: --churn of them in the first hour, the rest
    with a steady chance of leaving (mean --mean-hours). A long achievement therefore gets
    harder: it only counts if the player is still there when it comes;
  * achievements the bots never earned but that are a counter (1000 books, 250 inns...) are
    projected from the bots' counter rates (COUNTERS below); the others are shown as
    "never seen" with the rule of three upper bound (3 / runs).

    python tools/odds.py docs/playtests/2026-11-18-odds-data
    python tools/odds.py <folder> --mean-hours 8 --churn 0.4 --mix idle:0.7,active:0.3

The leaving numbers are guesses until real players exist; change them as testing teaches.
Standard library only.
"""
import argparse, json, math, os, random, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# achievement -> (counter in the stats, how many). Used when the bots did not get there.
COUNTERS = {
    'logro_botines': ('loot.container.chest', 101),
    'logro_pots': ('loot.container.pot', 101),
    'logro_libros': ('study.found.book', 1000),
    'logro_runas': ('study.found.rune', 1000),
    'logro_tabernero': ('inn.rests', 250),
}

# share of players who earn it -> tier, from the top; below the last is the last tier.
TIER_SHARE = [(0.60, 'common'), (0.35, 'uncommon'), (0.18, 'rare'), (0.08, 'epic'),
              (0.03, 'legendary'), (0.01, 'mythic'), (0.002, 'ancient')]


def tier_for(p):
    for share, tier in TIER_SHARE:
        if p >= share:
            return tier
    return 'divine'


def read_file(*parts):
    with open(os.path.join(REPO, *parts), encoding='utf-8') as f:
        return f.read()


def game_achievements():
    """name -> title for the real, finished achievements (not the planned ones)."""
    text = read_file('src', 'data', 'achievements.js')
    out = {}
    for m in re.finditer(r'(logro_\w+):\s*\{(.*?)\}', text):
        if 'planned' not in m.group(2):
            t = re.search(r'title:"((?:[^"\\]|\\.)*)"', m.group(2))
            out[m.group(1)] = t.group(1) if t else m.group(1)
    return out


def current_tiers():
    text = read_file('src', 'data', 'rarity.js')
    return dict(re.findall(r'(logro_\w+):\s*"(\w+)"', text))


def parse_mix(text, settings):
    if not text:
        return {s: 1 / len(settings) for s in settings}
    mix = {k: float(v) for k, _, v in (p.partition(':') for p in text.split(','))}
    total = sum(mix.values())
    return {k: v / total for k, v in mix.items() if k in settings}


def times_for(run, name, max_hours):
    """Hours at which this run earned `name`, or None. Counters are projected if the run missed it."""
    if name in run['achievements']:
        return run['achievements'][name]
    if name in COUNTERS and run['hours']:
        stat, need = COUNTERS[name]
        rate = run['stats'].get(stat, 0) / run['hours']
        if rate > 0 and need / rate <= max_hours:
            return need / rate
    return None


def quit_hour(rng, churn, mean_hours):
    if rng.random() < churn:
        return rng.random()          # left within the first hour
    return 1 + rng.expovariate(1 / mean_hours)


def simulate(runs, mix, names, args):
    rng = random.Random(args.seed)
    by_setting = {s: [r for r in runs if r['setting'] == s] for s in mix}
    labels = list(mix)
    weights = [mix[s] for s in labels]
    got = {n: 0 for n in names}
    hours_of = {n: [] for n in names}
    stay = {h: 0 for h in (1, 5, 10, 25, 50)}
    for _ in range(args.players):
        run = rng.choice(by_setting[rng.choices(labels, weights)[0]])
        q = quit_hour(rng, args.churn, args.mean_hours)
        stretch = math.exp(rng.gauss(0, args.jitter))
        for h in stay:
            if q >= h:
                stay[h] += 1
        for n in names:
            t = times_for(run, n, args.max_hours)
            if t is not None and t * stretch <= q:
                got[n] += 1
                hours_of[n].append(t * stretch)
    return got, hours_of, stay


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('folder', help='a playtest folder holding odds-data.json')
    ap.add_argument('--players', type=int, default=100000)
    ap.add_argument('--churn', type=float, default=0.25, help='share of players who leave in the first hour')
    ap.add_argument('--mean-hours', type=float, default=15, help='mean hours before the others leave')
    ap.add_argument('--jitter', type=float, default=0.15, help='spread of the stretch of each time (log scale)')
    ap.add_argument('--mix', default='', help='share of each setting, e.g. idle:0.7,active:0.3 (default: even)')
    ap.add_argument('--max-hours', type=float, default=60, help='projected counters later than this never happen')
    ap.add_argument('--seed', type=int, default=1)
    args = ap.parse_args()

    path = args.folder if args.folder.endswith('.json') else os.path.join(args.folder, 'odds-data.json')
    with open(path, encoding='utf-8') as f:
        runs = json.load(f)
    settings = list(dict.fromkeys(r['setting'] for r in runs))
    mix = parse_mix(args.mix, settings)
    titles, tiers = game_achievements(), current_tiers()
    got, hours_of, stay = simulate(runs, mix, list(titles), args)
    n = args.players
    seen = {name: sum(1 for r in runs if times_for(r, name, args.max_hours) is not None) for name in titles}

    print(f'{len(runs)} runs ({", ".join(f"{s} {sum(1 for r in runs if r["setting"] == s)}" for s in settings)}), '
          f'{n} players, mix {", ".join(f"{s} {v:.0%}" for s, v in mix.items())}; '
          f'{args.churn:.0%} leave in hour 1, then mean {args.mean_hours:g} h')
    print('still playing after: ' + ', '.join(f'{h} h {100 * c / n:.0f}%' for h, c in stay.items()) + '\n')
    print(f'{"achievement":28} {"now":10} {"share":>7}  {"median h":>8}  {"tier by share":13} note')
    for name in sorted(titles, key=lambda k: -got[k]):
        p = got[name] / n
        med = sorted(hours_of[name])[len(hours_of[name]) // 2] if hours_of[name] else None
        note = ''
        if not seen[name]:
            note = f'never seen in {len(runs)} runs (bots); rare end, upper bound ~{300 / len(runs):.0f}%'
        elif name in COUNTERS and not any(name in r['achievements'] for r in runs):
            note = 'projected from the counter rate'
        tier = tier_for(p) if seen[name] else '?'
        flag = '' if tier == tiers.get(name, 'common') or tier == '?' else ' <-'
        print(f'{name:28} {tiers.get(name, "common"):10} {100 * p:6.1f}%  {med if med is None else round(med, 1)!s:>8}  {tier + flag:13} {note}')


if __name__ == '__main__':
    main()
