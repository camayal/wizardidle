# Version numbers

`2.<big>.<commit>` — shown at the bottom of Settings (src/game.js, kept by tools/version.py).

- **2**: the game's generation (v1 was the 2020 version). Never changes.
- **big**: one per big change, counted in retrospect on 2026-11-25 (19). Add a line below and run `python tools/version.py bump` when a new one lands.
- **commit**: commits on dev-repo, updated by the pre-commit hook.

Big changes counted: 1 time away (sleeping tabs, poems); 2 one world one tab (dimensions, paradox); 3 faith scroll and belief window; 4 achievements (rarity, seals, cemetery); 5 stats inventory page; 6 multi-page scroll ribbons; 7 bosses' and enemies' own sounds; 8 richer synth music and Music mode; 9 three-layer maps (aboveground, ground, underground); 10 the Beach zone; 11 Water school and beach bosses; 12 connector scenes (bridges, stairs, mouths, pier); 13 travel graph and Travel mode; 14 Dunes underground inn; 15 Tundra spectra; 16 desert tent and dice houses; 17 quests (queue, givers, board, posts, guild, trophies); 18 secret quests and Medusa's shield; 19 Settings scroll, text scaling and long phone screens. The releases 2.0.0 to 2.2.0 came before and are not in this count.
