#!/usr/bin/env python3
"""Tint answer-page background art for print.

    python3 books/scripts/fade-bg.py books/true-or-folklore

Reads art/bg/NNN.png, writes art/bg-faded/NNN.png in one flat grey: black
outlines become STRENGTH grey, white stays white. No gradient, because a
smooth fade is the thing most likely to band or blotch on KDP's black-and-white
press, and we can't order a proof from India to check it. The "fade up" comes
from the drawings themselves: every scene sits in the lower part of its frame
with empty white above (see art/prompts/BG-BRIEF.md).
"""
import sys, pathlib
from PIL import Image

STRENGTH = 0.22  # black outline -> 22% grey (Krishna picked B, 15 Nov 2026)
book = pathlib.Path(sys.argv[1])
src, out = book / 'art' / 'bg', book / 'art' / 'bg-faded'
out.mkdir(parents=True, exist_ok=True)
for f in sorted(src.glob('[0-9][0-9][0-9].png')):
    im = Image.open(f).convert('L')
    # Clamp near-white to white so the paper stays clean, then tint.
    im = im.point(lambda v: 255 if v > 235 else int(255 - (255 - v) * STRENGTH))
    im.save(out / f.name)
    print(f.name)
