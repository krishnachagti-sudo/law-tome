"""Turns the Librarian's raw cartoons into print-ready files.

    python3 books/scripts/prep-librarian.py books/true-or-folklore

Reads art/librarian/raw/<name>.png, writes art/librarian/final/<name>.png the
way finish-art.py treats the story cartoons: grayscale, three clean levels
(black lines, one light grey at 20%, white paper), near-whites clamped to white.

She prints small (a 1 in score badge, a 1.25 in gift-page figure), so each
file is checked against KDP at the width it prints at (SIZES below, the
widths book-template.typ and cover/wrap.typ use):
  - at least 300 ppi at that width, or the file is refused;
  - lines at least 0.75 pt: strokes thinner than that are thickened (only the
    thin ones; outlines that already pass are left alone);
  - grey fills at least 10% (the one grey is 20%).

back-cover is also written as back-cover-cover.png for the cover: cream lines
on the cover's vermillion, both colours read from cover/wrap.typ.
"""
import re, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

# Printed width in inches. Change these with the template, never apart from it.
SIZES = {
    "gift": 1.25,
    "band-myth-buster": 1.0, "band-fact-checker": 1.0,
    "band-healthy-skeptic": 1.0, "band-easily-fooled": 1.0,
    "game-night": 3.6, "classroom": 3.6, "how-checked": 3.6,
    "round-11": 2.0,
    "back-cover": 1.35,
}
MIN_PT, MIN_PPI = 0.75, 300
INK, GREY, PAPER = 0, 205, 255  # 205 = 20% grey, the same level finish-art.py uses

book = Path(sys.argv[1])
raw, final = book / "art" / "librarian" / "raw", book / "art" / "librarian" / "final"
final.mkdir(parents=True, exist_ok=True)


def widths_pt(ink, px_per_pt):
    """Stroke widths along the stroke centres, in points: 10th and 50th percentile."""
    dt = nd.distance_transform_edt(ink)
    ridge = ink & (dt > 0) & (dt == nd.maximum_filter(dt, 3))
    w = 2 * dt[ridge] / px_per_pt
    return np.percentile(w, [10, 50])


def disk(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


failed = False
for name, width_in in SIZES.items():
    src = raw / f"{name}.png"
    if not src.exists():
        print(f"missing {src}"); failed = True; continue
    a = np.array(Image.open(src).convert("L"))
    ppi = a.shape[1] / width_in
    if ppi < MIN_PPI:
        print(f"REFUSED {name}: {a.shape[1]} px at {width_in} in is {ppi:.0f} ppi, needs {MIN_PPI}")
        failed = True; continue
    px_per_pt = ppi / 72
    need = MIN_PT * px_per_pt  # thinnest allowed stroke, in pixels
    ink = a < 90
    grey = (a >= 90) & (a < 225)
    before = widths_pt(ink, px_per_pt)
    # Width of the stroke each ink pixel belongs to: twice the largest
    # distance-to-paper found within one allowed stroke width of it.
    local = 2 * nd.maximum_filter(nd.distance_transform_edt(ink), size=int(np.ceil(need)) | 1)
    thin = ink & (local < need)
    grow = int(np.ceil((need - local[thin].min()) / 2)) if thin.any() else 0
    if grow:
        ink = ink | nd.binary_dilation(thin, structure=disk(grow))
    after = widths_pt(ink, px_per_pt)
    out = np.full(a.shape, PAPER, np.uint8)
    out[grey] = GREY
    out[ink] = INK
    Image.fromarray(out).save(final / f"{name}.png", dpi=(round(ppi), round(ppi)))
    print(f"{name:22s} {a.shape[1]}x{a.shape[0]} at {width_in} in = {ppi:.0f} ppi; "
          f"strokes p10/p50 {before[0]:.2f}/{before[1]:.2f} pt -> {after[0]:.2f}/{after[1]:.2f} pt"
          f"{f' (thin strokes grown {grow} px)' if grow else ''}; grey {100 - GREY / 2.55:.0f}%")

# The back cover: cream lines on vermillion, colours from the cover source.
wrap = (book / "cover" / "wrap.typ").read_text()
hexof = lambda var: re.search(rf'#let {var} = rgb\("#([0-9a-fA-F]{{6}})"\)', wrap).group(1)
cream, verm = (np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float) for h in (hexof("paper"), hexof("verm")))
bc = final / "back-cover.png"
if bc.exists():
    g = np.array(Image.open(bc).convert("L"))
    t = np.select([g == INK, g == GREY], [1.0, 0.3], 0.0)[..., None]  # cream share: lines full, fills 30%
    rgb = (verm * (1 - t) + cream * t).round().astype(np.uint8)
    Image.fromarray(rgb, "RGB").save(final / "back-cover-cover.png", dpi=Image.open(bc).info.get("dpi", (300, 300)))
    print(f"back-cover-cover.png  cream #{hexof('paper')} lines on vermillion #{hexof('verm')}")
sys.exit(1 if failed else 0)
