// Checks a book manuscript before it goes to an editor or into layout.
//
//   node books/scripts/check-manuscript.mjs books/true-or-folklore/drafts [--min 300 --max 450] [--you-ok]
//
// Entries are delimited by `<!-- slug: <slug> | candidate: <n> | verdict: <V> -->`.
// Only the entry body is checked: from the page-turn line to the Sources line,
// so citations and QA notes are not counted.
//
// Per entry it reports what the series standard treats as a rule (exit 1 with
// --strict): a Wikipedia run of 12+ unquoted words shared with an article the
// law cites, a banned word, more than one em dash, British spelling, "you" in
// the body where the book bans it, and length outside the band. It also prints
// signals that are not rules: sentences over 40 words, intensifiers and the
// structural tells from Wikipedia's "Signs of AI writing".
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : dflt;
};
const target = process.argv[2];
const MIN = Number(arg('--min', 300));
const MAX = Number(arg('--max', 450));
const YOU_OK = process.argv.includes('--you-ok');
const STRICT = process.argv.includes('--strict');
const CACHE = arg('--cache', join(tmpdir(), 'lawtome-wiki-cache'));
const LAWS = new URL('../../lawtome/src/data/laws/', import.meta.url).pathname;
const UA = { 'user-agent': 'LawTome-manuscript-check/0.1 (https://conyso.com/lawtome/)' };
const N = 8;
mkdirSync(CACHE, { recursive: true });

// Kept in step with lawtome/build/style-check.mjs and lawtome/docs/VOICE.md.
const BANNED = [
  'delve', 'delves', 'delving', 'underscore', 'underscores', 'underscoring',
  'a testament to', 'tapestry', 'in the realm of', 'multifaceted',
  "it's worth noting", 'it is worth noting', 'at its core', 'unpack',
  'deep dive', 'game-changer', 'game changer', 'paradigm shift',
  'moreover', 'furthermore', 'in conclusion', 'navigate the', 'fundamentally', 'the fact that',
];
const INTENSIFIER = /\b(very|extremely|incredibly|hugely|remarkably|significantly|truly|really|quite) \p{L}/giu;
const TELLS = [
  [/\b(serves|stands) as\b/gi, '"serves as" for "is"'],
  [/, (highlighting|underscoring|showcasing|fostering|reflecting|emphasizing)\b/gi, 'trailing -ing commentary'],
  [/\bexperts (say|argue|note|agree)\b/gi, 'unnamed experts'],
  [/\b(pivotal|crucial|vital) (moment|role|turning point)\b/gi, 'inflated significance'],
];
// The usual British forms a US edition must not carry. Deliberately a list,
// not a suffix rule: "-ise" catches "precise", "wise" and "otherwise".
// Lowercase only, so proper names (the Labour Party, a Centre) pass; "-is-"
// stems are spelled out so "organism", "criticism" and "realism" do not trip it.
const BRITISH = /\b(colour\w*|behaviour\w*|favour\w*|honour\w*|labour\w*|neighbour\w*|centre[sd]?|metre[sd]?|theatre[sd]?|defence|offence|licence[sd]?|(organ|recogn|real|popular|critic|emphas|apolog|summar|character|special|general|minim|maxim|optim|util|standard|normal|categor|memor|symbol|author|harmon)is(e|ed|es|ing|ation|ations)|analys(e|ed|ing)|travell\w*|modell\w*|programme[sd]?|catalogue[sd]?|grey|whilst|amongst|towards|armour\w*|rumour\w*)\b/g;

const words = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' ').filter(Boolean);
// Quoted wording is the original author's, not ours: drop double quotes, curly
// singles, and straight singles that open after a space (so "it's" survives).
const unquote = (s) => s.replace(/“[^”]*”|"[^"]*"|‘[^’]*’|(^|[\s(])'[^']{3,}?'(?=[\s.,;:!?)]|$)/g, ' ');

async function article(url) {
  const title = decodeURIComponent(url.split('/wiki/')[1].split('#')[0]);
  const file = join(CACHE, encodeURIComponent(title) + '.txt');
  if (existsSync(file)) return readFileSync(file, 'utf8');
  const api = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&formatversion=2&titles=${encodeURIComponent(title)}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(api, { headers: UA }).catch(() => null);
    if (r?.ok) {
      const text = (await r.json()).query?.pages?.[0]?.extract || '';
      writeFileSync(file, text);
      return text;
    }
    await new Promise((res) => setTimeout(res, Number(r?.headers.get('retry-after')) * 1000 || 5000 * 2 ** attempt));
  }
  throw new Error(`fetch failed: ${title}`);
}

const files = statSync(target).isDirectory()
  ? readdirSync(target).filter((f) => f.endsWith('.md')).sort().map((f) => join(target, f))
  : [target];

const entries = [];
for (const f of files) {
  const parts = readFileSync(f, 'utf8').split(/<!--\s*slug:/).slice(1);
  for (const p of parts) {
    const head = p.slice(0, p.indexOf('-->'));
    const meta = Object.fromEntries(('slug:' + head).split('|').map((kv) => kv.split(':').map((s) => s.trim())));
    const start = p.indexOf('(turn the page)');
    const end = p.search(/\n\*Sources:\*/);
    const body = p.slice(start > -1 ? start + 15 : p.indexOf('-->') + 3, end > -1 ? end : undefined).replace(/^\*\)?/, '').trim();
    entries.push({ file: f.split('/').pop(), slug: meta.slug, verdict: meta.verdict, body });
  }
}

const issues = [];
const tally = {};
let totalWords = 0, longSentences = 0;
for (const e of entries) {
  const problems = [], signals = [];
  tally[e.verdict] = (tally[e.verdict] || 0) + 1;
  const wc = e.body.split(/\s+/).filter(Boolean).length;
  totalWords += wc;
  if (wc < MIN || wc > MAX) problems.push(`length ${wc} (band ${MIN}–${MAX})`);
  const lower = ` ${e.body.toLowerCase()} `;
  for (const b of BANNED) if (lower.includes(` ${b}`)) problems.push(`banned "${b}"`);
  const dashes = (e.body.match(/—/g) || []).length;
  if (dashes > 1) problems.push(`${dashes} em dashes`);
  // Quoted titles and quotations keep their original spelling.
  const brit = [...new Set((unquote(e.body).match(BRITISH) || []).map((w) => w.toLowerCase()))];
  if (brit.length) problems.push(`British: ${brit.join(', ')}`);
  if (!YOU_OK && /\byou(r|rs|rself)?\b/i.test(unquote(e.body))) problems.push('"you" in body');

  const law = existsSync(join(LAWS, `${e.slug}.json`)) ? JSON.parse(readFileSync(join(LAWS, `${e.slug}.json`), 'utf8')) : null;
  if (!law) problems.push('unknown slug');
  else {
    const urls = [...new Set(JSON.stringify(law.sources).match(/https?:\/\/en\.wikipedia\.org\/wiki\/[^"\\ ]+/g) || [])];
    const wiki = new Set();
    for (const u of urls) {
      const w = words(await article(u));
      for (let i = 0; i + N <= w.length; i++) wiki.add(w.slice(i, i + N).join(' '));
    }
    const w = words(unquote(e.body));
    const hit = new Array(w.length).fill(false);
    for (let i = 0; i + N <= w.length; i++) if (wiki.has(w.slice(i, i + N).join(' '))) hit.fill(true, i, i + N);
    let best = 0, bestAt = 0;
    for (let i = 0; i < w.length; ) {
      if (!hit[i]) { i++; continue; }
      let j = i;
      while (j < w.length && hit[j]) j++;
      if (j - i > best) { best = j - i; bestAt = i; }
      i = j;
    }
    if (best >= 12) problems.push(`Wikipedia run ${best}: "${w.slice(bestAt, bestAt + best).join(' ')}"`);
  }

  const sentences = e.body.split(/(?<=[.!?])\s+/);
  const over40 = sentences.filter((s) => s.split(/\s+/).length > 40).length;
  longSentences += over40;
  if (over40) signals.push(`${over40} sentence(s) over 40 words`);
  const intens = (e.body.match(INTENSIFIER) || []).length;
  if (intens) signals.push(`${intens} intensifier(s)`);
  for (const [re, label] of TELLS) if (re.test(e.body)) signals.push(label);
  if (problems.length || signals.length) issues.push({ ...e, problems, signals });
}

console.log(`${entries.length} entries, ${totalWords.toLocaleString('en-US')} words. Verdicts: ${Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(', ')}.`);
const failing = issues.filter((i) => i.problems.length);
console.log(`${failing.length} entries break a rule; ${issues.length - failing.length} more carry signals only. Sentences over 40 words: ${longSentences}.\n`);
for (const i of issues) {
  console.log(`${i.file}  ${i.slug}`);
  for (const p of i.problems) console.log(`  RULE    ${p}`);
  for (const s of i.signals) console.log(`  signal  ${s}`);
}
if (STRICT && failing.length) process.exit(1);
