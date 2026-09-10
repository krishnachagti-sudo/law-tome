/* Licence and credit on the images somebody else owns.
 *
 * The site had 2,420 ImageObject nodes and every one was the logo, repeated in
 * the publisher block. The 1,026 figures and portraits — the images a reader
 * actually looks at, drawn from Wikimedia Commons across fifteen different
 * licences — carried no structured attribution at all.
 *
 * The search feature is the smaller half of why this matters. A blanket claim
 * of the site's own CC BY 4.0 across images that are CC BY-SA, CC0 or public
 * domain would be false about most of them and a licence violation for the
 * share-alike ones, so every field here is per image and comes from
 * images.json. Where the record has no licence URL, the field is omitted
 * rather than guessed.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageObject } from '../src/templates/partials.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const images = JSON.parse(fs.readFileSync(path.join(root, 'src/data/images.json'), 'utf8'));
const dist = path.join(root, 'dist/laws');

const nodes = (slug) => {
  const f = path.join(dist, slug, 'index.html');
  if (!fs.existsSync(f)) return [];
  const h = fs.readFileSync(f, 'utf8');
  const out = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      for (const x of (Array.isArray(d) ? d : [d])) {
        if (x['@type'] === 'ImageObject' && x.creditText) out.push(x);
      }
    } catch { /* covered elsewhere */ }
  }
  return out;
};

test('a figure page carries its figure with that figure’s own licence', () => {
  const slugs = Object.keys(images.figures).filter((s) => fs.existsSync(path.join(dist, s, 'index.html')));
  assert.ok(slugs.length > 100, `only ${slugs.length} figure pages found`);
  let checked = 0;
  for (const slug of slugs) {
    const rec = images.figures[slug];
    const found = nodes(slug).find((n) => n.url.includes('/figures/'));
    if (!found) continue;
    checked++;
    assert.equal(found.creator.name, rec.artist, `${slug}: wrong artist`);
    assert.ok(found.creditText.includes(rec.artist), `${slug}: credit does not name the artist`);
    assert.equal(found.acquireLicensePage, rec.source, `${slug}: wrong source page`);
    if (rec.licenceUrl) {
      assert.equal(found.license, rec.licenceUrl, `${slug}: licence does not match the record`);
    } else {
      assert.equal(found.license, undefined,
        `${slug}: asserts a licence the record does not have`);
    }
  }
  assert.ok(checked > 100, `only ${checked} figures verified`);
});

test('no image is published under the site’s own licence unless it is', () => {
  // The site's text is CC BY 4.0. Most of these images are not.
  const site = 'https://creativecommons.org/licenses/by/4.0';
  for (const [slug, rec] of Object.entries(images.figures)) {
    const found = nodes(slug).find((n) => n.url.includes('/figures/'));
    if (!found || !found.license) continue;
    if (found.license.startsWith(site)) {
      assert.ok(rec.licenceUrl && rec.licenceUrl.startsWith(site),
        `${slug}: published as CC BY 4.0 but the record says ${rec.licence}`);
    }
  }
});

test('public-domain images credit the artist and claim no licence', () => {
  const pd = Object.entries(images.figures).filter(([, r]) => r.licence === 'Public domain');
  let seen = 0;
  for (const [slug, rec] of pd) {
    const found = nodes(slug).find((n) => n.url.includes('/figures/'));
    if (!found) continue;
    seen++;
    assert.equal(found.license, undefined, `${slug}: public domain with a licence URL`);
    assert.match(found.copyrightNotice, /public domain/, `${slug}: notice does not say public domain`);
    if (rec.artist) assert.equal(found.creator.name, rec.artist);
  }
  assert.ok(seen > 20, `only ${seen} public-domain figures checked`);
});

test('the helper refuses to invent anything it was not given', () => {
  assert.equal(imageObject(null, { url: 'x' }), null);
  assert.equal(imageObject({ artist: 'A' }, {}), null, 'no url means no node');
  const bare = imageObject({ artist: 'A' }, { url: 'https://x/y.webp' });
  assert.equal(bare.license, undefined, 'invented a licence');
  assert.equal(bare.acquireLicensePage, undefined, 'invented a source');
  assert.equal(bare.creator.name, 'A');
  const anon = imageObject({ licence: 'CC0', licenceUrl: 'https://cc0' }, { url: 'https://x/y.webp' });
  assert.equal(anon.creditText, undefined, 'invented a credit for an image with no artist');
});

test('the dataset names a resolvable creator and publisher', () => {
  const h = fs.readFileSync(path.join(root, 'dist/data/index.html'), 'utf8');
  const ds = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1])).flat().find((x) => x['@type'] === 'Dataset');
  assert.ok(ds, 'no Dataset on the data page');
  for (const role of ['creator', 'publisher']) {
    assert.equal(ds[role]['@type'], 'Organization', `${role} is not a typed node`);
    assert.ok(ds[role].name && ds[role].url, `${role} is a bare reference`);
  }
  assert.ok(ds.license && ds.description && ds.distribution.length);
});
