// Which entries say, in their own words, that the namesake did not do the work
// (pure, no I/O).
//
// Stigler's law of eponymy — no scientific discovery is named after its
// original discoverer — is itself in this index, and the index is full of
// instances: Grimm's Law was Rask's first, the Law of the Instrument is
// Kaplan's rather than Maslow's, continental drift had been proposed before
// Wegener. Every one of those facts is already written into the entry's own
// origin or misreadings prose, and none of it was reachable except by reading
// a thousand pages.
//
// The gate is evidence, not inference. An entry qualifies only when its own
// text contains an explicit statement — "did not coin", "was not the first",
// "misattributed", a named earlier author — and the matched phrase is carried
// through so the page can quote what the entry actually says instead of
// asserting a verdict of its own. Nothing here decides that a person was
// wrongly credited; the entry decided that, and this finds it.

/**
 * The patterns that count as the entry saying so itself, each with the claim it
 * licenses. Ordered: the most explicit wins, so the reason shown is the
 * strongest one present.
 *
 * Deliberately excluded: "popularised by". Popularising is not the same as
 * taking credit — the entry may be describing an ordinary chain of
 * transmission — and including it took the set from 83 to 150 with most of the
 * additions unjustified.
 */
const SIGNALS = [
  [/\bmisattribut\w+/i, 'the entry says the attribution is wrong'],
  [/\bStigler'?s?\s+law\b/i, 'the entry invokes Stigler’s law of eponymy'],
  [/\bdid not (?:discover|originate|coin|invent|formulate|devise|first (?:state|describe|propose))\b/i,
    'the entry says the namesake did not originate it'],
  [/\bnever (?:used|coined|wrote|said|claimed|published)\b/i,
    'the entry says the namesake never said it'],
  [/\b(?:was|were) not the first\b/i, 'the entry says the namesake was not first'],
  [/\bnot the first to\b/i, 'the entry says the namesake was not first'],
  [/\bfirst (?:stated|described|proposed|noted|published|derived)\s+by\b/i,
    'the entry names an earlier author'],
  [/\bearlier\b[^.]{0,60}\b(?:by|than)\b/i, 'the entry points at earlier work'],
];

/**
 * The matched sentence has to be ABOUT the naming.
 *
 * "misattribut" alone was not enough: the Maillard Reaction's misreadings say
 * that confusing it with caramelisation "misattributes browning", and the
 * Mere-Exposure Effect's say that ease is "misattributed to positive feeling".
 * Both are misattributions of a cause, not of credit, and both landed on a page
 * about who deserves the name. A sentence qualifies only when it also mentions
 * the namesake, or names/credit/eponym explicitly.
 */
function aboutTheNaming(sentence, person) {
  const s = String(sentence);
  if (/\bnamed\s+(?:after|for)\b|\bcredit(?:ed|s)?\b|\beponym/i.test(s)) return true;
  // Any word of the namesake's name long enough to be a surname rather than an
  // initial or a particle.
  const parts = String(person || '').split(/[\s,]+/)
    .map((w) => w.replace(/[^A-Za-z]/g, ''))
    .filter((w) => w.length > 3);
  return parts.some((w) => new RegExp(`\\b${w}`, 'i').test(s));
}

/** The prose fields an attribution claim can honestly live in. */
const FIELDS = ['origin', 'misreadings', 'limits', 'mechanism', 'whyItMatters'];

/**
 * The sentence a match sits in, so the page can quote the entry rather than
 * paraphrase it. Split on sentence ends that are followed by a space and a
 * capital, which keeps "e.g." and "1866." from cutting a sentence in half.
 */
function sentenceAround(text, index) {
  const s = String(text);
  let start = 0;
  for (let i = index; i > 0; i--) {
    if (/[.!?]/.test(s[i]) && /\s/.test(s[i + 1] || '') && /[A-Z“"(]/.test(s[i + 2] || '')) { start = i + 2; break; }
  }
  let end = s.length;
  for (let i = index; i < s.length; i++) {
    if (/[.!?]/.test(s[i]) && (i + 1 >= s.length || (/\s/.test(s[i + 1]) && /[A-Z“"(]/.test(s[i + 2] || '')))) { end = i + 1; break; }
  }
  return s.slice(start, end).trim();
}

/**
 * @param {object[]} laws corpus entries
 * @returns {{law: object, person: string, reason: string, quote: string,
 *   field: string}[]} alphabetical by entry name.
 */
export function misattributed(laws = []) {
  const out = [];
  for (const l of (Array.isArray(laws) ? laws : [])) {
    if (!l || !l.namedAfter) continue;
    let best = null;
    for (const [pat, reason] of SIGNALS) {
      for (const f of FIELDS) {
        const text = l[f];
        if (typeof text !== 'string') continue;
        const m = pat.exec(text);
        if (!m) continue;
        const quote = sentenceAround(text, m.index);
        if (!aboutTheNaming(quote, l.namedAfter)) continue;
        best = { law: l, person: l.namedAfter, reason, field: f, quote };
        break;
      }
      if (best) break;   // SIGNALS is ordered strongest-first
    }
    if (best) out.push(best);
  }
  return out.sort((a, b) => String(a.law.name).localeCompare(String(b.law.name), 'en'));
}
