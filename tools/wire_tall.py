"""Copy the artist's double-height scenes (256x128, interiors 256x96) from the review drop into img/places/tall/
as tall_<scene>.png and rewrite src/data/tallScenes.js, the list the game checks. A scene with no tall file keeps
its regular 256x64 art (the viewer shrinks back for it). Run it again whenever the artist hands over more."""
import os, shutil, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(os.path.dirname(root), 'wizardidle-review', 'places', 'tall')
dst = os.path.join(root, 'img', 'places', 'tall')
os.makedirs(dst, exist_ok=True)
if os.path.isdir(src):
    for f in sorted(os.listdir(src)):
        if f.endswith('.png'):
            shutil.copyfile(os.path.join(src, f), os.path.join(dst, 'tall_' + f))
names = sorted(f[5:-4] for f in os.listdir(dst) if f.startswith('tall_') and f.endswith('.png'))
with open(os.path.join(root, 'src', 'data', 'tallScenes.js'), 'w', newline='\n') as o:
    o.write("// Wizard Idle - the scenes that have a double-height version: img/places/tall/tall_<scene>.png, 256x128 (interiors 256x96,\n"
            "// drawn from the bottom, black above). Written by tools/wire_tall.py; any other scene keeps its regular art.\n"
            "export const TALL_ROWS = 96;       // height of the viewer in art rows (96 = interior size, 128 = whole tall scene); needs img/ui/frame_tall_<rows>.png
"
            "export const tallScenes = new Set([\n" + ''.join(f"    '{n}',\n" for n in names) + "]);\n")
print(len(names), 'tall scenes')
