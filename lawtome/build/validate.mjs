// Mechanical enforcement of the corpus's anti-fabrication guarantees. Every rule
// here is one of the seven "rules that fail the build" documented in
// docs/CORPUS-SCHEMA.md — the citation-gate, cross-reference closure, and the
// coined-can't-fake-a-namedAfter guard are load-bearing, not style advice.
// validateCorpus returns a flat array of human-readable error strings; the Task 8
// build throws when it is non-empty, so a corpus that violates any rule never
// ships a page.
const RELIABILITY = new Set(['Empirical', 'Heuristic', 'Folk-adage', 'Contested']);
const PROVENANCE = new Set(['canon', 'coined']);
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
