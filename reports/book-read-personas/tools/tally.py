# Tally the reader panel: friction pages (mapped back to printed pages), best/flat rankings, decoy catches,
# model agreement, holdout agreement, duplicate-text check between w1 and w2.
import json, glob, collections, re, statistics as st, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
mp = json.load(open('pack/map.json'))
files = sorted(glob.glob('round-1/*.json'))
R = [json.load(open(f)) | {'_f': os.path.basename(f)} for f in files]
def grp(r):
    if r['_f'].startswith('holdout'): return 'holdout'
    return 'opus' if 'opus' in r['model'] else 'sonnet'
G = collections.defaultdict(list)
for r in R: G[grp(r)].append(r)
print({k: len(v) for k, v in G.items()})

def no(x):
    try: return int(re.sub(r'\D', '', str(x)))
    except: return None
def score(rs):
    s = collections.Counter()
    for r in rs:
        for k, w in (('w1_best', 1), ('w2_read_aloud', 1), ('w1_flat', -1), ('w2_cut', -1)):
            for it in r.get(k, []): s[no(it.get('no'))] += w
    return s
def spearman(a, b):
    keys = sorted(set(a) | set(b))
    ra = {k: i for i, k in enumerate(sorted(keys, key=lambda k: a.get(k, 0)))}
    rb = {k: i for i, k in enumerate(sorted(keys, key=lambda k: b.get(k, 0)))}
    n = len(keys); d = sum((ra[k] - rb[k]) ** 2 for k in keys)
    return 1 - 6 * d / (n * (n * n - 1)) if n > 2 else None
S = {g: score(v) for g, v in G.items()}
dev = S['opus'] + S['sonnet']
print('rank agreement opus vs sonnet', round(spearman(S['opus'], S['sonnet']), 2))
print('rank agreement dev vs holdout', round(spearman(dev, S.get('holdout', {})), 2))
print('\nTop stories (dev net score, opus/sonnet):', [(k, dev[k], S['opus'][k], S['sonnet'][k]) for k, _ in dev.most_common(12)])
print('Bottom stories:', [(k, dev[k], S['opus'][k], S['sonnet'][k]) for k, _ in sorted(dev.items(), key=lambda x: x[1])[:15]])

# friction
fr = collections.defaultdict(list)
for r in R:
    for f in r.get('w1_friction', []) + [dict(x, type='lost') for x in r.get('w2_lost', [])]:
        p = re.sub(r'[^P0-9]', '', str(f.get('page', '')))
        fr[p].append((grp(r), r['id'], f.get('type'), f.get('note') or f.get('why')))
print('\nFriction pages by number of personas (dev only), printed page in brackets:')
rows = []
for p, v in fr.items():
    devv = [x for x in v if x[0] != 'holdout']
    who = {(x[0], x[1]) for x in devv}
    rows.append((len(who), p, mp.get(p), collections.Counter(x[2] for x in devv), len({x[0] for x in devv}), [x for x in v if x[0] == 'holdout'] != []))
for n, p, real, types, nm, hold in sorted(rows, reverse=True)[:30]:
    print(f'{p} [{real}] personas={n} models={nm} holdout={hold} {dict(types)}')

# decoys
print('\nDecoy catches (D1 contradiction P083-P084, D2 jargon P173-P174):')
for g, rs in G.items():
    for d, pages in (('D1', {'P083', 'P084'}), ('D2', {'P173', 'P174'})):
        reached = [r for r in rs if no(r.get('stopped_at')) and no(r['stopped_at']) >= int(sorted(pages)[1][1:])]
        caught = [r['id'] for r in reached if any(re.sub(r'[^P0-9]', '', str(f.get('page', ''))) in pages for f in r.get('w1_friction', []) + r.get('w2_lost', []))]
        cut = [r['id'] for r in rs if any(no(i.get('no')) == (31 if d == 'D1' else 71) and ('Franklin' in json.dumps(i) or 'goldfish' in json.dumps(i).lower()) for i in r.get('w2_cut', []) + r.get('w1_flat', []))]
        print(f'  {g} {d}: reached {len(reached)}/{len(rs)}, flagged {len(caught)} {caught}')

# juster
for g, rs in G.items():
    j1 = [r['w1_juster'] for r in rs]; j2 = [r['w2_juster'] for r in rs]
    print(f'\nJuster {g}: w1 {j1} mean {st.mean(j1):.1f} | w2 {j2} mean {st.mean(j2):.1f}')
    for r in rs: print('   ', r['id'], r['w1_juster'], r['w2_juster'], r.get('stopped_at'), '|', r['w1_review']['headline'])

# copy check
def sim(a, b):
    a, b = set(a.lower().split()), set(b.lower().split()); return len(a & b) / max(1, len(a | b))
print('\nw1 review vs w2 review word overlap (flag > 0.6):', [(r['_f'], round(sim(r['w1_review']['body'], r['w2_review_first']), 2)) for r in R if sim(r['w1_review']['body'], r['w2_review_first']) > 0.6] or 'none')
