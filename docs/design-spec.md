# The Law Tome — Design

**Date:** 2026-07-16
**Status:** Design approved, pending spec review
**Home:** `conyso.com/lawtome/` (canonical), `thelawtome.com` 301-redirects in
**Brand:** The Law Tome

---

## 1. Goal

Build the world's largest and most *definitive* directory of **named laws, principles, effects, razors, rules, adages, and paradoxes** — every named rule-of-thumb about how the world works (Parkinson's Law, Goodhart's Law, the Streisand Effect, Occam's Razor, Chesterton's Fence, the Peter Principle, Hofstadter's Law…).

Two objectives, in order:

1. **The flex (acquisition).** "World's largest" is the hook — the kind of resource that hits the Hacker News front page and earns organic backlinks, because everyone loves *"wait, there's a name for that."*
2. **Authority that compounds (retention).** The flex is the on-ramp; being *the canonical, cited reference* is the moat. Over 6–12 months this compounds into durable SEO authority and standing brand value for Conyso.

The win condition is **not** "biggest" — it's **"the resource people link to instead of the messy Wikipedia list."** Size is the headline; *canonical* is the goal.

**Precise size claim (defensible copy):** we claim the **"largest *unified, defined, and sourced* collection"** — not a bare "world's largest." Wikipedia's raw lists (eponymous laws + effects + paradoxes + adages), if unioned, may exceed our count on *raw, undefined* entries; our claim holds on the axis that matters (one place, every entry actually explained and sourced, searchable, cross-linked). All public copy must use the qualified claim, never an indefensible bare superlative.

## 2. Why this wins (the blue-ocean wedge)

Research confirmed the space is fragmented across four silos, and **nobody unifies them**:

- **Broad but shallow & unsearchable** — Wikipedia's lists (eponymous laws ~300, effects ~600 *with no definitions*, paradoxes, razors) — all separate, alphabetical, untagged, no search.
- **Deep but tiny & siloed** — hacker-laws (27k★ but ~50 dev entries), Laws of UX (richest per-entry template, but 31 entries), Farnam Street, ModelThinkers.

Today, someone wanting "all named rules-of-thumb in one place" must stitch together 4–5 sources. **The empty wedge: Wikipedia-scale breadth + Laws-of-UX-grade per-entry depth + the two things literally nobody does well — (a) faceted full-text search across the whole corpus, and (b) a graph of related/opposing laws.**

## 3. Scope & size

**Broad definition:** any *named* law, principle, effect, razor, rule, adage, or paradox — whether or not named after a person.

- **Core corpus (the Canon):** the deduplicated universe of real, attested entries is **~1,300–2,000**.
- **Single build target:** **launch at ~150–200 fully-polished Canon entries** (enough to beat every *branded* competitor and to be genuinely browsable), then **grow deliberately toward ~1,400** (the realistic ceiling of well-attested entries). ~150–200 is the launch bar; ~1,400 is the destination.
- **Adjacent, flagged separately:** cognitive biases (~190) and legal maxims (~130) — kept as clearly-labeled adjacent sections so the core count stays clean and unimpeachable, *not* blended into the Canon.
- **Competitive reference points:** the largest single existing list is Wikipedia's *List of effects* (~500–700 depending on how it's counted, but with **no definitions**); the largest *branded/curated* competitor (hacker-laws) has under 100. We surpass every branded competitor by the launch bar, and the *unified/defined/sourced* claim (§1) holds throughout — it does not depend on out-counting a raw Wikipedia union.

## 4. Two content tiers

The trust guarantee is *"every Canon entry is real and sourced."* Community-coined laws must never dilute that.

- **The Canon** — historical, attested, sourced. The definitive corpus. Each entry gated on a real citation.
- **New Laws (Coined)** — community-submitted originals, credited to their author, in a **distinctly labeled, separate section** — never dressed up as historical. This is a unique differentiator (nobody else lets you coin and publish a law) and a built-in growth loop.

Both tiers flow through **our review** before anything goes live (see §7). No unreviewed content is ever published.

## 5. Entry schema (field set final; category vocabulary TBD)

*The field set below is locked. The controlled category vocabulary for field #7 is deferred to the implementation plan (§13) — the schema shape is final, the tag list is not yet enumerated.*

**Core fields (every entry):**

1. **Name** (+ aliases / alternate names) — SEO gold; `DefinedTerm.name` + `alternateName`.
2. **The law** — the verbatim one-liner. The hero: quotable, screenshot-able, the shareable atomic unit.
3. **Plain-English meaning** — 1–2 sentences. The featured-snippet / AI-answer target; kept genuinely short.
4. **Concrete example** — one vivid, specific example. Our differentiator vs. Wikipedia.
5. **Origin** (prose) — who / when / where. Narrative provenance.
6. **Citation** (visible, 1–3 sources) — a *real, publicly shown* source block, split out from Origin. The trust moat + anti-fabrication anchor + what makes others cite us. **Publication gate for the Canon.**
7. **Category** — controlled vocabulary (~10–15 fixed tags). Powers faceted filter.
8. **Related laws** (2–4 cross-links) — highest-ROI internal linking; feeds the relationship graph.
9. **Structured date/era** — year pulled out of prose; enables timeline & "coined in 1955" snippets.
10. **Reliability label** — a badge: *Empirical* / *Heuristic* / *Folk-adage* / *Contested*. Honest, sortable.

**Optional fields (populate where genuinely good; never gate publishing on them):**

11. **Why it matters / Takeaway** — one actionable or cautionary line. Skippable for purely descriptive laws.
12. **Corollary / counter-law** — delightful where it exists (Hofstadter self-reference; Hanlon ↔ Occam).
13. **Commonly confused with** (1–2 links) — distinct from Related; high clarification value (Occam's vs Hanlon's Razor).

**Content-depth rule:** each entry is as deep as it genuinely warrants — famous laws run long and rich, obscure ones stay tight but real. **Every entry sourced and example-backed; zero padding.** (Word count is not a target; padding is a spam signal, not a quality one.)

## 6. Site-level features

**Canonical-resource mechanics (the three that decide whether we become the linked-to reference):**

- **Per-entry permalinks** — `/lawtome/goodharts-law/`, each its own crawlable URL with its own OG image and a copy-ready "cite this entry" string. The mechanical precondition for being cited.
- **Fast client-side search + category filter + "random law"** — instant fuzzy search over names/aliases, faceted filter by the controlled vocabulary, a "surprise me" button. Turns a list into a destination people bookmark and return to.
- **Auto-generated shareable quote-cards** — a clean image per law (verbatim one-liner + attribution + URL watermark), generated from field #2. Laws of UX's posters were its single biggest backlink driver; this is the cheap, scalable version.

**Signature differentiator:**

- **The relationship graph** — render Related + Confused-with as an actual *visual, wanderable graph* (Goodhart → Campbell's Law → Cobra Effect → Streisand…). The "I lost an hour in here" mechanic that earns the top HN comment. Two costs to design around, both real: **(a) authoring cost** — 2–4 quality cross-links per entry across ~1,400 entries is a large, ongoing content-authoring effort (AI-proposed, human-approved, never auto-published); **(b) legibility at scale** — a 1,400-node global graph is an unreadable hairball, so the graph is always rendered as a **local neighborhood** (the current law + its 1–2-hop relations), never a global view. The moat is execution + first-mover + inherited domain authority, not structural un-copyability — frame it honestly.

**Contribution loop (no open PRs — quality-controlled):**

- **Submission form** with two modes: *"Suggest a law"* (for the Canon — we verify attestation/sourcing) and *"Coin a law"* (an original — we vet novelty/usefulness and authorship, subject to the real-person-attribution constraint in §7). Form feeds a **review queue we process manually**; vetted entries are added to the corpus and the site rebuilds. This gives contribution energy and authenticity signal *without* quality decay. **The manual-review step is core scope, not peripheral** — it is the linchpin the anti-fabrication guarantee (§7) depends on, so it needs (a) minimal queue tooling and (b) a named owner. It is also a deliberate throughput bottleneck; that is acceptable and preferred over open publishing.

**Durable capture asset:**

- **v1: an on-site "Law of the Day"** (a homepage/widget feature, no PII, no consent burden) so a launch visitor has a reason to return. **Email capture is explicitly deferred to a later phase** because it collects PII and pulls in privacy-policy, consent, and list-management obligations (§8A) that shouldn't gate the launch. One mechanism for v1, not "and/or."

## 7. Anti-fabrication pipeline

Claude will happily invent plausible-but-fake laws; for a resource whose whole value is trustworthiness, a single caught fabrication is fatal. Slop-proof by construction:

1. **Enumerate from real sources, not memory.** Seed the master list from actual references (Wikipedia lists of eponymous laws / effects / paradoxes / adages, hacker-laws, the Jargon File, academic glossaries), merged and deduped. Claude *organizes* the known universe; it does not *hallucinate* it.
2. **Citation gate.** No Canon entry ships without a genuine, citable origin. Field #6 is the gate, not decoration.
3. **Adversarial verification pass.** A separate Claude pass tries to *refute* each drafted entry — "real attested named law, or plausible invention? Cite the source or flag it." Anything undefendable is pulled. Cheap to run at scale — exactly what the Max plan makes trivial.
4. **Source-resolution check (closes the hallucinated-citation hole).** The adversarial pass is still Claude checking Claude, and *a citation can itself be fabricated* — a plausible-looking source that doesn't exist, or a real source that doesn't actually support the attribution. So every Canon citation must be **resolved and confirmed**: the URL/DOI actually loads, the source is real, and it genuinely supports the claim. This is a **human-review responsibility** (the reviewer clicks the source), backstopped by automated link-resolution to flag dead/unreachable citations. Passing the "citation gate" means a *verified* source, not merely a *present* one.
5. **Honest labeling.** Grey-zone entries (joke laws, folklore) are *kept but tagged* honestly (via the Reliability label: *Folk-adage*, *Contested*) rather than laundered as serious. The honesty is part of the trust.

**The coined-law fabrication-laundering vector.** The protections above are Canon-scoped; the New Laws tier deliberately publishes originals with no historical-attestation requirement. Left unconstrained, a submitter could inject a plausible fake "law" credited to a real-sounding person, which — if scraped and re-cited off-site — launders a fabrication *through* us, the exact failure mode we call fatal. On-site labeling mitigates locally but not off-site propagation. Constraints:

- **No real-person attribution on a coined law without verification.** Coined laws are credited to the *submitter* (a handle/name they own), never asserted as originating from a third party unless independently verified — which would make it a Canon candidate, not a coined one.
- **Machine-readable provenance.** Coined entries carry distinct schema.org / metadata marking (a `provenance: coined` signal, distinct `@type`/`additionalType` or a clear `disambiguatingDescription`) so scrapers and AI answer engines can *programmatically* tell coined from historical — not just human readers.
- **Defamation/accuracy guard.** Any attribution to a living, named third party (Canon or coined) is treated as an accuracy-and-defamation-sensitive claim and requires source resolution (step 4) before publishing.

## 8. Neutrality & the Conyso relationship

- **Hosted** on `conyso.com/lawtome/` to inherit the aged domain's authority and skip Google's 3–9 month new-domain sandbox — a decisive SEO head-start for the authority objective.
- **Editorially neutral — precisely.** The neutrality boundary is: **no Conyso product/tool links or ads inside entries.** Brand *attribution* is retained (the content lives at a conyso.com URL, and quote-cards carry a URL watermark) — that is attribution, not an ad, and it's the mechanism by which the flex accrues to Conyso. Hosting ≠ product-funneling. A forced product link would undermine the press/backlink credibility; a URL watermark does not. (The earlier "link laws to Conyso tools" idea was explicitly dropped.)
- **SEO dilution risk (acknowledged).** Injecting a large, topically-unrelated corpus under a commercial SaaS domain carries a flip risk — Google could read `/lawtome/` as a doorway/microsite play or dilute conyso.com's topical focus. Mitigation: treat the microsite as a genuinely distinct, high-quality section; monitor after launch. If authority ever argues for a standalone domain, note the redirect direction (`thelawtome.com` → microsite) is a **reversible** decision, not a locked one.

## 8A. Licensing, IP, privacy & entry lifecycle

**Corpus derivation & copyright.** A law's *existence*, its short factual statement, and its origin are **facts, not copyrightable expression** — so enumerating "which named laws exist" from Wikipedia's lists is fine. What *is* copyrighted is Wikipedia's **prose** (CC BY-SA). We therefore **write our own** plain-English meanings, examples, and takeaways rather than copying Wikipedia text, so our entries are original expression, not derivatives. Where a specific one-liner is a *direct verbatim quote* of a source (field #2), it's short-quotation-with-attribution, cited in field #6. Net: we harvest the *list* (facts), author the *content* (original), and cite sources — avoiding CC BY-SA share-alike obligations that would otherwise attach to derivative text.

**Our corpus license.** The Law Tome's own corpus/data carries an explicit license (recommend a permissive-with-attribution license such as CC BY, chosen in the plan) — being *citable and reusable-with-credit* is itself part of becoming canonical. The public companion export (if any) uses the same license.

**Coined-law rights.** The "Coin a law" form includes a clear rights grant: the submitter grants The Law Tome a non-exclusive, perpetual license to publish and display the submission with attribution; the submitter retains authorship credit. Submitter warrants it's their original work. (Exact terms drafted in the plan.)

**Privacy, consent & anti-abuse.** The submission form and any future email capture collect PII and therefore require: a **privacy policy**, explicit **consent** at point of capture, GDPR-appropriate basics, and **anti-abuse handling** on the endpoint (rate-limiting, spam/bot filtering, no injection into live content — everything goes to the manual review queue first). The v1 on-site "Law of the Day" avoids PII entirely; email capture (deferred) is what triggers the consent/list-management obligations.

**Entry lifecycle & permalink stability (canonical-reference requirement).** People cite our URLs, so URLs must be trustworthy over time:
- **Permalinks are stable/immutable.** A published entry's slug does not change.
- **Corrections** update content in place, with a lightweight "last updated" signal; the *identity* of the entry is preserved so existing citations still resolve to the same concept.
- **Merges/removals** leave a **301 redirect** to the surviving/most-relevant entry — never a dead link. Deleting a cited URL outright is prohibited.
- This lifecycle policy is part of what makes us safe to cite, which is the whole retention thesis.

## 9. SEO & structured data

- Model each entry as **`DefinedTerm`**, wrap the directory in **`DefinedTermSet`** (JSON-LD).
- **Stack schemas:** `DefinedTerm` + `Article`/`WebPage` + `BreadcrumbList` (Home › Category › Term) + a light `FAQPage` ("What is X?" / "Who coined X?" / "X vs Y?").
- **`sameAs`** → Wikipedia/Wikidata on each entry where a node exists — a high-value disambiguation signal for Google and AI answer engines.
- **One crawlable URL per entry** (not fragments on a mega-page). Plain `<a>` internal cross-links (Related + Confused-with) — the top on-page SEO lever.
- Short plain-English definition in the **first 1–2 sentences of visible body copy**, near the top of the DOM (wins featured snippets & AI-overview citations).
- **Realistic timeline:** we won't out-rank Wikipedia for head terms ("Occam's razor"); we win the **long tail** ("law about work expanding to fill time," "the effect where people want what they can't have") and **collection/comparison queries**. Hosting on conyso.com plus an HN/Reddit backlink jumpstart is what accelerates this.

## 10. Tech approach (design-level)

Fits the existing Conyso microsite pattern (full-bespoke, deterministic, static, vanilla JS — like Beacon Forge at `conyso.com/beacon-forge/`):

- **Corpus = structured data** (JSON per entry / a single data file) → **statically generated** per-entry pages. Deterministic build, no runtime LLM.
- **Search index prebuilt** and shipped for client-side fuzzy search; **relationship graph prebuilt** from the Related/Confused-with fields.
- **Quote-cards** generated at build time from field #2.
- **Submission form** posts to a lightweight capture endpoint (serverless function or form service) with anti-abuse handling (rate-limiting, spam/bot filtering, consent capture — see §8A); the **review queue is processed manually by us** — vetted entries are hand-added to the corpus and the site rebuilds. No live user-generated content renders on the site.
- **Minimal review-queue tooling** is in scope (not peripheral): a lightweight way to see submissions, resolve/verify citations (§7 step 4), approve/reject, and stamp provenance. Can be as simple as a structured inbox + a checklist, but it must exist.

## 11. Launch (informed by precedent)

- Ship a **genuinely finished, beautifully browsable** first release — design > raw count. (hacker-laws capped at 203 HN points for being an unstyled README; Laws of UX hit 1,037 with ~30 polished, well-designed entries.)
- **Show HN**, Tue–Thu US morning, present to answer comments. Evergreen references get re-posted for years — launch day is not one-shot.
- Lead the front page with the *relatable, surprising* laws (Streisand, Goodhart, Parkinson), not the obscure tail — the "wait, there's a name for that" dopamine is the growth engine.

## 12. Explicitly out of scope (YAGNI / decided against)

- **Per-law Conyso tool cross-links** — dropped (neutrality + Conyso has its own surfaces).
- **Open PR contributions** — replaced by the reviewed submission form (quality control).
- **Blending biases / legal maxims into the Canon** — kept as flagged adjacent sections only.
- **Forcing 1,000-word entries / uniform length** — padding is a spam signal; depth-as-warranted instead.
- **Standalone primary domain** — microsite is primary; `thelawtome.com` only redirects in.

## 13. Open implementation questions (for the plan)

- Exact controlled-vocabulary category list (~10–15 tags) — schema field #7's vocabulary (the field set itself is final, §5).
- Corpus license choice (recommend CC BY) and the coined-law rights-grant/warranty wording (§8A).
- Submission-form backend choice (serverless fn vs. third-party form service) and the review-queue tooling (§6/§10 — core, not optional).
- Graph rendering approach (lightweight vanilla-JS lib vs. hand-rolled SVG), rendering local neighborhoods only (§6).
- Build pipeline for static generation within the existing conyso.com structure, including permalink/redirect handling for the lifecycle policy (§8A).
- Initial launch-batch selection (which ~150–200 polished entries seed the first public release, §3).
