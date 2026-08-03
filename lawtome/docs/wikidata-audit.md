# Wikidata linkage audit

Run 2026-08-03, read-only, against the live Wikidata API. **Nothing was edited.**
The machine-readable output is `docs/wikidata-candidates.json`.

## Why this was worth doing

Wikidata is the layer knowledge panels and language models are assembled from.
This corpus already holds a QID for 766 of its 1,116 entries — that linkage was
harvested for foreign names and never examined as a distribution question. The
audit asks two things: are the links we have sound, and how many are we missing.

## What the 766 links look like

| | |
|---|---|
| QIDs recorded | 766 |
| Items that resolve | **766 (all of them)** |
| Items with zero sitelinks | 0 |
| Median sitelinks per item | 27 |
| Most-connected item | 147 sitelinks |
| Items already carrying a *described at URL* (P973) | **21** |
| Items with no P973 at all | **745** |

Two things follow. The linkage is clean — every QID we hold points at a live
item, and none of them are orphans; the median item is translated into 27
Wikipedias. And the reference field is close to empty: 745 of these items name
no external description at all. This is not a saturated space where one more
link is noise.

## What the 350 unlinked entries look like

A search on the entry's name, then its first two aliases, top hit only:

| | |
|---|---|
| Entries with no QID | 350 |
| A search returned something | 271 |
| A search returned nothing | **79** |

The 79 are the interesting number. Those are named ideas — sourced, defined,
rated — with no Wikidata item under any name we index them by. If that holds up
under a human check, this index is the only structured record of them anywhere.

## The finding that matters: do not automate this

The obvious next step is to accept the search hits and bulk-add the links. That
would be a mistake, and the audit shows exactly why. Grading the 271 hits by
whether the *label* matched gets the answer backwards:

**Exact label matches that are wrong:**

| Our entry | Top hit | What it actually is |
|---|---|---|
| The Coriolis Effect | The Coriolis Effect | *1994 film* |
| Beats | Beats | *2007 video game* |
| Baumol's Cost Disease | Baumol's Cost Disease | *edited book, 1997* |
| Aesthetic Experience | Aesthetic experience | *scientific article, 2008* |
| The Cobra Effect | The cobra effect: a venomous snake in the neurosurgical field | *scientific article, 2018* |

**Loose label matches that are right:**

| Our entry | Top hit | What it actually is |
|---|---|---|
| Hebb's Rule | Hebbian rule | the concept |
| Ampère's Law | Ampère's force law | the concept |
| The DRY Principle | don't repeat yourself | the concept |
| Codd's Twelve Rules | Codd's 12 rules | the concept |
| Inference to the Best Explanation | abductive reasoning | the concept |

The label is not the signal. What the item *is* — a concept, or a publication
about the concept — is. Filtering on that:

| | |
|---|---|
| Hits that look like a publication (reject) | **122** |
| Hits with no description at all (unsafe to judge) | 29 |
| Hits that look like the concept (worth reviewing) | **120** |

**45% of the matches a naive script would have accepted are papers, books or
films about the idea rather than the idea.** Had we bulk-edited from that list,
this site would now be cited as the description of a 1994 film.

## The review, and what it found

The 120 were reviewed on 2026-08-03. `build/wikidata-review.mjs` pulled the
evidence each judgement needs — what the item *is* (P31), its aliases, its
sitelink count — and each was read against our own entry's statement. Verdicts
are recorded per candidate in `docs/wikidata-candidates.json`, with a named
reason on every rejection.

| | |
|---|---|
| Accepted | **92** |
| Rejected | **28** |

The rejections vindicate the decision not to bulk-accept. Two are exactly the
failure mode the audit predicted — an acronym matching an unrelated item:

| Our entry | What the search returned |
|---|---|
| The Single Responsibility Principle | **Serbian** — matched on *SRP* |
| The Principle of Least Astonishment | **Pola**, a female given name — matched on *POLA* |
| YAGNI | **Yagnik**, a family name |
| SOLID | **solid**, the state of matter |

Several more are the publication-for-concept swap the audit was built to catch:
The Michelson-Morley Experiment matched an *Ohio historical marker*
commemorating it; The Rule of Three matched an *Agatha Christie play*; The
Nocebo Effect and The Rubber Hand Illusion each matched a *clinical trial* that
used them; The Mind-Body Problem matched a *2024 encyclopedia article* about it.

And three are subtler, which is the argument for reading rather than scripting:

- **Ampère's Law** matched *Ampère's force law*. Same person, adjacent physics,
  different law. A label-similarity score would have accepted it.
- **Retrograde Motion** matched *actual* retrograde orbital motion; our entry is
  about the *apparent* motion seen from Earth.
- **Presentism** matched presentism the *historiographical fallacy*, not
  presentism about time.

The 92 accepted links are now in `src/data/facts.json`, and with them **580
foreign names** for entries that had none — pulled from Wikidata, not
translated. That takes the corpus from 766 linked entries to **858**.

## What is left to do

1. **Look hardest at the 79 with no item.** If they are genuinely absent rather
   than just missed by an English-label search, they are the most defensible
   part of the corpus — and the case for creating items is a contribution
   argument, not a promotional one.
2. **Re-run the search for the 28 rejected.** A wrong top hit does not mean no
   right item exists; Ampère's circuital law and the uncertainty principle
   certainly have their own items, which this shallow probe did not surface.
3. **Only then consider contributing upstream, and never in bulk.** A reference
   URL added one item at a time where it genuinely improves the item is a
   contribution. Seven hundred added by script is link-spam, would be reverted,
   and would cost this project the credibility it is entirely built on.
4. **Look hardest at the 79 with no item.** If they are genuinely absent rather
   than just missed by an English-label search, they are the most defensible
   part of the corpus — and the case for creating items is a contribution
   argument, not a promotional one.

## Method and its limits

`wbsearchentities` with the English label, top hit only, falling back through
two aliases. That is a shallow probe and it will have missed items that exist
under a name we do not index — so **79 is an upper bound on genuine absence,
not a count of it**. The publication filter is a regular expression over the
description string; it will let through a publication whose description does not
use one of those words, which is another reason the list wants human eyes.

Reproduce with `node build/wikidata-audit.mjs`. It is read-only and rate-limited, and
it identifies itself in the User-Agent as required.
