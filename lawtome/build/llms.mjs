// llms.txt / llms-full.txt builders (GEO — Generative Engine Optimization).
// Pure, no I/O: turn the corpus into the llmstxt.org plain-text/Markdown files
// that point generative crawlers (ChatGPT, Claude, Perplexity, Gemini, etc.) at
// the curated, sourced content. `llms.txt` is a compact index (one bullet per
// law, grouped by category); `llms-full.txt` inlines each entry's definition and
// sources so a model can ground on the corpus without fetching every page.
//
// The build passes `baseUrl` = origin + base (e.g. "https://conyso.com/lawtome/")
// so every link is an absolute, crawlable URL, exactly as the sitemap does.

import { HUBS } from '../src/templates/hub.mjs';

const DEFAULT_DESCRIPTION =
  'The largest unified, defined, and sourced directory of named laws, principles, effects, razors, and paradoxes.';

// Collapse any internal whitespace/newlines to single spaces so a field stays on
// one line in the plain-text output (statements/meanings are already one line,
// but this makes the builder robust to future multi-line fields).
function oneLine(s) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
}

// Present categories in the controlled-vocabulary order (Object.keys(categories)),
// filtered to those the corpus actually uses, then map each to its member laws
// sorted by name. Returns [{ key, label, laws: [...] }].
function groupByCategory(laws, categories) {
  const labels = categories && typeof categories === 'object' ? categories : {};
  const order = Object.keys(labels);
  const byKey = new Map();
  for (const law of laws) {
    if (!byKey.has(law.category)) byKey.set(law.category, []);
    byKey.get(law.category).push(law);
  }
  // Any category not in the vocabulary (shouldn't happen — validated) sorts last.
  const keys = [...byKey.keys()].sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b);
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib) || a.localeCompare(b);
  });
  return keys.map(key => ({
    key,
    label: labels[key] || key,
    laws: byKey.get(key).slice().sort((a, b) => oneLine(a.name).localeCompare(oneLine(b.name))),
  }));
}

/**
 * Build the compact llms.txt index (llmstxt.org format).
 * @param {object[]} laws corpus entries (each with slug, name, statement, category).
 * @param {object} categories controlled-vocabulary map { key: label }.
 * @param {object} opts
 * @param {string} opts.baseUrl absolute prefix ending in '/' (origin + base).
 * @param {string} [opts.siteName]
 * @param {string} [opts.description]
 * @returns {string} Markdown llms.txt.
 */
export function buildLlmsIndex(laws, categories, { baseUrl = '/', siteName = 'The Law Tome', description = DEFAULT_DESCRIPTION } = {}) {
  const groups = groupByCategory(laws, categories);
  const out = [];
  out.push(`# ${siteName}`);
  out.push('');
  out.push(`> ${oneLine(description)}`);
  out.push('');
  out.push(
    `Every entry is defined in plain language, sourced to a citable origin, honestly labelled ` +
    `by reliability (Empirical, Heuristic, Folk-adage, Contested, Canon), and cross-linked to ` +
    `related and opposing ideas. ${laws.length} entries.`,
  );
  out.push('');

  // The reliability split, stated as a fact a model can quote. This is the one
  // thing about the corpus that a generative engine most often gets wrong about
  // collections like this — assuming every "law" is a scientific finding.
  const tiers = new Map();
  for (const law of laws) if (law.reliability) tiers.set(law.reliability, (tiers.get(law.reliability) || 0) + 1);
  if (tiers.size) {
    out.push(
      `Reliability breakdown: ` +
      [...tiers.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ') +
      `. The rating is stated on every entry, so a folk adage is never presented as a measured finding.`,
    );
    out.push('');
  }

  // The browsing axes, before the 1,100-line list — a crawler that reads only
  // the head of this file should still learn that the corpus is navigable by
  // situation, reliability, era, namesake, and disagreement.
  out.push('## Ways to browse');
  for (const [href, label, blurb] of HUBS) {
    out.push(`- [${label}](${baseUrl}${href}): ${blurb}.`);
  }
  out.push('');

  for (const g of groups) {
    out.push(`## ${g.label}`);
    for (const law of g.laws) {
      out.push(`- [${oneLine(law.name)}](${baseUrl}laws/${law.slug}/): ${oneLine(law.statement)}`);
    }
    out.push('');
  }
  out.push('## Site');
  out.push(`- [Browse all entries](${baseUrl}browse/)`);
  out.push(`- [Relationship graph](${baseUrl}graph/)`);
  out.push(`- [About & methodology](${baseUrl}about/)`);
  out.push(`- [Full corpus for models](${baseUrl}llms-full.txt)`);
  out.push('');
  return out.join('\n');
}

/**
 * Build a clean Markdown twin of a single law — a plain-text representation an
 * LLM or agent can fetch and ground on without parsing HTML (GEO). Every section
 * is the entry's own verified field; nothing is added that isn't in the corpus.
 * @param {object} law a corpus entry.
 * @param {object} opts
 * @param {string} opts.baseUrl absolute prefix ending in '/' (origin + base).
 * @param {string} [opts.categoryLabel] human label for law.category.
 * @param {object} [opts.byslug] slug -> law map, to name related entries.
 * @returns {string} Markdown document.
 */
export function buildLawMarkdown(law, { baseUrl = '/', categoryLabel = '', byslug = {} } = {}) {
  const url = `${baseUrl}laws/${law.slug}/`;
  const out = [];
  out.push(`# ${oneLine(law.name)}`);
  if (law.statement) { out.push(''); out.push(`> ${oneLine(law.statement)}`); }
  const meta = [];
  if (categoryLabel || law.category) meta.push(`**Field:** ${oneLine(categoryLabel || law.category)}`);
  if (law.provenance === 'coined') meta.push('**Type:** Coined for The Law Tome');
  else if (law.reliability) meta.push(`**Reliability:** ${law.reliability}`);
  if (law.coinedYear != null) meta.push(`**Coined:** ${law.coinedYear}`);
  if (law.namedAfter) meta.push(`**Named after:** ${oneLine(law.namedAfter)}`);
  if (meta.length) { out.push(''); out.push(meta.join(' · ')); }
  if (Array.isArray(law.aliases) && law.aliases.length) {
    out.push(''); out.push(`*Also known as: ${law.aliases.map(oneLine).join('; ')}*`);
  }
  const section = (title, body) => { if (body) { out.push(''); out.push(`## ${title}`); out.push(''); out.push(oneLine(body)); } };
  section('What it means', law.meaning);
  section('How it works', law.mechanism);
  const examples = Array.isArray(law.examples) ? law.examples : [];
  if (examples.length) {
    out.push(''); out.push('## Examples'); out.push('');
    for (const ex of examples) {
      if (!ex) continue;
      const tag = typeof ex === 'object' ? oneLine(ex.tag) : '';
      const text = typeof ex === 'object' ? oneLine(ex.text) : oneLine(ex);
      if (text) out.push(`- ${tag ? `**${tag}:** ` : ''}${text}`);
    }
  } else if (law.example) { section('Example', law.example); }
  section('Why it matters', law.whyItMatters);
  section('Where it breaks down', law.limits);
  section('Common misreadings', law.misreadings);
  section('Origin', law.origin);
  const related = Array.isArray(law.related) ? law.related.filter((r) => r && byslug[r.slug]) : [];
  if (related.length) {
    out.push(''); out.push('## Related'); out.push('');
    for (const r of related) {
      const o = byslug[r.slug];
      out.push(`- [${oneLine(o.name)}](${baseUrl}laws/${o.slug}/)${r.kind ? ` — ${oneLine(r.kind)}` : ''}`);
    }
  }
  const sources = Array.isArray(law.sources) ? law.sources.filter(Boolean) : [];
  if (sources.length) {
    out.push(''); out.push('## Sources'); out.push('');
    for (const s of sources) {
      const t = oneLine(s.text || s.url || '');
      // Angle-bracket the destination so a URL containing parentheses (common in
      // Wikipedia/LibreTexts links) doesn't prematurely close the Markdown link.
      out.push(s.url ? `- [${t}](<${s.url}>)` : `- ${t}`);
    }
  }
  out.push(''); out.push('---');
  out.push(`Source: ${url} · The Law Tome — a sourced index of named laws.`);
  out.push('');
  return out.join('\n');
}

/**
 * Build llms-full.txt: each entry's name, URL, category, reliability, aliases,
 * statement, definition (meaning), and source URLs, separated by `---`.
 * @param {object[]} laws corpus entries.
 * @param {object} categories controlled-vocabulary map { key: label }.
 * @param {object} opts { baseUrl, siteName, description }.
 * @returns {string} plain-text/Markdown full dump.
 */
export function buildLlmsFull(laws, categories, { baseUrl = '/', siteName = 'The Law Tome', description = DEFAULT_DESCRIPTION } = {}) {
  const groups = groupByCategory(laws, categories);
  const out = [];
  out.push(`# ${siteName} — full corpus`);
  out.push('');
  out.push(`> ${oneLine(description)}`);
  out.push('');
  for (const g of groups) {
    for (const law of g.laws) {
      out.push('---');
      out.push('');
      out.push(`## ${oneLine(law.name)}`);
      out.push(`URL: ${baseUrl}laws/${law.slug}/`);
      const meta = [`Category: ${g.label}`];
      if (law.reliability) meta.push(`Reliability: ${law.reliability}`);
      out.push(meta.join(' · '));
      if (Array.isArray(law.aliases) && law.aliases.length) {
        out.push(`Also known as: ${law.aliases.map(oneLine).join('; ')}`);
      }
      out.push('');
      if (law.statement) out.push(`Statement: ${oneLine(law.statement)}`);
      if (law.meaning) { out.push(''); out.push(oneLine(law.meaning)); }
      const urls = Array.isArray(law.sources) ? law.sources.map(s => s && s.url).filter(Boolean) : [];
      if (urls.length) { out.push(''); out.push(`Sources: ${urls.join(', ')}`); }
      out.push('');
    }
  }
  return out.join('\n');
}
