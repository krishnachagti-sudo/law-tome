// When did this page actually change? (pure, no I/O)
//
// The old answer was "today", on every page, on every build. `buildSitemap`
// took one date and wrote it into all 1,785 <lastmod> elements, and the law
// template put the same date in `dateModified` and `datePublished`. The comment
// in partials.mjs defended it: the corpus carries no per-entry authoring date
// and the whole site is regenerated each deploy, so the build date was "the only
// honest answer".
//
// It was the only CHEAP answer. It was not honest, and it was not even inert.
// Google's documentation is explicit that it uses <lastmod> "if it's
// consistently and verifiably (for example by comparing to the last modification
// of the page) accurate" — so a value that claims 1,116 untouched entries all
// changed this morning is not a missing signal, it is a signal that teaches
// Google to discard the field. A sitemap with no <lastmod> at all would have
// been strictly better than what we were shipping.
//
// The real answer is available and always was: a page changed when its rendered
// bytes changed. Hash the render, keep the hash in a committed manifest, and
// only move the date when the hash moves.
//
// The one trick that makes it work in a single pass:
//
//   The date is part of the page. `article:modified_time` and `dateModified`
//   are rendered into the HTML, so hashing the finished page would fold today's
//   date into the hash, every page would differ from yesterday, and the whole
//   scheme would reproduce the bug it exists to fix. So the page is rendered
//   with a TOKEN where the date goes, hashed with the hole still in it, and only
//   stamped with a real date once that date has been decided. The hash is
//   therefore a function of the content alone, which is the only thing it should
//   ever have depended on.

import { createHash } from 'node:crypto';

/**
 * Rendered in place of the date, replaced after hashing.
 *
 * Deliberately not a valid date, and deliberately ugly: if this ever escapes to
 * a published page it should be obvious in a screenshot and greppable in the
 * output, rather than quietly parsing as something.
 */
export const LASTMOD_TOKEN = '@@LASTMOD@@';

/**
 * The committed manifest. Inside src/ rather than beside the output, because
 * dist/ is gitignored and CI builds from a clean checkout — a manifest that did
 * not travel in git would be empty on every CI run and every page would look
 * new, which is the original bug wearing a hash.
 */
export const manifestFile = 'src/data/lastmod.json';

/**
 * Content fingerprint of one rendered page, with the date still a hole in it.
 *
 * `prefixes` are site-location strings — the absolute origin+base, and the base
 * on its own — replaced with a placeholder before hashing.
 *
 * This is not cosmetic. Every page carries its canonical URL, its Open Graph
 * URL, and several hundred hrefs, so the rendered bytes differ between a build
 * for `https://x.github.io/law-tome/` and one for `https://conyso.com/lawtome/`.
 * Without normalisation the manifest is only valid for the one origin it was
 * generated against: a manifest committed from a local build would mismatch
 * every page in CI, CI would date the whole site every deploy, and CI does not
 * commit its own manifest — so it would mismatch again the next time, forever.
 * The feature would look implemented and do nothing, which is worse than the
 * bug it replaces because it also looks fixed.
 *
 * Normalising means the manifest describes the CONTENT, which is what "did this
 * page change" was always asking about, and it survives moving the site.
 */
/**
 * The hash rule's own version, stored in the manifest.
 *
 * A change to what gets normalised changes every hash, which without a
 * migration would redate the whole site once — the same false signal this file
 * exists to stop, paid one time instead of every time. `resolve` uses this to
 * recognise a manifest written under the previous rule and re-hash it in place,
 * keeping the dates. Bump it whenever pageHash's normalisation changes, and add
 * the old behaviour to `legacyHash` below.
 */
export const HASH_VERSION = 2;

/**
 * A page's hash under version 1: origin normalised, asset fingerprints not.
 * Only ever used to recognise an old manifest entry as unchanged. Once every
 * committed manifest carries version 2 this can go, and nothing breaks if it
 * goes early — the cost is one redating.
 */
function legacyHash(html, prefixes) {
  return pageHash(html, prefixes, { assets: false });
}

export function pageHash(html, prefixes = [], { assets = true } = {}) {
  let s = String(html);
  // Each prefix appears in two forms, and missing the second one is not a
  // rounding error. Share links carry the page's own URL percent-encoded as a
  // query parameter - https%3A%2F%2Fhost%2Fbase%2F... - and this site has a
  // share row on every page. Normalising only the plain form left 1,798 of 2,969
  // pages still origin-dependent, which is most of the site, and it presented as
  // a subtler bug than it was: the count fell instead of reaching zero.
  const forms = [...prefixes]
    .filter(Boolean)
    .flatMap((p) => [p, encodeURIComponent(p)])
    // Longest first: an origin+base must be consumed before the base alone, or
    // the origin is left behind as a fragment and normalisation is partial.
    .sort((a, b) => b.length - a.length);
  for (const p of forms) s = s.split(p).join(' SITE ');
  // Asset cache-busting fingerprints, out for the same reason as the origin:
  // they are not content. Every page links the stylesheet as `styles.css?v=<hash
  // of the stylesheet>`, so one CSS edit moved the rendered bytes of all 2,969
  // pages and redated 1,116 untouched entries to the day of the restyle. That is
  // the bug at the top of this file wearing a different hat — a sitemap
  // claiming the whole corpus changed this morning is the value Google is
  // documented as discarding, whether the cause is today's date or today's
  // stylesheet. A page whose prose, markup and links are identical did not
  // change because its styling did.
  if (assets) s = s.replace(/\?v=[0-9a-f]{6,}/gi, '?v= ASSET ');
  return createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16);
}

/** Fill the hole. A page without one is returned untouched. */
export function stamp(html, date) {
  return String(html).split(LASTMOD_TOKEN).join(date);
}

/**
 * Decide a date for every page, and produce the manifest to commit.
 *
 * Three cases, and the middle one is the whole point:
 *
 *   - hash matches what we published last time  → keep that date. The page did
 *     not change, and saying it did is the defect.
 *   - hash differs                              → today. It really did change.
 *   - never seen before                         → today. First publication.
 *
 * A missing or malformed manifest degrades to "everything is new" rather than
 * throwing. That is the correct failure: it is no worse than the behaviour this
 * replaces, and a broken manifest must never be able to fail a deploy.
 *
 * @param {Record<string,string>} pages base-relative path -> rendered HTML (tokens intact)
 * A manifest written under an older hash rule (no `v`, or a lower one) is
 * migrated rather than discarded — see `legacy` below.
 *
 * @param {{v?:number, pages?:Record<string,{hash:string,date:string}>}} [prev] the committed manifest
 * @param {string} today ISO date
 * @param {string[]} [prefixes] site-location strings to normalise out — see pageHash
 * @returns {{dates:Record<string,string>, manifest:object, changed:string[]}}
 */
export function resolve(pages = {}, prev, today, prefixes = []) {
  const old = (prev && typeof prev.pages === 'object' && prev.pages) || {};
  const dates = {};
  const next = {};
  const changed = [];

  // A manifest written under an older hash rule. Its hashes cannot match the
  // current ones for any page, changed or not, so taken at face value it would
  // date the entire site to today and publish the lie this file exists to stop.
  // Instead each page is also hashed the old way, and a page that matches THAT
  // keeps its date while the manifest records the new hash. One build migrates
  // the file; nothing is redated that did not change.
  const legacy = old && Object.keys(old).length
    && Number(prev && prev.v) !== HASH_VERSION;

  // Sorted so the committed file has a stable diff. A manifest that reorders
  // itself on every build is a 1,785-line diff nobody will ever read, which is
  // how a committed artefact stops being reviewed.
  for (const path of Object.keys(pages).sort()) {
    const hash = pageHash(pages[path], prefixes);
    const before = old[path];
    const matches = before
      && (before.hash === hash
        || (legacy && before.hash === legacyHash(pages[path], prefixes)));
    const unchanged = matches && before.date;
    const date = unchanged ? before.date : today;
    if (!unchanged) changed.push(path);
    dates[path] = date;
    next[path] = { hash, date };
  }
  // Deleted paths simply do not carry over; the manifest describes what was
  // published this time, not everything ever published.
  // `v` first so the rule version is the first line of the committed file
  // rather than buried under 1,236 lines of hashes.
  return { dates, manifest: { v: HASH_VERSION, pages: next }, changed };
}
