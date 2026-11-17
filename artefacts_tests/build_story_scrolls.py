"""Build the Story Scrolls review page from docs/STORY.md.

Run from the repository root:
    python artefacts_tests/build_story_scrolls.py

Writes, next to this script:
- story-scrolls.html  the review page, with the current script built in;
- story-data.json     the same script as one record (version, date, json),
                      to load into the page's live store so an already
                      published page shows the newest version.
"""
import io, json, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'docs', 'STORY.md')


def inline(t):
    t = re.sub(r'\*\*(.+?)\*\*', r'\1', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    t = re.sub(r'`(.+?)`', r'\1', t)
    return t.strip()


def parse(text):
    body = text.split('## The chapters', 1)[1].split('## Notes for the code', 1)[0]
    items = []
    for sec in re.split(r'\n(?=### )', body):
        lines = sec.split('\n')
        if not lines[0].startswith('### '):
            continue
        title = lines[0][4:].strip()
        note, paras, slots, console = '', [], {}, []
        cur, para = None, []
        for ln in lines[1:]:
            if ln.startswith('>'):
                t = ln[1:].strip()
                if t:
                    para.append(t)
                elif para:
                    paras.append(' '.join(para)); para = []
                continue
            if para:
                paras.append(' '.join(para)); para = []
            m = re.match(r'^\*(?!\*)(.+)\*$', ln.strip())
            if m and not paras and not note:
                note = inline(m.group(1)); continue
            m = re.match(r'- \*\*⟨(\w+)⟩\*\*', ln)
            if m:
                cur = m.group(1); slots[cur] = []; continue
            m = re.match(r'\s+- \*([^*]+):\*\s*(.*)', ln)
            if m and cur:
                txt = m.group(2).strip()
                slots[cur].append([m.group(1).strip(), '' if txt == '—' else inline(txt)]); continue
            m = re.match(r'\*\*(Console[^*]*|Echo[^*]*):\*\*\s*(.*)', ln)
            if m:
                console.append([m.group(1).strip(), inline(m.group(2))]); cur = None; continue
            if ln.strip() and not ln.startswith(' '):
                cur = None
        if para:
            paras.append(' '.join(para))
        if not paras:
            continue
        items.append({'title': title, 'note': note, 'paras': [inline(p) for p in paras],
                      'slots': slots, 'console': console})

    # The echo Prologue is shown as the Prologue's echo version.
    pro = next(i for i in items if i['title'].startswith('Prologue: '))
    echo = next(i for i in items if i['title'].startswith('Prologue, after'))
    pro['echoAlt'] = echo['paras']
    items.remove(echo)

    keep = {'if you win': 'epilogue-if-you-win', 'if he wins': 'epilogue-if-he-wins'}
    for i in items:
        slug = re.sub(r'[^a-z0-9]+', '-', i['title'].split('(')[0].lower()).strip('-')[:40]
        i['id'] = next((v for k, v in keep.items() if k in i['title']), slug)
        m = re.search(r'\((lvl [^)]+|on death[^)]*|rare[^)]*)\)', i['title'])
        i['when'] = m.group(1) if m else ''
        i['name'] = re.sub(r'\s*\([^)]*\)\s*$', '', i['title'])
    return items


def version():
    try:
        out = subprocess.check_output(['git', 'log', '-1', '--format=%h|%cs', '--', 'docs/STORY.md'],
                                      cwd=ROOT, text=True).strip()
        commit, date = out.split('|')
        dirty = subprocess.run(['git', 'diff', '--quiet', '--', 'docs/STORY.md'], cwd=ROOT).returncode != 0
        return {'commit': commit + ('+edits' if dirty else ''), 'date': date}
    except Exception:
        return {'commit': 'local', 'date': ''}


def main():
    items = parse(io.open(SRC, encoding='utf-8').read())
    meta = version()
    data = json.dumps(items, ensure_ascii=False)
    tpl = io.open(os.path.join(HERE, 'story-scrolls.template.html'), encoding='utf-8').read()
    safe = lambda s: s.replace('</', '<\\/')
    page = tpl.replace('__DATA__', safe(data)).replace('__META__', safe(json.dumps(meta)))
    io.open(os.path.join(HERE, 'story-scrolls.html'), 'w', encoding='utf-8').write(page)
    record = dict(meta, json=data)
    io.open(os.path.join(HERE, 'story-data.json'), 'w', encoding='utf-8').write(json.dumps(record, ensure_ascii=False))
    print(f"{len(items)} scrolls, version {meta['commit']} ({meta['date']})")


if __name__ == '__main__':
    main()
