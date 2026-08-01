#!/usr/bin/env python3
"""Fetch REAL, correctly-licensed images for the corpus. Nothing here is generated.

This is a curation tool, not part of `npm run build`. It runs by hand, writes its
results into src/data/images.json plus src/assets/img/, and the build then treats
that manifest as ordinary verified corpus data.

Three things it refuses to do, because each one would be a fabrication:

  1. Invent an image. Every file comes from Wikimedia Commons and keeps its
     source URL, so any claim on the page can be checked against the original.

  2. Show the wrong person. Matching a `namedAfter` string to a Wikipedia
     article is the dangerous step — "Charles Goodhart" is unambiguous, but
     plenty of namesakes share a name with an actor or a footballer. So a
     portrait is only accepted when the article ITSELF mentions the law that
     carries the name. If Amdahl's Law is not named in the Gene Amdahl article,
     we do not believe we have found the right Gene Amdahl, and we skip.

  3. Use an image we have no right to. Only public-domain and CC licences are
     accepted, by explicit allowlist; anything else — non-free, fair-use,
     unknown — is dropped. Author, licence and source are recorded for every
     accepted file so the page can carry the credit the licence requires.

Usage:
    python3 build/fetch-images.py --dry-run        # report coverage, write nothing
    python3 build/fetch-images.py                  # fetch and write
    python3 build/fetch-images.py --limit 25       # small batch
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
from collections import OrderedDict

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAWS_DIR = os.path.join(ROOT, 'src', 'data', 'laws')
IMG_DIR = os.path.join(ROOT, 'src', 'assets', 'img', 'people')
MANIFEST = os.path.join(ROOT, 'src', 'data', 'images.json')

WP_API = 'https://en.wikipedia.org/w/api.php'
COMMONS_API = 'https://commons.wikimedia.org/w/api.php'
UA = 'TheLawTome/1.0 (https://conyso.com/lawtome; image curation for an encyclopedia of named laws)'

# Licences we may publish. Everything else — non-free, fair-use, "unknown",
# CC-BY-NC (non-commercial), CC-BY-ND (no derivatives, and we resize) — is
# rejected. Matched against Commons' machine-readable `License` field.
LICENCE_OK = re.compile(
    r'^(pd|cc0|cc-pd|cc-by(-sa)?-([1-4]\.0|2\.5|3\.0)([a-z-]*)?|cc-by(-sa)?)$'
)
PD_HINT = re.compile(r'^(pd|public.?domain|cc0)', re.I)

# Portrait rendered on a law page, and the thumbnail used in the eponym index.
SIZES = (('', 320), ('-sm', 72))


def sh(cmd):
    """Run a command, returning stdout bytes. curl is used for every network call
    so requests go through the sandbox's configured proxy and CA bundle."""
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.decode('utf-8', 'replace')[:300])
    return p.stdout


def api(url, params):
    q = '&'.join(f'{k}={subprocess.list2cmdline([str(v)])}' for k, v in params.items())
    # build the query string ourselves so we control encoding
    from urllib.parse import urlencode
    full = url + '?' + urlencode(params)
    raw = sh(['curl', '-sS', '-A', UA, '--max-time', '30', full])
    return json.loads(raw.decode('utf-8', 'replace'))


def slugify(s):
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s


def norm(s):
    """Fold a string for comparison: strip accents, unify the several apostrophes
    Wikipedia and the corpus disagree about, collapse whitespace, lowercase."""
    s = unicodedata.normalize('NFD', str(s))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = s.replace('’', "'").replace('‘', "'").replace('–', '-').replace('—', '-')
    return re.sub(r'\s+', ' ', s).strip().lower()


def split_people(named_after):
    """'Michelson and Morley' -> two names. Compound namesakes are common enough
    (83 of 628) that dropping them would leave visible holes."""
    s = re.sub(r'\s*&\s*', ' and ', str(named_after))
    parts = re.split(r',\s*and\s+|\s+and\s+|,\s*', s)
    out = []
    for p in parts:
        p = p.strip(' .')
        # a bare surname or an initial is too weak to identify anyone
        if len(p) >= 4 and ' ' in p:
            out.append(p)
    return out or ([named_after.strip()] if len(str(named_after).strip()) >= 4 else [])


def load_people():
    """namesake -> the laws that carry the name."""
    people = OrderedDict()
    for fn in sorted(os.listdir(LAWS_DIR)):
        if not fn.endswith('.json'):
            continue
        with io.open(os.path.join(LAWS_DIR, fn), encoding='utf-8') as fh:
            law = json.load(fh)
        na = (law.get('namedAfter') or '').strip()
        if not na:
            continue
        for person in split_people(na):
            people.setdefault(person, []).append({
                'slug': law['slug'], 'name': law['name'],
                'aliases': law.get('aliases') or [],
            })
    return people


def wiki_article(title):
    """Resolve a title to an article, following redirects. Returns (title, plaintext)
    or (None, None) for a miss, a disambiguation page, or a list article."""
    d = api(WP_API, {
        'action': 'query', 'format': 'json', 'redirects': 1, 'titles': title,
        'prop': 'extracts|pageprops', 'explaintext': 1, 'exsectionformat': 'plain',
    })
    pages = d.get('query', {}).get('pages', {})
    for pid, page in pages.items():
        if pid == '-1' or 'missing' in page:
            return None, None
        props = page.get('pageprops') or {}
        if 'disambiguation' in props:
            return None, None
        t = page.get('title', '')
        if t.startswith('List of'):
            return None, None
        return t, page.get('extract') or ''
    return None, None


def law_pattern(name):
    """A regex for a law name as an article would actually write it.

    A plain substring test is too brittle to be useful: the corpus says
    "Chebyshev's Inequality" and the article says "Chebyshev inequality", so an
    exact match rejects a perfectly good portrait. This keeps every significant
    word, in order, but lets the connective tissue vary — an optional possessive,
    a hyphen or an en dash instead of a space, an interposed "the"/"of"/"a".
    Word boundaries at both ends stop a token matching inside a longer word."""
    parts = [p for p in re.split(r'\s+', re.sub(r'^the\s+', '', norm(name))) if p]
    if not parts:
        return None
    joint = r"['’]?s?[\s\-–—]+(?:the\s+|of\s+|a\s+)?"
    return re.compile(r'\b' + joint.join(re.escape(p.rstrip("'s")) for p in parts) + r'\b')


# The words an eponym takes in English. Used by the second confirmation path.
EPONYM_KINDS = (
    'law|laws|rule|rules|principle|effect|equation|theorem|lemma|paradox|razor|'
    'criterion|criteria|inequality|constant|number|conjecture|hypothesis|dogma|'
    'process|experiment|test|problem|argument|thesis|maxim|distribution|cycle|'
    'radiation|scale|limit|series|transform|identity|formula|model|curve|ratio'
)


def confirms_law(text, laws, person):
    """The article must show that this person is the one the law is named for.
    This is the whole defence against publishing a photo of the wrong person: a
    different Gene Amdahl's article does not discuss Amdahl's law.

    Two ways to pass, both requiring the article to link the name to an eponym:
      name   — the article writes out the law (or one of its aliases)
      eponym — the article gives the surname one of the standard eponym nouns.
               Needed because articles and the corpus often disagree on which:
               we file "Cherenkov Radiation", the article says "Cherenkov effect".
    Returns (law name, which path), or (None, None)."""
    hay = norm(text)
    if not hay:
        return None, None
    for law in laws:
        for candidate in [law['name']] + list(law.get('aliases') or []):
            pat = law_pattern(candidate)
            if pat and pat.search(hay):
                return law['name'], 'name'
    surname = (norm(person).split(' ') or [''])[-1]
    if len(surname) >= 4:
        pat = re.compile(r'\b' + re.escape(surname) + r"['’]?s?[\s\-–—]+(?:" + EPONYM_KINDS + r')\b')
        if pat.search(hay):
            return laws[0]['name'], 'eponym'
    return None, None


def page_image(title, width=900):
    """The article's lead image, as a URL we can actually decode.

    Prefer Wikipedia's own rendered thumbnail over the original file. Most law
    articles lead with an SVG diagram — exactly the figures worth having — and
    Pillow cannot open SVG, so asking for the original silently loses them. The
    thumbnail endpoint rasterises SVG to PNG and caps the pixel size, which also
    spares us downloading 40MB scans of 19th-century plates."""
    d = api(WP_API, {
        'action': 'query', 'format': 'json', 'redirects': 1, 'titles': title,
        'prop': 'pageimages', 'piprop': 'original|thumbnail|name', 'pithumbsize': width,
    })
    for page in d.get('query', {}).get('pages', {}).values():
        thumb = (page.get('thumbnail') or {}).get('source')
        orig = (page.get('original') or {}).get('source')
        url = thumb or orig
        if url:
            return url, page.get('pageimage')
    return None, None


def strip_tags(html):
    """Plain text from a Commons metadata field.

    Commons stores several fields as multilingual markup — one <span> per
    language, often with identical content — so a naive tag strip yields
    "Unknown authorUnknown author". Separate the spans, then drop repeats."""
    import html as _html
    text = _html.unescape(re.sub(r'<[^>]+>', '\n', str(html or '')))
    parts, seen = [], set()
    for part in (p.strip() for p in text.split('\n')):
        part = re.sub(r'\s+', ' ', part)
        if part and part.lower() not in seen:
            seen.add(part.lower())
            parts.append(part)
    return ', '.join(parts)


def commons_licence(file_name):
    """Licence + attribution for a Commons file, or None if we may not use it."""
    d = api(COMMONS_API, {
        'action': 'query', 'format': 'json', 'titles': 'File:' + file_name,
        'prop': 'imageinfo', 'iiprop': 'extmetadata|url',
    })
    for page in d.get('query', {}).get('pages', {}).values():
        info = (page.get('imageinfo') or [{}])[0]
        em = info.get('extmetadata') or {}

        def val(k):
            return (em.get(k) or {}).get('value')

        lic = str(val('License') or '').strip().lower()
        short = strip_tags(val('LicenseShortName')) or ''
        if not (LICENCE_OK.match(lic) or PD_HINT.match(lic) or PD_HINT.match(short)):
            return None
        return {
            'licence': short or lic,
            'licenceUrl': val('LicenseUrl') or '',
            'artist': strip_tags(val('Artist')) or 'Unknown',
            'source': info.get('descriptionurl') or '',
            'file': file_name,
        }
    return None


def fetch_and_resize(url, slug, dry):
    """Download once, write a portrait and a thumbnail. Returns (w, h) of the portrait."""
    if dry:
        return None
    raw = sh(['curl', '-sSL', '-A', UA, '--max-time', '60', url])
    im = Image.open(io.BytesIO(raw))
    im = im.convert('RGB')
    out = None
    os.makedirs(IMG_DIR, exist_ok=True)
    for suffix, width in SIZES:
        c = im.copy()
        if c.width > width:
            c = c.resize((width, max(1, round(c.height * width / c.width))), Image.LANCZOS)
        path = os.path.join(IMG_DIR, f'{slug}{suffix}.webp')
        c.save(path, 'WEBP', quality=76, method=6)
        if suffix == '':
            out = (c.width, c.height)
    return out



# ---------------------------------------------------------------------------
# Figures for the laws themselves: the diagram, apparatus photograph or plate
# that illustrates the idea rather than the person. Same discipline as the
# portraits — the image must come from the law's OWN article, so it cannot drift
# onto an unrelated subject, and its licence must be one we may publish.

FIGURE_DIR = os.path.join(ROOT, 'src', 'assets', 'img', 'figures')
FIGURE_SIZES = (('', 640),)


def article_is_the_law(title, extract, law):
    """The article we landed on must actually be about this law.

    Two ways to be sure, in order of strength:
      title  — the article title IS the law name (modulo case, articles, the
               possessive and the punctuation Wikipedia normalises)
      lead   — the law is named in the article's opening sentence, which is how
               Wikipedia always opens a definition ("Hooke's law is a law of
               physics that…")
    A mere mention further down is NOT enough: half the physics corpus mentions
    half the other half, and that would attach the wrong diagram."""
    t, n = norm(title), norm(law['name'])
    if t == n or t == re.sub(r'^the\s+', '', n) or re.sub(r'^the\s+', '', t) == re.sub(r'^the\s+', '', n):
        return 'title'
    lead = norm((extract or '').split('\n')[0][:400])
    pat = law_pattern(law['name'])
    if pat and lead and pat.search(lead):
        return 'lead'
    return None


def fetch_figures(args):
    """One figure per law, from the law's own Wikipedia article."""
    laws = []
    for fn in sorted(os.listdir(LAWS_DIR)):
        if not fn.endswith('.json'):
            continue
        with io.open(os.path.join(LAWS_DIR, fn), encoding='utf-8') as fh:
            laws.append(json.load(fh))

    manifest = {}
    if os.path.exists(MANIFEST):
        with io.open(MANIFEST, encoding='utf-8') as fh:
            manifest = json.load(fh)
    figures = manifest.setdefault('figures', {})
    # A portrait already carried by the people manifest must not be re-used as a
    # "figure" — the law page would then show the same face twice.
    portraits = {v.get('file') for v in (manifest.get('people') or {}).values()}

    if args.only:
        laws = [l for l in laws if args.only.lower() in l['name'].lower()]
    if args.limit:
        laws = laws[:args.limit]

    stats = {'have': 0, 'ok': 0, 'no_article': 0, 'not_the_law': 0, 'no_image': 0,
             'bad_licence': 0, 'is_portrait': 0, 'error': 0}
    for i, law in enumerate(laws, 1):
        if law['slug'] in figures:
            stats['have'] += 1
            continue
        try:
            title, text = wiki_article(law['name'])
            if not title:
                stats['no_article'] += 1
                continue
            via = article_is_the_law(title, text, law)
            if not via:
                stats['not_the_law'] += 1
                continue
            url, file_name = page_image(title)
            if not url or not file_name:
                stats['no_image'] += 1
                continue
            if file_name in portraits:
                stats['is_portrait'] += 1
                continue
            lic = commons_licence(file_name)
            if not lic:
                stats['bad_licence'] += 1
                continue
            dims = None
            if not args.dry_run:
                raw = sh(['curl', '-sSL', '-A', UA, '--max-time', '60', url])
                im = Image.open(io.BytesIO(raw)).convert('RGB')
                for _suffix, width in FIGURE_SIZES:
                    c = im.copy()
                    if c.width > width:
                        c = c.resize((width, max(1, round(c.height * width / c.width))), Image.LANCZOS)
                    os.makedirs(FIGURE_DIR, exist_ok=True)
                    c.save(os.path.join(FIGURE_DIR, f'{law["slug"]}.webp'), 'WEBP', quality=78, method=6)
                    dims = (c.width, c.height)
            entry = {
                'law': law['name'], 'slug': law['slug'],
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                'confirmedVia': via, **lic,
            }
            if dims:
                entry['width'], entry['height'] = dims
            figures[law['slug']] = entry
            stats['ok'] += 1
            if not args.dry_run:
                manifest['figures'] = figures
                with io.open(MANIFEST, 'w', encoding='utf-8') as fh:
                    json.dump(manifest, fh, ensure_ascii=False, indent=2, sort_keys=True)
                    fh.write('\n')
            print(f'  OK {i}/{len(laws)}  {law["name"]} — {lic["licence"]} ({via})', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  error  {law["name"]}: {e}', flush=True)
        time.sleep(0.12)

    print('\n' + json.dumps(stats, indent=2))


def save(manifest, people_manifest):
    manifest['people'] = people_manifest
    with io.open(MANIFEST, 'w', encoding='utf-8') as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2, sort_keys=True)
        fh.write('\n')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--only', default='')
    ap.add_argument('--mode', choices=('people', 'figures'), default='people')
    args = ap.parse_args()

    if args.mode == 'figures':
        return fetch_figures(args)

    people = load_people()
    manifest = {}
    if os.path.exists(MANIFEST):
        with io.open(MANIFEST, encoding='utf-8') as fh:
            manifest = json.load(fh)
    people_manifest = manifest.setdefault('people', {})

    names = [n for n in people if not args.only or args.only.lower() in n.lower()]
    if args.limit:
        names = names[:args.limit]

    stats = {'have': 0, 'ok': 0, 'no_article': 0, 'unconfirmed': 0, 'no_image': 0, 'bad_licence': 0, 'error': 0}
    for i, person in enumerate(names, 1):
        slug = slugify(person)
        if slug in people_manifest:
            stats['have'] += 1
            continue
        laws = people[person]
        try:
            title, text = wiki_article(person)
            if not title:
                stats['no_article'] += 1
                print(f'  -  no article        {person}', flush=True)
                continue
            confirmed, via = confirms_law(text, laws, person)
            if not confirmed:
                stats['unconfirmed'] += 1
                print(f'  ?  unconfirmed      {person} ({title}) — article never names {laws[0]["name"]}', flush=True)
                continue
            url, file_name = page_image(title)
            if not url or not file_name:
                stats['no_image'] += 1
                print(f'  -  no image         {person} ({title})', flush=True)
                continue
            lic = commons_licence(file_name)
            if not lic:
                stats['bad_licence'] += 1
                print(f'  x  licence refused  {person} — {file_name}', flush=True)
                continue
            dims = fetch_and_resize(url, slug, args.dry_run)
            entry = {
                'person': person,
                'slug': slug,
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                'confirmedBy': confirmed,
                'confirmedVia': via,
                **lic,
            }
            if dims:
                entry['width'], entry['height'] = dims
            people_manifest[slug] = entry
            stats['ok'] += 1
            if not args.dry_run:
                save(manifest, people_manifest)   # checkpoint every success
            print(f'  OK {i}/{len(names)}  {person} — {lic["licence"]}', flush=True)
        except Exception as e:  # a single bad file must not kill a 600-name run
            stats['error'] += 1
            print(f'  !  error            {person}: {e}', flush=True)
        time.sleep(0.12)  # be a polite API client

    print('\n' + json.dumps(stats, indent=2))
    if not args.dry_run:
        save(manifest, people_manifest)
        print(f'wrote {MANIFEST} ({len(people_manifest)} people)')


if __name__ == '__main__':
    sys.exit(main())
