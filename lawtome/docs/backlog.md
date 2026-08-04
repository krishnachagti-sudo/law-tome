# The backlog

Everything I can see that could be done to this project, in one place, so it
stops being regenerated from scratch every time somebody asks "what else?".

Written 2026-08-03 against a corpus of 1,116 entries, and against
[docs/market.md](market.md), which is where the competitive and demand claims
come from. Items are grounded in a field-coverage audit of the actual data, not
in imagination — every number below was counted.

**This is a menu, not a plan.** The last section is the order I would actually
do it in, which is much shorter than the menu.

## How to read an item

Each carries three marks:

- **Cost** — S (hours), M (a day), L (multiple days), XL (weeks, or ongoing).
- **Data** — *have* (the corpus already holds it), *derive* (computable from what
  we hold), *harvest* (needs fetching from somewhere), *author* (someone has to
  write or judge it).
- **Risk** — what could go wrong, stated plainly. "None" is a real answer.

---

# A. The corpus itself — the things that undermine the central claim

This section exists first because the site's whole position is "sourced and rated
when nobody else is". Anything that weakens that is more urgent than any new page.

### A1. 49% of sources are Wikipedia — **XL, author, high value**
2,362 sources across the corpus. **1,148 of them point at Wikipedia** and only
**430 are marked primary** (18%). A site whose differentiator against Wikipedia
is sourcing has Wikipedia as half its sourcing. That is the single most
attackable fact about this project and the first thing a hostile reader will
find.

Fix: work the ranked list top-down, replacing the Wikipedia citation with the
paper, book or archive it summarises. The best-known 200 entries would be a
defensible first pass and would change the ratio meaningfully.

*Risk of not doing it: someone writes the "it's just Wikipedia with a stylesheet"
post, and they will be half right.*

### A2. ~~The reliability ratings are unaccompanied judgement~~ — **done for 31 entries**
Every rating is ours. `/how-solid/` says so, which is the right thing to do and
does not make it less true. FORRT's replication database records
replicated/failed/reversed status with effect sizes for 600+ effects across 22
disciplines. Citing it per entry — *not* absorbing it — would put external
evidence beside our judgement.

**Done, and the licence caution here was wrong.** FORRT's *site* is CC BY-NC-SA
but the *dataset* is CC BY 4.0, so it could be joined rather than merely linked.
31 entries now carry FReD's counts on the entry page and the verdict page. Two
counting traps are recorded in build/fetch-replication.py: a FReD row is a
site-level result, not a replication attempt, and the same study appears under
several reference strings, so studies must be keyed on DOI. Getting either wrong
publishes a confident falsehood — the second one did, briefly, and said the
availability heuristic had three replication studies when it has one.

Still open: the remaining ~1,085 entries have no external evidence beside their
rating, because FReD covers effects in psychology and economics and most of this
index is not that.

### A3. 484 entries have no fame measurement, and most look harvestable — **M, harvest, higher value than it looks**
`ngram` covers 633 of 1,116 (57%). The unmeasured **484** are excluded from
`/best-known/`, sort last on every sheet, and can never receive an
`/is-it-real/` page — three surfaces silently narrowed by one missing field.

I assumed these were the unmeasurable tail. They are not. The list includes
**Benford's Law, Bell's Theorem, the Beer–Lambert Law, the Baader–Meinhof
Phenomenon and Begging the Question** — names that appear in printed books
constantly. Eleven entries have no facts record at all. This is largely an
*unfinished harvest*, not a natural limit, and finishing it would widen
`/best-known/`, every sheet's ordering, and the verdict-page pool at once.

### A4. 535 entries have no situation — **L, author**
581 situations map to 581 distinct entries — exactly one each — so **48% of the
corpus is unreachable by the reverse-lookup**, which is the site's best front
door. Every situation authored is a new way in.

### A5. `confusedWith` is populated on 6 entries — **M, author**
Six, out of 1,116, while `/compare/` runs to 235 pages built from a different
mechanism. The field is effectively dead. Either populate it properly (it is the
most useful signal for "you probably mean the other one") or delete it and stop
implying it means something.

### A6. `popularYear` is populated on 15 entries — **M, harvest/author**
Same problem, smaller. `coinedYear` is on 836; `popularYear` on 15. The gap
between when an idea was coined and when it caught on is genuinely interesting
and we can nearly never show it.

### A7. ~~Only 4 schematics~~ — **not a defect, checked**
I proposed this as a data-loss bug and then checked it. The `schematic` field is
set on only 4 entries, but `schematicForLaw()` *matches* entries to 23 shapes by
rule, and **114 entries resolve to a diagram**. The field is an override, not
the mechanism. Nothing was lost.

The real item is smaller: 114 of 1,116 is 10%, and 561 entries have a harvested
figure. Whether the remaining ~440 could match an existing shape is a worthwhile
**S, derive** check — but it is a coverage question, not a bug.

### A8. The Coined wing is empty — **S to check, XL to fill**
Every entry is `provenance: "canon"`. Zero user-coined laws, despite `/coin/`
being in the primary navigation. A submission form that has never produced a
submission is either a distribution problem or a dead feature; find out which
before giving it more prominence.

### A9. The Availability Heuristic rating — **S, author**
The build has warned about this for weeks: an Empirical entry whose own limits
say the effect is contested. It is one decision, it is yours, and while it stands
the build prints a warning that trains everyone to ignore build warnings.

### A10. 422 entries have no namesake — **S, derive**
`namedAfter` covers 694 (62%). Not a defect — many named laws are not eponymous —
but it means `/named-after/` and the namesake pages structurally cover only
two-thirds of the index, which is worth stating on those pages rather than
leaving a reader to assume the index is smaller than it is.

---

# B. Surfaces buildable from data we already hold

No harvesting, no authoring. These are pure derivations of the existing corpus.

### B1. Question-shaped titles — **M, derive, high value**
The Decision Lab titles every bias as a question ("Why do we prefer doing
something to doing nothing?") because that is how people search. Our entry pages
and field hubs describe instead. The problem-theme pages already ask; extending
the pattern is cheap and directly targets the query shape.

### B2. ~~`/compare/` from the tension edges~~ — **already done, checked**
I proposed this and then checked it: 259 tension *edges* resolve to 134
reciprocal pairs, and all 134 already have a comparison page among the 234.
There is no gap here. Recorded rather than deleted so nobody proposes it again —
including me.

### B3. The 1,645 kindred edges are unexploited — **M, derive**
Six relation kinds exist; `kindred` is 63% of all edges and does the least work.
"Ideas that travel together" — clusters computed from the kindred graph — would
be a browse axis nobody else can offer, because nobody else has the graph.

### B4. Cause-and-consequence chains — **M, derive**
128 `cause` and 89 `consequence` edges form directed chains through the corpus.
Walkable chains ("this causes that, which causes the other") are a genuinely
novel view and the data is already directional.

### B5. Per-decade "what was named when" — **S, derive**
`coinedYear` on 836 entries. `/timeline/` exists; a *rate* view — how many named
ideas per decade, by field — is a chart nobody else can draw. It also visibly
answers "is this an old idea or a new one".

### B6. The unmeasured tail as its own page — **S, derive**
484 entries with no print measurement. Framed honestly that is an interesting
page rather than an embarrassment — but **do A3 first**, because on inspection
most of that 484 is unharvested rather than unmeasurable, and a page about "the
ideas too obscure to count" that opens with Benford's Law would be a lie told by
a gap in our own pipeline.

### B7. Entry-level "how solid" mini-panel — **S, derive**
`/how-solid/` computes corpus-level statistics. The same three numbers now
appear on 104 verdict pages. Putting a compact version on **every** entry page
would carry the argument to where the traffic lands.

### B8. Linguistics has no sheet — **S, derive**
19 sheets from 20 fields. The missing one is **linguistics, with 6 entries**,
below the eight-entry floor. Either lower the floor to six (management is next at
9, so nothing else changes), fold it into a combined sheet, or say on `/sheets/`
that the field exists and why it has no sheet. Currently it is silently absent,
which is the one option that misleads.

### B9. `/quotes/` and `/best-known/` are 763 KB and 112 KB gzipped — **M, derive**
Same disease `/situations/` had. Pagination or segmentation, with the same
benefit: real landing pages instead of one enormous one.

### B10. A "recently changed" feed — **M, derive**
`feed.xml` is ordered by entry number as a proxy for recency. Actual change
tracking — git history over `src/data/laws/*.json` — would make the feed mean
what it says, and make "we update when the evidence updates" checkable.

### B11. Confidence-interval view of the ranking — **S, derive**
`/best-known/` presents a ranked list as though the ranking were precise. Print
frequency is noisy; adjacent ranks are not meaningfully different. Saying so, or
banding the ranking, would be consistent with the honesty the rest of the site
insists on.

---

# C. Surfaces needing new data

### C1. Create Wikidata items for the 79 absent entries — **XL, author, high value**
The audit found 79 entries with no Wikidata item under any name we index. If that
holds, this index is the only structured record of them anywhere. Creating those
items — one at a time, as a contribution, never in bulk — puts the corpus into
the layer knowledge panels and language models are assembled from. This is the
highest-leverage distribution act available and it is entirely manual.

### C2. Apply the remaining Wikidata review — **M, author**
28 candidates were rejected because the *top hit* was wrong, which does not mean
no right item exists. Ampère's circuital law and the uncertainty principle
certainly have items; a shallow English-label search missed them.

### C3. Audio for the 903 entries without pronunciation — **L, harvest**
222 of 625 namesakes have audio. Wiktionary/Commons harvest, licence-checked, as
the existing pipeline already does.

### C4. Portraits for the remaining namesakes — **L, harvest**
465 portraits against 694 entries with a namesake. The existing gate is
conservative by design; the remainder needs case-by-case work.

### C5. Formula coverage — **M, harvest**
97 of 1,116 entries carry a formula. `/equations/` is thin because the data is
thin. Physics, chemistry and statistics entries could plausibly double it.

### C6. Translated interfaces — **XL, author, DO NOT MACHINE-TRANSLATE**
We hold names in ten languages for 858 entries. A Spanish or Japanese *interface*
would be a genuinely new market. But the corpus prose must not be machine
translated — that is unverified text, which is the one thing this project does
not publish. This is only viable with human translators, which makes it a
business decision rather than a technical one.

---

# D. Distribution and citation

Read [docs/market.md §3](market.md) first: with ~93% zero-click in AI Mode and
only 17% of AI Overview citations coming from the organic top ten, **citation is
the goal and traffic is a lagging proxy for it.**

### D1. The custom domain — **S, none, blocking**
`SITE_BASE` / `SITE_ORIGIN` repo variables. Every surface built in the last two
weeks ships to a `github.io` path. This has been my top recommendation for weeks
and remains it: it is one settings change and it gates the credibility of
everything else.

### D2. Author and Organization schema — **S, author**
Cited-source credibility signals. We have `DefinedTerm`, `CollectionPage`,
`FAQPage`, `BreadcrumbList`. Explicit Organization and Author markup is what
answer engines use to decide a source is real.

### D3. More tables — **M, derive**
Tables are reported to raise citation frequency because they are trivially
parseable. Much of what we present as prose or cards is tabular underneath.

### D4. Submit to the places that matter — **S, author**
Wikipedia external links where genuinely useful (and never otherwise), the
relevant subreddits, Hacker News, Product Hunt. The one-shot launch moves. Worth
listing so they happen deliberately rather than being forgotten.

### D5. A newsletter — **M to build, XL to sustain**
The standard recurring hook in this space; Untools has 19,500 subscribers off 30
tools. `today.json` already generates the content. The cost is the commitment: an
abandoned newsletter is worse than none.

### D6. Retire the "sameAs is a single string" limitation — **M, derive**
`sameAs` holds one URL. An entry can legitimately be the same as a Wikipedia
article *and* a Wikidata item *and* a Stanford Encyclopedia entry. Making it an
array improves the published dataset and the JSON-LD that answer engines read.

---

# E. Product and recurring engagement

### E1. Physical artefacts — **L, business decision**
Laws of UX sells a poster and a card deck off 31 entries. `/sheets/` is the free
argument for the same thing. Selling anything interacts with the "no ads, no
tracking" promise printed on every page, so it needs deciding rather than
drifting into.

### E2. Quiz depth — **M, derive**
Daily and endless modes exist. Per-field quizzes, a "beat your streak" mode and
shareable difficulty tiers are cheap extensions of a mechanism that already
works.

### E3. Embeddable widgets beyond the card — **M, derive**
Per-entry embed exists. A "law of the day" widget, a field feed widget and a
rating badge would put the site on other people's pages, which is distribution
that does not depend on search.

### E4. Saved-list export — **S, derive**
`localStorage` shortlists exist and cannot leave the browser. Export to Markdown
or a printable sheet turns a private list into something shareable.

---

# F. Infrastructure, performance and risk

### F1. `styles.css` is render-blocking at ~38 KB gzipped — **M, none**
Known, deliberately left. Critical-CSS inlining is the standard fix and it is
fiddly.

### F2. `Fraunces.ttf` ships unused by any `@font-face` — **S, none**
It *is* used at build time by the OG-card renderer, so it cannot simply be
deleted from the repo — but it should not be served to browsers.

### F3. The heavy suites take 5–10 minutes each — **M, none**
Seven suites rebuild the whole site. Caching a single build across suites would
turn a 40-minute verification into a 10-minute one, which changes how often it
gets run honestly.

### F4. No visual regression testing — **L, author**
Every layout defect this project has found was found by a human reading a
screenshot. That is a process that does not scale and has already missed things
twice in two weeks.

### F5. `dist/` is gitignored and the deploy is the only build — **S, none**
Fine today. Worth knowing that a broken build on the feature branch takes the
live site with it, because the workflow deploys on push.

### F6. Link rot — **XL, ongoing**
2,362 external URLs. `build/linkcheck.mjs` exists. Nothing schedules it. A
quarterly run is the difference between a sourced index and an index that claims
to be sourced.

---

# G. Things I would not do, and why

Stated so they stop being re-proposed.

- **Grow the corpus (tasks #94, #95).** 1,116 against Wikipedia's ~250 and Laws
  of UX's 31. Size stopped being the constraint long ago. Every hour here is an
  hour not spent on A1.
- **Machine-translate the corpus.** Unverified text. Non-negotiable.
- **Bulk-edit Wikidata.** 45% of naive matches are publications about the idea.
  Link-spam would cost the project the credibility it is entirely built on.
- **An examples browse axis.** The 3,345 worked examples carry 3,303 *distinct*
  tags — per-example headings, not a vocabulary. Building an axis means
  classifying 3,345 items by our judgement, and they are already in the search
  index and on the entry pages.
- **Compete on "how to think".** Farnam Street and Untools own the application
  frame with audiences we do not have. Reference is the defensible position
  precisely because it is laborious.
- **Optimise for sessions.** With ~93% zero-click in AI Mode, that metric is
  being removed from under us.
- **Lazy-render `/browse/`.** Explicitly out of scope, standing instruction.

---

# The order I would actually do it in

The menu above is 40-odd items. This is the part that matters.

1. **D1 — the custom domain.** One settings change. Everything else ships to the
   wrong URL until it happens.
2. **A9 — the Availability Heuristic rating.** One decision, yours, and it is
   currently training everyone to ignore build warnings.
3. **A1 — primary sources for the best-known 200.** The largest gap between what
   this site claims and what it can show. Nothing else on this list buys as much
   credibility per hour.
4. **A3 — finish the n-gram harvest.** Moved up after checking it: the 484
   unmeasured entries include Benford's Law and Bell's Theorem, so this is an
   unfinished harvest rather than a natural limit. One harvest widens
   `/best-known/`, every sheet's ordering and the verdict-page pool at once.
   Cheapest leverage on the list.
5. **A2 — cite FORRT where it overlaps.** Turns "our rating" into "our rating,
   and here is somebody else's evidence". Check the licence first.
6. **B7 + B1 — carry the argument to the entry pages, in question form.** The
   entry pages are where the traffic lands and they currently make the weakest
   version of the case.
7. **C1 — Wikidata items for the 79.** Slow, manual, and the highest-leverage
   distribution act available.
8. **A4 — situations for the missing 535.** Doubles the reach of the best front
   door on the site.

Everything else is real work that can wait.

## The honest caveat

I cannot see everything. This backlog is bounded by what is in the repository and
what I could find on the open web in one session — it holds no user research, no
analytics, no keyword data and no revenue model, because none of those exist yet.
[docs/user-test.md](user-test.md) has been sitting unused for weeks and would
probably invalidate a third of my UX assumptions in an afternoon. **The most
valuable thing missing from this document is evidence about actual readers, and
no amount of further desk research will produce it.**
