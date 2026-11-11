# Extracted layers

Every layer of the author's Paint.NET (`.pdn`) source files, saved as transparent PNGs so they can be retouched, recombined and used to build scenes dynamically. Extracted on 2026-11-10 from `docs/old_ideas/unorganzed_sprites/Sprites/` (51 files, 901 images).

Re-run or extract new files with:

```
python tools/pdn_extract.py <file.pdn | folder> docs/old_ideas/layers
```

It uses only the Python standard library. See the docstring in `tools/pdn_extract.py` for how the format is read.

## What's in each folder

One folder per `.pdn`, named after it:

- `NN_<layer name>.png`: one layer each, `00` at the bottom. Hidden layers are extracted too.
- `layers.json`: per layer, its name, `visible`, `opacity` (0–255), `blend` mode, `background` flag and `drawn` (share of pixels used).
- `composite.png`: the layers that were visible when the file was last saved, stacked. It shows what that file looked like on screen.

## Checked against the game

Each scene's `composite.png` was compared with the game's backgrounds in `img/`. **26 of the 34 scene files match a game background pixel for pixel**, so the extraction is exact and the legacy scenes can be rebuilt from layers.

| Source file | Matches |
|---|---|
| `la Ciudad` | `la_ciudad_altar.png` (and `la_ciudad1–5` are other layer combinations of the same file) |
| `pradera y bosque` / `- copia` | `la_pradera_estatua.png` / `la_pradera1.png` |
| `curanderobg` | `la_ciudad_taberna.png` |
| `el Pantano` / `- copia` | `el_pantano_estatua.png` / `el_pantano_altar.png` |
| `el Poblado` (both) | `el_poblado_altar.png` |
| `el Heidan - copia` | `el_heidan_altar.png` (the original: 98.5% vs `el_heidan_estatua.png`) |
| `la Gruta` / `- copia` | `la_gruta5.png` / `la_gruta_estatua.png` |
| `la Gruta_altar` (both) | `la_gruta_altar.png` |
| `la Gruta y la Mina` (both) | `la_mina5.png` |
| `la Mina_altar` / `- copia` | `la_mina_altar.png` / `la_mina_estatua.png` |
| `la Tundra` / `- copia` | `la_tundra_estatua.png` / `la_tundra5.png` |
| `las Dunas` | `las_dunas_estatua.png` (the copy: 91% vs `el_desierto_taberna.png`) |
| `la Pradera3` | `la_pradera3.png` |
| `la Torre5` | `la_torre_estatua.png` |
| `el Castillo`, `el Castillo - copia` | `la_torre_altar.png` |
| `el Castillo fondo reconstruido` | `el_castillo_estatua.png` |
| `la Ciudad - copia` | 99.8% vs `la_ciudad_estatua.png` |
| `el Volcan` (both) | ~94% vs `el_volcan_altar.png` / `el_volcan_estatua.png` |
| `el Duenon` (both) | no match: saved with most layers hidden |
| `la Mina` (both), `bkgtemplate` | no match: a base or template rather than a finished scene |

Most scene files hide many layers: the City hides 13 of 18, the Duenon 34 of 41, Plain + Forest 31 of 42. The numbered versions of each place (`…1` to `…5`, `_altar`, `_estatua`) were made by switching layers on and off in one file, which is the basis for generating scenes dynamically.

## Other files

- **Maps:** `mapa` (32 layers, one per zone: Pradera, Bosque, Desierto, Pantano, Gruta, Tundra, Volcán, Duenon…), `mapa_conaltares` (map with altars), `guias` and `guias y otros mapas` (guides: circles, dots, numbers), `mapas numeros actuliazados julio 2018` (487×768 numbered map). Useful for the map revamp and fog.
- **UI:** `Btn` (button template), `Empty`, `console`, `regilla` (a grid), `tile000`.
- **Sprites:** `comerciante` (merchant), `bossCoronas` (boss crowns), `ank` / `miniank` (ankh), `Logros` (achievement icons).
- **Store art:** `ForGooglePlay`.
