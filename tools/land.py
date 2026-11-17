"""Land a work branch on dev-repo by itself, so the author never merges by hand.

    python tools/land.py                  (land the current branch now)
    python tools/land.py <branch>         (from the main folder: land that branch)

One-time setup, in the main folder:  git config core.hooksPath tools/hooks

Runs after every commit through tools/hooks/post-commit (git config core.hooksPath tools/hooks).
When the commit is on a work branch (any branch but dev-repo, main and legacy/1.x) made in a
second working folder, it merges that branch into dev-repo in the main folder (fast-forward
when it can, a merge commit otherwise). Files that sit untracked in the main folder in the way
of the merge are removed first when they are the same bytes as the incoming ones; anything else
in the way, or a conflict, leaves dev-repo as it was and says so. Never pushes. Standard library only.
"""
import os, subprocess, sys

SKIP = ('dev-repo', 'main', 'legacy/1.x', 'HEAD')
TARGET = 'dev-repo'


# A hook runs with GIT_DIR and friends pointing at the working folder that committed; left in,
# every git call (even one run in the main folder) would ask that folder instead, and the main
# folder looked "not on dev-repo" after every commit.
CLEAN_ENV = {k: v for k, v in os.environ.items()
             if k not in ('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_PREFIX', 'GIT_COMMON_DIR')}


def git(*args, cwd=None, check=True):
    r = subprocess.run(['git', *args], cwd=cwd, capture_output=True, env=CLEAN_ENV)
    if check and r.returncode:
        raise RuntimeError(r.stderr.decode('utf-8', 'replace').strip() or f'git {args[0]} failed')
    return r


def out(*args, cwd=None):
    return git(*args, cwd=cwd).stdout.decode('utf-8', 'replace').strip()


def say(text):
    print(f'[land] {text}')


def main():
    here = out('rev-parse', '--show-toplevel')
    named = sys.argv[1] if len(sys.argv) > 1 else ''
    branch = named or out('rev-parse', '--abbrev-ref', 'HEAD')
    common = out('rev-parse', '--path-format=absolute', '--git-common-dir')
    home = os.path.dirname(common)                     # the main folder
    in_home = os.path.normcase(os.path.abspath(here)) == os.path.normcase(os.path.abspath(home))
    if branch in SKIP or (in_home and not named):
        return 0
    if out('rev-parse', '--abbrev-ref', 'HEAD', cwd=home) != TARGET:
        say(f'the main folder is not on {TARGET}; {branch} was not landed')
        return 0
    if git('merge-base', '--is-ancestor', branch, TARGET, check=False).returncode == 0:
        return 0                                        # already in

    # untracked copies in the main folder that would block the merge
    for path in out('diff', '--name-only', '--diff-filter=A', f'{TARGET}...{branch}').splitlines():
        local = os.path.join(home, path)
        if not path or not os.path.isfile(local):
            continue
        if git('ls-files', '--error-unmatch', path, cwd=home, check=False).returncode == 0:
            continue                                    # tracked: git handles it
        incoming = git('show', f'{branch}:{path}').stdout
        with open(local, 'rb') as f:
            same = f.read().replace(b'\r\n', b'\n') == incoming.replace(b'\r\n', b'\n')
        if not same:
            say(f'{path} sits untracked in the main folder and differs; {branch} was not landed')
            return 0
        os.remove(local)

    r = git('merge', '--no-edit', branch, cwd=home, check=False)
    if r.returncode:
        if os.path.exists(os.path.join(common, 'MERGE_HEAD')):
            git('merge', '--abort', cwd=home, check=False)
        reason = (r.stdout + r.stderr).decode('utf-8', 'replace').strip().splitlines()
        say(f'{branch} could not be landed on {TARGET} ({reason[-1] if reason else "merge failed"}); {TARGET} is unchanged')
        return 0
    say(f'{branch} landed on {TARGET}')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:                              # a hook must never fail the commit
        say(f'not landed: {e}')
        sys.exit(0)
