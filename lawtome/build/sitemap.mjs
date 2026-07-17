// Task 13 sitemap builder. Pure, no I/O: turns a list of base-relative page
// paths plus an absolute origin into a sitemaps.org 0.9 <urlset> document.
// The build passes `origin + base` as `origin` here (e.g.
// "https://conyso.com/lawtome/"), so each <loc> is the absolute crawlable URL.

// Minimal XML escape for <loc> text. URLs rarely carry `&`, `<`, `>`, `"`, `'`
// but a query/param could, and an unescaped `&` makes the document ill-formed.
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Build a sitemaps.org 0.9 sitemap XML string.
 * @param {string[]} paths base-relative page paths (e.g. 'laws/goodharts-law/',
 *   'browse/', '' for the home root). Each becomes an absolute <loc> = origin + path.
 * @param {string} origin absolute prefix already ending in '/' (origin + base).
 * @returns {string} well-formed sitemap XML.
 */
export function buildSitemap(paths, origin) {
  const urls = paths
    .map(p => `  <url><loc>${xmlEscape(origin + p)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
