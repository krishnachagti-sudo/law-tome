// Writes src/data/bias-twins.json: law slug -> the Bias Atlas page on the same idea.
//
// The Bias Atlas already links each of its entries to the matching law page, so
// those links are the source of truth: a twin exists exactly when an Atlas page
// points at a law. Run after the Atlas is rebuilt, then rebuild the Tome:
//
//   node scripts/bias-twins.mjs [path/to/bias-atlas/dist]
//
// Default path is ~/bias-atlas/dist.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const dist = process.argv[2] || join(homedir(), 'bias-atlas', 'dist');
const biasDir = join(dist, 'bias');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"');

const twins = {};
for (const slug of readdirSync(biasDir).sort()) {
  const page = join(biasDir, slug, 'index.html');
  if (!existsSync(page)) continue;
  const html = readFileSync(page, 'utf8');
  const laws = [...new Set([...html.matchAll(/href="https:\/\/conyso\.com\/lawtome\/laws\/([a-z0-9-]+)\/"/g)].map((m) => m[1]))];
  if (laws.length !== 1) continue; // only an unambiguous one-to-one pair counts as a twin
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const name = h1 ? decode(h1[1].replace(/<[^>]+>/g, '').trim()) : slug;
  twins[laws[0]] = { slug, name, url: `https://conyso.com/biases/bias/${slug}/` };
}

const out = new URL('../src/data/bias-twins.json', import.meta.url);
writeFileSync(out, JSON.stringify(twins, null, 1) + '\n');
console.log(`bias-twins: ${Object.keys(twins).length} law pages have a Bias Atlas twin`);
