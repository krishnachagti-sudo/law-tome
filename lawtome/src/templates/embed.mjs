// Embeddable cards: /embed/<slug>/, /embed/today/, and the /embed/ how-to.
//
// The constraint on this project is not content, it is that nobody links to it.
// An embed is the one thing that earns a link without asking for one: someone
// writing about Goodhart's Law drops in a card because it saves them writing a
// definition, and the card carries a link home.
//
// These pages are deliberately NOT the site. No masthead, no footer, no
// stylesheet fetch, no script — one self-contained document under 4kB that
// renders correctly inside an iframe on a page whose CSS we will never see, in
// light or dark, and degrades to a plain link if framing is blocked. They are
// noindex, because an embed competing with the entry it quotes would be the
// site cannibalising itself.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const ACCENT = '#b8862b';

/** Everything the card needs, inlined — an iframe gets no shared stylesheet. */
const CARD_CSS = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font:15px/1.55 Georgia,'Times New Roman',serif;background:#fff;color:#1b1a17}
a{color:inherit}
.c{display:block;padding:18px 20px;border:1px solid #dcd7cc;border-radius:10px;text-decoration:none;background:#fbf9f4}
.c:hover{border-color:#b9b1a1}
.k{display:flex;align-items:baseline;gap:8px;font:600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.09em;text-transform:uppercase;color:#7d7767;margin-bottom:9px}
.k b{font-weight:600;color:${ACCENT}}
.n{font-size:19px;font-weight:600;margin:0 0 6px;color:#14130f}
.c:hover .n{color:${ACCENT}}
.s{margin:0 0 10px;font-style:italic;color:#3a382f}
.m{margin:0;font-size:13.5px;color:#55524a}
.f{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-top:13px;padding-top:10px;border-top:1px solid #e6e1d6;font:10px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;color:#8a8474}
@media (prefers-color-scheme:dark){
  body{background:transparent;color:#f0ece2}
  .c{background:#151412;border-color:#3d3b38}
  .c:hover{border-color:#63615f}
  .n{color:#f0ece2}.s{color:#d6d1c4}.m{color:#a8a293}
  .f{border-top-color:#33312e;color:#8b867c}
  .k{color:#97958c}
}
`.trim();

/**
 * One entry as a standalone card document.
 *
 * @param {object} law the entry
 * @param {object} o
 * @param {string} o.absolute the entry's absolute URL — an iframe has no base
 *   to resolve a relative href against, so every link here must be absolute
 */
export function embedCard(law, { absolute, origin = '', base = '/', tier = true } = {}) {
  const url = absolute || `${origin}${base}laws/${law.slug}/`;
  const home = `${origin}${base}`;
  const meta = [
    law.reliability && tier ? `<b>${escapeHtml(law.reliability)}</b>` : '',
    law.coinedYear ? escapeHtml(String(law.coinedYear)) : '',
  ].filter(Boolean).join(' · ');
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>${escapeHtml(law.name)} — The Law Tome</title>
<link rel="canonical" href="${escapeHtml(url)}">
<style>${CARD_CSS}</style>
</head><body>
<a class="c" href="${escapeHtml(url)}" target="_blank" rel="noopener">
  <span class="k">${meta}</span>
  <p class="n">${escapeHtml(law.name)}</p>
  ${law.statement ? `<p class="s">“${escapeHtml(law.statement)}”</p>` : ''}
  ${law.meaning ? `<p class="m">${escapeHtml(clip(law.meaning, 190))}</p>` : ''}
  <span class="f"><span>The Law Tome</span><span>Read the entry →</span></span>
</a>
</body></html>
`;
}

/** Trim at a word boundary; an ellipsis mid-word looks like a bug. */
function clip(s, max) {
  const t = String(s || '').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).replace(/[\s,;:—-]+\S*$/, '')}…`;
}

/**
 * The card that changes daily. Same document, but the entry is chosen by the
 * build's own law-of-the-day index, so an embedder who pastes it once gets a
 * different law each time the site rebuilds — which is the reason to paste it.
 */
export function embedToday(law, { origin = '', base = '/' } = {}) {
  return embedCard(law, { origin, base, absolute: `${origin}${base}laws/${law.slug}/` })
    .replace('<title>', '<title>Law of the day: ')
    .replace('<span>The Law Tome</span>', '<span>The Law Tome · law of the day</span>');
}

/**
 * The page that tells someone how to use the cards.
 *
 * Written for the person deciding whether to paste an iframe onto their own
 * site, so it answers their three questions first — what it looks like, what it
 * costs them, and whether it will change under them — and only then gives the
 * snippet.
 */
export function embedDocsPage(sample, { base = '/', origin = '', count } = {}) {
  const abs = `${origin}${base}`;
  const code = (path, height) => `<iframe src="${abs}embed/${path}" width="100%" height="${height}" style="border:0;max-width:540px" loading="lazy" title="The Law Tome"></iframe>`;
  const block = (label, html, note) => `    <section class="emb-block">
      <h2 class="emb-h">${escapeHtml(label)}</h2>
      <p class="emb-note">${note}</p>
      <div class="emb-demo">${html}</div>
      <pre class="emb-code"><code>${escapeHtml(html)}</code></pre>
    </section>`;

  const answer = `Any of the ${count ? Number(count).toLocaleString('en-US') : ''} entries in this index can be embedded on another site as a self-contained card with one line of HTML — no script, no tracking, no stylesheet of ours loaded into your page.`;

  const lede = 'A card is a single static document under four kilobytes. It carries the entry\'s name, its statement, one sentence of explanation and its reliability rating, and it links back to the full entry. It follows your reader\'s light or dark preference, sets no cookie, makes no request anywhere except to this site, and cannot see the page it sits on. Use it wherever writing out a definition would be the boring part.';

  const faq = hubFaq([
    { q: 'What does the embed cost me?', a: 'One request for a document a few kilobytes long. There is no JavaScript in it, no analytics, no cookie and no font download — the card uses whatever serif your reader already has.' },
    { q: 'Will the card change under me?', a: 'A single-entry card changes only when that entry is corrected, which is the behaviour you want from a reference. The law-of-the-day card is different by design: it shows a different entry each day, which is the reason to use that one.' },
    { q: 'Can I use it commercially?', a: `Yes. Everything here is <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> — use it anywhere, including commercially, provided the attribution stays. The card carries its own attribution, so embedding it satisfies that on its own.` },
    { q: 'Is there a way to get the data instead?', a: `Yes — every entry has a JSON record at <code>${escapeHtml(abs)}laws/{slug}.json</code>, and the whole index is downloadable from <a href="${base}data/">the dataset page</a>.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Put a law on your own site',
    sub: 'one line of HTML',
    answer,
    lede,
    stats: [['0', 'scripts'], ['0', 'cookies'], ['~4 kB', 'per card'], ['CC BY 4.0', 'licence']],
    base,
    crumbs: [['data/', 'The dataset']],
  })}${block('One entry', code(`${sample.slug}/`, 260), `Replace <code>${escapeHtml(sample.slug)}</code> with any entry\'s slug — the last part of its URL. Every one of the ${count ? Number(count).toLocaleString('en-US') : ''} entries works.`)}
${block('The law of the day', code('today/', 260), 'The same card, showing a different entry every day. Paste it once.')}
${faq.html}${hubNav('data/', { base })}  </div>
</section>
`;

  const description = 'Embed any of the named laws in this index on your own site with one line of HTML — a self-contained card, no script, no tracking, CC BY 4.0.';

  const jsonld = hubJsonLd({
    name: 'Put a law on your own site',
    description,
    path: 'embed/',
    items: [],
    origin,
    base,
  });

  return head({
    title: 'Embed a Named Law — One Line of HTML | The Law Tome',
    description, base, origin, path: 'embed/',
    jsonld: [...jsonld, ...(faq.jsonld ? [faq.jsonld] : [])],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
