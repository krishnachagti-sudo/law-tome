// Features / product tour (/features/) — the full showcase of what the site does,
// one URL to link and rank. Each capability gets a block with copy and a "try it"
// link into the real feature. Inline SVG icons (the icon font is a tiny subset).

import { head, sprite, header, footer } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const svg = (inner) => `<svg class="ftr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const FEATURES = [
  { href: 'situations/', cta: 'Describe a situation',
    icon: svg('<path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><circle cx="10.5" cy="10" r="2"/><path d="M13.4 12.9l1.8 1.8"/>'),
    title: 'Search by the feeling, not the name',
    body: 'The hardest part of a named law is remembering it exists. Type what’s happening — “we hit the target but the product got worse” — and the search lands you on the law that names it, even when you can’t. A curated situation map backs it up for the common cases.' },
  { href: 'graph/', cta: 'Open the graph',
    icon: svg('<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M7 11l10-4M7 13l10 4"/>'),
    title: 'A graph, not a flat list',
    // named laws in body copy are real entries — a `body` may be a function of
    // `base` so it can link them instead of merely name-dropping them
    body: (base) => `Every law links to the ones it echoes, causes, or contradicts. Start anywhere and walk the web — <a href="${base}laws/goodharts-law/">Goodhart</a> to <a href="${base}laws/campbells-law/">Campbell</a> to the <a href="${base}laws/cobra-effect/">Cobra Effect</a> to <a href="${base}laws/streisand-effect/">Streisand</a>. The connective tissue no A–Z can give you.` },
  { href: 'tension/', cta: 'See the tensions',
    icon: svg('<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><path d="M8.3 6H13l3.5 6-3.5 6H8.3"/><path d="M12 12h6"/>'),
    title: 'The laws that disagree',
    body: 'Principles don’t all point the same way. We surface the pairs in tension — where one law’s advice is another’s warning — so you can weigh both instead of quoting whichever you remember.' },
  { href: 'compare/', cta: 'Compare two laws',
    icon: svg('<rect x="3" y="5" width="7" height="14" rx="1.2"/><rect x="14" y="5" width="7" height="14" rx="1.2"/><path d="M12 4v16"/>'),
    title: 'Two laws, side by side',
    body: 'The ideas that get mixed up — Brooks’s Law vs Linus’s Law, precision vs accuracy — laid out together so the difference is obvious. Hundreds of head-to-head comparisons, each cross-linked to both entries.' },
  { href: 'timeline/', cta: 'Walk the timeline',
    icon: svg('<path d="M4 12h16"/><circle cx="7" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="17" cy="12" r="1.6"/><path d="M7 8v-3M12 16v3M17 8v-3"/>'),
    title: 'A history of ideas',
    body: 'Read the index as a timeline — every law placed in the century it was named, from ancient maxims to principles coined in living memory. Jump straight to any era.' },
  { href: 'quiz/', cta: 'Play the quiz',
    icon: svg('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2.2-2.6 4"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor"/>'),
    title: 'A law a day — and a game',
    body: 'One law surfaced fresh each day, plus a quick round of “name that law” from its statement alone. Learn the index by playing it, not just searching it.' },
  { href: 'reliability/', cta: 'Browse by reliability',
    icon: svg('<path d="M12 3l7 3v5c0 5-3.4 8.2-7 10-3.6-1.8-7-5-7-10V6z"/><path d="M9 12l2 2 4-4.5"/>'),
    title: 'Proven, or folklore? Marked.',
    body: 'Not every “law” is real. Each entry is rated on a four-tier scale — from measured evidence to plain adage to actively disputed — so you always know whether you’re quoting a finding or a saying.' },
  { href: 'collections/', cta: 'Browse collections',
    icon: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    title: 'Curated collections',
    body: 'Hand-picked sets that cut across the index: the razors, why incentives backfire, laws every engineer learns. A place to start when you don’t yet have a name to search for.' },
  { href: 'credits/', cta: 'See the credits',
    icon: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.8"/><path d="M21 16l-5-5-4.5 4.5L9 13l-6 6"/>'),
    title: 'Real faces, real documents',
    // Counts come from the image manifest at build time (see `imagery` below),
    // because a hardcoded number here would be a lie the moment the harvest runs.
    body: (base, o) => `The people behind the laws, and the pages the laws first appeared on — ${o.people ? `${o.people} verified portraits and ${o.figures} diagrams, plots and manuscript scans` : 'verified portraits, diagrams, plots and manuscript scans'}, every one of them a public-domain or freely-licensed image from Wikimedia, matched to the right subject and <a href="${base}credits/">credited in full</a>. Nothing generated, nothing decorative.` },
  { href: 'laws/amdahls-law/', cta: 'Try a calculator',
    icon: svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
    title: 'Laws you can run the numbers on',
    body: (base) => `Where a law is arithmetic, you get the arithmetic. Move the sliders on <a href="${base}laws/amdahls-law/">Amdahl's Law</a> and watch the speed-up cap out; check what <a href="${base}laws/the-rule-of-72/">the Rule of 72</a> actually costs you; see why <a href="${base}laws/the-birthday-problem/">the Birthday Problem</a> feels wrong. Computed live from the law's own identity — nothing fitted, nothing predicted.` },
  { href: 'data/', cta: 'Download the data',
    icon: svg('<path d="M12 3v11"/><path d="M8 11l4 3 4-3"/><path d="M4 20h16"/>'),
    title: 'Sourced, and open',
    body: 'Every entry is traced to its origin and cited — nothing invented. The index metadata is free to download and build on under CC BY, in JSON and CSV. No ads, and no tracking of what you read.' },
  { href: 'coin/', cta: 'Coin a law',
    icon: svg('<path d="M20 4L9 15"/><path d="M20 4l-3 8-4 1-2-2 1-4z"/><path d="M9 15l-4 4"/>'),
    title: 'Coin your own',
    body: 'Noticed a pattern that has no name? Submit it. If it holds up, we publish it in the Coined wing — credited, clearly marked, with your name on it. Nobody else lets you do that.' },
];

/**
 * @param {object} o
 * @param {object} [o.imagery] {people, figures} counts from the image manifest,
 *   so the imagery block states a real number instead of a stale hardcoded one.
 */
export function featuresPage({ base = '/', origin = '', count, imagery = {} } = {}) {
  const nf = new Intl.NumberFormat('en');
  const ctx = { people: imagery.people ? nf.format(imagery.people) : 0, figures: imagery.figures ? nf.format(imagery.figures) : 0 };
  const blocks = FEATURES.map((f, i) => `      <div class="ftr" data-reveal="${i % 2 ? 'right' : 'left'}">
        <div class="ftr-icwrap">${f.icon}</div>
        <div class="ftr-body">
          <h2 class="ftr-t">${f.title}</h2>
          <p class="ftr-p">${typeof f.body === 'function' ? f.body(base, ctx) : f.body}</p>
          <a class="ftr-link" href="${base}${f.href}">${f.cta} <span aria-hidden="true">→</span></a>
        </div>
      </div>`).join('\n');

  const lawCount = count == null ? null : Number(String(count).replace(/[^0-9]/g, '')) || null;

  const answer = `The Law Tome is a free, ad-free encyclopedia of ${lawCount ? `${nf.format(lawCount)} ` : ''}named laws, principles and effects, with ${FEATURES.length} things a list of names cannot do: search by the situation rather than the name, a graph of how the ideas connect, the pairs that contradict each other, a reliability rating on every entry, side-by-side comparisons, live calculators, verified historical images, a downloadable open dataset, and a way to submit a law of your own.`;

  const lede = `Forty half-finished listicles will give you a name and a one-liner. This gives you the whole apparatus — search that meets you where you are, a graph of how the ideas connect, honest ratings, and the sources behind every claim. For the reasoning behind it, read <a href="${base}manifesto/">why we name a law</a>.`;

  const faq = hubFaq([
    {
      q: 'Is The Law Tome free?',
      a: `Yes — free to read, with no advertising, no account, and no tracking of what you read. The index metadata is also <a href="${base}data/">downloadable under CC BY</a> in JSON and CSV.`,
    },
    {
      q: 'How is this different from a list of laws?',
      a: `A list gives you names you already know. This one is browsable by <a href="${base}situations/">the situation you are in</a>, by <a href="${base}reliability/">how well established each law is</a>, by <a href="${base}timeline/">when it was coined</a> and by <a href="${base}named-after/">who it is named after</a>; it marks the pairs that <a href="${base}tension/">contradict each other</a>; and every entry cites its sources.`,
    },
    {
      q: 'Where does the content come from?',
      a: `Published sources, cited on each entry, with a primary source linked wherever one exists. Nothing is generated or guessed: where a date or an attribution is disputed, the entry says so, and where a claim is shaky it is rated <a href="${base}reliability/contested/">Contested</a>.`,
    },
    {
      q: 'Can I add a law?',
      a: `Yes. <a href="${base}coin/">Submit it</a>. If it holds up it is published in the Coined wing, clearly marked as coined rather than established, with your name on it.`,
    },
  ]);

  const section = `<section class="sec" id="features">
  <div class="wrap">
${hubHead({
    title: 'What The Law Tome does',
    sub: 'a tour',
    answer,
    lede,
    stats: [
      ...(lawCount ? [[nf.format(lawCount), 'laws']] : []),
      [FEATURES.length, 'things it does'],
      ...(imagery.people ? [[nf.format(imagery.people + imagery.figures), 'verified images']] : []),
    ],
    base,
  })}    <div class="ftr-list">
${blocks}
    </div>
    <div class="sec-more"><a class="ghost" href="${base}browse/"><i class="ti ti-arrow-right" aria-hidden="true"></i> Start browsing</a></div>
${faq.html}${hubNav('features/', { base })}  </div>
</section>
`;

  const description =
    'A tour of The Law Tome — search by the feeling, a relationship graph, laws in tension, reliability ratings, live calculators, verified historical images, an open dataset, and the power to coin your own.';

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'What The Law Tome does',
      url: `${origin}${base}features/`,
      description,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: FEATURES.length,
        itemListElement: FEATURES.map((f, i) => ({
          '@type': 'ListItem', position: i + 1, name: f.title, url: `${origin}${base}${f.href}`,
        })),
      },
    },
    // Breadcrumb only — the page itself is a WebPage, not a CollectionPage.
    ...hubJsonLd({ name: 'Features', description, path: 'features/', origin, base }).slice(1),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({ title: 'Features — What The Law Tome Does | The Law Tome', description, base, origin, path: 'features/', jsonld }) +
    sprite() +
    header({ base, active: 'features', count }) +
    section +
    footer({ base })
  );
}
