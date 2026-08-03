// What kind of thing is it? — the axis the index had no page for.
//
// "List of philosophical razors." "Famous paradoxes." "Logical fallacies."
// "Named theorems." These are among the most-asked questions in this whole
// subject area, and until now the site could answer none of them as a page: a
// reader wanting every razor had to already know the four names.
//
// The classification is deliberately mechanical. An entry is a paradox because
// its NAME says paradox — not because an editor judged the concept paradoxical.
// That rule is the only one that can be applied to 1,101 entries without
// inventing anything, it is inspectable by reading the name, and the pages say
// so in the first sentence. It means the pages are honestly incomplete: the
// corpus holds dozens of cognitive biases whose conventional names do not carry
// the word "bias" (Anchoring, the Halo Effect, Loss Aversion), and they are
// absent from /kinds/biases/ because nothing in their name puts them there.
// A page that quietly guessed would be bigger and would be lying.
//
// Aliases count, but only as a fallback. An entry whose own name names a kind
// is that kind; Newton's Flaming Laser Sword is a razor only because the name
// it also travels under — Alder's Razor — says razor. Letting an alias override
// the primary name would let a stray synonym reclassify a famous entry.

/**
 * The kinds, most specific first.
 *
 * Order matters only for the rare name carrying two kind words; the specific
 * ones are listed above the generic so "The Base Rate Fallacy" is filed as a
 * fallacy rather than swept into some broader bucket.
 *
 * `gloss` is definitional, not evaluative — what the word means in this
 * context, of the sort a dictionary would give. Nothing here is a claim about
 * any particular entry.
 */
export const KINDS = [
  { key: 'razor', one: 'razor', many: 'razors', slug: 'razors',
    title: 'Razors',
    gloss: 'A rule of thumb for cutting away the explanations you do not need. A razor does not tell you what is true; it tells you what to stop entertaining first.' },
  { key: 'paradox', one: 'paradox', many: 'paradoxes', slug: 'paradoxes',
    title: 'Paradoxes',
    gloss: 'An argument whose premises look acceptable, whose steps look valid, and whose conclusion we refuse. Something has to give, and which thing gives is usually the whole subject.' },
  { key: 'fallacy', one: 'fallacy', many: 'fallacies', slug: 'fallacies',
    title: 'Fallacies',
    gloss: 'A pattern of reasoning that looks like it works and does not. Named so it can be pointed at in an argument rather than described from scratch each time.' },
  { key: 'theorem', one: 'theorem', many: 'theorems', slug: 'theorems',
    title: 'Theorems',
    gloss: 'A result proved from stated premises. Within its assumptions a theorem cannot fail — which makes the assumptions the only interesting place to look.' },
  { key: 'conjecture', one: 'conjecture', many: 'conjectures', slug: 'conjectures',
    title: 'Conjectures',
    gloss: 'A claim widely believed and not yet proved. Some have stood for centuries against every attempt.' },
  { key: 'lemma', one: 'lemma', many: 'lemmas', slug: 'lemmas',
    title: 'Lemmas',
    gloss: 'A proved result whose job is to hold up a bigger one. Several here outgrew the theorem they were built for.' },
  { key: 'inequality', one: 'inequality', many: 'inequalities', slug: 'inequalities',
    title: 'Inequalities',
    gloss: 'A proved statement that one quantity is bounded by another — a ceiling or a floor rather than an equality.' },
  { key: 'experiment', one: 'experiment', many: 'experiments', slug: 'experiments',
    title: 'Experiments',
    gloss: 'A described setup whose result is the point. Some were run in a laboratory; some, the thought experiments, were only ever run in the head — and the entry says which.' },
  { key: 'illusion', one: 'illusion', many: 'illusions', slug: 'illusions',
    title: 'Illusions',
    gloss: 'A perception that departs from what is in front of you — reliably, measurably, and for almost everybody, which is what separates an illusion from a mistake.' },
  { key: 'bias', one: 'bias', many: 'biases', slug: 'biases',
    title: 'Biases',
    gloss: 'A systematic tilt in judgement: not random error, but error in a direction you can predict in advance.' },
  { key: 'dilemma', one: 'dilemma', many: 'dilemmas', slug: 'dilemmas',
    title: 'Dilemmas',
    gloss: 'A choice constructed so that every option costs something the chooser is unwilling to pay.' },
  { key: 'hypothesis', one: 'hypothesis', many: 'hypotheses', slug: 'hypotheses',
    title: 'Hypotheses',
    gloss: 'A proposed explanation put forward to be tested. Some here have since been confirmed, some refuted, and some are still open — the reliability mark says which.' },
  // No `equation` kind. /equations/ already collects every entry that CARRIES a
  // formula — 97 of them, read off the corpus rather than off the name — and a
  // name-derived page of sixteen beside it would be the worse of the two
  // wearing the better one's title.
  { key: 'curve', one: 'curve', many: 'curves', slug: 'curves',
    title: 'Curves',
    gloss: 'A shape a relationship takes when it is plotted — named because the shape itself became the argument.' },
  { key: 'argument', one: 'argument', many: 'arguments', slug: 'arguments',
    title: 'Arguments',
    gloss: 'A named chain of reasoning offered for a conclusion, quoted by its name in the debates it belongs to.' },
  { key: 'model', one: 'model', many: 'models', slug: 'models',
    title: 'Models',
    gloss: 'A deliberate simplification used to reason about something too big to hold whole. Every model is wrong in the ways it was simplified.' },
  { key: 'theory', one: 'theory', many: 'theories', slug: 'theories',
    title: 'Theories',
    gloss: 'An organised account of how something works, broad enough to generate predictions rather than state one.' },
  { key: 'problem', one: 'problem', many: 'problems', slug: 'problems',
    title: 'Problems',
    gloss: 'A question posed as a problem — some solved, some proved unsolvable, some still argued over.' },
  { key: 'principle', one: 'principle', many: 'principles', slug: 'principles',
    title: 'Principles',
    gloss: 'A general rule offered as guidance. A principle claims to tell you how to act, where a law claims to tell you what happens.' },
  { key: 'rule', one: 'rule', many: 'rules', slug: 'rules',
    title: 'Rules',
    gloss: 'A stated procedure or constraint, usually practical, usually written down by somebody who got tired of explaining it.' },
  { key: 'effect', one: 'effect', many: 'effects', slug: 'effects',
    title: 'Effects',
    gloss: 'A named outcome that turns up again whenever the same conditions do. The name is a handle for the pattern, not an explanation of it.' },
  { key: 'doctrine', one: 'doctrine', many: 'doctrines', slug: 'doctrines',
    title: 'Doctrines',
    gloss: 'A position held and taught as settled by those who hold it — a rule of decision in law, or a stated stance a school of thought argues from.' },
  { key: 'law', one: 'law', many: 'laws', slug: 'laws',
    title: 'Laws',
    gloss: 'A regularity stated as a rule. Some are measured to many decimal places; some are jokes that hardened into sayings — and this index rates each one rather than treating them alike.' },
];

// Every surface form that files an entry under a kind. Kept beside the kind
// rather than derived, because English plurals are not a function.
const FORMS = new Map([
  ['razor', ['razor', 'razors']],
  ['paradox', ['paradox', 'paradoxes']],
  ['fallacy', ['fallacy', 'fallacies']],
  ['theorem', ['theorem', 'theorems']],
  ['conjecture', ['conjecture', 'conjectures']],
  ['lemma', ['lemma', 'lemmas', 'lemmata']],
  ['inequality', ['inequality', 'inequalities']],
  ['experiment', ['experiment', 'experiments']],
  ['illusion', ['illusion', 'illusions']],
  ['bias', ['bias', 'biases']],
  ['dilemma', ['dilemma', 'dilemmas']],
  ['hypothesis', ['hypothesis', 'hypotheses']],
  ['curve', ['curve', 'curves']],
  ['argument', ['argument', 'arguments']],
  ['model', ['model', 'models']],
  ['theory', ['theory', 'theories']],
  ['problem', ['problem', 'problems']],
  ['principle', ['principle', 'principles']],
  ['rule', ['rule', 'rules']],
  ['effect', ['effect', 'effects']],
  ['doctrine', ['doctrine', 'doctrines']],
  ['law', ['law', 'laws']],
]);

/** Words of a name, folded to bare lowercase letters. */
function words(s) {
  return String(s || '').toLowerCase().replace(/[^a-z]+/g, ' ').trim().split(' ').filter(Boolean);
}

/**
 * The kind a single string names, or null.
 *
 * Scans right to left and takes the first kind word it meets, so the head noun
 * wins: "Betteridge's Law of Headlines" is a law, "The Base Rate Fallacy" is a
 * fallacy. Where two kind words sit at the same distance from the end, KINDS
 * order breaks the tie in favour of the more specific.
 */
export function kindOfName(name) {
  const w = words(name);
  for (let i = w.length - 1; i >= 0; i -= 1) {
    for (const k of KINDS) {
      if ((FORMS.get(k.key) || []).includes(w[i])) return k.key;
    }
  }
  return null;
}

/**
 * The kind an ENTRY belongs to: its own name first, then its aliases.
 * @returns {string|null} a KINDS key, or null when nothing in any of its names
 *   says what kind of thing it is — which is true of roughly a third of the
 *   index, and is left as null rather than guessed.
 */
export function kindOf(law) {
  if (!law) return null;
  const own = kindOfName(law.name);
  if (own) return own;
  for (const a of (Array.isArray(law.aliases) ? law.aliases : [])) {
    const k = kindOfName(a);
    if (k) return k;
  }
  return null;
}

/**
 * Group the corpus by kind.
 *
 * @param {object[]} laws
 * @param {object} [o]
 * @param {number} [o.min=4] smallest group that earns a page. Below this a kind
 *   is a handful of entries and a page for it is a page about nothing; those
 *   entries keep their own pages and simply appear on no kind page.
 * @returns {{key,one,many,slug,title,gloss,laws:object[],count:number}[]}
 *   in KINDS order, largest-first is NOT applied — the hub decides display order.
 */
export function kinds(laws = [], { min = 4 } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const by = new Map();
  for (const l of rows) {
    const k = kindOf(l);
    if (!k) continue;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(l);
  }
  return KINDS
    .filter((k) => (by.get(k.key) || []).length >= min)
    .map((k) => {
      const list = [...by.get(k.key)]
        .sort((a, b) => (Number(a.no) || 1e9) - (Number(b.no) || 1e9));
      return { ...k, laws: list, count: list.length };
    });
}

/** Base-relative path for a kind page. */
export function kindPath(kind) {
  return `kinds/${kind.slug}/`;
}
