// Atom 1.0 feed of the most recently added entries. Pure, no I/O: turns the
// corpus into a feed.xml so readers, aggregators, and answer/generative engines
// can subscribe to what's new. Ordered by entry number (`no`) descending — the
// closest proxy the corpus has to "recently added" — and capped so the feed
// stays small. The build passes `baseUrl` = origin + base, mirroring the sitemap.

function xmlEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
// Numeric view of the `no` field (a zero-padded string like "095"); non-numeric
// sorts last so a malformed value never throws or jumps to the top.
const numNo = l => { const n = parseInt(String(l && l.no), 10); return Number.isFinite(n) ? n : -1; };

/**
 * Build an Atom 1.0 feed document.
 * @param {object[]} laws corpus entries (slug, name, statement/meaning, no).
 * @param {object} opts
 * @param {string} opts.baseUrl absolute prefix ending in '/' (origin + base).
 * @param {string} [opts.siteName]
 * @param {string} [opts.updated] ISO timestamp for <updated> (feed + entries).
 * @param {number} [opts.limit] max entries (default 50).
 * @returns {string} Atom XML.
 */
export function buildFeed(laws, {
  baseUrl = '/', siteName = 'The Law Tome', updated, limit = 50,
  // A feed is identified by its self link, so a per-field feed MUST declare its
  // own path — twenty feeds all claiming to be /feed.xml is one feed as far as a
  // reader is concerned, and the last one wins.
  path = 'feed.xml',
  title = `${siteName} — latest entries`,
  subtitle = 'Named laws, principles, effects, razors, and paradoxes — defined and sourced.',
  link,
} = {}) {
  const selfHref = `${baseUrl}${path}`;
  const homeHref = link || baseUrl;
  const stamp = updated || '1970-01-01T00:00:00Z';
  const recent = [...laws].sort((a, b) => numNo(b) - numNo(a)).slice(0, limit);
  const entries = recent.map((l) => {
    const url = `${baseUrl}laws/${l.slug}/`;
    const summary = l.statement || l.meaning || '';
    return `  <entry>
    <title>${xmlEscape(l.name)}</title>
    <link href="${xmlEscape(url)}"/>
    <id>${xmlEscape(url)}</id>
    <updated>${xmlEscape(stamp)}</updated>
    <summary>${xmlEscape(summary)}</summary>
  </entry>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlEscape(title)}</title>
  <subtitle>${xmlEscape(subtitle)}</subtitle>
  <link href="${xmlEscape(homeHref)}"/>
  <link rel="self" href="${xmlEscape(selfHref)}"/>
  <id>${xmlEscape(selfHref)}</id>
  <updated>${xmlEscape(stamp)}</updated>
${entries}
</feed>
`;
}
