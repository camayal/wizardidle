"""Keeps the game's version as 2.<big changes>.<commits> in src/game.js.
2 is fixed; the second number is bumped by hand for each big change (list: docs/VERSIONS.md);
the third is the number of commits on dev-repo, counting the one being made.
Run by tools/hooks/pre-commit on dev-repo; `python tools/version.py bump` adds one big change."""
import re, subprocess, sys, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
game = root / 'src' / 'game.js'
text = game.read_text(encoding='utf-8')
m = re.search(r'const version = "2\.(\d+)\.(\d+)[^"]*"', text)
big = int(m.group(1)) + (1 if sys.argv[1:] == ['bump'] else 0)
count = int(subprocess.check_output(['git', 'rev-list', '--count', 'HEAD'], cwd=root).decode()) + 1
if sys.argv[1:] == ['bump']: count = int(m.group(2))
new = f'const version = "2.{big}.{count}"'
if m.group(0) != new:
    game.write_text(text[:m.start()] + new + text[m.end():], encoding='utf-8')
print(new)
