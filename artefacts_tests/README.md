# Artefacts tests

Review pages built from the project's plans, used to read and judge them outside the game.

## Story Scrolls

A page that shows every chapter scroll of [docs/STORY.md](../docs/STORY.md) at the game's scroll width. You can switch the wizard's belief level, the place he is in and the echo game, and leave a verdict (keep / tweak / rewrite) and a note on each scroll. Notes can be sent for review or erased (one at a time or all at once).

| File | What it is |
|---|---|
| `story-scrolls.template.html` | The page, with `__DATA__` and `__META__` where the script goes |
| `build_story_scrolls.py` | Reads `docs/STORY.md` and writes the two files below |
| `story-scrolls.html` | The built page, with the current script inside |
| `story-data.json` | The same script as one record (version, date, data) for the page's live store |

**After every change to `docs/STORY.md`:** run `python artefacts_tests/build_story_scrolls.py` from the repository root, then load `story-data.json` into the page's store (`story/current`). The published page switches to the new version by itself and shows its commit and date at the top. Republish the page only when the template itself changes.
