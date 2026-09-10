// Task 8 build orchestrator. Wires corpus + validator + templates into `out/`:
// a home page, one page per law (with corpus-order prev/next neighbours), and a
// verbatim copy of the assets directory. Throws before writing anything if the
// corpus fails validation, so a corpus that breaks any anti-fabrication rule
// never ships a page.
import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCorpus, loadCategories } from './corpus.mjs';
import { validateCorpus } from './validate.mjs';
import { manifestFile, resolve as resolveLastmod, stamp } from './lastmod.mjs';
import { keyFile as indexNowKeyFile, validKey as validIndexNowKey } from './indexnow.mjs';
import { lawPage } from '../src/templates/law.mjs';
import { homePage } from '../src/templates/home.mjs';
import { listingPage } from '../src/templates/listing.mjs';
import { graphPage } from '../src/templates/graph.mjs';
import { originsPage } from '../src/templates/origins.mjs';
import { countryPage } from '../src/templates/country.mjs';
import { countryGroups, countriesWithPages, countryPath } from './countries.mjs';
import { coinPage, aboutPage, coinedIndex, privacyPage, notFoundPage, redirectStub } from '../src/templates/static-pages.mjs';
import { tensionPage } from '../src/templates/tension.mjs';
import { comparePage, compareHubPage } from '../src/templates/compare.mjs';
import { tensionPairs, comparePairs } from './relations.mjs';
import { reliabilityHubPage } from '../src/templates/reliability.mjs';
import { kinds, kindPath, kindOf } from './kinds.mjs';
import { kindsHubPage, kindPage } from '../src/templates/kinds.mjs';
import { akaPage, quotesPage } from '../src/templates/lookup.mjs';
import { bestKnown, bestKnownPage } from '../src/templates/bestknown.mjs';
import { RELIABILITY_TIERS, reliabilitySlug, setAssetVersions, setBuildDate, personSlug } from '../src/templates/partials.mjs';
import { collectionsIndexPage, collectionPage } from '../src/templates/collections.mjs';
import { resolveCollections } from './collections.mjs';
import { quizPage, scorePage } from '../src/templates/quiz.mjs';
import { dayIndex, ROUND as QUIZ_ROUND } from './quiz.mjs';
import { situationsPage } from '../src/templates/situations.mjs';
import { problemPage } from '../src/templates/problems.mjs';
import { diagnosePage, diagnoseData } from '../src/templates/diagnose.mjs';
import { printPage } from '../src/templates/print.mjs';
import { embedCard, embedToday, embedDocsPage } from '../src/templates/embed.mjs';
import { resolveSituations, situationsBySlug } from './situations.mjs';
import { problems, problemPath } from './problems.mjs';
import { audiencesIndexPage, audiencePage } from '../src/templates/audiences.mjs';
import { resolveAudiences } from './audiences.mjs';
import { featuresPage } from '../src/templates/features.mjs';
import { manifestoPage } from '../src/templates/manifesto.mjs';
import { eponymsPage } from '../src/templates/eponyms.mjs';
import { namesHubPage, namesLangPage, namesFor, namesPath, languagesPresent } from '../src/templates/names.mjs';
import { namesakePage, namesakePath, namesakesWithPages, siblingOrderings } from '../src/templates/namesake.mjs';
import { creditsPage } from '../src/templates/credits.mjs';
import { equationsPage, pronunciationPage, sourcesPage } from '../src/templates/surfaces.mjs';
import { isItRealPage, misattributedPage, ratingContradictions } from '../src/templates/veracity.mjs';
import { verdictPage } from '../src/templates/verdict.mjs';
import { verdicts, verdictPath } from './verdicts.mjs';
import { replicationSummary } from './replication.mjs';
import { findings } from './findings.mjs';
import { sheets, sheetPath } from './sheets.mjs';
import { sheetsHubPage, sheetPage } from '../src/templates/sheets.mjs';
import { findingsPage } from '../src/templates/findings.mjs';
import { misattributed } from './attribution.mjs';
import { equations, pronunciations, bibliography } from './surfaces.mjs';
import { eponymGroups } from './eponyms.mjs';
import { timelinePage } from '../src/templates/timeline.mjs';
import { periodPage } from '../src/templates/period.mjs';
import { periods, periodPath, decadesIn, fieldPeriods, fieldPeriodPath } from './periods.mjs';
import { fieldPeriodPage } from '../src/templates/field-period.mjs';
import { eraGroups } from './timeline.mjs';
import { savedPage } from '../src/templates/saved.mjs';
import { dataPage } from '../src/templates/data.mjs';
import { buildDataset, datasetCsv, lawRecord, apiIndex } from './dataset.mjs';
import { buildSearchIndex } from './search-index.mjs';
import { buildGraph } from './graph-data.mjs';
import { quoteCardSvg, renderPng, siteCardSvg, scoreCardSvg, findingCardSvg } from './quotecard.mjs';
import { buildSitemap } from './sitemap.mjs';
import { buildLlmsIndex, buildLlmsFull, buildLawMarkdown } from './llms.mjs';
import { buildFeed } from './feed.mjs';
import { widgetSlugs } from '../src/templates/widgets.mjs';
import { interactiveSlugs } from '../src/templates/interactives.mjs';

/**
 * Every page the build produces, held until the end.
 *
 * Nothing reaches disk while the site is being rendered. Pages carry a token
 * where their "last modified" date goes, and the date cannot be decided until
 * the page has been hashed against the previous build — so the write has to
 * happen after the whole site exists. See build/lastmod.mjs for why.
 *
 * The `writes.push(writePage(...))` shape at all eighty call sites is left
 * alone: writePage still returns a promise and still gets awaited, it simply
 * resolves once the page is buffered rather than once it is written.
 */
async function writePage(path, data) {
  // Stored as given, NOT coerced to a string. Some callers pass a Buffer — the
  // 1,116 Open Graph PNGs among them — and String(buffer) turns every non-UTF-8
  // byte into U+FFFD. The old writePage passed the value straight to writeFile,
  // which writes Buffers raw and ignores the encoding argument; buffering has to
  // preserve that. The quote-card suite caught this by checking the PNG magic
  // number, which came back as EF BF BD: three bytes of replacement character
  // where the file signature should be.
  PAGES.set(path, data);
}
let PAGES = new Map();

/**
 * File path -> the path the sitemap uses, which is what the manifest is keyed
 * on. `dist/laws/x/index.html` is the file; `laws/x/` is the URL; they have to
 * agree or every page looks new on every build.
 */
function urlKey(absPath, out) {
  const r = relative(out, absPath).split(sep).join('/');
  if (r === 'index.html') return '';
  return r.endsWith('/index.html') ? r.slice(0, -'index.html'.length) : r;
}

export async function buildSite(opts) {
  const { dataDir, catFile, assetsDir, out, base = '/', origin = '' } = opts;
  // Persisting the manifest is opt-in, and the CLI is the only caller that asks.
  // The integration suites run full builds into temp directories; if those
  // rewrote the committed manifest, a test run would leave the working tree
  // dirty and the next real build would see every page as changed.
  const { writeManifest = false } = opts;
  PAGES = new Map();

  const [laws, categories] = await Promise.all([loadCorpus(dataDir), loadCategories(catFile)]);

  // Curated image manifest (src/data/images.json), produced by build/fetch-images.py.
  // Optional: an absent or unreadable manifest just means the site renders without
  // portraits, never a broken build — the images are an enhancement, not a
  // dependency. Every entry carries the author, licence and source URL that the
  // licence obliges us to display, so the renderer can always attribute it.
  let images = { people: {} };
  try {
    images = JSON.parse(await readFile('src/data/images.json', 'utf8'));
    images.people = images.people || {};
  } catch { /* no manifest yet */ }

  // Non-image facts (src/data/facts.json) from build/fetch-facts.py: each law's
  // defining formula, the frequency of its name in print, the names it goes by
  // in other languages, and its namesake's pronunciation and birthplace. Also
  // optional — the site renders without it.
  let facts = {};
  try { facts = JSON.parse(await readFile('src/data/facts.json', 'utf8')); }
  catch { /* not harvested yet */ }

  // The coastline for the origins map — one pre-projected SVG path, generated
  // once by build/make-worldmap.py from public-domain Natural Earth data and
  // committed, so the build stays offline. Optional like the rest.
  let world = {};
  try { world = JSON.parse(await readFile('src/data/world-land.json', 'utf8')); }
  catch { /* no map data */ }

  // What sort of thing each namesake is, with the Wikidata QID that settled it
  // (build/fetch-namesake-kind.py). A namesake page uses it twice: to publish
  // only for people, and to link the record instead of paraphrasing a life.
  let namesakeKinds = {};
  try { namesakeKinds = JSON.parse(await readFile('src/data/namesake-kinds.json', 'utf8')); }
  catch { /* not harvested yet */ }

  // FORRT's replication counts (build/fetch-replication.py), matched to the
  // corpus by effect name. Optional like the rest of the harvested data: without
  // it every page renders exactly as before, minus one externally-sourced line.
  let replication = { entries: {} };
  try { replication = JSON.parse(await readFile('src/data/replication.json', 'utf8')); }
  catch { /* not harvested yet */ }

  // Counts of the other public collections of named laws, so the home page can
  // show the scale claim as a comparison instead of asserting a superlative.
  // Absent, the block simply does not render.
  let comparison = null;
  try { comparison = JSON.parse(await readFile('src/data/comparison.json', 'utf8')); }
  catch { /* no comparison recorded */ }

  const errs = validateCorpus(laws, categories);
  if (errs.length) throw new Error('validation failed:\n' + errs.join('\n'));

  // A widget keyed to a slug that does not exist renders nothing, reports
  // nothing, and looks exactly like a law that was never given one. The Pareto
  // principle sat like that: keyed 'the-pareto-principle' against a corpus slug
  // of 'pareto-principle', so its calculator had never once appeared. Fail the
  // build rather than ship another silent no-op.
  {
    const slugs = new Set(laws.map((l) => l.slug));
    const orphans = widgetSlugs().concat(interactiveSlugs()).filter((k) => !slugs.has(k));
    if (orphans.length) {
      throw new Error('widget spec keyed to unknown slug(s): ' + orphans.join(', '));
    }
  }

  // Content-hash the mutable assets BEFORE any page renders, so every emitted
  // reference carries ?v=<hash>. Without this a returning visitor can be served a
  // cached stylesheet/script against freshly-rebuilt HTML. Fonts and the logo are
  // deliberately excluded: they're effectively immutable and already long-cached.
  const VERSIONED = [
    'assets/styles.css', 'assets/icons/tabler.css', 'assets/common.js',
    'assets/search.js', 'assets/graph.js', 'assets/quiz.js', 'assets/saved.js',
  ];
  const versions = {};
  await Promise.all(VERSIONED.map(async (rel) => {
    try {
      const buf = await readFile(join(assetsDir, rel.replace(/^assets\//, '')));
      versions[rel] = createHash('sha256').update(buf).digest('hex').slice(0, 8);
    } catch { /* asset absent in this build — fall back to an unversioned URL */ }
  }));
  setAssetVersions(versions);

  // Validation passed — clean the output tree so a rebuild can't serve a ghost
  // page for a since-removed or renamed law. Done AFTER the validation gate, so a
  // failed build leaves any previous good output intact.
  await rm(out, { recursive: true, force: true });

  const byslug = Object.fromEntries(laws.map(l => [l.slug, l]));
  // The namesakes that actually have a row on /named-after/. The home page's
  // people band links straight at those rows, so it must not offer a face whose
  // anchor no longer exists — merging duplicate laws can retire a namesake while
  // their portrait stays in the image manifest.
  const eponymSlugs = new Set(eponymGroups(laws).map((g) => personSlug(g.person)));
  const publishedCount = opts.publishedCount ?? laws.length;
  // Centuries and busy decades. Hoisted above the law pages because each one
  // links its own period, and a law page must not offer a URL the build did
  // not write — see build/periods.mjs for which decades earn a page.
  const periodList = periods(laws);
  const periodSlugs = new Set(periodList.map((p) => p.slug));
  // …and the field x period crosses, hoisted for the same reason: both the
  // field listings and the period pages link them, and both are written before
  // the crosses' own pages are.
  const fps = fieldPeriods(laws);
  const fieldTotals = {};
  for (const l of laws) if (l.category) fieldTotals[l.category] = (fieldTotals[l.category] || 0) + 1;
  const periodTotals = Object.fromEntries(periodList.map((p) => [p.slug, p.laws.length]));
  // A single build timestamp shared by every page, surfaced as the JSON-LD
  // dateModified + article:modified_time freshness signal. Honest: it records
  // when the page was last generated. Overridable so a reproducible build can
  // pin it. ISO 8601 (date only keeps it stable across a day's rebuilds).
  const buildDate = opts.buildDate ?? new Date().toISOString().slice(0, 10);
  // Register it once so every hub's CollectionPage can declare dateModified
  // without fifteen call sites having to remember to pass it.
  setBuildDate(buildDate);

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

  // The graph is built once and used twice: written out as graph.json for the
  // client, and summarised on the /graph/ page so that page can state its own
  // scale instead of describing an unquantified "web".
  const graph = buildGraph(laws, new Set(Object.keys(images.people || {})));
  const graphStats = {
    nodes: (graph.nodes || []).length,
    edges: (graph.edges || graph.links || []).length,
    opposed: (graph.edges || graph.links || []).filter((e) => e && (e.kind === 'opposed' || e.kind === 'tension')).length,
  };

  // The law of the day, server-rendered onto the home page. dayIndex is the same
  // pure function assets/quiz.js mirrors, and it indexes into `laws` — the exact
  // array buildSearchIndex maps 1:1 — so the shipped markup and the client agree
  // for as long as the build is fresh. `today` is injectable so a test can pin it.
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const lawOfTheDay = laws.length ? laws[dayIndex(today, laws.length)] : null;

  // The corpus-level finding, computed once and used three times: the home
  // page leads with it, /how-solid/ is built entirely out of it, and
  // /best-known/ shares its ranking. Cheap and pure, so it is done up here
  // where everything downstream can read the same numbers.
  const ranked = bestKnown(laws, facts);
  const misnamed = misattributed(laws);
  const found = findings(laws, ranked, misnamed);
  // Hoisted with the rest: the /is-it-real/ hub links these, each page is built
  // from them, and the sitemap lists them, so they must be computed once.
  const allVerdicts = verdicts(laws, ranked, { kindOf });

  // Render synchronously, then write concurrently (matters at ~1,400-law scale).
  const writes = [
    // Home: first 12 laws as the featured rotation, plus the law of the day.
    writePage(join(out, 'index.html'), homePage(laws.slice(0, 18), { publishedCount, base, origin, images, eponymSlugs, lawOfTheDay, found, comparison })),
    // Prebuilt client-search index (a DATA file, not a "page"): fetched by
    // src/assets/search.js. Curated situation phrasing is folded in so a typed
    // problem description surfaces the mapped law. In the concurrent writes[] so
    // it's covered by the pre-clean rm + Promise.all.
    writePage(join(out, 'search-index.json'), JSON.stringify(buildSearchIndex(laws, sitMap))),
    // Prebuilt relationship graph (a DATA file, not a "page"): fetched by
    // src/assets/graph.js, which renders a local neighbourhood from it. In the
    // concurrent writes[] so it's covered by the pre-clean rm + Promise.all.
    writePage(join(out, 'graph.json'), JSON.stringify(graph)),
    // The graph explorer page (chrome + empty #graph stage; graph.js fills it).
    writePage(join(out, 'graph', 'index.html'), graphPage({ base, origin, publishedCount, stats: graphStats })),
  ];
  // One page per law. prev/next come from CORPUS ORDER (laws already sorted by `no`).
  for (let i = 0; i < laws.length; i++) {
    const html = lawPage(laws[i], { byslug, categories, base, origin, prev: laws[i - 1], next: laws[i + 1], publishedCount, images, facts, periodSlugs, replication });
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
    const png = renderPng(quoteCardSvg(law, { origin, base }));
    writes.push(writePage(join(out, 'og', `${law.slug}.png`), png));
  }

  // …and one card for the site, used by every page that is not a single entry.
  writes.push(writePage(
    join(out, 'og', 'site.png'),
    renderPng(siteCardSvg({ origin, base, count: publishedCount })),
  ));

  // Browse page: every law.
  writes.push(writePage(
    join(out, 'browse', 'index.html'),
    listingPage(laws, { title: 'Browse', base, kind: 'browse', active: 'browse', origin, categories }),
  ));

  // Comparison pairs are resolved here rather than beside the /compare/ writes:
  // three page types now link a pair at the page that compares it — the tension
  // hub, the collection and reading-list pages, and each field page.
  const compares = comparePairs(laws);
  const compareSlugs = Object.fromEntries(compares.map((p) => [[p.a.slug, p.b.slug].sort().join('|'), p.slug]));

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
      listingPage(membersByCat.get(cat), { title: categories[cat] || cat, base, kind: 'category', origin, categoryKey: cat, count: publishedCount, images, categories, byslug, compareSlugs, periodCrosses: fps.filter((x) => x.field === cat) }),
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
  writes.push(writePage(join(out, 'tension', 'index.html'), tensionPage(tension, { base, origin, count: publishedCount, categories, images, compareSlugs })));
  // "X vs Y" comparison pages: one per near-twin / tension pair the corpus marks,
  // plus a /compare/ hub. High-intent long-tail capture ("Occam vs Hanlon"); pure
  // recombination of each law's verified fields — nothing is authored per pair.
  writes.push(writePage(join(out, 'compare', 'index.html'), compareHubPage(compares, { base, origin, count: publishedCount, images })));
  for (const pair of compares) {
    writes.push(writePage(join(out, 'compare', pair.slug, 'index.html'), comparePage(pair, { base, origin, categories, count: publishedCount, images, byslug, allPairs: compares })));
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
    reliabilityHubPage(
      presentTiers.map((v) => ({ value: v, count: membersByTier.get(v).length, laws: membersByTier.get(v) })),
      { base, origin, count: publishedCount, images },
    ),
  ));
  for (const tier of presentTiers) {
    writes.push(writePage(
      join(out, 'reliability', reliabilitySlug(tier), 'index.html'),
      listingPage(membersByTier.get(tier), { title: `${tier} laws`, base, kind: 'reliability', origin, reliabilityKey: tier, count: publishedCount, images }),
    ));
  }

  // Two lookup surfaces for a reader who does not have the headword: every
  // other name these ideas travel under, and every statement in the form it is
  // quoted. Both are the corpus re-sorted — nothing on either is new.
  writes.push(writePage(join(out, 'also-known-as', 'index.html'),
    akaPage(laws, { base, origin, count: publishedCount, categories })));
  writes.push(writePage(join(out, 'quotes', 'index.html'),
    quotesPage(laws, { base, origin, count: publishedCount, categories })));

  // The one honest answer to "what are the most famous?": somebody else's
  // measurement of how often each name is printed, with the counted phrase
  // shown on every row so the reader can audit it.
  writes.push(writePage(join(out, 'best-known', 'index.html'),
    bestKnownPage(ranked, {
      base, origin, count: publishedCount, categories, corpusTotal: laws.length,
    })));

  // What kind of thing is it — /kinds/ and one page per kind.
  //
  // The list axis: razors, paradoxes, fallacies, theorems, thought experiments.
  // Membership is read off the entry's own name (build/kinds.mjs), so the pages
  // are verifiable by eye and honestly incomplete, and every one of them says so
  // above the list.
  const kindGroups = kinds(laws);
  writes.push(writePage(
    join(out, 'kinds', 'index.html'),
    kindsHubPage(kindGroups, {
      base,
      origin,
      count: publishedCount,
      total: laws.length,
      // The entries whose names say nothing about what kind of thing they are.
      // Listed on the hub rather than silently dropped: a page that files 750
      // of 1,101 and never mentions the other 351 is quietly claiming to be a
      // complete map of the index.
      unclassified: laws.filter((l) => !kindOf(l))
        .sort((a, b) => String(a.name).replace(/^(the|a|an)\s+/i, '')
          .localeCompare(String(b.name).replace(/^(the|a|an)\s+/i, ''), 'en')),
    }),
  ));
  for (const g of kindGroups) {
    writes.push(writePage(
      join(out, 'kinds', g.slug, 'index.html'),
      kindPage(g, {
        base,
        origin,
        count: publishedCount,
        images,
        categories,
        byslug,
        compareSlugs,
        others: kindGroups.filter((o) => o.key !== g.key).sort((a, b) => b.count - a.count),
      }),
    ));
  }

  // Curated collections: an editorial hub + one page per theme. The source file
  // is optional (a corpus without it simply gets no collections); any slug that
  // isn't in the corpus is dropped (no dead links), and empty collections are
  // skipped. Slugs point at existing, already-validated entries only.
  // Both sets are resolved here, before either is written: a collection page
  // names its closest reading list and vice versa (crossAxis), so each write
  // needs the other axis already in hand.
  const audiencesFile = opts.audiencesFile ?? join(dirname(catFile), 'audiences.json');
  let rawAudiences = [];
  try { rawAudiences = JSON.parse(await readFile(audiencesFile, 'utf8')); }
  catch { rawAudiences = []; }
  const { audiences, dropped: droppedAud } = resolveAudiences(rawAudiences, byslug);
  if (droppedAud.length) console.warn(`audiences: dropped ${droppedAud.length} unknown slug(s): ${droppedAud.join(', ')}`);

  const collectionsFile = opts.collectionsFile ?? join(dirname(catFile), 'collections.json');
  let rawCollections = [];
  try { rawCollections = JSON.parse(await readFile(collectionsFile, 'utf8')); }
  catch { rawCollections = []; }
  const { collections, dropped: droppedColl } = resolveCollections(rawCollections, byslug);
  if (droppedColl.length) console.warn(`collections: dropped ${droppedColl.length} unknown slug(s): ${droppedColl.join(', ')}`);
  writes.push(writePage(join(out, 'collections', 'index.html'), collectionsIndexPage(collections, { base, origin, count: publishedCount, images })));
  for (const c of collections) {
    writes.push(writePage(join(out, 'collections', c.slug, 'index.html'), collectionPage(c, { base, origin, count: publishedCount, images, categories, byslug, compareSlugs, siblings: collections, crossSets: audiences })));
  }

  // Law of the day + name-that-law quiz: a static shell filled by assets/quiz.js
  // (which fetches the search index). A learning/return loop, not a "law page".
  writes.push(writePage(join(out, 'quiz', 'index.html'), quizPage({ base, origin, count: publishedCount, categories, laws })));

  // A finished round is shareable — but a score pasted into a chat is a bare
  // number until it carries a link, and a link is ignored until it unfurls into
  // a picture. So: eleven landing pages, one per possible score, each naming its
  // own card. They are noindex (see scorePage) and stay out of the sitemap.
  for (let s = 0; s <= QUIZ_ROUND; s += 1) {
    writes.push(writePage(join(out, 'quiz', 'score', String(s), 'index.html'),
      scorePage({ score: s, total: QUIZ_ROUND, base, origin, count: publishedCount })));
    writes.push(writePage(join(out, 'og', `quiz-${s}.png`),
      renderPng(scoreCardSvg({ score: s, total: QUIZ_ROUND, origin, base }))));
  }

  // Situations: a visible reverse-lookup ("what's the law for…?") built from the
  // same curated map folded into the search index. Emitted unconditionally (empty
  // state when a corpus has none), so the footer link never dangles.
  // …and the same rows cut by PROBLEM rather than by field. The hub answers 581
  // questions at once, which is a good browse and a poor landing page; these are
  // the pages a reader who typed one of those questions can actually arrive on.
  // The assignment is computed from the situation's own wording (build/problems),
  // so no row was hand-filed onto a page it flatters.
  const { themes: problemThemes, unassigned: sitUnassigned } = problems(rawSituations, byslug);
  writes.push(writePage(join(out, 'situations', 'index.html'), situationsPage(situations, { base, origin, count: publishedCount, categories, images, themes: problemThemes })));
  for (const th of problemThemes) {
    writes.push(writePage(join(out, 'situations', th.slug, 'index.html'),
      problemPage(th, { base, origin, count: publishedCount, siblings: problemThemes, images, total: situations.length })));
  }
  console.log(`problems: ${problemThemes.length} themes, ${situations.length - sitUnassigned} of ${situations.length} situations placed`);

  // Marketing: audience ("for …") pages, a features tour, and a manifesto.
  // Audiences are curated persona shortlists (optional file; unknown slugs dropped).
  writes.push(writePage(join(out, 'for', 'index.html'), audiencesIndexPage(audiences, { base, origin, count: publishedCount, images })));
  for (const a of audiences) {
    writes.push(writePage(join(out, 'for', a.slug, 'index.html'), audiencePage(a, { base, origin, count: publishedCount, images, categories, byslug, compareSlugs, siblings: audiences, crossSets: collections })));
  }
  writes.push(writePage(join(out, 'features', 'index.html'), featuresPage({
    base, origin, count: publishedCount, comparison,
    imagery: { people: Object.keys(images.people || {}).length, figures: Object.keys(images.figures || {}).length },
  })));
  writes.push(writePage(join(out, 'manifesto', 'index.html'), manifestoPage({ base, origin, count: publishedCount })));

  // Eponym index + timeline: two more browse axes over existing fields
  // (namedAfter, coinedYear). No new corpus data.
  const epGroups = eponymGroups(laws);
  // Fifty-two people account for 117 laws between them, and until now that
  // cluster was a row in a 625-name A–Z. Each gets a page; a one-law namesake
  // does not, because that page would restate the law under a second URL.
  const namesakePages = namesakesWithPages(epGroups);
  const namesakeHrefs = Object.fromEntries(namesakePages.map((g) => [g.person, `${base}${namesakePath(g.person)}`]));
  // Matched across ALL groups, not just the ones with pages: an ordering that
  // carries a single law has no page, but the pair still deserves the pointer.
  const orderings = siblingOrderings(epGroups);
  writes.push(writePage(join(out, 'named-after', 'index.html'), eponymsPage(epGroups, { base, origin, count: publishedCount, images, namesakeHrefs })));
  for (const g of namesakePages) {
    writes.push(writePage(join(out, ...namesakePath(g.person).split('/').filter(Boolean), 'index.html'),
      namesakePage(g, { base, origin, count: publishedCount, images, facts, categories, byslug, compareSlugs, kinds: namesakeKinds, siblings: orderings[g.person] || [] })));
  }
  // The names these ideas already go by elsewhere — one index per language, off
  // /names/. Only languages with at least one recorded name get a page.
  const namesLangs = languagesPresent(laws, facts);
  const lawsWithNames = laws.filter((l) => {
    const f = facts[l.slug];
    return !!(f && f.names && f.names.labels && Object.values(f.names.labels).some(Boolean));
  }).length;
  writes.push(writePage(join(out, 'names', 'index.html'),
    namesHubPage(namesLangs, { base, origin, count: publishedCount, lawsWithNames })));
  for (const lang of namesLangs) {
    writes.push(writePage(join(out, 'names', lang.code, 'index.html'),
      namesLangPage(lang, namesFor(laws, facts, lang.code), {
        base, origin, count: publishedCount, categories,
        others: namesLangs.filter((o) => o.code !== lang.code),
      })));
  }
  // The cut nobody could address: a field crossed with a period. Only buckets
  // holding at least ten entries earn a page (build/periods.mjs).
  for (const fp of fps) {
    writes.push(writePage(join(out, 'category', fp.field, fp.period.slug, 'index.html'),
      fieldPeriodPage(fp, {
        base, origin, count: publishedCount, images, categories, compareSlugs,
        siblings: fps,
        fieldTotal: fieldTotals[fp.field] || 0,
        periodTotal: periodTotals[fp.period.slug] || 0,
      })));
  }
  // Where the namesakes were born, on a map — birthplaces from facts.json over
  // the Natural Earth coastline. Emitted unconditionally (with an empty state
  // when nothing is harvested), because every hub's footer links it and a
  // conditional page there would be a conditional 404.
  const allCountries = countryGroups(laws, facts);
  const countryPages = countriesWithPages(allCountries);
  writes.push(writePage(join(out, 'origins', 'index.html'),
    originsPage(epGroups, { base, origin, count: publishedCount, facts, world, countries: countryPages })));
  // One page per country with enough entries to be worth landing on. Birthplace
  // only — see build/countries.mjs for what that does and does not claim.
  for (const g of countryPages) {
    writes.push(writePage(join(out, 'origins', g.slug, 'index.html'),
      countryPage(g, {
        base, origin, count: publishedCount, images, categories, byslug, compareSlugs,
        namesakeHrefs,
        others: countryPages.filter((o) => o.slug !== g.slug),
      })));
  }
  // Arrive with a problem, leave with the laws that describe it — the same
  // curated situations as /situations/, asked as questions.
  writes.push(writePage(join(out, 'diagnose', 'index.html'),
    diagnosePage(diagnoseData(situations, rawSituations), { base, origin, count: publishedCount, categories })));

  // The whole index as one document, typeset for paper. noindex — it is the
  // same text as 1,101 pages that are indexed, and a duplicate of the corpus is
  // not something to offer a crawler.
  writes.push(writePage(join(out, 'print', 'index.html'),
    printPage(laws, { base, origin, categories, buildDate, bib: bibliography(laws) })));

  // Embeddable cards. Self-contained documents, noindex, absolute links: an
  // iframe has no base to resolve against and no stylesheet of ours.
  for (const l of laws) {
    writes.push(writePage(join(out, 'embed', l.slug, 'index.html'), embedCard(l, { base, origin })));
  }
  writes.push(writePage(join(out, 'embed', 'today', 'index.html'),
    embedToday(laws[dayIndex(new Date(buildDate), laws.length)] || laws[0], { base, origin })));
  writes.push(writePage(join(out, 'embed', 'index.html'),
    embedDocsPage(laws.find((l) => l.slug === 'goodharts-law') || laws[0], { base, origin, count: publishedCount })));

  // Two question-shaped pages over judgements the corpus already carried: the
  // reliability rating, and the entries whose own origin text says the namesake
  // was not the whole story.
  // An entry rated Empirical whose own limits open "the effect is contested" is
  // answering the same question two ways. Warn rather than fail: the fix is an
  // editorial judgement about evidence, not something a build should make.
  const contradictions = ratingContradictions(laws);
  if (contradictions.length) {
    console.warn(`reliability: ${contradictions.length} Empirical entr${contradictions.length === 1 ? 'y' : 'ies'} whose own limits call the effect contested: ${contradictions.map((c) => c.slug).join(', ')}`);
  }
  writes.push(writePage(join(out, 'is-it-real', 'index.html'),
    isItRealPage(laws, { base, origin, count: publishedCount, categories, verdicts: allVerdicts })));

  // …and a page per entry for the ones the question is actually asked about:
  // in the print-frequency ranking (somebody is asking) and not rated Empirical
  // (the answer is interesting). "Is Ohm's law real" needs no page. Each of these
  // carries three numbers no entry page has — the entry's rank, its field's share
  // of soft ratings, and the corpus share — which is the whole reason it is a
  // separate URL rather than a second description of the same idea.
  for (const v of allVerdicts) {
    writes.push(writePage(join(out, 'is-it-real', v.slug, 'index.html'),
      verdictPage(v, { base, origin, count: publishedCount, categories, replication })));
  }
  console.log(`verdicts: ${allVerdicts.length} entries are well known, softly rated, and the kind of claim that can fail`);
  const repSum = replicationSummary(laws, replication);
  console.log(`replication: ${repSum.matched} entries carry FReD counts (${repSum.studies} studies, ${repSum.results} results); `
    + `${repSum.contradictions.length} sit awkwardly against our own rating`);
  writes.push(writePage(join(out, 'misattributed', 'index.html'),
    misattributedPage(misnamed, { base, origin, count: publishedCount })));

  // /how-solid/ — the one page that argues something rather than listing it.
  // It needs both of the site's independent measures at once: the reliability
  // rating on every entry, and the external print-frequency ranking. Crossing
  // them is the only claim this project is in a position to make, and it is
  // computed here rather than written into the template so the page can never
  // drift from the corpus it describes.
  writes.push(writePage(join(out, 'how-solid', 'index.html'),
    findingsPage(found, { base, origin, count: publishedCount, categories })));

  // Cheat sheets: one field per printable page. The index is the right size for
  // a reference and the wrong size for a wall, and nothing here sat between one
  // entry and all 1,116 of them.
  const allSheets = sheets(laws, ranked, categories);
  writes.push(writePage(join(out, 'sheets', 'index.html'),
    sheetsHubPage(allSheets, { base, origin, count: publishedCount })));
  for (const sh of allSheets) {
    writes.push(writePage(join(out, 'sheets', sh.slug, 'index.html'),
      sheetPage(sh, { base, origin, count: publishedCount, siblings: allSheets })));
  }
  writes.push(writePage(join(out, 'og', 'how-solid.png'), renderPng(findingCardSvg({
    rows: [
      ...found.curve.map((c) => ({ label: `Top ${c.n}`, share: c.share })),
      { label: 'All entries', share: found.softAllShare },
    ],
    origin,
    base,
  }))));
  // Three reference surfaces over data the corpus already held one item at a
  // time: the formulas, the spoken names, and the whole bibliography.
  writes.push(writePage(join(out, 'equations', 'index.html'),
    equationsPage(equations(laws, facts), { base, origin, count: publishedCount, categories })));
  writes.push(writePage(join(out, 'pronunciation', 'index.html'),
    pronunciationPage(pronunciations(laws, facts), { base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'sources', 'index.html'),
    sourcesPage(bibliography(laws), { base, origin, count: publishedCount, total: publishedCount })));
  // Image credits — the attribution the CC licences require, in one auditable list.
  writes.push(writePage(join(out, 'credits', 'index.html'), creditsPage(images, { base, origin, count: publishedCount })));
  writes.push(writePage(join(out, 'timeline', 'index.html'), timelinePage(eraGroups(laws), { base, origin, count: publishedCount, images, periodSlugs })));
  // One page per century, and one per decade with enough entries to be worth a
  // page (see build/periods.mjs) — both hang off /timeline/.
  for (const p of periodList) {
    writes.push(writePage(join(out, 'timeline', p.slug, 'index.html'),
      periodPage(p, {
        base, origin, count: publishedCount, images, categories, byslug, compareSlugs,
        siblings: periodList,
        decades: p.kind === 'century' ? decadesIn(p.century, laws) : [],
        fieldCrosses: fps.filter((x) => x.period.slug === p.slug),
      })));
  }

  // Saved shortlist: a client-only page (localStorage), noindex — filled by
  // assets/saved.js, which every law page's Save button writes to.
  writes.push(writePage(join(out, 'saved', 'index.html'), savedPage({ base, origin, count: publishedCount })));

  // Dataset (/data/): a page plus the downloads themselves. METADATA ONLY — the
  // long-form prose is deliberately withheld (build/dataset.mjs), so the corpus's
  // written value stays on-site while the index/graph/citations are freely
  // reusable under CC BY. The .json/.csv are data files (not crawlable pages), so
  // they are NOT added to the sitemap.
  writes.push(writePage(join(out, 'data', 'index.html'), dataPage({ base, origin, count: publishedCount, generated: buildDate, laws, categories })));
  writes.push(writePage(join(out, 'data', 'lawtome.json'), JSON.stringify(buildDataset(laws, { baseUrl: `${origin}${base}`, generated: buildDate }), null, 2)));
  writes.push(writePage(join(out, 'data', 'lawtome.csv'), datasetCsv(laws, { baseUrl: `${origin}${base}` })));

  // One JSON record per entry, at laws/<slug>.json — the page's URL with a
  // different extension, which is the convention a consumer guesses first.
  // Data files, not pages: they stay out of `pages`/`listings` and out of the
  // sitemap, exactly like search-index.json and graph.json.
  {
    const baseUrl = `${origin}${base}`;
    // Which entries point AT each entry. The corpus records relations one way
    // per file, so a consumer reading one record cannot see the other side.
    const inbound = new Map();
    for (const l of laws) {
      for (const r of (Array.isArray(l.related) ? l.related : [])) {
        if (!r || !r.slug || !byslug[r.slug]) continue;
        if (!inbound.has(r.slug)) inbound.set(r.slug, []);
        inbound.get(r.slug).push({ slug: l.slug, kind: r.kind ?? null });
      }
    }
    for (const l of laws) {
      writes.push(writePage(join(out, 'laws', `${l.slug}.json`), JSON.stringify(lawRecord(l, {
        baseUrl,
        categories,
        situations: situations.filter((x) => x.law && x.law.slug === l.slug).map((x) => x.situation),
        inbound: inbound.get(l.slug) || [],
        generated: buildDate,
      }), null, 2)));
    }
    writes.push(writePage(join(out, 'api.json'), JSON.stringify(apiIndex(laws, { baseUrl, generated: buildDate }), null, 2)));
  }
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
    'best-known/',                            // ranked by printed frequency
    'also-known-as/',                         // every alias, cross-referenced
    'quotes/',                                // every statement, as it is quoted
    'kinds/',                                 // the index by kind of named thing
    ...kindGroups.map((g) => kindPath(g)),    // one per kind above the floor
    'collections/',                           // curated-collections hub
    ...collections.map((c) => `collections/${c.slug}/`),
    'quiz/',                                  // law of the day + quiz
    'situations/',                            // reverse lookup: problem -> law
    ...problemThemes.map((t) => problemPath(t)), // …and one page per problem theme
    ...allVerdicts.map((v) => verdictPath(v)), // "is X real?", one per well-known soft entry
    'names/',                                 // the names these ideas go by elsewhere
    ...namesLangs.map((l) => namesPath(l.code)), // one index per language
    'named-after/',                           // eponym index
    ...namesakePages.map((g) => namesakePath(g.person)), // one per multi-law person
    'timeline/',                              // by-era browse
    ...periodList.map((p) => periodPath(p)),  // one per century and busy decade
    ...fps.map((fp) => fieldPeriodPath(fp)),  // one per field x period with >=10
    'data/',                                  // dataset download page (indexable)
    'for/',                                   // audience hub
    ...audiences.map((a) => `for/${a.slug}/`),
    'features/',                              // product tour
    'manifesto/',                             // positioning essay
    'origins/',                               // birthplace map of the namesakes
    ...countryPages.map((g) => countryPath(g.slug)), // one per well-represented country
    'credits/',                               // image sources + licences
    'equations/',                             // the laws that are formulas
    'pronunciation/',                         // how the namesakes' names sound
    'sources/',                               // the bibliography, by domain
    'diagnose/',                              // problem in, laws out
    'embed/',                                 // how to put a card on your site
    'how-solid/',                             // the finding: fame runs against evidence
    'sheets/',                                // one printable page per field
    ...allSheets.map((s) => sheetPath(s)),    // …and the sheets themselves
    'is-it-real/',                            // every entry rated by evidence
    'misattributed/',                         // Stigler's law, with the receipts
  ];
  // Which images each page actually carries, for the sitemap's image extension.
  // Only the canonical home of each picture is declared: a law's own figure and
  // its namesake's portrait on the law page, and the portrait again on that
  // person's eponym page (where it is the subject, not an illustration).
  // Thumbnail strips on hub pages are deliberately left out — the same file
  // listed on forty pages tells a crawler nothing about where it belongs.
  //
  // The caption is the credit line the licence obliges us to publish, in plain
  // text: the same string doing two jobs.
  const imgCaption = (img) => [img.artist || 'Unknown', img.licence, img.source]
    .filter(Boolean).join(' · ');
  const imagesByPath = {};
  const pushImg = (p, entry) => { (imagesByPath[p] ||= []).push(entry); };
  for (const l of laws) {
    const p = `laws/${l.slug}/`;
    const fig = (images.figures || {})[l.slug];
    if (fig) pushImg(p, {
      loc: `${origin}${base}assets/img/figures/${l.slug}.webp`,
      title: l.name,
      caption: imgCaption(fig),
    });
    const por = l.namedAfter ? (images.people || {})[personSlug(l.namedAfter)] : null;
    if (por) pushImg(p, {
      loc: `${origin}${base}assets/img/people/${por.slug}.webp`,
      title: por.person || l.namedAfter,
      caption: imgCaption(por),
    });
  }
  for (const g of namesakePages) {
    const por = (images.people || {})[personSlug(g.person)];
    if (por) pushImg(namesakePath(g.person), {
      loc: `${origin}${base}assets/img/people/${por.slug}.webp`,
      title: por.person || g.person,
      caption: imgCaption(por),
    });
  }
  // CNAME — how GitHub Pages learns its custom domain.
  //
  // Pages reads a file literally named CNAME at the root of the published
  // artifact and serves the site from that host. Without it a custom domain
  // configured in the repository settings is silently dropped on the next
  // deploy, because each deploy replaces the whole artifact.
  //
  // Emitted only when the site is served from the ROOT of its own host. A Pages
  // custom domain always serves at the root, so a base of anything other than
  // '/' means the site is behind a rewrite on somebody else's host and a CNAME
  // would be a claim on a domain this artifact does not own.
  if (base === '/' && origin) {
    writes.push(writePage(join(out, 'CNAME'), `${new URL(origin).host}\n`));
  }

  // IndexNow proof-of-ownership file. Named after the key, containing the key,
  // at the site root — that is the entire verification scheme. The key is public
  // by design: it proves that whoever submits URLs can also write to this site,
  // which is all the protocol needs it to prove.
  //
  // Written whether or not submission is switched on, because the file has to
  // already be there when the first ping happens, and an unused text file costs
  // 33 bytes.
  if (opts.indexNowKey && validIndexNowKey(opts.indexNowKey)) {
    const kf = indexNowKeyFile(opts.indexNowKey);
    writes.push(writePage(join(out, kf.name), kf.body));
  }

  // The sitemap is NOT written here. It needs a real per-page <lastmod>, which
  // needs every page's hash, which needs every page to have been rendered — so
  // it is built at the flush below, after the last writePage call in this
  // function. Leaving the call here would have silently dated only the pages
  // rendered above this line.
  // robots.txt — a stated policy rather than a default.
  //
  // The generative crawlers are named explicitly and allowed explicitly. A bare
  // `User-agent: *` already permits them, but several of these agents are
  // routinely blocked elsewhere and a named Allow is an unambiguous statement
  // that this corpus may be read, quoted and cited.
  //
  // Two of these are widely misunderstood and worth stating precisely, because
  // getting them wrong is how a site ends up invisible to an assistant while
  // ranking perfectly well in search:
  //
  //   OAI-SearchBot is not GPTBot. GPTBot is training; OAI-SearchBot builds the
  //   index ChatGPT Search answers from. Allowing one does not allow the other.
  //   Anthropic and Perplexity split their agents the same way, which is why
  //   all three of each are named here rather than one apiece.
  //
  //   Google-Extended governs training and grounding for Gemini Apps and Vertex
  //   AI. It is NOT the switch for AI Overviews or AI Mode in Google Search —
  //   those run off ordinary Googlebot access plus the snippet controls — and
  //   Google states it is not a ranking signal. Allowing it is still right for
  //   an openly-licensed corpus that wants to be quoted; it just does not do
  //   the thing it is usually described as doing.
  //
  // Nothing is disallowed. The noindex surfaces (/print/, /embed/, /saved/)
  // must stay crawlable, because a Disallow would stop a crawler ever reading
  // the noindex directive that keeps them out of the index.
  const AI_AGENTS = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot',
    'Amazonbot', 'meta-externalagent', 'Bytespider', 'cohere-ai', 'Diffbot',
  ];
  writes.push(writePage(join(out, 'robots.txt'), [
    '# The Law Tome — a defined, sourced index of named laws, principles and effects.',
    '# Text licensed CC BY 4.0. Read it, quote it, cite it; the attribution travels with it.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Answer and generative engines: allowed by name, not merely by default.',
    ...AI_AGENTS.flatMap((a) => [`User-agent: ${a}`, 'Allow: /']),
    '',
    `Sitemap: ${origin}${base}sitemap.xml`,
    '',
    '# Machine-readable summaries of this site, for agents that prefer them:',
    `#   ${origin}${base}llms.txt        — the map, ~190 KB`,
    `#   ${origin}${base}llms-full.txt   — every entry in full`,
    `#   ${origin}${base}api.json        — the index as JSON, one record per entry`,
    `#   ${origin}${base}today.json      — the entry selected for today, as JSON`,
    '',
  ].join('\n')));

  // llms.txt + llms-full.txt: the llmstxt.org content map. Compact index (one
  // bullet per entry, grouped by category) plus a full dump inlining each
  // entry's definition and sources. Crawler-facing site files, so — like the
  // sitemap — they don't count toward `pages`/`listings`.
  //
  // Kept, but not believed in. Ahrefs' server-log study across 137,210 domains
  // (May 2026) found 97% of published llms.txt files received zero requests in
  // the month; that of the 3% fetched, only 19.5% of requests came from named AI
  // tools against 21.7% from SEO audit tools checking the file exists; and —
  // decisively — that no AI bot ever requested an llms.txt that wasn't there.
  // They do not probe for it, so the file cannot be found by adoption. Google
  // says outright that no AI text file is needed for AI Overviews or AI Mode.
  //
  // These stay because the corpus is already in memory and generating them is
  // two function calls, which is a fair price for a courtesy export. They are
  // not a distribution channel and nothing downstream should treat them as one.
  // The per-entry Markdown twins and api.json are the exports that a person or
  // an agent can actually build against.
  // The scale claim is appended to the summary line rather than written into
  // llms.mjs, so the figure comes from src/data/comparison.json like every
  // other place it appears, and disappears the day this index stops being the
  // largest. Same rule as the home page and /features/.
  const rivalTop = (comparison && Array.isArray(comparison.others) && comparison.others.length)
    ? Math.max(...comparison.others.map((r) => Number(r.count) || 0)) : 0;
  const llmsOpts = {
    baseUrl: `${origin}${base}`,
    updated: buildDate,
    ...(rivalTop && publishedCount > rivalTop ? {
      description: 'The largest unified, defined, and sourced directory of named laws, principles, effects, razors, and paradoxes.'
        + ` No other collection comes close: the next-biggest carries ${rivalTop} entries and rates none of them (counted ${comparison.checkedOn}).`,
    } : {}),
  };
  writes.push(writePage(join(out, 'llms.txt'), buildLlmsIndex(laws, categories, llmsOpts)));
  writes.push(writePage(join(out, 'llms-full.txt'), buildLlmsFull(laws, categories, llmsOpts)));

  // Atom feed of the newest entries + site identity (favicon PNG derived from the
  // brand logo, and a web-app manifest). All crawler/OS-facing, not "pages".
  const feedStamp = `${buildDate}T00:00:00Z`;
  const baseHref = `${origin}${base}`;
  writes.push(writePage(join(out, 'feed.xml'), buildFeed(laws, { baseUrl: baseHref, updated: feedStamp, siteName: 'The Law Tome' })));

  // …and one feed per field. A single site-wide feed makes a reader who cares
  // about linguistics subscribe to 1,116 entries to get eleven of them, which is
  // how a feed gets unsubscribed from. Each declares its own self link, because a
  // feed is identified by that URL and twenty feeds claiming /feed.xml are one.
  for (const [slug, title] of Object.entries(categories)) {
    const inField = laws.filter((l) => l.category === slug);
    if (!inField.length) continue;
    writes.push(writePage(join(out, 'category', slug, 'feed.xml'), buildFeed(inField, {
      baseUrl: baseHref,
      updated: feedStamp,
      path: `category/${slug}/feed.xml`,
      link: `${baseHref}category/${slug}/`,
      title: `The Law Tome — ${title}`,
      subtitle: `Named laws, principles and effects in ${title.toLowerCase()} — defined, sourced, and rated for how far the evidence goes.`,
    })));
  }

  // The law of the day as JSON. /embed/today/ already serves it as an iframe, but
  // an iframe cannot be styled by the site embedding it and cannot be read by
  // anything that is not a browser. This is the same selection — same date, same
  // deterministic index — as data, so a widget, a bot or a shell script can carry
  // it. Cached for an hour rather than immutably: the answer changes at midnight.
  const todayLaw = laws[dayIndex(new Date(buildDate), laws.length)] || laws[0];
  writes.push(writePage(join(out, 'today.json'), JSON.stringify({
    date: buildDate,
    generated: buildDate,
    note: 'The entry selected for this date. Deterministic: the same date always yields the same entry.',
    law: lawRecord(todayLaw, { baseUrl: baseHref, categories }),
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: `The Law Tome — ${baseHref}`,
  }, null, 2)));
  const logoSvg = await readFile(join(assetsDir, 'logo.svg'), 'utf8');
  writes.push(writePage(join(out, 'icon-512.png'), renderPng(logoSvg)));
  const manifest = {
    name: 'The Law Tome',
    short_name: 'Law Tome',
    description: 'The largest unified, defined, and sourced directory of named laws, principles, effects, razors, and paradoxes.',
    start_url: base,
    scope: base,
    display: 'standalone',
    // Match the site's own dark surface. #14161c is a colour the stylesheet no
    // longer uses, so an installed app opened with browser chrome a different
    // shade to the masthead it framed.
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: `${base}assets/logo.svg`, type: 'image/svg+xml', sizes: 'any' },
      { src: `${base}icon-512.png`, type: 'image/png', sizes: '512x512', purpose: 'any' },
    ],
  };
  writes.push(writePage(join(out, 'site.webmanifest'), JSON.stringify(manifest, null, 2)));

  // _redirects: one `from  to  301` line per law.redirectFrom entry (each an old
  // base-relative path that should 301 to the law's current permalink). Seed data
  // has none, so the file is just a header comment — its presence proves the hook.
  // Retired URLs that are not law permalinks. "Laws every engineer learns" was
  // a collection whose six members were a strict subset of the "For engineers &
  // builders" reading list, and whose title named a PERSON rather than a
  // problem — which is the one thing that distinguishes the two axes. It is the
  // reading list, so it now lives there and its old URL points at it.
  //
  // Each retirement is emitted TWICE: as a line here, and as a stub page at the
  // old path. GitHub Pages ignores _redirects entirely — it serves static files
  // and nothing else — so every one of these was a live 404, which is precisely
  // what a redirect map exists to prevent. See redirectStub().
  const moves = [
    { from: 'collections/laws-every-engineer-learns/', to: 'for/engineers/', label: 'For engineers & builders' },
  ];
  for (const law of laws) {
    // Array.isArray guard: a non-array redirectFrom (a stray string would iterate
    // characters; a number/object would throw and fail the build) yields nothing.
    const from = Array.isArray(law.redirectFrom) ? law.redirectFrom : [];
    for (const old of from) moves.push({ from: old, to: `laws/${law.slug}/`, label: law.name });
  }
  // A stub is written to the old path, so an old path that is ALSO a live slug
  // would bury the real page under a redirect to somewhere else. The _redirects
  // line was harmless in that case; a file is not. Drop those and say so.
  const livePaths = new Set(laws.map((l) => `laws/${l.slug}/`));
  const collided = moves.filter((m) => livePaths.has(m.from));
  if (collided.length) {
    console.warn(`redirects: ${collided.length} redirectFrom path(s) collide with a live law and are skipped: ${collided.map((m) => m.from).join(', ')}`);
  }
  const safeMoves = moves.filter((m) => !livePaths.has(m.from));
  const redirectsBody = '# Netlify-style redirect map (from  to  status). Seeded from law.redirectFrom.\n'
    + (safeMoves.length ? safeMoves.map((m) => `${base}${m.from}  ${base}${m.to}  301`).join('\n') + '\n' : '');
  writes.push(writePage(join(out, '_redirects'), redirectsBody));
  for (const m of safeMoves) {
    writes.push(writePage(join(out, ...m.from.split('/').filter(Boolean), 'index.html'),
      redirectStub(m.to, { base, origin, label: m.label })));
  }

  // _headers: Netlify/Cloudflare-Pages-style security + caching headers, emitted
  // alongside _redirects. INERT on GitHub Pages (which serves no custom headers),
  // so this only takes effect once the canonical domain is fronted by a host that
  // honours it — harmless either way.
  //
  // The CSP is deliberately not `script-src 'self'` alone: the theme-init and the
  // law page's scroll-spy are inline <script> blocks (they must run before first
  // paint), so 'unsafe-inline' is required until those are externalised. Everything
  // else is locked to same-origin — the site loads zero third-party resources.
  const headersBody = [
    '# Netlify / Cloudflare Pages headers. No effect on GitHub Pages.',
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  X-Frame-Options: DENY',
    '  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()',
    "  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self' https://github.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
    '',
    '# Hashed by ?v=<contenthash>, so a changed file is always a new URL.',
    '/assets/*',
    '  Cache-Control: public, max-age=31536000',
    '',
    '# The answer changes at midnight, so a long cache would serve yesterday.',
    '# CORS is open because the point of it is to be read from someone else\'s page.',
    '/today.json',
    '  Cache-Control: public, max-age=3600',
    '  Access-Control-Allow-Origin: *',
    '',
  ].join('\n');
  writes.push(writePage(join(out, '_headers'), headersBody));

  // ---- flush -----------------------------------------------------------------
  //
  // Everything above buffered its output. Now: work out what actually changed
  // since the last build, date those pages and only those, build the sitemap
  // from the result, and write the lot.
  await Promise.all(writes);

  let prevManifest = null;
  try {
    prevManifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  } catch {
    // No manifest yet, or an unreadable one. resolve() treats that as "every
    // page is new", which is where this site starts from anyway. A corrupt
    // manifest must never be able to fail a deploy.
  }

  const htmlPages = {};
  for (const [p, html] of PAGES) {
    if (p.endsWith('.html') && typeof html === 'string') htmlPages[urlKey(p, out)] = html;
  }
  // The site's own location, normalised out of every hash, so the manifest
  // describes content rather than a deploy target. Longest-first ordering is
  // handled inside pageHash. See build/lastmod.mjs for why this matters.
  //
  // A bare '/' base is excluded deliberately. It is a prefix of every path in
  // the document, so normalising it would replace every slash in every page —
  // technically deterministic, but it would flatten away most of what the hash
  // is supposed to notice, AND it would still not match a build with a real
  // base. The practical consequence: the committed manifest must be generated
  // with the same base the deploy uses (a non-'/' one). Origin can differ
  // freely, which is the case that actually varies — github.io today, the
  // custom domain later.
  //
  // The bare origin is NOT in this list, and that is deliberate. Templates link
  // to https://conyso.com as the PUBLISHER — parentOrganization, the founder
  // credit in the footer — and those links mean the same thing wherever the site
  // is served. Normalising the bare origin rewrote them in the conyso build and
  // left them alone in the github.io build, so the two disagreed on 1,798 of
  // 2,969 pages. Only the site's own URL prefix is a deploy detail; a link to
  // the publisher is content.
  const sitePrefixes = [`${origin}${base}`, base].filter((p) => p && p !== '/');
  const { dates, manifest: nextManifest, changed } = resolveLastmod(htmlPages, prevManifest, buildDate, sitePrefixes);

  PAGES.set(join(out, 'sitemap.xml'), buildSitemap(paths, `${origin}${base}`, dates, imagesByPath));

  await Promise.all([...PAGES].map(async ([p, data]) => {
    await mkdir(dirname(p), { recursive: true });
    if (typeof data !== 'string') {
      // Binary, and it must reach disk byte-for-byte. No stamping, no encoding.
      await writeFile(p, data);
      return;
    }
    // Text output that is not a page carries no token, so stamping it is a
    // no-op; doing it unconditionally is cheaper than deciding twice.
    await writeFile(p, stamp(data, dates[urlKey(p, out)] || buildDate), 'utf8');
  }));

  if (writeManifest) {
    await writeFile(manifestFile, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
    // Worth printing. If this says 1,785 on a build where nothing was edited,
    // something volatile has crept into a page and the manifest has quietly
    // stopped meaning anything — which is the failure mode that put us here.
    console.log(`lastmod: ${changed.length} of ${Object.keys(htmlPages).length} pages changed`);
    // Name them when there are few enough to read. Diagnosing "why did 21 pages
    // change" by grepping the output for suspicious strings sends you after the
    // wrong 21; the build already knows which, so it should say.
    if (changed.length && changed.length <= 25) {
      for (const p of changed) console.log(`  changed: ${p || '(home)'}`);
    }
  }

  await cp(assetsDir, join(out, 'assets'), { recursive: true });

  // Ship the stylesheet without its comments.
  //
  // styles.css is 204 kB, of which 106 kB is commentary, and it is a
  // render-blocking request on all 1,785 pages. Stripping comments takes the
  // gzipped payload from 48.6 kB to 28.6 kB, which is nearly everything a full
  // minifier would win, at a fraction of the risk: no whitespace collapsing, no
  // selector rewriting, nothing that can change what a rule matches.
  //
  // The SOURCE keeps every comment. They explain why rules exist and are worth
  // more than the bytes; they are simply not worth sending to a browser.
  //
  // The hash is computed from the source above, so it still changes whenever
  // the source does. It is not a digest of the shipped bytes and does not need
  // to be — it only has to invalidate when the styles change.
  for (const rel of ['styles.css', 'icons/tabler.css']) {
    const f = join(out, 'assets', rel);
    try {
      const css = await readFile(f, 'utf8');
      const lean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n[ \t]*\n+/g, '\n');
      // Balanced braces after the strip, or something was eaten that should not
      // have been. Better a fat stylesheet than a broken one.
      const bal = (t) => (t.match(/\{/g) || []).length === (t.match(/\}/g) || []).length;
      if (bal(lean) && lean.length < css.length) await writeFile(f, lean);
    } catch { /* asset absent in this build */ }
  }

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
  // writeManifest: the CLI is the only caller that persists src/data/lastmod.json.
  // Run a build locally and commit the result alongside the content change.
  buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out: 'dist', ...cfg, base, origin, writeManifest: true })
    .then(r => console.log('built', r));
}
