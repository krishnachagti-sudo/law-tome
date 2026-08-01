// Image credits (/credits/) — every photograph and engraving on the site, with
// its author, its licence and a link to the original.
//
// This page is not decoration. Most of these files are CC-BY or CC-BY-SA, and
// attribution is the CONDITION of using them: the inline credit beside each
// portrait satisfies it, and this page makes the whole set auditable in one
// place — anyone can check that a face we show is the face the source shows.
// Nothing here is generated imagery; see build/fetch-images.py for how each
// image is matched to its subject and how the licence is checked.

import { head, sprite, header, footer, escapeHtml, portrait } from './partials.mjs';

export function creditsPage(images = {}, { base = '/', origin = '', count } = {}) {
  // One row per FILE, not per namesake: the corpus spells a few people two ways
  // ("Adolf Fick" and "Adolf Eugen Fick"), which resolves to the same Commons
  // file, and crediting it twice would just pad the list.
  const seen = new Set();
  const people = Object.values((images && images.people) || {})
    .filter((img) => { const k = img.file || img.slug; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => String(a.person).localeCompare(String(b.person), 'en'));

  const row = (img) => {
    const licence = img.licenceUrl
      ? `<a href="${escapeHtml(img.licenceUrl)}" rel="license">${escapeHtml(img.licence)}</a>`
      : escapeHtml(img.licence);
    const src = img.source
      ? `<a href="${escapeHtml(img.source)}">Commons&nbsp;file</a>`
      : 'Wikimedia Commons';
    return `      <div class="cr-row">
        <span class="cr-face">${portrait(img, { base, small: true, alt: img.person })}</span>
        <span class="cr-who">${escapeHtml(img.person)}</span>
        <span class="cr-by">${escapeHtml(img.artist || 'Unknown')}</span>
        <span class="cr-lic">${licence}</span>
        <span class="cr-src">${src}</span>
      </div>`;
  };

  const body = people.length
    ? `    <div class="cr-list">
      <div class="cr-row cr-head" aria-hidden="true">
        <span class="cr-face"></span><span class="cr-who">Subject</span>
        <span class="cr-by">Photographer / artist</span><span class="cr-lic">Licence</span>
        <span class="cr-src">Original</span>
      </div>
${people.map(row).join('\n')}
    </div>`
    : '<div class="empty">No images yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Image credits</h1>
      <span class="sub">${people.length} ${people.length === 1 ? 'image' : 'images'}</span>
    </div>
    <p class="sec-lede">Every image on this site is a real photograph, engraving or portrait of the person it shows — sourced from <a href="https://commons.wikimedia.org/">Wikimedia Commons</a>, never generated. Each one is either in the public domain or published under a Creative Commons licence, and each is listed here with the person who made it, the licence it carries, and a link to the original file so you can check it yourself. The same standard the <a href="${base}about/">corpus</a> is held to: nothing invented, everything traceable.</p>
${body}
  </div>
</section>
`;

  const description =
    'Credits for every image in The Law Tome — the photographer or artist, the licence, and a link to the original file on Wikimedia Commons. All real, none generated.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Image credits',
    url: `${origin}${base}credits/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({
      title: 'Image Credits — Sources & Licences | The Law Tome',
      description,
      base,
      origin,
      path: 'credits/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}
