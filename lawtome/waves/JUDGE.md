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

Since 17 Nov 2026 (Krishna): **every catch that passes gets its own case page**,
plus the dated example on the law's page. The page explains the case and keeps
it: what happened, how the law explains it step by step, what it predicts, and
where it might not fit. That is a case study, not a thin page, and it is what
keeps the scaled-content risk away from conyso.com: the risk is pages that add
nothing, not the number of pages. So the bar is substance:

- **Case page + law-page example** (default for a catch that passes): write the
  case page in `src/data/waves/` and add the example to the law's `examples`.
  The case page must have, all from sources you opened and quoted:
  - the event, dated, with a timeline of at least two dated steps;
  - the mechanism in at least three steps, each tied to this event, not a
    textbook recap of the law;
  - at least two honest limits (what the sources don't show, where another
    explanation fits);
  - at least two FAQs a reader would actually ask;
  - one prediction checkable by a date, saying what would show it wrong;
  - every source listed and opened.
  If you can't fill that honestly from what you opened, publish the example only
  and say why in the pack. Never pad to reach the bar.
- **Takeover** (the law page's banner and "developing" on the home strip): only
  for strong waves, meaning two or more sources and either major (p > 10) and
  still building, or in the news (two outlets naming it, or news a firing
  source, feed not at its cap) and not fading, or a scheduled event drafted
  ahead. Those pages get `status: developing` and `takeoverUntil` = publish
  date + 10 days. Every other case page gets `status: settled` and no
  `takeoverUntil`.
- **Sensitive stories:** published under the rules in "Sensitive stories" below; nothing waits for Krishna.

The caps are limits, not targets: at most **5 catches a day** (each one an
example plus its case page) and **30 case pages a week**, across the morning,
midday and evening runs together. `autopublish.json` wins if lower.

Being too cautious is a failure too. A sourced, verified example that sits in a
pack for days is a missed wave. If the cause is found, quoted, about the law
itself and passes the sensitive-story rules, publish it the same day.

## Before judging: who is driving it

The report says whether a Wikipedia spike came from phones or desktops.
Phone-led spikes are people sharing something. Desktop-led spikes with no news
behind them are often bots, a course assignment, or an internal tool linking the
page. Find the cause before acting on a desktop-led spike.

"Already covered: N news items" tells you how crowded the wave is. A crowded
wave is a law-page example at most; big publishers will own the new-page slot.

## Sensitive stories (no human hold since 17 Nov 2026)

Krishna removed the human hold on 17 Nov 2026. A wave the detector marks
**⚠ SENSITIVE** touches death, disaster, attack, illness or abuse. It is judged
and published like any other, under these rules, which are not optional:

- **The floor:** never a page or example centred on a named private person's
  death, suicide, abuse or illness, and never pair a law with a suicide, named
  or not. The private victim is never the subject. Institutions, systems and
  public figures acting in office are fine.
- **Facts first:** for a disaster, attack or outage that hurt people, publish
  only once the cause is on the record (an official statement, or two outlets
  reporting it). Early speculation about cause is not published.
- **Tone:** say plainly who was harmed, then explain the mechanism of the
  failure (systems, organisations, decisions), never the victims' choices. No
  promotion, no call to action, no "fun fact" framing, no share prompts on the
  page, and any scheduled social post about it has a kill switch. The
  newsjacking failures on record (Kenneth Cole on Cairo, Epicurious on Boston,
  the Hurricane Sandy posts) were all tragedy pairings done for attention:
  that is the line not to cross.
- Political neutrality, mechanism not topic and the refute pass still apply.

## News first: a law named in today's stories (fired: named)

Judge these before anything else. Since 17 Nov 2026 the detector reads the news
first (`scripts/wave-news.mjs`): science, tech and general feeds, Google News
top stories, Hacker News, and a Bing News search for every law name, keeping
stories from the last 36 hours. In the first week of spike-first judging every
cause found was a news story naming the law, found 2 to 6 days late; this
catches the same stories on day 0.

1. The story is the cause, already attached. Open it and quote it.
2. It must be about the law's mechanism, not a passing use of the phrase
   ("the golden rule of hiring" is not the Golden Rule).
3. Explainers ("What is the Diderot effect?") and personal blogs or reposted
   videos are listed but marked "not counted". They never trigger anything.
4. A fresh science or news result about the law (a new experiment, a proof, a
   ruling, an incident that works the way the law describes) is a law-page
   example the same day. Two outlets reporting it, not fading, is a page
   candidate (see above).
5. Same-day matters more than polish: publish the example in this run.

## Fresh views: the last 24 hours

The daily Wikipedia numbers end 1.5 to 5 days before the run. Each wave line
now also shows "last 24 h" from the hourly dumps, about 3 hours old, and the
fresh trajectory replaces the daily one when it exists. A spike that shows only
in the last 24 hours is today's wave; one that shows only in the daily numbers
may already be over.

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
same day: a full answer in the comment itself, one link at most. A thread
alone is not a catch, but if the thread's event has a confirmed cause that
works the way the law describes, it is: publish the example and its case page. On HN, never ask for votes. On Reddit, follow the
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
moving is labelled developing and updated.

Krishna has delegated publishing to the daily run (14 Nov 2026), within the
caps above and only while `autopublish.json` in the private law-tome-waves repo
says `"enabled": true`. Nothing waits for him any more (no human hold since 17 Nov 2026), but the sensitive-story floor always holds. A wave that
fails any rule here is skipped, not softened until it passes.
