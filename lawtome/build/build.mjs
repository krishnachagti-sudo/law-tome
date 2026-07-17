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
import { buildSearchIndex } from './search-index.mjs';
import { buildGraph } from './graph-data.mjs';
import { quoteCardSvg, renderPng } from './quotecard.mjs';

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

  // Render synchronously, then write concurrently (matters at ~1,400-law scale).
  const writes = [
    // Home: first 12 laws as the featured rotation.
    writePage(join(out, 'index.html'), homePage(laws.slice(0, 12), { publishedCount, base })),
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
    const html = lawPage(laws[i], { byslug, categories, base, origin, prev: laws[i - 1], next: laws[i + 1], publishedCount });
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
      listingPage(membersByCat.get(cat), { title: categories[cat] || cat, base, kind: 'category', origin }),
    ));
  }

  await Promise.all(writes);

  await cp(assetsDir, join(out, 'assets'), { recursive: true });

  // `pages` counts home + one page per law (unchanged semantics). Browse and
  // per-category listings are reported in `listings`; the graph explorer is a
  // distinct page reported separately so no existing count assertion shifts.
  return { pages: laws.length + 1, listings: 1 + present.length, graph: 1, og: laws.length };
}

// CLI: only runs when invoked directly (so `npm run build` works, imports don't).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = JSON.parse(await (await import('node:fs/promises')).readFile('site.config.json', 'utf8'));
  const base = (process.argv.find(a => a.startsWith('--base=')) || '').split('=')[1] || cfg.base;
  buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out: 'dist', ...cfg, base })
    .then(r => console.log('built', r));
}
