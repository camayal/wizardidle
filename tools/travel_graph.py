"""Travel graph generator (docs/TRAVEL.md).

Reads the ground map image and the stage coordinates of src/data/zones.js, builds a graph
(a node per distinct scene spot plus waypoints), prices every edge by the terrain under it and
writes src/data/travelGraph.js (generated: never edit by hand). The game does its own Dijkstra
over it (src/travelGraph.js); with about 100 nodes that is instant.

    python tools/travel_graph.py            write the graph and print the check
    python tools/travel_graph.py --compare  also list the differences with the hand-typed strings
    python tools/travel_graph.py --paths la_Ciudad1 out.png   draw the cheapest paths from a scene
                                            (green: a move, yellow: a destination, red: too far)

Terrain numbers live in src/config.js (config.travel). Needs Pillow.
"""
import datetime, heapq, json, math, os, re, sys
from PIL import Image, ImageDraw, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZE = 250
LAYERS = {'ground': 'mapa', 'under': 'mapaunderground', 'above': 'mapaboveground'}
UNDER_ZONES = {'la_Mina', 'la_Cueva', 'el_Volcan'}
ABOVE_ZONES = {'el_Heidan'}

# Waypoints (map pixels of the 250 px maps). Bridges cancel the river price near them.
# name, kind, x, y: Prairie spring, Swamp and south road bridges, the fisher's pier. The names are the ones the dev
# tools (Modes > Travel) use; a name moved there is read from src/data/travelOverrides.js (travelPositions).
WAYPOINTS = [('bridge_spring', 'bridge', 125, 145), ('bridge_swamp', 'bridge', 181, 50),
             ('bridge_south', 'bridge', 166, 162), ('pier', 'pier', 150, 168)]
BRIDGES = [(x, y) for _, kind, x, y in WAYPOINTS if kind == 'bridge']
BRIDGE_RADIUS = 7
# Cave and mine mouths: the same spot on the ground map and on the underground map.
# mouth_<outside zone>_<inside zone>: where it comes from and where it goes
ENTRANCES = [('mouth_pantano_cueva', 147, 31), ('mouth_pradera_cueva', 27, 114), ('mouth_duenon_cueva', 87, 224), ('mouth_playa-pradera_mina', 229, 64),
             ('mouth_dunas_mina', 33, 165), ('mouth_desierto_mina', 218, 182), ('mouth_tundra_volcan', 130, 120),
             ('mouth_gruta_cueva', 100, 181), ('mouth_dunas-pradera_gruta', 64, 170)]
STAIRS = (212, 205)                                      # the sacred stairs, ground -> Heidan (a guess, to confirm)


def read_config():
    s = open(os.path.join(REPO, 'src/config.js'), encoding='utf-8').read()
    block = re.search(r'travel:\s*\{(.*?)\n    \}', s, re.S).group(1)
    return {k: float(v) for k, v in re.findall(r'(\w+):\s*([\d.]+),', block)}


def read_places():
    s = open(os.path.join(REPO, 'src/data/zones.js'), encoding='utf-8').read()
    out = {}
    for m in re.finditer(r'(\w+): \{zone:"(\w+)",x:([\d.]+),y:([\d.]+),moves:"([^"]*)",destinations:"([^"]*)"\}', s):
        name, zone, x, y, moves, dest = m.groups()
        out[name] = dict(zone=zone, x=round(float(x) * SIZE), y=round(float(y) * SIZE),
                         moves=[v for v in moves.split(',') if v], dest=[v for v in dest.split(',') if v])
    return out


def layer_of(zone):
    return 'under' if zone in UNDER_ZONES else 'above' if zone in ABOVE_ZONES else 'ground'


def terrain_map(layer):
    """'land', 'river', 'sea' per pixel (ground map); the other two maps are walked as plain land for now."""
    if layer != 'ground':
        return [['land'] * SIZE for _ in range(SIZE)]
    im = Image.open(os.path.join(REPO, 'img/ui', LAYERS[layer] + '.png')).convert('RGBA')
    water = Image.new('L', im.size, 0)
    px, wp = im.load(), water.load()
    for y in range(SIZE):
        for x in range(SIZE):
            r, g, b, a = px[x, y]
            if a < 10 or (b > r + 40 and b > g + 10):
                wp[x, y] = 255
    core = water.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))   # opening: what is wide is sea
    cp = core.load()
    return [['sea' if cp[x, y] else 'river' if wp[x, y] else 'land' for x in range(SIZE)] for y in range(SIZE)]


def edge_cost(t, a, b, cfg):
    (x0, y0), (x1, y1) = a, b
    length = math.hypot(x1 - x0, y1 - y0)
    n = max(1, int(length))
    step = length / n
    cost, in_river = 0.0, False
    for i in range(n):
        x = min(SIZE - 1, max(0, round(x0 + (x1 - x0) * (i + .5) / n)))
        y = min(SIZE - 1, max(0, round(y0 + (y1 - y0) * (i + .5) / n)))
        k = t[y][x]
        if k == 'river' and any(math.hypot(x - bx, y - by) <= BRIDGE_RADIUS for bx, by in BRIDGES):
            k = 'land'
        if k == 'river':
            if not in_river:
                cost += cfg['riverCost']
            in_river = True
            cost += step * cfg['landCost']
            continue
        in_river = False
        cost += step * (cfg['seaCost'] if k == 'sea' else cfg['landCost'])
    return round(cost, 1)


def snap(t, x, y):
    """Nearest non-sea pixel (a spot in the sea)."""
    if t[y][x] != 'sea':
        return x, y
    best = None
    for yy in range(SIZE):
        for xx in range(SIZE):
            if t[yy][xx] != 'sea':
                d = (xx - x) ** 2 + (yy - y) ** 2
                if best is None or d < best[0]:
                    best = (d, xx, yy)
    return best[1], best[2]


def read_positions():
    """Waypoints moved in the dev tools: {name: [x, y]} (a mouth moves with its underground twin)."""
    try:
        s = open(os.path.join(REPO, 'src/data/travelOverrides.js'), encoding='utf-8').read()
        return json.loads(re.search(r'travelPositions = (\{.*?\});', s, re.S).group(1))
    except (OSError, AttributeError, ValueError):
        return {}


def read_points():
    """Points added in the dev tools: {name: {kind: future|connector, layer, x, y}}."""
    try:
        s = open(os.path.join(REPO, 'src/data/travelOverrides.js'), encoding='utf-8').read()
        return json.loads(re.search(r'travelPoints = (\{.*?\});', s, re.S).group(1))
    except (OSError, AttributeError, ValueError):
        return {}


def build():
    global BRIDGES
    cfg, places, moved = read_config(), read_places(), read_positions()
    at = lambda name, x, y: tuple(moved.get(name, (x, y)))
    waypoints = [(n, k) + at(n, x, y) for n, k, x, y in WAYPOINTS]
    BRIDGES = [(x, y) for _, k, x, y in waypoints if k == 'bridge']
    mouths = [(n,) + at(n, x, y) for n, x, y in ENTRANCES]
    stairs = at('stairs', *STAIRS)
    terr = {l: terrain_map(l) for l in LAYERS}
    nodes, index, warns = [], {}, []

    def node(layer, x, y, kind='scene', name=''):
        key = (layer, x, y)
        if key not in index:
            index[key] = len(nodes)
            nodes.append(dict(layer=layer, x=x, y=y, kind=kind, name=name))
        return index[key]

    anchors = {}
    for name, p in places.items():
        layer = layer_of(p['zone'])
        x, y = p['x'], p['y']
        sx, sy = snap(terr[layer], x, y)
        if (sx, sy) != (x, y):
            warns.append(f'{name} stands in the sea at {x},{y}: moved to the shore {sx},{sy}')
        anchors[name] = node(layer, sx, sy)
    for name, kind, x, y in waypoints:
        node('ground', x, y, kind, name)
    for name, d in read_points().items():
        if d.get('layer') in LAYERS:
            old = [n for n in nodes if n['name'] == name]
            if old:                         # a bridge, the pier or the stairs switched to another type in the dev tools
                old[0]['kind'] = d.get('kind', 'connector')
            else:
                node(d['layer'], int(d['x']), int(d['y']), d.get('kind', 'connector'), name)
    for name, x, y in mouths:
        node('ground', x, y, 'mouth', name)
        node('under', x, y, 'mouth', name + '_under')
    node('ground', *stairs, 'stairs', 'stairs')
    node('above', *stairs, 'stairs', 'stairs_above')

    edges = {}
    if cfg.get('manualLinksOnly'):          # the links are all set by hand in the dev tools (Modes > Travel)
        return cfg, places, nodes, edges, anchors, warns
    for layer in LAYERS:
        ids = [i for i, n in enumerate(nodes) if n['layer'] == layer]
        for a in ids:
            def dist(b):
                return math.hypot(nodes[a]['x'] - nodes[b]['x'], nodes[a]['y'] - nodes[b]['y'])
            near = sorted((b for b in ids if b != a), key=dist)
            for k, b in enumerate(near):
                if dist(b) <= cfg['searchDistance'] or k < 3:    # always the three nearest: never disconnected
                    key = (min(a, b), max(a, b))
                    if key not in edges:
                        edges[key] = edge_cost(terr[layer], (nodes[a]['x'], nodes[a]['y']), (nodes[b]['x'], nodes[b]['y']), cfg)
    for _, x, y in mouths:
        a, b = index[('ground', x, y)], index[('under', x, y)]
        edges[(min(a, b), max(a, b))] = cfg['entranceCost']
    a, b = index[('ground', *stairs)], index[('above', *stairs)]
    edges[(min(a, b), max(a, b))] = cfg['stairsCost']
    return cfg, places, nodes, edges, anchors, warns


def dijkstra(edges, src):
    adj = {}
    for (a, b), c in edges.items():
        adj.setdefault(a, []).append((b, c))
        adj.setdefault(b, []).append((a, c))
    dist, prev, heap = {src: 0.0}, {}, [(0.0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, 1e18):
            continue
        for v, c in adj.get(u, []):
            if d + c < dist.get(v, 1e18):
                dist[v], prev[v] = d + c, u
                heapq.heappush(heap, (d + c, v))
    return dist, prev


def derived(cfg, places, edges, anchors, name):
    """What the game adapter does (src/travelGraph.js): under the limit; if nothing is, the nearest few."""
    dist, _ = dijkstra(edges, anchors[name])
    z = places[name]['zone']
    far = lambda n: dist.get(anchors[n], 1e18)
    other = sorted((n for n, p in places.items() if p['zone'] != z), key=far)
    same = sorted((n for n, p in places.items() if p['zone'] == z and n != name), key=far)
    dest = [n for n in other if far(n) <= cfg['destinationLimit']] or other[:3]
    mov = [n for n in same if far(n) <= cfg['moveLimit']] or same[:2]
    return sorted(dest), sorted(mov)


def write(nodes, edges, anchors):
    data = dict(nodes=[[n['layer'], n['x'], n['y'], n['kind'], n['name']] for n in nodes],
                edges=[[a, b, c] for (a, b), c in sorted(edges.items())], anchors=anchors)
    out = ['// Wizard Idle - the travel graph. GENERATED by tools/travel_graph.py from the maps and zones.js: do not edit.',
           '// nodes: [layer, x, y, kind, name of a waypoint]; edges: [a, b, cost]; anchors: stage name -> node. See docs/TRAVEL.md.',
           'export const travelGraph = ' + json.dumps(data, separators=(',', ':')) + ';',
           'export const travelGraphBuilt = ' + json.dumps(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')) + ';', '']
    open(os.path.join(REPO, 'src/data/travelGraph.js'), 'w', encoding='utf-8').write('\n'.join(out))


def check(cfg, places, nodes, edges, anchors, warns, compare):
    print(f'{len(nodes)} nodes, {len(edges)} edges')
    for w in warns:
        print('SEA   ', w)
    for n, p in places.items():
        for d in p['dest']:
            if d in places and n not in places[d]['dest']:
                print('ONEWAY', f'{n} -> {d} has no way back (old strings)')
    for n in places:
        dist, _ = dijkstra(edges, anchors[n])
        near = min((dist.get(anchors[m], 1e18) for m, p in places.items() if p['zone'] != places[n]['zone']), default=1e18)
        if near > cfg['destinationLimit']:
            print('LONELY', f'{n}: nearest other zone costs {near:.0f}, over the limit {cfg["destinationLimit"]} (the adapter takes the nearest three)')
    for z in sorted({p['zone'] for p in places.values()}):
        reach = set()
        for n, p in places.items():
            if p['zone'] == z:
                reach |= {places[d]['zone'] for d in derived(cfg, places, edges, anchors, n)[0]}
        old = {places[d]['zone'] for n, p in places.items() if p['zone'] == z for d in p['dest'] if d in places}
        print('ZONE  ', z, 'derived ->', sorted(reach), '| only old:', sorted(old - reach))
    if compare:
        tot_old = tot_new = same = 0
        for n, p in sorted(places.items()):
            dest, mov = derived(cfg, places, edges, anchors, n)
            o, d = set(p['dest']), set(dest)
            tot_old += len(o)
            tot_new += len(d)
            same += len(o & d)
            om, dm = set(p['moves']), set(mov)
            print(f'{n}: dest +{sorted(d - o)} -{sorted(o - d)} | moves +{sorted(dm - om)} -{sorted(om - dm)}')
        print(f'destinations: old {tot_old}, derived {tot_new}, shared {same}')


def draw(cfg, nodes, edges, anchors, name, out):
    dist, prev = dijkstra(edges, anchors[name])
    layer = nodes[anchors[name]]['layer']
    im = Image.open(os.path.join(REPO, 'img/ui', LAYERS[layer] + '.png')).convert('RGB').resize((750, 750), Image.NEAREST)
    d = ImageDraw.Draw(im)
    for v, u in prev.items():
        if nodes[v]['layer'] == layer and nodes[u]['layer'] == layer:
            c = dist[v]
            col = (0, 255, 0) if c <= cfg['moveLimit'] else (255, 255, 0) if c <= cfg['destinationLimit'] else (255, 0, 0)
            d.line([nodes[u]['x'] * 3, nodes[u]['y'] * 3, nodes[v]['x'] * 3, nodes[v]['y'] * 3], fill=col, width=2)
    im.save(out)


if __name__ == '__main__':
    args = sys.argv[1:]
    cfg, places, nodes, edges, anchors, warns = build()
    write(nodes, edges, anchors)
    check(cfg, places, nodes, edges, anchors, warns, '--compare' in args)
    if '--paths' in args:
        i = args.index('--paths')
        draw(cfg, nodes, edges, anchors, args[i + 1], args[i + 2])
