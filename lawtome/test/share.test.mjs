// Passing an entry on.
//
// The rule this file guards is the one that makes the row worth having: a share
// control must not be a tracker. Nothing here may load a script, reach a
// third-party host at render time, or carry an identifier — the network links
// are plain compose URLs and the copy buttons are local. It also guards the
// quieter failure: a button that needs JavaScript must be hidden until the
// JavaScript that makes it work has run, or the page ships three controls that
// do nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shareRow, footer, sprite } from '../src/templates/partials.mjs';
import { lawPage } from '../src/templates/law.mjs';
import { diagnosePage } from '../src/templates/diagnose.mjs';

const LAW = {
  slug: 'goodharts-law', name: "Goodhart's Law", no: '001',
  statement: 'When a measure becomes a target, it ceases to be a good measure.',
  meaning: 'M', origin: 'O', example: 'E', category: 'economics',
  reliability: 'Heuristic', provenance: 'canon',
};

test('a share row is entirely first-party — no script, no beacon, no id', () => {
  const html = shareRow({ url: 'https://e.com/laws/a/', title: 'Alpha', text: 'S' });
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /googleapis|jsdelivr|cdn\.|sharethis|addthis|analytics/i);
  // Every off-site link is a compose URL the reader chose to open, and carries
  // no referrer-window handle back to us.
  for (const m of html.matchAll(/<a class="sh-b[^"]*" href="(https?:[^"]+)"([^>]*)>/g)) {
    assert.match(m[2], /rel="noopener nofollow"/, `${m[1]} is missing rel`);
    assert.match(m[2], /target="_blank"/);
  }
});

test('the network links carry the entry, and the URL exactly once', () => {
  const html = shareRow({ url: 'https://e.com/laws/a/', title: 'Alpha Law', text: 'A short statement' });
  const enc = encodeURIComponent('https://e.com/laws/a/');
  for (const host of ['x.com', 'bsky.app', 'linkedin.com', 'reddit.com', 'news.ycombinator.com']) {
    const re = new RegExp(`href="https://[^"]*${host.replace('.', '\\.')}[^"]*"`);
    const m = re.exec(html);
    assert.ok(m, `no link for ${host}`);
    assert.ok(m[0].includes(enc), `${host} link does not carry the URL`);
  }
  assert.match(html, /href="mailto:\?subject=Alpha%20Law/);
});

test('the Markdown a reader copies is the entry, not the page furniture', () => {
  const html = shareRow({ url: 'https://e.com/laws/a/', title: 'Alpha Law', text: 'A short statement' });
  assert.match(html, /data-share-md="\[Alpha Law\]\(https:\/\/e\.com\/laws\/a\/\) — A short statement"/);
  // With nothing to quote it degrades to a bare link rather than a dangling dash.
  assert.match(shareRow({ url: 'https://e.com/x/', title: 'X' }), /data-share-md="\[X\]\(https:\/\/e\.com\/x\/\)"/);
});

test('the controls that need JavaScript are hidden until JavaScript unhides them', () => {
  const html = shareRow({ url: 'https://e.com/laws/a/', title: 'Alpha' });
  for (const m of html.matchAll(/<button[^>]*>/g)) assert.match(m[0], /hidden/, `${m[0]} ships visible`);
  // …and the plain links are never hidden, because they work without any of it.
  assert.doesNotMatch(html, /<a class="sh-b[^>]*hidden/);
  // The unhiding is in the shared script, not inline on the page.
  const js = readFileSync('src/assets/common.js', 'utf8');
  assert.match(js, /\[data-share\]/);
  assert.match(js, /native\.hidden = false/);
  assert.match(js, /btn\.hidden = false/);
});

test('a live row shares the address bar, so it offers nothing that could go stale', () => {
  const html = shareRow({ title: 'Anything', live: true });
  assert.match(html, /data-share-url=""/);
  assert.match(html, /data-share-md=""/);
  // A compose URL baked at build time cannot follow a filter, so there are none.
  assert.doesNotMatch(html, /x\.com|bsky|linkedin|reddit|ycombinator|mailto:/);
  assert.match(html, /data-share-copy="url"/);
});

test('the row refuses to render without something to share', () => {
  assert.equal(shareRow({}), '');
  assert.equal(shareRow({ url: 'https://e.com/' }), '');
  assert.equal(shareRow({ title: 'No URL' }), '');
});

test('every icon the row references is defined in the sprite', () => {
  const html = shareRow({ url: 'https://e.com/a/', title: 'A' }) + footer({ base: '/' });
  const svg = sprite();
  for (const m of html.matchAll(/<use href="#(sh-[a-z]+)">/g)) {
    assert.ok(svg.includes(`id="${m[1]}"`), `sprite has no ${m[1]}`);
  }
});

test('the law page offers the entry itself, at its canonical address', () => {
  const html = lawPage(LAW, { base: '/lawtome/', origin: 'https://e.com', categories: { economics: 'Economics' } });
  assert.match(html, /<h3>Pass it on<\/h3>/);
  assert.match(html, /data-share-url="https:\/\/e\.com\/lawtome\/laws\/goodharts-law\/"/);
  // The blurb is the statement in the form it is quoted — not the site's name.
  assert.match(html, /data-share-text="When a measure becomes a target/);
});

test('a law name with markup in it cannot escape the share attributes', () => {
  const html = lawPage({ ...LAW, name: '"><script>x</script>', statement: '<b>&</b>' }, { base: '/', origin: 'https://e.com', categories: {} });
  const row = /<div class="share"[\s\S]*?<\/div>/.exec(html);
  assert.ok(row, 'no share row');
  assert.doesNotMatch(row[0], /<script>/);
  assert.match(row[0], /&quot;&gt;&lt;script&gt;/);
});

test('every page can be passed on, because the footer carries the row', () => {
  const f = footer({ base: '/' });
  assert.match(f, /class="wrap foot-share"/);
  assert.match(f, /data-share-copy="url"/);
  assert.match(f, /data-share-url=""/);          // whatever the reader is looking at
});

test('a /diagnose/ filter is a link — the state is in the URL and shareable', () => {
  const html = diagnosePage([{ t: 'x', s: 'a', n: 'A', f: 'economics', r: 'Heuristic', c: '' }],
    { base: '/', origin: 'https://e.com', count: 1 });
  assert.match(html, /id="dg-share"/);
  // read → mark → render, and every render writes the three answers back out.
  assert.match(html, /new URLSearchParams\(location\.search\)/);
  assert.match(html, /history\.replaceState/);
  for (const k of ['in=', 'q=', 'tier=']) assert.ok(html.includes(`'${k}'`), `state drops ${k}`);
  // Hidden until there is a filter worth sending: an unfiltered page is just
  // the page, and its own URL is already in the address bar.
  assert.match(html, /<div class="dg-share" id="dg-share" hidden>/);
});
