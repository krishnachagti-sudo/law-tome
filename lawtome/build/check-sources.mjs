// Source-resolution lint (static, no network). Backs the anti-fabrication
// promise — "the cited source must actually exist and support the claim" — by
// catching sources that are truly unsourced or malformed. A source counts as
// sourced if it carries EITHER a well-formed URL OR a substantive bibliographic
// citation in `text` (author/work/year), because a proper print citation is a
// real, checkable source even without a free link. Missing-URL-but-cited cases
// are a soft enrichment backlog, surfaced only under { requireUrl: true }; an
// optional online pass can later verify each URL actually resolves.

const URL_RE = /^https?:\/\/[^\s"<>]+$/;
const MIN_CITATION = 12; // chars of text that count as a real citation

/**
 * Lint the sources of a corpus. Returns HARD problems by default.
 * @param {object[]} laws corpus entries.
 * @param {object} [opts]
 * @param {boolean} [opts.requireUrl=false] also flag sources that are cited in
 *   text but carry no URL (the enrichment backlog).
 * @param {boolean} [opts.requirePrimaryForCanon=false] flag Canon-tier /
 *   provenance:canon entries that cite no primary source (a stricter policy).
 * @returns {string[]} problems, empty when clean.
 */
export function checkSources(laws, { requireUrl = false, requirePrimaryForCanon = false } = {}) {
  const problems = [];
  for (const l of Array.isArray(laws) ? laws : []) {
    const where = l && l.slug ? l.slug : '(unknown)';
    const sources = Array.isArray(l && l.sources) ? l.sources : [];
    if (sources.length === 0) { problems.push(`${where}: no sources`); continue; }
    let hasPrimary = false;
    sources.forEach((s, i) => {
      const at = `${where}: source[${i}]`;
      if (!s || typeof s !== 'object') { problems.push(`${at} is not an object`); return; }
      const hasUrl = s.url != null && String(s.url).trim() !== '';
      const hasText = s.text != null && String(s.text).trim().length >= MIN_CITATION;
      if (hasUrl && !URL_RE.test(String(s.url).trim())) problems.push(`${at} has a malformed url: ${s.url}`);
      if (!hasUrl && !hasText) problems.push(`${at} is unsourced (no url and no citation text)`);
      if (requireUrl && !hasUrl) problems.push(`${at} has no url (cited in text only)`);
      if (s.type !== 'primary' && s.type !== 'secondary') problems.push(`${at} has invalid type: ${s.type}`);
      if (s.type === 'primary') hasPrimary = true;
    });
    if (l.sameAs != null && !URL_RE.test(String(l.sameAs).trim())) problems.push(`${where}: malformed sameAs: ${l.sameAs}`);
    if (requirePrimaryForCanon && (l.reliability === 'Canon' || l.provenance === 'canon') && !hasPrimary) {
      problems.push(`${where}: Canon entry with no primary source`);
    }
  }
  return problems;
}
