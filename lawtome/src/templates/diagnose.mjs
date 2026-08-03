// /diagnose/ — arrive with a problem, leave with the laws that describe it.
//
// The site's best door is /situations/, and it is still a list you scan. This
// is the same data asked as questions: where is it happening, what kind of
// thing is failing, what did you already try. Three or four answers narrow 324
// curated situations to a handful, and every one shown says WHY it matched.
//
// What this is not, and says it is not: a diagnosis. It is a filter over
// human-written situation phrases, and the output is "these describe what you
// described", not "this is your problem". Nothing is scored, nothing is
// inferred, and no entry appears whose situation phrase an editor did not
// write. Getting that framing wrong would make it the worst page on the site
// rather than the best.
//
// The questions are answerable from data we hold:
//   * the FIELD of the matching entry (20 controlled values, grouped here into
//     six plain-language settings),
//   * the entry's RELIABILITY, so "how much weight will this carry" is askable,
//   * free text, matched against the situation phrase and its cue words with
//     the same fold() the corpus search uses.

import { head, sprite, header, footer, escapeHtml, shareRow } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/**
 * The twenty fields, grouped into the six settings a person recognises.
 *
 * A reader with a problem does not think "is this sociology or management",
 * they think "this is happening in my team". Each group names the corpus
 * categories it covers, so the mapping is inspectable rather than magic, and a
 * category missing from every group still reaches the results through the
 * text box — it is only absent from the first question.
 */
export const SETTINGS = [
  { key: 'work', label: 'At work — a team, a project, an organisation',
    fields: ['management', 'planning', 'software', 'technology', 'economics'] },
  { key: 'people', label: 'Between people — persuasion, conflict, judgement',
    fields: ['psychology', 'sociology', 'philosophy'] },
  { key: 'thinking', label: 'In an argument — reasoning, evidence, proof',
    fields: ['logic', 'mathematics', 'statistics', 'law'] },
  { key: 'systems', label: 'In a system — a machine, a network, a market',
    fields: ['software', 'technology', 'physics', 'chemistry', 'statistics'] },
  { key: 'media', label: 'In public — media, audiences, information',
    fields: ['media', 'linguistics', 'sociology'] },
  { key: 'world', label: 'In the natural world — bodies, species, the planet',
    fields: ['biology', 'medicine', 'earth-science', 'astronomy'] },
];

/**
 * The payload the page carries: one row per curated situation.
 *
 * Deliberately small and inlined rather than fetched — this is a few hundred
 * short strings, and a page whose whole job is to answer in one interaction
 * should not open with a network round-trip.
 */
export function diagnoseData(situations = [], rawSituations = []) {
  const cues = new Map();
  for (const s of (Array.isArray(rawSituations) ? rawSituations : [])) {
    if (s && s.law && Array.isArray(s.cues)) cues.set(`${s.law}|${s.situation}`, s.cues);
  }
  return (Array.isArray(situations) ? situations : [])
    .filter((s) => s && s.law && s.situation)
    .map((s) => ({
      t: s.situation,
      s: s.law.slug,
      n: s.law.name,
      f: s.law.category || '',
      r: s.law.reliability || '',
      c: (cues.get(`${s.law.slug}|${s.situation}`) || []).join(' '),
    }));
}

export function diagnosePage(rows = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const total = rows.length;
  const fields = [...new Set(rows.map((r) => r.f).filter(Boolean))];

  const settingButtons = SETTINGS.map((g) => {
    const n = rows.filter((r) => g.fields.includes(r.f)).length;
    return `        <button class="dg-opt" type="button" data-q="setting" data-v="${escapeHtml(g.key)}" ${n ? '' : 'disabled'}>
          <span class="dg-opt-t">${escapeHtml(g.label)}</span><span class="dg-opt-n">${n}</span>
        </button>`;
  }).join('\n');

  const answer = `Describe what is going wrong and this page narrows ${num(total)} curated situations — each one written by hand against a specific entry — down to the named laws that describe it, with the reason each was matched.`;

  const lede = 'This is a filter, not a diagnosis. Every line it can show you was written by an editor against one entry, so it can only ever tell you "somebody wrote this down as a description of that law" — which is the useful thing, and is also the whole of it. It will not tell you what to do, it does not rank by confidence, and where nothing matches it says so rather than reaching for the nearest thing.';

  const faq = hubFaq([
    { q: 'What does this actually do?', a: `It filters ${num(total)} hand-written situation descriptions by the setting you pick and the words you type, and shows the entries they belong to. Nothing is scored or inferred; the matching is on the words an editor wrote and the synonyms they recorded alongside them.` },
    { q: 'Why does it not cover every law?', a: `Because a situation is a written sentence, not a derived one. ${num(total)} of the index's entries have one; the rest are reached by name, by field, or through <a href="${base}browse/">search</a>. Padding the map with machine-generated phrases would make this page worse, not bigger.` },
    { q: 'Can it be wrong?', a: 'It can be unhelpful — it can show you a law that does not fit, or nothing at all. It cannot be wrong about what it claims, because it claims only that somebody wrote this description against this entry. Whether the law applies to your case is a judgement it deliberately leaves to you.' },
    { q: 'What if nothing matches?', a: `Then nothing is shown and the page says so. Try the setting question on its own, or start from <a href="${base}situations/">the full list</a> — 324 descriptions is short enough to read.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'What is the law for this?',
    sub: `${num(total)} situations`,
    answer,
    lede,
    stats: [[num(total), 'situations'], [fields.length, 'fields'], ['no', 'guessing']],
    base,
    crumbs: [['situations/', "What's the law for…?"]],
  })}    <div class="dg" id="dg">
      <fieldset class="dg-q" id="dg-q1">
        <legend class="dg-legend"><span class="dg-step">1</span> Where is this happening?</legend>
${settingButtons}
        <button class="dg-opt dg-opt--any" type="button" data-q="setting" data-v="">
          <span class="dg-opt-t">Anywhere / not sure</span><span class="dg-opt-n">${total}</span>
        </button>
      </fieldset>

      <fieldset class="dg-q" id="dg-q2">
        <legend class="dg-legend"><span class="dg-step">2</span> Describe it in your own words</legend>
        <label class="search search--filter" for="dg-text">
          <i class="ti ti-search" aria-hidden="true"></i>
          <input id="dg-text" type="search" autocomplete="off"
                 placeholder="the metric went up but nothing improved…"
                 aria-label="Describe what is going wrong">
        </label>
        <p class="dg-hint">Plain words work better than jargon. Leave it empty to see everything in the setting you chose.</p>
      </fieldset>

      <fieldset class="dg-q" id="dg-q3">
        <legend class="dg-legend"><span class="dg-step">3</span> How much weight does it need to carry?</legend>
        <button class="dg-opt dg-opt--sm" type="button" data-q="tier" data-v="">Anything</button>
        <button class="dg-opt dg-opt--sm" type="button" data-q="tier" data-v="Empirical">Measured findings only</button>
        <button class="dg-opt dg-opt--sm" type="button" data-q="tier" data-v="Heuristic">Rules of thumb are fine</button>
        <p class="dg-hint">"Measured findings only" keeps the entries this index rates <a href="${base}is-it-real/">Empirical</a> — the ones resting on studies rather than on a saying.</p>
      </fieldset>

      <div class="dg-out" id="dg-out" role="status" aria-live="polite"></div>
      <div class="dg-share" id="dg-share" hidden>
        <p class="dg-hint">This filter is in the address bar — the link below reopens exactly what you are looking at.</p>
${shareRow({ title: 'What is the law for this?', label: 'Share this filter', live: true, compact: true })}      </div>
      <noscript><p class="dg-hint">This page needs JavaScript to filter. Without it, <a href="${base}situations/">the full list of ${num(total)} situations</a> is plain HTML and works everywhere.</p></noscript>
    </div>
${faq.html}${hubNav('situations/', { base })}  </div>
</section>
`;

  const description = `Describe what is going wrong and get the named laws that describe it — a filter over ${num(total)} hand-written situations, with the reason for every match.`;

  const scripts = `<script id="dg-data" type="application/json">${JSON.stringify(rows).replace(/</g, '\\u003c')}</script>
<script>${DIAGNOSE_JS.replace('__SETTINGS__', JSON.stringify(SETTINGS.map((g) => [g.key, g.fields]))).replace('__BASE__', JSON.stringify(base))}</script>`;

  return head({
    title: 'What Is the Law for This? — Describe the Problem | The Law Tome',
    description, base, origin, path: 'diagnose/',
    jsonld: [
      ...hubJsonLd({
        crumbs: [['situations/', "What's the law for…?"]], name: 'What is the law for this?', description, path: 'diagnose/', items: [], origin, base }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'situations', count }) + section + footer({ base, scripts });
}

/**
 * The filter itself. Small enough to inline, and inlined on purpose: the page's
 * entire value is that it answers in one interaction, and a separate script
 * request is one round-trip between the reader and the answer.
 *
 * Matching folds the same way assets/search.js does, so "murphys" and "gödel"
 * behave here exactly as they do in the corpus search. Every result carries the
 * sentence that matched, because a filter that shows a law without showing why
 * is asking to be trusted rather than read.
 */
const DIAGNOSE_JS = `(function(){
  var el = document.getElementById('dg'); if (!el) return;
  var raw = document.getElementById('dg-data');
  var ROWS = []; try { ROWS = JSON.parse(raw.textContent); } catch (e) { return; }
  var GROUPS = __SETTINGS__, BASE = __BASE__;
  var out = document.getElementById('dg-out');
  var text = document.getElementById('dg-text');
  var state = { setting: null, tier: '' };
  var share = document.getElementById('dg-share');

  /* The filter lives in the address bar.
     A page that answers a question and then cannot be linked to is a page you
     have to describe to somebody instead of sending to them, so every answer
     rewrites the URL — with replaceState, because the three controls are one
     act of asking, not three steps to walk back through. */
  function readUrl(){
    var p;
    try { p = new URLSearchParams(location.search); } catch (e) { return; }
    var inq = p.get('in'); if (inq && fieldsFor(inq)) state.setting = inq;
    var tr = p.get('tier'); if (tr === 'Empirical' || tr === 'Heuristic') state.tier = tr;
    var q = p.get('q'); if (q && text) text.value = q;
    mark('setting', state.setting || '');
    mark('tier', state.tier);
  }
  function mark(q, v){
    var peers = el.querySelectorAll('.dg-opt[data-q="' + q + '"]');
    for (var p=0;p<peers.length;p++) peers[p].classList.toggle('on', (peers[p].getAttribute('data-v') || '') === v);
  }
  function writeUrl(){
    if (!window.history || !history.replaceState) return;
    var parts = [];
    if (state.setting) parts.push('in=' + encodeURIComponent(state.setting));
    if (text && text.value.trim()) parts.push('q=' + encodeURIComponent(text.value.trim()));
    if (state.tier) parts.push('tier=' + encodeURIComponent(state.tier));
    var url = location.pathname + (parts.length ? '?' + parts.join('&') : '') + location.hash;
    history.replaceState(null, '', url);
    if (share) share.hidden = !parts.length;
  }

  function fold(s){return String(s==null?'':s).normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/['\\u2019\\u02bc\\u2018\`\\u00b4]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
  var STOP = {the:1,a:1,an:1,and:1,or:1,but:1,of:1,to:1,in:1,on:1,at:1,is:1,are:1,was:1,it:1,its:1,my:1,our:1,we:1,i:1,you:1,they:1,that:1,this:1,for:1,with:1,not:1,no:1,so:1,as:1,be:1,been:1,has:1,have:1,had:1,do:1,does:1,did:1,keeps:1,keep:1,got:1,get:1};

  function fieldsFor(key){for(var i=0;i<GROUPS.length;i++){if(GROUPS[i][0]===key)return GROUPS[i][1];}return null;}

  function render(){
    writeUrl();
    var terms = fold(text ? text.value : '').split(' ').filter(function(t){return t.length>2 && !STOP[t];});
    var fields = state.setting ? fieldsFor(state.setting) : null;
    var hits = [];
    for (var i=0;i<ROWS.length;i++){
      var r = ROWS[i];
      if (fields && fields.indexOf(r.f) === -1) continue;
      if (state.tier && r.r !== state.tier) continue;
      var blob = fold(r.t + ' ' + r.c + ' ' + r.n);
      var score = 0, missed = false;
      for (var t=0;t<terms.length;t++){
        if (blob.indexOf(terms[t]) === -1) { missed = true; break; }
        score++;
      }
      if (missed) continue;
      hits.push({ r: r, score: score });
    }
    // Second pass, only when the first found nothing: somebody describing a
    // problem in a sentence uses words no editor did, and requiring every word
    // is the difference between one hit and none on "the metric went up but
    // nothing improved". Ranked by how much of the query landed, and never
    // reached while an exact match exists.
    var loose = false;
    if (!hits.length && terms.length > 1) {
      loose = true;
      for (var j=0;j<ROWS.length;j++){
        var rr = ROWS[j];
        if (fields && fields.indexOf(rr.f) === -1) continue;
        if (state.tier && rr.r !== state.tier) continue;
        var bl = fold(rr.t + ' ' + rr.c + ' ' + rr.n), sc = 0;
        for (var u=0;u<terms.length;u++) if (bl.indexOf(terms[u]) !== -1) sc++;
        if (sc) hits.push({ r: rr, score: sc });
      }
      hits = hits.slice(0, 40);
    }
    // A typed query ranks by how much of it landed; without one the order is
    // the editor's, which is the order the situations file was written in.
    if (terms.length) hits.sort(function(a,b){return b.score-a.score;});
    var shown = hits.slice(0, loose ? 8 : 12);

    while (out.firstChild) out.removeChild(out.firstChild);
    var head = document.createElement('p');
    head.className = 'dg-count';
    if (!hits.length) {
      head.textContent = terms.length
        ? 'Nothing here describes that. Try fewer words, or a different setting.'
        : 'Nothing in that setting yet.';
      out.appendChild(head);
      return;
    }
    head.textContent = (loose ? 'Nothing matched every word. ' : '')
      + hits.length + (hits.length === 1 ? ' situation matches' : ' situations match')
      + (loose ? ' part of it' : '')
      + (hits.length > shown.length ? ' — the closest ' + shown.length + ' are below' : '');
    out.appendChild(head);

    for (var k=0;k<shown.length;k++){
      var row = shown[k].r;
      var a = document.createElement('a');
      a.className = 'dg-hit';
      a.href = BASE + 'laws/' + row.s + '/';
      var q = document.createElement('span'); q.className = 'dg-hit-s'; q.textContent = row.t;
      var n = document.createElement('span'); n.className = 'dg-hit-n'; n.textContent = row.n;
      var m = document.createElement('span'); m.className = 'dg-hit-m';
      m.textContent = row.r ? row.r : '';
      a.appendChild(q); a.appendChild(n); a.appendChild(m);
      out.appendChild(a);
    }
  }

  var btns = el.querySelectorAll('.dg-opt');
  for (var b=0;b<btns.length;b++){
    btns[b].addEventListener('click', function(){
      var q = this.getAttribute('data-q'), v = this.getAttribute('data-v');
      state[q] = v || (q === 'setting' ? null : '');
      mark(q, v || '');
      render();
    });
  }
  if (text) text.addEventListener('input', render);
  readUrl();
  render();
})();`;
