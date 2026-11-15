"""Turns a book's raw cartoons into print-ready grayscale files.

    python3 books/scripts/finish-art.py books/true-or-folklore [--preview]

KDP prints black ink only, so each image becomes grayscale with three clean
levels: black lines, the one light grey, and white paper. Near-whites are
clamped to white so no faint tint prints as a grey box. Output goes to
art/final/<slug>.png at 300+ ppi for the 4.6 in slot on the question page.

--preview also accepts small drafts (such as Canva's 200 px previews) and
upscales them so a layout can be checked; never ship those.
"""
import sys
from pathlib import Path
from PIL import Image

book = Path(sys.argv[1])
preview = "--preview" in sys.argv
raw, final = book / "art" / "raw", book / "art" / "final"
final.mkdir(parents=True, exist_ok=True)
SLOT_PX = int(4.6 * 300)  # the cartoon slot is 4.6 in wide on a 6x9 page

for src in sorted(raw.glob("*.png")):
    im = Image.open(src).convert("L")
    if im.width < SLOT_PX:
        if not preview:
            print(f"skip {src.name}: {im.width}px wide, needs {SLOT_PX} for 300 ppi")
            continue
        im = im.resize((SLOT_PX, round(im.height * SLOT_PX / im.width)), Image.LANCZOS)
    # Three levels: ink, the light grey fill, paper.
    im = im.point(lambda v: 0 if v < 90 else (205 if v < 225 else 255))
    im.save(final / src.name, dpi=(300, 300))
    print(f"{src.name}  {im.width}x{im.height}")
