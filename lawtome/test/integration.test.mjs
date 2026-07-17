import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
import { internalLinkErrors } from '../build/linkcheck.mjs';
test('full build emits every artifact type', async () => {
  const out = await mkdtemp(join(tmpdir(),'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com', publishedCount:null });
  for (const p of ['index.html','browse/index.html','graph/index.html','coin/index.html','about/index.html','coined/index.html','privacy/index.html','search-index.json','graph.json','sitemap.xml','robots.txt','laws/goodharts-law/index.html','og/goodharts-law.png'])
    assert.ok(existsSync(join(out, p)), `missing ${p}`);
  const errs = await internalLinkErrors(out, '/lawtome/');
  assert.deepEqual(errs, [], errs.join('\n'));
  await rm(out, { recursive:true, force:true });
});

test('internalLinkErrors flags a dangling internal link', async () => {
  const out = await mkdtemp(join(tmpdir(),'lt-'));
  // index.html is a real emitted file; the ghost link is not.
  await writeFile(join(out,'index.html'),
    '<a href="/lawtome/">home</a><a href="/lawtome/ghost/">ghost</a>', 'utf8');
  const errs = await internalLinkErrors(out, '/lawtome/');
  assert.deepEqual(errs, ['index.html -> /lawtome/ghost/ (no such file)']);
  await rm(out, { recursive:true, force:true });
});

test('internalLinkErrors resolves a directory URL to index.html', async () => {
  const out = await mkdtemp(join(tmpdir(),'lt-'));
  await mkdir(join(out,'browse'), { recursive:true });
  await writeFile(join(out,'browse','index.html'), 'ok', 'utf8');
  await writeFile(join(out,'index.html'), '<a href="/lawtome/browse/">browse</a>', 'utf8');
  const errs = await internalLinkErrors(out, '/lawtome/');
  assert.deepEqual(errs, []); // browse/ -> browse/index.html exists
  await rm(out, { recursive:true, force:true });
});

test('internalLinkErrors ignores external, mailto, anchor, and api endpoints', async () => {
  const out = await mkdtemp(join(tmpdir(),'lt-'));
  await writeFile(join(out,'index.html'),
    '<a href="https://example.com/lawtome/x">ext</a>'
    + '<a href="mailto:x@y.z">mail</a>'
    + '<a href="#top">anchor</a>'
    + '<form action="/lawtome/api/submit"></form>'
    + '<a href="/lawtome/api/submit">api</a>', 'utf8');
  const errs = await internalLinkErrors(out, '/lawtome/');
  assert.deepEqual(errs, []); // none of these are static internal files
  await rm(out, { recursive:true, force:true });
});
