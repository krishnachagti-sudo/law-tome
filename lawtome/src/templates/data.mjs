// Dataset page (/data/) — the download + its terms.
//
// Offers the metadata dataset (JSON + CSV) and states plainly what it is and
// isn't: index metadata under CC BY, with the full explanations living on each
// law's page. The transparency is deliberate — it invites citation and reuse of
// the facts while making clear the written directory is the thing worth linking
// back to.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';
import { corpusCharts } from './charts.mjs';
import { hubHead, hubFaq, hubNav } from './hub.mjs';

export function dataPage({ base = '/', origin = '', count, generated, laws = [], categories = {} } = {}) {
  const n = count == null ? 'every' : (typeof count === 'number' ? count.toLocaleString('en-US') : String(count));
  const entryWord = (typeof count === 'number' && count === 1) ? 'entry' : 'entries';
  const fields = Object.keys(categories || {}).length;

  const faq = hubFaq([
    {
      q: 'Can I use this dataset commercially?',
      a: 'Yes. It is <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a>, which permits commercial use, redistribution and derivative works. The single condition is attribution: credit The Law Tome and link back to it.',
    },
    {
      q: 'What is the difference between the JSON and the CSV?',
      a: 'Same entries, different shapes. The JSON keeps the nested structure — aliases, the relationship-graph edges and the full source list per entry — plus a <code>meta</code> block with the licence and the build date. The CSV flattens each entry to one row of scalar columns, which loses the lists but drops straight into a spreadsheet.',
    },
    {
      q: 'How current is it?',
      a: `Both files are regenerated from the corpus on every build, so they cannot drift from the site${generated ? `. This copy was generated ${escapeHtml(String(generated).slice(0, 10))}` : ''}. The charts below are computed from the same data at the same moment, which is why they can never disagree with the download.`,
    },
    {
      q: 'Why is the writing not in the download?',
      a: `Because the explanations are the work, and a copy of them detached from its sources is exactly the unsourced listicle this project exists to replace. Every record carries the canonical URL of its entry, where the meaning, mechanism, examples, limits and citations live. Take the metadata; <a href="${base}browse/">link people to the page</a>.`,
    },
    {
      q: 'How should I cite it?',
      a: `“The Law Tome — index metadata” (${escapeHtml(origin + base)}data/), CC BY 4.0${generated ? `, retrieved ${escapeHtml(String(generated).slice(0, 10))}` : ''}. Machine-readable licence terms are in the JSON's <code>meta</code> block and in this page's <code>Dataset</code> structured data.`,
    },
  ], { heading: 'Questions about the data' });

  const section = `<section class="sec" id="data">
  <div class="wrap wrap-prose">
${hubHead({
    title: 'Download the dataset',
    sub: 'CC BY 4.0',
    answer: `The Law Tome publishes its whole index as an open dataset — ${escapeHtml(n)} ${entryWord} of named laws with their categories, reliability ratings, dates, namesakes, relationship edges and citations — in JSON and CSV under CC BY 4.0, free to analyse, cite and build on.`,
    lede: `The download is metadata: everything that makes the index an index. The long-form writing stays on each entry's page, and every record carries the URL to it.`,
    stats: [[n, entryWord], [fields || '—', 'fields'], ['3', 'formats'], ['CC BY 4.0', 'licence']],
    crumbs: [['about/', 'About']],
    base,
  })}

    <div class="dl-row">
      <a class="dl-card" href="${base}data/lawtome.json" download>
        <span class="dl-fmt">JSON</span>
        <span class="dl-desc">Full metadata: identity, taxonomy, ratings, dates, the relationship graph, and every citation.</span>
      </a>
      <a class="dl-card" href="${base}data/lawtome.csv" download>
        <span class="dl-fmt">CSV</span>
        <span class="dl-desc">A flat spreadsheet: number, name, category, reliability, year, namesake, and canonical URL.</span>
      </a>
      <a class="dl-card" href="${base}llms-full.txt">
        <span class="dl-fmt">llms.txt</span>
        <span class="dl-desc">Plain-text for language models — every entry's statement, definition, and sources in one file.</span>
      </a>
    </div>
    <p class="data-note">Built for generative engines: a compact <a href="${base}llms.txt">llms.txt</a> index and the full <a href="${base}llms-full.txt">llms-full.txt</a> corpus, following the <a href="https://llmstxt.org/" rel="nofollow">llmstxt.org</a> convention.</p>

    <h2 class="data-h2">The shape of the corpus</h2>
    <p>Three views of the same data you can download, computed from it at build time — so these bars and the file can never disagree. Every bar links to the laws it counts.</p>
${corpusCharts(laws, categories, { base })}
    <h2 class="data-h2">What's in it</h2>
    <p>For each law: its number, slug, name and aliases, category, reliability rating, one-line statement, the year it was coined and who it's named after, its <a href="${base}graph/">relationship-graph</a> edges, its sources, and a link to its page.</p>

    <h2 class="data-h2">What's not</h2>
    <p>The dataset is <b>metadata only</b>. The long-form writing — what each law means, how it works, its examples, where it breaks down, and its origin — isn't in the download. That work lives on each entry's page, and every record carries the URL to it. If you're building something, link people to the source.</p>

    <h2 class="data-h2">Licence</h2>
    <p>Released under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">Creative Commons Attribution 4.0</a>. Use it however you like — including commercially — as long as you credit <b>The Law Tome</b> (${escapeHtml(origin + base)}) and link back. Machine-readable terms are in the JSON's <code>meta</code> block.</p>
${faq.html}${hubNav('', { base })}  </div>
</section>
`;

  const description =
    'Download The Law Tome as data — a CC BY 4.0 dataset of index metadata (names, categories, reliability ratings, dates, the relationship graph, and citations) in JSON and CSV.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'The Law Tome — index metadata',
    description,
    url: `${origin}${base}data/`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    // Self-contained, with an @id. The sibling property's 53 Dataset items are
    // all invalid in Search Console for exactly this: creator was a bare @id
    // reference to a node defined in a different script block, which Google
    // does not reliably resolve. Publisher is a recommended field and was
    // simply absent.
    creator: {
      '@type': 'Organization',
      '@id': `${origin}${base}#organization`,
      name: 'The Law Tome',
      url: `${origin}${base}`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${origin}${base}#organization`,
      name: 'The Law Tome',
      url: `${origin}${base}`,
    },
    isAccessibleForFree: true,
    // The whole corpus is the coverage, stated so a dataset index can size it
    // without downloading.
    ...(count ? { size: `${count} entries` } : {}),
    keywords: 'named laws, principles, effects, razors, paradoxes, heuristics, reliability ratings',
    ...(generated ? { dateModified: generated } : {}),
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${origin}${base}data/lawtome.json` },
      { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${origin}${base}data/lawtome.csv` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}${base}about/` },
      { '@type': 'ListItem', position: 3, name: 'Download the dataset' },
    ],
  },
  ...(faq.jsonld ? [faq.jsonld] : [])];

  return (
    head({
      title: 'Download the Dataset — Named Laws in JSON & CSV (CC BY) | The Law Tome',
      description,
      base,
      origin,
      path: 'data/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}
