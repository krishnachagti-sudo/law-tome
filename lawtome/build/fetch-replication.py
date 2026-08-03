"""Harvest FORRT's Replication Database (FReD) and match it to the corpus.

Why this exists
---------------
Every reliability rating on this site is our own judgement. /how-solid/ says so,
which is the right thing to do and does not make it less true. It is the softest
joint in the whole project.

FReD is 1,239 paired original-and-replication findings from 336 original studies,
curated by FORRT, published under CC BY 4.0 — compatible with our own licence, so
this can be a join rather than a link. Where an entry in this index names an
effect FReD has tracked, the entry can carry somebody else's count of how the
replications actually went, next to our rating and clearly attributed to them.

What it will and will not do
----------------------------
It matches on the effect's NAME, normalised, against our name and aliases. That
is a deliberately narrow rule. The Wikidata audit taught this project that loose
matching produces confident nonsense — a label search there returned a 1994 film,
a video game and a family name — so anything that does not match exactly after
normalisation is dropped rather than guessed at. REJECT below records the one
match that passed the string test and failed a human one.

It publishes only the outcomes FReD has actually computed. 81% of FReD rows carry
no `outcome` value, and an effect whose rows are all blank yields no summary here
rather than a "0 of 0" that looks like a finding.

Usage
-----
    python3 build/fetch-replication.py

Writes src/data/replication.json. Re-runnable; the download is cached in the
system temp directory.
"""

import json
import os
import re
import subprocess
import sys
import tempfile

# The frozen, citable release. https://doi.org/10.17605/OSF.IO/9R62X
FRED_XLSX = 'https://osf.io/download/z5u9b/'
FRED_DOI = 'https://doi.org/10.17605/OSF.IO/9R62X'
FRED_CITE = ('FORRT Replication Database (FReD), Röseler et al., '
             'Journal of Open Psychology Data. CC BY 4.0.')

LAWS = 'src/data/laws'
OUT = 'src/data/replication.json'

# A ROW IN FReD IS NOT A REPLICATION ATTEMPT. This is the single most important
# thing to know about the file and it is not obvious from the columns.
#
# The first version of this script counted rows, and would have published "FORRT
# records 21 replication attempts for the availability heuristic, and 19 found no
# signal". That is wrong in a way that sounds authoritative. All 21 rows are ONE
# study - Ebersole et al.'s Many Labs 3 - reporting one result per participating
# site. The correct sentence is "one replication study, across 21 sites, most of
# which found no signal", which means something quite different about how much
# scrutiny the effect has had.
#
# The anchoring effect shows the same shape from the other side: 552 rows, but 56
# distinct replication studies. Counting rows overstates it tenfold; counting
# studies is the honest number and is still a large one.
#
# So the unit of scrutiny is the distinct replication REFERENCE, and the
# site-level rows are reported separately as "results".
MIN_STUDIES = 1
MIN_OUTCOMES = 3

# Matched on the string, rejected by a human. Recorded rather than silently
# dropped so the next person can disagree with the reasoning.
REJECT = {
    'Certainty effect': (
        "matched our Allais Paradox entry. The certainty effect is the mechanism "
        "Allais's problem exposes, not the paradox itself — close enough to match "
        "on a normalised string and not close enough to publish."
    ),
}

# Words stripped before comparison. Everything else must match exactly.
NOISE = re.compile(r'\b(the|a|an|of|in|on|effect|effects|bias|biases|paradigm|task)\b')


def norm(s):
    s = re.sub(r'[^a-z0-9 ]', ' ', str(s or '').lower())
    s = NOISE.sub(' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def load_corpus():
    by_norm = {}
    for fn in sorted(os.listdir(LAWS)):
        if not fn.endswith('.json'):
            continue
        d = json.load(open(os.path.join(LAWS, fn), encoding='utf-8'))
        for name in [d['name']] + list(d.get('aliases') or []):
            k = norm(name)
            # First name wins, so an entry's own name beats another's alias.
            if k and k not in by_norm:
                by_norm[k] = d['slug']
    return by_norm


def download():
    path = os.path.join(tempfile.gettempdir(), 'fred.xlsx')
    if os.path.exists(path) and os.path.getsize(path) > 100000:
        return path
    print(f'downloading FReD -> {path}')
    subprocess.run(['curl', '-sSL', '--max-time', '300', '-o', path,
                    '-A', 'LawTome/1.0 (research; replication join)', FRED_XLSX],
                   check=True)
    return path


def main():
    try:
        import openpyxl
    except ImportError:
        sys.exit('pip install openpyxl')

    by_norm = load_corpus()
    wb = openpyxl.load_workbook(download(), read_only=True)
    rows = wb['Data'].iter_rows(values_only=True)
    hdr = list(next(rows))
    ix = {h: i for i, h in enumerate(hdr)}

    # slug -> {effect name -> [outcome, ...]}
    found = {}
    rejected = {}
    for r in rows:
        if not r:
            continue
        effect = r[ix['effect']]
        if not effect:
            continue
        effect = str(effect).strip()
        if effect in REJECT:
            rejected[effect] = REJECT[effect]
            continue
        slug = by_norm.get(norm(effect))
        if not slug:
            continue
        outcome = r[ix['outcome']]
        outcome = str(outcome).strip() if outcome else ''
        # FReD carries a header-description row and stray blanks in this column.
        if len(outcome) > 60:
            outcome = ''
        ref = r[ix['ref_replication']]
        ref = str(ref).strip() if ref else ''
        e = found.setdefault(slug, {'effects': set(), 'refs': set(), 'rows': 0, 'outcomes': []})
        e['effects'].add(effect)
        e['rows'] += 1
        if ref:
            e['refs'].add(ref)
        if outcome:
            e['outcomes'].append(outcome)

    out = {}
    for slug, e in found.items():
        studies = len(e['refs'])
        if studies < MIN_STUDIES:
            continue
        outcomes = e['outcomes']
        rec = {
            'effects': sorted(e['effects']),
            'studies': studies,
            'results': e['rows'],
            'coded': len(outcomes),
            # The one replication reference, where there is exactly one. Naming it
            # is the difference between a statistic and something a reader can go
            # and check - and where a single study carries many results, knowing
            # WHICH study is the whole of the interpretation.
            'ref': sorted(e['refs'])[0][:300] if studies == 1 else None,
            'db': 'FReD',
            'cite': FRED_CITE,
            'source': FRED_DOI,
        }
        if len(outcomes) >= MIN_OUTCOMES:
            # FReD's outcome strings begin "signal" or "no signal" and then
            # qualify consistency and precision. We collapse to the one
            # distinction a reader of this site needs and link out for the rest,
            # rather than reprinting a taxonomy we did not design and cannot
            # explain in a sentence.
            rec['signal'] = sum(1 for o in outcomes if o.lower().startswith('signal'))
            rec['noSignal'] = len(outcomes) - rec['signal']
        out[slug] = rec

    doc = {
        'generated': None,  # stamped by the caller; kept null so reruns diff cleanly
        'about': ('Replication counts from FORRT\'s Replication Database (FReD), '
                  'matched to this corpus by exact normalised effect name. Every match '
                  'carries its attempt count; the signal/no-signal split appears only '
                  'where FReD has computed an outcome for at least %d of them.' % MIN_OUTCOMES),
        'source': FRED_DOI,
        'cite': FRED_CITE,
        'licence': 'CC BY 4.0',
        'rejected': rejected,
        'entries': dict(sorted(out.items())),
    }
    json.dump(doc, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(OUT, 'a', encoding='utf-8').write('\n')
    split = sum(1 for v in out.values() if 'signal' in v)
    print(f'{len(out)} entries carry replication counts, {split} with an outcome split; '
          f'{len(rejected)} rejected by hand')
    for slug, v in sorted(out.items(), key=lambda kv: -kv[1]['studies']):
        tail = (f'{v["signal"]}/{v["coded"]} results found a signal' if 'signal' in v
                else 'no outcome coded yet')
        print(f'  {slug:36} {v["studies"]:3} studies / {v["results"]:4} results  {tail}')


if __name__ == '__main__':
    main()
