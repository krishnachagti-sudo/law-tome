// "Is X real?" — the one question the entry pages cannot answer comparatively.
//
// The query is enormous and standing: "is Dunning-Kruger real", "is the Mandela
// effect real", "is the Pareto principle real". The entry page answers it in
// passing — a badge, a limits section — because the entry page is about what the
// idea SAYS. These pages are about whether it holds, and they can do one thing an
// entry page structurally cannot: put the answer next to the rest of the index.
//
// That comparison is the whole justification for a separate URL. A page that
// restated the entry would be a doorway page and should not exist; this one adds
// three things no entry page has — where the entry sits in the print-frequency
// ranking, how its rating compares with its own field, and how it compares with
// the index as a whole. All computed, none typed.
//
// The cut is deliberately not a round number. An entry gets a verdict page when
// ALL of these hold:
//   1. it is in the print-frequency ranking at all — somebody is asking;
//   2. it is not rated Empirical — the question has an interesting answer; and
//   3. it is a claim about how the world behaves.
//
// (3) was added after looking at the built pages rather than at the code. The
// first version applied only (1) and (2) and produced 260 pages headed "Is
// Habeas Corpus real?", "Is The Social Contract real?" and "Is Virtue Ethics
// real?". Those are category errors: a doctrine, a normative position and a
// branch of ethics do not have a truth value the way an effect does, and asking
// whether they are "real" makes the page look like it does not understand its
// own subject. Two filters do the work — the entry must be the KIND of thing
// that can turn out not to hold, and it must not come from a field whose
// entries are normative or proved rather than observed.
//
// "Is Ohm's law real" is not a question anyone needs a page for either; (2)
// takes care of that one.

const SOFT = new Set(['Heuristic', 'Folk-adage', 'Contested']);

/** Kinds of thing that can turn out not to hold. */
const TESTABLE = new Set([
  'effect', 'bias', 'illusion', 'law', 'principle', 'hypothesis', 'theory', 'curve', 'model', 'rule',
]);

/**
 * Fields whose entries are normative, definitional or proved. A theorem is not
 * "real or not", it is proved; a legal doctrine is not "real or not", it is in
 * force; an ethical position is not "real or not", it is held.
 */
const NOT_EMPIRICAL_FIELDS = new Set(['philosophy', 'law', 'logic', 'mathematics']);

/** Is this an entry whose evidence is worth a page of its own? */
export function isSoft(law) {
  return SOFT.has(law && law.reliability);
}

/**
 * Is "is this real?" a question this entry can answer?
 *
 * @param {object} law
 * @param {(law:object)=>string|null} kindOf from build/kinds.mjs, injected so
 *   this module stays pure and testable without the kind taxonomy.
 */
export function isTestable(law, kindOf) {
  if (!law) return false;
  if (NOT_EMPIRICAL_FIELDS.has(law.category)) return false;
  return TESTABLE.has(kindOf ? kindOf(law) : null);
}

/**
 * Build the verdict rows.
 *
 * @param {object[]} laws corpus entries
 * @param {{law:object}[]} ranked from bestKnown(), most-printed first
 * @returns {{slug,law,rank,rankOf,field,fieldSoft,fieldTotal,corpusSoft,corpusTotal}[]}
 *   in fame order, most-printed first.
 */
export function verdicts(laws = [], ranked = [], { kindOf } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const list = Array.isArray(ranked) ? ranked : [];

  const corpusTotal = rows.length;
  const corpusSoft = rows.filter(isSoft).length;

  // Per-field shares, computed once. A verdict page saying "eleven of the
  // nineteen entries in this field are rated the same way" is the sentence that
  // makes the rating mean something; recomputing it per page would be the same
  // number arrived at more slowly.
  const fieldTotal = new Map();
  const fieldSoft = new Map();
  for (const l of rows) {
    const k = l.category || 'other';
    fieldTotal.set(k, (fieldTotal.get(k) || 0) + 1);
    if (isSoft(l)) fieldSoft.set(k, (fieldSoft.get(k) || 0) + 1);
  }

  const out = [];
  list.forEach((r, i) => {
    const law = r && r.law;
    if (!law || !isSoft(law) || !isTestable(law, kindOf)) return;
    const k = law.category || 'other';
    out.push({
      slug: law.slug,
      law,
      rank: i + 1,
      rankOf: list.length,
      field: k,
      fieldSoft: fieldSoft.get(k) || 0,
      fieldTotal: fieldTotal.get(k) || 0,
      corpusSoft,
      corpusTotal,
    });
  });
  return out;
}

/** Base-relative path for a verdict page. */
export function verdictPath(v) {
  return `is-it-real/${v.slug}/`;
}

/**
 * The one-line answer, derived from the rating rather than written per entry.
 *
 * Deriving it is the point: 260 hand-written verdicts would be 260 opportunities
 * to overclaim, and the rating already encodes the judgement. What varies per
 * page is the entry's OWN limits text, which is authored and sourced.
 */
export function verdictLine(law) {
  switch (law && law.reliability) {
    case 'Contested':
      return 'Disputed. The effect is reported and argued over; whether it holds, and how much of it survives careful measurement, is an open question in the literature.';
    case 'Heuristic':
      return 'It is a rule of thumb, not a finding. It is useful and widely relied on, but it was never established by measurement and does not claim to be.';
    case 'Folk-adage':
      return 'It is a saying, not a result. It circulates because it is memorable and often true enough to be worth repeating — no study underwrites it.';
    default:
      return 'Rated as grounded in studies or measurable evidence.';
  }
}
