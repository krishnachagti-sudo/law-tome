# The daily wave run

Instructions for the scheduled Claude run that turns the detector's report into
published pages. The detector measures. This run researches, judges by
`JUDGE.md`, publishes what passes, and writes a pack saying what it did and why.
Krishna delegated publishing on 14 Nov 2026. He reads the pack afterwards and
can switch publishing off at any time (see "The switch").

## Inputs

- Today's queue: `out/YYYY-MM-DD.md` and `.json` in law-tome-waves, the newest
  non-test report. If the newest is not from today, say so at the top of the
  pack and work from it anyway.
- `out/hourly-latest.md`: same-day alerts.
- The rules: `lawtome/waves/JUDGE.md` in law-tome. Follow them exactly.
- `decisions.json` in law-tome-waves: skip any law judged in the last 7 days.
- `lawtome/waves/calendar.json`: events in the next 7 days.
- `autopublish.json` in law-tome-waves: the switch and the caps.

## The switch

Read `autopublish.json` first. If `enabled` is not `true`, publish nothing:
write the pack with recommendations only, as drafts. The caps in it
(`maxExamplesPerDay`, `maxPagesPerDay`, `maxPagesPerWeek`) override JUDGE.md
only if they are lower. Count this week's pages from `decisions.json`.

## For each law wave in the queue (top 8 by score)

1. **Find the cause.** Use the evidence lines first, then web search: news,
   X, LinkedIn, YouTube, Reddit. For a phone-led wave, look for the original
   viral post.
2. **Name the cause in one line, with its source URL,** or write "No cause
   found". Open every source you cite and quote the sentence that supports the
   claim. Never cite a page you haven't opened. Never repeat a number your
   source doesn't state.
3. **Apply JUDGE.md:** human hold, desktop-led with no cause, political
   neutrality, crowdedness, the four tests for an unspoken link. Decide
   `update`, `page`, `reply` or `skip`, with one line of why.
4. **Publish only when every one of these holds:**
   - the cause is found and its source is opened and quoted;
   - the wave is not on human hold, and is not a political story where the law
     only fits by taking a side;
   - the link between the event and the law is the mechanism, not the topic,
     and it survives your written refute pass;
   - the caps are not reached.
   If any one fails, do not publish. Record it in the pack as a draft or a skip.
   Never soften a claim to make it pass.

## Publishing a law-page example (`update`)

Add one entry to the front of the law's `examples` in
`lawtome/src/data/laws/<slug>.json`:

`{ "tag": "In the wild · <Mon YYYY>", "text": "...", "date": "YYYY-MM-DD", "source": { "text": "<Outlet>, <d Mon YYYY>", "url": "...", "checked": "<today>" } }`

Two sentences: the event, then how it shows the law's mechanism. Plain English,
no hype, no em dashes. Touch nothing else in the file.

## Publishing a standalone wave page (`page`)

Only when JUDGE.md's bar for a page is met: strong (two or more sources), major,
and still building, or a calendar event you prepared for.

Write `lawtome/src/data/waves/<slug>.json`, using
`plane-audio-video-location-doppler-effect.json` as the model for every field,
with these differences:
- Leave out `visuals`, `lawStep` and `media[].cover`. Those belong to the
  Doppler page's hand-drawn diagrams. The template gives other waves text-led
  share images.
- `calc` is optional. Include a worked example only if you can label every
  number as illustrative or source it. Otherwise leave `calc` out.
- `predict` is optional. Use it only for a guess the reader can genuinely make
  from the page.
- `media`: embed a YouTube video only if it is the event's own video and
  YouTube oEmbed confirms embedding is allowed. Otherwise leave it out.
- `predictions` must be checkable by a date. Say what would show it was wrong.
- `takeoverUntil`: publish date + 10 days.
- `status`: `developing` if the story is still moving.
- `publisher`: copy the Doppler page's sentence.
- Never put the detector's own measurements (pageview counts, scores) on the
  public page.

## Checks, then push

In law-tome, on `main` (`git pull --rebase` first):

```
cd lawtome && npm ci && npm run build && npm test && npm run style -- --strict \
  && npm run preflight -- --base=/lawtome/ --origin=https://conyso.com
```

If anything fails, fix your own change or drop it. Never edit a test to make it
pass, and never touch files you didn't add or change. Then commit only your
files (never `src/data/lastmod.json`), with the message
`wave: <slug>` or `in the wild: <law slug>`, and run `git push origin HEAD:main`
(pull with rebase and retry if rejected). The push deploys to conyso.com within
about 15 minutes.

## Log every decision

Append each judged wave to `decisions.json` in law-tome-waves:
`{ "date": "YYYY-MM-DD", "slug": "law-slug", "tier": "...", "decision": "page|update|reply|skip", "reason": "...", "url": "<published URL or empty>", "outcome": "" }`.

## Replies and posts

Never post, comment or message anywhere. If there is a live thread worth
joining, draft one reply in Krishna's voice in the pack, labelled DRAFT, with
the full answer in the comment and at most one link to the law page.

## The viral pool, calendar, emerging terms

As before, and in the pack:
- **The viral pool:** propose at most three unspoken links. Each must pass
  JUDGE.md's four tests, with the refute pass written out. Publish one only if
  it clears step 4 above.
- **The calendar:** for events within 48 hours, prepare the law-page example and
  publish it when the event happens.
- **Emerging terms and missing laws:** report only. Never publish these.

## Output

Write `out/packs/YYYY-MM-DD.md` in law-tome-waves. Start with a 3-line summary:
- what was published, with URLs;
- what was skipped or held, and why;
- anything Krishna must decide (human holds).

Commit the pack and `decisions.json` together.
