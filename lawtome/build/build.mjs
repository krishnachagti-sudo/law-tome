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
import { buildSearchIndex } from './search-index.mjs';
import { buildGraph } from './graph-data.mjs';
import { quoteCardSvg, renderPng } from './quotecard.mjs';
import { buildSitemap } from './sitemap.mjs';
import { buildLlmsIndex, buildLlmsFull } from './llms.mjs';
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

  // Render synchronously, then write concurrently (matters at ~1,400-law scale).
  const writes = [
    // Home: first 12 laws as the featured rotation.
    writePage(join(out, 'index.html'), homePage(laws.slice(0, 12), { publishedCount, base, origin })),
    // Prebuilt client-search index (a DATA file, not a "page"): fetched by
    // src/assets/search.js. In the concurrent writes[] so it's covered by the
    // pre-clean rm + Promise.all.
    writePage(join(out, 'search-index.json'), JSON.stringify(buildSearchIndex(laws))),
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
    background_color: '#e7e1d1',
    theme_color: '#e7e1d1',
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
  // about, coined, privacy). `pages` stays home + one page per law, unchanged.
  return { pages: laws.length + 1, listings: 1 + present.length + 4, graph: 1, og: laws.length };
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
