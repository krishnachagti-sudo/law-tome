// /is-it-real/{slug}/ — one entry, one question.
//
// The entry page is about what an idea says. This page is about whether it
// holds, and it earns a separate URL by doing the one thing the entry page
// structurally cannot: putting the answer next to the rest of the index. Three
// numbers here exist nowhere else on the site — where this name sits in the
// print-frequency ranking, how its rating compares with its own field, and how it
// compares with all 1,116 entries.
//
// Everything else on the page is the entry's own authored text: what it claims,
// what its limits are, what people get wrong about it, and the sources. No
// paraphrase, no second opinion, no hedge written for this page — restating the
// entry in different words is exactly how a page like this becomes a doorway.

import {
  head, sprite, header, footer, escapeHtml, reliabilityClass, reliabilitySlug,
  shareRow, RELIABILITY_NOTE,
} from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { verdictPath, verdictLine } from '../../build/verdicts.mjs';

const num = (n) => Number(n).toLocaleString('en-US');
const pc = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');

/**
 * One entry's verdict page.
 * @param {object} v a row from build/verdicts.verdicts()
 */
export function verdictPage(v, { base = '/', origin = '', count, categories = {} } = {}) {
  const { law, rank, rankOf, fieldSoft, fieldTotal, corpusSoft, corpusTotal } = v;
  const path = verdictPath(v);
  const fieldName = categories[v.field] || v.field;
  const line = verdictLine(law);
  const tier = law.reliability;

  // The rating's note is NOT repeated here. The verdict line already says what
  // the rating means in longer form, and printing both gave the Contested pages
  // the word "disputed" three times in two sentences. The note still appears
  // once, on the badge below.
  const answer = `${line} ${escapeHtml(law.name)} is rated <b>${escapeHtml(tier)}</b> in this index. It is the ${num(rank)}${rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} most-printed name of the ${num(rankOf)} whose print frequency can be measured, so this is a question people are actually asking.`;

  // The three comparisons. This is the part of the page the entry cannot carry,
  // so it goes above the entry's own text rather than below it.
  const compare = `    <div class="vd-cmp">
      <div class="vd-c">
        <span class="vd-cn">#${num(rank)}</span>
        <span class="vd-cl">of ${num(rankOf)} measurable names, by how often it appears in printed books</span>
      </div>
      <div class="vd-c">
        <span class="vd-cn">${num(fieldSoft)} of ${num(fieldTotal)}</span>
        <span class="vd-cl">entries in ${escapeHtml(String(fieldName).toLowerCase())} rest on something other than measurement — ${pc(fieldSoft, fieldTotal)} of the field</span>
      </div>
      <div class="vd-c">
        <span class="vd-cn">${pc(corpusSoft, corpusTotal)}</span>
        <span class="vd-cl">of all ${num(corpusTotal)} entries in the index are rated the same way. <a href="${base}how-solid/">The best-known are the least likely to rest on measurement</a></span>
      </div>
    </div>
`;

  const sources = Array.isArray(law.sources) ? law.sources : [];
  const sourceList = sources.length
    ? `    <h2 class="vd-h">What the claim rests on</h2>
    <ol class="vd-src">
${sources.map((s) => `      <li>${s.url ? `<a href="${escapeHtml(s.url)}" rel="nofollow noopener">${escapeHtml(s.text || s.url)}</a>` : escapeHtml(s.text || '')}${s.type ? ` <span class="vd-st">${escapeHtml(s.type)}</span>` : ''}</li>`).join('\n')}
    </ol>
`
    : '';

  const faq = hubFaq([
    {
      q: `So is ${law.name} real or not?`,
      a: `${escapeHtml(line)} This index does not rule on truth; it records what kind of support a claim has. <b>${escapeHtml(tier)}</b> means ${escapeHtml(RELIABILITY_NOTE[tier] || '')}. <a href="${base}reliability/">The four ratings in full</a>.`,
    },
    {
      q: 'Who decides the rating?',
      a: `We do, and that is the softest part of this whole index — it is stated on <a href="${base}how-solid/">the page that makes the argument</a> rather than buried. The rating is applied against a published scale, the entry's own limits are quoted rather than summarised, and every source is linked so you can disagree with us from the same evidence.`,
    },
    {
      q: 'Where is the rest of it?',
      a: `<a href="${base}laws/${escapeHtml(law.slug)}/">The full entry</a> has what the idea says, where it came from, how it works, worked examples and what it is often confused with. This page is only the evidence question. Every entry rated the same way is on <a href="${base}reliability/${reliabilitySlug(tier)}/">the ${escapeHtml(tier)} list</a>.`,
    },
  ], { heading: 'About this verdict' });

  const section = `<section class="sec">
  <div class="wrap">
${hubHead({
    title: `Is ${law.name} real?`,
    sub: `rated ${tier}`,
    answer,
    lede: `${escapeHtml(law.name)} says: <b>${escapeHtml(law.statement || '')}</b> Below: how far the evidence goes, in the entry's own words, and how that compares with the ${num(corpusTotal)} entries around it.`,
    base,
    crumbs: [['is-it-real/', 'Is it real?']],
  })}${compare}
    <p class="vd-badge"><span class="badge ${reliabilityClass(tier)}">${escapeHtml(tier)}</span> <span class="vd-bn">${escapeHtml(RELIABILITY_NOTE[tier] || '')}</span></p>

    <h2 class="vd-h">Where it runs out</h2>
    <p class="vd-p">${escapeHtml(law.limits || '')}</p>

    <h2 class="vd-h">What people get wrong about it</h2>
    <p class="vd-p">${escapeHtml(law.misreadings || '')}</p>

${sourceList}
    <p class="vd-full"><a class="btn" href="${base}laws/${escapeHtml(law.slug)}/">Read the full entry on ${escapeHtml(law.name)}</a></p>

    <div class="sk-share">
${shareRow({
    url: `${origin}${base}${path}`,
    title: `Is ${law.name} real?`,
    text: line,
    label: 'Share this verdict',
  })}    </div>

${faq.html}${hubNav('is-it-real/', { base })}  </div>
</section>
`;

  const description = `Is ${law.name} real? ${line} Rated ${tier} — with what the evidence actually is, where the idea runs out, and how it compares with the rest of the index.`;

  return (
    head({
      title: `Is ${law.name} Real? The Evidence, Rated | The Law Tome`,
      description,
      base,
      origin,
      path,
      jsonld: [
        ...hubJsonLd({
          name: `Is ${law.name} real?`,
          description,
          path,
          origin,
          base,
          crumbs: [['is-it-real/', 'Is it real?']],
        }),
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
