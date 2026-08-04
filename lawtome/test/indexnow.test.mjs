import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  keyFile, validKey, changedUrls, payload, batches, submit, MAX_URLS,
} from '../build/indexnow.mjs';

const BASE = 'https://example.test/lawtome/';
const KEY = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

test('the key file is named after the key and contains it', () => {
  const f = keyFile(KEY);
  assert.equal(f.name, `${KEY}.txt`);
  assert.equal(f.body.trim(), KEY);
});

test('only hex keys of the length the protocol allows are accepted', () => {
  assert.ok(validKey(KEY));
  assert.ok(validKey('abcdef12'));
  assert.ok(!validKey('short'), '7 chars is below the floor');
  assert.ok(!validKey('not-hex-at-all!!'));
  assert.ok(!validKey('a'.repeat(129)));
  assert.ok(!validKey(undefined));
  assert.ok(!validKey(''));
});

// ---- only what changed --------------------------------------------------------

test('submits the pages dated today and nothing else', () => {
  const manifest = { pages: {
    'laws/a/': { date: '2026-08-04' },
    'laws/b/': { date: '2026-03-01' },
    '': { date: '2026-08-04' },
  } };
  assert.deepEqual(changedUrls(manifest, '2026-08-04', BASE), [
    'https://example.test/lawtome/',
    'https://example.test/lawtome/laws/a/',
  ]);
});

test('a build where nothing changed submits nothing', () => {
  const manifest = { pages: { 'laws/a/': { date: '2026-01-01' } } };
  assert.deepEqual(changedUrls(manifest, '2026-08-04', BASE), []);
});

test('a missing or malformed manifest yields no URLs rather than throwing', () => {
  for (const m of [undefined, null, {}, { pages: null }]) {
    assert.deepEqual(changedUrls(m, '2026-08-04', BASE), []);
  }
});

// ---- the payload --------------------------------------------------------------

test('host is derived from the URLs, never passed separately', () => {
  // IndexNow rejects the whole batch if host disagrees with the URLs. Deriving
  // it removes the only way those two can drift apart.
  const p = payload(BASE, KEY, [`${BASE}laws/a/`]);
  assert.equal(p.host, 'example.test');
  assert.equal(p.keyLocation, `https://example.test/${KEY}.txt`);
  assert.equal(p.key, KEY);
  assert.deepEqual(p.urlList, [`${BASE}laws/a/`]);
});

test('keyLocation sits at the domain root even when the site is in a subpath', () => {
  // The key file proves control of the HOST. A key served from /lawtome/ would
  // not, and the submission would be rejected — this is the mistake worth a test.
  assert.equal(payload('https://example.test/deep/path/', KEY, []).keyLocation,
    `https://example.test/${KEY}.txt`);
});

test('submissions are split at the protocol limit', () => {
  const urls = Array.from({ length: MAX_URLS + 5 }, (_, i) => `${BASE}p${i}/`);
  const b = batches(urls);
  assert.equal(b.length, 2);
  assert.equal(b[0].length, MAX_URLS);
  assert.equal(b[1].length, 5);
  assert.deepEqual(b.flat(), urls, 'no URL is dropped or duplicated by batching');
});

// ---- the network call ---------------------------------------------------------

test('a bad key is refused before any request is made', async () => {
  let called = false;
  const r = await submit(BASE, 'nope', [`${BASE}a/`], () => { called = true; });
  assert.equal(r.ok, false);
  assert.equal(called, false);
});

test('nothing to send makes no request and is not an error', async () => {
  let called = false;
  const r = await submit(BASE, KEY, [], () => { called = true; });
  assert.equal(r.ok, true);
  assert.equal(called, false);
});

test('a network failure is reported, never thrown', async () => {
  // A failed ping must not fail a deploy: the site is already live and the
  // sitemap still exists. The worst case is Bing finding the change on its own
  // schedule, which is exactly what happens without this module at all.
  const r = await submit(BASE, KEY, [`${BASE}a/`], () => { throw new Error('DNS'); });
  assert.equal(r.ok, false);
  assert.match(JSON.stringify(r), /DNS/);
});

test('a non-2xx response is reported as not ok', async () => {
  const r = await submit(BASE, KEY, [`${BASE}a/`], async () => ({ status: 422 }));
  assert.equal(r.ok, false);
});

test('a success posts JSON to the documented endpoint', async () => {
  let seen = null;
  const r = await submit(BASE, KEY, [`${BASE}a/`], async (url, init) => {
    seen = { url, init }; return { status: 200 };
  });
  assert.equal(r.ok, true);
  assert.equal(seen.url, 'https://api.indexnow.org/IndexNow');
  assert.equal(seen.init.method, 'POST');
  assert.match(seen.init.headers['Content-Type'], /application\/json/);
  assert.deepEqual(JSON.parse(seen.init.body).urlList, [`${BASE}a/`]);
});
