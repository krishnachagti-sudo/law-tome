import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setAnalytics, analyticsTag } from '../src/templates/partials.mjs';
import { pageHash } from '../build/lastmod.mjs';

test('the GA4 tag is off unless a valid stream id is set', () => {
  setAnalytics(undefined);
  assert.equal(analyticsTag(), '');
  setAnalytics('G-XXXX<script>');
  assert.equal(analyticsTag(), '');
  setAnalytics('G-1XCS9PNGZ7');
  const tag = analyticsTag();
  assert.match(tag, /g\('config','G-1XCS9PNGZ7'\)/);
  // Production host only, ads denied everywhere, no cookies in the EEA/UK/CH.
  assert.match(tag, /location\.hostname!=="conyso\.com"/);
  assert.match(tag, /ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'/);
  assert.match(tag, /analytics_storage:'denied',region:\[[^\]]*"DE"[^\]]*"GB"[^\]]*"CH"\]/);
  setAnalytics(undefined);
});

test('switching analytics on or off does not change any page date', () => {
  const page = (chrome) => `<html><head><title>X</title>${chrome}</head><body>Entry text</body></html>`;
  setAnalytics('G-1XCS9PNGZ7');
  const on = page(analyticsTag());
  setAnalytics(undefined);
  assert.equal(pageHash(on), pageHash(page('')));
  assert.notEqual(pageHash(page('')), pageHash(page('').replace('Entry text', 'Edited entry')));
});
