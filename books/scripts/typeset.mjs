// Typesets True or Folklore? as a 6x9 print interior with Typst.
//
//   node books/scripts/typeset.mjs books/true-or-folklore      → build/book.typ
//   typst compile --root books/true-or-folklore --ignore-system-fonts --font-path books/_layout/fonts/static books/true-or-folklore/build/book.typ
//
// Each story is a spread turned inside out: the question sits alone on a
// right-hand page so the answer cannot be seen by accident, and the verdict
// starts overleaf. Round openers also start on a right-hand page.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
// --sample builds the free lead magnet: front matter, round 1, and a page pointing to the full book.
const SAMPLE = process.argv.includes('--sample');
const out = join(dir, 'build');
mkdirSync(out, { recursive: true });

// Escape Typst markup in plain text, then turn the drafts' *italic* and
// **bold** back into Typst's _italic_ and *bold*.
const esc = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/([#$@<>\[\]`~_*=])/g, '\\$1')
  .replace(/\/\//g, '\\/\\/');
function inline(s) {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return `*${esc(p.slice(2, -2))}*`;
    if (/^\*[^*]+\*$/.test(p)) return `_${esc(p.slice(1, -1))}_`;
    return esc(p);
  }).join('').replace(/^([-+]|\d+\.)(\s)/, '\\$1$2');
}

// A small block parser for the front and back matter: headings, paragraphs,
// bullet lists, pipe tables and rules.
function blocks(md) {
  const outp = [];
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) continue;
    if (/^---+$/.test(l.trim())) { outp.push('#pagebreak(weak: true)'); continue; }
    // {{name}} on a line of its own drops in a designed block from the template.
    { const m = l.trim().match(/^\{\{([a-z-]+)\}\}$/); if (m) { outp.push(`#${m[1]}()`); continue; } }
    // {{spot:name}} drops in a Librarian spot illustration (art/librarian/final/<name>.png).
    { const m = l.trim().match(/^\{\{spot:([a-z0-9-]+)\}\}$/); if (m) { outp.push(`#spot("${m[1]}")`); continue; } }
    let m;
    if ((m = l.match(/^(#{1,3}) (.*)$/))) { outp.push(`${'='.repeat(m[1].length)} ${inline(m[2])}`); continue; }
    if (/^- /.test(l)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(`- ${inline(lines[i++].slice(2))}`);
      i--; outp.push(items.join('\n')); continue;
    }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      i--;
      const cells = rows.filter((r) => !/^\|[\s|:-]+\|$/.test(r)).map((r) => r.slice(1, -1).split('|').map((c) => c.trim()));
      const cols = cells[0].length;
      outp.push(`#score-table(${cols}, (${cells.flat().map((c) => `[${inline(c)}]`).join(', ')},))`);
      continue;
    }
    const para = [l];
    while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#|- |\||---)/.test(lines[i + 1])) para.push(lines[++i]);
    outp.push(inline(para.join(' ')));
  }
  return outp.join('\n\n');
}

let body = '';
let n = 0;
let orig = 0;
const all = [];
const toc = [];
const LAWS = new URL('../../lawtome/src/data/laws/', import.meta.url).pathname;
const index = { laws: [], people: [] };
const rounds = readdirSync(join(dir, 'drafts')).filter((f) => /^round-\d+\.md$/.test(f)).sort().slice(0, SAMPLE ? 1 : undefined);
const roundInfo = rounds.map((f) => {
  const head = readFileSync(join(dir, 'drafts', f), 'utf8').split(/<!--\s*slug:/)[0];
  return { name: (head.match(/^# Round \d+: (.*)$/m) || [])[1], blurb: head.replace(/^# .*$/m, '').split(/\n\s*\n/).map((x) => x.trim()).filter((x) => x && !/^---+$/.test(x))[0] || '' };
});
rounds.forEach((f, ri) => {
  const text = readFileSync(join(dir, 'drafts', f), 'utf8');
  const [head, ...raw] = text.split(/<!--\s*slug:/);
  const rnum = Number(f.match(/\d+/)[0]);
  const rname = roundInfo[ri].name;
  const headParas = head.replace(/^# .*$/m, '').split(/\n\s*\n/).map((x) => x.trim()).filter((x) => x && !/^---+$/.test(x));
  const firstArt = `${String(orig + 1).padStart(3, '0')}.png`;
  toc.push({ n: rnum, name: rname, qs: [], art: existsSync(join(dir, 'art', 'final', firstArt)) ? `/art/final/${firstArt}` : null });
  const openerArt = `r${String(rnum).padStart(2, '0')}.png`;
  const opArt = existsSync(join(dir, 'art', 'openers', 'final', openerArt)) ? `, art: "/art/openers/final/${openerArt}"` : '';
  body += `#round-opener(${rnum}, [${inline(rname)}], [${inline(headParas[0] || '')}], [${inline(headParas.slice(1).join(' '))}]${opArt})\n\n`;
  const entries = raw.map((e) => {
    orig++;
    const meta = (k) => (e.match(new RegExp(k + ':\\s*(\\w+)')) || [])[1];
    return { e, orig, slug: e.split('|')[0].trim(), verdict: meta('verdict'), difficulty: Number(meta('difficulty') || 0), surprise: Number(meta('surprise') || 0) };
  });
  // Peak-end: readers remember a round by its best moment and its last one,
  // so the most surprising story closes the round. The opener stays (it is the
  // most famous), and so does any story that leans on the one before it: the
  // second slot, and a story about the same law as its neighbour.
  const movable = entries.map((x, i) => i).filter((i) => i > 1 && entries[i].slug !== entries[i - 1].slug && (i + 1 >= entries.length || entries[i + 1].slug !== entries[i].slug));
  if (movable.length) {
    const peak = movable.reduce((best, i) => (entries[i].surprise >= entries[best].surprise ? i : best), movable[0]);
    entries.push(...entries.splice(peak, 1));
  }
  // Two stories about the same law read as a repeat when they sit back to back (simulated
  // reader panel, 17 Nov 2026), so the second of a pair moves three slots on. A story the
  // previous answer points to ("the next question in this round") stays where it is, and the
  // round's last story (the peak) is never displaced.
  const moved = new Set();
  for (let i = 1; i < entries.length - 1; i++) {
    const x = entries[i];
    if (moved.has(x) || x.slug !== entries[i - 1].slug || /next question/.test(entries[i - 1].e)) continue;
    moved.add(x);
    entries.splice(i, 1);
    entries.splice(Math.min(i + 3, entries.length - 1), 0, x);
    i--;
  }
  entries.forEach((x, i) => {
    n++;
    const e = x.e;
    const title = (e.match(/^## (.*)$/m) || [])[1];
    const after = e.split('(turn the page)*')[1] || '';
    const answer = after.split(/^> \*\*QA notes/m)[0].split(/^---\s*$/m)[0];
    const paras = answer.split(/\n\s*\n/).map((p) => p.trim().replace(/\n/g, ' ')).filter(Boolean);
    const sources = paras.find((p) => p.startsWith('*Sources:*')) || '';
    const tell = paras.find((p) => p.startsWith('**Tell someone:**'));
    const prose = paras.filter((p) => p !== sources && p !== tell);
    // The verdict word opens the first paragraph in the drafts; the stamp shows it instead.
    prose[0] = prose[0].replace(/^\*\*(TRUE|FOLKLORE|DISPUTED)\.\*\*\s*/, '');
    // Everything that shares the answer page counts toward the type size: the share
    // line's box, the sources (set small, so half weight) and a two-line question label.
    const wc = prose.join(' ').split(/\s+/).length + (tell ? 24 : 0) + Math.round(sources.split(/\s+/).length / 2) + (title.length > 60 ? 10 : 0);
    // Cartoons are art/final/<draft order>.png (e.g. 007.png): numbered by where the story sits
    // in the drafts, so re-ordering for print never detaches a story from its picture.
    const artFile = `${String(x.orig).padStart(3, '0')}.png`;
    const art = existsSync(join(dir, 'art', 'final', artFile)) ? `, art: "/art/final/${artFile}"` : '';
    // Answer-page background: art/bg/<n>.png faded by scripts/fade-bg.py into art/bg-faded/.
    const bg = existsSync(join(dir, 'art', 'bg-faded', artFile)) ? `, bg: "/art/bg-faded/${artFile}"` : '';
    const share = tell ? `, share: [${inline(tell.replace(/^\*\*Tell someone:\*\*\s*/, ''))}]` : '';
    // Open loop: the last answer of a round points at the next round.
    const isLast = i === entries.length - 1;
    const nextR = isLast && roundInfo[ri + 1] ? `, next: [Round ${rnum + 1}: ${inline(roundInfo[ri + 1].name)}]` : '';
    body += `#story(${n}, ${wc + (isLast ? 18 : 0)}, ${rnum}, [${inline(rname)}], [${inline(title)}], "${x.verdict}", (${prose.map((p) => `[${inline(p)}]`).join(', ')},), [${inline(sources.replace(/^\*Sources:\*\s*/, ''))}]${art}${bg}, difficulty: ${x.difficulty}${share}${nextR})\n\n`;
    toc[toc.length - 1].qs.push({ n, title });
    // Index entries: the law's own name, and the person it is named after.
    const lawFile = join(LAWS, `${x.slug}.json`);
    if (existsSync(lawFile)) {
      const law = JSON.parse(readFileSync(lawFile, 'utf8'));
      index.laws.push({ name: law.name.replace(/^The /, ''), n });
      if (law.namesakeKind === 'person' && law.namedAfter) index.people.push({ name: law.namedAfter, n });
    }
    all.push({ n, title, verdict: x.verdict, surprise: x.surprise, difficulty: x.difficulty });
  });
});

// The page readers photograph: most surprising first, hardest breaking ties.
const top = all.filter((x) => x.surprise).sort((a, b) => b.surprise - a.surprise || b.difficulty - a.difficulty || a.n - b.n).slice(0, 10);
// Index: alphabetical, one line per name, every story it appears in.
const group = (list) => Object.entries(list.reduce((m, x) => ((m[x.name] ||= []).push(x.n), m), {})).sort((a, b) => a[0].localeCompare(b[0]));
const idx = (list) => `(${group(list).map(([name, ns]) => `(name: [${inline(name)}], ns: (${[...new Set(ns)].join(', ')},))`).join(', ')},)`;
const indexPage = SAMPLE ? '' : `#index-pages(${idx(index.laws)}, ${idx(index.people)})\n\n`;
if (top.length && !SAMPLE) body += `#surprises((${top.map((x) => `(n: ${x.n}, question: [${inline(x.title)}], verdict: "${x.verdict}")`).join(', ')},))\n\n`;

const template = readFileSync(new URL('./book-template.typ', import.meta.url), 'utf8');
// Optional design extras (art/extras/final/<name>.png, or EXTRAS=<dir> for option mockups):
// frontispiece, emblem, stamp-true|folklore|disputed, tail-r01..r10, tail-1..3, tell-icon,
// surprises, certificate, flip-1..8. Each one the template finds it uses; missing ones change nothing.
const exDir = process.env.EXTRAS || 'art/extras/final';
const exAbs = join(dir, exDir);
const extras = existsSync(exAbs) ? readdirSync(exAbs).filter((f) => f.endsWith('.png')).sort() : [];
const extrasDict = `#let extras = (${extras.map((f) => `"${f.slice(0, -4)}": "/${exDir}/${f}"`).join(', ')}${extras.length ? ',' : ':'})\n`;
const front = blocks(readFileSync(join(dir, 'front-matter.md'), 'utf8').replace(/^# .*\n+## .*\n+\*.*\*\n+Edited by .*\n/m, ''));
const [backMd, endMd = ''] = readFileSync(join(dir, 'back-matter.md'), 'utf8').split('<!-- after-index -->');
const back = blocks(backMd);
const end = endMd.trim() ? `#back-matter[\n${blocks(endMd)}\n]\n` : '';
// dedication.md holds one line; an empty or missing file prints no dedication.
const dedFile = join(dir, 'dedication.md');
const ded = existsSync(dedFile) && readFileSync(dedFile, 'utf8').trim() ? `#dedication-page[${inline(readFileSync(dedFile, 'utf8').trim())}]\n\n` : '';
const cta = `#back-matter[
= That was round 1 of 10

Nine more rounds, ninety more stories: who really said it, famous experiments retold, the charts that never appeared in the papers, and the jokes that became laws.

*True or Folklore?* is available in paperback and on Kindle. Every story is checked against the record, with the source named on the page.

conyso.com/lawtome/true-or-folklore
]`;
writeFileSync(join(out, SAMPLE ? 'sample.typ' : 'book.typ'), `${extrasDict}${template}\n#title-page()\n\n${SAMPLE ? '' : '#gift-page()\n\n' + ded}#front-matter[\n${front}\n]\n\n#contents((${toc.map((r) => `(n: ${r.n}, name: [${inline(r.name)}], art: ${r.art ? `"${r.art}"` : 'none'}, qs: (${r.qs.map((q) => `(n: ${q.n}, question: [${inline(q.title)}])`).join(', ')},))`).join(', ')},))\n\n${body}\n${SAMPLE ? cta : `#back-matter[\n${back}\n]\n\n${indexPage}${end}`}\n`);
console.log(`${n} stories in ${rounds.length} rounds, ${top.length} in the surprises page → ${join(out, SAMPLE ? 'sample.typ' : 'book.typ')}`);
