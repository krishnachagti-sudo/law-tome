// Three collections the corpus already holds and never showed as collections
// (pure, no I/O): the equations, the recorded pronunciations, and the
// bibliography.
//
// Each of these is real, verified, per-entry data that only ever appeared one
// item at a time, two thirds of the way down a law page. Ninety-seven formulas
// is a reference table. Two hundred and twenty-two spoken names is a
// pronunciation guide. Two thousand-odd citations across three hundred domains
// is a bibliography — and publishing the bibliography is the strongest claim
// this project can make about itself, because it is the part that can be
// checked.

import { personSlug } from '../src/templates/partials.mjs';

/** Laws with a recorded defining formula, alphabetical. */
export function equations(laws = [], facts = {}) {
  const out = [];
  for (const l of (Array.isArray(laws) ? laws : [])) {
    const f = facts && facts[l.slug];
    if (!f || !f.formula || !f.formula.tex) continue;
    out.push({ law: l, tex: f.formula.tex, source: f.formula.source || '' });
  }
  return out.sort((a, b) => String(a.law.name).localeCompare(String(b.law.name), 'en'));
}

/**
 * Namesakes with a spoken recording, and the laws that carry their name.
 *
 * Keyed off the laws rather than off the audio manifest, because a clip for
 * somebody no longer in the corpus is a clip with nothing to pronounce.
 */
export function pronunciations(laws = [], facts = {}) {
  const people = (facts && facts._people) || {};
  const seen = new Map();
  for (const l of (Array.isArray(laws) ? laws : [])) {
    if (!l || !l.namedAfter) continue;
    // The same gate the law page applies: an explicit `person`, not merely the
    // absence of a contrary kind. Without it the page offered to pronounce "A
    // misspelling of Murphy" — Muphry's Law's namesake is a joke, not a man,
    // and the clip attached to it says "Murphy". Absent means unknown here, and
    // an unknown namesake is not something to put a voice to.
    if (l.namesakeKind !== 'person') continue;
    const slug = personSlug(l.namedAfter);
    const rec = people[slug];
    if (!rec || !rec.audio || !rec.audio.file) continue;
    if (!seen.has(slug)) {
      seen.set(slug, { slug, person: rec.person || l.namedAfter, audio: rec.audio, laws: [] });
    }
    seen.get(slug).laws.push(l);
  }
  return [...seen.values()]
    .sort((a, b) => String(a.person).localeCompare(String(b.person), 'en'));
}

/** The host of a URL, without the www, or '' if it will not parse. */
export function hostOf(url) {
  try {
    return new URL(String(url)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * The bibliography, folded by domain.
 *
 * @returns {{sources: number, cited: number, domains: {host:string, n:number,
 *   laws:object[]}[]}} `cited` is how many entries cite at least one source.
 */
export function bibliography(laws = []) {
  const byHost = new Map();
  let sources = 0;
  let cited = 0;
  for (const l of (Array.isArray(laws) ? laws : [])) {
    const rows = Array.isArray(l.sources) ? l.sources : [];
    if (rows.length) cited++;
    for (const s of rows) {
      sources++;
      const host = hostOf(s && s.url);
      if (!host) continue;
      if (!byHost.has(host)) byHost.set(host, { host, n: 0, laws: [] });
      const e = byHost.get(host);
      e.n++;
      // One entry per law per domain: eleven citations to Wikipedia from one
      // page is one page's worth of reliance on Wikipedia, not eleven.
      if (e.laws[e.laws.length - 1] !== l) e.laws.push(l);
    }
  }
  return {
    sources,
    cited,
    domains: [...byHost.values()].sort((a, b) => b.n - a.n || a.host.localeCompare(b.host)),
  };
}
