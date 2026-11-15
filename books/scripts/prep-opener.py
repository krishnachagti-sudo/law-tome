#!/usr/bin/env python3
"""Prepare a linocut round opener for print.

    python3 books/scripts/prep-opener.py books/true-or-folklore/art/openers/raw/r02-linocut.png r02

ChatGPT's tallest image is 1536 px, about 205 ppi on a full 7.5 in page; KDP
wants 300. Linocut is pure black and white, so we enlarge 2x with Lanczos and
then threshold back to pure black/white: the edges come out clean at ~410 ppi.
Writes art/openers/final/<name>.png.
"""
import sys, pathlib
from PIL import Image
src = pathlib.Path(sys.argv[1]); name = sys.argv[2]
out = src.parent.parent / 'final'; out.mkdir(exist_ok=True)
im = Image.open(src).convert('L')
im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
im = im.point(lambda v: 255 if v > 140 else 0).convert('1')
im.save(out / f'{name}.png', dpi=(410, 410))
print(out / f'{name}.png', im.size)
