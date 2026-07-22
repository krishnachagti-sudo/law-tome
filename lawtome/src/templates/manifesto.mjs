// Manifesto (/manifesto/) — the positioning essay. Why a named, sourced,
// cross-linked index of laws is worth building. Editorial prose (an argument,
// not corpus data), so nothing here needs a per-fact citation — but it makes no
// claims about specific laws it can't stand behind.

import { head, sprite, header, footer } from './partials.mjs';

export function manifestoPage({ base = '/', origin = '', count } = {}) {
  const n = count == null ? 'hundreds of' : `${count}`;
  const section = `<section class="sec" id="manifesto">
  <div class="wrap wrap-prose">
    <div class="sec-head"><h1>Why name a law?</h1></div>
    <p class="mf-lede">A good name is a handle on a hard idea. Say “Goodhart’s Law” and a whole pattern — the target that gets gamed the moment it becomes a target — arrives in three words. That compression is the point. It’s why named laws spread, and why they’re worth collecting properly.</p>

    <h2 class="about-h2">The problem with the lists</h2>
    <p class="about-p">Search for any of these and you’ll find the same thing: a listicle. Forty of a name, a one-line gloss, no source, no idea where it came from or whether it’s even true. Half are misattributed. A few are invented. Most are stranded — a name with nothing around it, no sense of which other ideas it touches or contradicts. You leave knowing a phrase, not an idea.</p>

    <h2 class="about-h2">What a real index does</h2>
    <p class="about-p">A named law deserves the same treatment as any other reference: a clear definition, a real example, an honest note on where it breaks down, and a source you can check. It deserves to be placed — next to the laws it echoes and across from the ones it fights with. And it deserves an honest label, because “law” is doing a lot of work: some of these are measured findings, some are rules of thumb, and some are folklore we repeat because it rhymes.</p>
    <p class="about-p">That’s the whole project. ${n} entries, each explained, sourced, and cross-linked into a graph you can walk. One place, built to a standard, instead of forty half-finished lists.</p>

    <h2 class="about-h2">Honesty is the feature</h2>
    <p class="about-p">The easiest thing in the world would be to pad this to ten thousand entries with confident, unsourced summaries. We don’t, because an index you can’t trust is worse than no index at all. Nothing here is invented; every entry is drawn from the literature, cited, and checked by someone trying to break it. When a law is disputed, we say so. When it’s just a saying, we say that too. <a href="${base}about/">Here’s exactly how.</a></p>

    <h2 class="about-h2">And it’s open</h2>
    <p class="about-p">The corpus is licensed CC&nbsp;BY — <a href="${base}data/">download it</a>, cite it, build on it. There are no ads and nothing tracks what you read. If you’ve noticed a real pattern that has no name yet, <a href="${base}coin/">coin it</a> — if it holds up, it goes in with your name on it.</p>

    <div class="mf-cta">
      <a class="cta" href="${base}browse/"><i class="ti ti-arrow-right" aria-hidden="true"></i> Read the index</a>
      <a class="ghost" href="${base}for/">Find your laws</a>
    </div>
    <p class="mf-sig">The Law Tome is an initiative by <a href="${origin || 'https://conyso.com'}">Conyso</a>.</p>
  </div>
</section>
`;

  const description =
    'Why name a law? A short manifesto for The Law Tome — the case for a named, sourced, cross-linked index of laws, principles, and effects instead of forty half-finished lists.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Why name a law?',
    url: `${origin}${base}manifesto/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({ title: 'Why Name a Law? — The Manifesto | The Law Tome', description, base, origin, path: 'manifesto/', jsonld }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}
