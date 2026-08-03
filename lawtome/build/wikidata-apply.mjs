// Apply the REVIEWED Wikidata links to our own data. Nothing is written upstream.
//
// The audit produced 120 candidates and refused to accept them in bulk, because
// 45% of what a label search returns is a paper, a film or a play about the idea
// rather than the idea. build/wikidata-review.mjs pulled the evidence needed to
// judge each one — what the item IS (P31), its aliases, its sitelink count — and
// each was read against our own entry's statement. The verdicts are below.
//
// REJECTED, with the reason recorded rather than the entry silently skipped. Two
// of these are the exact failure the audit predicted (an alias matching an
// unrelated item), and several are the publication-for-concept swap:
const REJECT = {
  'amperes-law': "Ampère's FORCE law (Q2359410) is a different law from the circuital law this entry describes",
  'byzantine-fault-tolerance': 'a US patent (11341122), not the concept',
  compositionality: 'a 0-sitelink item with a malformed description; the principle has a better item elsewhere',
  'heisenbergs-uncertainty-principle': 'a 1-sitelink item typed as a formula, not the principle\'s main item',
  'lead-time-bias': 'the description defines lead time, not lead-time bias',
  'omoris-law': "the item carries 'Inflation Persistence Network' aliases — it looks like a bad merge",
  'possible-worlds': 'a play by John Mighton',
  'pournelles-iron-law-of-bureaucracy': 'a non-fiction book, not the law',
  presentism: 'presentism the historiographical fallacy, not presentism about time',
  'research-programmes': "'research program' in the sense of a professional network of scientists",
  'retrograde-motion': 'actual retrograde orbital motion, not the apparent motion this entry describes',
  solid: 'the state of matter — matched on the acronym SOLID',
  'the-balance-of-power': 'an etching by Charles Williams',
  'the-biogenetic-law': 'a 1908 edition of an essay by Robert Rives La Monte',
  'the-gluten-network': 'gluten the protein, not the network this entry describes forming',
  'the-golden-mean': 'a literary work',
  'the-michelson-morley-experiment': 'an Ohio historical marker commemorating it',
  'the-mind-body-problem': 'a 2024 encyclopedia article about it',
  'the-nocebo-effect': 'a clinical trial',
  'the-presentation-of-self': "Goffman's book, not the dramaturgical concept",
  'the-principle-of-least-astonishment': "'Pola', a female given name — matched on the alias POLA",
  'the-protestant-ethic': "Weber's book, not the thesis",
  'the-robbers-cave-experiment': 'realistic conflict theory — the theory the experiment supported, not the experiment',
  'the-rubber-hand-illusion': 'a clinical trial using it',
  'the-rule-of-three': 'a play by Agatha Christie',
  'the-single-responsibility-principle': "'Serbian' — matched on the acronym SRP",
  'the-ski-rental-problem': 'break-even analysis, a different problem',
  yagni: "'Yagnik', a family name",
};

// Everything else was read and accepted: the item is the concept the entry
// describes, confirmed against its description, its P31 and its aliases.

import { readFile, writeFile } from 'node:fs/promises';

const API = 'https://www.wikidata.org/w/api.php';
const UA = 'LawTomeAudit/1.0 (https://github.com/krishnachagti-sudo/law-tome; read-only linkage audit)';
const LANGS = ['ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'pt', 'ru', 'zh'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function labelsFor(ids) {
  const url = `${API}?action=wbgetentities&ids=${ids.join('|')}&props=labels&languages=${LANGS.join('|')}&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`wbgetentities ${res.status}`);
  return (await res.json()).entities || {};
}

const main = async () => {
  const doc = JSON.parse(await readFile('docs/wikidata-candidates.json', 'utf8'));
  const facts = JSON.parse(await readFile('src/data/facts.json', 'utf8'));

  const accepted = doc.candidates.filter((c) => !REJECT[c.slug]);
  const rejected = doc.candidates.filter((c) => REJECT[c.slug]);
  console.log(`accepted ${accepted.length}, rejected ${rejected.length}, of ${doc.candidates.length}`);

  // Record the verdict on every candidate, so the file is a review record rather
  // than a to-do list — and so a later reviewer can disagree with a named reason.
  for (const c of doc.candidates) {
    c.verified = !REJECT[c.slug];
    if (REJECT[c.slug]) c.rejectedBecause = REJECT[c.slug];
  }
  doc.reviewed = { on: '2026-08-03', accepted: accepted.length, rejected: rejected.length };

  // Pull the foreign labels for the accepted items. This is the point of the
  // exercise: a confirmed QID gives the entry its names in ten other languages,
  // straight from Wikidata rather than from a translation engine.
  const ents = {};
  for (let i = 0; i < accepted.length; i += 50) {
    Object.assign(ents, await labelsFor(accepted.slice(i, i + 50).map((c) => c.qid)));
    await sleep(400);
  }

  let added = 0;
  let labelled = 0;
  for (const c of accepted) {
    const e = ents[c.qid];
    if (!e) { console.warn(`no entity for ${c.slug} (${c.qid})`); continue; }
    const labels = {};
    for (const l of LANGS) if (e.labels?.[l]?.value) labels[l] = e.labels[l].value;
    facts[c.slug] = facts[c.slug] || {};
    facts[c.slug].names = {
      labels,
      qid: c.qid,
      source: `https://www.wikidata.org/wiki/${c.qid}`,
    };
    added += 1;
    labelled += Object.keys(labels).length;
  }

  await writeFile('docs/wikidata-candidates.json', `${JSON.stringify(doc, null, 2)}\n`);
  await writeFile('src/data/facts.json', `${JSON.stringify(facts, null, 2)}\n`);
  console.log(`linked ${added} entries, ${labelled} foreign names added`);
};

main().catch((e) => { console.error(e); process.exit(1); });
