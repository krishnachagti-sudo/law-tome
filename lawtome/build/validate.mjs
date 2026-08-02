// Mechanical enforcement of the corpus's anti-fabrication guarantees. Every rule
// here is one of the seven "rules that fail the build" documented in
// docs/CORPUS-SCHEMA.md — the citation-gate, cross-reference closure, and the
// coined-can't-fake-a-namedAfter guard are load-bearing, not style advice.
// validateCorpus returns a flat array of human-readable error strings; the Task 8
// build throws when it is non-empty, so a corpus that violates any rule never
// ships a page.
const RELIABILITY = new Set(['Empirical', 'Heuristic', 'Folk-adage', 'Contested']);
const PROVENANCE = new Set(['canon', 'coined']);
// What kind of thing a law is named after. Most are people, but not all: the
// Hawthorne Effect is named for a factory, the Red Queen Hypothesis for a
// character in a novel, the Matthew Effect for a gospel. Pages that speak about
// the namesake — a pronunciation button, a birthplace map, an index whose lede
// says "the person who lent it" — need to know which, and inferring it from the
// shape of the string does not work ("The Hawthorne Works" reads as a name).
// Established per namesake from Wikidata P31 by build/fetch-namesake-kind.py.
// ABSENT MEANS UNKNOWN, NOT PERSON: an entry whose namesake could not be
// resolved carries no field, and callers must not read that silence as a claim.
const NAMESAKE_KIND = new Set(['person', 'group', 'place', 'work', 'fictional', 'event', 'animal']);

/** Fold a name or alias for comparison: drop a leading article, keep letters. */
function aliasKey(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}
// `example` is handled separately below: an entry satisfies it with either the
// singular `example` string or a non-empty `examples[]` array (the richer form).
const REQUIRED = ['no','slug','name','statement','meaning','origin','category','reliability','provenance'];

// Rule 1 (filename === slug) is checked against the on-disk filename, which the
// parsed JSON object does not carry. loadCorpus records the source filename stem
// under this Symbol so validateCorpus can enforce the rule. A non-enumerable
// Symbol keeps it out of JSON.stringify (symbols never serialize), object
// spreads and Object.keys (non-enumerable) — the search index, graph data and
// home's inline featured JSON all serialize law objects downstream, and none of
// them must ever see this bookkeeping field.
export const SOURCE_FILE = Symbol('sourceFile');

export function validateCorpus(laws, categories) {
  // `known` excludes falsy slugs so a dangling ref can't spuriously "resolve"
  // against an entry that is itself missing its slug (which already errors).
  const errs = [], slugs = new Set(), nos = new Set(), names = new Set(), known = new Set(laws.map(l => l.slug).filter(Boolean));
  // Every display name, seeded before the alias pass so an alias colliding with
  // another entry's NAME is caught too — "Cantor's Theorem" listing "Cantor's
  // diagonal argument", which is a different entry's name, not another name for
  // this one. Leading articles are folded: "The Original Position" and "Original
  // position" are the same claim on the same words.
  const aliasOwner = new Map();
  for (const l of laws) {
    if (l && l.name) aliasOwner.set(aliasKey(l.name), l.slug || l.name);
  }
  for (const l of laws) {
    const id = l.slug || l.name || '(unknown)';
    for (const f of REQUIRED) if (!l[f]) errs.push(`${id}: missing required field "${f}"`);
    // Name uniqueness (case-insensitive): two entries sharing a display name are a
    // duplicate concept — two competing pages for one law. Slug/no uniqueness alone
    // doesn't catch it (the "Iron Law of Oligarchy" / "Graham's Law" duplicates).
    if (l.name) {
      const nk = l.name.trim().toLowerCase();
      if (names.has(nk)) errs.push(`duplicate name "${l.name}"`);
      names.add(nk);
    }
    // …and the same across ALIASES, which the name check alone missed for years.
    // The corpus grew in waves and a later wave rewrote an entry an earlier one
    // already had, under the other of its two usual names: "The Giffen Paradox"
    // and "The Giffen Good" were two pages, each listing the other's name as its
    // alias, rated Contested and Empirical, citing the same two sources. An
    // alias is a claim that this entry is ALSO called X; if two entries claim
    // one name, at most one of them is right, so this is an error either way —
    // a duplicate to merge, or an alias to take off the entry it does not
    // belong to. `aliasOwner` is filled after the loop, over all entries.
    for (const a of (Array.isArray(l.aliases) ? l.aliases : [])) {
      if (typeof a !== 'string' || !a.trim()) continue;
      const ak = aliasKey(a);
      if (!ak) continue;
      const prev = aliasOwner.get(ak);
      if (prev && prev !== id) errs.push(`name/alias "${a}" is claimed by both ${prev} and ${id}`);
      else aliasOwner.set(ak, id);
    }
    // At least one worked example, in either the legacy `example` string or the
    // richer `examples[]` array.
    if (!l.example && !(Array.isArray(l.examples) && l.examples.length))
      errs.push(`${id}: missing required field "example"`);
    if (l.slug && slugs.has(l.slug)) errs.push(`duplicate slug "${l.slug}"`);
    if (l.slug) slugs.add(l.slug);
    // Rule 6: `no` must be unique across the corpus.
    if (l.no && nos.has(l.no)) errs.push(`duplicate no "${l.no}"`);
    if (l.no) nos.add(l.no);
    // Object.hasOwn, not `categories[l.category]`: a bracket lookup walks the
    // prototype chain, so keys like "constructor"/"toString" would falsely pass.
    if (l.category && !Object.hasOwn(categories, l.category)) errs.push(`${id}: category "${l.category}" not in controlled vocabulary`);
    if (l.reliability && !RELIABILITY.has(l.reliability)) errs.push(`${id}: reliability "${l.reliability}" invalid`);
    if (l.provenance && !PROVENANCE.has(l.provenance)) errs.push(`${id}: provenance "${l.provenance}" invalid`);
    if (l.provenance === 'canon' && (!Array.isArray(l.sources) || l.sources.length === 0))
      errs.push(`${id}: canon entry must have at least one source`);
    if (l.namesakeKind && !NAMESAKE_KIND.has(l.namesakeKind))
      errs.push(`${id}: namesakeKind "${l.namesakeKind}" invalid`);
    // A kind with nothing to qualify is a stray: it would claim a namesake the
    // entry does not have.
    if (l.namesakeKind && !l.namedAfter)
      errs.push(`${id}: namesakeKind set without namedAfter`);
    if (l.provenance === 'coined' && l.namedAfter)
      errs.push(`${id}: coined entry must not assert a real-person namedAfter without verification`);
    // Rule 3: statementAccent, when present, must be an EXACT substring of
    // statement. The page template wraps the accent by verbatim string match, so
    // a curly-vs-straight apostrophe or en-dash-vs-hyphen slip makes the accent
    // silently vanish. Deliberately no normalization here — the exact check is
    // the point. Optional field: a missing accent is fine.
    if (l.statementAccent && l.statement && !l.statement.includes(l.statementAccent))
      errs.push(`${id}: statementAccent "${l.statementAccent}" is not a verbatim substring of statement`);
    // Rule 1: filename stem must equal slug. Only enforced when loadCorpus
    // supplied the stem; in-memory callers that omit it skip this check.
    const file = l[SOURCE_FILE];
    if (file && l.slug && file !== l.slug)
      errs.push(`${id}: filename "${file}.json" does not match slug "${l.slug}"`);
    // Rule 2: closure. Every related/confusedWith slug must resolve to a corpus entry.
    for (const r of l.related || []) if (!known.has(r.slug)) errs.push(`${id}: related reference "${r.slug}" does not resolve`);
    for (const s of l.confusedWith || []) if (!known.has(s)) errs.push(`${id}: confusedWith reference "${s}" does not resolve`);
    // Rule 3: source/sameAs URLs must be http(s). A `javascript:`/`data:` URL
    // would render as an execute-on-click link on the law page; reject at build.
    for (const s of l.sources || []) {
      if (s && s.url != null && String(s.url).trim() !== '' && !/^https?:\/\//i.test(String(s.url).trim()))
        errs.push(`${id}: source url is not http(s): "${s.url}"`);
    }
    if (l.sameAs != null && String(l.sameAs).trim() !== '' && !/^https?:\/\//i.test(String(l.sameAs).trim()))
      errs.push(`${id}: sameAs is not http(s): "${l.sameAs}"`);
  }
  return errs;
}
