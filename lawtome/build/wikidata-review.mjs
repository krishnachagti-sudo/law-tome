// Pull the evidence a human needs to judge the 120 candidates. Read-only.
//
// The audit deliberately stopped at "here are 120 things that might be right".
// Deciding needs more than the one-line description a search returns: what the
// item IS (P31), what it is also called (aliases), and how connected it is. This
// fetches exactly that and prints it beside our own entry's statement, so the
// judgement is made against evidence rather than against a label that matched.
//
// It still writes nothing to Wikidata and nothing to the corpus. Its output is a
// table for a person to read.
//
//   node build/wikidata-review.mjs > docs/wikidata-review.txt

import { readFile } from 'node:fs/promises';

const API = 'https://www.wikidata.org/w/api.php';
const UA = 'LawTomeAudit/1.0 (https://github.com/krishnachagti-sudo/law-tome; read-only linkage audit)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function entities(ids) {
  const url = `${API}?action=wbgetentities&ids=${ids.join('|')}&props=labels|descriptions|aliases|claims|sitelinks&languages=en&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`wbgetentities ${res.status}`);
  return (await res.json()).entities || {};
}

/** The QIDs an item is an instance of (P31) — the single most useful signal. */
function instanceOf(ent) {
  const cl = (ent.claims && ent.claims.P31) || [];
  return cl.map((c) => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
}

const main = async () => {
  const doc = JSON.parse(await readFile('docs/wikidata-candidates.json', 'utf8'));
  const cands = doc.candidates || [];

  // Resolve the P31 targets to labels too, so the table reads "physical law"
  // rather than "Q214609" — the whole point is that a person can skim it.
  const ents = {};
  for (let i = 0; i < cands.length; i += 50) {
    Object.assign(ents, await entities(cands.slice(i, i + 50).map((c) => c.qid)));
    await sleep(400);
  }
  const typeIds = [...new Set(Object.values(ents).flatMap(instanceOf))];
  const types = {};
  for (let i = 0; i < typeIds.length; i += 50) {
    Object.assign(types, await entities(typeIds.slice(i, i + 50)));
    await sleep(400);
  }
  const typeLabel = (id) => types[id]?.labels?.en?.value || id;

  const corpus = {};
  for (const c of cands) {
    corpus[c.slug] = JSON.parse(await readFile(`src/data/laws/${c.slug}.json`, 'utf8'));
  }

  for (const c of cands) {
    const e = ents[c.qid] || {};
    const ours = corpus[c.slug] || {};
    const aliases = (e.aliases?.en || []).map((a) => a.value);
    console.log(`\n${'='.repeat(78)}`);
    console.log(`OURS   ${ours.name}  [${ours.reliability}]  (${ours.category})`);
    console.log(`       ${ours.statement}`);
    console.log(`       aliases: ${(ours.aliases || []).join(', ') || '—'}`);
    console.log(`HIT    ${c.qid}  ${e.labels?.en?.value || '?'}`);
    console.log(`       ${e.descriptions?.en?.value || '(no description)'}`);
    console.log(`       instance of: ${instanceOf(e).map(typeLabel).join('; ') || '—'}`);
    console.log(`       aliases: ${aliases.join(', ') || '—'}`);
    console.log(`       sitelinks: ${Object.keys(e.sitelinks || {}).length}`);
  }
};

main().catch((e) => { console.error(e); process.exit(1); });
