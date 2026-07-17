# The Law Tome

The largest **unified, defined, and sourced** directory of named laws, principles, effects, razors, and paradoxes — Parkinson's Law, Goodhart's Law, the Streisand Effect, Occam's Razor, and ~1,400 more.

A [Conyso](https://conyso.com) microsite. Canonical home: `conyso.com/lawtome/` (with `thelawtome.com` redirecting in).

> **The claim is deliberately qualified.** We say *"largest unified, defined, and sourced"* — never a bare "world's largest." Wikipedia's raw lists may exceed us on undefined entries; we win on the axis that matters: one place, every entry explained, sourced, and cross-linked.

## Why this exists

The space is fragmented across four silos and nobody unifies them: Wikipedia's lists are broad but shallow, alphabetical, untagged, unsearchable (its *List of effects* has ~600 entries with **no definitions**); the good curated sites are deep but tiny and domain-siloed (hacker-laws ~50 dev entries, Laws of UX 31). Today you must stitch together 4–5 sources.

The wedge: **Wikipedia-scale breadth + Laws-of-UX-grade per-entry depth + the two things nobody does — faceted cross-corpus search, and a graph of related/opposing laws.**

## The part that matters: anti-fabrication

An LLM will happily invent a plausible law and a plausible citation. For a resource whose entire value is trustworthiness, one caught fabrication is fatal. So the pipeline is slop-proof by construction:

1. **Enumerate from real sources, not memory** — Claude organizes the known universe, it doesn't hallucinate it.
2. **Citation gate** — no Canon entry ships without a real, citable origin.
3. **Adversarial verification** — a separate pass tries to *refute* each entry.
4. **Source resolution** — the cited source must actually exist *and support the claim*. (A citation can itself be hallucinated.)
5. **Honest labelling** — joke/folk entries are tagged `Folk-adage`/`Contested`, never laundered as `Empirical`.

This is not theoretical. Seeding just 11 laws surfaced two attribution errors that the open web repeats as fact:
- **Cobra Effect** — the famous Delhi cobra-breeding story is *unattested folklore* (traced to an 1873 report saying only that it "was alleged"). Our entry uses the documented 1902 Hanoi rat bounty instead and says so.
- **Campbell's Law** — "Occasional Paper #8 of the Public Affairs Center at Dartmouth" **does not exist**; it's a fusion of two separate publications.

## Two tiers

- **Canon** — historically attested, sourced, citation-gated.
- **Coined** — community-submitted originals, credited to their author, in a distinctly labelled wing with machine-readable `provenance: coined` so scrapers can't relaunder them as historical. Never a real-person `namedAfter` without verification.

## Layout

```
lawtome/
├── src/data/laws/*.json    # the corpus — one file per law (schema: lawtome/docs/CORPUS-SCHEMA.md)
├── src/data/categories.json # controlled vocabulary (closed list)
├── src/assets/              # styles.css, common.js, self-hosted fonts + icon subset
├── src/templates/           # (being built) head/header/footer, law, home, listing, graph
├── build/                   # (being built) validate → render → dist/
├── test/                    # node:test specs
├── index.html               # design prototype (home)   — templatised by Task 5/7
└── laws/goodharts-law.html  # design prototype (law page) — templatised by Task 6
docs/design-spec.md          # approved design spec
docs/engine-plan.md          # the 15-task implementation plan being executed
```

No third-party CDN at runtime: fonts and icons are self-hosted (which also honours the site's own "no tracking" claim, and is required because resvg can't fetch remote fonts for quote-cards).

## Design

Concept **"The Index"** — a literary serif (Fraunces) for the *law itself* against monospace for the *system* (index codes `№ 041`, categories, reliability stamps). Two first-class themes: **Foolscap** (warm paper/ink/vermillion) and **Codex** (near-black/cream/gold). Audience: knowledge-worker / Hacker-News-curious / dark-mode natives.

## Build

```bash
cd lawtome
npm install
npm test          # node:test
npm run build     # → dist/
npm run serve     # build + static server → http://localhost:8080/lawtome/
```

**Preview over HTTP, never `file://`** — internal links are root-relative (`/lawtome/...`) and don't resolve under `file://`.

## Status

Executing `docs/engine-plan.md` (15 TDD tasks, 4 chunks) via subagent-driven development: each task gets a fresh implementer → spec-compliance review → code-quality review, fixing until both pass.

**Task 1 — DONE.** Build scaffolding, `src/` restructure, self-hosted fonts/icons. Both gates passed after two fix rounds. Review caught: a 4.3 MB icon payload for 7 icons (now a 3.2 KB subset), a path traversal + crash in the `serve` script, variable fonts pinned to single weights, and missing `latin-ext` (which would have broken "Erdős" mid-word — it's a directory of *eponymous* laws).

**Task 2 — IMPLEMENTED, VERIFICATION INCOMPLETE.** Corpus schema + 11 seed laws. First spec review found **no fabrication** across all 10 non-exemplar entries and one must-fix (Peter Principle "214 firms" → **131**; 214 is the superseded NBER draft figure that NBER *and* Wikipedia still propagate). Fixes are applied and self-verified, and chasing them surfaced a second real error (the Campbell's Law attribution chain).
**Outstanding before Task 2 can be called done:**
1. Re-run **spec review** on fix commit — independently verify the *corrected* Campbell chain (Visegrád 1974 → Lyons ed. 1975, Dartmouth → WMU Paper #8 reprint 1976 → journal 1979, `coinedYear` 1975). A wrong correction is worse than the original error, so be skeptical.
2. Run the **code-quality gate** (never ran).

**Tasks 3–15 — pending:** slugify, corpus loader + validation, partials, law template, home template, build orchestrator, browse/category, search + random-law, graph explorer, quote-cards, sitemap/robots/redirects, coin/about/coined/privacy, integration + link check + HTTP smoke.

### Carry-forward notes for whoever continues

- **Task 4 (validation):** consider a check that every corpus string's codepoints are covered by the shipped font subsets (latin + latin-ext only; vietnamese/greek/cyrillic deliberately NOT vendored — see `lawtome/src/assets/fonts/README.md`). An uncovered glyph should *fail the build* rather than silently render in a fallback face mid-word.
- **Task 12 (quote-cards):** resvg only has Fraunces **weight 400** available, but the site styles statements at 500/600. If cards must match the site, vendor `Fraunces72pt-SemiBold.ttf` too. `Fraunces.ttf` is deliberately the static 72pt instance — resvg does no variable-font instantiation, so the VF would render at its default wght 900 / opsz 9.
- **`serve` deviates from the plan's literal one-liner on purpose** — the plan's version had a path traversal and died on malformed URIs. The hardened version is correct; don't "restore" it.
- The plan's Goodhart exemplar originally attached a Wikipedia URL to a *primary* citation; fixed here, since every entry is told to copy that exemplar.

Scaling the corpus from 11 → ~1,400 is a separate effort (Plan B), which reuses this engine unchanged. Plan B **must** include the resolve-and-read source-verification pass: 2 of 11 seed entries had attribution errors that the open web repeats as fact (see anti-fabrication above). Presence-of-a-citation is not enough; the build can only check presence, so "does the source actually say this?" needs a human/agent pass.

## Licence

Corpus: CC BY (attribution). Fonts: SIL OFL (texts vendored alongside). Tabler icons: MIT.
Law statements quoted verbatim are short quotations with attribution; all explanatory prose is original.
