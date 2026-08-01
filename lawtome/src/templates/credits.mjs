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
import { hubHead, hubFaq, hubNav } from './hub.mjs';

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

  // The licence mix is worth stating rather than leaving to be counted: "public
  // domain plus some CC" and "mostly CC-BY-SA" are different obligations for
  // anyone reusing the set.
  const lic = new Map();
  for (const img of people) {
    const k = String(img.licence || 'Unstated');
    lic.set(k, (lic.get(k) || 0) + 1);
  }
  const licList = [...lic.entries()].sort((a, b) => b[1] - a[1]);
  // Commons writes the missing-creator case a dozen ways — "Unknown", "Unknown
  // author", "Unknown (Loescher & Petsch)" — so an equality test counted 423 of
  // 446 as credited when most of those rows say nothing of the kind.
  const credited = people.filter((i) => i.artist && !/^unknown\b/i.test(String(i.artist).trim())).length;

  const faq = hubFaq([
    {
      q: 'Is any of this AI-generated?',
      a: 'None of it. Every file is an existing photograph, engraving or painted portrait of the person it appears beside, fetched from Wikimedia Commons with its licence metadata intact. A generated likeness of a real person would be a fabricated fact with a face on it — the same thing this project refuses to do in prose.',
    },
    {
      q: 'How do you know the photo shows the right person?',
      a: `Each image is matched to its subject through the Commons file's own metadata and rejected when the filename or description does not clearly depict that person. The check is not perfect — several "portraits" that turned out to be magazine covers and group photographs were caught and removed — so the whole set is listed here with links to the originals. If one is wrong, <a href="${base}coin/">tell us</a>.`,
    },
    {
      q: 'Can I reuse these images?',
      // Fifteen distinct licence strings is too many to read as a sentence, so
      // name the ones that actually matter and count the tail.
      a: `Not under The Law Tome's own licence — each file keeps the terms it arrived with. ${licList.slice(0, 5).map(([k, v]) => `${v} ${escapeHtml(k)}`).join(', ')}${licList.length > 5 ? `, and ${licList.slice(5).reduce((n, [, v]) => n + v, 0)} under ${licList.length - 5} further licences` : ''}. Follow the link in the last column to the original file and honour whatever it says there.`,
    },
    {
      q: 'Why is the photographer "Unknown" on some rows?',
      a: 'Because the Commons record does not name one — usually a nineteenth-century photograph or engraving whose maker was never recorded. Stating "Unknown" is the honest entry; inventing a plausible name would be worse than the gap.',
    },
  ], { heading: 'About the imagery' });

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Image credits',
    sub: `${people.length} ${people.length === 1 ? 'image' : 'images'}`,
    answer: `Every one of the ${people.length} portraits on The Law Tome is a real photograph, engraving or painted likeness of the person it shows, taken from Wikimedia Commons — none is generated. This page lists all of them with the photographer or artist, the licence each file carries, and a link to the original so any of it can be checked.`,
    lede: `Attribution is the condition of using most of these files, not a courtesy. The inline credit beside each portrait satisfies it; this page makes the whole set auditable in one place. The same standard the <a href="${base}about/">corpus</a> is held to: nothing invented, everything traceable.`,
    stats: [[people.length, 'images'], [credited, 'with a named creator'], [licList.length, licList.length === 1 ? 'licence' : 'distinct licences']],
    crumbs: [['about/', 'About']],
    base,
  })}${body}
${faq.html}${hubNav('', { base })}  </div>
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
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}${base}about/` },
      { '@type': 'ListItem', position: 3, name: 'Image credits' },
    ],
  },
  ...(faq.jsonld ? [faq.jsonld] : [])];

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
