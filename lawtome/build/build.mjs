// Task 8 build orchestrator. Wires corpus + validator + templates into `out/`:
// a home page, one page per law (with corpus-order prev/next neighbours), and a
// verbatim copy of the assets directory. Throws before writing anything if the
// corpus fails validation, so a corpus that breaks any anti-fabrication rule
// never ships a page.
import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus, loadCategories } from './corpus.mjs';
import { validateCorpus } from './validate.mjs';
import { lawPage } from '../src/templates/law.mjs';
import { homePage } from '../src/templates/home.mjs';
import { listingPage } from '../src/templates/listing.mjs';
import { graphPage } from '../src/templates/graph.mjs';
import { coinPage, aboutPage, coinedIndex, privacyPage, notFoundPage } from '../src/templates/static-pages.mjs';
import { tensionPage } from '../src/templates/tension.mjs';
import { comparePage, compareHubPage } from '../src/templates/compare.mjs';
import { tensionPairs, comparePairs } from './relations.mjs';
import { reliabilityHubPage } from '../src/templates/reliability.mjs';
import { RELIABILITY_TIERS, reliabilitySlug } from '../src/templates/partials.mjs';
import { collectionsIndexPage, collectionPage } from '../src/templates/collections.mjs';
import { resolveCollections } from './collections.mjs';
import { quizPage } from '../src/templates/quiz.mjs';
import { situationsPage } from '../src/templates/situations.mjs';
import { resolveSituations, situationsBySlug } from './situations.mjs';
import { audiencesIndexPage, audiencePage } from '../src/templates/audiences.mjs';
import { resolveAudiences } from './audiences.mjs';
import { featuresPage } from '../src/templates/features.mjs';
import { manifestoPage } from '../src/templates/manifesto.mjs';
import { eponymsPage } from '../src/templates/eponyms.mjs';
import { eponymGroups } from './eponyms.mjs';
import { timelinePage } from '../src/templates/timeline.mjs';
import { eraGroups } from './timeline.mjs';
import { savedPage } from '../src/templates/saved.mjs';
import { dataPage } from '../src/templates/data.mjs';
import { buildDataset, datasetCsv } from './dataset.mjs';
import { buildSearchIndex } from './search-index.mjs';
import { buildGraph } from './graph-data.mjs';
import { quoteCardSvg, renderPng } from './quotecard.mjs';
import { buildSitemap } from './sitemap.mjs';
import { buildLlmsIndex, buildLlmsFull, buildLawMarkdown } from './llms.mjs';
import { readFile } from 'node:fs/promises';
import { buildFeed } from './feed.mjs';

async function writePage(path, html) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, html, 'utf8');
}

export async function buildSite(opts) {
  const { dataDir, catFile, assetsDir, out, base = '/', origin = '' } = opts;

  const [laws, categories] = await Promise.all([loadCorpus(dataDir), loadCategories(catFile)]);

  const errs = validateCorpus(laws, categories);
  if (errs.length) throw new Error('validation failed:\n' + errs.join('\n'));

  // Validation passed — clean the output tree so a rebuild can't serve a ghost
  // page for a since-removed or renamed law. Done AFTER the validation gate, so a
  // failed build leaves any previous good output intact.
  await rm(out, { recursive: true, force: true });

  const byslug = Object.fromEntries(laws.map(l => [l.slug, l]));
  const publishedCount = opts.publishedCount ?? laws.length;
  // A single build timestamp shared by every page, surfaced as the JSON-LD
  // dateModified + article:modified_time freshness signal. Honest: it records
  // when the page was last generated. Overridable so a reproducible build can
  // pin it. ISO 8601 (date only keeps it stable across a day's rebuilds).
  const buildDate = opts.buildDate ?? new Date().toISOString().slice(0, 10);

  // Curated situation → law map. Optional file; loaded early because its phrases
  // are folded into the search index (so a typed problem description lands on the
  // law an editor mapped it to). Any situation whose law slug is unknown is
  // dropped by resolveSituations, so nothing dangles.
  const situationsFile = opts.situationsFile ?? join(dirname(catFile), 'situations.json');
  let rawSituations = [];
  try { rawSituations = JSON.parse(await readFile(situationsFile, 'utf8')); }
  catch { rawSituations = []; }
  const { situations, dropped: droppedSit } = resolveSituations(rawSituations, byslug);
  if (droppedSit.length) console.warn(`situations: dropped ${droppedSit.length} unknown slug(s): ${droppedSit.join(', ')}`);
  const sitMap = situationsBySlug(rawSituations);

  // Render synchronously, then write concurrently (matters at ~1,400-law scale).
  const writes = [
    // Home: first 12 laws as the featured rotation.
    writePage(join(out, 'index.html'), homePage(laws.slice(0, 18), { publishedCount, base, origin })),
    // Prebuilt client-search index (a DATA file, not a "page"): fetched by
    // src/assets/search.js. Curated situation phrasing is folded in so a typed
    // problem description surfaces the mapped law. In the concurrent writes[] so
    // it's covered by the pre-clean rm + Promise.all.
    writePage(join(out, 'search-index.json'), JSON.stringify(buildSearchIndex(laws, sitMap))),
    // Prebuilt relationship graph (a DATA file, not a "page"): fetched by
    // src/assets/graph.js, which renders a local neighbourhood from it. In the
    // concurrent writes[] so it's covered by the pre-clean rm + Promise.all.
    writePage(join(out, 'graph.json'), JSON.stringify(buildGraph(laws))),
    // The graph explorer page (chrome + empty #graph stage; graph.js fills it).
    writePage(join(out, 'graph', 'index.html'), graphPage({ base, origin, publishedCount })),
  ];
  // One page per law. prev/next come from CORPUS ORDER (laws already sorted by `no`).
  for (let i = 0; i < laws.length; i++) {
    const html = lawPage(laws[i], { byslug, categories, base, origin, prev: laws[i - 1], next: laws[i + 1], publishedCount, buildDate });
    writes.push(writePage(join(out, 'laws', laws[i].slug, 'index.html'), html));
    // Clean Markdown twin at /laws/<slug>/index.md — a fetch-friendly plain-text
    // representation for LLMs/agents (GEO). Linked from the page via rel=alternate.
    writes.push(writePage(join(out, 'laws', laws[i].slug, 'index.md'),
      buildLawMarkdown(laws[i], { baseUrl: `${origin}${base}`, categoryLabel: categories[laws[i].category] || laws[i].category, byslug })));
  }

  // One Open Graph quote-card PNG per law at og/<slug>.png — matches the
  // og.image the law page emits (Task 6). Rendering is CPU-bound (resvg is
  // synchronous), so render each card then write concurrently. The TTFs must be
  // embedded explicitly (resvg can't fetch fonts or decode WOFF2).
  for (const law of laws) {
    const png = renderPng(quoteCardSvg(law));
    writes.push(writePage(join(out, 'og', `${law.slug}.png`), png));
  }

  // Browse page: every law.
  writes.push(writePage(
    join(out, 'browse', 'index.html'),
    listingPage(laws, { title: 'Browse', base, kind: 'browse', active: 'browse', origin }),
  ));

  // One category page per category PRESENT in the corpus, using the label from
  // categories.json for the page title. First-seen order over corpus order.
  const present = [];
  const membersByCat = new Map();
  for (const law of laws) {
    const cat = law.category;
    if (cat == null) continue;
    if (!membersByCat.has(cat)) { membersByCat.set(cat, []); present.push(cat); }
    membersByCat.get(cat).push(law);
  }
  for (const cat of present) {
    writes.push(writePage(
      join(out, 'category', cat, 'index.html'),
      listingPage(membersByCat.get(cat), { title: categories[cat] || cat, base, kind: 'category', origin, categoryKey: cat }),
    ));
  }

  // Task 14 static pages: the coin form, About, the Coined wing (only coined
  // entries — none in the seed corpus, so the built page shows its empty state),
  // and the Privacy notice backing the coin form's consent link. Not "law pages",
  // so they don't touch `pages`; reported under `listings`.
  const coinedLaws = laws.filter(l => l.provenance === 'coined');
  writes.push(writePage(join(out, 'coin', 'index.html'), coinPage({ base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'about', 'index.html'), aboutPage({ base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'coined', 'index.html'), coinedIndex(coinedLaws, { base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'privacy', 'index.html'), privacyPage({ base, origin, count: publishedCount })));
  // "Laws in tension": a whole-corpus view of the pairs the corpus marks as
  // opposing. Derived from related[] tension edges — always emitted (empty state
  // when a corpus has none), so the footer link never dangles.
  const tension = tensionPairs(laws);
  writes.push(writePage(join(out, 'tension', 'index.html'), tensionPage(tension, { base, origin, count: publishedCount })));
  // "X vs Y" comparison pages: one per near-twin / tension pair the corpus marks,
  // plus a /compare/ hub. High-intent long-tail capture ("Occam vs Hanlon"); pure
  // recombination of each law's verified fields — nothing is authored per pair.
  const compares = comparePairs(laws);
  writes.push(writePage(join(out, 'compare', 'index.html'), compareHubPage(compares, { base, origin, count: publishedCount })));
  for (const pair of compares) {
    writes.push(writePage(join(out, 'compare', pair.slug, 'index.html'), comparePage(pair, { base, origin, categories, count: publishedCount })));
  }

  // Reliability (veracity) facet: a hub explaining the scale, plus one faceted
  // listing per tier PRESENT in the corpus. Each tier page renders only its own
  // laws and stamps data-reliability so the client keeps the subset. Canonical
  // scale order; tiers with no members are skipped (no empty pages, no dead links).
  const membersByTier = new Map();
  for (const law of laws) {
    const r = law.reliability;
    if (!r) continue;
    if (!membersByTier.has(r)) membersByTier.set(r, []);
    membersByTier.get(r).push(law);
  }
  const presentTiers = RELIABILITY_TIERS.filter((v) => membersByTier.has(v));
  writes.push(writePage(
    join(out, 'reliability', 'index.html'),
    reliabilityHubPage(presentTiers.map((v) => ({ value: v, count: membersByTier.get(v).length })), { base, origin, count: publishedCount }),
  ));
  for (const tier of presentTiers) {
    writes.push(writePage(
      join(out, 'reliability', reliabilitySlug(tier), 'index.html'),
      listingPage(membersByTier.get(tier), { title: `${tier} laws`, base, kind: 'reliability', origin, reliabilityKey: tier }),
    ));
  }

  // Curated collections: an editorial hub + one page per theme. The source file
  // is optional (a corpus without it simply gets no collections); any slug that
  // isn't in the corpus is dropped (no dead links), and empty collections are
  // skipped. Slugs point at existing, already-validated entries only.
  const collectionsFile = opts.collectionsFile ?? join(dirname(catFile), 'collections.json');
  let rawCollections = [];
  try { rawCollections = JSON.parse(await readFile(collectionsFile, 'utf8')); }
  catch { rawCollections = []; }
  const { collections, dropped: droppedColl } = resolveCollections(rawCollections, byslug);
  if (droppedColl.length) console.warn(`collections: dropped ${droppedColl.length} unknown slug(s): ${droppedColl.join(', ')}`);
  writes.push(writePage(join(out, 'collections', 'index.html'), collectionsIndexPage(collections, { base, origin, count: publishedCount })));
  for (const c of collections) {
    writes.push(writePage(join(out, 'collections', c.slug, 'index.html'), collectionPage(c, { base, origin, count: publishedCount })));
  }

  // Law of the day + name-that-law quiz: a static shell filled by assets/quiz.js
  // (which fetches the search index). A learning/return loop, not a "law page".
  writes.push(writePage(join(out, 'quiz', 'index.html'), quizPage({ base, origin, count: publishedCount })));

  // Situations: a visible reverse-lookup ("what's the law for…?") built from the
  // same curated map folded into the search index. Emitted unconditionally (empty
  // state when a corpus has none), so the footer link never dangles.
  writes.push(writePage(join(out, 'situations', 'index.html'), situationsPage(situations, { base, origin, count: publishedCount })));

  // Marketing: audience ("for …") pages, a features tour, and a manifesto.
  // Audiences are curated persona shortlists (optional file; unknown slugs dropped).
  const audiencesFile = opts.audiencesFile ?? join(dirname(catFile), 'audiences.json');
  let rawAudiences = [];
  try { rawAudiences = JSON.parse(await readFile(audiencesFile, 'utf8')); }
  catch { rawAudiences = []; }
  const { audiences, dropped: droppedAud } = resolveAudiences(rawAudiences, byslug);
  if (droppedAud.length) console.warn(`audiences: dropped ${droppedAud.length} unknown slug(s): ${droppedAud.join(', ')}`);
  writes.push(writePage(join(out, 'for', 'index.html'), audiencesIndexPage(audiences, { base, origin, count: publishedCount })));
  for (const a of audiences) {
    writes.push(writePage(join(out, 'for', a.slug, 'index.html'), audiencePage(a, { base, origin, count: publishedCount })));
  }
  writes.push(writePage(join(out, 'features', 'index.html'), featuresPage({ base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'manifesto', 'index.html'), manifestoPage({ base, origin, count: publishedCount })));

  // Eponym index + timeline: two more browse axes over existing fields
  // (namedAfter, coinedYear). No new corpus data.
  writes.push(writePage(join(out, 'named-after', 'index.html'), eponymsPage(eponymGroups(laws), { base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'timeline', 'index.html'), timelinePage(eraGroups(laws), { base, origin, count: publishedCount })));

  // Saved shortlist: a client-only page (localStorage), noindex — filled by
  // assets/saved.js, which every law page's Save button writes to.
  writes.push(writePage(join(out, 'saved', 'index.html'), savedPage({ base, origin, count: publishedCount })));

  // Dataset (/data/): a page plus the downloads themselves. METADATA ONLY — the
  // long-form prose is deliberately withheld (build/dataset.mjs), so the corpus's
  // written value stays on-site while the index/graph/citations are freely
  // reusable under CC BY. The .json/.csv are data files (not crawlable pages), so
  // they are NOT added to the sitemap.
  writes.push(writePage(join(out, 'data', 'index.html'), dataPage({ base, origin, count: publishedCount, generated: buildDate })));
  writes.push(writePage(join(out, 'data', 'lawtome.json'), JSON.stringify(buildDataset(laws, { baseUrl: `${origin}${base}`, generated: buildDate }), null, 2)));
  writes.push(writePage(join(out, 'data', 'lawtome.csv'), datasetCsv(laws, { baseUrl: `${origin}${base}` })));
  // 404.html at the output root: the host serves it for unmatched paths. A
  // crawler-facing error page (noindex), not a "page", so it doesn't touch counts.
  writes.push(writePage(join(out, '404.html'), notFoundPage({ base, origin, count: publishedCount })));

  // Site files (crawler-facing, NOT "pages"): a sitemap of every crawlable HTML
  // URL, a permissive robots.txt pointing at it, and a Netlify-style redirect map
  // seeded from any law.redirectFrom (a permalink-lifecycle hook per spec §8A).
  // The `paths` list is base-relative and ordered home → laws → browse →
  // categories → graph, so Task 14's coin/about/coined/privacy just append.
  const paths = [
    '',                                       // home root
    ...laws.map(l => `laws/${l.slug}/`),      // one per law
    'browse/',
    ...present.map(cat => `category/${cat}/`),// one per present category
    'graph/',
    'coin/',                                  // Task 14 static pages
    'about/',
    'coined/',
    'privacy/',
    'tension/',                               // cross-corpus opposing-pairs view
    'compare/',                               // "X vs Y" comparison hub
    ...compares.map((p) => `compare/${p.slug}/`), // one per compared pair
    'reliability/',                           // veracity facet hub
    ...presentTiers.map((v) => `reliability/${reliabilitySlug(v)}/`),
    'collections/',                           // curated-collections hub
    ...collections.map((c) => `collections/${c.slug}/`),
    'quiz/',                                  // law of the day + quiz
    'situations/',                            // reverse lookup: problem -> law
    'named-after/',                           // eponym index
    'timeline/',                              // by-era browse
    'data/',                                  // dataset download page (indexable)
    'for/',                                   // audience hub
    ...audiences.map((a) => `for/${a.slug}/`),
    'features/',                              // product tour
    'manifesto/',                             // positioning essay
  ];
  writes.push(writePage(join(out, 'sitemap.xml'), buildSitemap(paths, `${origin}${base}`, buildDate)));
  writes.push(writePage(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}${base}sitemap.xml\n# llms.txt: ${origin}${base}llms.txt\n`));

  // llms.txt + llms-full.txt (GEO): the llmstxt.org content map for generative
  // crawlers. Compact index (one bullet per entry, grouped by category) plus a
  // full dump inlining each entry's definition and sources. Crawler-facing site
  // files, so — like the sitemap — they don't count toward `pages`/`listings`.
  const llmsOpts = { baseUrl: `${origin}${base}` };
  writes.push(writePage(join(out, 'llms.txt'), buildLlmsIndex(laws, categories, llmsOpts)));
  writes.push(writePage(join(out, 'llms-full.txt'), buildLlmsFull(laws, categories, llmsOpts)));

  // Atom feed of the newest entries + site identity (favicon PNG derived from the
  // brand logo, and a web-app manifest). All crawler/OS-facing, not "pages".
  writes.push(writePage(join(out, 'feed.xml'), buildFeed(laws, { baseUrl: `${origin}${base}`, updated: `${buildDate}T00:00:00Z`, siteName: 'The Law Tome' })));
  const logoSvg = await readFile(join(assetsDir, 'logo.svg'), 'utf8');
  writes.push(writePage(join(out, 'icon-512.png'), renderPng(logoSvg)));
  const manifest = {
    name: 'The Law Tome',
    short_name: 'Law Tome',
    description: 'The largest unified, defined, and sourced directory of named laws, principles, effects, razors, and paradoxes.',
    start_url: base,
    scope: base,
    display: 'standalone',
    background_color: '#14161c',
    theme_color: '#14161c',
    icons: [
      { src: `${base}assets/logo.svg`, type: 'image/svg+xml', sizes: 'any' },
      { src: `${base}icon-512.png`, type: 'image/png', sizes: '512x512', purpose: 'any' },
    ],
  };
  writes.push(writePage(join(out, 'site.webmanifest'), JSON.stringify(manifest, null, 2)));

  // _redirects: one `from  to  301` line per law.redirectFrom entry (each an old
  // base-relative path that should 301 to the law's current permalink). Seed data
  // has none, so the file is just a header comment — its presence proves the hook.
  const redirects = [];
  for (const law of laws) {
    // Array.isArray guard: a non-array redirectFrom (a stray string would iterate
    // characters; a number/object would throw and fail the build) yields no lines.
    const from = Array.isArray(law.redirectFrom) ? law.redirectFrom : [];
    for (const old of from) {
      redirects.push(`${base}${old}  ${base}laws/${law.slug}/  301`);
    }
  }
  const redirectsBody = '# Netlify-style redirect map (from  to  status). Seeded from law.redirectFrom.\n'
    + (redirects.length ? redirects.join('\n') + '\n' : '');
  writes.push(writePage(join(out, '_redirects'), redirectsBody));

  await Promise.all(writes);

  await cp(assetsDir, join(out, 'assets'), { recursive: true });

  // `pages` counts home + one page per law (unchanged semantics). Browse and
  // per-category listings are reported in `listings`; the graph explorer is a
  // distinct page reported separately so no existing count assertion shifts.
  // `listings`: browse + present categories + the 4 Task 14 static pages (coin,
  // about, coined, privacy) + the tension index + the reliability hub + one page
  // per present reliability tier + the collections hub + one page per collection
  // + the quiz page + the situations page + named-after + timeline + saved + the
  // data page (the .json/.csv downloads are data files, not listings) + the
  // marketing pages: the audience hub + one page per audience + features +
  // manifesto. `pages` stays home + one page per law.
  const marketing = 1 + audiences.length + 1 + 1; // for hub + audiences + features + manifesto
  return { pages: laws.length + 1, listings: 1 + present.length + 5 + 1 + presentTiers.length + 1 + collections.length + 1 + 1 + 4 + marketing, graph: 1, og: laws.length };
}

// CLI: only runs when invoked directly (so `npm run build` works, imports don't).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = JSON.parse(await (await import('node:fs/promises')).readFile('site.config.json', 'utf8'));
  const arg = (name) => (process.argv.find(a => a.startsWith(`--${name}=`)) || '').split('=')[1];
  const base = arg('base') || cfg.base;
  // origin override lets a deploy target (e.g. a GitHub Pages project host) emit
  // canonical/og URLs that point at where the site is ACTUALLY served, instead of
  // the production origin baked into site.config.json.
  const origin = arg('origin') || cfg.origin;
  buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out: 'dist', ...cfg, base, origin })
    .then(r => console.log('built', r));
}
