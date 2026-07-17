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
  ];
  // One page per law. prev/next come from CORPUS ORDER (laws already sorted by `no`).
  for (let i = 0; i < laws.length; i++) {
    const html = lawPage(laws[i], { byslug, categories, base, origin, prev: laws[i - 1], next: laws[i + 1], publishedCount });
    writes.push(writePage(join(out, 'laws', laws[i].slug, 'index.html'), html));
  }
  await Promise.all(writes);

  await cp(assetsDir, join(out, 'assets'), { recursive: true });

  return { pages: laws.length + 1 };
}

// CLI: only runs when invoked directly (so `npm run build` works, imports don't).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = JSON.parse(await (await import('node:fs/promises')).readFile('site.config.json', 'utf8'));
  const base = (process.argv.find(a => a.startsWith('--base=')) || '').split('=')[1] || cfg.base;
  buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out: 'dist', ...cfg, base })
    .then(r => console.log('built', r));
}
