// Three reference pages built from data the corpus already holds:
// /equations/, /pronunciation/ and /sources/.
//
// Each was per-entry data with no collected form. A reader who wants "the named
// laws that are actual equations" had to open a thousand pages to find the
// ninety-seven; a reader who wants to know how to say "Semmelweis" out loud had
// to already know which law he lent his name to; and the bibliography — the one
// part of this project that can be independently checked — was not published at
// all, only scattered a citation at a time.

import { head, sprite, header, footer, escapeHtml, listFilter, personSlug } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/* ---------------------------------------------------------------- equations */

export function equationsPage(rows = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const total = rows.length;
  const fields = (() => {
    const m = new Map();
    for (const r of rows) if (r.law.category) m.set(r.law.category, (m.get(r.law.category) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  })();

  const item = (r) => `      <a class="eq-row" data-filter-row href="${base}laws/${escapeHtml(r.law.slug)}/">
        <img class="eq-img" src="${base}assets/img/formula/${escapeHtml(r.law.slug)}.svg" alt="${escapeHtml(r.tex)}" loading="lazy" decoding="async">
        <span class="eq-meta"><span class="eq-name">${escapeHtml(r.law.name)}</span><code class="eq-tex">${escapeHtml(r.tex)}</code></span>
      </a>`;

  const answer = `${num(total)} of the named laws in The Law Tome are stated as an equation, and this page renders all of them${fields.length ? `, led by ${escapeHtml(categories[fields[0][0]] || fields[0][0])} with ${fields[0][1]}` : ''}. Each formula is the one recorded on that entry's Wikidata item — read off, not derived here.`;

  const lede = 'Most named laws are sentences. These are the ones that are also mathematics, collected so the shape of a field is visible in one scroll. Every formula links the entry it belongs to, where it is explained in words; the LaTeX under each is exactly the string the image was rendered from, so it can be copied and checked.';

  const faq = hubFaq([
    {
      q: 'Which named laws are actual equations?',
      a: `${num(total)} of them: ${rows.slice(0, 8).map((r) => `<a href="${base}laws/${escapeHtml(r.law.slug)}/">${escapeHtml(r.law.name)}</a>`).join(', ')}${total > 8 ? `, and ${num(total - 8)} more, all above` : ''}.`,
    },
    {
      q: 'Where do the formulas come from?',
      a: 'From each idea\'s Wikidata item (the "defining formula" property), rendered here as an image with the source LaTeX kept beside it. None of them was typed out from memory or reconstructed from prose.',
    },
    {
      q: 'Why do so few entries have one?',
      a: `Because most of these ideas are not quantitative, and the ones that are do not all have a formula recorded. An entry with no recorded formula shows none, rather than a plausible-looking equation we assembled.`,
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'The laws that are equations',
    sub: `${num(total)} formulas`,
    answer,
    lede,
    stats: [[num(total), 'formulas'], [fields.length, 'fields'], ['Wikidata', 'the source']],
    base,
  })}${listFilter({ target: 'eq-list', label: `Filter ${num(total)} formulas`, placeholder: 'Filter by name or symbol…', noun: 'formulas' })}    <div class="eq-list" id="eq-list">
${rows.map(item).join('\n')}
    </div>
${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `${num(total)} named laws written as equations — every defining formula in the index, rendered, with the entry that explains it.`;
  const jsonld = [
    ...hubJsonLd({ name: 'The laws that are equations', description, path: 'equations/', items: rows.slice(0, 100).map((r) => ({ name: r.law.name })), origin, base }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];
  return head({ title: `Named Laws as Equations — ${num(total)} Formulas | The Law Tome`, description, base, origin, path: 'equations/', jsonld })
    + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/* ------------------------------------------------------------ pronunciation */

export function pronunciationPage(rows = [], { base = '/', origin = '', count } = {}) {
  const total = rows.length;
  const laws = rows.reduce((n, r) => n + r.laws.length, 0);

  const item = (r) => {
    const src = `${base}assets/audio/${escapeHtml(r.slug)}${escapeHtml(r.audio.ext || '.ogg')}`;
    return `      <div class="pr-row" data-filter-row>
        <button class="pron-btn" type="button" data-audio="${src}" aria-label="Hear ${escapeHtml(r.person)} pronounced">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
          <span>Say it</span>
        </button>
        <span class="pr-who">${escapeHtml(r.person)}</span>
        <span class="pr-laws">${r.laws.map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join('<span class="ep-dot">·</span>')}</span>
        <span class="pr-credit">${escapeHtml(r.audio.artist || 'Unknown')} · ${escapeHtml(r.audio.licence || '')}${r.audio.source ? ` · <a href="${escapeHtml(r.audio.source)}">source</a>` : ''}</span>
      </div>`;
  };

  const answer = `${num(total)} of the people with a named law to their credit have a recorded pronunciation here, covering ${num(laws)} entries — press play beside a name to hear it said. Every clip is a freely-licensed recording from Wikimedia Commons, credited to the speaker who made it.`;

  const lede = 'These names get mangled constantly, mostly by people who have only ever read them. A clip is only listed where the recording is of that name — not of a similar word, and not synthesised — so the guide is short rather than complete. Where no verified recording exists, the name simply is not here.';

  const faq = hubFaq([
    { q: 'How do you pronounce these names?', a: `Press the button beside any of the ${num(total)} names above and you will hear a recording of it. The clips come from Wikimedia Commons under free licences, and each names its speaker.` },
    { q: 'Are these recordings made by the people themselves?', a: 'No. They are recordings made by volunteer speakers and published under a free licence, which is what makes them republishable here. Each one credits whoever recorded it.' },
    { q: 'Why are some names missing?', a: 'A clip is accepted only when the word spoken is the name itself. That rejects a great many near-misses, and it is why this list is a few hundred names rather than a thousand — a recording of the wrong word would be worse than silence.' },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'How to say these names',
    sub: `${num(total)} names`,
    answer,
    lede,
    stats: [[num(total), 'recorded names'], [num(laws), 'entries covered'], ['Commons', 'the source']],
    base,
  })}${listFilter({ target: 'pr-list', label: `Filter ${num(total)} names`, placeholder: 'Filter by person or law…', noun: 'names' })}    <div class="pr-list" id="pr-list">
${rows.map(item).join('\n')}
    </div>
${faq.html}${hubNav('named-after/', { base })}  </div>
</section>
`;

  const description = `Hear ${num(total)} of the names behind the named laws said out loud — freely-licensed recordings from Wikimedia Commons, each linked to the entries it belongs to.`;
  const jsonld = [
    ...hubJsonLd({ name: 'How to say these names', description, path: 'pronunciation/', items: rows.slice(0, 100).map((r) => ({ name: r.person })), origin, base }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];
  return head({ title: `How to Pronounce the Named Laws — ${num(total)} Recordings | The Law Tome`, description, base, origin, path: 'pronunciation/', jsonld })
    + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/* ------------------------------------------------------------- bibliography */

export function sourcesPage(bib, { base = '/', origin = '', count, total: corpusTotal } = {}) {
  const domains = bib.domains;
  const top = domains.slice(0, 3);

  const item = (d) => `      <div class="sr-row" data-filter-row>
        <span class="sr-host"><a href="https://${escapeHtml(d.host)}/" rel="nofollow noopener">${escapeHtml(d.host)}</a></span>
        <span class="sr-n">${num(d.n)} ${d.n === 1 ? 'citation' : 'citations'}</span>
        <span class="sr-laws">${d.laws.slice(0, 6).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join('<span class="ep-dot">·</span>')}${d.laws.length > 6 ? `<span class="sr-more">and ${num(d.laws.length - 6)} more</span>` : ''}</span>
      </div>`;

  // "1,101 of its 1,101 entries" is a sentence no editor would pass; when the
  // coverage is total, say that instead.
  const coverage = corpusTotal && bib.cited >= corpusTotal
    ? `covering every one of its ${num(corpusTotal)} entries`
    : `covering ${num(bib.cited)}${corpusTotal ? ` of its ${num(corpusTotal)}` : ''} entries`;
  const answer = `The Law Tome cites ${num(bib.sources)} sources across ${num(domains.length)} domains, ${coverage}${top.length ? ` — most often ${top.map((d) => `${d.host} (${num(d.n)})`).join(', ')}` : ''}. This page is the whole bibliography, by where the citations point.`;

  const lede = 'Publishing this is the point. An index of a thousand ideas is worth exactly as much as its sources, and the honest way to say so is to show them — including the concentration at the top, which is the fair criticism of any reference work assembled this way. Every domain below links out, and every entry that cites it links back.';

  const faq = hubFaq([
    { q: 'What does The Law Tome cite?', a: `${num(bib.sources)} sources across ${num(domains.length)} domains. The largest are ${top.map((d) => `${d.host} (${num(d.n)})`).join(', ')}; the full ranked list is above, and every entry's own page lists its own sources.` },
    { q: 'How many entries are sourced?', a: `${corpusTotal && bib.cited >= corpusTotal ? `All ${num(corpusTotal)}` : `${num(bib.cited)}${corpusTotal ? ` of ${num(corpusTotal)}` : ''}`}. An entry that claims a real, published origin must carry at least one source or the build refuses to ship it; the exceptions are the reader-coined entries, which cite their submitter instead.` },
    { q: 'Is a Wikipedia citation good enough?', a: 'For "this idea exists, is called this, and is described this way", it is a reasonable starting point and it is checkable, which is the test that matters here. Where a claim is contested, dated, or attributed to a specific paper, the entry cites that paper too. The concentration above is a real limitation of this project and is stated rather than hidden.' },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'What this index cites',
    sub: `${num(domains.length)} domains`,
    answer,
    lede,
    stats: [[num(bib.sources), 'citations'], [num(domains.length), 'domains'], [num(bib.cited), 'entries sourced']],
    base,
  })}${listFilter({ target: 'sr-list', label: `Filter ${num(domains.length)} domains`, placeholder: 'Filter by domain or law…', noun: 'domains' })}    <div class="sr-list" id="sr-list">
${domains.map(item).join('\n')}
    </div>
${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `The complete bibliography of The Law Tome — ${num(bib.sources)} citations across ${num(domains.length)} domains, ranked, each linked to the entries that rely on it.`;
  const jsonld = [
    ...hubJsonLd({ name: 'What this index cites', description, path: 'sources/', items: domains.slice(0, 100).map((d) => ({ name: `${d.host} (${d.n})` })), origin, base }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];
  return head({ title: `The Bibliography — ${num(bib.sources)} Citations Across ${num(domains.length)} Domains | The Law Tome`, description, base, origin, path: 'sources/', jsonld })
    + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

export { personSlug };
