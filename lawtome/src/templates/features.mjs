// Features / product tour (/features/) — the full showcase of what the site does,
// one URL to link and rank. Each capability gets a block with copy and a "try it"
// link into the real feature. Inline SVG icons (the icon font is a tiny subset).

import { head, sprite, header, footer } from './partials.mjs';

const svg = (inner) => `<svg class="ftr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const FEATURES = [
  { href: 'situations/', cta: 'Describe a situation',
    icon: svg('<path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><circle cx="10.5" cy="10" r="2"/><path d="M13.4 12.9l1.8 1.8"/>'),
    title: 'Search by the feeling, not the name',
    body: 'The hardest part of a named law is remembering it exists. Type what’s happening — “we hit the target but the product got worse” — and the search lands you on the law that names it, even when you can’t. A curated situation map backs it up for the common cases.' },
  { href: 'graph/', cta: 'Open the graph',
    icon: svg('<circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M7 11l10-4M7 13l10 4"/>'),
    title: 'A graph, not a flat list',
    body: 'Every law links to the ones it echoes, causes, or contradicts. Start anywhere and walk the web — Goodhart to Campbell to the Cobra Effect to Streisand. The connective tissue no A–Z can give you.' },
  { href: 'tension/', cta: 'See the tensions',
    icon: svg('<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><path d="M8.3 6H13l3.5 6-3.5 6H8.3"/><path d="M12 12h6"/>'),
    title: 'The laws that disagree',
    body: 'Principles don’t all point the same way. We surface the pairs in tension — where one law’s advice is another’s warning — so you can weigh both instead of quoting whichever you remember.' },
  { href: 'reliability/', cta: 'Browse by reliability',
    icon: svg('<path d="M12 3l7 3v5c0 5-3.4 8.2-7 10-3.6-1.8-7-5-7-10V6z"/><path d="M9 12l2 2 4-4.5"/>'),
    title: 'Proven, or folklore? Marked.',
    body: 'Not every “law” is real. Each entry is rated on a four-tier scale — from measured evidence to plain adage to actively disputed — so you always know whether you’re quoting a finding or a saying.' },
  { href: 'collections/', cta: 'Browse collections',
    icon: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    title: 'Curated collections',
    body: 'Hand-picked sets that cut across the index: the razors, why incentives backfire, laws every engineer learns. A place to start when you don’t yet have a name to search for.' },
  { href: 'data/', cta: 'Download the data',
    icon: svg('<path d="M12 3v11"/><path d="M8 11l4 3 4-3"/><path d="M4 20h16"/>'),
    title: 'Sourced, and open',
    body: 'Every entry is traced to its origin and cited — nothing invented. The index metadata is free to download and build on under CC BY, in JSON and CSV. No ads, and no tracking of what you read.' },
  { href: 'coin/', cta: 'Coin a law',
    icon: svg('<path d="M20 4L9 15"/><path d="M20 4l-3 8-4 1-2-2 1-4z"/><path d="M9 15l-4 4"/>'),
    title: 'Coin your own',
    body: 'Noticed a pattern that has no name? Submit it. If it holds up, we publish it in the Coined wing — credited, clearly marked, with your name on it. Nobody else lets you do that.' },
];

export function featuresPage({ base = '/', origin = '', count } = {}) {
  const blocks = FEATURES.map((f) => `      <div class="ftr">
        <div class="ftr-icwrap">${f.icon}</div>
        <div class="ftr-body">
          <h2 class="ftr-t">${f.title}</h2>
          <p class="ftr-p">${f.body}</p>
          <a class="ftr-link" href="${base}${f.href}">${f.cta} <span aria-hidden="true">→</span></a>
        </div>
      </div>`).join('\n');

  const section = `<section class="sec" id="features">
  <div class="wrap">
    <div class="sec-head">
      <h1>What The Law Tome does</h1>
      <span class="sub">a tour</span>
    </div>
    <p class="sec-lede">Forty half-finished listicles will give you a name and a one-liner. This gives you the whole apparatus — search that meets you where you are, a graph of how the ideas connect, honest ratings, and the sources behind every claim.</p>
    <div class="ftr-list">
${blocks}
    </div>
    <div class="sec-more"><a class="ghost" href="${base}browse/"><i class="ti ti-arrow-right" aria-hidden="true"></i> Start browsing</a></div>
  </div>
</section>
`;

  const description =
    'A tour of The Law Tome — search by the feeling, a relationship graph, laws in tension, reliability ratings, curated collections, an open dataset, and the power to coin your own.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'What The Law Tome does',
    url: `${origin}${base}features/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({ title: 'Features — What The Law Tome Does | The Law Tome', description, base, origin, path: 'features/', jsonld }) +
    sprite() +
    header({ base, active: 'features', count }) +
    section +
    footer({ base })
  );
}
