# Wizard Idle

*A divine perspective of a wizard journey.* An idle RPG in plain JavaScript: you don't control the wizard, you watch over them, and now and then you lend a divine hand.

Simple pure JavaScript project to learn more about this language. CAML

## Versions

| Version | Where to play | Code |
|---|---|---|
| **2.x** (in development) | [camayal.info/wizardidle](https://camayal.info/wizardidle/) | `main` (releases), `dev` (work in progress) |
| **1.0.0** (legacy) | [camayal.info/wizardidle/legacy](https://camayal.info/wizardidle/legacy/) | tag [`v1.0.0`](../../tree/v1.0.0), branch `legacy/1.x` |

**v1** was written by hand in 2018–2020, before AI coding assistants, while I was learning JavaScript. It is frozen exactly as it was and kept as a historical record.

**v2** keeps the same game, content and art, and reorganizes the code into modules, fixes old bugs, and finally adds features that were waiting for years. See [CHANGELOG.md](CHANGELOG.md) for the story so far and [docs/ROADMAP.md](docs/ROADMAP.md) for what's next.

## Run it locally

v2 uses ES modules, which browsers only load over HTTP (not by double-clicking `index.html`):

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Project layout

```
index.html          page and styles
src/main.js         entry point: wires buttons to the game
src/game.js         game logic
src/state.js        everything the game remembers, saved as plain JSON
src/config.js       game balance (XP curve, chances, starting skills)
src/utils.js        small pure helpers (random, formatting)
src/data/           enemies, zones, spells, achievements
img/  ogg/          art and sound
```

## Deployment

Every push to `main` deploys through GitHub Actions (`.github/workflows/deploy.yml`): `main` is published at the site root and the `v1.0.0` tag at `/legacy/`.
