// Downloadable dataset (pure, no I/O) — deliberately METADATA ONLY.
//
// Moat note: the corpus's value is the original long-form writing (meaning,
// mechanism, examples, whyItMatters, working, limits, misreadings, origin). This
// dataset intentionally OMITS all of those, exposing only the index-level facts
// that make the corpus citable and analysable — identity, taxonomy, ratings,
// dates, the relationship graph, and the bibliography — each record linking back
// to its page for the full explanation. So a researcher gets a genuinely useful
// dataset, but nobody can reconstruct the finished, explained directory from it.

const CANONICAL_FIELDS = 'no, slug, name, aliases, category, reliability, statement, coinedYear, namedAfter, sameAs, sources, related (graph edges), url';

/** One metadata record for a law (no long-form prose). */
function record(l, baseUrl) {
  return {
    no: l.no,
    slug: l.slug,
    name: l.name,
    aliases: Array.isArray(l.aliases) ? l.aliases : [],
    category: l.category ?? null,
    reliability: l.reliability ?? null,
    statement: l.statement ?? null,
    coinedYear: l.coinedYear ?? null,
    namedAfter: l.namedAfter ?? null,
    sameAs: l.sameAs ?? null,
    sources: (Array.isArray(l.sources) ? l.sources : []).map((s) => ({ text: s.text ?? null, url: s.url ?? null, type: s.type ?? null })),
    related: (Array.isArray(l.related) ? l.related : []).map((r) => ({ slug: r.slug, kind: r.kind ?? null })),
    url: `${baseUrl}laws/${l.slug}/`,
  };
}

/**
 * Build the JSON dataset object: a licence/attribution header plus one metadata
 * record per law. `generated` is passed in (no Date.now in the build).
 */
export function buildDataset(laws = [], { baseUrl = '/', generated } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  return {
    meta: {
      name: 'The Law Tome',
      description: 'Index metadata for every named law, principle, and effect in The Law Tome. Metadata only — the full explanations live on each law\'s page (see each record\'s url).',
      fields: CANONICAL_FIELDS,
      url: baseUrl,
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      attribution: `The Law Tome — ${baseUrl}`,
      ...(generated ? { generated } : {}),
      count: rows.length,
    },
    laws: rows.map((l) => record(l, baseUrl)),
  };
}

/** Escape one CSV cell (RFC-4180: quote if it contains comma, quote, or newline). */
function csvCell(v) {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Flat CSV of the scalar metadata (no nested sources/relations) — a spreadsheet
 * view. RFC-4180 line endings.
 */
export function datasetCsv(laws = [], { baseUrl = '/' } = {}) {
  const header = ['no', 'slug', 'name', 'category', 'reliability', 'coinedYear', 'namedAfter', 'url'];
  const lines = [header.join(',')];
  for (const l of Array.isArray(laws) ? laws : []) {
    lines.push([
      l.no, l.slug, l.name, l.category, l.reliability,
      l.coinedYear ?? '', l.namedAfter ?? '', `${baseUrl}laws/${l.slug}/`,
    ].map(csvCell).join(','));
  }
  return lines.join('\r\n') + '\r\n';
}

/**
 * One record per entry, written beside its page as `laws/<slug>.json`.
 *
 * The site is already the most structured thing on this subject and it was only
 * readable as HTML. A stable per-entry JSON at a predictable URL is what makes
 * it citable by software — an agent, a notebook, somebody's side project —
 * without scraping a page and hoping the markup holds.
 *
 * Same moat as the bulk dataset: index-level facts only, no long-form prose.
 * The one addition is the relation graph in both directions and the entry's own
 * situation phrases, because those are the two things a consumer cannot rebuild
 * from the CSV and they are what make the record worth fetching.
 */
export function lawRecord(law, {
  baseUrl = '/', categories = {}, situations = [], inbound = [], generated,
} = {}) {
  const r = record(law, baseUrl);
  return {
    ...r,
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    categoryLabel: categories[law.category] || law.category || null,
    provenance: law.provenance ?? null,
    popularYear: law.popularYear ?? null,
    namesakeKind: law.namesakeKind ?? null,
    confusedWith: Array.isArray(law.confusedWith) ? law.confusedWith : [],
    // Who points AT this entry. The corpus stores relations one way per file;
    // a consumer reading one record cannot see the other direction at all.
    citedBy: inbound,
    situations,
    ...(generated ? { retrieved: generated } : {}),
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  };
}

/**
 * The index a machine reads first: what is here, where, and under what licence.
 * Deliberately small — every entry's own record is one fetch away.
 */
export function apiIndex(laws = [], { baseUrl = '/', generated } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  return {
    meta: {
      name: 'The Law Tome',
      description: 'Machine-readable index of every named law, principle and effect. One JSON record per entry at laws/<slug>.json; bulk metadata at data/lawtome.json.',
      url: baseUrl,
      count: rows.length,
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      attribution: `The Law Tome — ${baseUrl}`,
      ...(generated ? { generated } : {}),
      endpoints: {
        entry: `${baseUrl}laws/{slug}.json`,
        bulkJson: `${baseUrl}data/lawtome.json`,
        bulkCsv: `${baseUrl}data/lawtome.csv`,
        graph: `${baseUrl}graph.json`,
        search: `${baseUrl}search-index.json`,
      },
    },
    laws: rows.map((l) => ({ slug: l.slug, name: l.name, url: `${baseUrl}laws/${l.slug}/`, json: `${baseUrl}laws/${l.slug}.json` })),
  };
}
