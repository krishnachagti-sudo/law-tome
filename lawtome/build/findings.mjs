// What the index turns out to say about itself (pure, no I/O).
//
// Every other page here answers a question about ONE law. This answers one
// about the whole corpus, and it is the only question this project is uniquely
// placed to answer: having rated all 1,100-odd entries for how much evidence
// stands behind them, and having a separate, external measure of how often each
// name is printed, we can cross the two. Nobody else can, because nobody else
// has both numbers for the same set of things.
//
// The answer is not the one a reader expects. Fame does not track evidence —
// it tracks against it. The best-known entries in the index are LESS likely to
// be rated Empirical than the index as a whole.
//
// Everything below is computed from the corpus at build time. There are no
// numbers typed into the page. If an entry is re-rated tomorrow the finding
// moves with it, which is the only honest way to publish a claim about your own
// data: make the claim a function of the data rather than a sentence about it.

/** The tiers that are not "rests on published measurement". */
const SOFT = new Set(['Heuristic', 'Folk-adage', 'Contested']);

/**
 * @param {object[]} laws corpus entries
 * @param {{law:object}[]} ranked from bestKnown() — fame order, most-printed first
 * @param {object[]} mis from misattributed()
 * @param {number[]} [bands] the top-N cut-points to report
 */
export function findings(laws = [], ranked = [], mis = [], bands = [25, 50, 100, 250]) {
  const rows = Array.isArray(laws) ? laws : [];
  const rank = Array.isArray(ranked) ? ranked : [];

  const tiers = {};
  for (const l of rows) if (l && l.reliability) tiers[l.reliability] = (tiers[l.reliability] || 0) + 1;

  const total = rows.length;
  const softAll = rows.filter((l) => SOFT.has(l.reliability)).length;

  // The curve. Each band reports the share of that slice which is NOT Empirical,
  // so the reader can see the trend rather than take one cherry-picked cut on
  // trust — and can see for themselves where it flattens out.
  const curve = bands
    .filter((n) => n <= rank.length)
    .map((n) => {
      const slice = rank.slice(0, n);
      const soft = slice.filter((r) => SOFT.has(r.law && r.law.reliability)).length;
      return { n, soft, share: soft / n };
    });

  // Position in the fame ranking, for pulling the best-known instance of a thing.
  const at = new Map(rank.map((r, i) => [r.law && r.law.slug, i + 1]));
  const famous = (a, b) => (at.get(a.slug) || 1e9) - (at.get(b.slug) || 1e9);

  return {
    total,
    tiers,
    softAll,
    softAllShare: total ? softAll / total : 0,
    measured: rank.length,          // how many entries have a fame number at all
    curve,
    rank: at,

    /** The head of the fame ranking, tier attached — the table the finding rests on. */
    head: rank.slice(0, 25).map((r) => r.law),

    /** Entries whose own text says the namesake was not first, famous ones first. */
    misattributed: (Array.isArray(mis) ? mis : [])
      .map((m) => ({ ...m, at: at.get(m.law && m.law.slug) || Infinity }))
      .sort((a, b) => a.at - b.at),

    /** Sayings that get quoted as findings — the smallest tier and the loudest. */
    adages: rows.filter((l) => l.reliability === 'Folk-adage').sort(famous),

    /** Still argued over, best-known first. */
    contested: rows.filter((l) => l.reliability === 'Contested').sort(famous),
  };
}

/**
 * The finding as one sentence, with its own numbers in it.
 *
 * Kept here rather than written into the template so the headline, the page
 * body, the meta description and the social card cannot disagree with each
 * other or with the corpus.
 */
export function headline(f) {
  const band = (f.curve && f.curve[0]) || null;
  if (!band) return 'Named laws, rated for how much evidence stands behind them.';
  const pc = Math.round(band.share * 100);
  const all = Math.round(f.softAllShare * 100);
  return `${pc}% of the ${band.n} best-known entries here rest on something other than measurement — against ${all}% of the index as a whole.`;
}
