# Candidate certifications: project, product, agile, business analysis, quality, supply chain, HR

Researched 2026-09-24. Scope: which certifications in this area deserve a free, sourced flashcard deck (Anki + CSV + web page). **This is not legal advice.**

**Evidence rules.** Every figure comes from raw text I fetched with curl and text extraction or pdftotext. Raw copies are in `scratchpad/candidates/raw-pb/`: `<name>.html|pdf`, `<name>.txt`, and `<name>.url` holding the source URL. Reddit data comes from search RSS feeds in `raw-pb/rss/` and is counted by `raw-pb/rss/analyze.py`. AnkiWeb deck facts come from AnkiWeb's `svc/shared/item-info` endpoint, decoded by `raw-pb/ankiweb_info.py` into `raw-pb/ankiweb/`. WebSearch result lists are in `raw-pb/websearch_log.md`. **The search tool is not Google.** I use the result lists only to say who ranked; the tool's summaries are never cited as evidence. Where I reuse the 2026-09-23 market research in `research/cert-decks/certification-market/`, I say so as "(prior: file.md)".

**Blocked or unreadable sources:**
- pmi.org HTML (403); PMI PDFs under `/-/media/` do load.
- scrum.org (AWS WAF challenge). I read Wayback Machine copies instead and name each snapshot.
- ascm.org HTML (JavaScript shell); some ASCM PDFs load.
- axelos.com (JavaScript shell); I read a Wayback copy.
- asq.org legal page (403).
- Quizlet and Etsy (403, per prior research).
- support.shrm.org (TLS error through the proxy).
- The IASSC Body of Knowledge page (redirect loop).

**Limits on the search data:**
- The session's WebSearch budget ran out partway through. Queries I could not run are listed in `websearch_log.md`.
- Reddit rate-limited (HTTP 429) most RSS requests. The counts I obtained are in the Reddit table (§2), and the failed feeds are marked there.

---

## 1. Summary table

Scores run from 1 (bad) to 5 (good). A high Rules-safety score means low risk. A high Stability score means low churn. The maximum total is 35.

| Rank | Certification | Demand | Gap | Source | Rules | Stability | Partner | Search | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Scrum.org PSM I** | 5 | 4 | 5 | 4 | 5 | 3 | 4 | **30** |
| 2 | **Scrum.org PSPO I** | 4 | 4 | 4 | 4 | 5 | 3 | 3 | **27** |
| 3 | **Scrum Alliance CSM** (same Scrum Guide deck) | 3 | 3 | 5 | 4 | 5 | 2 | 3 | **25** |
| 4 | **ASQ CSSGB + generic Lean Six Sigma Green Belt** | 2 | 4 | 3 | 4 | 5 | 2 | 4 | **24** |
| 5= | ASQ CQE | 2 | 4 | 3 | 4 | 5 | 1 | 3 | **22** |
| 5= | ASQ CSSBB | 2 | 4 | 3 | 4 | 5 | 1 | 3 | **22** |
| 7 | **PMI PMP** (2026 ECO) | 5 | 3 | 2 | 2 | 3 | 4 | 2 | **21** |
| 8 | HRCI PHR (with SPHR) | 2 | 3 | 3 | 3 | 4 | 2 | 4 | **21** |
| 9 | PMI-ACP | 2 | 4 | 3 | 2 | 4 | 2 | 3 | **20** |
| 10 | IIBA ECBA (and CBAP) | 2 | 4 | 2 | 2 | 3 | 3 | 4 | **20** |
| 11 | PMI CAPM | 3 | 3 | 2 | 2 | 3 | 3 | 3 | **19** |
| 12 | SHRM-CP / SHRM-SCP | 4 | 3 | 3 | 1 | 2 | 3 | 3 | **19** |
| 13 | PRINCE2 7 Foundation | 3 | 4 | 1 | 1 | 4 | 2 | 4 | **19** |
| 14 | ASCM CPIM / CSCP / CLTD | 2 | 4 | 1 | 2 | 3 | 2 | 4 | **18** |
| 15 | CIPS (Level 4 Diploma) | 2 | 4 | 1 | 2 | 3 | 2 | 4 | **18** |
| 16 | PMI-RMP | 1 | 4 | 2 | 2 | 3 | 1 | 3 | **16** |
| 17 | SAFe Agilist | 4 | 3 | 1 | 1 | 2 | 1 | 3 | **15** |

Rows are ranked by total. Ties are broken by the size of the verified market. **PMP (21)** has by far the largest market but scores low on sourcing and rules. If the rules problem were solved, for example with a PMI licence, it would be the strongest commercial pick.

### Findings that drive the ranking

1. **The Scrum Guide is the only openly licensed body of knowledge in this whole area.** Its PDF and web version say: "This publication is offered for license under the Attribution Share-Alike license of Creative Commons" (CC BY-SA 4.0) (`scrumguide_2020.txt`, `scrumguide_pdf.txt`; https://scrumguides.org/scrum-guide.html). Scrum.org says a PSM I holder has "proven that you understand Scrum as described in the Scrum Guide" (Wayback copy of the PSM I page, 2026-09-02). Scrum.org publishes the largest verified holder counts in this area:
   - "Over 1,190,000 Professional Scrum Certified", data "last updated May 1, 2026";
   - PSM I **759,519** and PSPO I **268,195**;
   - source: Wayback copy of https://www.scrum.org/professional-scrum-certifications/count, snapshot 20260611.

   One CC BY-SA deck serves PSM I, CSM and the Scrum parts of PMI-ACP and CAPM. Share-alike means the deck itself must carry CC BY-SA.
2. **Four bodies explicitly forbid or require a licence for exactly this product:**
   - **Scaled Agile (SAFe):** "SAFe® content may not be used to create other training or services, or anything that competes with a Scaled Agile, Inc. offering". It also says the marks may not be used "in the title of or to describe any other materials or services".
   - **AXELOS/PeopleCert (PRINCE2):** "Where you wish to incorporate an Axelos word mark into the title or name of a product a trade mark licence must be obtained".
   - **PMI:** "Commercial products like flash cards and smartphone apps sold outside of the classroom" need a custom licence. Also, "PMI copyrighted material is not permitted for use on public websites" (prior: rules-risks.md §6).
   - **SHRM:** "Our Trademarks may not be used in connection with any product or service that does not belong to us".
3. **Some bodies' own documents tell third parties to build prep material from the outline.** Neither grants a licence to reproduce.
   - HRCI: the Exam Content Outline "is used by exam question writers and organizations that develop study/preparation materials" (`hrci_ecos.txt`).
   - SHRM: the BASK is "the common framework for... individuals and organizations developing exam preparation materials" (`shrm_bask.txt`).
4. **ASQ exams are open-book.** "All ASQE exams are open-book" (`asq_hb.txt`). That weakens the memorisation case for CSSGB, CSSBB and CQE, but they have the most stable outlines (all "2022 ... BoK").
5. **Several bodies sell flashcards themselves, so their users are already primed for the format:**
   - PMI Study Hall: "200+ Flashcards" (`pmi_sh_faq.txt`);
   - ASCM Learning Systems: CLTD brochure, "Study flashcards to reinforce your memory of key..." (`ascm_cltd_brochure.txt`);
   - Brainscape's PMP deck, "designed in partnership with Instructing.com" (`bs_pmp.txt`).

---

## 2. Reddit deck-demand data (RSS, top of all time, ≤100 posts per feed)

"Deck-titled" means the title contains anki, flashcard or deck. Raw feeds are in `raw-pb/rss/`, and the prior r/pmp run is in `certification-market/distribution.md`.

| Subreddit | Query | Results | Deck-titled | Example titles |
|---|---|---|---|---|
| r/pmp | anki | 18 (prior run) | 4 (prior) | "Anki decks for PMP"; "Anki Vargas deck" (prior: distribution.md) |
| r/pmp | flashcards | 100 | 1 | "Flashcards from 11 months of studying...passed today" (2019) |
| r/CAPM | anki | 12 | 1 | "Quizlet or Anki Decks?" (2025-03-08) |
| r/CAPM | flashcards | 100 | **7** | "CAPM Flashcards" (2025-02-28; 2023-02-05; 2020-07-26); "CAPM FlashCards" (2024-03-12); "Number of Flashcards" (2023-02-18); "Peter Landini CAPM Prep Flash Cards Issue" (2025-12-18); "Peter Landini PDF/Flashcard?" (2025-09-13) |
| r/businessanalysis | flashcards | 7 | 1 | "ECBA Flashcards?" (2024-04-14) |
| r/SixSigma | flashcards | 0 | 0 | — |
| r/agile | anki | 0 | 0 | — |
| r/scrum | anki | 0 | 0 | — (see note) |
| r/scrum | flashcards | 0 | 0 | — (see note) |

**Note on r/scrum.** Both feeds returned HTTP 200 with zero entries. I could not validate this with a control query, because `PSM` got 429 three times. The zero may be real or may be a search quirk. **Treat it as not verified.**

**Not fetched (rate-limited, HTTP 429):**
- r/agile flashcards
- r/PRINCE2 anki and flashcards
- r/SAFe anki and flashcards
- r/businessanalysis anki
- r/SixSigma anki
- r/LeanSixSigma anki and flashcards
- r/supplychain anki and flashcards
- r/APICS anki and flashcards
- r/SHRM anki and flashcards
- r/humanresources anki and flashcards
- r/PHR anki and flashcards
- r/CIPS anki and flashcards
- r/projectmanagement anki and flashcards
- r/Anki searches for PMP, scrum, SHRM, six sigma, APICS, CIPS, PRINCE2, CBAP, PHR and CAPM
- r/scrum PSM
- r/pmp anki (re-fetch; the prior run's figure is used)

For these certifications the demand scores rest on holder counts and Brainscape user-deck learner counts instead.

---

## 3. Per-certification evidence

### 3.1 Scrum.org PSM I (Professional Scrum Master I). Score 30.
- **Volume:** 759,519 PSM I holders (scrum.org count page, Wayback snapshot 2026-06-11, "last updated May 1, 2026") (`scrumorg_count_wb.txt`).
- **Exam:** "$200 USD per attempt"; "Passing score: 85%"; "Time limit: 60 minutes"; "Number of Questions: 80". Attending a course is not a prerequisite. Source: PSM I page, Wayback snapshot 20260902220100 (`scrumorg_psm1_wb.txt`).
- **Deck demand:**
  - Brainscape lists "User-Generated Flashcards (47)" under subjects/psm. The top decks have 155, 151 and 129 learners (`bs_subjects_summary.txt`), which is low.
  - Reddit: see §2.
- **Existing supply:**
  - The #1 result for "PSM I anki deck" is an AnkiWeb "Scrum (PSM-I) Deck" (473611576). Its item-info endpoint now returns no deck ("not available"), so it has been removed.
  - The rest of that result list is Gumroad (ankiguru, hacknheal) and irrelevant items.
  - "PSM I flashcards" returns an Amazon book ("400 Core Concepts", Frlez), 4 Quizlet sets, 2 Brainscape decks, Cram and Stuvia (`websearch_log.md`).
  - GitHub: "anki scrum", "psm1 flashcards" and "scrum master exam flashcards" all return 0 repos (`github_search_notes.txt`).
  - Scrum.org's own page links "Practice with Open Assessments". These are free official practice questions, not flashcards.
- **Official flashcards:** none seen.
- **Sources:**
  - Scrum Guide 2020 under CC BY-SA 4.0. The scrumguides.org web version is "a direct port of the November 2020 version".
  - The site footer says "© 2025 ScrumGuides.org. All rights reserved." That covers the site, while the Guide text carries the CC licence (`scrumguide_2020.txt`).
  - The exam's focus areas are listed on the PSM I page: "Empiricism, Scrum Values, Scrum Team, Events, Artifacts, Done"; "Self-Managing Teams, Facilitation, Coaching"; "Forecasting & Release Planning, Product Value, Product Backlog Management, Stakeholders & Customers".
  - Only the first group maps fully onto the Scrum Guide. The other two need extra sources, and I found no openly licensed one.
- **Rules:**
  - Scrum.org's trademark list and terms pages were behind the WAF and had no archived copy that I could read. **Not verified.**
  - The PSM I page styles its names with ™ ("Professional Scrum Master™"). Use plain-text nominative reference with the ™ and an attribution line.
- **Churn:** the Scrum Guide on scrumguides.org is still the November 2020 version as of this fetch. No new version announcement was seen.
- **Partnerships:**
  - Scrum.org runs Professional Scrum Trainers and a forum. The forum's existence is seen in search results only. Any named trainer who would recommend a deck: **not verified.**
  - Scrum Alliance's CSM study guide tells candidates to "keep a copy of the Scrum Guide handy" (`sa_studyguide.txt`). The same free source is endorsed across both bodies.
- **Search:** the anki query is weak: its top result is a dead deck, followed by Gumroad pages. The flashcards query is Quizlet, Brainscape and Amazon. A well-maintained AnkiWeb deck plus a web page could plausibly rank.
- **Scores:**
  - Demand 5: 759,519 holders.
  - Gap 4: no live, sourced Anki deck found; Quizlet dominates.
  - Source 5: the Guide is CC BY-SA 4.0.
  - Rules 4: open licence, but Scrum.org's trademark terms are unverified.
  - Stability 5: Guide unchanged since 2020.
  - Partner 3: large trainer network, but no named partner verified.
  - Search 4: thin, stale anki SERP.

### 3.2 Scrum.org PSPO I. Score 27.
- **Volume:** 268,195 holders (same count page, where the figure sits next to the alt text "PSPO I Certification Badge").
- **Exam:** "$200 USD per attempt"; "Many questions focus on the Product Owner accountabilities based on the Scrum Guide and also the application of Scrum based on your own experience" (Wayback PSPO I page, `scrumorg_pspo1_wb.txt`).
- **Deck demand and supply:** no dedicated searches were run, because the budget was exhausted. Brainscape and AnkiWeb supply: **not verified.**
- **Sources:** the Scrum Guide covers the Product Owner accountability. The product-management focus areas go beyond it, so Source is 4.
- **Rules and churn:** as for PSM I.
- **Scores:** Demand 4, Gap 4 (assumed similar to PSM I, unverified), Source 4, Rules 4, Stability 5, Partner 3, Search 3 (not measured).

### 3.3 Scrum Alliance CSM. Score 25.
- **Volume:**
  - Scrum Alliance says: "Join a global community of 1.5 million+ agile professionals" (`sa_home.txt`). That counts community members, not CSM holders.
  - No CSM holder count was found.
- **Exam:** "This test consists of 50 multiple-choice questions; you must correctly answer 37 of the 50 questions to pass… The cost of your course includes two test attempts" (`sa_csm.txt`).
  - Scrum Alliance's own study guide says the exam is "not scary and it's not difficult" (`sa_studyguide.txt`).
  - With a mandatory course, an easy exam and an open reference, the need for flashcards is low.
- **Supply:** Amazon Kindle "CSM Flashcards", 2 Quizlet sets, practice-test sites (simpliaxis, redagile, 5dvision) (`websearch_log.md`).
- **Sources:** the Scrum Guide (CC BY-SA).
- **Rules:** Scrum Alliance's legal page bans using the site for "modifying another website so as to falsely imply that it is associated with SAI" (`sa_legal.txt`). No flashcard-specific rule was found. The trademark-guidelines URL returned 404.
- **Churn:** the course-based certification renews every two years with SEUs (`sa_csm.txt`). The content is the Scrum Guide.
- **Partnerships:** Certified Scrum Trainers deliver the course. They are gatekeepers, not obvious deck promoters.
- **Scores:** Demand 3, Gap 3, Source 5, Rules 4, Stability 5, Partner 2, Search 3.
  - **Build this as a tag or filter on the PSM I deck, not as a separate deck.**

### 3.4 ASQ Certified Six Sigma Green Belt, plus generic Lean Six Sigma Green Belt. Score 24.
- **Volume:**
  - ASQ publishes no holder count on the pages fetched.
  - Wikipedia (secondary) says ASQ has "more than 30,000 members" (`wiki_asq.txt`).
  - The ASQ fact sheet claims certified GBs earn "+$17,332 in U.S." more (`asq_gb_fact.txt`, ASQ salary survey claim).
- **Exam:** "a one-part, 110-question exam… 100 questions are scored and 10 are unscored… exam time is 4 hours and 18 minutes". The certification "requires three years of work experience" (`asq_gb_bok.txt`).
  - "All ASQE exams are open-book." Bound notes are allowed, but "Absolutely no collections of questions and answers" (`asq_hb.txt`).
  - IASSC Green Belt: "a 100 question, closed book, proctored exam with a 3 hour allotted time". The voucher costs "$350 USD" and there are "no prerequisites" (`iassc_gb.txt`).
  - A deck matters more for the closed-book generic and IASSC route than for ASQ's open-book exam.
- **Deck demand:**
  - Brainscape subjects/six-sigma-green-belt shows 25 user decks; the top deck has 222 learners.
  - r/SixSigma "flashcards" RSS returned **0 posts** (`rss_SixSigma_flashcards.xml`).
- **Supply:**
  - The only AnkiWeb hit is "3 - Six sigma, lean, PDCA": 12 notes, last updated 2019-03-16 (item-info).
  - Quizlet ×4, Mometrix and Amazon study cards, a Brainscape pack.
  - GitHub has 1 repo (ITSME-RJ/Six-Sigma-Flashcards, 0 stars, created 2026-07).
- **Official flashcards:** none seen from ASQ.
- **Sources:**
  - The ASQ BoK brochure PDFs are freely downloadable and labelled "2022 CSSGB BoK" (`asq_gb_bok.txt`). They contain no copyright or licence line in the extracted text (0 "©" matches).
  - The underlying methods (DMAIC, SPC, hypothesis tests) are generic. **I did not verify any openly licensed primary text in this task**, which is why Source is 3.
- **Rules:**
  - ASQ's handbook bans only question collections in the exam room and says "Examinees are responsible for abiding by applicable copyright laws".
  - The ASQ privacy and legal page returned 403, so its terms are **not verified.**
  - No restrictive third-party prep policy was seen.
- **Churn:** CSSGB, CSSBB and CQE all carry "2022" BoKs, and ASQ's 2026 exam windows still use them.
- **Partnerships:** ASQ sections exist but are **not verified**. Many generic providers, including IASSC Accredited Providers ("hundreds of IASSC Accredited Providers", `iassc_gb.txt`).
- **Search:** the anki SERP is thin (Amazon, an old AnkiWeb deck, Quizlet).
- **Scores:** Demand 2, Gap 4, Source 3, Rules 4, Stability 5, Partner 2, Search 4.

### 3.5 PMI PMP. Score 21.
- **Volume:**
  - Wikipedia (secondary): "As of 31 July 2020, there are 1,036,368 active PMP-certified individuals" (`wiki_pmp.txt`).
  - Credly: PMI issued "over 1 million" badges in 2025 (prior: size-demand.md).
  - "In the first five months of 2026, PMP certifications granted increased by 36% year over year" (prior: size-demand.md, from a mirror of PMI text).
  - r/pmp has about 129,000 members (prior: distribution.md, reddapi).
- **Deck demand:**
  - Prior RSS: r/pmp `anki` gave 18 results, 4 deck-titled; `flashcards` gave 100 results, 1 deck-titled (prior: distribution.md). My re-fetch of `flashcards` again shows 1 deck-titled post among 100.
  - PMP candidates rarely talk about Anki.
  - Brainscape's certified PMP deck has 1,547 learners (`bs_learn.txt`).
- **Existing supply:**
  - AnkiWeb (item-info, fetched today):
    - PMETIS "PMP 2026 Complete Exam Question Bank": 1,656 notes, updated 2026-06-08, +0. Its description starts with leftover drafting text ("Use this revised version…").
    - "PMP Deck ACo 249": 1,112 notes, updated 2025-01-20.
    - "PMP/CAPM - PMBOK 7th Edition": 457 notes, updated 2024-01-24, +6.
    - "PMBOK Guide 6e": 362 notes, updated 2019-05-05.
    - "PMP exam prep 7th edition. Principles": 160 notes, updated 2023-10-03.
    - "PMI Lexicon" deck: 190 notes, updated 2024-01-29.
  - Paid: ankiguru on Gumroad (a "PMP® Exam Anki Flashcards Deck"; the store's listed prices are 999 cents); Etsy (403); BrainBOK "2,266 Flashcards" for PMP and CAPM (`brainbok.txt`).
  - GitHub: 2 repos, both 0 stars.
- **Official:** PMI Study Hall "200+ Flashcards" in both plans (`pmi_sh_faq.txt`).
- **Sources:**
  - The ECO is public: "Examination Content Outline – July 2026", with People 33%, Process 41%, Business Environment 26%, and "Approximately 40%… predictive… remaining 60%… adaptive/agile and hybrid". It carries "© 2026 Project Management Institute, Inc. All rights reserved." (`pmi_pmp_eco2026.txt`).
  - PMBOK is proprietary. The PMI R.E.P. IP guide says "Instances of paraphrasing count as excerpts" (prior: rules-risks.md §6).
  - Agile content could draw on the CC BY-SA Scrum Guide.
- **Rules:** the PMI R.E.P. guide lists flash cards as needing a custom licence. Trademark guidelines allow truthful word-mark use with the attribution "'PMP' is a registered mark of Project Management Institute, Inc." (prior: rules-risks.md §2, §6).
- **Churn:** the new exam launched 9 July 2026 (prior: size-demand.md). Every pre-July-2026 deck is now misaligned. That is a gap now, but it also shows how churn can happen.
- **Partnerships:** in r/pmp "passed" posts, "Study Hall" is named 53 times, Udemy 37, Ramdayal 34 and David McLachlan 27 (prior: distribution.md). There are PMI chapters (prior). Wikipedia gives "314 chartered chapters" as of 2020.
- **Search:** "PMP anki deck" returns AnkiWeb ×6, Gumroad, Etsy and a PM.com thread. "PMP flashcards" returns app stores, Brainscape, Udemy, Quizlet and PrepCast (prior: distribution.md). The field is crowded.
- **Scores:** Demand 5, Gap 3, Source 2, Rules 2, Stability 3 (just refreshed; next change not announced), Partner 4, Search 2.

### 3.6 HRCI PHR (and SPHR). Score 21.
- **Volume:** a verified, published count. "Number of HRCI Certification Holders as of January 5, 2026": PHR **63,311**, SPHR **40,672**, aPHR 10,184. Tested in 2025: "PHR - 4920 … SPHR - 2993" (`hrci_stats.txt`, https://www.hrci.org/certifications/hrci-exam-statistics). The annual candidate flow is small.
- **Deck demand:** Brainscape subjects/phr shows 77 user decks; the top deck has 588 learners ("PHR/SPHR Certification Preparation"). Reddit: §2.
- **Supply:** "PHR exam anki deck" returned no AnkiWeb deck. It returned Brainscape, Mometrix and Test Prep Books study cards (Amazon) and Quizlet (`websearch_log.md`).
- **Official flashcards:** none verified.
- **Sources:**
  - The ECO is public. PHR weights run from Business Management 14% to Employee and Labor Relations 20%. It "took effect in 2024" and says "exam content outlines are copyrighted by HRCI. ©2023-2024 HRCI. All rights reserved." (`hrci_phr_eco.txt`).
  - The ECO page names prep-material developers as intended users.
- **Rules:** HRCI's third-party trademark guidance was **not found**. The "Policies and trademark" URL served a privacy policy.
- **Churn:** the 2024 ECO is current.
- **Scores:** Demand 2 (about 5k testers a year), Gap 3, Source 3, Rules 3, Stability 4, Partner 2, Search 4.

### 3.7 ASQ CQE (22) and ASQ CSSBB (22)
- **CQE:**
  - The BoK is labelled "2022 CQE BoK" (`asq_cqe_bok.txt`). The fact sheet claims certified CQEs earn "$10,000 more".
  - "CQE flashcards anki" returned Quizlet, cqeacademy.com, examzify ×2 and ASQ. No AnkiWeb deck appeared.
- **CSSBB:**
  - BoK "2022 CSSBB BoK". The exam has "150 questions are scored and 15 are…" (pretest), in "4 hours and 18 minutes" (`asq_bb_bok.txt`). It requires "a signed affidavit" for a project.
- Both are open-book (`asq_hb.txt`).
- **Scores, CQE:** Demand 2, Gap 4, Source 3, Rules 4, Stability 5, Partner 1, Search 3.
- **Scores, CSSBB:** the same.
- Both are good long-life, low-competition decks, but they are niche.

### 3.8 PMI CAPM. Score 19.
- **Volume:** PMI publishes no CAPM holder count that I could read (pmi.org is 403, and Wikipedia's CAPM page returned 429).
- **Deck demand:**
  - r/CAPM `anki` gave 12 results, 1 deck-titled: "Quizlet or Anki Decks? … for the CAPM Joseph Phillips course? He gives the vocab list, but its long… 685."
  - r/CAPM `flashcards` gave 100 results, 7 deck-titled, spanning 2020–2025. Examples: "CAPM Flashcards" (2025-02-28, 2023-02-05), "Number of Flashcards" ("Joseph Philip's has 463 flash cards"), and two posts about Peter Landini's flashcards.
  - This is proportionally stronger than r/pmp.
  - Brainscape subjects/capm shows 214 user decks. The top decks have 778, 759 and 741 learners, the highest user-deck numbers in this sample.
- **Supply:**
  - AnkiWeb "CAPM": 306 notes, updated 2023-06-11, "CAPM ITTOs and beyond". ITTOs are a PMBOK 6 concept, which suggests the deck predates the 2023 ECO.
  - "PMP/CAPM - PMBOK 7th Edition": 457 notes, 2024-01-24.
  - Etsy "PMI CAPM Flashcards Anki".
  - CogniGuide AI generator.
  - Crosswind CAPM online flashcards: "Original price was: $49.95. Current price is: $19.95." (`crosswind_capm.txt`).
  - BrainBOK: 2,266 cards.
  - App Store "CAPM Flashcards".
- **Sources:** the ECO "2023 Exam Update" has Fundamentals 36%, Predictive 17%, Agile 20% and Business Analysis 27%, with "©2023 PMI. All rights reserved" (`pmi_capm_eco_en.txt`). The agile 20% can draw on the Scrum Guide.
- **Rules:** as PMP.
- **Churn:** ECO 2023. No announced change was seen (pmi.org is blocked, so this is **not verified**).
- **Partnerships:** instructors Joseph Phillips and Peter Landini are named in r/CAPM. Andrew Ramdayal is named in a CAPM post.
- **Scores:** Demand 3, Gap 3, Source 2, Rules 2, Stability 3, Partner 3, Search 3.

### 3.9 PMI-ACP. Score 20.
- **Volume:** none published (readable).
- **Exam:** "The new PMI-ACP exam will be available on 8 November 2024" (`pmi_acp_faq.txt`). The ECO is dated "November 2024" and revised "March 2026". Domains: Mindset 28%, Leadership 25%, Product 19%, Delivery 28% (`pmi_acp_eco.txt`).
- **Supply:** "PMI-ACP anki deck" returned an Etsy paid deck ("StudyAnkiCards"), otherwise only PMP items. No AnkiWeb ACP deck appeared.
- **Sources:** the agile content is largely coverable from the Scrum Guide (CC BY-SA). The ECO is © PMI.
- **Rules:** as PMP.
- **Scores:** Demand 2, Gap 4, Source 3, Rules 2, Stability 4, Partner 2, Search 3.

### 3.10 SHRM-CP / SHRM-SCP. Score 19.
- **Volume:**
  - No holder count is published on the pages fetched.
  - SHRM says "340,000 HR pros" rely on SHRM (`shrm_cert.txt`), which counts members.
  - A Temple University PDF (2016 data) says "More than 20,000 applicants sought SHRM certification in 2016" (`shrm_temple.txt`).
  - Wikipedia: "more than 575 chapters worldwide" (`wiki_shrm.txt`).
- **Deck demand:** Brainscape subjects/shrm-cp shows 59 user decks. The top decks have 452, 250 and 154 learners. Reddit: §2.
- **Supply:**
  - Etsy "SHRM-CP Exam Prep 2025-2026: 1000+ Practice Questions… Flashcards PDF";
  - Mometrix study cards and flashcard system;
  - Quizlet ×3, including one titled "SHRM CP 2026 certexamdb.com", a dump-style source;
  - Cram.
  - No AnkiWeb deck in results.
- **Official:** SHRM Certification Prep System ("formerly known as the SHRM Learning System") has "more than 2,700 practice questions" (`shrm_prep.txt`). A support.shrm.org article titled "How can I access and download the flashcards?" appeared in results, but I could not fetch it (TLS error). Official flashcards are therefore **not verified in raw text**.
- **Sources:** "2026 SHRM Body of Applied Skills and Knowledge", a 109-page free PDF (`shrm_bask_pdf.txt`). SHRM says the BASK is the framework for those "developing exam preparation materials". No licence was found; the site is "© 2026 SHRM. All Rights Reserved".
- **Rules:** the SHRM Terms of Use say "You may not use or display our Trademarks in any manner without our prior written permission. Our Trademarks may not be used in connection with any product or service that does not belong to us" (`shrm_tou.txt`). This is the most hostile trademark wording in the sample. Whether nominative fair use overrides it is a legal question I cannot answer.
- **Churn:** the BASK was "most recently updated in 2026". The changes include merging two competencies and expanding AI content (`shrm_bask_pdf.txt`).
- **Scores:** Demand 4, Gap 3, Source 3, Rules 1, Stability 2, Partner 3, Search 3.

### 3.11 IIBA ECBA and CBAP. Score 20.
- **Volume:** none published on the pages fetched. The Wikipedia IIBA page returned 404.
- **Exam:** the ECBA has "50 situation-based and standard multiple-choice questions" across nine domains, from Understanding Business Analysis 20% down to Implementing BA 6% (`iiba_ecba_bp.txt`). The ECBA Handbook is dated "MAY 2026", and "the new ECBA exam" is English-only (`iiba_ecba.txt`). The CBAP is "210 minutes long and consists of 120 case-study and scenario-based multiple-choice questions" (`iiba_cbap.txt`).
- **Deck demand:**
  - r/businessanalysis `flashcards` gave 7 results, 1 deck-titled request: "ECBA Flashcards? … wondering if anyone knows of Flashcards that I can download / print that are already created… free" (2024-04-14).
  - Brainscape subjects/babok shows 23 decks; the top deck has 161 learners.
- **Supply:** Watermark Learning "BABOK 3.0 Flashcards" (print), Cram, Brainscape. No AnkiWeb deck was found.
- **Sources:**
  - The ECBA blueprint says the first three domains "are covered in The Business Analysis Standard" and the next six are "based on the BABOK Guide".
  - The Standard "is available to everyone as a free PDF" (`iiba_standard.txt`), but it sits behind sign-up and login.
  - The BABOK Guide is sold or member-only.
  - The IIBA Terms of Use grant access "for your personal, non-commercial use" and prohibit reproduction (`iiba_tou.txt`).
- **Rules:** the IIBA trademark guidelines require third-party material to carry "These trademarks are used with the express permission of International Institute of Business Analysis". That implies permission is expected.
- **Scores:** Demand 2, Gap 4, Source 2, Rules 2, Stability 3 (new ECBA in 2026), Partner 3 (chapters and Endorsed Education Providers, linked on iiba.org), Search 4.

### 3.12 PRINCE2 7 Foundation (and Practitioner). Score 19.
- **Volume:** none published on the pages fetched.
- **Exam:**
  - Foundation: "60 Questions", "60 minutes", pass "60%", "Closed book".
  - Practitioner: "56 questions and sub-questions, worth 70 marks", "150 Minutes", "Open book".
  - Sources: `pc_p2_7f.txt`, `pc_p2_7p.txt`.
- **Deck demand:** Brainscape subjects/prince2 shows 78 user decks. The top decks have 479 and 383 learners. Reddit: §2.
- **Supply:**
  - AnkiWeb "Prince2 Foundation": 65 notes, updated 2021-08-17, "Currently a work in progress".
  - Quizlet "100 PRINCE2 Foundation Flashcards for Anki".
  - Balance Global revision e-cards; a GreyCampus sample PDF; TrustEd Institute.
- **Sources:** the official manual is proprietary. PeopleCert sells mock exams and official materials.
- **Rules:** AXELOS (now PeopleCert):
  - "Where you wish to incorporate an Axelos word mark into the title or name of a product a trade mark licence must be obtained".
  - "Individuals and organizations are also able to use trade mark and copyright material but must apply for a licence".
  - Source: Wayback copy of axelos.com/legal/copyright-and-trade-marks, snapshot 20250707 (`ax_legal_wb.txt`).
  - A deck named "PRINCE2 Foundation flashcards" would need a trade mark licence on AXELOS's reading.
- **Scores:** Demand 3, Gap 4, Source 1, Rules 1, Stability 4 (version 7 current; launch date not verified), Partner 2, Search 4.

### 3.13 ASCM CPIM / CSCP / CLTD. Score 18.
- **Volume:** Wikipedia (secondary):
  - CPIM: "more than 100,000 people have earned the APICS CPIM designation";
  - CSCP: "more than 30,000 professionals in 100 countries";
  - CLTD: "More than 1,000 professionals" (`wiki_ascm.txt`).
- **Deck demand:** Brainscape subjects/apics shows 19 decks; the top deck has 58 learners. Reddit: §2.
- **Supply:**
  - No CPIM or CSCP AnkiWeb deck appeared.
  - Quizlet and Cram have CSCP sets.
  - Dump-style sites rank: secexams.com CSCP, itexams.com CLTD "Actual Free Exam Questions", examtopics CLTD, and SPOTO's "CLTD… Flashcards" on a cciedump subdomain (`websearch_log.md`).
  - Mometrix CPIM cards.
- **Official:** the CLTD Learning System includes flashcards ("Study flashcards to reinforce your memory of key…"). It costs "$1,470", and the bundle "$2,650" (`ascm_cltd_brochure.txt`).
- **Sources:** the CPIM Exam Content Manual (Version 8.0, "EFFECTIVE DATE June 1, 2023") says "No portion of this document may be reproduced under any circumstances" (`ascm_cpim_ecm.txt`). It names the APICS Dictionary as the primary terminology reference, and that dictionary is paid.
- **Scores:** Demand 2, Gap 4, Source 1, Rules 2, Stability 3, Partner 2, Search 4.

### 3.14 CIPS (Level 4 Diploma in Procurement and Supply). Score 18.
- **Volume:** Wikipedia says CIPS has "over 64,000 members in 180 countries" (`wiki_cips.txt`). No candidate count was found.
- **Deck demand:**
  - Brainscape subjects/cips-level-4 shows 5 decks, one with **1,009** learners (Neil Culligan).
  - The prior research found an r/Anki post: "Want to hire someone to make an Anki deck for me for CIPS certification exam" (prior: distribution.md).
- **Supply:** Brainscape only. The anki query returned no Anki decks.
- **Sources:** CIPS sells module study guides for L4M1–L4M8 and "a NEW eRevision guide" (`cips_l4.txt`). No open body of knowledge was found.
- **Scores:** Demand 2, Gap 4, Source 1, Rules 2 (terms not fetched), Stability 3, Partner 2, Search 4.

### 3.15 PMI-RMP. Score 16.
- **Sources:** the ECO was "Updated January 2023", with Risk Strategy and Planning 22%, Identification 23% and Analysis 23% (`pmi_rmp_eco.txt`). The handbook was "last updated 7 August 2020".
- **Demand and supply:** not measured; the search budget ran out. **Not verified.**
- **Scores:** Demand 1, Gap 4, Source 2, Rules 2, Stability 3, Partner 1, Search 3.

### 3.16 SAFe Agilist (Leading SAFe). Score 15. Avoid.
- **Volume:**
  - "More than 1,000,000 practitioners have been trained" and "adopted by more than 20,000 enterprises" (`safe_about.txt`).
  - The Leading SAFe page says "Join over 2 million trained professionals" (`safe_sa.txt`). The two figures are inconsistent.
- **Exam:** "90 minutes, 45 questions". The credential is now branded "AI-Empowered SAFe Agilist" (`safe_sa_exam.txt`).
- **Deck demand:** Brainscape subjects/safe-agilist has a user deck "SAFe Agile Exam" with **4,833 learners**, the highest single user deck in this sample.
- **Supply:** Quizlet ×4, Brainscape, Scribd, an App Store simulator. No Anki deck appeared.
- **Rules:** the SAFe usage page says all content "may not be copied, modified to create derivative works, or distributed without our express written permission". Its FAQ adds:
  - "SAFe® content may not be used to create other training or services, or anything that competes with a Scaled Agile, Inc. offering";
  - "You may not use those trademarks in the title of or to describe any other materials or services";
  - an explicit "Prohibition of Use for For-Profit Courses".
  - Sources: `safe_usage.txt`, `safe_faq.txt`.
- **Churn:** "SAFe is in its tenth iteration" (`safe_about.txt`), and the Agilist credential has been rebranded around AI.
- **Scores:** Demand 4, Gap 3, Source 1, Rules 1, Stability 2, Partner 1, Search 3.

---

## 4. Other candidates noticed but not researched
- **Lean Six Sigma Yellow Belt / IASSC Black Belt.** These would be the same deck family as §3.4. The IASSC BoK page exists at https://iassc.org/body-of-knowledge/green-belt-body-of-knowledge/ but I could not read it (redirect loop).
- **APM PFQ/PMQ (UK), PMI PgMP, PMI-PBA, Scrum Alliance CSPO.** None was researched, so **not verified**.

## 5. Recommendations tied to the evidence
1. **Build one CC BY-SA "Scrum Guide 2020" deck** tagged for PSM I, PSPO I and CSM, with subsets usable for the agile portions of PMI-ACP and CAPM. It has the only open licence in this area, 1.03M+ Scrum.org certifications (PSM I plus PSPO I), stable content, and no live incumbent Anki deck.
2. **Next, a generic Lean Six Sigma Green Belt deck built from the public ASQ and IASSC topic lists,** written in original words. It is low-risk, has a stable 2022 BoK, and faces a thin SERP.
3. **PMP is the biggest market, but it is the hardest on rules.** PMI treats flash cards as licensable and paraphrase as excerpting. If attempted, source cards from non-PMI open material and the public ECO task list only, and consider asking PMI for a licence.
4. **Avoid SAFe and PRINCE2 unless licensed.** Treat SHRM with caution because of its trademark wording.
