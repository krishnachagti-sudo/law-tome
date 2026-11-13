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

/**
 * How many named laws were coined per decade (backlog B5), and when each field
 * did its naming.
 *
 * /timeline/ lists entries by era; this is the rate — a picture nobody else
 * can draw, because nobody else has a dated index of named laws. Every column
 * is a count of entries whose `coinedYear` falls in that decade. Entries with
 * no year are left out and counted in the note, not placed by guess.
 *
 * The right edge falls, and the note says why rather than letting it read as
 * a decline in naming: a name needs time to be taken up and written down
 * before an index like this one can find it, and the Ngram-era corpora this
 * draws on stop in 2019.
 */
export function decadeChart(laws = [], categories = {}, { base = '/' } = {}) {
  const dated = (Array.isArray(laws) ? laws : [])
    .map((l) => ({ l, y: Number(l.coinedYear) }))
    .filter((d) => Number.isFinite(d.y) && d.y > 0);
  if (dated.length < 10) return '';
  const undated = (Array.isArray(laws) ? laws.length : 0) - dated.length;
  const first = Math.floor(Math.min(...dated.map((d) => d.y)) / 10) * 10;
  const last = Math.floor(Math.max(...dated.map((d) => d.y)) / 10) * 10;
  const counts = new Map();
  for (let d = first; d <= last; d += 10) counts.set(d, 0);
  for (const d of dated) counts.set(Math.floor(d.y / 10) * 10, counts.get(Math.floor(d.y / 10) * 10) + 1);
  const cols = [...counts.entries()];
  const max = Math.max(...cols.map(([, n]) => n));
  const H = 190, top = 14, bottom = 26, left = 30;
  const colW = (W - left - 8) / cols.length;
  const plotH = H - top - bottom;
  const bars = cols.map(([dec, n], i) => {
    const h = n ? Math.max(2, Math.round((plotH * n) / max)) : 0;
    const x = left + i * colW;
    const y = top + plotH - h;
    const label = dec % 50 === 0 ? `<text class="ch-lab" x="${(x + colW / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${dec}</text>` : '';
    return `<g class="ch-row"><title>${dec}s: ${n} ${n === 1 ? 'law' : 'laws'} named</title>${h ? `<rect class="ch-bar" x="${(x + 1).toFixed(1)}" y="${y}" width="${Math.max(1, colW - 2).toFixed(1)}" height="${h}" rx="1"/>` : ''}</g>${label}`;
  }).join('');
  const axis = `<text class="ch-n" x="${left - 6}" y="${top + 9}" text-anchor="end">${max}</text><text class="ch-n" x="${left - 6}" y="${top + plotH}" text-anchor="end">0</text>`;
  const peak = cols.reduce((a, b) => (b[1] > a[1] ? b : a));

  // Per field: the median year and the busiest decade, biggest fields first.
  const byField = new Map();
  for (const d of dated) {
    const k = d.l.category || 'other';
    if (!byField.has(k)) byField.set(k, []);
    byField.get(k).push(d.y);
  }
  const rows = [...byField.entries()].filter(([, ys]) => ys.length >= 5)
    .map(([k, ys]) => {
      const s = ys.slice().sort((a, b) => a - b);
      const median = s[Math.floor((s.length - 1) / 2)];
      const dc = new Map();
      for (const y of s) dc.set(Math.floor(y / 10) * 10, (dc.get(Math.floor(y / 10) * 10) || 0) + 1);
      const busiest = [...dc.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
      return { k, n: s.length, median, busiest };
    })
    .sort((a, b) => a.median - b.median);
  const table = `        <table class="dec-t">
          <thead><tr><th>Field</th><th>Dated entries</th><th>Median year named</th><th>Busiest decade</th></tr></thead>
          <tbody>
${rows.map((r) => `            <tr><td><a href="${base}category/${escapeHtml(r.k)}/">${escapeHtml(categories[r.k] || r.k)}</a></td><td>${r.n}</td><td>${r.median}</td><td>${r.busiest[0]}s (${r.busiest[1]})</td></tr>`).join('\n')}
          </tbody>
        </table>`;

  return `      <figure class="chart chart--decades" id="per-decade">
        <figcaption class="chart-h">Named laws per decade, ${first}s to ${last}s</figcaption>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Named laws per decade, from ${first} to ${last + 9}. The busiest decade is the ${peak[0]}s, with ${peak[1]}.">${axis}${bars}</svg>
        <p class="chart-note">Each column counts the entries whose name was coined in that decade: ${dated.length.toLocaleString('en-US')} of them. ${undated.toLocaleString('en-US')} ${undated === 1 ? 'entry has' : 'entries have'} no year and ${undated === 1 ? 'is' : 'are'} left out rather than placed by guess. The busiest decade is the ${peak[0]}s, with ${peak[1]}. The fall at the right is not a decline in naming: a name needs years of use before an index can find it written down.</p>
      </figure>
      <h2 class="vd-h dec-h">When each field did its naming</h2>
      <p class="sec-lede dec-lede">Fields ordered from the oldest naming to the newest, by the median year their entries were named. Only fields with five or more dated entries.</p>
${table}
`;
}
