// Charts drawn from the corpus itself — the one kind of picture this project can
// make rather than find. Nothing here is illustrative: every bar is a count of
// real entries, computed at build time from the same data the pages render, so
// the numbers cannot drift from the index they describe.

import { escapeHtml } from './partials.mjs';
import { centuryLabelForYear, eraId } from './timeline.mjs';

const W = 720;

/** A horizontal bar chart. rows: [{label, n, href}] */
function barChart(rows, { title, note = '', base = '/' }) {
  const items = rows.filter((r) => r.n > 0);
  if (!items.length) return '';
  const max = Math.max(...items.map((r) => r.n));
  const rowH = 26;
  const H = items.length * rowH + 8;
  // wide enough for the longest field name — 'Physics & the physical world'
  // was being clipped to 's & the physical world' at 168
  const labelW = 224;
  const barW = W - labelW - 62;
  const bars = items.map((r, i) => {
    const y = i * rowH + 4;
    const w = Math.max(2, Math.round(barW * r.n / max));
    const bar = `<rect class="ch-bar" x="${labelW}" y="${y}" width="${w}" height="16" rx="2"/>`
      + `<text class="ch-n" x="${labelW + w + 8}" y="${y + 13}">${r.n.toLocaleString('en-US')}</text>`
      + `<text class="ch-lab" x="${labelW - 10}" y="${y + 13}" text-anchor="end">${escapeHtml(r.label)}</text>`;
    return r.href
      ? `<a href="${r.href}" class="ch-row">${bar}</a>`
      : `<g class="ch-row">${bar}</g>`;
  }).join('');
  return `      <figure class="chart">
        <figcaption class="chart-h">${escapeHtml(title)}</figcaption>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(title)}">${bars}</svg>
        ${note ? `<p class="chart-note">${note}</p>` : ''}
      </figure>`;
}

/**
 * Three views of the corpus: how reliable it is, when it was written, and what
 * it is about. Each bar links to the page listing exactly those laws, so the
 * chart is also a way in rather than a decoration.
 */
export function corpusCharts(laws = [], categories = {}, { base = '/' } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const count = (key) => {
    const m = new Map();
    for (const l of rows) {
      const k = key(l);
      if (k) m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  };

  const TIERS = ['Empirical', 'Heuristic', 'Folk-adage', 'Contested'];
  const tiers = count((l) => l.reliability);
  const tierRows = TIERS.map((t) => ({
    label: t, n: tiers.get(t) || 0,
    href: `${base}reliability/${t.toLowerCase()}/`,
  }));

  const eras = count((l) => centuryLabelForYear(l.coinedYear));
  const eraRows = [...eras.entries()]
    .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))
    .map(([label, n]) => ({ label, n, href: `${base}timeline/#${eraId(label)}` }));

  const cats = count((l) => l.category);
  const catRows = [...cats.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => ({ label: categories[k] || k, n, href: `${base}category/${encodeURIComponent(k)}/` }));

  return `    <div class="charts">
${barChart(tierRows, { title: 'How much of the index is actually proven', base,
    note: 'The scale the whole corpus is rated on. A named law is not the same thing as an established one, and the split is published rather than implied.' })}
${barChart(eraRows, { title: 'When these laws were named', base,
    note: 'By the century each was coined. Undated entries are omitted rather than guessed at.' })}
${barChart(catRows, { title: 'What the index is about', base,
    note: 'Every field, by number of entries. The shape of the collection, including where it is thin.' })}
    </div>
`;
}
