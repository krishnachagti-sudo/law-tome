// Makes two social cards per story for True or Folklore? (1080 × 1350, Instagram portrait):
//   q-NNN.png  the question and its cartoon, verdict hidden: the curiosity gap
//   a-NNN.png  the verdict stamp and the "Tell someone" line: the reveal people repost
// Post the pair as a two-slide carousel. Only the reveal card names the book.
//
//   node books/scripts/share-cards.mjs books/true-or-folklore
//   typst compile --root books/true-or-folklore --ignore-system-fonts --font-path books/_layout/fonts/static \
//     books/true-or-folklore/build/cards.typ "books/true-or-folklore/build/cards/{p}.png" --ppi 72
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
mkdirSync(join(dir, 'build', 'cards'), { recursive: true });
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/([#$@<>\[\]`~_*=])/g, '\\$1').replace(/\/\//g, '\\/\\/')
  .replace(/\\\*([^*]+)\\\*/g, '_$1_');

const cards = [];
let orig = 0;
for (const f of readdirSync(join(dir, 'drafts')).filter((x) => /^round-\d+\.md$/.test(x)).sort()) {
  for (const e of readFileSync(join(dir, 'drafts', f), 'utf8').split(/<!--\s*slug:/).slice(1)) {
    orig++;
    const verdict = (e.match(/verdict:\s*(\w+)/) || [])[1];
    const q = (e.match(/^## (.*)$/m) || [])[1];
    const tell = ((e.match(/^\*\*Tell someone:\*\*\s*(.*)$/m) || [])[1] || '').trim();
    const art = `${String(orig).padStart(3, '0')}.png`;
    cards.push({ n: orig, q, verdict, tell, art: existsSync(join(dir, 'art', 'final', art)) ? `/art/final/${art}` : null });
  }
}

let typ = `#set page(width: 1080pt, height: 1350pt, margin: 90pt, fill: white)
#set text(font: ("LT Text", "LT Text Ext"), size: 34pt, fill: black)
#let mono(b, size: 26pt) = text(font: "Space Mono", size: size, tracking: 0.12em, upper(b))
#let foot = { v(1fr); line(length: 100%, stroke: 2pt); v(18pt); grid(columns: (1fr, auto), mono[True or Folklore?], mono[conyso.com/lawtome]) }
`;
for (const c of cards) {
  typ += `
#mono[Story № ${c.n}]
#v(30pt)
#text(font: "Fraunces 72pt", size: 72pt, hyphenate: false)[${esc(c.q)}]
${c.art ? `#v(1fr)\n#align(center, image("${c.art}", width: 100%, height: 520pt, fit: "contain"))` : ''}
#v(1fr)
#grid(columns: (1fr, 1fr, 1fr), column-gutter: 18pt, ..("TRUE", "FOLKLORE", "DISPUTED").map(w => box(width: 100%, stroke: 3pt, radius: 8pt, inset: 22pt, align(center, mono(w, size: 28pt)))))
#v(24pt)
#align(center, mono([Your call? Swipe for the answer →], size: 24pt))
#foot
#pagebreak()
#mono[Story № ${c.n} · the answer]
#v(40pt)
#text(font: "Fraunces 72pt", size: 46pt, hyphenate: false)[${esc(c.q)}]
#v(60pt)
#box(stroke: 7pt, inset: 22pt, box(stroke: 2pt, inset: (x: 34pt, y: 20pt), text(font: "Space Mono", size: 88pt, weight: "bold", tracking: 0.18em)[${c.verdict}]))
#v(70pt)
#block(inset: (left: 34pt), stroke: (left: 6pt), [#mono[Tell someone] #linebreak() #text(size: 46pt, style: "italic")[${esc(c.tell)}]])
#v(1fr)
#text(size: 30pt)[100 stories like this, each checked against the record, in _True or Folklore?_ from the Law Tome series.]
#foot
${c === cards[cards.length - 1] ? '' : '#pagebreak()'}
`;
}
writeFileSync(join(dir, 'build', 'cards.typ'), typ);
console.log(`${cards.length} stories → ${cards.length * 2} cards in build/cards.typ`);
