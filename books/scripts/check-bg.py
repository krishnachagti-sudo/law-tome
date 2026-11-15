#!/usr/bin/env python3
"""Check answer-page backgrounds keep the top of the frame empty.

    python3 books/scripts/check-bg.py books/true-or-folklore/art/bg/007.png [...]

Prints, per file, the share of ink (pixels darker than 200) in the top 55% of
the frame. The brief asks for everything in the bottom 40%; a little spill
above 45% is fine. FAIL over 1.5%.
"""
import sys
from PIL import Image
bad = 0
for f in sys.argv[1:]:
    im = Image.open(f).convert('L'); w, h = im.size
    top = im.crop((0, 0, w, int(h * 0.55)))
    b = top.tobytes(); ink = sum(1 for v in b if v < 200) / len(b)
    ok = ink <= 0.015; bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} {ink*100:5.2f}% ink in top 55%  {f}")
sys.exit(1 if bad else 0)
