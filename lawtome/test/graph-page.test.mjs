import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graphPage } from '../src/templates/graph.mjs';

test('graph page ships the explorer controls (search, stage, focus bar) and script', () => {
  const h = graphPage({ base: '/lawtome/', origin: 'https://conyso.com', publishedCount: 948 });
  assert.match(h, /<h1>The graph<\/h1>/);
  assert.match(h, /id="graph-q"/);            // search box
  assert.match(h, /id="graph"/);              // stage
  assert.match(h, /id="graph-focusbar"/);     // focus bar
  assert.match(h, /id="graph-focus-link"/);
  assert.match(h, /assets\/graph\.js/);
  // It's an explorer now, not a "whole corpus" hairball.
  assert.match(h, /walk its web/);
  assert.doesNotMatch(h, /whole corpus as one map/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/graph\/"/);
});
