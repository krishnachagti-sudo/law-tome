// Dataset page (/data/) — the download + its terms.
//
// Offers the metadata dataset (JSON + CSV) and states plainly what it is and
// isn't: index metadata under CC BY, with the full explanations living on each
// law's page. The transparency is deliberate — it invites citation and reuse of
// the facts while making clear the written directory is the thing worth linking
// back to.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';
import { corpusCharts } from './charts.mjs';

export function dataPage({ base = '/', origin = '', count, generated, laws = [], categories = {} } = {}) {
  const n = count == null ? 'every' : (typeof count === 'number' ? count.toLocaleString('en-US') : String(count));
  const entryWord = (typeof count === 'number' && count === 1) ? 'entry' : 'entries';
  const section = `<section class="sec" id="data">
  <div class="wrap wrap-prose">
    <div class="sec-head">
      <h1>Download the dataset</h1>
      <span class="sub">CC BY 4.0</span>
    </div>
    <p class="sec-lede">The Law Tome's index as data — free to analyse, cite, and build on. Two formats, ${escapeHtml(n)} ${entryWord}, refreshed with every build.</p>

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
  </div>
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
    creator: { '@type': 'Organization', name: 'The Law Tome', url: `${origin}${base}` },
    ...(generated ? { dateModified: generated } : {}),
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${origin}${base}data/lawtome.json` },
      { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${origin}${base}data/lawtome.csv` },
    ],
  }];

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
