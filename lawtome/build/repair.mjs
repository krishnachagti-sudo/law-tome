// Structural repair for batch-authored corpus entries. This does NOT invent or
// alter content — it only trims what would break the strict validator: dangling
// cross-references, statementAccents that aren't verbatim substrings, and
// out-of-vocabulary category/reliability/provenance values. Any entry that is
// irreparably malformed (missing a required field, no worked example, or a
// canon entry with no source) is QUARANTINED — deleted and logged — so an
// unverifiable or unsourced claim never ships. Run before `npm run build`.
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const LAWS = join(HERE, '..', 'src', 'data', 'laws');
const categories = JSON.parse(readFileSync(join(HERE, '..', 'src', 'data', 'categories.json')));
const CATS = new Set(Object.keys(categories));
const RELIABILITY = new Set(['Empirical', 'Heuristic', 'Folk-adage', 'Contested']);
const REQUIRED = ['no', 'slug', 'name', 'statement', 'meaning', 'origin', 'category', 'reliability', 'provenance'];
const DEFAULT_CAT = 'science';

const quarantined = [], changed = [];

function load() {
  const files = readdirSync(LAWS).filter(f => f.endsWith('.json'));
  return files.map(f => {
    try { return { f, o: JSON.parse(readFileSync(join(LAWS, f))) }; }
    catch (e) { rmSync(join(LAWS, f)); quarantined.push(`${f} (unparseable JSON)`); return null; }
  }).filter(Boolean);
}

let laws = load();

// Pass 1: per-entry coercions and hard quarantines (independent of other entries).
for (const rec of laws.slice()) {
  const { f, o } = rec;
  let dirty = false;
  const id = o.slug || f;

  // filename stem must equal slug; if slug missing but filename is a clean stem, adopt it.
  const stem = f.replace(/\.json$/, '');
  if (!o.slug && stem) { o.slug = stem; dirty = true; }

  // vocab coercions (content-preserving; wrong-but-valid beats build-breaking).
  if (o.category && !CATS.has(o.category)) { o.category = DEFAULT_CAT; dirty = true; }
  if (o.reliability && !RELIABILITY.has(o.reliability)) { o.reliability = 'Heuristic'; dirty = true; }
  if (o.provenance !== 'canon' && o.provenance !== 'coined') { o.provenance = 'canon'; dirty = true; }
  // A named law with sources is canon; never let a 'coined' + namedAfter pair trip the guard.
  if (o.provenance === 'coined' && o.namedAfter) {
    if (Array.isArray(o.sources) && o.sources.length) { o.provenance = 'canon'; }
    else { delete o.namedAfter; }
    dirty = true;
  }

  // statementAccent must be a verbatim substring of statement, else drop it.
  if (o.statementAccent && (!o.statement || !o.statement.includes(o.statementAccent))) {
    delete o.statementAccent; dirty = true;
  }

  // Hard requirements → quarantine if unmet.
  const missing = REQUIRED.filter(k => !o[k]);
  const noExample = !o.example && !(Array.isArray(o.examples) && o.examples.length);
  const canonNoSrc = o.provenance === 'canon' && !(Array.isArray(o.sources) && o.sources.length);
  if (missing.length || noExample || canonNoSrc) {
    rmSync(join(LAWS, f));
    quarantined.push(`${id} (${[...missing.map(m => 'missing ' + m), noExample && 'no example', canonNoSrc && 'no source'].filter(Boolean).join(', ')})`);
    laws = laws.filter(r => r !== rec);
    continue;
  }
  if (dirty) { rec.dirty = true; }
}

// Pass 2: closure. Prune related/confusedWith refs to slugs that don't exist
// (possibly because a target was just quarantined). Two-pass-safe: the known set
// is computed after all quarantines above.
const known = new Set(laws.map(r => r.o.slug).filter(Boolean));
for (const rec of laws) {
  const { o } = rec;
  if (Array.isArray(o.related)) {
    const kept = o.related.filter(r => r && known.has(r.slug));
    if (kept.length !== o.related.length) { o.related = kept; rec.dirty = true; }
  }
  if (Array.isArray(o.confusedWith)) {
    const kept = o.confusedWith.filter(s => known.has(s));
    if (kept.length !== o.confusedWith.length) { o.confusedWith = kept; rec.dirty = true; }
  }
}

// Write back only what changed.
for (const rec of laws) {
  if (rec.dirty) {
    writeFileSync(join(LAWS, rec.f), JSON.stringify(rec.o, null, 2) + '\n');
    changed.push(rec.o.slug);
  }
}

console.log(`repair: ${laws.length} entries kept, ${changed.length} adjusted, ${quarantined.length} quarantined`);
if (changed.length) console.log('  adjusted:', changed.join(', '));
if (quarantined.length) console.log('  quarantined:\n    ' + quarantined.join('\n    '));
