// /kinds/ and /kinds/<plural>/ — the index sliced by what kind of thing each
// entry is.
//
// Every other axis on this site answers "which ones are about X" (field),
// "which ones are trustworthy" (reliability), "which ones came from where"
// (origins, timeline). None of them answered the question a reader most often
// types verbatim: *list of paradoxes*, *philosophical razors*, *logical
// fallacies*, *famous thought experiments*, *named theorems*. Those are lists,
// and a list is a page.
//
// The honesty problem, and how these pages handle it: membership is read off
// the NAME, not off a judgement about the idea (see build/kinds.mjs). That
// makes every page verifiable by eye and incomplete in a way the page states
// out loud, high up, before the list. The alternative — an editor deciding
// which of 1,101 entries "is really" a bias — is exactly the kind of unsourced
// call this project does not make.

import { head, sprite, header, footer, escapeHtml, lawCard, figureStrip, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd, setShape, setTensions, setAdjacent } from './hub.mjs';
import { kindPath } from '../../build/kinds.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

// The sentence every kind page has to carry, and the one the hub carries once.
// Written in one place so the two cannot drift into saying different things
// about how the same list was built.
const RULE = 'Membership here is read off the name. An entry is on this page because the name it is known by says so — not because anybody judged the idea to fit.';

/* -------------------------------------------------------------------- hub */

/**
 * @param {object[]} groups from build/kinds.mjs `kinds()`
 */
export function kindsHubPage(groups = [], { base = '/', origin = '', count, total = 0 } = {}) {
  const rows = (Array.isArray(groups) ? groups : []).slice()
    .sort((a, b) => b.count - a.count);
  const covered = rows.reduce((n, g) => n + g.count, 0);
  const unnamed = Math.max(0, Number(total || 0) - covered);

  const answer = `The index holds ${num(rows.length)} kinds of named thing — ${rows.slice(0, 5).map((g) => `${num(g.count)} ${g.count === 1 ? g.one : g.many}`).join(', ')}, and more. ${RULE}`;

  const lede = `A law and a paradox are not the same kind of claim, and neither is a theorem, a razor or a rule of thumb. The word at the end of a name is a real signal about what an idea is asking of you: a theorem asks you to check its premises, a razor asks you to drop an explanation, a fallacy asks you to stop. These pages group the index by that word.`;

  const cards = rows.map((g) => `        <a class="kd-card" href="${base}${kindPath(g)}">
          <span class="kd-n">${num(g.count)}</span>
          <span class="kd-t">${escapeHtml(g.title)}</span>
          <span class="kd-g">${escapeHtml(g.gloss)}</span>
        </a>`).join('\n');

  const faq = hubFaq([
    { q: 'How is the kind decided?', a: `${RULE} Occam's Razor is a razor because it is called a razor; the Prisoner's Dilemma is a dilemma for the same reason. Where an entry's own name says nothing, the names it also travels under are checked — which is the only reason Newton's Flaming Laser Sword appears among <a href="${base}kinds/razors/">the razors</a>, since it is also known as Alder's Razor.` },
    { q: 'Why is my favourite bias not on the biases page?', a: `Because its name does not contain the word. The index holds many more cognitive biases than the <a href="${base}kinds/biases/">biases page</a> shows — Anchoring, the Halo Effect, Loss Aversion — but they are conventionally named as effects or as bare nouns, and this classification does not overrule what a thing is called. For the psychology of judgement as a subject, <a href="${base}category/psychology/">the field page</a> is the better door.` },
    { q: `What about the other ${num(unnamed)} entries?`, a: `Their names do not say what kind of thing they are — Anomie, Cognitive Dissonance, Brownian Motion, Chesterton's Fence. They are on no page here, and are reached by <a href="${base}browse/">name</a>, by <a href="${base}category/">field</a>, or through <a href="${base}situations/">the problem you are having</a>.` },
    { q: 'Is a law more reliable than a rule of thumb?', a: `Not by its name, no — which is the point of rating them separately. Some entries called laws are measured to many decimal places and some are jokes that stuck; <a href="${base}is-it-real/">the reliability scale</a> says which is which, entry by entry, and it does not track the word at the end of the name.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'What kind of thing is it?',
    sub: `${num(rows.length)} kinds`,
    answer,
    lede,
    stats: [[num(rows.length), 'kinds'], [num(covered), 'entries filed'], [num(unnamed), 'unclassified']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}    <div class="kd-grid">
${cards}
    </div>
    <p class="kd-note">${escapeHtml(RULE)} ${num(unnamed)} entries carry no kind word in any of their names and appear on none of these pages.</p>
${faq.html}${hubNav('kinds/', { base })}  </div>
</section>
`;

  const description = `The index grouped by what kind of thing each entry is: ${rows.slice(0, 6).map((g) => g.many).join(', ')} and more — ${num(covered)} entries across ${num(rows.length)} kinds, filed by the word in their own name.`;

  return head({
    title: 'Laws, Effects, Paradoxes, Razors — The Index by Kind | The Law Tome',
    description, base, origin, path: 'kinds/',
    jsonld: [
      ...hubJsonLd({
        name: 'The index by kind',
        description,
        path: 'kinds/',
        items: rows.map((g) => ({ name: g.title, url: `${origin}${base}${kindPath(g)}` })),
        origin,
        base,
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/* ----------------------------------------------------------------- detail */

/**
 * One kind's page.
 * @param {object} g a group from build/kinds.mjs
 * @param {object[]} o.others the other kinds, for the band at the foot
 */
export function kindPage(g, {
  base = '/', origin = '', count, images, categories = {}, byslug = {},
  compareSlugs = {}, others = [],
} = {}) {
  const laws = g.laws || [];
  const total = laws.length;
  const shape = setShape(laws, { base, categories });
  const topField = shape.fields[0];
  const years = laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1);
  const span = years.length ? [Math.min(...years), Math.max(...years)] : null;
  const tiers = (() => {
    const m = new Map();
    for (const l of laws) if (l.reliability) m.set(l.reliability, (m.get(l.reliability) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  })();

  const lower = g.title.toLowerCase();
  // The date clause has to survive a set where only some entries carry a year.
  // "Named between 1980 and 2007" is false of the razors — Occam's has no
  // recorded coining date at all — so the sentence says how many dates it is
  // speaking for whenever that is fewer than all of them.
  const dated = years.length === total
    ? (span ? `, named between ${span[0]} and ${span[1]}` : '')
    : (span ? `, of which ${num(years.length)} carry a recorded date, running from ${span[0]} to ${span[1]}` : '');

  const answer = `The index holds ${num(total)} ${total === 1 ? g.one : g.many}${topField ? `, most of them in ${escapeHtml(categories[topField[0]] || topField[0])}` : ''}${dated}. ${g.gloss}`;

  // The lede does not repeat the gloss the answer just gave; its job is the
  // caveat, which is the thing a reader has to know before reading the list.
  const lede = `${RULE} It makes this page verifiable by eye and incomplete on purpose: an idea that behaves like ${/^[aeiou]/i.test(g.one) ? 'an' : 'a'} ${g.one} but is conventionally called something else is filed under that something else, and nothing here overrules what a thing is called.`;

  const faq = hubFaq([
    {
      q: `What ${lower.replace(/s$/, '')}s does this index have?`,
      a: `${num(total)}: ${laws.slice(0, 10).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}${total > 10 ? `, and ${num(total - 10)} more below` : ''}. Each has a full entry with the statement, the mechanism, worked examples, the limits and the sources.`,
    },
    {
      q: `What is a ${g.one}?`,
      a: `${g.gloss} That is the sense in which the word is used here; where a particular entry's tradition uses it differently, the entry says so.`,
    },
    {
      q: 'Is this every one there is?',
      a: `No — it is every one in this index whose name says ${g.one}. ${RULE} An idea conventionally called something else is filed under that something else, however much it behaves like ${/^[aeiou]/i.test(g.one) ? 'an' : 'a'} ${g.one}.`,
    },
    ...(tiers.length > 1 ? [{
      q: `Are ${lower} reliable?`,
      a: `Not as a class, and the split here says so: ${tiers.map(([t, n]) => `${n} rated <a href="${base}reliability/${t.toLowerCase()}/">${escapeHtml(t)}</a>`).join(', ')}. The word at the end of a name carries no evidence with it, which is why every entry is rated separately — see <a href="${base}is-it-real/">is it real?</a>`,
    }] : []),
  ]);

  const band = others.length
    ? `    <nav class="cy-others" aria-label="Other kinds">
      <h2 class="cy-others-h">Other kinds of named thing</h2>
      <div class="cy-others-row">
${others.map((o) => `        <a class="cy-chip" href="${base}${kindPath(o)}"><span>${escapeHtml(o.title)}</span><b>${num(o.count)}</b></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: g.title,
    sub: `${num(total)} ${total === 1 ? 'entry' : 'entries'}`,
    answer,
    lede,
    stats: [
      [num(total), total === 1 ? 'entry' : 'entries'],
      [shape.fields.length, shape.fields.length === 1 ? 'field' : 'fields'],
      ...(span ? [[`${span[0]}–${span[1]}`, 'span']] : []),
    ],
    base,
    crumbs: [['browse/', 'Browse'], ['kinds/', 'By kind']],
  })}${figureStrip(images, laws, { base, limit: 12, min: 5 })}${shape.html}    <h2 class="kd-h2">All ${num(total)} ${total === 1 ? g.one : g.many}</h2>
${total > 24 ? listFilter({ target: 'kd-list', label: `Filter ${num(total)} entries`, placeholder: 'Filter by name or statement…', noun: 'entries' }) : ''}    <div class="grid kd-list" id="kd-list">
${laws.map((l) => `  <div data-filter-row data-filter-text="${escapeHtml(`${l.name} ${(l.aliases || []).join(' ')} ${l.statement}`)}">
${lawCard(l, base, 3)}
  </div>`).join('\n')}
    </div>
${setTensions(laws, { base, compareSlugs, noun: g.one })}${setAdjacent(laws, { base, byslug, noun: g.one })}${band}${faq.html}${hubNav('kinds/', { base })}  </div>
</section>
`;

  const description = `Every ${g.one} in the index — ${num(total)} entries, each with its statement, mechanism, worked examples, limits and sources. ${g.gloss}`;

  return head({
    title: `${g.title} — All ${num(total)} in the Index | The Law Tome`,
    description, base, origin, path: kindPath(g),
    jsonld: [
      ...hubJsonLd({
        name: g.title,
        description,
        path: kindPath(g),
        items: laws.slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
        origin,
        base,
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
