#!/usr/bin/env python3
"""Classify every `namedAfter` value: is it a person, or something else?

    python3 build/fetch-namesake-kind.py                 # harvest, write the map
    python3 build/fetch-namesake-kind.py --apply         # stamp namesakeKind on the corpus
    python3 build/fetch-namesake-kind.py --limit 20      # a taster

WHY THIS IS FETCHED AND NOT GUESSED. `namedAfter` is overwhelmingly people, but
not always: The Hawthorne Works is a factory, the Monte Carlo Casino is a
building, the Red Queen is a character in a novel, and Muphry's Law is named
after a misspelling. Those cases were breaking things quietly — a pronunciation
button offering to say "A misspelling of Murphy" aloud, an eponym index whose
lede promises "the person who lent it".

Guessing from the shape of the string does not work. Half the non-people look
exactly like names ("The Hawthorne Works" is three capitalised words), and half
the people look irregular ("Guillaume de l'Hopital", "Jacobus Henricus van 't
Hoff", three-author teams). So the kind comes from Wikidata's P31 (instance of),
walked up P279 (subclass of) when the direct class is too specific, and every
verdict records the QID and the class it matched so a reader can check it.

Anything the ladder cannot decide is left UNSET rather than guessed. An absent
namesakeKind means "not established", not "person" — see docs/CORPUS-SCHEMA.md.
"""
import argparse
import io
import json
import os
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module

ff = import_module('fetch-facts')
api, norm, load_laws = ff.api, ff.norm, ff.load_laws
wd_entity, claim_values, resolve_article = ff.wd_entity, ff.claim_values, ff.resolve_article
WD_API, LAWS_DIR = ff.WD_API, ff.LAWS_DIR

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data', 'namesake-kinds.json')

# Wikidata classes -> our vocabulary. Checked in order, so the specific cases
# (a fictional human is fiction, not a person) are tested before Q5.
KIND_BY_QID = [
    ('fictional', {
        'Q95074',     # fictional character
        'Q15632617',  # fictional human
        'Q3658341',   # literary character
        'Q22988604',  # fictional entity
        'Q11688446',  # mythological Greek character
        'Q22989102',  # legendary figure
        'Q2239243',   # mythical creature
        'Q178885',    # deity
    }),
    ('person', {
        'Q5',         # human
        # "Wikimedia human name disambiguation page" — the article is a list of
        # people who share this name. Which Robert Brown is meant is a question
        # this script does not need to answer: that the namesake is a PERSON is
        # exactly what the class asserts. Without this, six real people
        # (Bergmann, Brown, Gall, Graham, Gibrat, Betteridge) came back
        # unresolved purely because their names are common.
        'Q22808320',
    }),
    ('group', {
        'Q43229',     # organization
        'Q4830453',   # business
        'Q783794',    # company
        'Q3918',      # university
        'Q31855',     # research institute
        'Q327333',    # government agency
        'Q16334295',  # group of humans
        'Q874405',    # social group
        'Q7278',      # political party
        'Q17334923',  # location (guarded below)
    } - {'Q17334923'}),
    ('place', {
        'Q17334923',  # location
        'Q515',       # city
        'Q3957',      # town
        'Q6256',      # country
        'Q41176',     # building
        'Q811979',    # architectural structure
        'Q13226383',  # facility
        'Q3947',      # house
        'Q133215',    # casino
        'Q83405',     # factory
    }),
    ('work', {
        'Q47461344',  # written work
        'Q7725634',   # literary work
        'Q571',       # book
        'Q234460',    # text
        'Q49848',     # document
        'Q1667921',   # novel series
        'Q8261',      # novel
        'Q13442814',  # scholarly article
    }),
    ('event', {
        'Q1656682',   # event
        'Q198',       # war
        'Q178561',    # battle
    }),
    ('animal', {
        'Q726',       # horse — the Clever Hans Effect is named after one
        'Q729',       # animal
        'Q16521',     # taxon
        'Q39201',     # pet
    }),
]

# Classes that mean "you have landed on the wrong article". A bare surname
# resolves to a family-name item, a common name to a disambiguation page, and —
# the nastiest one — searching "Robert Gibrat" returns *Gibrat's law*, the law
# itself, whose P31 is a scientific concept. Any of these means: keep looking.
NOT_THE_SUBJECT = {
    'Q4167410',    # Wikimedia disambiguation page
    'Q101352',     # family name
    'Q12308941',   # male given name
    'Q11879590',   # female given name
    'Q4167836',    # Wikimedia category
    'Q13406463',   # Wikimedia list article
    'Q1151067',    # scientific law
    'Q4530436',    # empirical law
    'Q917918',     # law (principle)
    'Q1624034',    # aphorism
    'Q18673030',   # adage
    'Q2144402',    # theorem-like concept
    'Q151885',     # concept
}

CACHE = {}


def class_kind(qid):
    """Our kind for a Wikidata class QID, or None."""
    for kind, qids in KIND_BY_QID:
        if qid in qids:
            return kind
    return None


def superclasses(qid, depth=2):
    """P279 ancestors, breadth-first, to `depth` levels. Wikidata is specific —
    "casino hotel" is not in any hand-written set, but its parent is."""
    seen, frontier, out = {qid}, [qid], []
    for _ in range(depth):
        if not frontier:
            break
        d = api(WD_API, {'action': 'wbgetentities', 'format': 'json',
                         'ids': '|'.join(frontier[:40]), 'props': 'claims'})
        nxt = []
        for q, ent in (d.get('entities') or {}).items():
            for v in claim_values(ent, 'P279'):
                p = v.get('id') if isinstance(v, dict) else None
                if p and p not in seen:
                    seen.add(p)
                    out.append(p)
                    nxt.append(p)
        frontier = nxt
    return out


def classify_title(title):
    """(kind, evidence) for one Wikipedia article title, or (None, reason)."""
    qid, ent = wd_entity(title)
    if not ent:
        return None, 'no entity'
    classes = [v.get('id') for v in claim_values(ent, 'P31') if isinstance(v, dict) and v.get('id')]
    if any(c in NOT_THE_SUBJECT for c in classes):
        return None, 'wrong subject'
    for c in classes:
        k = class_kind(c)
        if k:
            return k, {'qid': qid, 'class': c, 'source': 'https://www.wikidata.org/wiki/' + qid}
    for c in classes:                       # one walk up the class hierarchy
        for anc in superclasses(c):
            k = class_kind(anc)
            if k:
                return k, {'qid': qid, 'class': c, 'viaClass': anc,
                           'source': 'https://www.wikidata.org/wiki/' + qid}
    return None, 'no class matched'


# The corpus's own gloss is evidence. When namedAfter says the namesake is a
# character or a figure from myth, a `work` verdict means the lookup landed on
# the book, play or opera they appear in — Goethe's Werther resolves to the
# Massenet opera, Pygmalion to the Shaw play — and that is a miss, not an answer.
IS_A_CHARACTER = re.compile(r'\b(character|myth|mythology|legend|fictional)\b', re.I)

STOP = {'the', 'a', 'an', 'of', 'and', 'de', 'van', 'von', 'der', 'den', 'la', 'le', 'du', 'di'}


def same_subject(probe, title):
    """Is `title` an article about `probe`, or merely a hit that lands near it?

    Wikipedia search — including the fallback inside resolve_article — returns
    something plausible for any string. Ungated, it classified "A misspelling of
    Murphy" as the person Dick Murphy, "The 'unlucky sod'" as the actor John
    Beradino, and "Archibald Putt" as Cary Grant (who was born Archibald Leach).
    Three confident, wrong answers.

    The test is subset in EITHER direction, because both directions occur:

        probe subset of title   "Max Zorn" -> "Max August Zorn"
                                (the article carries extra given names)
        title subset of probe   "Cyril Northcote Parkinson" -> "C. Northcote
                                Parkinson" (the article abbreviates one)

    A hit that merely shares a surname satisfies neither, because it brings a
    word of its own: "Dick", "Cary".
    """
    def words(s):
        return {w for w in re.split(r'[^\w]+', norm(s)) if len(w) >= 3 and w not in STOP}
    p, t = words(probe), words(title)
    if not p or not t:
        return False
    return p.issubset(t) or t.issubset(p)


def exact_title(name):
    """The article this name IS, following redirects — never a search.

    The distinction matters and resolve_article blurs it. A redirect is
    Wikipedia asserting that the string names that article: "Lord Rayleigh"
    redirects to "John William Strutt, 3rd Baron Rayleigh" and "Cheops" to
    "Khufu", and both are authoritative. A SEARCH result asserts nothing —
    it offered Cary Grant for "Archibald Putt". So redirects are trusted and
    search results have to pass same_subject.
    """
    d = api(ff.WP_API, {'action': 'query', 'format': 'json', 'redirects': 1,
                        'titles': name, 'prop': 'pageprops'})
    for pid, page in ((d.get('query') or {}).get('pages') or {}).items():
        if pid != '-1' and 'missing' not in page and 'disambiguation' not in (page.get('pageprops') or {}):
            return page.get('title')
    return None


def search_titles(name, n=5):
    d = api(ff.WP_API, {'action': 'query', 'format': 'json', 'list': 'search',
                        'srsearch': name, 'srlimit': n, 'srnamespace': 0})
    return [h['title'] for h in ((d.get('query') or {}).get('search') or [])]


def kind_of(name):
    """(kind, evidence) for one namedAfter string, or (None, why-not)."""
    # A joint namesake ("Oswald Avery, Colin MacLeod, and Maclyn McCarty") is
    # classified by its FIRST member — they are people or they are not, and the
    # list does not change that.
    first = re.split(r'\s*(?:,|\band\b|&)\s*', name.strip(), maxsplit=1)[0].strip()
    # Strip a leading descriptor ("The pharaoh Cheops" -> "Cheops") so the
    # lookup has a chance; the corpus keeps the fuller string for display.
    probe = re.sub(r'^(?:the|a|an)\s+(?:pharaoh|fictional|late|elder|younger)?\s*', '', first, flags=re.I).strip()
    # "Werther (Goethe's character)" -> "Werther". The parenthetical is a gloss
    # for the reader, and carrying it into the lookup guarantees a miss.
    bare = re.sub(r'\s*\([^)]*\)\s*$', '', probe).strip()
    # "Pygmalion of Greek myth" -> "Pygmalion". Tried LAST, so a name that
    # genuinely contains the preposition ("Zeno of Elea") matches whole first.
    head = re.split(r'\s+(?:of|in)\s+', bare)[0].strip()
    cands = [c for c in dict.fromkeys((first, probe, bare, head)) if c]

    # Pass one: the article each candidate IS, via redirect. Trusted outright.
    for cand in cands:
        title = exact_title(cand)
        if title:
            kind, ev = classify_title(title)
            # A character usually shares a name with the thing they appear in,
            # and Wikipedia sends the bare name to the work: "Dilbert" is the
            # comic strip, "Werther" the novel. The Dilbert Principle is named
            # after the CHARACTER, so when a lookup lands on a work, ask whether
            # a character of that name exists before accepting it.
            # The corpus's own gloss is evidence. When it says the namesake is a
            # character, a `work` verdict means we landed on the book or opera
            # they appear in — Goethe's Werther resolves to the Massenet opera —
            # and that is a miss, not an answer.
            if kind == 'work' and IS_A_CHARACTER.search(name):
                kind = None
            if kind == 'work':
                # exact_title, NOT resolve_article: the latter searches when the
                # title does not exist, and "Archibald Putt (character)" search
                # returned Cary Grant, which then sailed through as a person
                # because this branch was returning without a same_subject check.
                for suffix in (' (character)', ' (mythology)'):
                    alt = exact_title(cand + suffix)
                    if not alt:
                        continue
                    k2, ev2 = classify_title(alt)
                    if k2 and k2 != 'work' and same_subject(cand, alt):
                        return k2, {'via': cand, 'title': alt, **ev2}
                # Otherwise the work must actually BE the named thing — the
                # Gospel of Matthew is, "Archibald Putt" is not the title of
                # the book a search turned up.
                if not same_subject(cand, title):
                    kind = None
            if kind:
                return kind, {'via': cand, 'title': title, **ev}
    # Pass two: nothing was named exactly. Widen to a search, and now every hit
    # has to prove it is about this name — skipping titles that are plainly the
    # LAW rather than its namesake, since searching "Robert Gibrat" returns
    # "Gibrat's law" long before it returns the man (who has no article at all).
    law_ish = re.compile(r"\b(law|laws|effect|principle|rule|razor|paradox|theorem|equation|conjecture)\b", re.I)
    for cand in cands:
        for t in search_titles(cand):
            if law_ish.search(t) and not law_ish.search(cand):
                continue
            if not same_subject(cand, t):
                continue
            kind, ev = classify_title(t)
            if kind == 'work' and IS_A_CHARACTER.search(name):
                continue
            if kind:
                return kind, {'via': cand, 'title': t, 'viaSearch': True, **ev}
    return None, {'why': 'no confident match'}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--apply', action='store_true', help='write namesakeKind into the corpus')
    ap.add_argument('--only', default='', help='classify one namesake (a debugging aid)')
    args = ap.parse_args()

    laws = load_laws()
    names = {}
    for l in laws:
        n = (l.get('namedAfter') or '').strip()
        if n and not re.match(r'^(none|n/a|na|-|—)$', n, re.I):
            names.setdefault(n, []).append(l['slug'])

    out = {}
    if os.path.exists(OUT):
        with io.open(OUT, encoding='utf-8') as fh:
            out = json.load(fh)

    todo = [args.only] if args.only else [n for n in names if n not in out]
    if args.limit:
        todo = todo[:args.limit]

    stats = {}
    for i, name in enumerate(todo, 1):
        try:
            kind, ev = kind_of(name)
        except Exception as e:                      # a flaky call must not lose the run
            print(f'  ERR {i}/{len(todo)}  {name} — {e}', flush=True)
            continue
        rec = {'namedAfter': name, **(ev or {})}
        if kind:
            rec['kind'] = kind
        out[name] = rec
        stats[kind or 'unresolved'] = stats.get(kind or 'unresolved', 0) + 1
        print(f'  {i}/{len(todo)}  {name} -> {kind or "UNRESOLVED"}', flush=True)
        if i % 25 == 0:
            with io.open(OUT, 'w', encoding='utf-8') as fh:
                json.dump(out, fh, ensure_ascii=False, indent=2, sort_keys=True)
        time.sleep(0.1)

    with io.open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write('\n')
    print(json.dumps(stats, indent=2))
    print('wrote', OUT)

    if args.apply:
        apply_to_corpus(out, names)


def apply_to_corpus(kinds, names):
    """Insert namesakeKind into each law file, as TEXT.

    Not by re-serialising: json.dump(indent=2) reformats, and the corpus keeps
    some objects deliberately on one line (`working` entries, `sources`). A
    round-trip through the parser expanded 107 files into thousands of lines of
    diff noise that had nothing to do with this change. So the field is spliced
    in as a line after `namedAfter`, matching its indentation, and every other
    byte of the file is left exactly as its author wrote it.
    """
    import re as _re
    changed = skipped = 0
    for fn in sorted(os.listdir(LAWS_DIR)):
        if not fn.endswith('.json'):
            continue
        path = os.path.join(LAWS_DIR, fn)
        with io.open(path, encoding='utf-8') as fh:
            text = fh.read()
        law = json.loads(text)
        n = (law.get('namedAfter') or '').strip()
        kind = (kinds.get(n) or {}).get('kind')
        if not kind:
            continue
        if law.get('namesakeKind') == kind:
            skipped += 1
            continue
        m = _re.search(r'^([ \t]*)"namedAfter"\s*:.*?(,?)$', text, _re.M)
        if not m:
            print(f'  ! {fn}: namedAfter is not on a line of its own; skipped')
            continue
        indent, comma = m.group(1), m.group(2)
        line = f'\n{indent}"namesakeKind": {json.dumps(kind)}{comma}'
        # If namedAfter was the last key it has no comma; ours then needs none
        # and namedAfter needs one.
        if not comma:
            text = text[:m.end()] + ',' + line[:-0 or None].rstrip(',') + text[m.end():]
        else:
            text = text[:m.end()] + line + text[m.end():]
        # Re-parse before writing: a splice that produced invalid JSON must
        # never reach disk.
        try:
            back = json.loads(text)
        except Exception as e:
            print(f'  ! {fn}: splice produced invalid JSON ({e}); skipped')
            continue
        if back.get('namesakeKind') != kind:
            print(f'  ! {fn}: splice did not take; skipped')
            continue
        with io.open(path, 'w', encoding='utf-8') as fh:
            fh.write(text)
        changed += 1
    print(f'stamped namesakeKind on {changed} law files ({skipped} already current)')


if __name__ == '__main__':
    main()
