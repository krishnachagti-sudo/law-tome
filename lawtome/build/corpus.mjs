import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { SOURCE_FILE } from './validate.mjs';

// Load every law JSON in `dir`, returned in corpus order (by zero-padded `no`).
// Each law is tagged with its source filename stem under the non-enumerable
// SOURCE_FILE Symbol so validateCorpus can enforce rule 1 (filename === slug)
// without the filename ever leaking into rendered output: JSON.stringify ignores
// Symbols, and `enumerable: false` keeps it out of `{...law}` spreads and
// Object.keys too.
export async function loadCorpus(dir) {
  const files = (await readdir(dir)).filter(f => f.endsWith('.json'));
  const laws = await Promise.all(files.map(async f => {
    let law;
    try { law = JSON.parse(await readFile(join(dir, f), 'utf8')); }
    catch (e) { throw new Error(`${f}: invalid JSON — ${e.message}`); }
    Object.defineProperty(law, SOURCE_FILE, { value: basename(f, '.json'), enumerable: false });
    return law;
  }));
  // Tolerate a missing `no` here (|| '') so the loader doesn't throw a file-less
  // TypeError before validateCorpus can emit its clean "missing required field"
  // error. Numeric-aware compare so mixed-width `no`s order correctly — plain
  // string compare would slot every 4-digit no (1000+) in the middle of the
  // 3-digit range (e.g. '1000' < '101'), scrambling corpus order and prev/next.
  return laws.sort((a, b) => (a.no || '').localeCompare(b.no || '', 'en', { numeric: true }));
}

export async function loadCategories(path) { return JSON.parse(await readFile(path, 'utf8')); }
