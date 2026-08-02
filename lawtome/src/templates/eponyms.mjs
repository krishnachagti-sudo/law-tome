// Eponym index (/named-after/) — browse laws by the person they're named after.
//
// A reference index: one row per namesake, their law(s) linked. People with more
// than one law are featured up top (the interesting clusters — "Parkinson's
// laws"), then the full A–Z. Built from eponymGroups; nothing invented.

import { head, sprite, header, footer, escapeHtml, personImage, portrait } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

/**
 * Stable anchor id for a namesake ("W. Edwards Deming" -> "ep-w-edwards-deming").
 * Exported so a law page can deep-link its "Named after" tile straight at the
 * person's row here, instead of dropping the reader at the top of a 900-name index.
 */
/**
 * The name this person files under, A–Z: their surname, accent-folded.
 *
 * Two subtleties, both learned from the rendered page.
 *  - A joint namesake ("Paul Menzerath and Gabriel Altmann") files under the
 *    FIRST person, because the law is Menzerath's Law and a reader looking for
 *    it will look under M, not under Altmann.
 *  - This is the single source of truth for the ordering, the letter headings
 *    and the initial in the avatar. They were derived separately and disagreed:
 *    the list grouped by surname while the avatar showed the forename's letter,
 *    so section A was full of circles reading M, G and P.
 *
 * @returns {string} lowercase, accent-folded surname ('' if there is no name).
 */
export function surnameKey(person) {
  const first = String(person || '').trim().split(/\s+(?:and|&|with)\s+|,\s*/i)[0] || '';
  const parts = first.trim().split(/\s+/);
  return (parts[parts.length - 1] || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** The A–Z bucket for a namesake: their surname's initial, or '#'. */
export function surnameInitial(person) {
  const c = surnameKey(person).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

/**
 * The monogram for a namesake with no portrait: "Mary Ainsworth" -> "MA".
 *
 * Two earlier attempts were both wrong. The forename's initial contradicted
 * the section the row sits in — section A full of circles reading M, G, P.
 * The surname's initial agreed with the section and therefore said nothing:
 * a column of identical A's next to the letter A. A monogram carries the one
 * piece of information a placeholder can honestly carry, which is who the row
 * is about, and it varies down the column so the eye can use it.
 */
export function monogram(person) {
  const one = String(person || '').trim().split(/\s+(?:and|&|with)\s+|,\s*/i)[0] || '';
  const parts = one.split(/\s+/).filter(Boolean);
  const letter = (w) => (w || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase();
  const first = letter(parts[0]);
  const last = parts.length > 1 ? letter(parts[parts.length - 1]) : '';
  return (first + last) || '·';
}

export function personId(person) {
  return 'ep-' + String(person || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function eponymsPage(groups = [], { base = '/', origin = '', count, images, namesakeHrefs = {} } = {}) {
  const rows = Array.isArray(groups) ? groups : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  const lawLinks = (laws) => laws
    .map((l) => `<a href="${permalink(l.slug)}">${escapeHtml(l.name)}</a>`)
    .join('<span class="ep-dot">·</span>');

  // The A–Z pass carries the person anchor (`anchored`); the featured block repeats
  // the same people higher up, so it renders id-less to keep every id unique.
  // A verified portrait where we have one (see build/fetch-images.py); people we
  // could not confirm keep a plain initial, so the column stays aligned and the
  // page never implies we know a face we do not.
  const avatar = (person) => {
    const img = personImage(images, person);
    if (img) return portrait(img, { base, small: true, alt: person });
    // A monogram, not a single letter — see monogram() for why both earlier
    // versions of this were useless.
    return `<span class="ep-initial" aria-hidden="true">${escapeHtml(monogram(person))}</span>`;
  };

  // Most namesakes are people; a handful are a factory, a casino, a gospel, a
  // character in a novel. They belong in this index — the law really is named
  // after them — but the row should say so rather than let the page's own
  // "the person who lent it" framing quietly misdescribe them.
  // [tag on the row, phrase for the tooltip] — "named after a fictional" is
  // not a sentence, so the two are not the same string.
  const KIND_LABEL = {
    group: ['group', 'a group of people'],
    place: ['place', 'a place'],
    work: ['work', 'a published work'],
    fictional: ['fictional', 'a fictional character'],
    event: ['event', 'a historical event'],
    animal: ['animal', 'an animal'],
  };
  const kindTag = (g) => {
    const l = g.kind && g.kind !== 'person' && KIND_LABEL[g.kind];
    return l ? `<span class="ep-kind" title="Not a person: this law is named after ${escapeHtml(l[1])}">${escapeHtml(l[0])}</span>` : '';
  };

  // A namesake with several laws has a page of their own; one with a single law
  // does not, because that page would restate the law under a second URL. So the
  // name is a link exactly when there is somewhere for it to go.
  const pname = (g) => {
    const href = namesakeHrefs[g.person];
    const inner = `${escapeHtml(g.person)}${kindTag(g)}${g.laws.length > 1 ? `<span class="ep-badge">${g.laws.length}</span>` : ''}`;
    return href
      ? `<a class="ep-pname ep-pname--link" href="${escapeHtml(href)}">${inner}</a>`
      : `<span class="ep-pname">${inner}</span>`;
  };

  const row = (g, anchored) => `      <div class="ep-row"${anchored ? ` id="${escapeHtml(personId(g.person))}"` : ''}>
        <span class="ep-person">${avatar(g.person)}${pname(g)}</span>
        <span class="ep-laws">${lawLinks(g.laws)}</span>
      </div>`;

  const multi = rows.filter((g) => g.laws.length > 1);
  const featured = multi.length
    ? `    <h2 class="ep-h2">Namesakes with more than one law</h2>
    <div class="ep-list">
${multi.slice().sort((a, b) => b.laws.length - a.laws.length || a.person.localeCompare(b.person, 'en')).map((g) => row(g, false)).join('\n')}
    </div>
`
    : '';

  // Surname initial — shared with the avatar and with the build's A–Z sort,
  // so the three cannot disagree (see surnameKey).
  const initial = surnameInitial;

  // A–Z, grouped by surname initial with an id anchor per letter. rows arrive
  // surname-sorted, so a single pass emits a heading whenever the initial changes.
  let alpha = '';
  const present = new Set();
  if (rows.length) {
    let cur = null;
    for (const g of rows) {
      const ltr = initial(g.person);
      present.add(ltr);
      if (ltr !== cur) {
        if (cur !== null) alpha += '\n    </div>';
        alpha += `\n    <h3 class="ep-letter" id="az-${ltr === '#' ? 'sym' : ltr}">${ltr === '#' ? '#' : ltr}</h3>\n    <div class="ep-list">`;
        cur = ltr;
      }
      alpha += '\n' + row(g, true);
    }
    alpha += '\n    </div>';
  }

  // Jump-bar: every A–Z letter plus '#', letters with no namesake shown inert so
  // the row never reflows between pages.
  const alphabet = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const jump = rows.length
    ? `    <nav class="az-nav" aria-label="Jump to letter">
${alphabet.map((L) => {
        const id = L === '#' ? 'sym' : L;
        return present.has(L)
          ? `      <a href="#az-${id}">${L}</a>`
          : `      <span aria-hidden="true">${L}</span>`;
      }).join('\n')}
    </nav>
`
    : '';

  const all = rows.length
    ? `    <h2 class="ep-h2" id="az">Every namesake, A–Z</h2>
${jump}${alpha}`
    : '<div class="empty">No named laws yet.</div>';

  const eponymCount = rows.reduce((n, g) => n + g.laws.length, 0);
  const notPeople = rows.filter((g) => g.kind && g.kind !== 'person');
  const withFace = rows.filter((g) => personImage(images, g.person)).length;
  const top = multi.slice().sort((a, b) => b.laws.length - a.laws.length || a.person.localeCompare(b.person, 'en'));

  const answer = rows.length
    ? `${eponymCount} of the named laws in The Law Tome carry a namesake's name, across ${rows.length} namesakes. ${multi.length} of them have more than one law to their credit${top.length ? `, led by ${top.slice(0, 3).map((g) => `${escapeHtml(g.person)} (${g.laws.length})`).join(', ')}` : ''}.${notPeople.length ? ` ${notPeople.length} are not people at all — a factory, a casino, a gospel, a character in a novel — and are tagged as such.` : ''}`
    : 'Named laws gathered under the person each is named after.';

  const lede = `Every law that carries a name, filed under whoever — or whatever — lent it. Useful when you remember the surname but not which of their laws you meant. Two caveats the page marks rather than hides: being the namesake is not the same as being the discoverer, and plenty of these people got the credit second-hand; and not every namesake is a person${notPeople.length ? `, so the ${notPeople.length} that are a place, a group, a work or a fictional character carry a tag` : ''}.${withFace ? ` ${withFace} of the ${rows.length} have a verified public-domain or freely-licensed portrait here; the rest keep a plain initial rather than a stand-in face.` : ''}`;

  const faq = hubFaq([
    {
      q: 'How many named laws are named after a person?',
      a: `${eponymCount} entries carry a namesake, across ${rows.length} distinct namesakes${notPeople.length ? `, of which ${rows.length - notPeople.length} are people and ${notPeople.length} are not — ${notPeople.slice(0, 4).map((g) => `${escapeHtml(g.person)} (${escapeHtml(g.kind)})`).join(', ')}` : ''}. The rest of the index is named for a phenomenon, or nothing in particular.`,
    },
    {
      q: 'Who has the most laws named after them?',
      a: top.length
        ? `${top.slice(0, 5).map((g) => `<a href="#${escapeHtml(personId(g.person))}">${escapeHtml(g.person)}</a> (${g.laws.length})`).join(', ')}. ${multi.length} people have more than one.`
        : 'Every namesake here has exactly one.',
    },
    {
      q: 'Does the namesake always mean the discoverer?',
      a: 'No — and this is common enough to have its own name. A law often gets attached to whoever popularised it or wrote the memorable version, not whoever did the work first. Where that happened, the law\'s own page says so.',
    },
    ...(withFace ? [{
      q: 'Where do the portraits come from?',
      a: `Wikimedia Commons and Wikidata, restricted to public-domain and freely-licensed images, and matched to the right person before use. Every one is credited on <a href="${base}credits/">the credits page</a>. ${rows.length - withFace} namesakes have no confirmed portrait and show an initial instead.`,
    }] : []),
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Laws by their namesake',
    sub: `${rows.length} ${rows.length === 1 ? 'person' : 'people'}`,
    answer,
    lede,
    stats: [
      [rows.length, 'namesakes'],
      [eponymCount, 'eponymous laws'],
      [multi.length, 'with more than one'],
      ...(withFace ? [[withFace, 'with a portrait']] : []),
    ],
    base,
  })}${featured}${all}
${faq.html}${hubNav('named-after/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `${eponymCount} named laws gathered under the ${rows.length} people they are named after — from the one-law figures to the ${multi.length} thinkers with several to their name.`
    : 'Browse named laws by the person behind them — every principle, effect, and razor gathered under its namesake.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Laws by their namesake',
      description,
      path: 'named-after/',
      items: top.slice(0, 100).map((g) => ({ name: `${g.person} (${g.laws.length} laws)` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Named Laws by Their Namesake — The Eponym Index | The Law Tome',
      description,
      base,
      origin,
      path: 'named-after/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
