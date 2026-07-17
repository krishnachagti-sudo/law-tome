# Corpus schema — The Law Tome

Every entry in the directory is one JSON file in `src/data/laws/`. The filename stem **is** the
entry's identity: `src/data/laws/goodharts-law.json` must contain `"slug": "goodharts-law"`.

`src/data/categories.json` holds the controlled vocabulary — a closed map of `key → display label`.
It is the only permitted source of `category` values.

The canonical exemplar is [`src/data/laws/goodharts-law.json`](../src/data/laws/goodharts-law.json).
When in doubt, copy its shape.

---

## The rules that fail the build

The build validator (`build/validate.mjs`) enforces every one of these. They are not style advice.

1. **Filename === slug.** `slug` must equal the filename stem.
2. **Closure.** Every slug appearing in `related[].slug` or `confusedWith[]` MUST have its own file
   in the corpus. No dangling cross-references. If you want to link a law that is not in the corpus
   yet, add that law first or drop the reference.
3. **`statementAccent`, when present, must be an exact substring of `statement`.** The page template
   wraps the accent in a span by string match; if it is not a verbatim substring the accent silently
   vanishes. Watch for curly vs straight apostrophes and en-dashes. The field itself is optional (the
   template guards its absence) — but a *present* accent that doesn't match fails the build.
4. **`category` must be a key in `categories.json`** — not a label, not a new tag.
5. **`reliability` and `provenance` must be one of the enum values below.**
6. **`no` must be unique** across the corpus.
7. **Canon entries must carry at least one source.**

---

## Anti-fabrication rules

The site's entire value proposition is that every entry is real and sourced. One invented law or
one invented citation destroys it. These rules are not negotiable.

- **Never invent a law.** Every `provenance: "canon"` entry must be a genuinely attested, named
  law/principle/effect that exists independently of this site.
- **Never invent a citation.** Every entry in `sources` must be a real, verifiable publication.
  Do not write citations from memory — verify them. Volume numbers, page ranges, years, and
  publishers are exactly the details that models hallucinate most fluently.
- **Verify, don't recall.** Confirm attributions, years, and sources against the actual record
  before writing them down.
- **A URL you cannot resolve is not a citation.** If a source cannot be verified to exist, either
  cite it text-only (when its existence is corroborated by other verified sources) or drop it.
  Prefer a shorter source list over a padded one.
- **Wikipedia is at most one corroborating `secondary` source.** It is never the sole basis for a
  claim you could not otherwise verify.
- **Cite the version of record, and check your numbers against it.** Preprints and working-paper
  drafts get superseded and their figures revised, but the drafts stay online and keep getting
  quoted. Any figure in an entry must match the version actually cited — not a draft, not a
  landing page, not an encyclopaedia's summary of it. `the-peter-principle` carries a standing
  note about exactly this trap: the published paper says 131 firms, the 2018 draft said 214, and
  the stale number is still propagated by both the NBER page and Wikipedia.
- **A source must support the specific claim attached to it.** It is not enough that the source is
  real and the claim is true; the cited source must actually establish that clause. Splitting a
  sentence across two sources is fine — quietly resting a claim on a URL that does not mention it
  is not.
- **When unsure, omit or soften.** Omit an uncertain optional field rather than assert a false
  precision. Where the record itself is murky (see `hanlons-razor`, `occams-razor`), say so
  explicitly in `origin` — the honesty is the product.
- **Coined entries must not assert a real-person `namedAfter`.** A `provenance: "coined"` entry is
  a community-submitted original. It has no historical namesake, and inventing one would
  manufacture a fake attribution. Omit `namedAfter` on coined entries.
- **`example` is an illustration, not a citation.** It may be an invented scenario (see the
  exemplar's call centre). If it instead recounts a real event, that event must be verified and
  sourced to the same standard as any other claim.

---

## Fields

### Required

| Field | Type | Notes |
| --- | --- | --- |
| `no` | string | Zero-padded 3-digit, e.g. `"014"`. Unique. Defines corpus sort order. Leave gaps so entries can be inserted without renumbering. |
| `slug` | string | Lowercase, hyphenated, apostrophes stripped. `Goodhart's Law` → `goodharts-law`. Must equal the filename stem. |
| `name` | string | Display name, e.g. `"Goodhart's Law"`. |
| `statement` | string | The crisp quotable one-liner. Where a canonical verbatim wording exists, use it verbatim. |
| `meaning` | string | 1–2 sentences, plain English, no jargon. |
| `example` | string | ONE vivid, concrete, specific example. |
| `origin` | string | Prose: who, when, where. The place to be candid about disputed or thin attribution. |
| `category` | string | A key from `categories.json`. |
| `reliability` | enum | See below. |
| `provenance` | enum | See below. |
| `sources` | array | See below. **Required for `canon`** (≥1 real source — the citation gate); omitted on `coined`, which renders a submitter credit instead. |

### Optional

| Field | Type | Notes |
| --- | --- | --- |
| `statementAccent` | string | Strongly recommended (every seed entry carries one). A **verbatim substring** of `statement`, rendered as a highlighted accent on the law page. Optional — the template guards its absence — but when present it must match exactly, or the build fails (rule 3). |
| `aliases` | string[] | Other names the law travels under. Omit if none. |
| `whyItMatters` | string | The "so what". **Omit** where the law is purely descriptive and forcing advice would be strained. |
| `coinedYear` | number | Year first stated. Omit where genuinely indeterminate — `occams-razor` omits it because Ockham's own formulations are early-14th-century and undated while the famous phrasing is 1639. |
| `popularYear` | number | Year it took its famous form or reached wide currency, where meaningfully later than `coinedYear`. |
| `namedAfter` | string | The real person the law is named for. May name more than one (`"David Dunning and Justin Kruger"`). Omit when the law is not named after a person (`cobra-effect`). Never present on coined entries. |
| `sameAs` | string | Wikipedia/Wikidata URL, used for schema.org disambiguation. |
| `related` | array | `{slug, kind}`. 2–4 where genuinely apt — fewer is fine, padding is not. Subject to closure. |
| `confusedWith` | string[] | Slugs people genuinely mix this one up with. Distinct from `related`. Omit if none. Subject to closure. |

> Do **not** hand-write `prev`/`next`. They are computed from corpus order (`no`) by the build.

### `sources[]`

```json
{"text": "Kruger, J., & Dunning, D. (1999). \"Unskilled and Unaware of It...\" JPSP, 77(6), 1121–1134.",
 "url": "https://doi.org/10.1037/0022-3514.77.6.1121",
 "type": "primary"}
```

| Key | Required | Notes |
| --- | --- | --- |
| `text` | yes | Full human-readable citation. May carry a trailing `— note` explaining what the source establishes. |
| `url` | no | Omit when there is no stable public URL (most books) or when the URL cannot be verified. A citation without a URL is fine; a wrong URL is not. |
| `type` | yes | `primary` \| `secondary`. |

`primary` = the work that stated the law, or original scholarship establishing the facts of the
case. `secondary` = reference works, encyclopaedias, and later commentary.

### `related[].kind`

A short relationship label, rendered as-is. Used so far: `near-twin`, `consequence`, `cause`,
`kindred`. Keep the vocabulary small and reuse existing labels before minting new ones.

---

## Enums

### `reliability`

Be honest. This field is the reader's guide to how much weight the claim carries.

| Value | Means |
| --- | --- |
| `Empirical` | Established by published research. Use even where interpretation is debated — note the debate in `origin` (see `dunning-kruger-effect`). |
| `Heuristic` | A useful, well-observed rule of thumb, but not an empirical finding. The common case. |
| `Folk-adage` | A saying. Murphy's-law-style aphorisms with thin or anonymous provenance belong here, not in `Empirical`. |
| `Contested` | The existence or validity of the effect itself is genuinely disputed. |

### `provenance`

| Value | Means |
| --- | --- |
| `canon` | Historically attested outside this site. Requires ≥1 real, verified source. |
| `coined` | A community-submitted original. Must not claim a real-person `namedAfter`. |

---

## Adding an entry — checklist

1. Verify the law exists and is genuinely named. If you cannot source it, it does not go in.
2. Verify every citation against the actual record. Resolve every URL you include.
3. `slug` matches the filename; `no` is unique and leaves room around it.
4. `statementAccent` is a verbatim substring of `statement`.
5. `category` is a key in `categories.json`; `reliability`/`provenance` are valid enum values.
6. Every `related`/`confusedWith` slug has a file in the corpus.
7. Canon entry has ≥1 source.
8. Uncertain about a year or an attribution? Omit the field and explain in `origin`.
