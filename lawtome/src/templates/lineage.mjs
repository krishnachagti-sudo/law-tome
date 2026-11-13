// /chains/ and /clusters/ — two views of the relation graph (backlog B4, B3).
// Both are computed in build/lineage.mjs from the `related` labels the entries
// carry; neither page writes a word about any idea that its entry does not.

import { head, sprite, header, footer, escapeHtml, reliabilityClass } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-GB');
const link = (l, base) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`;

/** /chains/ — walkable "this leads to that, which leads to the other". */
export function chainsPage({ chains = [], edges = 0, twoWay = [] }, { base = '/', origin = '', count, byslug = {} } = {}) {
  const L = (s) => byslug[s] || { slug: s, name: s };
  const longest = chains[0] ? chains[0].length : 0;
  const answer = chains.length
    ? `${num(chains.length)} chains of ideas run three or more steps through the index, the longest ${longest}: ${chains[0].map((s) => escapeHtml(L(s).name)).join(' → ')}. Every step is a link one of the two entries labels as a cause or a consequence.`
    : 'No chain of three or more steps can be walked through the index yet.';
  const lede = `Some named ideas are built on others: the germ theory of disease on Pasteur's flasks, the halting problem on the Turing machine. The entries record that with two labels, <em>cause</em> and <em>consequence</em>, and this page follows them as far as they go. A step reads as “leads to” rather than “causes”, because many of these links are foundations or derivations rather than causes in the strict sense.`;
  const rows = chains.map((c, i) => `      <ol class="ch-chain" aria-label="Chain ${i + 1}">
${c.map((s) => `        <li>${link(L(s), base)} <span class="badge ${reliabilityClass(L(s).reliability)}">${escapeHtml(L(s).reliability || '')}</span></li>`).join('\n')}
      </ol>`).join('\n');
  const faq = hubFaq([
    { q: 'Where do these links come from?', a: `From the entries. Each lists related ideas with a label, and ${num(edges)} of those links are labelled <em>cause</em> or <em>consequence</em>, which gives them a direction. Nothing on this page is drawn by hand: a chain is the longest path those links allow from an idea that nothing else leads to.` },
    { q: 'Does “leads to” mean one caused the other?', a: 'Not always. Charles\'s law is a component of the ideal gas law, and Newton\'s laws of motion underlie gravity assists; neither is a cause in the strict sense. “Leads to” is the honest reading of what the labels record: the second idea is built on, explained by, or follows from the first.' },
    ...(twoWay.length ? [{ q: 'Why are some related ideas missing?', a: `${num(twoWay.length)} pairs are labelled in both directions, each entry calling the other its cause. That is the index contradicting itself, not a loop in history, so those pairs are left out of every chain until the labels are corrected: ${twoWay.map(([a, b]) => `${escapeHtml(L(a).name)} and ${escapeHtml(L(b).name)}`).join('; ')}.` }] : []),
  ], { heading: 'About the chains' });
  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({ title: 'What leads to what', sub: `${num(chains.length)} chains`, answer, lede, base, stats: [[num(chains.length), 'chains'], [String(longest), 'steps at most'], [num(edges), 'directed links']] })}
${rows}
${faq.html}${hubNav('chains/', { base })}  </div>
</section>
`;
  const description = `${num(chains.length)} chains of named laws and ideas, each step one the entries themselves label a cause or a consequence — from the Turing machine to Rice's theorem, from Pasteur's flasks to Koch's postulates.`;
  return head({
    title: `What Leads to What — ${num(chains.length)} Chains of Named Ideas | The Law Tome`,
    description, base, origin, path: 'chains/',
    jsonld: [...hubJsonLd({ name: 'What leads to what', description, path: 'chains/', origin, base,
      items: chains.map((c) => ({ name: c.map((s) => L(s).name).join(' → '), url: `${origin}${base}laws/${c[0]}/` })) }),
    ...(faq.jsonld ? [faq.jsonld] : [])],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/** /clusters/ — groups of entries that point at each other. */
export function clustersPage(clusters = [], { base = '/', origin = '', count, byslug = {}, categories = {} } = {}) {
  const L = (s) => byslug[s] || { slug: s, name: s };
  const covered = clusters.reduce((n, c) => n + c.members.length, 0);
  const answer = clusters.length
    ? `${num(clusters.length)} clusters of four or more ideas that the entries link to one another as kindred, covering ${num(covered)} entries. The largest gathers ${num(clusters[0].members.length)} around ${escapeHtml(L(clusters[0].anchor).name)}.`
    : 'No clusters yet.';
  const lede = 'Entries name the ideas they are kin to, and some of those names point back and forth until a group forms. These groups are computed from those links alone, not chosen, and each is named after its best-connected member rather than given a title: a title would be a claim about what the group means, and the group is only a fact about who points at whom. Expect the odd stray; a cluster is a place to start reading, not a taxonomy.';
  const blocks = clusters.map((c) => {
    const fields = new Map();
    for (const s of c.members) { const k = L(s).category || 'other'; fields.set(k, (fields.get(k) || 0) + 1); }
    const topFields = [...fields.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => escapeHtml((categories[k] || k).toLowerCase())).join(' and ');
    return `      <section class="cl-grp" id="c-${escapeHtml(c.anchor)}">
        <h2 class="cl-h">Around ${link(L(c.anchor), base)} <span class="cl-n">${num(c.members.length)} · mostly ${topFields}</span></h2>
        <p class="cl-list">${c.members.slice(1).map((s) => link(L(s), base)).join(' · ')}</p>
      </section>`;
  }).join('\n');
  const faq = hubFaq([
    { q: 'How are the clusters found?', a: 'By label propagation over the kindred links the entries carry: each entry repeatedly takes the group most common among its neighbours until nothing changes, with ties broken alphabetically so the same index always gives the same clusters. Groups of fewer than four are left out.' },
    { q: 'Why is an economics idea in a biology cluster?', a: 'Because an entry in one links it as kindred to an entry in the other, and the method follows links, not fields. Those crossings are part of what this view is for — they are the places where one discipline borrowed another\'s idea — and part of why it is a way to browse, not a classification.' },
  ], { heading: 'About the clusters' });
  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({ title: 'Ideas that travel together', sub: `${num(clusters.length)} clusters`, answer, lede, base, stats: [[num(clusters.length), 'clusters'], [num(covered), 'entries in them'], ['4+', 'members each']] })}
${blocks}
${faq.html}${hubNav('clusters/', { base })}  </div>
</section>
`;
  const description = `${num(clusters.length)} clusters of named laws and ideas that the entries link to each other as kindred — computed from the links, named after their best-connected member.`;
  return head({
    title: `Ideas That Travel Together — ${num(clusters.length)} Clusters | The Law Tome`,
    description, base, origin, path: 'clusters/',
    jsonld: [...hubJsonLd({ name: 'Ideas that travel together', description, path: 'clusters/', origin, base,
      items: clusters.slice(0, 100).map((c) => ({ name: `Around ${L(c.anchor).name}`, url: `${origin}${base}clusters/#c-${c.anchor}` })) }),
    ...(faq.jsonld ? [faq.jsonld] : [])],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
