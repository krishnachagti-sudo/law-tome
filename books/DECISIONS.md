# Law Tome books: decisions

Approved by Krishna on 2026-11-11. The reasoning and sources are in
`reports/Writing and illustrating Law Tome books.md`; this file is the short
record the build and every brief follow.

| # | Decision | Chosen |
|---|---|---|
| 1 | Spelling | US spelling in the books. The site stays British. |
| 2 | "You" in body text | Allowed per book on its register card: yes for prompts, the Workbook, Laws That Rule the Universe and Name That Law scenarios; no in the Pocket Book, The Engineer's Law Book, True or Folklore? and Who Was Murphy? |
| 3 | Laws That Rule the Universe | Ages 11–14. |
| 4 | Editing capacity | A paid 5–10k-word sample edit of a Claude draft first, to measure real hours; then set lengths; spread the eight books over six weeks or more. |
| 5 | Covers | One designer builds a series template plus 8 variants. AI art only for simple emblems, never title text. |
| 6 | Title testing | PickFu polls, about $400 for all eight. |
| 7 | Type | Fraunces for the law line and headings; a calmer text serif for prose. Confirm on a printed proof, and test Typst's control of Fraunces's axes first. |
| 8 | Images | Final images through Vertex AI (indemnity), after confirming the model is GA and the indemnity covers this account. Drafts may use Higgsfield. |
| 9 | Sources | A short source line on each entry plus a full sources page on conyso.com. |
| 10 | First book | True or Folklore?, with a fixed word and hour cap. |

## Book-level decisions

- **True or Folklore? answer layout** (2026-11-11): answer overleaf. Each question sits alone on a right-hand page and its answer is printed on the back. The Kindle edition hides each answer behind a link from its question.

## Standing rules

- KDP: tick "AI-generated" for text and images on every title. One account; series names, no invented author persona. Credit: Krishna Chagti, ed., The Law Tome / Conyso.
- Upload cap: 2 new titles per format per week (KDP help G202172740, checked 2026-11-11).
- Every manuscript passes `lawtome/scripts/wiki-overlap.mjs`: any non-quotation run of 12+ words shared with a cited Wikipedia article is rewritten.
- Book prose lives in `books/<book>/`, never in the corpus files.
- Every book links a public errata page from its front matter.
