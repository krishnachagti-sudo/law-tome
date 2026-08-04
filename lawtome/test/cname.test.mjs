import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';

const OUT = 'dist-cname-test';
const opts = {
  dataDir: 'src/data/laws', catFile: 'src/data/categories.json',
  assetsDir: 'src/assets', out: OUT,
};

const exists = async (p) => !!(await stat(p).catch(() => null));

test('a root-served site claims its host in a CNAME file', async () => {
  // Without this file GitHub Pages forgets the custom domain on every deploy,
  // because each deploy replaces the entire published artifact. The site comes
  // back on the github.io URL and every canonical on it points somewhere else.
  await rm(OUT, { recursive: true, force: true });
  await buildSite({ ...opts, base: '/', origin: 'https://lawtome.example' });
  assert.equal(await readFile(join(OUT, 'CNAME'), 'utf8'), 'lawtome.example\n');
  await rm(OUT, { recursive: true, force: true });
});

test('a site served from a subpath claims no domain at all', async () => {
  // A Pages custom domain always serves at the root. A base of anything else
  // means the artifact sits behind a rewrite on a host it does not own, and a
  // CNAME there would be a claim on somebody else's domain.
  await rm(OUT, { recursive: true, force: true });
  await buildSite({ ...opts, base: '/lawtome/', origin: 'https://conyso.com' });
  assert.equal(await exists(join(OUT, 'CNAME')), false);
  await rm(OUT, { recursive: true, force: true });
});

test('the IndexNow key sits at the host root, where verification looks for it', async () => {
  // IndexNow proves ownership of a HOST. Served from a subdirectory it proves
  // nothing and the submission is rejected — which is the second reason this
  // site belongs on its own hostname rather than a path.
  await rm(OUT, { recursive: true, force: true });
  const key = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
  await buildSite({ ...opts, base: '/', origin: 'https://lawtome.example', indexNowKey: key });
  assert.equal((await readFile(join(OUT, `${key}.txt`), 'utf8')).trim(), key);
  await rm(OUT, { recursive: true, force: true });
});
