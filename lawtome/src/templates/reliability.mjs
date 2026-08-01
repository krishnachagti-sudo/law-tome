// The reliability hub — /reliability/. A faceted-browse landing that explains
// the four-tier veracity scale and links to a page per tier. Every entry in the
// corpus carries a reliability rating; this makes that rating a browsable axis,
// so a reader who wants "the disputed ones" (Contested) or "the measured ones"
// (Empirical) has a front door. Leans into the project's honesty about which
// "laws" are proven and which are folklore — the thing the credulous listicles
// never tell you.
//
// The page used to be four bare cards and 255 words: the thinnest hub on the
// site, and the only one with no CollectionPage or ItemList at all. It now
// states the split, shows it, names the test each tier has to pass, and puts a
// sample of each tier's laws on the page so the tier is a thing you can read
// rather than a number you have to click.

import {
  head, sprite, header, footer, escapeHtml, figureStrip,
  reliabilityClass, reliabilitySlug, RELIABILITY_TIERS, RELIABILITY_NOTE,
} from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

// What actually earns a law each rating. The one-line RELIABILITY_NOTE says what
// the tier means; this says what a law had to show to land in it, which is the
// part a reader has to trust us on.
const TIER_TEST = {
  Empirical: 'Published measurement backs it. Someone ran the study, fitted the curve, or replicated the effect, and the entry cites that work.',
  Heuristic: 'It holds often enough to plan around and has no proof behind it. Useful, bounded, and wrong at the edges — which is what a rule of thumb is.',
  'Folk-adage': 'It circulates as a saying. No study is claimed and none is implied; the entry records where the phrase came from, not evidence it is true.',
  Contested: 'Specialists disagree. Either the evidence is mixed, the effect shrank on replication, or the claim is defended and attacked in print — the entry gives both sides.',
};

// A tier's example laws. Corpus order (`no`) is the best prominence signal we
// have: the index was built out famous-first, so ascending `no` surfaces
// Moore's Law and Dunning–Kruger rather than Mereology and Isostasy. Sorting by
// name length — the obvious first guess — did exactly the opposite, because the
// obscure entries are the ones with one-word names.
function samples(laws, n) {
  return [...(laws || [])]
    .sort((a, b) => (Number(a.no) || 1e9) - (Number(b.no) || 1e9))
    .slice(0, n);
}

/**
 * @param {object[]} tiers [{ value, count, laws }] for the tiers PRESENT in the
 *   corpus, supplied by the build. Rendered in canonical scale order.
 * @param {object} o
 * @param {string} [o.base='/'] site base path.
 * @param {string} [o.origin=''] absolute origin.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function reliabilityHubPage(tiers = [], { base = '/', origin = '', count, images } = {}) {
  const present = new Map((Array.isArray(tiers) ? tiers : []).map((t) => [t.value, t]));
  // Canonical order, keeping only tiers that actually have members.
  const ordered = RELIABILITY_TIERS
    .filter((v) => present.has(v))
    .map((v) => ({ value: v, count: present.get(v).count ?? (present.get(v).laws || []).length, laws: present.get(v).laws || [] }));

  const total = ordered.reduce((n, t) => n + t.count, 0);
  const pct = (n) => (total ? Math.round((n / total) * 1000) / 10 : 0);
  const of = (v) => ordered.find((t) => t.value === v) || { count: 0, laws: [] };
  const href = (v) => `${base}reliability/${reliabilitySlug(v)}/`;

  // A stacked bar of the split, so the shape of the corpus is visible before any
  // reading. Widths are the real percentages.
  // A segment narrower than about 8% cannot hold its label — it clipped
  // "Folk-adage 2.3%" to the word "dag" — so a thin tier carries only its title
  // attribute and lets the aria-label on the bar do the describing.
  //
  // A percentage is not a width, though: on a phone even a 19% segment is ~70px
  // and "Heuristic 19.4%" was cut mid-word again. Below 720px the CSS drops the
  // in-bar labels entirely and the jump nav underneath — which already names
  // every tier and now carries a colour key and the share — is the legend.
  const bar = total
    ? `    <div class="rel-bar" role="img" aria-label="${ordered.map((t) => `${t.value} ${pct(t.count)} per cent`).join(', ')}">
${ordered.map((t) => {
      const w = pct(t.count);
      const lab = w >= 8 ? `<span class="rel-bar-lab">${escapeHtml(t.value)} ${w}%</span>` : '';
      return `      <span class="rel-bar-seg ${reliabilityClass(t.value)}" style="width:${w}%" title="${escapeHtml(t.value)} — ${t.count} laws, ${w}%">${lab}</span>`;
    }).join('\n')}
    </div>
`
    : '';

  const jump = ordered.length > 1
    ? `    <nav class="az-nav az-nav--key" aria-label="Jump to a tier">
${ordered.map((t) => `      <a href="#tier-${reliabilitySlug(t.value)}"><span class="rel-key ${reliabilityClass(t.value)}" aria-hidden="true"></span>${escapeHtml(t.value)} <span class="az-n">${t.count} · ${pct(t.count)}%</span></a>`).join('\n')}
    </nav>
`
    : '';

  // One section per tier: the badge, the count, what it means, the test it had
  // to pass, and a sample of real members so the tier reads as a shelf.
  const sections = ordered.map((t) => {
    const ex = samples(t.laws, 12);
    const list = ex.length
      ? `        <ul class="rel-ex">
${ex.map((l) => `          <li><a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a></li>`).join('\n')}
        </ul>`
      : '';
    return `      <section class="rel-sec ${reliabilityClass(t.value)}" id="tier-${reliabilitySlug(t.value)}">
        <div class="rel-sec-head">
          <h2><a href="${href(t.value)}"><span class="badge ${reliabilityClass(t.value)}">${escapeHtml(t.value)}</span></a></h2>
          <span class="rel-sec-n"><b>${t.count}</b> laws · ${pct(t.count)}% of the index</span>
        </div>
        <p class="rel-sec-note">${escapeHtml(RELIABILITY_NOTE[t.value] || '')}.</p>
        <p class="rel-sec-test"><span class="rel-test-k">What it takes</span> ${escapeHtml(TIER_TEST[t.value] || '')}</p>
${figureStrip(images, samples(t.laws, 60), { base, limit: 10, min: 4 })}${list}
        <p class="rel-sec-more"><a class="ghost" href="${href(t.value)}"><i class="ti ti-arrow-right" aria-hidden="true"></i> Browse all ${t.count} ${escapeHtml(t.value)} laws</a></p>
      </section>`;
  }).join('\n');

  const emp = of('Empirical');
  const con = of('Contested');
  const folk = of('Folk-adage');

  const answer = total
    ? `Every one of the ${total} named laws in The Law Tome carries one of four reliability ratings: <a href="${href('Empirical')}">Empirical</a> (${emp.count}, ${pct(emp.count)}%) for the ones with published measurement behind them, <a href="${href('Heuristic')}">Heuristic</a> (${of('Heuristic').count}) for rules of thumb, <a href="${href('Folk-adage')}">Folk-adage</a> (${folk.count}) for sayings, and <a href="${href('Contested')}">Contested</a> (${con.count}) for the ones specialists still argue about.`
    : 'Every named law here carries a reliability rating, so you can tell a measured finding from a saying.';

  const lede = `Most collections of "laws" print Moore's Law and Murphy's Law side by side and let you assume they are the same kind of claim. They are not: one is a fitted trend with half a century of data, the other is a joke that hardened into a proverb. Every entry here is rated, the rating is on the card and at the top of the page, and you can browse by it. Where the rating is <a href="${href('Contested')}">Contested</a>, the entry says who disputes it and why.`;

  const faq = hubFaq([
    {
      q: 'What does the reliability rating mean?',
      a: `It is this site's judgement of what kind of claim a law is, on a four-tier scale. ${ordered.map((t) => `<b>${escapeHtml(t.value)}</b> (${t.count} laws) — ${escapeHtml(RELIABILITY_NOTE[t.value] || '')}`).join('; ')}.`,
    },
    {
      q: 'Which named laws are actually proven?',
      a: `${emp.count} of the ${total} entries are rated Empirical, meaning the entry cites published measurement or replicated study. ${samples(emp.laws, 6).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')} are among them. <a href="${href('Empirical')}">See all ${emp.count}</a>.`,
    },
    {
      q: 'Which ones are disputed?',
      a: `${con.count} entries are rated Contested — the evidence is mixed, the effect shrank on replication, or the claim is argued over in print. Each of those pages names the dispute rather than skipping it. <a href="${href('Contested')}">Browse the contested laws</a>.`,
    },
    {
      q: 'Is a Folk-adage law worth knowing?',
      a: `Often, yes — just not as evidence. The ${folk.count} Folk-adage entries are sayings that stuck because they compress something people kept noticing. The rating is there so you never cite one as a finding.`,
    },
    {
      q: 'Who assigns the ratings?',
      a: 'The Law Tome does, from the sources cited on each entry. The rating is editorial, it is stated on every page rather than hidden, and the sources are linked so you can disagree with it.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'How reliable is each law?',
    sub: `${ordered.length} tiers · ${total} laws`,
    answer,
    lede,
    stats: [[total, 'laws rated'], [emp.count, 'empirical'], [con.count, 'contested'], [ordered.length, 'tiers']],
    base,
  })}${bar}${jump}${sections || '<div class="empty">No ratings yet.</div>'}
${faq.html}${hubNav('reliability/', { base })}  </div>
</section>
`;

  const description = total
    ? `All ${total} named laws here are rated for reliability: ${emp.count} Empirical, ${of('Heuristic').count} Heuristic, ${folk.count} Folk-adage, ${con.count} Contested. Browse by tier and see which principles are measured findings and which are folklore.`
    : 'How reliable is each named law? Browse the corpus by veracity — Empirical, Heuristic, Folk-adage, or Contested.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Named laws by reliability',
      description,
      path: 'reliability/',
      items: ordered.map((t) => ({ name: `${t.value} laws (${t.count})`, href: `reliability/${reliabilitySlug(t.value)}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Reliability of Named Laws — Empirical to Contested | The Law Tome',
      description,
      base,
      origin,
      path: 'reliability/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
