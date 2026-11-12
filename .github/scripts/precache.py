"""Write the offline file list for the service worker, and stamp the worker with a version.

Run by the deploy workflow on the assembled site folder:
    python3 .github/scripts/precache.py _site <version>

- _site/precache.json: every file the game may need offline (the legacy copy, docs and
  text files are left out).
- _site/service-worker.js: VERSION = 'dev' becomes VERSION = '<version>', so every deploy
  installs a fresh worker with its own cache.
"""
import json, os, sys

site, version = sys.argv[1], sys.argv[2]
SKIP_DIRS = {'legacy', 'docs', '.github', '.git'}
SKIP_FILES = {'precache.json', 'service-worker.js', 'LICENSE', 'browserconfig.xml'}

files = ['./']
for root, dirs, names in os.walk(site):
    rel_root = os.path.relpath(root, site)
    dirs[:] = sorted(d for d in dirs if not (rel_root == '.' and d in SKIP_DIRS))
    for name in sorted(names):
        if name in SKIP_FILES or name.endswith('.md') or name.startswith('.'):
            continue
        path = os.path.normpath(os.path.join(rel_root, name)).replace(os.sep, '/')
        files.append(path)

with open(os.path.join(site, 'precache.json'), 'w', encoding='utf-8') as f:
    json.dump({'version': version, 'files': files}, f, separators=(',', ':'))

sw_path = os.path.join(site, 'service-worker.js')
sw = open(sw_path, encoding='utf-8').read()
assert sw.count("const VERSION = 'dev';") == 1, 'VERSION placeholder not found in service-worker.js'
open(sw_path, 'w', encoding='utf-8').write(sw.replace("const VERSION = 'dev';", f"const VERSION = '{version}';"))
print(f'precache.json: {len(files)} files, version {version}')
