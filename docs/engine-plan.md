# The Law Tome — Generation Engine Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic static-site generator that consumes a structured law corpus and emits the complete, SEO-ready Law Tome microsite (home, ~1,400 law pages, category/browse pages, graph explorer, search index, quote-cards, sitemap) plus the hand-built pages.

**Architecture:** A Node.js (ESM, no framework) build reads `src/data/*.json`, validates it against a schema + integrity rules (the anti-fabrication guarantees made mechanical), then renders static HTML via template-literal functions into `dist/`. Runtime is pure static: self-hosted fonts/icons (no third-party CDN — matches the "no tracking" posture), a vanilla-JS theme toggle, client search over a prebuilt index, and a prebuilt relationship graph. No server, no database.

**Tech Stack:** Node ≥ 20 (built-in `node:test`, `node:fs`, `fileURLToPath`), ESM `.mjs`, template literals for HTML, `@resvg/resvg-js` for SVG→PNG quote-cards (the only build dependency), self-hosted WOFF2/TTF fonts, vanilla client JS. Design system already exists in the prototype (`lawtome/styles.css`, `common.js`, `index.html`, `laws/goodharts-law.html`).

**Spec:** `docs/superpowers/specs/2026-07-16-the-law-tome-design.md`. Follow @superpowers:test-driven-development for every task.

---

## Locked decisions (resolve review ambiguities before coding)

- **Permalink shape:** `/lawtome/laws/<slug>/` (matches the prototype and its cite string). The spec §6 `/lawtome/<slug>/` example is the loose one; we standardise on `/laws/`. Permalinks are **immutable** (spec §8A). Directory URLs and cite strings both use a **trailing slash**.
- **Base path:** every internal link is `${base}...`. `base` defaults to `/lawtome/` (production). Local preview is served over **HTTP** (`base=/lawtome/`, served so that path is the docroot) — never opened via `file://`, because root-relative links don't resolve under `file://`.
- **Published-count claim:** the header/hero count is driven by **actual published corpus length**, never a hard-coded "1,400". Public superlative copy uses the **qualified** claim ("largest unified, defined & sourced index"), never a bare "world's largest" (spec §1).
- **No third-party CDN at runtime:** fonts (Fraunces, Inter, Space Mono) and icons (the few Tabler glyphs used) are **self-hosted** under `src/assets/`. This also fixes quote-card font rendering (resvg can't fetch remote fonts) and honours the "no tracking" footer.
- **Citation verification split:** the build enforces citation **presence** (validate) and an **automated dead-link backstop** for external source URLs (`build/linkcheck.mjs --external`, opt-in, non-blocking warnings). Human source-content verification and enumerating the real ~1,400 entries are **Plan B**.

---

## File Structure

```
lawtome/
├── package.json              # build scripts + @resvg/resvg-js, type:module
├── site.config.json          # { base, origin, publishedCount|null, brand }
├── src/
│   ├── data/
│   │   ├── categories.json   # controlled vocabulary (closed tag list)
│   │   └── laws/*.json        # one file per law (seed: closed under all cross-refs)
│   ├── assets/
│   │   ├── styles.css         # from prototype + @font-face (self-hosted)
│   │   ├── common.js          # theme (from prototype)
│   │   ├── search.js          # NEW client search + random-law
│   │   ├── graph.js           # NEW graph explorer client
│   │   ├── fonts/               # NEW self-hosted: *.woff2 (site) + Fraunces.ttf/SpaceMono.ttf (quote-cards; resvg needs TTF)
│   │   └── icons/tabler.css + tabler.woff2   # NEW self-hosted icon subset
│   └── templates/
│       ├── partials.mjs       # head(), header(), footer(), sprite(), jsonLd()
│       ├── law.mjs            # law-page template
│       ├── home.mjs           # homepage template
│       ├── listing.mjs        # browse + category template
│       ├── graph.mjs          # graph explorer page
│       └── static-pages.mjs   # coin, about, coined-wing, privacy
├── build/
│   ├── slugify.mjs · corpus.mjs · validate.mjs
│   ├── search-index.mjs · graph-data.mjs
│   ├── quotecard.mjs · sitemap.mjs · linkcheck.mjs
│   └── build.mjs             # orchestrator
├── test/                     # node:test specs (+ test/fixtures/bad)
└── dist/                     # GENERATED — deployable (git-ignored)
```

---

## Chunk 1: Scaffolding, data model & validation

### Task 1: Scaffold tooling, self-host fonts/icons, restructure prototype

**Files:** Create `lawtome/package.json`, `lawtome/.gitignore`, `lawtome/site.config.json`; move `styles.css`+`common.js` → `src/assets/`; vendor fonts+icons.

- [ ] **Step 1: `lawtome/package.json`**

```json
{
  "name": "law-tome",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build/build.mjs",
    "serve": "node build/build.mjs && node -e \"import('node:http').then(async h=>{const{readFile}=await import('node:fs/promises');const{extname,join,normalize}=await import('node:path');const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.svg':'image/svg+xml'};h.createServer(async(q,s)=>{let p=decodeURI(q.url.split('?')[0]).replace(/^\\/lawtome/,'')||'/';if(p.endsWith('/'))p+='index.html';try{const b=await readFile(join('dist',normalize(p)));s.writeHead(200,{'content-type':T[extname(p)]||'application/octet-stream'});s.end(b)}catch{s.writeHead(404);s.end('404')}}).listen(8080,()=>console.log('http://localhost:8080/lawtome/'))})\"",
    "test": "node --test test/"
  },
  "dependencies": { "@resvg/resvg-js": "^2.6.2" }
}
```

- [ ] **Step 2: `lawtome/.gitignore`**

```
dist/
dist-test*/
node_modules/
```

- [ ] **Step 3: `lawtome/site.config.json`**

```json
{ "base": "/lawtome/", "origin": "https://conyso.com", "publishedCount": null, "brand": "The Law Tome" }
```
`publishedCount: null` means "use actual corpus length"; set an integer only to publish a rounded figure ≤ actual count.

- [ ] **Step 4: Restructure + create dirs**

Run: `cd lawtome && mkdir -p src/assets/fonts src/assets/icons src/data/laws src/templates build test/fixtures/bad dist && git mv styles.css src/assets/styles.css && git mv common.js src/assets/common.js` (plain `mv` if untracked).

- [ ] **Step 5: Self-host fonts + icons**

Vendor two font formats into `src/assets/fonts/`:
- **WOFF2** for Fraunces, Inter, Space Mono — used by the site's `@font-face` (small, browser-optimised).
- **Uncompressed TTF** for the two faces the quote-cards use — save them at the exact paths `renderPng` loads in Task 12: `src/assets/fonts/Fraunces.ttf` and `src/assets/fonts/SpaceMono.ttf`. **resvg-js cannot decode WOFF2** — without these TTFs the quote-card silently renders in a fallback serif. (Google Fonts' download gives TTF; convert WOFF2→TTF only if needed.)

Also vendor a Tabler icon subset (only the glyphs used: search, arrows-shuffle, affiliate, feather, copy, photo, arrow-right) into `src/assets/icons/`. Replace the prototype's Google-Fonts + jsDelivr `<link>`s (they move into `head()` in Task 5) with local `@font-face` rules appended to `src/assets/styles.css`, and a local `icons/tabler.css`. Verify: `ls src/assets/fonts/Fraunces.ttf src/assets/fonts/SpaceMono.ttf` both exist, and `ls src/assets/fonts/*.woff2` lists ≥3 files.

- [ ] **Step 6: Install + commit**

```bash
cd lawtome && npm install
git add package.json .gitignore site.config.json src/assets && git commit -m "chore(lawtome): scaffold build, self-host fonts/icons, move assets to src"
```

---

### Task 2: Corpus schema + seed data (closed under cross-references)

**Files:** Create `src/data/categories.json`, `src/data/laws/*.json` (seed set), `docs/CORPUS-SCHEMA.md`.

- [ ] **Step 1: `src/data/categories.json`** (controlled vocabulary)

```json
{
  "management": "Management & organisations",
  "economics": "Economics & incentives",
  "psychology": "Psychology & cognition",
  "software": "Software & systems",
  "media": "Media & information",
  "philosophy": "Philosophy & reasoning",
  "planning": "Planning & estimation",
  "science": "Physics & natural science",
  "statistics": "Statistics & measurement",
  "sociology": "Society & institutions"
}
```

- [ ] **Step 2: Canonical seed entry** `src/data/laws/goodharts-law.json`

```json
{
  "no": "014", "slug": "goodharts-law", "name": "Goodhart's Law",
  "aliases": ["Goodhart–Strathern"],
  "statement": "When a measure becomes a target, it ceases to be a good measure.",
  "statementAccent": "measure becomes a target",
  "meaning": "The moment you reward people for hitting a number, they start optimising the number itself — not the thing the number was supposed to stand for.",
  "example": "A call centre starts paying agents by calls handled per hour. Handle-time drops — but agents rush people off the line and split one problem into three calls. The metric soars while customer problems actually solved gets worse.",
  "whyItMatters": "Any KPI, OKR, bonus, or ranking turns a proxy into a target and invites this law. Watch measures for gaming, prefer several imperfect ones over a single sacred one, and revisit them before they harden into goals.",
  "origin": "The economist Charles Goodhart stated it in a 1975 paper on monetary policy. The famous pithy phrasing was a 1997 generalisation by the anthropologist Marilyn Strathern.",
  "category": "economics", "reliability": "Heuristic", "provenance": "canon",
  "coinedYear": 1975, "popularYear": 1997, "namedAfter": "Charles Goodhart",
  "sources": [
    {"text": "Goodhart, C.A.E. (1975). \"Problems of Monetary Management: the U.K. Experience.\"", "url": "https://en.wikipedia.org/wiki/Goodhart%27s_law", "type": "primary"},
    {"text": "Strathern, M. (1997). \"'Improving ratings': audit in the British University system.\" European Review, 5(3), 305–321.", "type": "primary"},
    {"text": "Goodhart's law, Wikipedia.", "url": "https://en.wikipedia.org/wiki/Goodhart%27s_law", "type": "secondary"}
  ],
  "sameAs": "https://en.wikipedia.org/wiki/Goodhart%27s_law",
  "related": [
    {"slug": "campbells-law", "kind": "near-twin"},
    {"slug": "cobra-effect", "kind": "consequence"}
  ],
  "confusedWith": ["campbells-law"]
}
```

- [ ] **Step 3: Seed the full closed set.** Create one file per law for the prototype's ten PLUS every slug any entry references, so the corpus is **closed under all `related`/`confusedWith` slugs** (Task 4 fails the build on a dangling ref). Minimum seed set: `parkinsons-law, goodharts-law, streisand-effect, occams-razor, hofstadters-law, conways-law, hanlons-razor, the-peter-principle, dunning-kruger-effect, cobra-effect, campbells-law`. **Rule:** an entry may only reference a slug that also has a seed file — trim `related`/`confusedWith` to the seeded set (or add the referenced file). Do NOT reference `the-lucas-critique`/`mcnamara-fallacy`/`greshams-law`/`galls-law` unless you seed them. (Prev/next come from corpus order in Task 8, not from data.)

- [ ] **Step 4: `docs/CORPUS-SCHEMA.md`** — document every field, required vs optional, enum values (`reliability ∈ Empirical|Heuristic|Folk-adage|Contested`, `provenance ∈ canon|coined`, `source.type ∈ primary|secondary`), and the closure rule. Mirrors spec §5 + §7.

- [ ] **Step 5: Commit** — `feat(lawtome): corpus schema + closed seed set`.

---

### Task 3: Slugify (TDD)

**Files:** Create `build/slugify.mjs`; Test `test/slugify.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../build/slugify.mjs';
test('strips apostrophes (straight + curly) then hyphenates', () => {
  assert.equal(slugify("Goodhart's Law"), 'goodharts-law');
  assert.equal(slugify('Ockham’s Razor'), 'ockhams-razor');
});
test('folds diacritics and en-dash', () => {
  assert.equal(slugify('Dunning–Kruger Effect'), 'dunning-kruger-effect');
  assert.equal(slugify('Gödel'), 'godel');
});
test('collapses and trims separators', () => {
  assert.equal(slugify('  The  Peter   Principle! '), 'the-peter-principle');
});
```

- [ ] **Step 2: Run to fail** — `cd lawtome && node --test test/slugify.test.mjs` → FAIL (module not found).

- [ ] **Step 3: Implement `build/slugify.mjs`** (explicit unicode escape — no literal combining marks in source)

```js
export function slugify(name) {
  return name
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```
Note: non-decomposing letters (ø, ł, ß) won't fold; acceptable for seed data, revisit for Plan B scale.

- [ ] **Step 4: Run to pass** — Expected: PASS (3 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): slugify util`.

---

### Task 4: Corpus loader + anti-fabrication validation (TDD)

**Files:** Create `build/corpus.mjs`, `build/validate.mjs`; Test `test/validate.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCorpus } from '../build/validate.mjs';
const cats = { economics: 'Economics', media: 'Media' };
const ok = { no:'001', slug:'a-law', name:'A Law', statement:'x', meaning:'y', example:'z', origin:'o',
  category:'economics', reliability:'Heuristic', provenance:'canon',
  sources:[{text:'S', type:'primary'}], related:[], confusedWith:[] };
test('well-formed canon entry passes', () => assert.deepEqual(validateCorpus([ok], cats), []));
test('canon entry with no sources fails', () => assert.ok(validateCorpus([{...ok, sources:[]}], cats).some(e=>/source/i.test(e))));
test('off-vocabulary category fails', () => assert.ok(validateCorpus([{...ok, category:'vibes'}], cats).some(e=>/category/i.test(e))));
test('bad reliability enum fails', () => assert.ok(validateCorpus([{...ok, reliability:'True'}], cats).some(e=>/reliability/i.test(e))));
test('duplicate slug fails', () => assert.ok(validateCorpus([ok, {...ok, name:'B'}], cats).some(e=>/duplicate/i.test(e))));
test('dangling related reference fails', () => assert.ok(validateCorpus([{...ok, related:[{slug:'ghost', kind:'kindred'}]}], cats).some(e=>/ghost/.test(e))));
test('coined entry with real-person namedAfter fails', () => assert.ok(validateCorpus([{...ok, provenance:'coined', namedAfter:'Jane Doe'}], cats).some(e=>/coined/i.test(e)&&/namedAfter/i.test(e))));
```

- [ ] **Step 2: Run to fail** — FAIL (module not found).

- [ ] **Step 3: `build/validate.mjs`**

```js
const RELIABILITY = new Set(['Empirical', 'Heuristic', 'Folk-adage', 'Contested']);
const PROVENANCE = new Set(['canon', 'coined']);
const REQUIRED = ['no','slug','name','statement','meaning','example','origin','category','reliability','provenance'];
export function validateCorpus(laws, categories) {
  const errs = [], slugs = new Set(), known = new Set(laws.map(l => l.slug));
  for (const l of laws) {
    const id = l.slug || l.name || '(unknown)';
    for (const f of REQUIRED) if (!l[f]) errs.push(`${id}: missing required field "${f}"`);
    if (l.slug && slugs.has(l.slug)) errs.push(`duplicate slug "${l.slug}"`);
    if (l.slug) slugs.add(l.slug);
    if (l.category && !categories[l.category]) errs.push(`${id}: category "${l.category}" not in controlled vocabulary`);
    if (l.reliability && !RELIABILITY.has(l.reliability)) errs.push(`${id}: reliability "${l.reliability}" invalid`);
    if (l.provenance && !PROVENANCE.has(l.provenance)) errs.push(`${id}: provenance "${l.provenance}" invalid`);
    if (l.provenance === 'canon' && (!Array.isArray(l.sources) || l.sources.length === 0))
      errs.push(`${id}: canon entry must have at least one source`);
    if (l.provenance === 'coined' && l.namedAfter)
      errs.push(`${id}: coined entry must not assert a real-person namedAfter without verification`);
    for (const r of l.related || []) if (!known.has(r.slug)) errs.push(`${id}: related reference "${r.slug}" does not resolve`);
    for (const s of l.confusedWith || []) if (!known.has(s)) errs.push(`${id}: confusedWith reference "${s}" does not resolve`);
  }
  return errs;
}
```

- [ ] **Step 4: Run to pass** — Expected: PASS (7 tests).

- [ ] **Step 5: `build/corpus.mjs`**

```js
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
export async function loadCorpus(dir) {
  const files = (await readdir(dir)).filter(f => f.endsWith('.json'));
  const laws = await Promise.all(files.map(async f => JSON.parse(await readFile(join(dir, f), 'utf8'))));
  return laws.sort((a, b) => a.no.localeCompare(b.no));
}
export async function loadCategories(path) { return JSON.parse(await readFile(path, 'utf8')); }
```

- [ ] **Step 6: Commit** — `feat(lawtome): corpus loader + anti-fabrication validation`.

---

## Chunk 2: Core generator

### Task 5: Shared partials — head/header/footer/sprite/jsonLd (TDD)

Extract prototype chrome into functions. `head()` self-hosts assets (no CDN), emits canonical + OG + a **stack of JSON-LD blocks**.

**Files:** Create `src/templates/partials.mjs`; Test `test/partials.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { head, header, footer, sprite, jsonLd } from '../src/templates/partials.mjs';
test('head self-hosts css/js/fonts (no third-party CDN) + title + canonical', () => {
  const h = head({ title:'X', base:'/lawtome/', canonical:'https://conyso.com/lawtome/x/' });
  assert.match(h, /assets\/styles\.css/);
  assert.match(h, /assets\/common\.js/);
  assert.doesNotMatch(h, /googleapis|jsdelivr|cdn/i);
  assert.match(h, /<title>X/);
  assert.match(h, /rel="canonical" href="https:\/\/conyso\.com\/lawtome\/x\/"/);
});
test('head embeds any provided JSON-LD blocks', () => {
  assert.match(head({ title:'X', base:'/lawtome/', jsonld:[{'@type':'WebPage'}] }), /"@type":"WebPage"/);
});
test('header marks the active nav item', () => assert.match(header({base:'/lawtome/', active:'browse'}), /class="on"[^>]*>Browse/));
test('sprite defines the seal symbol', () => assert.match(sprite(), /<symbol id="seal"/));
test('footer carries the licence line', () => assert.match(footer(), /CC BY/));
test('jsonLd serialises to a script tag', () => assert.match(jsonLd({'@type':'X'}), /application\/ld\+json/));
```

- [ ] **Step 2: Run to fail.**

- [ ] **Step 3: Implement `partials.mjs`** — `head({title,description,base,canonical,og,jsonld})` links `${base}assets/styles.css`, self-hosted fonts + `${base}assets/icons/tabler.css`, defers `${base}assets/common.js`, emits `<meta name=description>`, canonical, `og:title/description/image/type`, and each `jsonld` entry via `jsonLd()`. `header({base,active})` ports the kicker+masthead, adds `class="on"` to the active link, count is filled by callers. `footer()`, `sprite()` port prototype markup verbatim (seal/wax/orn). `jsonLd(obj)` → `<script type="application/ld+json">JSON.stringify(obj)</script>`.

- [ ] **Step 4: Run to pass** — Expected: PASS (6 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): shared partials with self-hosted assets + JSON-LD helper`.

---

### Task 6: Law-page template (TDD)

Port `laws/goodharts-law.html` into `lawPage(law, ctx)`, including the cite block, at-a-glance panel, prev/next, and the full JSON-LD stack.

**Files:** Create `src/templates/law.mjs`; Test `test/law.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lawPage } from '../src/templates/law.mjs';
const law = { no:'014', slug:'goodharts-law', name:"Goodhart's Law", aliases:['Goodhart–Strathern'],
  statement:'When a measure becomes a target, it ceases to be a good measure.', statementAccent:'measure becomes a target',
  meaning:'M', example:'E', origin:'O', whyItMatters:'W', category:'economics', reliability:'Heuristic', provenance:'canon',
  coinedYear:1975, namedAfter:'Charles Goodhart', sameAs:'https://en.wikipedia.org/wiki/Goodhart%27s_law',
  sources:[{text:'Goodhart (1975)', url:'https://x', type:'primary'}], related:[{slug:'campbells-law', kind:'near-twin'}], confusedWith:['campbells-law'] };
const byslug = { 'campbells-law': { no:'015', slug:'campbells-law', name:"Campbell's Law", statement:'S', reliability:'Heuristic' } };
const ctx = { byslug, categories:{economics:'Economics'}, base:'/lawtome/', origin:'https://conyso.com',
  prev:{slug:'greshams-law', name:"Gresham's Law", no:'013'}, next:{slug:'galls-law', name:"Gall's Law", no:'015'} };
const html = lawPage(law, ctx);
test('statement renders with the accent span', () => assert.match(html, /<span class="accent">measure becomes a target<\/span>/));
test('every source renders with its visible link', () => { assert.match(html, /Goodhart \(1975\)/); assert.match(html, /href="https:\/\/x"/); });
test('cite-this-entry block carries the immutable canonical URL', () => assert.match(html, /conyso\.com\/lawtome\/laws\/goodharts-law\//));
test('emits the JSON-LD stack: DefinedTerm + Article + BreadcrumbList + FAQPage', () => {
  for (const t of ['"DefinedTerm"','"Article"','"BreadcrumbList"','"FAQPage"']) assert.match(html, new RegExp(t));
  assert.match(html, /Goodhart%27s_law/); // sameAs
});
test('links related laws by resolved name + permalink', () => { assert.match(html, /Campbell's Law/); assert.match(html, /href="\/lawtome\/laws\/campbells-law\/"/); });
test('prev/next render from ctx', () => { assert.match(html, /Gresham's Law/); assert.match(html, /Gall's Law/); });
test('coined entry shows the Coined badge + provenance marking, no citation gate', () => {
  const c = lawPage({...law, provenance:'coined', namedAfter:undefined, sources:[]}, ctx);
  assert.match(c, /Coined/);
  assert.match(c, /"additionalType"|coined/i);
});
```

- [ ] **Step 2: Run to fail.**

- [ ] **Step 3: Implement `src/templates/law.mjs`** — `lawPage(law, ctx)` returns a full document via partials. Rules:
  - Accent: replace `statementAccent` in `statement` with `<span class="accent">…</span>` (guard when absent).
  - Optional blocks (`whyItMatters`, `confusedWith`, `related`, `aliases`, `popularYear`) render only when present.
  - `sources` → numbered `<ol class="sources">` with `text`, link when `url`, `type` tag.
  - `related`/`confusedWith` resolve via `ctx.byslug`; links `${base}laws/<slug>/`.
  - Cite block: the immutable `${origin}${base}laws/<slug>/` string + copy button (ports prototype).
  - Prev/next from `ctx.prev`/`ctx.next`.
  - `provenance:"coined"` → swap reliability meta for a `Coined` badge, render a submitter credit instead of the source-gate, and add `additionalType:"coined"` + `disambiguatingDescription` to the DefinedTerm.
  - **JSON-LD stack** via `head({jsonld:[…]})`: `DefinedTerm` (name, alternateName, description, inDefinedTermSet, sameAs), `Article` (headline, description), `BreadcrumbList` (Home›Category›Term), and `FAQPage` ("What is X?"/"Who coined X?").
  - `canonical` = `${origin}${base}laws/<slug>/`; `og.image` = `${base}og/<slug>.png`.

- [ ] **Step 4: Run to pass** — Expected: PASS (7 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): law-page template with cite block, prev/next, JSON-LD stack`.

---

### Task 7: Homepage template (TDD)

**Files:** Create `src/templates/home.mjs`; Test `test/home.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homePage } from '../src/templates/home.mjs';
const laws = [{no:'001', slug:'a', name:'A', statement:'S </script> x', statementAccent:'S', category:'economics', reliability:'Heuristic', related:[]}];
const html = homePage(laws, { publishedCount: 212, base:'/lawtome/' });
test('renders the ACTUAL published count, not a hard-coded 1,400', () => { assert.match(html, /212/); assert.doesNotMatch(html, /1,400/); });
test('uses the qualified superlative claim', () => assert.match(html, /unified,\s*(defined|sourced)/i));
test('escapes </script> in inline featured JSON', () => assert.doesNotMatch(html, /S <\/script> x/));
test('embeds featured laws for the rotating hero', () => assert.match(html, /"slug":"a"/));
test('wraps the directory in DefinedTermSet JSON-LD', () => assert.match(html, /"DefinedTermSet"/));
```

- [ ] **Step 2: Run to fail.**

- [ ] **Step 3: Implement `home.mjs`** — `homePage(featuredLaws, {publishedCount, base})`. Port hero/browse-teaser/graph-band/coin-band. Count via `Intl.NumberFormat('en').format(publishedCount)` everywhere the prototype hard-codes "1,400 laws". Eyebrow/hero copy uses the qualified claim. Emit a `DefinedTermSet` JSON-LD block (name "The Law Tome", the directory's URL) via `head({jsonld:[…]})`. Serialise `featuredLaws` (≤12) into the inline `<script>` with `</script>`→`<\/script>` escaping. Browse chips link `${base}browse/`.

- [ ] **Step 4: Run to pass** — Expected: PASS (5 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): homepage template with real count + qualified claim`.

---

### Task 8: Build orchestrator — home + all law pages + neighbours (TDD)

**Files:** Create `build/build.mjs`; Test `test/build.test.mjs`; fixture `test/fixtures/bad/x.json`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
test('build emits home + a page per law + copies assets', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com', publishedCount:null });
  assert.ok(existsSync(join(out, 'index.html')));
  assert.ok(existsSync(join(out, 'laws/goodharts-law/index.html')));
  assert.ok(existsSync(join(out, 'assets/styles.css')));
  await rm(out, { recursive:true, force:true });
});
test('build throws on validation failure', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await assert.rejects(buildSite({ dataDir:'test/fixtures/bad', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' }), /validation/i);
  await rm(out, { recursive:true, force:true });
});
```
Fixture `test/fixtures/bad/x.json`: a canon law with `"sources": []`.

- [ ] **Step 2: Run to fail.**

- [ ] **Step 3: Implement `build/build.mjs`** exporting `async function buildSite(opts)`:
  1. `loadCorpus` + `loadCategories`.
  2. `validateCorpus`; on errors `throw new Error('validation failed:\n' + errs.join('\n'))`.
  3. `byslug` map; compute `prev`/`next` for each law from corpus order.
  4. Resolve `publishedCount` = `opts.publishedCount ?? laws.length`.
  5. Write `${out}/index.html` (home, featured = first 12, publishedCount) and `${out}/laws/<slug>/index.html` per law (pass `prev`/`next`/`origin`).
  6. `fs.cp(assetsDir, ${out}/assets, {recursive:true})`.
  7. Return `{ pages }`.
  CLI tail (robust idiom):
```js
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = JSON.parse(await (await import('node:fs/promises')).readFile('site.config.json','utf8'));
  const base = (process.argv.find(a=>a.startsWith('--base='))||'').split('=')[1] || cfg.base;
  buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out:'dist', ...cfg, base })
    .then(r => console.log('built', r));
}
```

- [ ] **Step 4: Run to pass** — Expected: PASS (2 tests).
- [ ] **Step 5: Real build** — `cd lawtome && npm run build` → prints `built { pages: N }`; `node -e "console.log(require('node:fs').readdirSync('dist/laws'))"` lists seed slugs.
- [ ] **Step 6: Commit** — `feat(lawtome): build orchestrator (home + law pages + neighbours)`.

---

## Chunk 3: Derived pages, search & graph

### Task 9: Browse + category pages (TDD)

**Files:** Create `src/templates/listing.mjs`; modify `build/build.mjs`; Test `test/listing.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingPage } from '../src/templates/listing.mjs';
const laws = [
  {no:'001', slug:'a', name:'A', statement:'S', category:'economics', reliability:'Heuristic'},
  {no:'002', slug:'b', name:'B', statement:'T', category:'media', reliability:'Empirical'}
];
test('browse lists a card link per law + DefinedTermSet JSON-LD', () => {
  const h = listingPage(laws, { title:'Browse', base:'/lawtome/', kind:'browse' });
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.match(h, /href="\/lawtome\/laws\/b\/"/);
  assert.match(h, /"DefinedTermSet"/);
});
test('category page lists only its members + BreadcrumbList', () => {
  const h = listingPage(laws.filter(l=>l.category==='economics'), { title:'Economics', base:'/lawtome/', kind:'category' });
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.doesNotMatch(h, /href="\/lawtome\/laws\/b\/"/);
  assert.match(h, /"BreadcrumbList"/);
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `listing.mjs`** (reuse prototype card markup + chip filter) rendering a `.grid` of `.card` anchors; `kind:'browse'` adds `DefinedTermSet` JSON-LD, `kind:'category'` adds `BreadcrumbList`. Extend `buildSite` to write `${out}/browse/index.html` (all laws) and `${out}/category/<cat>/index.html` per category present.
- [ ] **Step 4: Run to pass** — Expected: PASS (2 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): browse + category pages`.

---

### Task 10: Search index + client search + random-law (TDD)

**Files:** Create `build/search-index.mjs`, `src/assets/search.js`; modify `build/build.mjs`; Test `test/search-index.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchIndex } from '../build/search-index.mjs';
const laws = [{slug:'goodharts-law', no:'014', name:"Goodhart's Law", aliases:['Goodhart–Strathern'], statement:'When a measure becomes a target…', category:'economics'}];
const idx = buildSearchIndex(laws);
test('row carries slug/no/name/category + a lowercased search blob', () => {
  const r = idx.find(x=>x.slug==='goodharts-law');
  assert.equal(r.name, "Goodhart's Law");
  assert.match(r.blob, /strathern/);
  assert.match(r.blob, /measure/);
  assert.equal(r.blob, r.blob.toLowerCase());
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `build/search-index.mjs`** — `buildSearchIndex(laws)` → rows `{slug,no,name,aliases,category,statement,blob}`, `blob` = lowercased `name+aliases+statement+category`. Extend `buildSite` to write `${out}/search-index.json`.
- [ ] **Step 4: Run to pass** — Expected: PASS (1 test).
- [ ] **Step 5: Implement `src/assets/search.js`** — fetch `${base}search-index.json`; token-AND substring over `blob`, rank name-hit > statement-hit; render result cards; empty state ("Maybe you should coin it"); wire the **random-law** button to `location = base+'laws/'+pick.slug+'/'`. Include on home + browse.
- [ ] **Step 6: Commit** — `feat(lawtome): prebuilt search index + client search + random law`.

---

### Task 11: Graph data + local-neighbourhood explorer (TDD)

**Files:** Create `build/graph-data.mjs`, `src/templates/graph.mjs`, `src/assets/graph.js`; modify `build/build.mjs`; Test `test/graph-data.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraph } from '../build/graph-data.mjs';
const laws = [
  {slug:'goodharts-law', name:"Goodhart's Law", category:'economics', related:[{slug:'campbells-law', kind:'near-twin'}]},
  {slug:'campbells-law', name:"Campbell's Law", category:'sociology', related:[]}
];
const g = buildGraph(laws);
test('a node per law; undirected, de-duplicated edges', () => {
  assert.equal(g.nodes.length, 2);
  assert.equal(g.edges.length, 1);
  assert.deepEqual([g.edges[0].a, g.edges[0].b].sort(), ['campbells-law','goodharts-law']);
});
test('drops edges to unknown slugs', () => {
  assert.equal(buildGraph([{slug:'x', name:'X', category:'economics', related:[{slug:'ghost', kind:'kindred'}]}]).edges.length, 0);
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `build/graph-data.mjs`** — `buildGraph(laws)` → `{nodes:[{slug,name,category}], edges:[{a,b,kind}]}`, edges undirected + de-duped (`a<b`), dangling dropped. Extend `buildSite` to write `${out}/graph.json` + graph page.
- [ ] **Step 4: Run to pass** — Expected: PASS (2 tests).
- [ ] **Step 5: Implement `graph.mjs` + `assets/graph.js`** — explorer renders a **local neighbourhood only** (a focused node + 1–2-hop neighbours from `graph.json`), never the full hairball (spec §6); deterministic radial layout in vanilla SVG; click re-centres; always-dark Codex treatment.
- [ ] **Step 6: Commit** — `feat(lawtome): graph data + local-neighbourhood explorer`.

---

## Chunk 4: Quote-cards, SEO artifacts & hand-built pages

### Task 12: Quote-cards with embedded fonts (TDD)

resvg cannot fetch remote fonts; fonts MUST be passed explicitly or the card silently renders in the wrong face.

**Files:** Create `build/quotecard.mjs`; modify `build/build.mjs`; Test `test/quotecard.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { quoteCardSvg, renderPng } from '../build/quotecard.mjs';
const law = { name:"Goodhart's Law", statement:'When a measure becomes a target, it ceases to be a good measure.', no:'014' };
test('svg embeds statement + brand + index code', () => {
  const svg = quoteCardSvg(law);
  assert.match(svg, /measure becomes a target/);
  assert.match(svg, /THE LAW TOME/);
  assert.match(svg, /№ 014/);
});
test('the exact TTFs resvg loads exist (guards the silent WOFF2 fallback)', () => {
  assert.ok(existsSync('src/assets/fonts/Fraunces.ttf'), 'Fraunces.ttf missing — resvg cannot decode woff2');
  assert.ok(existsSync('src/assets/fonts/SpaceMono.ttf'), 'SpaceMono.ttf missing — resvg cannot decode woff2');
});
test('renders a 1200x630 PNG (magic bytes)', () => {
  const png = renderPng(quoteCardSvg(law));
  assert.ok(png.length > 1000);
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `build/quotecard.mjs`** — `quoteCardSvg(law)` builds a 1200×630 Codex-dark SVG (statement in Fraunces, `№`+attribution in Space Mono, seal watermark, `conyso.com/lawtome` URL). `renderPng(svg)` calls `new Resvg(svg, { font: { fontFiles: ['src/assets/fonts/Fraunces.ttf','src/assets/fonts/SpaceMono.ttf'], defaultFontFamily:'Fraunces', loadSystemFonts:false } }).render().asPng()`. Extend `buildSite` to emit `${out}/og/<slug>.png` per law.
- [ ] **Step 4: Run to pass** — Expected: PASS (3 tests).
- [ ] **Step 5: Manual font eyeball** — open one `dist/og/<slug>.png` in the Browser pane; confirm the statement is in Fraunces (not a default serif) and `№` renders — the unit test cannot see the font face.
- [ ] **Step 6: Commit** — `feat(lawtome): quote-cards with embedded fonts`.

---

### Task 13: Sitemap, robots, redirect map (TDD)

**Files:** Create `build/sitemap.mjs`; modify `build/build.mjs`; Test `test/sitemap.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap } from '../build/sitemap.mjs';
const xml = buildSitemap(['laws/goodharts-law/','browse/'], 'https://conyso.com/lawtome/');
test('valid sitemap XML with absolute, trailing-slash URLs', () => {
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemap\.org|sitemaps\.org/);
  assert.match(xml, /<loc>https:\/\/conyso\.com\/lawtome\/laws\/goodharts-law\/<\/loc>/);
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `build/sitemap.mjs`** (`buildSitemap(paths, origin)`), extend `buildSite` to write `${out}/sitemap.xml`, `${out}/robots.txt` (references sitemap), and a `${out}/_redirects` map file seeded from any `law.redirectFrom` array (permalink-lifecycle hook, spec §8A; empty for seed data — presence proves the mechanism).
- [ ] **Step 4: Run to pass** — Expected: PASS (1 test).
- [ ] **Step 5: Commit** — `feat(lawtome): sitemap, robots, redirect map`.

---

### Task 14: Coin form, about, coined wing, privacy (TDD)

**Files:** Create `src/templates/static-pages.mjs`; modify `build/build.mjs`; Test `test/static-pages.test.mjs`.

- [ ] **Step 1: Failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinPage, aboutPage, coinedIndex, privacyPage } from '../src/templates/static-pages.mjs';
test('coin form has name/statement/mode inputs, a rights-grant + consent linking to privacy', () => {
  const h = coinPage({ base:'/lawtome/' });
  assert.match(h, /name="statement"/);
  assert.match(h, /type="checkbox"[^>]*required/);
  assert.match(h, /grant/i);              // rights-grant wording
  assert.match(h, /href="\/lawtome\/privacy\/"/);
});
test('about states the verification method + licence + a named curator', () => {
  const h = aboutPage({ base:'/lawtome/' });
  assert.match(h, /adversarial|source-resolution|verify/i);
  assert.match(h, /CC BY/);
});
test('coined wing lists only coined entries', () => {
  const h = coinedIndex([{slug:'x', name:'X', provenance:'coined', statement:'S', reliability:'Heuristic'}], { base:'/lawtome/' });
  assert.match(h, /href="\/lawtome\/laws\/x\/"/);
});
test('privacy page exists for the consent link', () => assert.match(privacyPage({base:'/lawtome/'}), /consent|data|privacy/i));
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `static-pages.mjs`** — `coinPage` (form → `action="${base}api/submit" method="post"`, fields name/statement/mode(suggest|coin), required consent checkbox linking to privacy, explicit **rights-grant + originality-warranty** copy per spec §13, no live rendering of submissions); `aboutPage` (anti-fabrication method, sources policy, CC BY licence, named curator — E-E-A-T); `coinedIndex(coinedLaws,…)`; `privacyPage` (what's collected, consent, no reading-tracking). Extend `buildSite` to emit `coin/`, `about/`, `coined/`, `privacy/`.
- [ ] **Step 4: Run to pass** — Expected: PASS (4 tests).
- [ ] **Step 5: Commit** — `feat(lawtome): coin form, about, coined wing, privacy`.

---

### Task 15: Full-build integration + internal link check + HTTP smoke (TDD)

**Files:** Create `build/linkcheck.mjs`, `test/integration.test.mjs`.

- [ ] **Step 1: Failing test** `test/integration.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
import { internalLinkErrors } from '../build/linkcheck.mjs';
test('full build emits every artifact type', async () => {
  const out = await mkdtemp(join(tmpdir(),'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com', publishedCount:null });
  for (const p of ['index.html','browse/index.html','graph/index.html','coin/index.html','about/index.html','coined/index.html','privacy/index.html','search-index.json','graph.json','sitemap.xml','robots.txt','laws/goodharts-law/index.html','og/goodharts-law.png'])
    assert.ok(existsSync(join(out, p)), `missing ${p}`);
  const errs = await internalLinkErrors(out, '/lawtome/');   // (b) below
  assert.deepEqual(errs, [], errs.join('\n'));
  await rm(out, { recursive:true, force:true });
});
```

- [ ] **Step 2: Run to fail.**
- [ ] **Step 3: Implement `build/linkcheck.mjs`** — `internalLinkErrors(outDir, base)` crawls every `.html`, extracts root-relative `href/src="${base}..."`, and returns a list of any that don't map to an emitted file (a `${base}x/` maps to `x/index.html`). Fix any dangling links it surfaces. (Also expose an opt-in `externalLinkWarnings(laws)` that HEAD-checks source URLs — non-blocking, for the dead-citation backstop.)
- [ ] **Step 4: Run to pass** — `cd lawtome && npm test` → all suites PASS.
- [ ] **Step 5: HTTP smoke (not `file://`)** — `cd lawtome && npm run build` then `npm run serve`; in the Browser pane navigate to `http://localhost:8080/lawtome/` and `.../lawtome/laws/goodharts-law/` (use the **trailing slash** — the dev `serve` maps a directory URL to its `index.html`; a slash-less `/laws/goodharts-law` 404s). Confirm CSS/fonts/nav/theme-toggle all work and it matches the prototype. (Root-relative links only resolve over HTTP, hence the server.)
- [ ] **Step 6: Commit** — `test(lawtome): full-build integration + internal link check + HTTP smoke`.

---

## Done criteria

- `npm test` green; `npm run build` emits a complete `dist/` for the seed corpus with zero validation errors and zero internal-link errors.
- Every law page: visible sources (canon), provenance marking (coined), the `DefinedTerm`+`Article`+`BreadcrumbList`+`FAQPage` JSON-LD stack, canonical + OG image, cite block, prev/next, resolvable related/confused set.
- Home/browse show the **real** published count and the **qualified** superlative; home/browse carry `DefinedTermSet`.
- All artifacts generated: per-category, graph explorer, search index, graph data, quote-cards (correct font), coin/about/coined/privacy, sitemap, robots, redirect map.
- Served over HTTP, output is visually identical to the approved prototype.

## Explicitly out of scope (→ Plan B: content pipeline)

Enumerating the real ~1,400 entries; the adversarial verification + human source-content check; coined-submission review tooling and the live `api/submit` endpoint. Plan B produces `src/data/laws/*.json` at scale (with real `redirectFrom` on any merges); this engine consumes it unchanged. External citation dead-link scanning ships here (`linkcheck.mjs`) but runs as a non-blocking warning, not a gate.
