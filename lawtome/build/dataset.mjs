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
