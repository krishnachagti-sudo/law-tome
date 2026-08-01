#!/usr/bin/env python3
"""Harvest the NON-IMAGE dimensions of each law, from sources that can be checked.

Same contract as build/fetch-images.py: a curation tool run by hand, writing
src/data/facts.json plus a few cached assets, which the build then treats as
ordinary verified data. Nothing here is composed, translated, estimated or
guessed — every value is fetched from a named source and stored with it.

What it collects:

  formula   Wikidata's "defining formula" (P2534), the law written as itself
            rather than described in English, plus an SVG rendered by
            Wikimedia's own math service so the page needs no math library.
  names     The law's own Wikidata labels in other languages. Not translations
            we produced — the names the idea already goes by elsewhere.
  ngram     Google Books' frequency series for the phrase, which shows when the
            name entered the language and how it spread. This is about the
            PHRASE, not the idea, and the page says so.
  audio     A pronunciation recording of the namesake, for an index full of
            Ångström, Poincaré and Chebyshev.
  origin    The namesake's birthplace, resolved to coordinates, so the corpus
            can be seen on a map.

Usage:
    python3 build/fetch-facts.py --what formula --dry-run --limit 20
    python3 build/fetch-facts.py --what formula,names,ngram,audio,origin
"""

import argparse
import io
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from urllib.parse import urlencode, quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAWS_DIR = os.path.join(ROOT, 'src', 'data', 'laws')
FACTS = os.path.join(ROOT, 'src', 'data', 'facts.json')
FORMULA_DIR = os.path.join(ROOT, 'src', 'assets', 'img', 'formula')
AUDIO_DIR = os.path.join(ROOT, 'src', 'assets', 'audio')

WP_API = 'https://en.wikipedia.org/w/api.php'
WD_API = 'https://www.wikidata.org/w/api.php'
COMMONS_API = 'https://commons.wikimedia.org/w/api.php'
MATH_CHECK = 'https://wikimedia.org/api/rest_v1/media/math/check/tex'
MATH_SVG = 'https://wikimedia.org/api/rest_v1/media/math/render/svg/'
NGRAM = 'https://books.google.com/ngrams/json'
UA = 'TheLawTome/1.0 (https://conyso.com/lawtome; reference data for an encyclopedia of named laws)'

# Languages worth showing: broad reach, and between them most of the world's
# readers. Kept short deliberately — a wall of thirty labels is not a feature.
LANGS = ['fr', 'de', 'es', 'it', 'pt', 'ru', 'ja', 'zh', 'ar', 'hi']
LANG_NAME = {
    'fr': 'French', 'de': 'German', 'es': 'Spanish', 'it': 'Italian',
    'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'zh': 'Chinese',
    'ar': 'Arabic', 'hi': 'Hindi',
}

AUDIO_LICENCE_OK = re.compile(r'^(pd|cc0|cc-pd|cc-by(-sa)?)', re.I)


def sh(cmd, tries=3):
    last = None
    for attempt in range(tries):
        p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if p.returncode == 0 and p.stdout:
            return p.stdout
        last = p.stderr.decode('utf-8', 'replace')[:200]
        time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(last or 'empty response')


def api(url, params):
    return json.loads(sh(['curl', '-sS', '-A', UA, '--max-time', '30',
                          url + '?' + urlencode(params)]).decode('utf-8', 'replace'))


def norm(s):
    s = unicodedata.normalize('NFD', str(s or ''))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', s).strip().lower()


def slugify(s):
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()


def load_laws():
    out = []
    for fn in sorted(os.listdir(LAWS_DIR)):
        if fn.endswith('.json'):
            with io.open(os.path.join(LAWS_DIR, fn), encoding='utf-8') as fh:
                out.append(json.load(fh))
    return out


def load_facts():
    if os.path.exists(FACTS):
        with io.open(FACTS, encoding='utf-8') as fh:
            return json.load(fh)
    return {}


def save_facts(facts):
    with io.open(FACTS, 'w', encoding='utf-8') as fh:
        json.dump(facts, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write('\n')


def wd_entity(title, props='claims'):
    """The Wikidata item behind an English Wikipedia article."""
    d = api(WD_API, {'action': 'wbgetentities', 'format': 'json', 'sites': 'enwiki',
                     'titles': title, 'props': props, 'redirects': 'yes'})
    for qid, ent in (d.get('entities') or {}).items():
        if qid.startswith('Q') and 'missing' not in ent:
            return qid, ent
    return None, None


def claim_values(ent, pid):
    out = []
    for cl in ((ent.get('claims') or {}).get(pid) or []):
        v = ((cl.get('mainsnak') or {}).get('datavalue') or {}).get('value')
        if v is not None:
            out.append(v)
    return out


def resolve_article(name):
    """Exact title, then without a leading article, then search — the same ladder
    the image fetcher learned to use, for the same reason."""
    for cand in (name, re.sub(r'^[Tt]he\s+', '', name)):
        d = api(WP_API, {'action': 'query', 'format': 'json', 'redirects': 1,
                         'titles': cand, 'prop': 'pageprops'})
        for pid, page in (d.get('query', {}).get('pages') or {}).items():
            if pid != '-1' and 'missing' not in page and 'disambiguation' not in (page.get('pageprops') or {}):
                return page.get('title')
    d = api(WP_API, {'action': 'query', 'format': 'json', 'list': 'search',
                     'srsearch': name, 'srlimit': 1, 'srnamespace': 0})
    hits = (d.get('query', {}) or {}).get('search') or []
    return hits[0]['title'] if hits else None


def title_matches_law(title, law):
    """Only accept an article whose title IS the law. A formula or a set of
    foreign names attached to the wrong article would be worse than none."""
    t, n = norm(title), norm(law['name'])
    strip = lambda x: re.sub(r"^the\s+", '', x).replace("'s", '')
    return strip(t) == strip(n)


# --------------------------------------------------------------------------- formula

def do_formula(laws, facts, args):
    stats = {'ok': 0, 'have': 0, 'no_article': 0, 'not_the_law': 0, 'no_formula': 0, 'error': 0}
    for i, law in enumerate(laws, 1):
        rec = facts.setdefault(law['slug'], {})
        if 'formula' in rec:
            stats['have'] += 1
            continue
        try:
            title = resolve_article(law['name'])
            if not title:
                stats['no_article'] += 1
                continue
            if not title_matches_law(title, law):
                stats['not_the_law'] += 1
                continue
            qid, ent = wd_entity(title)
            if not ent:
                stats['no_formula'] += 1
                continue
            tex = None
            for v in claim_values(ent, 'P2534'):
                if isinstance(v, dict):
                    tex = v.get('text')
                elif isinstance(v, str):
                    tex = v
                if tex:
                    break
            if not tex:
                stats['no_formula'] += 1
                continue
            # Render through Wikimedia's own math service: the page then needs no
            # math library, and the SVG is the same one Wikipedia serves.
            headers = sh(['curl', '-sS', '-A', UA, '--max-time', '30', '-D', '-', '-o', '/dev/null',
                          '-X', 'POST', MATH_CHECK, '-H', 'Content-Type: application/x-www-form-urlencoded',
                          '--data-urlencode', 'q=' + tex]).decode('utf-8', 'replace')
            m = re.search(r'(?im)^x-resource-location:\s*(\S+)', headers)
            if not m:
                stats['error'] += 1
                continue
            svg = sh(['curl', '-sS', '-A', UA, '--max-time', '30', MATH_SVG + m.group(1)])
            if b'<svg' not in svg[:400]:
                stats['error'] += 1
                continue
            if not args.dry_run:
                os.makedirs(FORMULA_DIR, exist_ok=True)
                with io.open(os.path.join(FORMULA_DIR, law['slug'] + '.svg'), 'wb') as fh:
                    fh.write(svg)
            rec['formula'] = {
                'tex': tex, 'qid': qid,
                'source': f'https://www.wikidata.org/wiki/{qid}',
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
            }
            stats['ok'] += 1
            if not args.dry_run:
                save_facts(facts)
            print(f'  OK {i}/{len(laws)}  {law["name"]} — {tex[:52]}', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  {law["name"]}: {e}', flush=True)
        time.sleep(0.1)
    return stats


# --------------------------------------------------------------------------- names

def do_names(laws, facts, args):
    stats = {'ok': 0, 'have': 0, 'no_article': 0, 'not_the_law': 0, 'none': 0, 'error': 0}
    for i, law in enumerate(laws, 1):
        rec = facts.setdefault(law['slug'], {})
        if 'names' in rec:
            stats['have'] += 1
            continue
        try:
            title = resolve_article(law['name'])
            if not title:
                stats['no_article'] += 1
                continue
            if not title_matches_law(title, law):
                stats['not_the_law'] += 1
                continue
            d = api(WD_API, {'action': 'wbgetentities', 'format': 'json', 'sites': 'enwiki',
                             'titles': title, 'props': 'labels', 'languages': '|'.join(LANGS)})
            got, qid = {}, None
            for q, ent in (d.get('entities') or {}).items():
                if not q.startswith('Q'):
                    continue
                qid = q
                for lang, lab in (ent.get('labels') or {}).items():
                    if lang in LANGS and lab.get('value'):
                        got[lang] = lab['value']
            if len(got) < 3:
                stats['none'] += 1
                continue
            rec['names'] = {'labels': got, 'qid': qid,
                            'source': f'https://www.wikidata.org/wiki/{qid}'}
            stats['ok'] += 1
            if not args.dry_run:
                save_facts(facts)
            print(f'  OK {i}/{len(laws)}  {law["name"]} — {len(got)} languages', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  {law["name"]}: {e}', flush=True)
        time.sleep(0.1)
    return stats


# --------------------------------------------------------------------------- ngram

def do_ngram(laws, facts, args):
    """Google Books frequency for the law's NAME.

    A measurement of the phrase, not of the idea: Occam's razor is far older
    than the phrase "Occam's razor", and the page has to say so rather than let
    a chart imply otherwise."""
    Y0, Y1 = 1800, 2019
    stats = {'ok': 0, 'have': 0, 'flat': 0, 'error': 0}
    for i, law in enumerate(laws, 1):
        rec = facts.setdefault(law['slug'], {})
        if 'ngram' in rec:
            stats['have'] += 1
            continue
        try:
            phrase = re.sub(r'^The\s+', '', law['name'])
            raw = sh(['curl', '-sS', '-A', UA, '--max-time', '30',
                      f'{NGRAM}?content={quote(phrase)}&year_start={Y0}&year_end={Y1}'
                      f'&corpus=en-2019&smoothing=3'])
            data = json.loads(raw.decode('utf-8', 'replace') or '[]')
            if not data or not data[0].get('timeseries'):
                stats['flat'] += 1
                continue
            series = data[0]['timeseries']
            peak = max(series)
            if peak <= 0:
                stats['flat'] += 1
                continue
            # Store as per-mille of the phrase's own peak: the absolute
            # frequencies are 1e-9 and unreadable, and the shape is the point.
            rec['ngram'] = {
                'phrase': data[0].get('ngram') or phrase,
                'from': Y0, 'to': Y1,
                'peak': peak,
                'series': [round(v / peak * 1000) for v in series],
                'source': 'https://books.google.com/ngrams/',
            }
            stats['ok'] += 1
            if not args.dry_run:
                save_facts(facts)
            print(f'  OK {i}/{len(laws)}  {law["name"]}', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  {law["name"]}: {e}', flush=True)
        time.sleep(0.35)   # unofficial endpoint — go gently
    return stats


# --------------------------------------------------------------------------- audio + origin

def audio_word(file_title):
    """The word actually spoken in a Commons pronunciation file.

    Lingua Libre names files "LL-Q150 (fra)-Speaker-word.wav", and the older
    convention is "Fr-word.ogg". Anything else we cannot read confidently, so we
    do not guess: returning None means the file is rejected."""
    name = re.sub(r'^File:', '', file_title)
    name = re.sub(r'\.(wav|ogg|oga|mp3|flac)$', '', name, flags=re.I)
    m = re.match(r'^LL-Q\d+\s*\([a-z]+\)-[^-]+-(.+)$', name)
    if m:
        return m.group(1)
    m = re.match(r'^[A-Za-z]{2}(?:-[a-z]{2})?(?:-[a-z]+)?-(.+)$', name)
    if m:
        return m.group(1)
    return None


def do_audio_and_origin(laws, facts, args):
    """Per-person facts, keyed by the namesake rather than the law."""
    people = {}
    for law in laws:
        na = (law.get('namedAfter') or '').strip()
        if na:
            people.setdefault(na, []).append(law['slug'])

    pf = facts.setdefault('_people', {})
    names = list(people)
    if args.limit:
        names = names[:args.limit]

    stats = {'audio': 0, 'origin': 0, 'have': 0, 'no_item': 0, 'error': 0}
    for i, person in enumerate(names, 1):
        slug = slugify(person)
        rec = pf.setdefault(slug, {'person': person})
        if 'audio' in rec and 'origin' in rec:
            stats['have'] += 1
            continue
        try:
            title = resolve_article(person)
            if not title:
                stats['no_item'] += 1
                continue
            qid, ent = wd_entity(title)
            if not ent:
                stats['no_item'] += 1
                continue

            # ---- birthplace -> coordinates
            if 'origin' not in rec:
                for v in claim_values(ent, 'P19')[:1]:
                    place_q = v.get('id') if isinstance(v, dict) else None
                    if not place_q:
                        continue
                    d = api(WD_API, {'action': 'wbgetentities', 'format': 'json',
                                     'ids': place_q, 'props': 'labels|claims', 'languages': 'en'})
                    pe = (d.get('entities') or {}).get(place_q) or {}
                    coords = claim_values(pe, 'P625')
                    label = ((pe.get('labels') or {}).get('en') or {}).get('value')
                    if coords and label:
                        c = coords[0]
                        rec['origin'] = {
                            'place': label,
                            'lat': round(float(c['latitude']), 4),
                            'lon': round(float(c['longitude']), 4),
                            'source': f'https://www.wikidata.org/wiki/{qid}',
                        }
                        stats['origin'] += 1

            # ---- pronunciation, accepted only when the spoken word IS the name
            if 'audio' not in rec:
                surname = person.split(' ')[-1]
                cands = []
                for v in claim_values(ent, 'P443'):
                    if isinstance(v, str):
                        cands.append('File:' + v)
                d = api(COMMONS_API, {'action': 'query', 'format': 'json', 'list': 'search',
                                      'srsearch': surname + ' pronunciation', 'srnamespace': 6, 'srlimit': 10})
                cands += [h['title'] for h in (d.get('query', {}) or {}).get('search', [])]
                for ft in cands:
                    if not re.search(r'\.(wav|ogg|oga|mp3|flac)$', ft, re.I):
                        continue
                    spoken = audio_word(ft)
                    if not spoken or norm(spoken) not in (norm(surname), norm(person)):
                        continue
                    info = api(COMMONS_API, {'action': 'query', 'format': 'json', 'titles': ft,
                                             'prop': 'imageinfo', 'iiprop': 'url|extmetadata'})
                    page = list((info.get('query', {}) or {}).get('pages', {}).values())[0]
                    ii = (page.get('imageinfo') or [{}])[0]
                    em = ii.get('extmetadata') or {}
                    lic = str((em.get('License') or {}).get('value') or '')
                    if not AUDIO_LICENCE_OK.match(lic):
                        continue
                    url = ii.get('url')
                    if not url:
                        continue
                    ext = os.path.splitext(url)[1].lower() or '.ogg'
                    if not args.dry_run:
                        os.makedirs(AUDIO_DIR, exist_ok=True)
                        with io.open(os.path.join(AUDIO_DIR, slug + ext), 'wb') as fh:
                            fh.write(sh(['curl', '-sSL', '-A', UA, '--max-time', '60', url]))
                    rec['audio'] = {
                        'file': re.sub(r'^File:', '', ft), 'ext': ext,
                        'spoken': spoken,
                        'licence': re.sub(r'<[^>]+>', '', str((em.get('LicenseShortName') or {}).get('value') or lic)),
                        'artist': re.sub(r'<[^>]+>', '', str((em.get('Artist') or {}).get('value') or 'Unknown')),
                        'source': ii.get('descriptionurl') or '',
                    }
                    stats['audio'] += 1
                    break
            if not args.dry_run:
                save_facts(facts)
            if 'audio' in rec or 'origin' in rec:
                bits = []
                if rec.get('audio'):
                    bits.append('audio')
                if rec.get('origin'):
                    bits.append(rec['origin']['place'])
                print(f'  OK {i}/{len(names)}  {person} — {", ".join(bits)}', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  {person}: {e}', flush=True)
        time.sleep(0.12)
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--what', default='formula')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--only', default='')
    args = ap.parse_args()

    laws = load_laws()
    if args.only:
        laws = [l for l in laws if args.only.lower() in l['name'].lower()]
    if args.limit:
        laws = laws[:args.limit]
    facts = load_facts()

    runners = {'formula': do_formula, 'names': do_names, 'ngram': do_ngram,
               'audio': do_audio_and_origin, 'origin': do_audio_and_origin}
    done = set()
    for what in args.what.split(','):
        what = what.strip()
        fn = runners.get(what)
        if not fn or fn in done:
            continue
        done.add(fn)
        print(f'\n===== {what} =====', flush=True)
        stats = fn(laws, facts, args)
        print(json.dumps(stats, indent=2))
    if not args.dry_run:
        save_facts(facts)
        print(f'\nwrote {FACTS}')


if __name__ == '__main__':
    sys.exit(main())
