// /how-solid/ — the one page that argues something.
//
// Everything else here is reference: you arrive with a question about a law and
// leave with an answer about that law. This page is the opposite. It has a
// claim, the claim is about the whole corpus, and the corpus is the evidence.
//
// The claim: fame and evidence come apart. The best-known named laws are LESS
// likely to rest on measurement than the index as a whole. That is not a
// rhetorical flourish — it is a number computed at build time from two
// independent measures, our reliability rating and somebody else's count of how
// often each name is printed, and it is recomputed on every build.
//
// The page is written to be attacked. The method is stated before the finding,
// the limits of both measures are given their own section rather than a
// footnote, and every entry named in the argument links to its own sourced page
// so a sceptical reader can check the rating that produced the number. A claim
// about how much evidence other people's ideas rest on had better show its own.

import { head, sprite, header, footer, escapeHtml, reliabilityClass, shareRow } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { headline } from '../../build/findings.mjs';

const num = (n) => Number(n).toLocaleString('en-US');
const pc = (x) => `${Math.round(x * 100)}%`;

/** Tier order for the breakdown: hardest evidence first. */
const TIERS = ['Empirical', 'Heuristic', 'Contested', 'Folk-adage'];

const TIER_SAYS = {
  Empirical: 'rests on published studies or measurements',
  Heuristic: 'a dependable rule of thumb, with no proof behind it',
  Contested: 'the claim is made and specialists still disagree',
  'Folk-adage': 'a saying that hardened into a “law”',
};

/** A row in the fame table. */
function headRow(l, i, base) {
  return `        <a class="fx-row" href="${base}laws/${escapeHtml(l.slug)}/">
          <span class="fx-r">${i + 1}</span>
          <span class="fx-n">${escapeHtml(l.name)}</span>
          <span class="badge ${reliabilityClass(l.reliability)}">${escapeHtml(l.reliability || '')}</span>
        </a>`;
}

/** A named example with the entry's own words attached. */
function misRow(m, base) {
  const l = m.law || {};
  return `        <li class="fx-mis">
          <a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>
          <span class="fx-why">${escapeHtml(m.reason || '')}</span>
          ${m.quote ? `<q class="fx-q">${escapeHtml(m.quote)}</q>` : ''}
        </li>`;
}

/**
 * @param {object} f from build/findings.mjs findings()
 */
export function findingsPage(f, { base = '/', origin = '', count, categories = {} } = {}) {
  const band = f.curve[0] || { n: 0, soft: 0, share: 0 };
  const claim = headline(f);

  // The bars are drawn from the same numbers as the prose. There is no separate
  // chart data to fall out of sync with the text.
  //
  // The axis runs 0-100%, and it is worth saying why, because the first version
  // of this did not. Scaling the bars to the largest value made an eleven-point
  // spread look like a fourfold one — the standard truncated-axis trick, and
  // exactly the sort of unchecked persuasion this page exists to complain
  // about. A finding this small has to look small; if the honest chart is
  // unimpressive, that is information about the finding, not a design problem
  // to style around.
  const bar = (label, share, n, note) => `        <div class="fx-bar">
          <span class="fx-bl">${escapeHtml(label)}</span>
          <span class="fx-bt"><span class="fx-bf" style="width:${(share * 100).toFixed(1)}%"></span></span>
          <span class="fx-bv">${pc(share)}</span>
          <span class="fx-bn">${escapeHtml(note || `${num(n)} entries`)}</span>
        </div>`;

  const bars = [
    ...f.curve.map((c) => bar(`Top ${c.n} best-known`, c.share, c.n)),
    bar('The whole index', f.softAllShare, f.total, `all ${num(f.total)} entries`),
  ].join('\n');

  const tierRows = TIERS.filter((t) => f.tiers[t]).map((t) => `        <div class="fx-tier">
          <span class="badge ${reliabilityClass(t)}">${escapeHtml(t)}</span>
          <b>${num(f.tiers[t])}</b>
          <span class="fx-ts">${escapeHtml(TIER_SAYS[t] || '')}</span>
        </div>`).join('\n');

  const answer = `${escapeHtml(claim)} Every entry in this index carries a rating for how much evidence stands behind it, and the ${num(f.measured)} of them whose names can be counted in printed books can be ranked by how often they are printed. Crossing the two shows that the ranking runs the wrong way: the more familiar a named law is, the less likely it is to be a measured finding rather than a rule of thumb, a saying, or an argument that is still going on.`;

  const lede = `This is the only page here that argues something. It is also the only claim this project is in a position to make, because making it needs both numbers — how well established each entry is, and how well known — for the same ${num(f.total)} things. The method is below the finding, the limits of both measures are below that, and every entry named is a link to its own sourced page, so the rating that produced these numbers can be checked one law at a time.`;

  const misTop = f.misattributed.filter((m) => Number.isFinite(m.at)).slice(0, 8);
  const adagesTop = f.adages.slice(0, 12);

  const faq = hubFaq([
    {
      q: 'Does this mean the famous laws are wrong?',
      a: `No, and the page would be worthless if it said so. "Not rated Empirical" means the support behind a claim is something other than published measurement — a rule of thumb, a saying, or a live disagreement among specialists. Parkinson's Law is a sharp observation that was never measured; that makes it a heuristic, not a falsehood. The finding is about the <em>kind</em> of support a claim has, and the mistake it is aimed at is quoting one kind as though it were the other. <a href="${base}reliability/">The four tiers are defined here</a>.`,
    },
    {
      q: 'Who decided the ratings?',
      a: `We did, one entry at a time, and that is the honest weak point of the whole exercise — it is an editorial judgement, not a measurement. Two things keep it checkable. Every entry lists the sources the rating was made against, so you can disagree with a specific call rather than with the idea of rating. And every entry states its own limits in its own section, which is frequently where a generous rating gives itself away. <a href="${base}is-it-real/">The full list, by tier, is here</a>.`,
    },
    {
      q: 'How is "best-known" measured?',
      a: `By how often the exact phrase is printed in the Google Books English corpus between 1800 and 2019 — an external number, collected by somebody else, for a purpose that has nothing to do with this site. It measures printing, not importance: Habeas Corpus leads by a wide margin because it appears in every legal casebook ever bound. <a href="${base}best-known/">The full ranking shows the exact phrase counted for each entry</a>, so you can see where it counted the wrong thing.`,
    },
    {
      q: 'Why would fame and evidence run in opposite directions?',
      a: 'This page does not claim to know, and any explanation offered here would be exactly the kind of unmeasured just-so story it is arguing against. The obvious candidates — memorable phrasing travels further than careful phrasing; a saying can be quoted by anyone whereas a measured result needs a field to carry it; and the softer the domain, the more quotable its generalisations — are all plausible and none of them is tested here. The finding is the correlation. The cause is somebody else’s paper.',
    },
    {
      q: 'Will these numbers change?',
      a: 'Yes, and they are meant to. They are computed from the corpus every time the site is built, not typed into the page, so a re-rated entry or a new batch moves the figure the same day. If you cite this, cite the date on it.',
    },
  ], { heading: 'The obvious objections' });

  const section = `<section class="sec">
  <div class="wrap">
${hubHead({
    title: 'How solid is any of this?',
    sub: 'what the index says about itself',
    answer,
    lede,
    base,
    crumbs: [['browse/', 'Browse']],
    stats: [
      [pc(band.share), `of the ${band.n} best-known are not Empirical`],
      [pc(f.softAllShare), 'of the whole index'],
      [num(f.misattributed.length), 'named after the wrong person'],
      [num(f.tiers['Folk-adage'] || 0), 'are sayings, not findings'],
    ],
  })}
    <section class="fx-sec">
      <h2>The finding</h2>
      <p class="fx-p">Share of each slice that is <b>not</b> rated Empirical — that is, resting on a rule of thumb, a saying, or an open disagreement rather than on published measurement. If fame tracked evidence these bars would rise to the right. They fall.</p>
      <div class="fx-bars">
${bars}
      </div>
      <p class="fx-note">The gap is not enormous and the page is not going to pretend it is: ${pc(band.share)} against ${pc(f.softAllShare)}. What makes it worth publishing is the direction. The reasonable prior is that the ideas which spread furthest are the ones that turned out to be right, and in this corpus the opposite is true at every cut.</p>
    </section>

    <section class="fx-sec">
      <h2>The ${f.head.length} best-known, with their ratings</h2>
      <p class="fx-p">The head of the table the finding is drawn from. Ranked by how often the name is printed; the badge is the rating the entry carries on its own page.</p>
      <div class="fx-rows">
${f.head.map((l, i) => headRow(l, i, base)).join('\n')}
      </div>
      <p class="fx-note"><a href="${base}best-known/">The full ranking</a> runs to ${num(f.measured)} entries, each showing the exact phrase that was counted.</p>
    </section>

    <section class="fx-sec">
      <h2>How the index breaks down</h2>
      <div class="fx-tiers">
${tierRows}
      </div>
      <p class="fx-note">Every one of these is an editorial call made against the sources listed on the entry. <a href="${base}reliability/">What each tier means</a> · <a href="${base}is-it-real/">every entry, by tier</a>.</p>
    </section>

    <section class="fx-sec">
      <h2>A second finding: ${num(f.misattributed.length)} are named after the wrong person</h2>
      <p class="fx-p">Stigler's law of eponymy — no scientific discovery is named after its original discoverer — is itself an entry here, and the index keeps proving it. These are the cases where the entry's <em>own text</em> says the namesake was not first. Nothing was inferred; the sentence was already there, and this found it.</p>
      <ul class="fx-mis-list">
${misTop.map((m) => misRow(m, base)).join('\n')}
      </ul>
      <p class="fx-note"><a href="${base}misattributed/">All ${num(f.misattributed.length)}, with the receipts</a>.</p>
    </section>

    <section class="fx-sec">
      <h2>The ${num(f.tiers['Folk-adage'] || 0)} that are sayings</h2>
      <p class="fx-p">The smallest tier and the one that causes the most trouble, because these are quoted in meetings as though somebody had measured them. They circulate because they are memorable and often true — not because anyone checked.</p>
      <div class="fx-chips">
${adagesTop.map((l) => `        <a class="fx-chip" href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join('\n')}
      </div>
    </section>

    <section class="fx-sec fx-method">
      <h2>Where this could be wrong</h2>
      <p class="fx-p">Three places, and they are all real.</p>
      <ol class="fx-limits">
        <li><b>The ratings are ours.</b> A four-tier judgement applied by one editorial process to ${num(f.total)} entries across twenty fields will not be uniformly calibrated, and the boundary between Heuristic and Empirical is the softest of the three. Every rating is made against the sources printed on the entry, which is what makes a specific disagreement possible; none of it makes the call authoritative.</li>
        <li><b>The fame measure counts printing.</b> Google Books n-grams count how often a phrase appears in scanned books, which is a proxy for reach with well-known distortions: legal and medical terms are over-represented because their literature is enormous, anything named after 2010 is under-counted, and a law whose common phrasing differs from its formal name is measured on the wrong string. ${num(f.total - f.measured)} entries have no usable measurement at all and sit outside this analysis entirely.</li>
        <li><b>Two measures, one direction, no cause.</b> This is a correlation across one corpus that we assembled. We chose what to include, and if the selection favoured famous-but-soft ideas over famous-and-solid ones, the finding is partly an artefact of that choice rather than a fact about the world. We think the corpus is broad enough that it isn't. We can't prove it from inside the corpus.</li>
      </ol>
      <p class="fx-note">Everything above is recomputed on every build from <a href="${base}data/">the published dataset</a>. Nothing on this page is a number somebody typed in.</p>
    </section>

    <div class="fx-share">
${shareRow({
    url: `${origin}${base}how-solid/`,
    title: 'How solid is any of this? — The Law Tome',
    text: claim,
    label: 'Share this finding',
  })}    </div>

${faq.html}${hubNav('how-solid/', { base })}  </div>
</section>
`;

  const description = `${claim} An analysis of all ${num(f.total)} named laws, principles and effects in The Law Tome — rated for evidence, ranked by how often they are printed.`;

  const jsonld = hubJsonLd({
    name: 'How solid is any of this?',
    description,
    path: 'how-solid/',
    origin,
    base,
    items: f.head.map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
  });

  return (
    head({
      title: 'How Solid Is Any of This? Named Laws, Rated',
      description,
      base,
      origin,
      path: 'how-solid/',
      og: { image: `${origin}${base}og/how-solid.png` },
      jsonld: [...(Array.isArray(jsonld) ? jsonld : [jsonld]), ...(faq.jsonld ? [faq.jsonld] : [])],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
