// One page per namesake who lent their name to more than one law.
//
// "Laws named after Newton" had nowhere to land: /named-after/ is a single
// 5,000-word index of 625 people, and a reader who wants Newton's three gets a
// row in an A–Z. Fifty-two people account for 117 laws between them, and that
// cluster is the interesting thing the index can show.
//
// ONLY those fifty-two. A page per one-law namesake would be a thin restatement
// of the law's own page under a second URL, which is what a doorway page is.
//
// ANTI-FABRICATION. There is no biography here and there must never be one: the
// corpus records what a person's name is attached to, not who they were, and a
// plausible-sounding life written from memory is exactly the invented fact this
// project exists to refuse. Everything on the page is either a corpus field or a
// sourced fetch — the portrait with its licence, the birthplace with its
// Wikidata record, the laws themselves — and the page links out to Wikidata and
// Wikipedia for the life story rather than paraphrasing one.

import { head, sprite, header, footer, escapeHtml, portrait, personImage, personSlug, imageCredit, lawCard, reliabilityClass } from './partials.mjs';
import { hubHead, hubFaq, hubNav, setTensions, setAdjacent } from './hub.mjs';
import { monogram } from './eponyms.mjs';

const NUM_WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const numWord = (n) => (n >= 0 && n < NUM_WORDS.length ? NUM_WORDS[n] : String(n));
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const plural = (n, word) => (n === 1 ? word : `${word}s`);

/** The URL path for a namesake page (no leading or trailing slash). */
export function namesakePath(person) {
  return `named-after/${personSlug(person)}/`;
}

/**
 * Which namesakes get their own page: people with two or more laws.
 *
 * Gated on `kind === 'person'` as well as the count. A place, a work or a
 * fictional character can also lend its name to two laws, and "Where was
 * Pygmalion from?" is not a question this page shape can answer.
 */
export function namesakesWithPages(groups = []) {
  return (Array.isArray(groups) ? groups : [])
    .filter((g) => g && g.kind === 'person' && Array.isArray(g.laws) && g.laws.length > 1)
    .sort((a, b) => b.laws.length - a.laws.length || a.person.localeCompare(b.person, 'en'));
}

/** True when a namesake names more than one person ("Heckscher and Ohlin"). */
export function isJoint(person) {
  return /\s+(?:and|&)\s+/i.test(String(person || ''));
}

/** The set of people in a namesake, order-insensitive, for matching orderings. */
function peopleKey(person) {
  return String(person || '').split(/\s+(?:and|&)\s+/i)
    .map((s) => s.trim().toLowerCase()).filter(Boolean).sort().join('|');
}

/**
 * Namesakes that name the SAME people in a different written order.
 *
 * "Amos Tversky and Daniel Kahneman" carries four laws and "Daniel Kahneman and
 * Amos Tversky" carries two, and neither is a mistake to be normalised away: the
 * order follows the authorship of the paper each law comes from — anchoring and
 * availability are Tversky & Kahneman, loss aversion and the planning fallacy
 * are Kahneman & Tversky. Rewriting one to match the other would falsify a
 * citation to tidy an index. So the orderings stay, and each page points at its
 * sibling instead.
 *
 * @returns {Object<string,object[]>} person -> the other groups naming them.
 */
export function siblingOrderings(groups = []) {
  const byPeople = new Map();
  for (const g of (Array.isArray(groups) ? groups : [])) {
    const k = peopleKey(g.person);
    if (!byPeople.has(k)) byPeople.set(k, []);
    byPeople.get(k).push(g);
  }
  const out = {};
  for (const list of byPeople.values()) {
    if (list.length < 2) continue;
    for (const g of list) out[g.person] = list.filter((o) => o.person !== g.person);
  }
  return out;
}

export function namesakePage(group, {
  base = '/', origin = '', count, images, facts = {}, categories = {}, byslug = {}, compareSlugs = {}, kinds = {}, siblings = [],
} = {}) {
  const person = (group && group.person) || '';
  const laws = (group && Array.isArray(group.laws) ? group.laws : []);
  const slug = personSlug(person);
  const img = personImage(images, person);
  const fact = (facts._people || {})[slug] || null;
  const wd = kinds[person] || {};

  // Fields and years, read off the laws — the only two summary facts a set of
  // laws can honestly yield about the person whose name they carry.
  const fieldTally = new Map();
  for (const l of laws) if (l.category) fieldTally.set(l.category, (fieldTally.get(l.category) || 0) + 1);
  const fields = [...fieldTally.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const years = laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1);
  const span = years.length ? [Math.min(...years), Math.max(...years)] : null;
  const tiers = new Map();
  for (const l of laws) if (l.reliability) tiers.set(l.reliability, (tiers.get(l.reliability) || 0) + 1);

  // Escaped at the point of construction: `answer` is interpolated into HTML
  // unescaped, and every field display name contains an ampersand.
  const fieldNames = fields.map(([k]) => escapeHtml(categories[k] || k));
  const lawLink = (l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`;

  // "Amos Tversky and Daniel Kahneman has 4 named laws" is not a sentence.
  const joint = isJoint(person);
  const answer = `${escapeHtml(person)} ${joint ? 'have' : 'has'} ${laws.length} named laws, principles or effects in The Law Tome: ${laws.map(lawLink).join(', ')}${fieldNames.length > 1 ? `, spanning ${fieldNames.slice(0, 3).join(', ')}${fieldNames.length > 3 ? ' and more' : ''}` : fieldNames.length ? `, all in ${fieldNames[0]}` : ''}${span ? `, named between ${span[0]} and ${span[1]}` : ''}.`;

  // The portrait, with the credit the licence requires. No caption invented
  // beyond what imageCredit states from the manifest.
  const face = img
    ? `    <figure class="ns-face">
      ${portrait(img, { base, alt: person })}
      <figcaption>${escapeHtml(person)}. ${imageCredit(img)}</figcaption>
    </figure>
`
    : `    <div class="ns-face ns-face--mono" aria-hidden="true"><span>${escapeHtml(monogram(person))}</span></div>
`;

  // Sourced facts only: where they were born (Wikidata P19) and the record
  // itself. Anything a reader wants beyond this is one click away, on a page
  // whose job is biography.
  const outward = [];
  if (fact && fact.origin && fact.origin.place) {
    outward.push(`<span class="ns-fact"><b>Born in</b> ${escapeHtml(fact.origin.place)}${fact.origin.source ? ` <a class="ns-src" href="${escapeHtml(fact.origin.source)}">source</a>` : ''}</span>`);
  }
  // For a joint namesake the fetch resolved ONE of the two people, so the link
  // has to say whose record it is. Left unlabelled under a heading naming both,
  // it reads as a record for the pair, which is a misattribution.
  if (wd.qid) {
    outward.push(`<span class="ns-fact"><b>Wikidata</b> <a href="https://www.wikidata.org/wiki/${escapeHtml(wd.qid)}">${escapeHtml(wd.qid)}</a>${joint && wd.title ? ` <span class="ns-who">(${escapeHtml(wd.title)})</span>` : ''}</span>`);
  }
  if (wd.title) {
    outward.push(`<span class="ns-fact"><b>Wikipedia</b> <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(String(wd.title).replace(/ /g, '_'))}">${escapeHtml(wd.title)}</a>${joint ? ' <span class="ns-who">(one of the two)</span>' : ''}</span>`);
  }
  const factRow = outward.length ? `    <p class="ns-facts">${outward.join('')}</p>\n` : '';

  const grid = laws.map((l) => lawCard(l, base, 2)).join('\n');

  // The same two people, written the other way round, carry their own laws. Not
  // a duplicate to be merged: the order follows each paper's authorship. Point
  // at it, so neither page looks like the whole of what the pair is named on.
  const sibs = (Array.isArray(siblings) ? siblings : []).filter((o) => o && o.person !== person);
  const siblingNote = sibs.length
    ? `    <p class="crossaxis">The corpus also files ${sibs.map((o) => `<a href="${base}${namesakePath(o.person)}">${escapeHtml(o.person)}</a> (${o.laws.length})`).join(' and ')} — the same people in the order each paper printed them, so both orderings are kept rather than one being rewritten to match the other.</p>\n`
    : '';

  // --- What the set is built on ---------------------------------------------
  //
  // These pages were the thinnest indexable pages on the site — a portrait, a
  // sentence, a grid of cards and a nav block. The missing content was sitting
  // in the corpus the whole time: the entries carry sources, and a namesake is
  // exactly the axis along which a reader would want them collected. So the
  // page now prints the original publications behind the person's laws as one
  // list, deduplicated across the set.
  //
  // It also prints how many of the laws have NO primary source located yet.
  // That number is unflattering on some pages and it stays: a bibliography that
  // only lists what it found, without saying what it did not, invites the
  // reader to assume the gap is not there.
  const full = laws.map((l) => byslug[l.slug] || l);
  const seenSrc = new Set();
  const primary = [];
  let unsourced = 0;
  for (const l of full) {
    const own = (Array.isArray(l.sources) ? l.sources : []).filter((s) => s && s.type === 'primary');
    if (!own.length) { unsourced++; continue; }
    for (const s of own) {
      const key = String(s.url || s.text || '').trim();
      if (!key || seenSrc.has(key)) continue;
      seenSrc.add(key);
      primary.push({ src: s, law: l });
    }
  }
  const biblio = primary.length
    ? `    <h2 class="ns-h">The publications behind these ${numWord(laws.length)}</h2>
    <p class="ns-lede">The original ${plural(primary.length, 'work')}, not ${primary.length === 1 ? 'an account' : 'accounts'} of ${primary.length === 1 ? 'it' : 'them'} — collected across the set and deduplicated.${unsourced ? ` ${cap(numWord(unsourced))} of the ${numWord(laws.length)} ${unsourced === 1 ? 'entry has' : 'entries have'} no original publication located yet, and ${unsourced === 1 ? 'is' : 'are'} carried on secondary sources; ${unsourced === 1 ? 'it is' : 'they are'} marked as such on ${unsourced === 1 ? 'its' : 'their'} own ${plural(unsourced, 'page')}.` : ''}</p>
    <ol class="ns-biblio">
${primary.map(({ src, law }) => `      <li>${src.url && /^https?:\/\//i.test(String(src.url).trim())
        ? `<a href="${escapeHtml(src.url)}">${escapeHtml(src.text || src.url)}</a>`
        : escapeHtml(src.text || '')} <span class="ns-for">for ${lawLink(law)}</span></li>`).join('\n')}
    </ol>
`
    : (laws.length
      ? `    <h2 class="ns-h">The publications behind these ${numWord(laws.length)}</h2>
    <p class="ns-lede">None of the ${numWord(laws.length)} entries carrying this name has had its original publication located yet — they rest on secondary sources, listed on the entry pages. That is a gap in this index, not a judgement about the work.</p>
`
      : '');

  // When each name actually took hold in print. Google Books Ngrams, the same
  // series /best-known/ ranks on; the peak year is read off the series rather
  // than asserted. Only rendered when the set gives more than one data point,
  // because "one name peaked in 1978" is a fact about a law, not about a set.
  const peaks = laws.map((l) => {
    const ng = (facts[l.slug] || {}).ngram;
    if (!ng || !Array.isArray(ng.series) || ng.series.length < 2 || !Number.isFinite(Number(ng.from))) return null;
    let best = 0;
    for (let i = 1; i < ng.series.length; i++) if (ng.series[i] > ng.series[best]) best = i;
    if (!(ng.series[best] > 0)) return null;
    return { law: l, year: Number(ng.from) + best };
  }).filter(Boolean).sort((a, b) => a.year - b.year);
  const printNote = peaks.length > 1
    ? `    <p class="ns-print">In printed English the names peaked at different times — ${peaks.map((p) => `${lawLink(p.law)} around ${p.year}`).join(', ')} — measured on <a href="https://books.google.com/ngrams/" rel="noopener nofollow">Google Books Ngrams</a>. Printing frequency is not importance, and it is not evidence; it is when a phrase was in the air. <a href="${base}best-known/">The whole index ranked that way</a>.</p>\n`
    : '';

  const faq = hubFaq([
    {
      q: `What laws are named after ${person}?`,
      a: `${laws.length}: ${laws.map((l) => `${lawLink(l)}${l.coinedYear ? ` (${escapeHtml(String(l.coinedYear))})` : ''}`).join(', ')}.`,
    },
    ...(fields.length ? [{
      q: `What field${fields.length > 1 ? 's are' : ' is'} ${person} associated with here?`,
      a: `${fields.map(([k, n]) => `<a href="${base}category/${escapeHtml(k)}/">${escapeHtml(categories[k] || k)}</a> (${n})`).join(', ')}. The field is where the law sits in this index, not a claim about the person's career.`,
    }] : []),
    ...(tiers.size ? [{
      q: 'How well established are they?',
      a: `${[...tiers.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} rated <a href="${base}reliability/${String(k).toLowerCase()}/">${escapeHtml(k)}</a>`).join(', ')}. A famous name is no guarantee: the rating is on every entry.`,
    }] : []),
    ...(sibs.length ? [{
      q: `Why is there another page for the same people?`,
      a: `Because the corpus records the namesake in the order each law's own paper printed it, and these two people published in both orders. ${sibs.map((o) => `<a href="${base}${namesakePath(o.person)}">${escapeHtml(o.person)}</a> carries ${o.laws.length}`).join('; ')}. Merging them would mean rewriting a citation to tidy an index.`,
    }] : []),
    {
      q: `What are these entries actually based on?`,
      a: `${primary.length ? `${cap(numWord(primary.length))} original ${plural(primary.length, 'publication')}, listed above with the entry ${primary.length === 1 ? 'it' : 'each'} supports` : 'Secondary sources — encyclopaedia and review articles'}${unsourced && primary.length ? `, plus secondary sources for the ${unsourced === 1 ? 'one entry' : `${numWord(unsourced)} entries`} whose original has not been located` : ''}. Every source is linked on the entry's own page, so you can read what the rating was made from rather than take it on trust.`,
    },
    {
      q: `Where can I read about ${person} themselves?`,
      a: `${wd.title ? `On <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(String(wd.title).replace(/ /g, '_'))}">Wikipedia</a>${wd.qid ? ` and <a href="https://www.wikidata.org/wiki/${escapeHtml(wd.qid)}">Wikidata</a>` : ''}.` : 'On Wikipedia and Wikidata.'} The Law Tome indexes what a name is attached to, not the life behind it. Writing a biography from memory is exactly the kind of invented fact this project refuses, so this page links to one instead of paraphrasing it.`,
    },
  ], { heading: `Questions about ${person}` });

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: person,
    sub: `${laws.length} named laws`,
    answer,
    stats: [
      [laws.length, laws.length === 1 ? 'law' : 'laws'],
      [fields.length, fields.length === 1 ? 'field' : 'fields'],
      ...(span ? [[span[0] === span[1] ? String(span[0]) : `${span[0]}–${span[1]}`, 'span']] : []),
    ],
    crumbs: [['browse/', 'Browse'], ['named-after/', 'By namesake']],
    base,
  })}${face}${factRow}${siblingNote}    <div class="grid">
${grid}
    </div>
${printNote}${biblio}${setTensions(laws, { base, compareSlugs, noun: 'set' })}${setAdjacent(laws, { base, byslug, noun: 'set' })}${faq.html}${hubNav('named-after/', { base })}  </div>
</section>
`;

  const description = `The ${laws.length} named laws, principles and effects in The Law Tome that carry ${person}'s name — ${laws.slice(0, 4).map((l) => l.name).join(', ')}${laws.length > 4 ? ' and more' : ''}. Each explained, rated and sourced.`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Laws named after ${person}`,
      url: `${origin}${base}${namesakePath(person)}`,
      description,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      // The Person node carries a name and the identifiers we actually resolved
      // — no birth date, no description, nothing this project did not fetch.
      about: {
        '@type': 'Person',
        name: person,
        ...(wd.qid ? {
          identifier: wd.qid,
          sameAs: [
            `https://www.wikidata.org/wiki/${wd.qid}`,
            ...(wd.title ? [`https://en.wikipedia.org/wiki/${String(wd.title).replace(/ /g, '_')}`] : []),
          ],
        } : {}),
        ...(fact && fact.origin && fact.origin.place ? { birthPlace: { '@type': 'Place', name: fact.origin.place } } : {}),
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: laws.length,
        itemListElement: laws.map((l, i) => ({
          '@type': 'ListItem', position: i + 1, name: l.name, url: `${origin}${base}laws/${l.slug}/`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
        { '@type': 'ListItem', position: 3, name: 'By namesake', item: `${origin}${base}named-after/` },
        { '@type': 'ListItem', position: 4, name: person },
      ],
    },
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: `Laws Named After ${person} — All ${laws.length} | The Law Tome`,
      description,
      base,
      origin,
      path: namesakePath(person),
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
