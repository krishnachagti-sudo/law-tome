// Somebody else's evidence, beside our judgement (pure, no I/O).
//
// The reliability rating on every entry is ours. /how-solid/ says so plainly,
// which is right, and does not stop it being the softest joint in the project:
// one small team's four-tier call on 1,116 ideas.
//
// FORRT's Replication Database is the opposite kind of thing — a crowdsourced
// academic record of 1,239 paired original-and-replication findings, published
// CC BY 4.0. Where it names an effect this index also names, the entry can carry
// FReD's count of how the replications actually went. That number is not ours,
// cannot be argued into a different shape by us, and is linked so a reader can
// check it. It is the single strongest thing available for making a rating
// defensible rather than merely stated.
//
// Two rules keep it honest:
//
//   1. It never overrides the rating. A rating is a claim about what KIND of
//      support an idea has; a replication count is one input to that. Where they
//      disagree the page shows both and says so, because hiding the disagreement
//      would be the whole failure this site exists to avoid.
//   2. It reports only what FReD has coded. 81% of FReD rows carry no computed
//      outcome, so most matched entries get an attempt count and nothing more.
//      "Nine attempts recorded" is a fact; inventing a verdict from nine
//      uncoded rows would not be.

/** @typedef {{effects:string[],attempts:number,coded:number,signal?:number,noSignal?:number,source:string,cite:string}} Rep */

/**
 * The replication record for one entry, or null.
 * @param {object} law
 * @param {{entries?:Object<string,Rep>}} [doc] parsed src/data/replication.json
 * @returns {Rep|null}
 */
export function replicationFor(law, doc) {
  if (!law || !doc || !doc.entries) return null;
  return doc.entries[law.slug] || null;
}

/**
 * Does FReD's record sit awkwardly against our rating?
 *
 * Deliberately narrow: it fires only when we call something Empirical and a
 * majority of coded replication attempts found no signal. That is the one
 * combination a reader would be entitled to call us out on, and the page should
 * say it before they do. It does NOT fire the other way — an entry we rate
 * Contested whose replications succeed is us being cautious, which needs no
 * apology.
 *
 * @returns {boolean}
 */
export function contradictsRating(law, rep) {
  if (!law || !rep || rep.signal === undefined) return false;
  return law.reliability === 'Empirical' && rep.noSignal > rep.signal;
}

/**
 * One sentence stating what FReD records, in plain English.
 *
 * Written as a count rather than a verdict. "19 of 21 found no signal" is a fact
 * a reader can check against the linked database; "this effect does not
 * replicate" is a conclusion we would be drawing on FORRT's behalf from a subset
 * of their data, which is not ours to draw.
 */
export function replicationLine(rep) {
  if (!rep) return '';
  const n = (v) => Number(v).toLocaleString('en-US');

  // Studies and results are reported as two different things because they ARE
  // two different things, and conflating them is how this join nearly shipped a
  // confident falsehood. A multi-site replication contributes one study and many
  // results; reading its site count as an attempt count overstates the scrutiny
  // an effect has had by an order of magnitude.
  const studies = `${n(rep.studies)} replication ${rep.studies === 1 ? 'study' : 'studies'}`;
  const multi = rep.results > rep.studies
    ? `, reporting ${n(rep.results)} separate results — replications run across many sites contribute one study and many results`
    : '';
  const head = `FORRT's Replication Database records ${studies} of this effect${multi}`;

  if (rep.signal === undefined) {
    return `${head}. It has not yet computed an outcome for any of them, so there is no pass or fail to report here — only that the work exists.`;
  }
  return `${head}. Of the ${n(rep.coded)} results it has scored, ${n(rep.signal)} found a signal and ${n(rep.noSignal)} did not.`;
}

/**
 * Corpus-level summary, for /how-solid/ and the credits.
 * @param {object[]} laws
 * @param {object} doc
 */
export function replicationSummary(laws = [], doc) {
  const entries = (doc && doc.entries) || {};
  const slugs = new Set(Object.keys(entries));
  const matched = laws.filter((l) => slugs.has(l.slug));
  const withSplit = matched.filter((l) => entries[l.slug].signal !== undefined);
  return {
    matched: matched.length,
    withSplit: withSplit.length,
    studies: matched.reduce((n, l) => n + entries[l.slug].studies, 0),
    results: matched.reduce((n, l) => n + entries[l.slug].results, 0),
    contradictions: matched.filter((l) => contradictsRating(l, entries[l.slug])).map((l) => l.slug),
  };
}
