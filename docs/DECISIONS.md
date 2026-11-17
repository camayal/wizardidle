# Decisions

Settled choices and why, oldest first. Add new rows at the end; nobody needs to read this in normal work.

| Date | Decision | Why |
|---|---|---|
| 2026-11-10 | One repo; v1 frozen as tag `v1.0.0` + branch `legacy/1.x` | Keeps history connected (`git diff v1.0.0 main` shows how far v2 has come) |
| 2026-11-10 | GitHub Actions deploys `main` at the root and `v1.0.0` at `/legacy/` | `main` stays clean, legacy can never drift from the tag |
| 2026-11-10 | v2 work on `dev`, merge to `main` when playable | `main` deploys straight to the live site |
| 2026-11-10 | ES modules, no build step | Plain JS, same spirit as v1, deploys as static files |
| 2026-11-10 | Plain-JSON save under one prefixed key, no obfuscation | Obfuscation protected nothing (the decoder is public, the dev console edits values) and made debugging hard |
| 2026-11-10 | No v1 save import | The game was never distributed |
| 2026-11-10 | Phase 1 preserves v1 behavior exactly; bugs are logged, not fixed | A refactor and a behavior change mixed together are impossible to verify |
| 2026-11-10 | Commits: real subject + body explaining what and why, no attribution trailers | |
| 2026-11-10 | Balance constants live in `src/config.js`, not in the save | Rebalancing used to require wiping saves; now an edit applies to every wizard |
| 2026-11-10 | Trainable skills = `config.baseStats` + this wizard's `statBonus` | Statues, runes and books keep raising skills per wizard while the base stays tunable |
| 2026-11-10 | Two saves: `wizardidle2:save` (the wizard) and `wizardidle2:world` (cemetery, device id) | Killing a wizard deletes only the first; the world, and its cemetery, outlives every wizard |
| 2026-11-10 | Kill never calls `localStorage.clear()` | It wiped every game on the domain, including the legacy copy |
| 2026-11-10 | v1 dev console (`exe()`) disabled, kept as commented code for the record | It ran typed text with `eval()`; hacky for its time. Safe to delete later |
| 2026-11-10 | Shared runtime variables live in `fight`, `run` and `ui` (`src/runtime.js`), never saved | Modules can't reassign each other's variables; a fight still doesn't survive a reload, as in v1 |
| 2026-11-10 | One game loop with named clocks (`src/loop.js`) instead of `setInterval` handles | v1 leaked master clocks that could never be stopped; a named clock exists at most once |
| 2026-11-10 | One module per system; startup values stay together in `game.js`, other modules only define things at load | Keeps load order identical to v1 and makes circular imports safe |
| 2026-11-10 | The old notes and the extraction tool live outside the repo, in `wizardidle-old-ideas/` next to it | Working material, not part of the game; never committed or published |
| 2026-11-10 | No link to `/legacy/` from the game or the README | The legacy copy is for the author and the historical record |
| 2026-11-10 | Unfinished achievements ship hidden (`planned:true`) and don't count towards completion | Design them later; until then 100% is reachable |
| 2026-11-10 | Past level 200 the wizard keeps the 21 existing spell tiers | Fixes the level-210 crash with no new content |
| 2026-11-10 | Offline mode: network first for code, stored copy first for art and sound, new cache per release | Online players always get the newest version; offline still plays; old versions don't linger |
| 2026-11-11 | Route after 2.0.0: 1 clean up the code, 2 modern and faster, 3 the story, 4 new features | The author's order: a clean, fast base before adding content |
| 2026-11-11 | CHANGELOG is a flat list of short bullets per version, no narrative or subtitles | The author's preference for readability |
| 2026-11-11 | Professions: one trade per wizard, a second at chapter III; the wizard asks the god for guidance (the god chooses only with faith above 0) | The old help's "one of three", with the god as guide rather than master. All 11 decisions in [docs/PROFESSIONS.md](PROFESSIONS.md) |
| 2026-11-12 | Stats: one `src/stats.js` (counters, totals, records, firsts; per wizard and per world); all counters renamed, no save migration in the dev phase; playtest tools in the repo, 10 seeds to lvl 200 per setting | Professions and faith need numbers, and no balance number is set without a playtest. Details in [docs/STATS.md](STATS.md) |
| 2026-11-12 | Faith: four belief levels, both ways until chapter X; the god's revive stays free and gives faith; other rescuers instead of the self-revive; offerings and all numbers decided only by playtests | The author's choices; details in [docs/FAITH.md](FAITH.md) |
| 2026-11-12 | Route after 2.1.0: stats and playtest tools, then the story with the faith rebalance, then professions, then the rest | The story depends on faith and professions; no balance number without a playtest |
| 2026-11-12 | After an erasure, the souls of erased wizards fight beside the next wizard in the final battle (one per erasure, max 5; wizard → souls → god); no faith change | The god's wins bring his own end closer; details in [docs/ERASURE.md](ERASURE.md) |
| 2026-11-12 | The .md docs (journal, roadmap, changelog, plans) stay published on the site | The repository is public anyway |
| 2026-11-12 | Sprites stay as separate image files; only animations are sheets (like the spell strips), for now | Editing art in sheets would slow down every art change; measured: sheets would only speed up the first download and updates (679 sprites: ~4 s as files vs ~0.2 s as sheets), not play |
| 2026-11-12 | A dev test bar replaces the old dev console: scenarios, quick actions and a command line, on while developing (`DEV` in config.js), switched off by the deploy | The author wants to test specific criteria quickly; players never load it |
| 2026-11-14 | Art and sounds in folders by kind and creature (`img/...`, `ogg/` renamed `snd/`), found by name through `src/media.js` (art(), snd()) | One folder held 1,412 images; the author wanted it organized. Rules by name keep the code using plain names, and a new file only has to follow the naming |
| 2026-11-14 | Dev tools move beside the game (light panels in the empty sides of a PC screen), with menus; sounds and art are tried in the game in generic modes (any scene, any file), and an author notes box fills in the details for the author to copy to the musician or the artist | The separate sound test page cost too many tokens; the author sets the scenes alone and pastes one note, so no session has to keep listening |
| 2026-11-17 | ideas.md is a short index; idea text lives in its plan or in `docs/ideas/<topic>.md`; decisions here; the notes inboxes are one per role | Every session read ~300 lines of ideas.md; now it reads the index and only the topic it works on |
| 2026-11-12 | Story script revised: the scroll speaks to you (the god), a prophecy of the Omni behind the exile, the hooded healer is your mask, one staff made by the dead, falls instead of deaths, two endings (you unmake him and rewind time, or he becomes the Omni) | Decided one question at a time; full list and the text in [docs/STORY.md](STORY.md) |
| 2026-11-17 | Branches: only `main` (live), `dev` (work) and the frozen `legacy/1.x`; a temporary branch only for an important feature or risky changes to old code, deleted once merged. Roles work on `dev` as subagents; plans and art no longer get their own branches | Role and plan branches piled up and had to be merged back by hand |
