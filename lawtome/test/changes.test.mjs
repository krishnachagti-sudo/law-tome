// Change dates for the feed come from git history of the data directory
// (backlog B10), and a shallow clone must refuse rather than guess.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

import { changeDates } from '../build/changes.mjs';
import { buildFeed } from '../build/feed.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, stdio: 'ignore',
  env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } });

function repo() {
  const root = mkdtempSync(join(tmpdir(), 'lt-changes-'));
  const data = join(root, 'laws');
  mkdirSync(data);
  git(root, 'init', '-q');
  writeFileSync(join(data, 'a.json'), '{"slug":"a"}');
  writeFileSync(join(data, 'b.json'), '{"slug":"b"}');
  git(root, 'add', '.');
  execFileSync('git', ['commit', '-qm', 'one'], { cwd: root, env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_COMMITTER_DATE: '2026-01-01T00:00:00Z' } });
  writeFileSync(join(data, 'b.json'), '{"slug":"b","edited":true}');
  git(root, 'add', '.');
  execFileSync('git', ['commit', '-qm', 'two'], { cwd: root, env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_COMMITTER_DATE: '2026-03-01T00:00:00Z' } });
  return { root, data };
}

test('each entry is dated by the last commit that touched its own file', () => {
  const { data } = repo();
  const d = changeDates(data);
  assert.ok(d, 'full history should give dates');
  assert.match(d.get('a'), /^2026-01-01/);
  assert.match(d.get('b'), /^2026-03-01/);
});

test('a shallow clone refuses, rather than dating everything to its one commit', () => {
  const { root } = repo();
  const shallow = mkdtempSync(join(tmpdir(), 'lt-shallow-'));
  execFileSync('git', ['clone', '-q', '--depth', '1', `file://${root}`, shallow], { stdio: 'ignore' });
  assert.equal(changeDates(join(shallow, 'laws')), null);
});

test('the feed orders by change and dates each entry, or keeps entry order without dates', () => {
  const laws = [{ slug: 'a', no: '2', name: 'A' }, { slug: 'b', no: '1', name: 'B' }];
  const dated = buildFeed(laws, { baseUrl: 'https://x/', updated: '2026-09-01T00:00:00Z',
    changed: new Map([['a', '2026-01-01T00:00:00Z'], ['b', '2026-03-01T00:00:00Z']]) });
  assert.match(dated, /latest changes/);
  assert.ok(dated.indexOf('<title>B</title>') < dated.indexOf('<title>A</title>'), 'most recently changed first');
  assert.match(dated, /<updated>2026-03-01T00:00:00Z<\/updated>\s*<summary>/);
  const plain = buildFeed(laws, { baseUrl: 'https://x/', updated: '2026-09-01T00:00:00Z' });
  assert.match(plain, /latest entries/);
  assert.ok(plain.indexOf('<title>A</title>') < plain.indexOf('<title>B</title>'), 'entry-number order without history');
});
