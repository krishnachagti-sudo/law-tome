#!/usr/bin/env python3
"""Attach a sourced country to each namesake birthplace already in facts.json.

build/fetch-facts.py records a birthplace as a label and a coordinate — enough
for a dot on a map, not enough to answer "which named laws came out of Hungary".
Deriving the country from the coordinate would mean drawing a border ourselves,
so instead this asks Wikidata the question it already has an answer to: the
birthplace item's P17 (country).

Two things this deliberately does NOT do:

  * It does not guess a country for a place Wikidata leaves without one. The
    record simply keeps no country, and the place stays off the country pages.
  * It does not attempt historical borders. P17 is the country the place is in
    now, and every page built from this says so in as many words. Königsberg is
    recorded under Russia with its label intact, because that is the checkable
    fact; "Prussia" would be an editorial judgement we have no source for.

Everything is written back into facts.json under `_people[slug].origin`:
`country`, `countryQid`, `placeQid`. Re-running skips records that already have
a country unless --refresh is passed.

Usage:
  python3 build/fetch-origin-country.py            # fill in what is missing
  python3 build/fetch-origin-country.py --dry-run  # report, write nothing
"""
import argparse
import io
import json
import os
import subprocess
import time
from urllib.parse import urlencode

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACTS = os.path.join(ROOT, 'src', 'data', 'facts.json')
WD_API = 'https://www.wikidata.org/w/api.php'
UA = 'LawTomeBot/1.0 (https://github.com/krishnachagti-sudo/law-tome; static encyclopedia build)'
BATCH = 40  # wbgetentities takes 50; 40 keeps the URL comfortably short


def sh(cmd, tries=3):
    last = None
    for attempt in range(tries):
        p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if p.returncode == 0 and p.stdout:
            return p.stdout
        last = p.stderr.decode('utf-8', 'replace')[:200]
        time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(last or 'empty response')


def api(params):
    """One API call, retrying through Wikimedia's rate limiter.

    The limiter answers with a plain-text notice rather than an error status,
    so a JSON decode failure is the signal to back off — and backing off is the
    correct response to it, not an abort.
    """
    url = WD_API + '?' + urlencode(params)
    delay = 2
    for attempt in range(6):
        body = sh(['curl', '-sS', '-A', UA, '--max-time', '40', url]).decode('utf-8', 'replace')
        try:
            return json.loads(body)
        except ValueError:
            if attempt == 5:
                raise RuntimeError('wikidata: ' + body[:160].replace('\n', ' '))
            time.sleep(delay)
            delay *= 2
    raise RuntimeError('unreachable')


def entities(ids, props='labels|claims'):
    """Fetch items in batches; returns {qid: entity}."""
    out = {}
    ids = [q for q in ids if q]
    for i in range(0, len(ids), BATCH):
        chunk = ids[i:i + BATCH]
        d = api({'action': 'wbgetentities', 'format': 'json', 'ids': '|'.join(chunk),
                 'props': props, 'languages': 'en'})
        for qid, ent in (d.get('entities') or {}).items():
            if 'missing' not in ent:
                out[qid] = ent
        time.sleep(1.0)
    return out


def claim_ids(ent, pid):
    """The item ids a property points at, best-ranked first."""
    vals = []
    for cl in ((ent.get('claims') or {}).get(pid) or []):
        v = ((cl.get('mainsnak') or {}).get('datavalue') or {}).get('value')
        if isinstance(v, dict) and v.get('id'):
            vals.append((cl.get('rank') or 'normal', v['id']))
    order = {'preferred': 0, 'normal': 1, 'deprecated': 2}
    vals.sort(key=lambda t: order.get(t[0], 1))
    return [q for _, q in vals]


def label_of(ent):
    return ((ent.get('labels') or {}).get('en') or {}).get('value')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--refresh', action='store_true', help='re-resolve records that already have a country')
    args = ap.parse_args()

    with io.open(FACTS, encoding='utf-8') as fh:
        facts = json.load(fh)
    people = facts.get('_people') or {}

    todo = []
    for slug, rec in people.items():
        o = rec.get('origin')
        if not o:
            continue
        if o.get('country') and not args.refresh:
            continue
        src = str(o.get('source') or '')
        qid = src.rsplit('/', 1)[-1] if src.startswith('https://www.wikidata.org/wiki/Q') else ''
        if not qid:
            continue
        todo.append((slug, rec, o, qid))

    print(f'{len(todo)} birthplaces to resolve (of {sum(1 for r in people.values() if r.get("origin"))} recorded)')
    if not todo:
        return

    # Person item -> birthplace item. The record stores the PERSON's qid as its
    # source, so the place has to be re-resolved rather than read back.
    persons = entities([q for _, _, _, q in todo], props='claims')
    place_of = {}
    for slug, _rec, _o, qid in todo:
        ent = persons.get(qid)
        if not ent:
            continue
        got = claim_ids(ent, 'P19')
        if got:
            place_of[slug] = got[0]

    places = entities(sorted(set(place_of.values())))
    # A birthplace is often a town whose item carries no P17 of its own; walk up
    # through "located in the administrative territorial entity" (P131) a couple
    # of steps before giving up. Two steps, not unbounded: past that the chain
    # starts crossing into disputed and historical entities and the answer stops
    # being a simple fact.
    need_parent = [q for q, e in places.items() if not claim_ids(e, 'P17')]
    hop = 0
    while need_parent and hop < 2:
        parents = {}
        for q in need_parent:
            up = claim_ids(places[q], 'P131')
            if up:
                parents[q] = up[0]
        fetched = entities(sorted(set(parents.values())))
        places.update(fetched)
        for child, parent in parents.items():
            pe = fetched.get(parent)
            if pe and claim_ids(pe, 'P17'):
                places[child] = {**places[child], '_country_via': parent}
        need_parent = [q for q in need_parent
                       if not claim_ids(places[q], 'P17') and '_country_via' not in places[q]]
        hop += 1

    country_qids = set()
    for q, e in places.items():
        via = e.get('_country_via')
        src = places.get(via) if via else e
        got = claim_ids(src or {}, 'P17')
        if got:
            country_qids.add(got[0])
    countries = entities(sorted(country_qids), props='labels')

    filled = missing = 0
    for slug, rec, o, _qid in todo:
        pq = place_of.get(slug)
        if not pq or pq not in places:
            missing += 1
            continue
        pe = places[pq]
        via = pe.get('_country_via')
        cq = (claim_ids(places.get(via) or {}, 'P17') if via else claim_ids(pe, 'P17'))
        cq = cq[0] if cq else None
        o['placeQid'] = pq
        if not cq or cq not in countries:
            missing += 1
            continue
        name = label_of(countries[cq])
        if not name:
            missing += 1
            continue
        o['country'] = name
        o['countryQid'] = cq
        filled += 1

    print(f'resolved {filled}, unresolved {missing}')
    if args.dry_run:
        return
    with io.open(FACTS, 'w', encoding='utf-8') as fh:
        json.dump(facts, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write('\n')
    print(f'wrote {FACTS}')


if __name__ == '__main__':
    main()
