// Wave pages: the Tome's answer to a viral moment, built from one sourced data
// file in src/data/waves/. A wave produces two things:
//
//   1. a takeover at the top of the law page while the wave is live, so the
//      question people arrive with is answered first on the page Google already
//      knows (Tier 1 of reports/Capturing viral waves end to end, private repo);
//   2. a standalone page at /wild/<slug>/ with its own headline, card and
//      original work, the thing people share and cite (Tier 2).
//
// ANTI-FABRICATION: every claim about the event comes from data.sources, each
// opened and read (`checked`). The worked example is our own arithmetic on
// stated, illustrative assumptions and is labelled as such. Predictions are our
// reading, dated, and get scored later.

import { head, sprite, header, footer, escapeHtml, fitTitle, clampDescription, asset } from './partials.mjs';

// Pages that show a wave link this stylesheet themselves (see wave.css for why).
export const waveCss = (base) => `<link rel="stylesheet" href="${asset(base, 'assets/wave.css')}">`;

const e = escapeHtml;
const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const monthYear = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Is the takeover still on? It runs from publication until `takeoverUntil`. */
export function takeoverActive(wave, today) {
  return Boolean(wave && wave.status === 'developing' && wave.takeoverUntil && today <= wave.takeoverUntil);
}

/** The inner HTML of the law-page takeover block. The block's H2 is the wave's question. */
export function takeoverInner(wave, { base = '/' } = {}) {
  const url = `${base}wild/${e(wave.slug)}/`;
  return `        ${waveCss(base)}
        <div class="wave-take">
          <p class="wave-take-tag"><span class="wave-dot" aria-hidden="true"></span>${e(monthYear(wave.publishedAt))}${wave.status === 'developing' ? ' · developing' : ''}</p>
          <p class="lead">${e(wave.answer)}</p>
          <p class="wave-take-more"><a href="${url}">The full story, with the maths that does it →</a></p>
        </div>`;
}

function shareRow(title) {
  return `<div class="wave-share">
          <button type="button" class="btn wave-share-btn" data-wave-share data-title="${e(title)}"><i class="ti ti-copy" aria-hidden="true"></i> Share this</button>
          <span class="wave-share-ok" data-wave-share-ok hidden>Link copied</span>
        </div>`;
}

function predictBlock(p) {
  return `<section class="wave-sec wave-predict" aria-labelledby="w-predict">
        <p class="lbl">Before you read on</p>
        <h2 class="block-h" id="w-predict">Make a guess</h2>
        <p>${e(p.q)}</p>
        <div class="wave-opts" role="group" aria-label="Your guess">
${p.options.map((o, i) => `          <button type="button" class="wave-opt" data-opt="${i}">${e(o)}</button>`).join('\n')}
        </div>
        <div class="wave-reveal" data-reveal-box hidden data-answer="${p.answer}">
          <p class="wave-verdict" data-verdict></p>
          <p>${e(p.reveal)}</p>
          <figure class="wave-plot">
            <canvas width="720" height="300" aria-label="Pitch over time for a plane passing 300 m away and 1 km away" data-plot></canvas>
            <label class="wave-slider">Distance from the flight path: <strong data-dist-out>300 m</strong>
              <input type="range" min="100" max="2000" step="50" value="300" data-dist></label>
            <figcaption>Pitch heard on the ground as the plane passes (illustrative: 100 Hz tone, 60 m/s, still air). Drag to move yourself.</figcaption>
          </figure>
        </div>
      </section>`;
}

// One small script, run only on interaction: the guess reveal, the plot and the
// share button. No library, no network.
const WAVE_JS = `(function(){
var c=343,f0=100,v=60;function f(t,d){var x=v*t;return f0*c/(c+v*x/Math.sqrt(x*x+d*d))}
function draw(cv,d){var g=cv.getContext('2d'),W=cv.width,H=cv.height,cs=getComputedStyle(document.documentElement);
var ink=cs.getPropertyValue('--muted').trim()||'#888',acc=cs.getPropertyValue('--accent').trim()||'#e0a43f',line=cs.getPropertyValue('--line').trim()||'#444';
g.clearRect(0,0,W,H);var T=90,lo=80,hi=125,px=function(t){return 40+(t+T)/(2*T)*(W-60)},py=function(fr){return H-30-(fr-lo)/(hi-lo)*(H-50)};
g.strokeStyle=line;g.lineWidth=1;g.beginPath();g.moveTo(40,10);g.lineTo(40,H-30);g.lineTo(W-20,H-30);g.stroke();
g.fillStyle=ink;g.font='12px "Space Mono",monospace';g.fillText('pitch',4,20);g.fillText('time \\u2192 (closest approach in the middle)',W-330,H-10);
function curve(dd,col,w){g.strokeStyle=col;g.lineWidth=w;g.beginPath();for(var t=-T;t<=T;t+=0.5){var X=px(t),Y=py(f(t,dd));t===-T?g.moveTo(X,Y):g.lineTo(X,Y)}g.stroke()}
curve(1000,ink,1.5);curve(d,acc,3);var lx=W-190;g.lineWidth=3;g.strokeStyle=acc;g.beginPath();g.moveTo(lx,26);g.lineTo(lx+24,26);g.stroke();g.fillStyle=acc;g.fillText('you, '+d+' m away',lx+32,30);
g.lineWidth=1.5;g.strokeStyle=ink;g.beginPath();g.moveTo(lx,46);g.lineTo(lx+24,46);g.stroke();g.fillStyle=ink;g.fillText('1 km away',lx+32,50)}
document.addEventListener('click',function(ev){var o=ev.target.closest('[data-opt]');if(o){var box=document.querySelector('[data-reveal-box]');if(!box)return;
var ok=+o.dataset.opt===+box.dataset.answer;document.querySelectorAll('[data-opt]').forEach(function(b){b.disabled=true;b.classList.toggle('is-right',+b.dataset.opt===+box.dataset.answer)});
box.querySelector('[data-verdict]').textContent=ok?'Right.':'Not quite.';box.hidden=false;var cv=box.querySelector('[data-plot]'),r=box.querySelector('[data-dist]'),out=box.querySelector('[data-dist-out]');
draw(cv,+r.value);r.addEventListener('input',function(){out.textContent=r.value+' m';draw(cv,+r.value)});return}
var s=ev.target.closest('[data-wave-share]');if(s){var u=location.href.split('#')[0];if(navigator.share){navigator.share({title:s.dataset.title,url:u}).catch(function(){})}
else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){var k=document.querySelector('[data-wave-share-ok]');if(k){k.hidden=false;setTimeout(function(){k.hidden=true},2000)}})}}});
})();`;

/**
 * The standalone wave page.
 * @param {object} wave  a src/data/waves/*.json record
 * @param {object} law   the law it belongs to
 * @param {object} o     { base, origin, count, categoryLabel, follow }
 */
export function wavePage(wave, law, { base = '/', origin = '', count, categoryLabel = '', follow = null } = {}) {
  const path = `wild/${wave.slug}/`;
  const url = `${origin}${base}${path}`;
  const lawUrl = `${base}laws/${law.slug}/`;
  const src = (i) => wave.sources[i];
  const tz = '+05:30';
  const cite = `${wave.author.name.split(' ').reverse().join(', ').replace(/, (\w)\w*$/, ', $1.')} (${wave.publishedAt.slice(0, 4)}, ${fmtDate(wave.publishedAt)}). ${wave.h1}. The Law Tome. ${url}`;

  const jsonld = [
    {
      '@context': 'https://schema.org', '@type': 'AnalysisNewsArticle',
      headline: wave.h1, description: wave.answer, url,
      datePublished: `${wave.publishedAt}T09:00:00${tz}`, dateModified: `${wave.updatedAt}T09:00:00${tz}`,
      author: { '@type': 'Person', name: wave.author.name, url: wave.author.url },
      publisher: { '@type': 'Organization', name: 'The Law Tome', url: `${origin}${base}` },
      image: [`${origin}${base}og/wild/${wave.slug}-16x9.png`, `${origin}${base}og/wild/${wave.slug}.png`],
      about: { '@type': 'DefinedTerm', name: law.name, url: `${origin}${lawUrl}`, ...(law.sameAs ? { sameAs: law.sameAs } : {}) },
      citation: wave.sources.map((s) => ({ '@type': 'CreativeWork', name: s.text, url: s.url })),
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: law.name, item: `${origin}${lawUrl}` },
        { '@type': 'ListItem', position: 3, name: wave.h1, item: url },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: wave.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  const followHtml = follow && follow.action
    ? `<form class="wave-follow" action="${e(follow.action)}" method="post" target="_blank">
          <label for="w-email">Email me when ${e(law.name.replace(/^The /, 'the '))} is in the news again</label>
          <div class="wave-follow-row"><input id="w-email" type="email" name="email" required autocomplete="email" placeholder="you@example.com"><button class="btn" type="submit">Follow</button></div>
          <p class="wave-fine">One email when it next makes the news. Nothing else.</p>
        </form>`
    : `<div class="wave-follow">
          <p>Want the next time ${e(law.name.replace(/^The /, 'the '))} is in the news? <a href="${base}category/${e(law.category)}/feed.xml">Follow ${e(categoryLabel || law.category)} by RSS</a>.</p>
        </div>`;

  return head({
    title: fitTitle(wave.title),
    description: clampDescription(wave.answer),
    base, origin, path,
    og: { type: 'article', title: wave.h1, description: wave.answer, image: `${base}og/wild/${wave.slug}.png` },
    published: `${wave.publishedAt}T09:00:00${tz}`, modified: `${wave.updatedAt}T09:00:00${tz}`,
    jsonld,
  }) + sprite() + header({ base, count }) + `
  ${waveCss(base)}
  <article class="wrap wave">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${base}">Home</a> / <a href="${lawUrl}">${e(law.name)}</a> / In the wild</nav>
    <p class="wave-kicker"><span class="wave-dot" aria-hidden="true"></span>In the wild · ${e(fmtDate(wave.publishedAt))}${wave.status === 'developing' ? ' · developing' : ''}</p>
    <h1 class="wave-h1">${e(wave.h1)}</h1>
    <p class="wave-answer">${e(wave.answer)}</p>
    <div class="wave-meta">
      <span>By <a href="${e(wave.author.url)}" rel="author">${e(wave.author.name)}</a></span>
      <span>Updated <time datetime="${e(wave.updatedAt)}">${e(fmtDate(wave.updatedAt))}</time></span>
      <span>${wave.sources.length} sources, each opened and read</span>
    </div>
    ${shareRow(wave.h1)}

    <section class="wave-sec" aria-labelledby="w-what">
      <p class="lbl">What happened</p>
      <h2 class="block-h" id="w-what">The story so far</h2>
      <p>${e(wave.artefact.text)} <a href="${e(wave.artefact.url)}" rel="noopener">See the report</a>.</p>
      <ol class="wave-timeline">
${wave.timeline.map((t) => `        <li><time datetime="${e(t.date)}">${e(fmtDate(t.date))}</time><span>${e(t.text)} <a class="wave-src" href="${e(src(t.source).url)}" rel="noopener">source</a></span></li>`).join('\n')}
      </ol>
    </section>

    ${predictBlock(wave.predict)}

    <section class="wave-sec" aria-labelledby="w-how">
      <p class="lbl">How it works</p>
      <h2 class="block-h" id="w-how">From a hum to a place on the map</h2>
      <ol class="wave-steps">
${wave.mechanism.map((m, i) => `        <li><span class="wave-n">${String(i + 1).padStart(2, '0')}</span><div><h3>${e(m.h)}</h3><p>${e(m.text)}</p></div></li>`).join('\n')}
      </ol>
      <p class="wave-name">The name for step 2 is <a href="${lawUrl}">${e(law.name)}</a>: ${e(law.statement)}</p>
    </section>

    <section class="wave-sec" aria-labelledby="w-calc">
      <p class="lbl">Our worked example</p>
      <h2 class="block-h" id="w-calc">Why the curve gives you away</h2>
      <ul class="wave-calc">
${wave.calc.points.map((p) => `        <li>${e(p)}</li>`).join('\n')}
      </ul>
      <p class="wave-fine">${e(wave.calc.assumptions)} <code>${e(wave.calc.formula)}</code></p>
    </section>

    <section class="wave-sec" aria-labelledby="w-limits">
      <p class="lbl">Where it stops working</p>
      <h2 class="block-h" id="w-limits">The limits</h2>
      <ul class="wave-calc">
${wave.limits.map((l) => `        <li>${e(l)}</li>`).join('\n')}
      </ul>
    </section>

    <section class="wave-sec" aria-labelledby="w-next">
      <p class="lbl">What happens next</p>
      <h2 class="block-h" id="w-next">Our prediction</h2>
${wave.predictions.map((p) => `      <p class="wave-pred">${e(p.text)} <span class="wave-fine">Our reading, not a finding. We'll check it by ${e(fmtDate(p.checkBy))} and say here whether it held.</span></p>`).join('\n')}
    </section>

    <section class="wave-sec" aria-labelledby="w-faq">
      <p class="lbl">Questions</p>
      <h2 class="block-h" id="w-faq">Questions people are asking</h2>
${wave.faqs.map((f) => `      <details class="wave-faq"><summary>${e(f.q)}</summary><p>${e(f.a)}</p></details>`).join('\n')}
    </section>

    <section class="wave-sec wave-how" aria-labelledby="w-know">
      <p class="lbl">How we know this</p>
      <h2 class="block-h" id="w-know">Sources, each opened and read</h2>
      <ol class="wave-sources">
${wave.sources.map((s) => `        <li><a href="${e(s.url)}" rel="noopener">${e(s.text)}</a><span>Supports: ${e(s.supports)}. Checked ${e(fmtDate(s.checked))}.</span></li>`).join('\n')}
      </ol>
      <p class="wave-fine">Written by ${e(wave.author.name)}. Published ${e(fmtDate(wave.publishedAt))}, updated ${e(fmtDate(wave.updatedAt))}. The worked example is our own arithmetic on the stated assumptions.</p>
    </section>

    <section class="wave-sec" aria-labelledby="w-cite">
      <p class="lbl">Use this</p>
      <h2 class="block-h" id="w-cite">Cite or embed</h2>
      <pre class="wave-cite">${e(cite)}</pre>
      <p class="wave-fine">The diagram and curve on this page are free to reuse under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener">CC BY 4.0</a>, credited to "The Law Tome" with a link to this page. <a href="${base}og/wild/${e(wave.slug)}-16x9.png">Download the diagram</a>.</p>
    </section>

    ${followHtml}

    <aside class="wave-law">
      <p class="lbl">The law behind it</p>
      <p><a href="${lawUrl}"><strong>${e(law.name)}</strong></a>: ${e(law.statement)}</p>
      <p class="wave-fine">${e(law.origin || '')}</p>
    </aside>
    ${shareRow(wave.h1)}
  </article>
<script>${WAVE_JS}</script>
` + footer({ base });
}

// ---- images --------------------------------------------------------------------

const C = { bg: '#0b0a09', ink: '#f0ece2', muted: '#a8a293', gold: '#e0a43f', line: '#403e3c' };

// A sample of the curve used in both images, so the picture is the real maths.
function curvePath(x0, y0, w, h, d) {
  const c = 343, f0 = 100, v = 60, T = 90, lo = 80, hi = 125;
  const pts = [];
  for (let t = -T; t <= T; t += 1) {
    const x = v * t, fr = f0 * c / (c + v * x / Math.hypot(x, d));
    pts.push(`${(x0 + (t + T) / (2 * T) * w).toFixed(1)},${(y0 + h - (fr - lo) / (hi - lo) * h).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

const wrap = (text, max) => {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
};

/** 1200x630 social card: the headline, the law, and the curve. Text-led on purpose; social previews reward a hook. */
export function waveCardSvg(wave, law) {
  const lines = wrap(wave.h1, 30).slice(0, 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <text x="72" y="96" font-family="Space Mono" font-size="22" letter-spacing="3" fill="${C.gold}">IN THE WILD · ${e(monthYear(wave.publishedAt).toUpperCase())}</text>
${lines.map((l, i) => `  <text x="72" y="${178 + i * 66}" font-family="Fraunces" font-size="56" fill="${C.ink}">${e(l)}</text>`).join('\n')}
  <path d="${curvePath(640, 360, 480, 170, 1000)}" fill="none" stroke="${C.muted}" stroke-width="3" opacity="0.6"/>
  <path d="${curvePath(640, 360, 480, 170, 300)}" fill="none" stroke="${C.gold}" stroke-width="6"/>
  <text x="72" y="560" font-family="Fraunces" font-size="30" fill="${C.ink}">${e(law.name)}</text>
  <text x="1128" y="560" text-anchor="end" font-family="Space Mono" font-size="20" fill="${C.muted}">conyso.com/lawtome</text>
</svg>`;
}

/** 1600x900 image with no text, for Discover and the article's schema image: wavefronts bunching ahead of a moving source, and the curve. */
export function waveHeroSvg() {
  const rings = [];
  for (let i = 0; i < 9; i++) {
    const r = 70 + i * 62, cx = 820 - i * 34;
    rings.push(`<circle cx="${cx}" cy="430" r="${r}" fill="none" stroke="${C.gold}" stroke-width="3" opacity="${(0.9 - i * 0.08).toFixed(2)}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="${C.bg}"/>
  ${rings.join('\n  ')}
  <path d="M800 430 l70 -16 l-70 -16 z" fill="${C.ink}"/>
  <path d="${curvePath(200, 690, 1200, 160, 300)}" fill="none" stroke="${C.ink}" stroke-width="5" opacity="0.85"/>
</svg>`;
}
