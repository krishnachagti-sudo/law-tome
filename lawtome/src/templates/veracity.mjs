// Two question-shaped pages: /is-it-real/ and /misattributed/.
//
// Both exist because of how people actually ask. Nobody types "reliability
// tier"; they type "is the Dunning–Kruger effect real". Nobody types "eponymy";
// they type "who actually discovered Grimm's law". The index already held both
// answers — a four-tier rating on every entry, and an origin paragraph that
// frequently says outright that the namesake was not first — and neither was
// reachable except one page at a time.
//
// Neither page authors a verdict. /is-it-real/ ranks entries by the tier the
// corpus already assigned; /misattributed/ shows the entry's own sentence and
// lets the reader judge it.

import { head, sprite, header, footer, escapeHtml, listFilter, reliabilityClass, reliabilitySlug } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { personId } from './eponyms.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/** Tier order: the ones a reader is suspicious of first. */
const TIER_ORDER = ['Contested', 'Folk-adage', 'Heuristic', 'Empirical'];

const TIER_BLURB = {
  Contested: 'The claim is made, the evidence is argued over, and specialists disagree. Anyone who tells you these are settled — in either direction — is ahead of the evidence.',
  'Folk-adage': 'Sayings. They circulate because they are memorable and often true, not because anyone measured them. Quoting one as science is the usual mistake.',
  Heuristic: 'Rules of thumb: dependable enough to plan with, with no proof behind them. Treat one as a prior, not a law of nature.',
  Empirical: 'Rests on studies or measurements rather than on a saying. That is a claim about the support behind it, not a guarantee it holds in your case.',
};

/**
 * "Is X real?" for the whole corpus at once.
 *
 * @param {object[]} laws corpus entries
 */
export function isItRealPage(laws = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const rows = (Array.isArray(laws) ? laws : []).filter((l) => l && l.reliability);
  const byTier = new Map(TIER_ORDER.map((t) => [t, []]));
  for (const l of rows) if (byTier.has(l.reliability)) byTier.get(l.reliability).push(l);
  for (const list of byTier.values()) list.sort((a, b) => String(a.name).localeCompare(String(b.name), 'en'));
  const present = TIER_ORDER.filter((t) => (byTier.get(t) || []).length);
  const n = (t) => (byTier.get(t) || []).length;
  const contested = n('Contested');

  // The first sentence of `limits`, which is the entry's own statement of where
  // it stops working — the single most useful line to show next to a verdict.
  const firstLimit = (l) => {
    const s = String(l.limits || '').trim();
    if (!s) return '';
    const m = /^[\s\S]*?[.!?](?=\s|$)/.exec(s);
    const one = (m ? m[0] : s).trim();
    return one.length > 190 ? `${one.slice(0, 187).replace(/[\s,;:]+\S*$/, '')}…` : one;
  };

  const row = (l) => `      <a class="vr-row" data-filter-row href="${base}laws/${escapeHtml(l.slug)}/">
        <span class="vr-name">${escapeHtml(l.name)}</span>
        <span class="badge ${reliabilityClass(l.reliability)} vr-badge">${escapeHtml(l.reliability)}</span>
        <span class="vr-limit">${escapeHtml(firstLimit(l)) || '<span class="vr-none">No limit recorded.</span>'}</span>
      </a>`;

  const groups = present.map((t) => `    <section class="vr-group" data-filter-group id="tier-${escapeHtml(reliabilitySlug(t))}">
      <h2 class="vr-group-h"><span class="badge ${reliabilityClass(t)}">${escapeHtml(t)}</span><span class="vr-group-n">${num(n(t))}</span></h2>
      <p class="vr-group-b">${escapeHtml(TIER_BLURB[t] || '')} <a href="${base}reliability/${escapeHtml(reliabilitySlug(t))}/">The ${escapeHtml(t)} index</a>.</p>
      <div class="vr-list">
${(byTier.get(t) || []).map(row).join('\n')}
      </div>
    </section>`).join('\n');

  const answer = `Of the ${num(rows.length)} named laws, principles and effects in this index, ${num(contested)} are rated Contested — the evidence for them is genuinely disputed — ${num(n('Folk-adage'))} are sayings rather than findings, ${num(n('Heuristic'))} are rules of thumb with no proof behind them, and ${num(n('Empirical'))} rest on studies or measurements. Every entry below carries its rating and, where the entry records one, its own statement of where it stops working.`;

  const lede = 'Most lists of these ideas present a proven theorem and a bar-room proverb in the same typeface. This one does not. The rating is a claim about what kind of support an idea has, not about whether it is fashionable — and it is deliberately blunt about the difference between "measured" and "memorable". Where an entry knows its own limits, they are quoted here beside the rating rather than left three screens down its page.';

  const faq = hubFaq([
    {
      q: 'Which of these named laws are actually disputed?',
      a: `${num(contested)} of ${num(rows.length)} are rated Contested: ${(byTier.get('Contested') || []).slice(0, 8).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}${contested > 8 ? `, and ${num(contested - 8)} more` : ''}. Contested means the effect is claimed and the evidence is argued over — not that it has been refuted.`,
    },
    {
      q: 'What does each rating mean?',
      a: TIER_ORDER.map((t) => `<b>${t}</b> — ${TIER_BLURB[t]}`).join(' '),
    },
    {
      q: 'Who decides the rating?',
      a: `This index does, from the sources each entry cites, and it is a judgement rather than a measurement. It is applied uniformly and stated on every page, which is the part that matters: the alternative — presenting a proverb and a measured finding identically — is the thing this page exists to refuse. Every entry lists <a href="${base}sources/">what it cites</a>.`,
    },
    {
      q: 'Does a low rating mean the idea is useless?',
      a: 'No. A rule of thumb that is right most of the time is worth having, provided you know that is what it is. The rating tells you how much weight the idea can carry, not whether to throw it away.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Is it real?',
    sub: `${num(rows.length)} entries rated`,
    answer,
    lede,
    stats: present.map((t) => [num(n(t)), t.toLowerCase()]),
    base,
  })}${listFilter({ target: 'vr-all', label: `Filter ${num(rows.length)} entries`, placeholder: 'Filter by name…', noun: 'entries' })}    <div id="vr-all">
${groups}
    </div>
${faq.html}${hubNav('reliability/', { base })}  </div>
</section>
`;

  const description = `Which of the ${num(rows.length)} named laws in this index are measured findings, which are rules of thumb, which are folklore, and which ${num(contested)} are genuinely disputed — each with its own recorded limits.`;

  const jsonld = [
    ...hubJsonLd({
      name: 'Is it real?',
      description,
      path: 'is-it-real/',
      items: (byTier.get('Contested') || []).slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return head({
    title: `Is It Real? Every Named Law Rated by Evidence | The Law Tome`,
    description, base, origin, path: 'is-it-real/', jsonld,
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/**
 * The entries whose own text says the namesake was not the whole story.
 *
 * @param {{law: object, person: string, reason: string, quote: string}[]} rows
 *   from build/attribution.mjs
 */
export function misattributedPage(rows = [], { base = '/', origin = '', count } = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const total = list.length;
  const byReason = new Map();
  for (const r of list) {
    if (!byReason.has(r.reason)) byReason.set(r.reason, []);
    byReason.get(r.reason).push(r);
  }
  // Strongest claim first — the same order build/attribution.mjs matches in.
  const REASON_ORDER = [
    'the entry says the attribution is wrong',
    'the entry invokes Stigler’s law of eponymy',
    'the entry says the namesake did not originate it',
    'the entry says the namesake never said it',
    'the entry says the namesake was not first',
    'the entry names an earlier author',
    'the entry points at earlier work',
  ];
  const REASON_TITLE = {
    'the entry says the attribution is wrong': 'The attribution is wrong',
    'the entry invokes Stigler’s law of eponymy': 'Stigler’s law, by name',
    'the entry says the namesake did not originate it': 'The namesake did not originate it',
    'the entry says the namesake never said it': 'The namesake never said it',
    'the entry says the namesake was not first': 'The namesake was not first',
    'the entry names an earlier author': 'An earlier author is named',
    'the entry points at earlier work': 'There was earlier work',
  };
  const present = REASON_ORDER.filter((r) => byReason.has(r));

  const row = (r) => `      <div class="ms-row" data-filter-row>
        <span class="ms-law"><a href="${base}laws/${escapeHtml(r.law.slug)}/">${escapeHtml(r.law.name)}</a></span>
        <span class="ms-who">named after <a href="${base}named-after/#${escapeHtml(personId(r.person))}">${escapeHtml(r.person)}</a></span>
        <blockquote class="ms-q">${escapeHtml(r.quote)}</blockquote>
      </div>`;

  const groups = present.map((reason) => `    <section class="ms-group" data-filter-group>
      <h2 class="ms-group-h">${escapeHtml(REASON_TITLE[reason] || reason)}<span class="ms-group-n">${byReason.get(reason).length}</span></h2>
      <div class="ms-list">
${byReason.get(reason).map(row).join('\n')}
      </div>
    </section>`).join('\n');

  const answer = `${num(total)} entries in this index carry a name that their own origin story complicates — the person on the label was not the first, did not coin the phrase, or is credited for work someone else published. Each one below quotes the sentence from the entry that says so, rather than asserting a verdict of its own.`;

  const lede = `This is <a href="${base}laws/stiglers-law/">Stigler's law of eponymy</a> applied to the index that contains it: names attach to whoever wrote the memorable version, not to whoever did the work. The list is built by searching each entry's own origin and misreadings text for an explicit statement — "did not coin", "was not the first", "misattributed", a named earlier author — so nothing appears here on a guess. The groups are ordered by how strong the entry's own claim is, and the weakest of them ("there was earlier work") often describes ordinary shoulders-of-giants credit rather than a theft.`;

  const faq = hubFaq([
    {
      q: 'Which named laws are named after the wrong person?',
      a: `${num(total)} entries here say so themselves${present.length ? `, including ${(byReason.get(present[0]) || []).slice(0, 5).map((r) => `<a href="${base}laws/${escapeHtml(r.law.slug)}/">${escapeHtml(r.law.name)}</a>`).join(', ')}` : ''}. Each entry's own sentence is quoted above so you can judge the claim rather than take ours.`,
    },
    {
      q: 'Is the namesake usually the discoverer?',
      a: `Often not. A name attaches to whoever popularised an idea or wrote the version people remembered, which is why <a href="${base}laws/stiglers-law/">Stigler's law of eponymy</a> exists — and, in the joke Stigler intended, why he attributed his own law to Robert Merton.`,
    },
    {
      q: 'How was this list built?',
      a: 'By pattern-matching each entry\'s own prose for an explicit statement of the problem, then quoting the sentence that matched. Nothing was inferred from the absence of evidence, and "popularised by" was deliberately excluded — popularising an idea is not the same as taking credit for it.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Named after the wrong person',
    sub: `${num(total)} entries`,
    answer,
    lede,
    stats: [[num(total), 'entries'], [present.length, 'kinds of claim'], ['quoted', 'not paraphrased']],
    base,
    crumbs: [['browse/', 'Browse'], ['named-after/', 'By namesake']],
  })}${listFilter({ target: 'ms-all', label: `Filter ${num(total)} entries`, placeholder: 'Filter by law or person…', noun: 'entries' })}    <div id="ms-all">
${groups}
    </div>
${faq.html}${hubNav('named-after/', { base })}  </div>
</section>
`;

  const description = `${num(total)} named laws whose own origin story says the namesake was not first, did not coin the phrase, or is credited for someone else's work — Stigler's law of eponymy, with the receipts quoted.`;

  const jsonld = [
    ...hubJsonLd({
      name: 'Named after the wrong person',
      description,
      path: 'misattributed/',
      items: list.slice(0, 100).map((r) => ({ name: r.law.name, url: `${origin}${base}laws/${r.law.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return head({
    title: `Named After the Wrong Person — ${num(total)} Cases of Stigler's Law | The Law Tome`,
    description, base, origin, path: 'misattributed/', jsonld,
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/**
 * Entries whose rating contradicts their own text.
 *
 * Surfacing "is it real?" immediately caught one: the Dunning–Kruger Effect was
 * rated Empirical while its own limits section opened "The effect is
 * contested." A page that answers the question has to be able to see that the
 * corpus is answering it two ways at once, so this is exported for the build to
 * warn on rather than left to be found by a reader.
 *
 * Deliberately narrow. "The finding is robust but its interpretation is
 * debated" is the ordinary condition of a good result and is NOT flagged; only
 * a first sentence asserting that the effect, its existence or its support is
 * disputed counts, because that is the corpus's own definition of Contested.
 */
export function ratingContradictions(laws = []) {
  const out = [];
  const ASSERTS = /^(?:the\s+)?(?:effect|phenomenon|existence|empirical support|support|rule|law|claim)[^.!?]{0,60}\b(?:is|are)\s+(?:genuinely\s+|hotly\s+|widely\s+)?(?:contested|disputed|debated)\b/i;
  for (const l of (Array.isArray(laws) ? laws : [])) {
    if (!l || l.reliability !== 'Empirical' || typeof l.limits !== 'string') continue;
    const first = l.limits.split(/(?<=[.!?])\s/)[0] || '';
    if (ASSERTS.test(first.trim())) out.push({ slug: l.slug, first: first.trim() });
  }
  return out;
}
