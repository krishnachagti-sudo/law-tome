"""Design-extras tools (kept in the repo; the session scratchpad gets wiped).
  prep SRC DST [bw]        grayscale, clamp near-white, optional 1-bit at 140, trim to content
  split SRC OUTDIR [n]     cut a strip of n poses (white gaps) into OUTDIR/pose-1..n.png
  flipbook OUT acts...     acts = STRIPDIR:count  -> OUT/flip-001.png ... on one shared canvas
"""
import sys, os, glob
from PIL import Image, ImageOps

def prep_im(im, bw=False, trim=True, pad=20):
    im = im.convert('L').point(lambda v: 255 if v > 232 else v)
    if bw: im = im.point(lambda v: 0 if v < 140 else 255)
    if trim:
        box = ImageOps.invert(im).point(lambda v: 255 if v > 30 else 0).getbbox()
        if box:
            x0, y0, x1, y1 = box
            im = im.crop((max(0, x0-pad), max(0, y0-pad), min(im.width, x1+pad), min(im.height, y1+pad)))
    return im

def split(src, outdir, n=8):
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(src).convert('L').point(lambda v: 255 if v > 232 else v)
    w, h = im.size; px = im.load()
    ink = [sum(1 for y in range(0, h, 2) if px[x, y] < 200) for x in range(w)]
    runs, start = [], None
    for x, c in enumerate(ink + [0]):
        if c and start is None: start = x
        if not c and start is not None: runs.append((start, x)); start = None
    runs = [r for r in runs if r[1] - r[0] > 8]
    if len(runs) < n:
        # Poses touch (props between them): cut at the emptiest column near each even split.
        lo = runs[0][0]; hi = runs[-1][1]; step = (hi - lo) / n
        cuts = [lo] + [min(range(int(lo + step*k - step*0.3), int(lo + step*k + step*0.3)), key=lambda x: ink[x]) for k in range(1, n)] + [hi]
        runs = [(cuts[i], cuts[i+1]) for i in range(n)]
    while len(runs) > n:
        gaps = [runs[i+1][0] - runs[i][1] for i in range(len(runs)-1)]; i = gaps.index(min(gaps))
        runs[i:i+2] = [(runs[i][0], runs[i+1][1])]
    for i, (a, b) in enumerate(runs):
        prep_im(im.crop((a, 0, b, h))).save(f'{outdir}/pose-{i+1}.png')
    print(src, '->', len(runs), 'poses', '' if len(runs) == n else 'WARN')
    return len(runs)

def flipbook(out, acts):
    """acts: list of (dir, total_frames). Poses in a dir are spread evenly over its frames
    (each pose held about total/poses frames). All frames share one canvas, bottom-aligned
    and centred, so the cat never jumps in size or place."""
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(f'{out}/flip-*.png'): os.remove(f)
    seqs = []
    for d, total in acts:
        poses = sorted(glob.glob(f'{d}/pose-*.png'), key=lambda p: int(p.rsplit('-', 1)[1][:-4]))
        seqs += [poses[min(len(poses)-1, i * len(poses) // total)] for i in range(total)]
    ims = {p: Image.open(p) for p in set(seqs)}
    W = max(i.width for i in ims.values()); H = max(i.height for i in ims.values())
    for k, p in enumerate(seqs):
        c = Image.new('L', (W, H), 255); im = ims[p]
        c.paste(im, ((W - im.width) // 2, H - im.height)); c.save(f'{out}/flip-{k+1:03d}.png')
    print(len(seqs), 'frames, canvas', W, H)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'prep': prep_im(Image.open(sys.argv[2]), bw=len(sys.argv) > 4).save(sys.argv[3])
    elif cmd == 'split': split(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 8)
    elif cmd == 'flipbook': flipbook(sys.argv[2], [(a.split(':')[0], int(a.split(':')[1])) for a in sys.argv[3:]])
