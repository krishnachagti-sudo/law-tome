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
import collections
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


def api(url, params, tries=3):
    """A MediaWiki API call, retried on a blank or unparseable body.

    Over a 700-item run the occasional request comes back empty — a throttle, a
    proxy hiccup, a dropped connection. Without a retry that surfaces as
    "Expecting value: line 1 column 1" and silently costs coverage, so back off
    briefly and ask again rather than treating a blip as an absent article."""
    from urllib.parse import urlencode
    full = url + '?' + urlencode(params)
    last = None
    for attempt in range(tries):
        try:
            raw = sh(['curl', '-sS', '-A', UA, '--max-time', '30', full])
            return json.loads(raw.decode('utf-8', 'replace'))
        except Exception as e:
            last = e
            time.sleep(0.6 * (attempt + 1))
    raise last


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




def resolve_person_article(person):
    """Find a person's article, trying the exact name and then a search.

    The portrait run was written before the figure run taught us that exact-title
    lookup misses a lot: 82 namesakes came back "no article" when Wikipedia files
    them under a fuller or shorter form ("Bill Atkinson" vs "William Atkinson",
    "Fick" vs "Adolf Eugen Fick"). Searching is safe here for the same reason it
    is safe for laws — the candidate still has to clear confirms_law, which
    requires the article to tie this name to the eponym. A search that surfaces
    the wrong Gene Amdahl is rejected exactly as an exact-title miss would be."""
    title, text = wiki_article(person)
    if title:
        return title, text
    try:
        d = api(WP_API, {
            'action': 'query', 'format': 'json', 'list': 'search',
            'srsearch': person, 'srlimit': 3, 'srnamespace': 0,
        })
        for hit in (d.get('query', {}) or {}).get('search', []) or []:
            title, text = wiki_article(hit.get('title', ''))
            if title:
                return title, text
    except Exception:
        pass
    return None, None


def resolve_law_article(name):
    """Find the Wikipedia article for a law, trying the ways an encyclopedia
    actually files it.

    An exact-title lookup alone missed 679 of 1,119 laws: we write "The Cobra
    Effect" and Wikipedia files "Cobra effect", we write "The Law of Demand" and
    it lives under "Demand". So: exact title, then without the leading article,
    then a search. The search hit is NOT trusted on its own — every candidate
    still has to clear article_is_the_law, which demands the title match the law
    or the law be named in the opening sentence. A loose search plus a strict
    gate finds more and admits nothing extra."""
    for candidate in (name, re.sub(r'^[Tt]he\s+', '', name)):
        title, text = wiki_article(candidate)
        if title:
            return title, text
    try:
        d = api(WP_API, {
            'action': 'query', 'format': 'json', 'list': 'search',
            'srsearch': name, 'srlimit': 3, 'srnamespace': 0,
        })
        for hit in (d.get('query', {}) or {}).get('search', []) or []:
            title, text = wiki_article(hit.get('title', ''))
            if title:
                return title, text
    except Exception:
        pass
    return None, None


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
            title, text = resolve_law_article(law['name'])
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


# ---------------------------------------------------------------------------
# Artifacts: the sketch, apparatus photograph, manuscript page or plate that
# sits further DOWN a law's article rather than at the top of it.
#
# The figures pass only ever looks at the lead image, which is why 684 laws came
# away with nothing: plenty of articles open with no image at all, or with a
# portrait we already show, while the interesting object — Hooke's drawing,
# Milgram's shock box, the original title page — is three sections in. This pass
# walks the article's full image list and takes the first one that is a real
# illustration under a licence we may publish.
#
# The subject gate is unchanged: we only ever look inside an article that has
# already been confirmed to BE this law. What changes is which image we take
# from it, never whose article we take it from.

# Files Wikipedia puts on a page that are not illustrations of anything: chrome,
# badges, icons, flags, and the maintenance furniture of the encyclopedia itself.
ARTIFACT_REJECT = re.compile(
    r'(logo|wiki(pedia|tionary|source|quote|books|data|versity|news|species|media)|'
    r'question_book|ambox|edit-|symbol|padlock|portal|icon|banner|stub|'
    r'^flag_of|_flag\.|disambig|nuvola|crystal_|folder_|magnify|'
    r'red_pog|blue_pog|loudspeaker|speakerlink|text_document|'
    r'increase2?\.|decrease2?\.|steady2?\.|yes_check|x_mark|'
    r'\.ogg$|\.oga$|\.wav$|\.webm$|\.ogv$)', re.I)


def reject_filename(name):
    """Wikipedia's file names vary the separator freely — "Question book-new.svg"
    and "Question_book-new.svg" are the same furniture — so fold both to one form
    before matching, or the filter passes exactly the files it was written to stop."""
    return bool(ARTIFACT_REJECT.search(str(name).replace(' ', '_')))


def article_images(title):
    """Every file used on an article, in page order."""
    d = api(WP_API, {
        'action': 'query', 'format': 'json', 'redirects': 1, 'titles': title,
        'prop': 'images', 'imlimit': 40,
    })
    for page in d.get('query', {}).get('pages', {}).values():
        return [im.get('title', '') for im in (page.get('images') or [])]
    return []


def commons_file(file_title, width=900):
    """Licence, credit and a RENDERED url for a Commons file.

    iiurlwidth gives back a rasterised thumbnail, which is what makes SVG
    diagrams usable at all and stops us pulling multi-megabyte plate scans."""
    d = api(COMMONS_API, {
        'action': 'query', 'format': 'json', 'titles': file_title,
        'prop': 'imageinfo', 'iiprop': 'extmetadata|url|size', 'iiurlwidth': width,
    })
    for page in d.get('query', {}).get('pages', {}).values():
        info = (page.get('imageinfo') or [{}])[0]
        if not info:
            return None
        em = info.get('extmetadata') or {}

        def val(k):
            return (em.get(k) or {}).get('value')

        # Skip anything too small to be an illustration — icons and badges that
        # slipped past the name filter.
        if (info.get('width') or 0) < 260:
            return None
        lic = str(val('License') or '').strip().lower()
        short = strip_tags(val('LicenseShortName')) or ''
        if not (LICENCE_OK.match(lic) or PD_HINT.match(lic) or PD_HINT.match(short)):
            return None
        return {
            'url': info.get('thumburl') or info.get('url'),
            'licence': short or lic,
            'licenceUrl': val('LicenseUrl') or '',
            'artist': strip_tags(val('Artist')) or 'Unknown',
            'source': info.get('descriptionurl') or '',
            'file': file_title.replace('File:', ''),
        }
    return None



# Words that carry no subject information: the grammar of a law's name, and the
# nouns every eponym ends in. "Law", "effect" and "the" match half of Commons.
SUBJECT_STOPWORDS = set(
    'the a an of and or in on for to with is are law laws rule rules principle '
    'effect equation theorem lemma paradox razor criterion criteria problem '
    'model theory hypothesis conjecture experiment argument thesis maxim'.split()
)


def subject_tokens(law):
    """The words that actually identify this law, for matching against filenames."""
    words = re.split(r'[^a-z0-9]+', norm(law.get('name') or ''))
    toks = {w for w in words if len(w) >= 4 and w not in SUBJECT_STOPWORDS}
    for alt in (law.get('aliases') or []):
        toks |= {w for w in re.split(r'[^a-z0-9]+', norm(alt))
                 if len(w) >= 4 and w not in SUBJECT_STOPWORDS}
    return toks


def is_about_subject(file_name, tokens, law):
    """Does this file plausibly depict THIS law?

    Taking the first usable image on the page is too loose: it hands Scientific
    Realism a picture of Socrates and Russell's Teapot a portrait of Russell —
    both are on the page, neither shows the idea. So the filename has to share a
    significant word with the law's name. Some good diagrams get dropped by this,
    which is the right trade: a caption that says "figure illustrating X" over a
    picture of something else is a small lie, and the whole project rests on not
    telling those.

    A file named only for the namesake is rejected outright — that is a portrait,
    and the portrait already has its own panel on the page."""
    if not tokens:
        return False
    bare = norm(file_name.rsplit('.', 1)[0])
    words = set(re.split(r'[^a-z0-9]+', bare))
    hits = tokens & words
    if not hits:
        return False
    # A file named for the whole person is a portrait — "Bertrand Russell
    # transparent bg.png" on the Russell's Teapot page — and the portrait already
    # has its own panel. Matching the SURNAME alone would be wrong here: the
    # surname is usually in the law's name too, so it would also throw out
    # "Bragg's law.svg" and "Bayes continuous diagram.svg", which are the
    # diagrams we came for.
    person = [w for w in re.split(r'[^a-z0-9]+', norm(law.get('namedAfter') or '')) if len(w) >= 3]
    if len(person) >= 2 and all(w in words for w in person):
        return False
    return True


def fetch_artifacts(args):
    """Fill in laws the lead-image pass left empty."""
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
    portraits = {v.get('file') for v in (manifest.get('people') or {}).values()}

    todo = [l for l in laws if l['slug'] not in figures]
    if args.only:
        todo = [l for l in todo if args.only.lower() in l['name'].lower()]
    if args.limit:
        todo = todo[:args.limit]

    stats = {'ok': 0, 'no_article': 0, 'not_the_law': 0, 'no_usable_image': 0, 'error': 0}
    for i, law in enumerate(todo, 1):
        try:
            title, text = resolve_law_article(law['name'])
            if not title:
                stats['no_article'] += 1
                continue
            via = article_is_the_law(title, text, law)
            if not via:
                stats['not_the_law'] += 1
                continue
            tokens = subject_tokens(law)
            chosen = None
            for file_title in article_images(title):
                bare = file_title.replace('File:', '')
                if reject_filename(bare) or bare in portraits:
                    continue
                if not re.search(r'\.(jpe?g|png|gif|svg|tiff?)$', bare, re.I):
                    continue
                if not is_about_subject(bare, tokens, law):
                    continue
                info = commons_file(file_title)
                if info:
                    chosen = info
                    break
            if not chosen:
                stats['no_usable_image'] += 1
                continue
            dims = None
            if not args.dry_run:
                raw = sh(['curl', '-sSL', '-A', UA, '--max-time', '60', chosen['url']])
                im = Image.open(io.BytesIO(raw)).convert('RGB')
                if im.width > 640:
                    im = im.resize((640, max(1, round(im.height * 640 / im.width))), Image.LANCZOS)
                os.makedirs(FIGURE_DIR, exist_ok=True)
                im.save(os.path.join(FIGURE_DIR, f'{law["slug"]}.webp'), 'WEBP', quality=78, method=6)
                dims = (im.width, im.height)
            entry = {
                'law': law['name'], 'slug': law['slug'],
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                'confirmedVia': via, 'kind': 'artifact',
                'licence': chosen['licence'], 'licenceUrl': chosen['licenceUrl'],
                'artist': chosen['artist'], 'source': chosen['source'], 'file': chosen['file'],
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
            print(f'  OK {i}/{len(todo)}  {law["name"]} — {chosen["file"][:48]} ({chosen["licence"]})', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  error  {law["name"]}: {e}', flush=True)
        time.sleep(0.12)

    print('\n' + json.dumps(stats, indent=2))


# ---------------------------------------------------------------------------
# Second-chance passes. The first portrait run only ever looked at an article's
# LEAD image, and 149 namesakes failed on exactly that: the article exists, the
# person is confirmed, and there is simply no picture at the top. Their face is
# often further down, or recorded on Wikidata, or in their Commons category.

WIKIDATA_API = 'https://www.wikidata.org/w/api.php'

# Words that mark a file as a diagram rather than a person. A portrait slot must
# never be filled with a chart, however well the filename matches the surname —
# "Conway law diagram.svg" is about the law, not the man.
NOT_A_PERSON = re.compile(
    r'(diagram|chart|graph|plot|curve|equation|formula|schema|figure|fig\d|'
    r'map|logo|signature|grave|plaque|building|museum|university|award|medal)', re.I)


def wikidata_image(title):
    """The image Wikidata records for an article's subject (property P18).

    Wikipedia's pageimages API and Wikidata frequently disagree — an article with
    no lead image can still have a perfectly good photo recorded on the item."""
    d = api(WIKIDATA_API, {
        'action': 'wbgetentities', 'format': 'json', 'sites': 'enwiki',
        'titles': title, 'props': 'claims',
    })
    for ent in (d.get('entities') or {}).values():
        for claim in ((ent.get('claims') or {}).get('P18') or []):
            name = (((claim.get('mainsnak') or {}).get('datavalue') or {}).get('value'))
            if name:
                return 'File:' + str(name)
    return None


def commons_category_files(title):
    """Files in the subject's own Commons category (Wikidata P373).

    Scoped to the category, never a free-text Commons search: searching bare
    names returns census sheets and unrelated people, which is precisely the kind
    of near-miss this project must not publish."""
    d = api(WIKIDATA_API, {
        'action': 'wbgetentities', 'format': 'json', 'sites': 'enwiki',
        'titles': title, 'props': 'claims',
    })
    cat = None
    for ent in (d.get('entities') or {}).values():
        for claim in ((ent.get('claims') or {}).get('P373') or []):
            cat = (((claim.get('mainsnak') or {}).get('datavalue') or {}).get('value'))
    if not cat:
        return []
    d = api(COMMONS_API, {
        'action': 'query', 'format': 'json', 'list': 'categorymembers',
        'cmtitle': 'Category:' + cat, 'cmtype': 'file', 'cmlimit': 25,
    })
    return [m.get('title', '') for m in (d.get('query', {}) or {}).get('categorymembers', [])]


def looks_like_person_file(file_name, person):
    """Accept only a file named for this person and not obviously a diagram."""
    bare = norm(file_name.rsplit('.', 1)[0])
    words = set(re.split(r'[^a-z0-9]+', bare))
    parts = [w for w in re.split(r'[^a-z0-9]+', norm(person)) if len(w) >= 4]
    if not parts or not any(w in words for w in parts):
        return False
    return not NOT_A_PERSON.search(bare)


def fetch_people_second_pass(args):
    """Portraits for namesakes the lead-image pass could not serve."""
    people = load_people()
    manifest = {}
    if os.path.exists(MANIFEST):
        with io.open(MANIFEST, encoding='utf-8') as fh:
            manifest = json.load(fh)
    pm = manifest.setdefault('people', {})

    todo = [p for p in people if slugify(p) not in pm]
    if args.only:
        todo = [p for p in todo if args.only.lower() in p.lower()]
    if args.limit:
        todo = todo[:args.limit]

    stats = {'ok': 0, 'no_article': 0, 'unconfirmed': 0, 'nothing_usable': 0,
             'bad_licence': 0, 'error': 0}
    via_counts = collections.Counter()
    for i, person in enumerate(todo, 1):
        slug = slugify(person)
        laws = people[person]
        try:
            title, text = resolve_person_article(person)
            if not title:
                stats['no_article'] += 1
                continue
            confirmed, gate = confirms_law(text, laws, person)
            if not confirmed:
                stats['unconfirmed'] += 1
                continue
            # in order of how much we trust the association
            candidates = []
            wd = wikidata_image(title)
            if wd:
                candidates.append(('wikidata', wd))
            for f in article_images(title):
                candidates.append(('article', f))
            for f in commons_category_files(title):
                candidates.append(('commons-category', f))

            chosen = via = None
            for source, file_title in candidates:
                bare = file_title.replace('File:', '')
                if reject_filename(bare):
                    continue
                if not re.search(r'\.(jpe?g|png|tiff?)$', bare, re.I):
                    continue
                # Wikidata's P18 IS the subject's picture by definition, so it
                # needs no filename evidence; anything scraped off a page does.
                if source != 'wikidata' and not looks_like_person_file(bare, person):
                    continue
                info = commons_file(file_title, width=480)
                if info:
                    chosen, via = info, source
                    break
            if not chosen:
                stats['nothing_usable'] += 1
                continue
            if not args.dry_run:
                raw = sh(['curl', '-sSL', '-A', UA, '--max-time', '60', chosen['url']])
                im = Image.open(io.BytesIO(raw)).convert('RGB')
                os.makedirs(IMG_DIR, exist_ok=True)
                dims = None
                for suffix, width in SIZES:
                    c = im.copy()
                    if c.width > width:
                        c = c.resize((width, max(1, round(c.height * width / c.width))), Image.LANCZOS)
                    c.save(os.path.join(IMG_DIR, f'{slug}{suffix}.webp'), 'WEBP', quality=76, method=6)
                    if suffix == '':
                        dims = (c.width, c.height)
            pm[slug] = {
                'person': person, 'slug': slug,
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                'confirmedBy': confirmed, 'confirmedVia': gate, 'foundVia': via,
                'licence': chosen['licence'], 'licenceUrl': chosen['licenceUrl'],
                'artist': chosen['artist'], 'source': chosen['source'], 'file': chosen['file'],
            }
            if not args.dry_run and dims:
                pm[slug]['width'], pm[slug]['height'] = dims
            via_counts[via] += 1
            stats['ok'] += 1
            if not args.dry_run:
                save(manifest, pm)
            print(f'  OK {i}/{len(todo)}  {person} — {via} — {chosen["licence"]}', flush=True)
        except Exception as e:
            stats['error'] += 1
            print(f'  !  error  {person}: {e}', flush=True)
        time.sleep(0.12)
    print('\n' + json.dumps(stats, indent=2))
    print('found via:', dict(via_counts))


def fetch_source_scans(args):
    """Title pages and plates named for the work a law was first published in.

    The artifact pass matches a filename against the LAW's name, so it can never
    find "An Inquiry into the Nature and Causes of the Wealth of Nations title
    page.jpg". This matches against the corpus's own citation titles instead —
    still inside an article already confirmed to be about the law, so the only
    thing that changes is which file in it we are willing to take."""
    laws = []
    for fn in sorted(os.listdir(LAWS_DIR)):
        if fn.endswith('.json'):
            with io.open(os.path.join(LAWS_DIR, fn), encoding='utf-8') as fh:
                laws.append(json.load(fh))
    manifest = {}
    if os.path.exists(MANIFEST):
        with io.open(MANIFEST, encoding='utf-8') as fh:
            manifest = json.load(fh)
    figures = manifest.setdefault('figures', {})
    portraits = {v.get('file') for v in (manifest.get('people') or {}).values()}

    todo = [l for l in laws if l['slug'] not in figures and (l.get('sources') or [])]
    if args.only:
        todo = [l for l in todo if args.only.lower() in l['name'].lower()]
    if args.limit:
        todo = todo[:args.limit]

    stats = {'ok': 0, 'no_article': 0, 'not_the_law': 0, 'no_match': 0, 'error': 0}
    for i, law in enumerate(todo, 1):
        try:
            # distinctive words from the cited works, minus citation furniture
            toks = set()
            for src in (law.get('sources') or []):
                for w in re.split(r'[^a-z0-9]+', norm(src.get('text') or '')):
                    if len(w) >= 5 and w not in SUBJECT_STOPWORDS and not w.isdigit():
                        toks.add(w)
            if not toks:
                stats['no_match'] += 1
                continue
            title, text = resolve_law_article(law['name'])
            if not title:
                stats['no_article'] += 1
                continue
            if not article_is_the_law(title, text, law):
                stats['not_the_law'] += 1
                continue
            chosen = None
            for file_title in article_images(title):
                bare = file_title.replace('File:', '')
                if reject_filename(bare) or bare in portraits:
                    continue
                if not re.search(r'\.(jpe?g|png|tiff?|svg)$', bare, re.I):
                    continue
                words = set(re.split(r'[^a-z0-9]+', norm(bare.rsplit('.', 1)[0])))
                # two matching words, so a single common term cannot carry it
                if len(toks & words) < 2:
                    continue
                # A citation names its author, so an author's PORTRAIT matches the
                # citation tokens perfectly — "Bertrand Russell transparent bg.png"
                # sailed through as a figure for The Theory of Descriptions. Same
                # whole-name rule the artifact gate uses: a file named for the
                # person is a portrait, and the portrait has its own panel.
                person = [w for w in re.split(r'[^a-z0-9]+', norm(law.get('namedAfter') or '')) if len(w) >= 3]
                if len(person) >= 2 and all(w in words for w in person):
                    continue
                info = commons_file(file_title)
                if info:
                    chosen = info
                    break
            if not chosen:
                stats['no_match'] += 1
                continue
            if not args.dry_run:
                raw = sh(['curl', '-sSL', '-A', UA, '--max-time', '60', chosen['url']])
                im = Image.open(io.BytesIO(raw)).convert('RGB')
                if im.width > 640:
                    im = im.resize((640, max(1, round(im.height * 640 / im.width))), Image.LANCZOS)
                os.makedirs(FIGURE_DIR, exist_ok=True)
                im.save(os.path.join(FIGURE_DIR, f'{law["slug"]}.webp'), 'WEBP', quality=78, method=6)
            figures[law['slug']] = {
                'law': law['name'], 'slug': law['slug'], 'kind': 'source-scan',
                'wikipedia': f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}',
                'confirmedVia': 'source-title',
                'licence': chosen['licence'], 'licenceUrl': chosen['licenceUrl'],
                'artist': chosen['artist'], 'source': chosen['source'], 'file': chosen['file'],
            }
            if not args.dry_run:
                im2 = Image.open(os.path.join(FIGURE_DIR, f'{law["slug"]}.webp'))
                figures[law['slug']]['width'], figures[law['slug']]['height'] = im2.size
                manifest['figures'] = figures
                with io.open(MANIFEST, 'w', encoding='utf-8') as fh:
                    json.dump(manifest, fh, ensure_ascii=False, indent=2, sort_keys=True)
                    fh.write('\n')
            stats['ok'] += 1
            print(f'  OK {i}/{len(todo)}  {law["name"]} — {chosen["file"][:50]}', flush=True)
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
    ap.add_argument('--mode', choices=('people', 'figures', 'artifacts', 'people2', 'sources'), default='people')
    args = ap.parse_args()

    if args.mode == 'figures':
        return fetch_figures(args)
    if args.mode == 'artifacts':
        return fetch_artifacts(args)
    if args.mode == 'people2':
        return fetch_people_second_pass(args)
    if args.mode == 'sources':
        return fetch_source_scans(args)

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
            title, text = resolve_person_article(person)
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
