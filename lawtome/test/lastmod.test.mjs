import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LASTMOD_TOKEN, pageHash, resolve, stamp, manifestFile,
} from '../build/lastmod.mjs';

const page = (body) => `<html><meta property="article:modified_time" content="${LASTMOD_TOKEN}">${body}</html>`;

// ---- the property the whole design rests on --------------------------------

test('a page hashes the same whatever date it will end up stamped with', () => {
  // This is the point of the token. If the rendered HTML carried a real date,
  // the hash would change every day, every page would look modified every day,
  // and we would be back to the bug this module exists to fix — only with more
  // machinery. The date is a hole in the page until after the hash is taken.
  const html = page('<p>Goodhart</p>');
  const a = pageHash(html);
  const b = pageHash(html);
  assert.equal(a, b);
  assert.notEqual(stamp(html, '2026-01-01'), stamp(html, '2026-08-04'));
  assert.equal(pageHash(stamp(html, '2026-01-01')) === a, false,
    'sanity: stamping really does change the bytes, so the token is doing the work');
});

test('the same page built for two different origins hashes identically', () => {
  // The failure this prevents is silent and total. Every page carries its
  // canonical URL and hundreds of hrefs, so a build for the github.io path and
  // a build for the custom domain produce different bytes for identical
  // content. Unnormalised, a manifest committed from a local build matches
  // nothing in CI, CI re-dates the whole site every deploy, and CI does not
  // commit a manifest — so it never converges. The feature would be installed,
  // green, and useless.
  const A = ['https://x.github.io/law-tome/', '/law-tome/'];
  const B = ['https://pub.example/site/', '/site/'];
  const at = (pre) => page(`<link rel="canonical" href="${pre[0]}laws/g/"><a href="${pre[1]}browse/">b</a>`);
  assert.equal(pageHash(at(A), A), pageHash(at(B), B));
  // …and without the prefixes they differ, so the test is testing something.
  assert.notEqual(pageHash(at(A)), pageHash(at(B)));
});

test('a link to the publisher survives normalisation even when it matches the origin', () => {
  // The subtlest of the three. Templates link to the publisher's own domain in
  // the footer and in parentOrganization, and those links mean the same thing
  // wherever the site is served — they are content, not a deploy detail. When
  // the site happened to be served FROM that domain, normalising the bare origin
  // rewrote them in one build and not the other, and the two disagreed on 1,798
  // of 2,969 pages. Only the site's own URL prefix may be normalised.
  const PUB = '<a href="https://pub.example/founder/">who</a>';
  const served = pageHash(page(`<link rel="canonical" href="https://pub.example/site/g/">${PUB}`), ['https://pub.example/site/', '/site/']);
  const elsewhere = pageHash(page(`<link rel="canonical" href="https://other.test/site/g/">${PUB}`), ['https://other.test/site/', '/site/']);
  assert.equal(served, elsewhere);
});

test('percent-encoded origins are normalised too', () => {
  // Found by measurement, not by reading the code. With only the plain form
  // normalised, a cross-origin rebuild still reported 1,798 of 2,969 pages
  // changed — the share row on every page carries the page's own URL
  // percent-encoded as a query parameter, and that form went straight into the
  // hash. The count falling instead of reaching zero is what gave it away.
  const A = ['https://x.test/s/', 'https://x.test', '/s/'];
  const B = ['https://y.test/s/', 'https://y.test', '/s/'];
  const at = (pre) => page(`<a href="https://bsky.app/intent?text=${encodeURIComponent(`${pre[0]}laws/g/`)}">share</a>`);
  assert.equal(pageHash(at(A), A), pageHash(at(B), B));
});

test('the longest prefix is consumed first so no origin fragment survives', () => {
  const pre = ['https://x.test/sub/', 'https://x.test', '/sub/'];
  const h = pageHash('<a href="https://x.test/sub/a/">x</a>', pre);
  assert.equal(h, pageHash('<a href="/sub/a/">x</a>', ['/sub/']),
    'origin+base and base alone must normalise to the same thing');
});

test('a real content change changes the hash', () => {
  assert.notEqual(pageHash(page('<p>Goodhart</p>')), pageHash(page('<p>Campbell</p>')));
});

test('stamp replaces every occurrence, not just the first', () => {
  const html = `${LASTMOD_TOKEN} middle ${LASTMOD_TOKEN}`;
  assert.equal(stamp(html, '2026-08-04'), '2026-08-04 middle 2026-08-04');
  assert.doesNotMatch(stamp(html, '2026-08-04'), /@@/);
});

test('stamping a page with no token is a no-op rather than an error', () => {
  assert.equal(stamp('<html>plain</html>', '2026-08-04'), '<html>plain</html>');
  assert.equal(stamp('', '2026-08-04'), '');
});

// ---- the decision table ------------------------------------------------------

const TODAY = '2026-08-04';

test('an unchanged page keeps the date it was recorded with', () => {
  const html = page('a');
  const prev = { pages: { 'x/': { hash: pageHash(html), date: '2026-03-01' } } };
  const { dates } = resolve({ 'x/': html }, prev, TODAY);
  assert.equal(dates['x/'], '2026-03-01', 'an untouched page did not change today');
});

test('a changed page moves to today', () => {
  const prev = { pages: { 'x/': { hash: pageHash(page('old')), date: '2026-03-01' } } };
  const { dates } = resolve({ 'x/': page('new') }, prev, TODAY);
  assert.equal(dates['x/'], TODAY);
});

test('a page never seen before is dated today', () => {
  const { dates } = resolve({ 'new/': page('a') }, { pages: {} }, TODAY);
  assert.equal(dates['new/'], TODAY);
});

test('a missing, empty or malformed manifest dates everything today rather than throwing', () => {
  for (const prev of [undefined, null, {}, { pages: null }, { pages: 'nonsense' }]) {
    const { dates } = resolve({ 'x/': page('a') }, prev, TODAY);
    assert.equal(dates['x/'], TODAY, `manifest ${JSON.stringify(prev)} should degrade, not throw`);
  }
});

test('a deleted page drops out of the next manifest', () => {
  const prev = { pages: { 'gone/': { hash: 'abc', date: '2026-01-01' }, 'kept/': { hash: pageHash(page('a')), date: '2026-01-01' } } };
  const { manifest } = resolve({ 'kept/': page('a') }, prev, TODAY);
  assert.deepEqual(Object.keys(manifest.pages), ['kept/']);
});

test('the next manifest records what was actually published', () => {
  const html = page('a');
  const { manifest, dates } = resolve({ 'x/': html }, { pages: {} }, TODAY);
  assert.equal(manifest.pages['x/'].hash, pageHash(html));
  assert.equal(manifest.pages['x/'].date, dates['x/']);
});

test('the manifest round-trips through JSON unchanged', () => {
  // It is committed to git, so it has to survive serialisation exactly or the
  // next build sees spurious changes on every page.
  const first = resolve({ 'x/': page('a'), 'y/': page('b') }, { pages: {} }, TODAY).manifest;
  const reloaded = JSON.parse(JSON.stringify(first));
  const second = resolve({ 'x/': page('a'), 'y/': page('b') }, reloaded, '2026-12-25');
  assert.equal(second.dates['x/'], TODAY, 'a round-tripped manifest must not look changed');
  assert.equal(second.dates['y/'], TODAY);
});

test('keys are written in sorted order so the committed file has a stable diff', () => {
  const { manifest } = resolve({ 'z/': page('a'), 'a/': page('b'), 'm/': page('c') }, { pages: {} }, TODAY);
  assert.deepEqual(Object.keys(manifest.pages), ['a/', 'm/', 'z/']);
});

test('resolve reports which pages changed, so a build can say so', () => {
  const prev = { pages: { same: { hash: pageHash(page('a')), date: '2026-01-01' }, diff: { hash: 'x', date: '2026-01-01' } } };
  const { changed } = resolve({ same: page('a'), diff: page('b'), fresh: page('c') }, prev, TODAY);
  assert.deepEqual(changed.sort(), ['diff', 'fresh']);
});

// ---- the shipped manifest ----------------------------------------------------

test('the committed manifest path is inside src/data so it is version-controlled', () => {
  // dist/ is gitignored and CI builds from a clean checkout. A manifest that
  // lived beside the output would be empty on every CI run, every page would
  // look new, and lastmod would be exactly as useless as the build date it
  // replaced — just more expensively.
  assert.match(manifestFile, /^src\/data\//);
});
