# Judging a wave

`scripts/wave-detect.mjs` (daily) and `scripts/wave-hourly.mjs` (same-day
alerts) only report what moved. Every candidate goes through this before
anything is drafted. The rule underneath all of it: ride the wave, never start
one. Pairing a random story with a law is how this goes wrong.

The clock matters. Attention to an event decays at about 0.4 a day, a half-life
of roughly 1.7 days (from the virality research, kept in the private law-tome-waves repo). Judge
a wave the day it appears; a page that goes live on day three has missed most
of it.

## What to do with a wave (the "Do:" line)

The default is the fast path, not a new page. A new page on a young domain is
usually indexed after the wave has passed, but the law page is already indexed
and recrawled often. So:

- **Law-page example** (default): add a dated, sourced entry to the law's
  `examples` ("In the wild, Nov 2026: …"), plus a reply in the live thread if
  there is one. Small, fast, and it improves a page that already ranks.
- **Standalone wave page:** only when the wave is strong (two or more sources),
  major (clears p > 10) and still building, or is a scheduled event you drafted
  ahead.
- **Your call:** anything on human hold.

The cap is a hard limit, not a target: at most one standalone page a day and
five a week. Law Tome shares conyso.com with every other Conyso microsite, so
a scaled-content problem would hit all of them.

## Before judging: who is driving it

The report says whether a Wikipedia spike came from phones or desktops.
Phone-led spikes are people sharing something. Desktop-led spikes with no news
behind them are often bots, a course assignment, or an internal tool linking the
page. Find the cause before acting on a desktop-led spike.

"Already covered: N news items" tells you how crowded the wave is. A crowded
wave is a law-page example at most; big publishers will own the new-page slot.

## Human hold first

A wave marked **⚠ HUMAN HOLD** touches death, disaster, attack, illness, abuse
or a named private person. It is never drafted automatically. Krishna decides
whether it is a page at all. If it is, it carries no promotion or call to
action, and any scheduled social post about it has a kill switch. The
newsjacking failures on record (Kenneth Cole on Cairo, Epicurious on Boston,
the Hurricane Sandy posts) were all tragedy pairings.

## Tier 1 and 2: a law already moving (spike, invoked, rising)

1. Find why. The report lists news, Reddit and HN evidence; if it says no
   coverage was found, open the Wikipedia history and search the date. A spike
   with no findable cause is skipped.
2. The cause must be about the law itself, not a coincidence of words.
3. "Major" means the spike also clears Lehmann et al.'s published peak bar
   (p > 10). Not required; it tells you how big the wave is.

## Reply today: one big thread

A single HN front-page or large Reddit thread naming a law is listed even when
it is not a wave. Reach is almost all one broadcast (Goel et al. 2016), and an
HN story stays on the front page for about half a day. Reply in the thread the
same day: a full answer in the comment itself, one link at most. No page unless
it becomes a wave. On HN, never ask for votes. On Reddit, follow the
subreddit's own rules; fact subreddits such as r/todayilearned reject recent
or self-hosted sources.

## Coming up: scheduled events

Rulings, votes, launches and laws taking effect build attention before the day.
Add them to `waves/calendar.json` as you learn of them:

```json
[{ "date": "YYYY-MM-DD", "event": "what happens", "laws": ["law-slug"], "note": "source link" }]
```

The report lists the next seven days. Draft those pages ahead, verify sources
ahead, and publish when the event happens.

## The viral pool: a link no one has made yet

All four, or skip:

1. **Mechanism, not topic.** The event works the way the law says things work.
2. **One sentence.** "This is X because [cause] led to [effect], as the law
   describes." If it needs hedging, skip.
3. **It predicts.** The law says what usually happens next.
4. **It survives a refute pass.** Argue it is not this law and give the best
   other explanation. A win or a tie for the refuter is a skip.

The page says this is our reading ("Why this is X"), never that people are
already saying it. Lead with the mechanism and give the name as "the name for
this is…"; there's no evidence that the name itself is what gets shared.

## Emerging terms in the wild

The detector lists a new "X's Law" or "Y Effect" only when three or more
independent sources use it in 48 hours. That makes it an **emerging term**, not
a law. It enters the Coined wing (`provenance: coined`) only when it meets
Wiktionary's bar, three independent uses spanning at least a year, and the coiner is
verified. Until then any page about it says "emerging term". Unverified
attribution is never published.

## Political stories

On a politically live story, the page explains the mechanism and takes no side.
If the law only fits when you take a side, skip it. A wise-sounding "this is
X's Law" take on a partisan fight reads as opportunistic, whichever side it
lands on.

## Log every decision

Add each judged wave to `waves/decisions.json`:

```json
{ "date": "YYYY-MM-DD", "slug": "law-slug", "tier": "spike", "decision": "update", "reason": "cause confirmed: ...", "outcome": "" }
```

`decision` is `page`, `update`, `reply` or `skip`. Fill `outcome` at 28 days
(the law page's impressions before and after, from Search Console). The report
shows the hit rate by tier from this log. It's the only way the detector's bars
stop being guesses, and it stops a skipped wave being re-judged for a week.

## Trending laws the Tome doesn't have

The report lists named laws and effects in Wikipedia's top 1,000 that the Tome
lacks. Treat them as candidates for new Canon entries through the normal
verification pipeline, not as wave pages.

## Before anything is published

Every claim is cited, and every citation is opened and read to confirm it says
what we claim (two of the first eleven seed laws failed this). A story still
moving is labelled developing and updated. Krishna approves each page by
merging it.
