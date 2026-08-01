#!/usr/bin/env python3
"""Turn Natural Earth's 110m land polygons into one inline SVG path.

Run once; the output (src/data/world-land.json) is committed, so the build
never touches the network and the page has no external asset to block.

    python3 build/make-worldmap.py path/to/ne_110m_land.geojson

Natural Earth is in the public domain (naturalearthdata.com/about/terms-of-use),
which is why it can be inlined rather than merely linked. The projection is
plate carree — x = lon + 180, y = 90 - lat — so a dot for a birthplace is
placed with the same two lines of arithmetic on the page, with no projection
library and no chance of the dots and the coastline disagreeing.
"""
import json
import sys

# One decimal place is ~11 km at the equator: far finer than a 360x180 viewBox
# rendered a few hundred pixels wide can show, and it keeps the file small.
PREC = 1
# Drop specks below this area in square degrees. At 110m the file is already
# generalised; this only removes islands that render as less than a pixel.
MIN_AREA = 0.35


def ring_area(ring):
    """Shoelace area in square degrees, unsigned."""
    a = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[i + 1][0], ring[i + 1][1]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2.0


def ring_path(ring):
    pts = []
    last = None
    for lon, lat in ring:
        x = round(lon + 180.0, PREC)
        y = round(90.0 - lat, PREC)
        # Generalisation can collapse neighbouring vertices onto the same
        # rounded point; emitting both just inflates the file.
        if (x, y) == last:
            continue
        pts.append(f'{x:g},{y:g}')
        last = (x, y)
    if len(pts) < 3:
        return ''
    return 'M' + 'L'.join(pts) + 'Z'


def main(src, out='src/data/world-land.json'):
    gj = json.load(open(src, encoding='utf-8'))
    parts, kept, dropped = [], 0, 0
    for feat in gj.get('features', []):
        geom = feat.get('geometry') or {}
        polys = ([geom.get('coordinates')] if geom.get('type') == 'Polygon'
                 else geom.get('coordinates') or [])
        for poly in polys:
            for ring in poly:            # ring 0 is the outline, the rest holes
                if ring_area(ring) < MIN_AREA:
                    dropped += 1
                    continue
                d = ring_path(ring)
                if d:
                    parts.append(d)
                    kept += 1
    path = ''.join(parts)
    json.dump({
        'path': path,
        'viewBox': '0 0 360 180',
        'projection': 'equirectangular (plate carree); x = lon + 180, y = 90 - lat',
        'source': 'Natural Earth 110m land (public domain) — naturalearthdata.com',
    }, open(out, 'w', encoding='utf-8'))
    print(f'{kept} rings kept, {dropped} specks dropped, {len(path)} chars -> {out}')


if __name__ == '__main__':
    main(*sys.argv[1:])
