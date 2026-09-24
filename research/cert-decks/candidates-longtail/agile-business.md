# Second-pass candidates: agile, product, business analysis, project and quality (full catalogues)

Researched 2026-09-24. This pass extends `research/cert-decks/candidates/project-business.md` (the "first pass") to the whole catalogue of each body. **Not legal advice.**

**Evidence rules.**
- Every fact comes from raw text I fetched with curl and text extraction or pdftotext during this task. Raw copies are in `scratchpad/candidates2/raw-agile/`, saved as `<name>.html|pdf`, `<name>.txt` and `<name>.url` (the source URL).
- Scores marked "(prior)" come from the first pass, which cites its own raw files in `scratchpad/candidates/raw-pb/`.
- Scrum.org is behind a WAF, so I read Wayback Machine `id_` snapshots and name each one.
- The Scrum.org holder counts come from the first pass's snapshot of https://www.scrum.org/professional-scrum-certifications/count (Wayback 20260611080020). That page says "Note data was last updated May 1, 2026". I re-read the raw file `candidates/raw-pb/scrumorg_count_wb.txt` in this task.

**What I could not fetch:**
- **AnkiWeb search:** `ankiweb.net/svc/shared/list-decks` returned HTTP 429, "Please log in to perform more searches", on every query. **I have no AnkiWeb supply data for any exam in this pass.** First-pass AnkiWeb findings are reused where they exist.
- **GitHub REST search:** `api.github.com/search` is blocked by the session proxy ("sessions are bound to their configured repositories"). I used the GitHub MCP `search_repositories` tool instead (`raw-agile/github_search_notes.txt`).
- **Quizlet:** not attempted, because it returned 403 in the first pass.
- **pmi.org HTML:** 403. I read one Wayback copy of the certifications index.
- **Web search:** not used, because the quota is exhausted.
- **Reddit RSS:** 5 feeds tried; 1 returned 429 (see the evidence section).
- **Pages that fetched but gave nothing usable:**
  - Kanban University's KMP page: 404.
  - ICAgile certifications index: 404.
  - AgilePM page on agilebusiness.org: 404.
  - The Council for Six Sigma Certification: 403.
  - The IREB handbook page: an empty JavaScript shell.
- **Scrum.org "Kanban Guide for Scrum Teams":** the Wayback lookups failed with connection resets, so **its licence is not verified.**

Scores run from 1 (bad) to 5 (good), the same as the first pass. A high Rules score means low risk; a high Stability score means low churn.
- D: Demand
- G: Gap
- Src: Source
- R: Rules
- St: Stability
- P: Partner
- Se: Search

---

## 1. Summary table

Rows are sorted by total. "Family" names the shared-source deck the exam can live in.

| Exam | Family | D | G | Src | R | St | P | Se | **Total** | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| Scrum.org PSM I (prior) | Scrum Guide | 5 | 4 | 5 | 4 | 5 | 3 | 4 | **30** | Build first |
| Scrum.org PSPO I (prior) | Scrum Guide | 4 | 4 | 4 | 4 | 5 | 3 | 3 | **27** | Build first |
| ProKanban PK I (Professional Kanban I) | Kanban Guide (CC BY-SA) | 2 | 5 | 5 | 4 | 4 | 3 | 4 | **27** | Build: cheap, open source, empty niche |
| Scrum.org PSM II | Scrum Guide (advanced tag) | 3 | 5 | 3 | 4 | 5 | 3 | 3 | **26** | Build as advanced subdeck |
| Scrum.org PSPO II | Scrum Guide (advanced tag) | 2 | 5 | 3 | 4 | 5 | 3 | 3 | **25** | Build as advanced subdeck |
| Scrum.org PAL-EBM | EBM Guide (CC BY-SA) + Scrum Guide | 1 | 5 | 5 | 4 | 4 | 2 | 4 | **25** | Build: small, fully open source |
| Scrum Alliance CSM (prior) | Scrum Guide (tag) | 3 | 3 | 5 | 4 | 5 | 2 | 3 | **25** | Tag on PSM deck |
| ISTQB CTFL v4.0.1 | ISTQB syllabus | 4 | 3 | 4 | 4 | 4 | 2 | 3 | **24** | Build if not covered by the IT area; check the licence reading first |
| Scrum.org PAL-E (PAL I) | Scrum Guide + EBM Guide | 2 | 5 | 3 | 4 | 5 | 2 | 3 | **24** | Build as subdeck |
| Scrum.org PSK I | Scrum Guide + Kanban Guide | 2 | 4 | 4 | 4 | 4 | 2 | 4 | **24** | Build with PK I |
| ASQ CSSGB (+ generic LSS GB) (prior) | Lean Six Sigma | 2 | 4 | 3 | 4 | 5 | 2 | 4 | **24** | Build |
| Scrum.org PSD I | Scrum Guide + engineering practices | 2 | 4 | 3 | 4 | 5 | 2 | 3 | **23** | Later |
| Scrum.org SPS | Nexus (© Scrum.org, not open) | 2 | 5 | 2 | 3 | 5 | 2 | 4 | **23** | Later, in paraphrase only |
| IASSC Lean Six Sigma Black Belt | Lean Six Sigma | 2 | 5 | 3 | 3 | 4 | 2 | 4 | **23** | Build inside LSS family |
| IASSC Lean Six Sigma Green Belt | Lean Six Sigma | 2 | 4 | 3 | 3 | 5 | 2 | 4 | **23** | Tag on CSSGB deck |
| ASQ CQA (2026 BoK) | ASQ quality core | 2 | 5 | 3 | 4 | 4 | 1 | 4 | **23** | Build: fresh BoK, empty niche |
| ASQ CMQ/OE (2026 BoK) | ASQ quality core | 2 | 5 | 3 | 4 | 4 | 1 | 4 | **23** | Build: fresh BoK, empty niche |
| Scrum Alliance CSPO | Scrum Guide (tag) | 2 | 3 | 4 | 4 | 5 | 2 | 3 | **23** | Tag on PSPO deck (no exam seen) |
| IREB CPRE Foundation Level | IREB handbook | 2 | 5 | 3 | 3 | 4 | 2 | 4 | **23** | Check the licence, then build |
| ASQ CQE (prior) | ASQ quality core | 2 | 4 | 3 | 4 | 5 | 1 | 3 | **22** | Build in family |
| ASQ CSSBB (prior) | Lean Six Sigma | 2 | 4 | 3 | 4 | 5 | 1 | 3 | **22** | Build in family |
| ASQ CRE (2025 BoK) | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 4 | **22** | Later |
| IASSC Lean Six Sigma Yellow Belt | Lean Six Sigma | 2 | 4 | 3 | 3 | 4 | 2 | 4 | **22** | Tag in LSS family |
| Scrum.org PSU I | Scrum Guide + Lean UX | 1 | 5 | 2 | 4 | 5 | 1 | 4 | **22** | Low priority |
| Scrum.org PSPBM | Scrum Guide (Product Backlog) | 1 | 5 | 3 | 4 | 5 | 1 | 3 | **22** | Tag on PSPO deck |
| ISTQB CTAL-AT v2.0 (Agile Tester) | ISTQB syllabus | 1 | 5 | 4 | 4 | 2 | 2 | 4 | **22** | Wait: just released |
| ASQ CQIA | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CQT (2024 BoK) | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CQI (2025 BoK) | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CQPA (2026 BoK) | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CSQE (2023 BoK) | ASQ quality core | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CMDA (2026 BoK) | ASQ regulated | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| ASQ CPGP (2023 BoK) | ASQ regulated | 1 | 5 | 3 | 4 | 4 | 1 | 3 | **21** | Later |
| Scrum.org PSM III | Scrum Guide | 1 | 5 | 2 | 4 | 5 | 2 | 2 | **21** | Skip: essay exam |
| IIBA CBAP | BABOK | 2 | 4 | 2 | 2 | 3 | 3 | 4 | **20** | Partnership first |
| IIBA ECBA (prior) | BABOK | 2 | 4 | 2 | 2 | 3 | 3 | 4 | **20** | Partnership first |
| IIBA-CCA | BABOK + security | 1 | 5 | 3 | 2 | 3 | 2 | 4 | **20** | Partnership first |
| ASQ CSSYB | Lean Six Sigma | 1 | 4 | 3 | 4 | 4 | 1 | 3 | **20** | Tag in LSS family |
| ASQ CSQP (2023 BoK) | ASQ quality core | 1 | 5 | 2 | 4 | 4 | 1 | 3 | **20** | Later |
| ASQ CCQM (2024 BoK) | ASQ quality core | 1 | 5 | 2 | 4 | 4 | 1 | 3 | **20** | Later |
| ASQ CCT (2024 BoK) | ASQ quality core | 1 | 5 | 2 | 4 | 4 | 1 | 3 | **20** | Later |
| Scrum.org PSFS | Facilitation (no open source) | 1 | 5 | 1 | 4 | 5 | 1 | 3 | **20** | Skip |
| Scrum.org PSPO III | Scrum Guide | 1 | 5 | 2 | 4 | 5 | 1 | 2 | **20** | Skip: essay exam |
| IIBA CCBA | BABOK | 1 | 5 | 2 | 2 | 3 | 2 | 4 | **19** | Partnership first |
| IIBA-AAC | Agile Extension to BABOK | 1 | 5 | 2 | 2 | 3 | 2 | 4 | **19** | Partnership first |
| IIBA-CBDA | Guide to Business Data Analytics | 1 | 5 | 2 | 2 | 3 | 2 | 4 | **19** | Partnership first |
| Scrum.org PPDV | Product discovery (no open source) | 1 | 5 | 1 | 4 | 4 | 1 | 3 | **19** | Skip |
| ASQ CMBB | Lean Six Sigma | 1 | 5 | 2 | 4 | 4 | 1 | 2 | **19** | Skip: performance-based part |
| ASQ CFSQA (HACCP auditor) | ASQ regulated | 1 | 5 | 2 | 4 | 3 | 1 | 3 | **19** | Later |
| IIBA-CPOA | BABOK / product ownership | 1 | 5 | 2 | 2 | 3 | 1 | 4 | **18** | Partnership first |
| ICAgile ICP (Agile Fundamentals) | Agile Manifesto | 1 | 4 | 2 | 3 | 4 | 1 | 3 | **18** | Skip: course-based, no exam seen |
| Scrum Alliance A-CSM | — | 1 | 3 | 3 | 4 | 4 | 1 | 2 | **18** | Skip: no exam (course plus experience) |
| Scrum Alliance CSP-SM | — | 1 | 3 | 3 | 4 | 4 | 1 | 2 | **18** | Skip: no exam (course plus experience) |
| PMI-PBA | PMI (licence) | 1 | 4 | 2 | 1 | 3 | 2 | 3 | **16** | Partnership-first note |
| PMI-SP | PMI (licence) | 1 | 5 | 2 | 1 | 3 | 1 | 3 | **16** | Partnership-first note |
| Kanban University KMP | KU (all rights reserved) | 1 | 4 | 1 | 2 | 4 | 1 | 3 | **16** | Skip: course-based credential |
| Scrum.org PSM-AI Essentials | — | 1 | 5 | 1 | 4 | 2 | 1 | 2 | **16** | Skip: course students only |
| Scrum.org PSPO-AI Essentials | — | 1 | 5 | 1 | 4 | 2 | 1 | 2 | **16** | Skip: course students only |
| PMI PgMP | PMI (licence) | 1 | 4 | 1 | 1 | 3 | 2 | 3 | **15** | Partnership-first note |
| PMI PfMP | PMI (licence) | 1 | 5 | 1 | 1 | 3 | 1 | 3 | **15** | Partnership-first note |
| PMI-PMOCP | PMI (licence) | 1 | 5 | 1 | 1 | 2 | 1 | 3 | **14** | Partnership-first note |

**Scored: 61 rows.**
- Scrum.org: 17.
- Scrum Alliance: 4.
- Kanban: 2.
- ICAgile: 1.
- IIBA: 7.
- PMI small certifications: 5.
- ASQ: 19.
- IASSC: 3.
- ISTQB and IREB: 3.

Seven rows are carried from the first pass: PSM I, PSPO I, CSM, CSSGB, CQE, CSSBB and ECBA.

**Not scored (notes only):** PSM-A and PSPO-A are *courses*, not exams (see §3.1). The ProKanban extensions (PAM, PFMS, PVA, SPK, PK II) are listed in §3.3. The APMG and PeopleCert catalogue is in §3.9.

### Deck families this area supports
| Family | Open source and licence | Exams |
|---|---|---|
| **Scrum Guide core** | Scrum Guide 2020, CC BY-SA 4.0 (prior); Agile Manifesto ("may be freely copied in any form, but only in its entirety through this notice") | PSM I/II, PSPO I/II, CSM, CSPO, PSPBM, and 15% of PSD |
| **Scrum.org extensions** | EBM Guide, "May 2024", CC BY-SA 4.0 (`ebm_online_wb.txt`); Nexus Guide, "January 2021", page footer "© Scrum.org. All Rights Reserved." with no open licence seen (`nexus_guide_wb.txt`) | PAL-E, PAL-EBM, SPS |
| **Kanban** | The Kanban Guide, "2025 EDITION · CC-BY-SA 4.0", © Orderly Disruption Limited and Daniel S. Vacanti, Inc. (`pk_guide.txt`) | ProKanban PK I (and PK II, PAM, PFMS), Scrum.org PSK I (which cites the "Kanban Guide for Scrum Teams", licence not verified) |
| **Lean Six Sigma** | ASQ and IASSC topic lists; generic statistics | ASQ CSSYB, CSSGB, CSSBB, CMBB; IASSC YB, GB, BB |
| **ASQ quality core** | ASQ BoK PDFs (free download, no licence line; see §3.7) | CQA, CQE, CMQ/OE, CRE, CQIA, CQT, CQI, CQPA, CSQE, CSQP, CCQM, CCT, and the regulated CMDA, CPGP, CFSQA |
| **Requirements and testing** | ISTQB syllabus (extracts for non-commercial use with acknowledgement); IREB handbook (licence not verified) | ISTQB CTFL, CTAL-AT; IREB CPRE-FL |
| **BABOK** | None open. IIBA Terms of Use allow personal, non-commercial use only (prior) | ECBA, CCBA, CBAP, AAC, CBDA, CCA, CPOA: partnership first |

---

## 2. Findings that change the first-pass plan

1. **Scrum.org's own trademark guidelines permit this site, with two catches.** Source: Wayback 20240115030201 of https://www.scrum.org/scrumorg-trademarks-and-copyrights (`so_tmc_wb.txt`), which is a 2024 snapshot, so the current version is **not verified.**
   - **Permitted, for noncommercial sites:** "Scrum.org word marks may be used on websites that operate solely for a noncommercial, informational purpose concerning a Scrum.org product or technology".
   - **Permitted, for exam-prep wording:** the guidelines give as a correct example "ABC EDUCATION SERVICES will help you to prepare for Scrum.org Professional Scrum Master® I (PSM I®) exam".
   - **Required:** attribution symbols, a notice, and a non-endorsement disclaimer.
   - **Catch 1, meta tags:** "YOU MAY NOT INCORPORATE SCRUM.ORG TRADEMARKS IN ANY DOMAIN NAME OR IN ANY META TAG OR OTHER HIDDEN TEXT IN A WEB PAGE." **This directly limits the SEO playbook.** Keep PSM and PSPO out of meta keywords and descriptions and out of hidden structured data; get a legal read on `<title>` and JSON-LD.
   - **Catch 2, copyright:** "Use of Scrum.org proprietary copyrighted material is strictly prohibited without prior approval". This covers website text and "White Papers or other documentation". The CC BY-SA Scrum Guide and EBM Guide are exempt through their own licences. The Nexus Guide page carries "© Scrum.org. All Rights Reserved.", so SPS cards must be original wording.
   - The first pass scored Rules 4 as "not verified"; this snapshot supports keeping 4.
2. **Scrum.org's advanced exams are a real, empty market.**
   - Holders (count page, May 2026): PSM II **56,828**; PSPO II **24,979**; PSD **23,659**; PAL I **20,849**; PSK **9,259**; SPS **7,657**; PAL-EBM **5,462**; PSU **4,035**; PSF **3,279**; PSPBM **1,997**; PSPO-AI Essentials **1,928**; PSM III **1,316**; PPDV **821**; PSPO III **593**; PSM-AI Essentials **526**.
   - Supply found for PSM II: only a Ditectrev practice-question repo (17 stars). Brainscape has no PSM II subject: the page fell back to search and showed "User-Generated Flashcards (0)".
   - Supply found for PSPO II, PAL, PAL-EBM, PSK, SPS and PSU: none in any source I could reach. **AnkiWeb could not be checked.**
3. **The Kanban family is fully open and nearly unserved.**
   - ProKanban publishes the Kanban Guide under CC BY-SA 4.0.
   - It reports "4,217 Certified practitioners", "4,057 … 2025 candidates", an "85%" pass mark, an "83% first-attempt pass rate" and "26 Countries" (`pk_certs.txt`).
   - Brainscape's kanban subject has 7 user decks; the largest has 175 learners.
4. **Several "advanced" credentials in the brief have no exam, so they cannot be deck targets.**
   - Scrum Alliance **A-CSM**: hold a CSM, "Validate 12 months of work experience as a scrum master", "Successfully complete an approved A-CSM course" (`sa_acsm.txt`).
   - **CSP-SM**: hold an A-CSM, complete the course, and "Validate at least 24 months of work experience" (`sa_cspsm.txt`).
   - **CSPO**: no exam text found on its page.
   - **Kanban University KMP**: "Attend the required courses … after both course requirements are met, you earn the KMP credential" (`ku_path.txt`).
   - **ICAgile ICP**: course-based. The page says "Once you earn an ICAgile certification, it's yours for life" and never mentions an exam (`ic_icp.txt`).
   - **Scrum.org AI Essentials**: "Available only to Professional Scrum Master™ - AI Essentials students … Required course" (`so_psmai.txt`).
5. **ASQ is re-issuing BoKs through 2026.** New BoKs start in these testing windows:
   - CQA: "April 2026";
   - CMQ/OE: "July 2026";
   - CQPA: "2026 CQPA Body of Knowledge";
   - CMDA: "2026 Body of Knowledge".

   Old decks for these are now misaligned, and new ones are stable for the next cycle. "All ASQ exams are open book" (every ASQ page fetched), which caps flashcard demand.
6. **IASSC exams are closed-book, which suits flashcards better than ASQ's open-book exams.**
   - Black Belt: "a 150 question, closed book, proctored exam with a 4 hour allotted time".
   - Yellow Belt: "a 60 question, closed book … 2 hour".
   - Both have "no prerequisites" (`iassc_bb.txt`, `iassc_yb.txt`).
   - But IASSC's marks policy says "IASSC™ and International Association for Six Sigma Certification™ may not be used in any manner, other than described herein, without advanced written permission" (`iassc_marks.txt`). A deck title that names IASSC is therefore a risk. Use "Lean Six Sigma Black Belt" in the title.

---

## 3. Per-exam evidence

### 3.1 Scrum.org (all on-demand online exams; "Lifetime certification - no annual renewal fee required" where stated)

Exam facts come from the "Certification Details" block of each Wayback snapshot. Snapshot URLs are in `raw-agile/so_*.url`, all under `https://web.archive.org/web/2026…id_/https://www.scrum.org/assessments/…`.

| Exam | Holders (May 2026) | Fee | Questions and time | Format | Source basis stated on page |
|---|---|---|---|---|---|
| PSM I | 759,519 | $200 | 80 / 60 min, 85% | MC, MA, T/F | Scrum Guide (prior) |
| PSM II | 56,828 | $250 | 30 / 90 min, 85% ("partial credit provided on some questions") | MC, MA, T/F | Focus areas from "Professional Scrum Competencies": framework, "Coaching and Mentoring", "Managing Technical Risk", "Organizational Design & Culture". Attending the "Professional Scrum Master Advanced" class is "highly recommended", not required. |
| PSM III | 1,316 | $500 | 24 / 150 min | "Essay questions only"; graded in about 4 weeks | — |
| PSPO I | 268,195 | $200 | (prior) | | Scrum Guide PO accountabilities |
| PSPO II | 24,979 | $250 | 40 / 60 min, 85% | MC, MA | Recommends PSPO and PSPO-A courses |
| PSPO III | 593 | $500 | 24 / 150 min | Essay | — |
| PSD I | 23,659 | $200 | 80 / 60 min | MC, MA, T/F | "Approximately 85%" from Developing & Delivering (Design & Architecture, Programming, Quality, Testing); "approximately 15%" core Scrum |
| SPS | 7,657 | $250 | 40 / 60 min | MC, MA, T/F | "the Nexus Framework as described in the Nexus Guide" |
| PAL I | 20,849 | $200 | 36 / 60 min | MC, MA, T/F | Includes "Evidence-Based Management" focus area; recommended course PAL-E |
| PAL-EBM | 5,462 | $200 | 40 / 60 min | MC, MA, T/F | "the Evidence-Based Management (EBM) framework" |
| PSK I | 9,259 | $200 | 45 / 60 min | MC, MA, T/F | "theory from the Kanban Guide for Scrum Teams and the Scrum Guide"; metrics "listed in the Kanban Guide for Scrum Teams" |
| PSU I | 4,035 | $200 | 60 / 60 min | MC, MA, T/F | "Lean UX Practices & Techniques" |
| PSFS (PSF) | 3,279 | $200 | 20 / 30 min | MC | Facilitation |
| PSPBM | 1,997 | $200 | 20 / 30 min | MC | Product Backlog management |
| PPDV | 821 | $200 | 20 / 30 min | MC | Discovery and validation |
| PSM-AI Essentials | 526 | course only | 20 / 45 min | MC | "Required course" |
| PSPO-AI Essentials | 1,928 | course only | not fetched | | "only available to students of the training course" (count page) |

- **PSM-A and PSPO-A** appear in Scrum.org's navigation as instructor-led *courses*: "Professional Scrum Master - Advanced … Handle challenges and situations" and "Professional Scrum Product Owner - Advanced … Deepen understanding of the many PO stances" (`so_psm2.txt` nav). They are not separate exams; they prepare for PSM II and PSPO II.
- **Supply** (GitHub MCP, `github_search_notes.txt`):
  - Ditectrev practice Q&A repos: PSM I (135 stars, pushed 2026-09-10), PSD I (166 stars, 2026-07-31), PSPO I (74 stars, 2026-09-21), PSM II (17 stars, 2026-07-05).
  - Ditectrev has no repo for the other Scrum.org exams: 22 repos listed, none for PSPO II, PAL, PAL-EBM, PSK, SPS or PSU.
  - MikeCoats/scrum-guide-flashcards: 0 stars, last updated 2021-06-04.
  - These are Q&A dumps or sets, not sourced flashcard decks.
- **Brainscape** (`bs_summary.txt`):
  - subjects/scrum: 137 user decks; the top deck has 449 learners, and "PSM 1 Test Preparation Scrum Guide" has 151.
  - subjects/pspo: 5 decks, top 10 learners.
  - subjects/psm-ii: fell back to search, 0 decks.
  - subjects/psd: fell back to search; the top PSD deck has 4 learners.
  - subjects/kanban: "Kanban for Scrum Teams", 112 cards, 175 learners.
- **Reddit:**
  - r/scrum "PSM II" (top, all time): 77 entries. Only one mentions resources: "Tips & Resources for passing the PSM II" (2020-04-29). Others include "I PASSED THE PSM III!!!" and "Passed the PSM 2 with no experience on the first try".
  - r/scrum "flashcards": 0 entries again, as in the first pass. It is still unclear whether that zero is real.
  - r/scrum "PSPO II": HTTP 429, not fetched.
- **Rules:** see §2.1 for the Scrum.org trademark and copyright guidelines.
- **Churn:**
  - Scrum Guide: 2020 (prior).
  - EBM Guide: "May 2024".
  - Nexus Guide: "January 2021".
  - New exams keep arriving: PSPBM on 27 September 2023, PPDV on 12 September 2024, PSPO-AI on 26 June 2025, PSM-AI on 18 February 2026 (count page).
- **Score reasons, advanced exams:**
  - **PSM II:** Demand 3 (56.8k holders, 7% of PSM I). Gap 5 (Brainscape 0; one Q&A repo). Source 3 (the Guide covers the framework area, but coaching and organisational design have no open source). Search 3 (not measured).
  - **PSPO II:** as PSM II, but Demand 2 (25k holders).
  - **PAL-EBM:** Source 5, because the EBM Guide is CC BY-SA. Demand 1 (5.5k holders). Stability 4, because the Guide was revised in 2024.
  - **PAL I:** Demand 2 (20.8k). Source 3, because leadership styles and organisational design lack an open source.
  - **PSK I:** Source 4. The Kanban Guide is CC BY-SA (ProKanban edition), but the "Kanban Guide for Scrum Teams" licence is not verified.
  - **SPS:** Source 2 and Rules 3. The Nexus Guide is © Scrum.org, and the guidelines prohibit using its copyrighted material, so cards must restate concepts in original words.
  - **PSD I:** Source 3 (85% is engineering practice; no single open source). Gap 4, because the Ditectrev PSD repo (166 stars) exists.
  - **PSU, PSFS, PPDV, PSPBM:** Demand 1 (at most 4k holders each). Short 20-question skills tests, except PSU. PSPBM can be a tag on the PSPO deck.
  - **PSM III and PSPO III:** essay exams. Flashcards have little value.

### 3.2 Scrum Alliance advanced
- **A-CSM** and **CSP-SM:** requirements as quoted in §2.4 (`sa_acsm.txt`, `sa_cspsm.txt`). The pages mention no test. Renewal is "every two years" with SEUs.
- **CSPO:** the page describes a course, and renewal is "every two years by submitting the renewal fee and the required number of Scrum Education Units". No exam text was found (`sa_cspo.txt`). **Whether CSPO has any assessment is not verified.** A-CSPO and CSP-PO pages were not fetched.
- Holder counts were not found.
- **Verdict:** CSPO becomes a tag on the PSPO deck. A-CSM and CSP-SM are not deck targets.

### 3.3 Kanban
- **ProKanban** (`pk_certs.txt`, https://www.prokanban.org/certifications):
  - Six certifications: "PK I Professional Kanban I, PAM Professional Applied Metrics, PFMS Professional Flow Metrics for Scrum, PVA Product Value Acceleration, SPK Scaling with Portfolio Kanban, PK II Professional Kanban II".
  - "A timed, multiple-choice exam. Pass mark is 85%."
  - "Assessments are open to anyone."
  - "Certifications do not expire."
  - Price shown next to PK II: "$250"; the PK I price was not isolated.
  - Scale: "4,200+ certified · 26 countries"; 2025 score histogram over "4,057" candidates.
- **Source:** The Kanban Guide, "2025 EDITION · CC-BY-SA 4.0". The page reproduces the guide "verbatim" and carries the licence text "Offered for license under the Attribution ShareAlike license of Creative Commons" (`pk_guide.txt`, https://www.prokanban.org/the-kanban-guide).
- **GitHub:** KanbanGuides/KanbanGuides ("Open Guide to Kanban In the Context of Knowledge Work", 11 stars, pushed 2026-09-23). It is a possible partner or source repo; **its licence is not checked.**
- **Rules:** ProKanban's trademark terms were not fetched. The page footer says "© 2026 ProKanban.org — All rights reserved", which covers the site, while the Guide carries CC BY-SA.
- **Scores, PK I:** Demand 2 (about 4k candidates a year). Gap 5 (the largest Brainscape deck has 34 learners: "Professional Kanban for Team and Guide"). Source 5. Rules 4. Stability 4 (2025 edition). Partner 3 (the body publishes an open guide and has trainers). Search 4.
  - PAM, PFMS, PVA, SPK and PK II become tags or extensions once PK I exists. They are not scored separately, because I had no per-exam page.
- **Kanban University KMP:** the path is "KSD plus KSI or KDI". "Every Kanban University credential is earned through hands-on training with an accredited trainer" (`ku_path.txt`). The Kanban Guide on kanban.university reads "© 2026 Kanban University. All rights reserved." (`ku_guide.txt`). No exam, closed source, so skip. A KU glossary exists at https://kanban.university/glossary (linked, not read).

### 3.4 ICAgile
- The ICP page (https://www.icagile.com/certification/agile-fundamentals) offers "Download Learning Outcomes" and says the credential is earned through a course: "Once you earn an ICAgile certification, it's yours for life". No exam is mentioned.
- The certifications index returned 404.
- Licence of the learning outcomes: **not verified.** Skip, but agile-fundamentals content is covered by the Agile Manifesto and Scrum Guide family anyway.

### 3.5 IIBA (all proprietary sources; partnership first)
| Exam | Format (IIBA page) | Source named | Brainscape |
|---|---|---|---|
| CBAP | "210 minutes long and consists of 120 case-study and scenario-based multiple-choice questions" | BABOK Guide | subjects/cbap: 19 decks; top 126 learners (395 cards) |
| CCBA | "180 minutes long and consists of 130 multiple-choice, scenario-based questions formulated from the BABOK Guide" | BABOK Guide | subjects/ccba: 2 decks; top 65 learners |
| IIBA-AAC | "formulated from the Agile Extension to the BABOK® Guide, consists of 85 multiple choice, scenario-based questions … within 2 hours" | Agile Extension v2 | not fetched |
| IIBA-CBDA | "75 multiple-choice, scenario-based questions to be completed within 2 hours" | IIBA's business data analytics guide (named on page; title not isolated) | not fetched |
| IIBA-CCA | "75 multiple choice, knowledge-based questions … within 90 minutes" | IIBA material; cyber controls | not fetched |
| IIBA-CPOA | "60 multiple choice, knowledge-based questions"; "Duration: 90 minutes"; learning-plus-exam package "$550 or Less" | IIBA product-ownership analysis material | not fetched |

- **Sources for the table:** `iiba_*.txt` at https://www.iiba.org/business-analysis-certifications/…
- **Demand evidence:** r/businessanalysis "CBAP" returned 100 entries (top, all time). Only "CBAP exam tips and resources" (2020-05-23) mentions resources, and most titles are "Passed CBAP" posts.
- **Rules:** first-pass findings still apply. Terms of Use allow personal, non-commercial use and prohibit reproduction. The trademark guidelines require the notice "used with the express permission of International Institute of Business Analysis".
- **Scores:** Rules 2. Source 2, or 3 for CCA, where generic security-control knowledge helps (**no open source verified in this task**). Stability 3.

### 3.6 PMI small certifications (partnership-first notes only)
- The Wayback copy of https://www.pmi.org/certifications/ (20260211015454, `pmi_certs_wb.txt`) lists:
  - PgMP and PfMP;
  - PMI-PBA, PMI-SP and PMI-RMP;
  - PMI-PMOCP™;
  - PMI-CP™ (Construction Professional);
  - PMI-CPMAI™.
- It says "1.7M+ PMI certification holders worldwide".
- Live pmi.org pages returned 403, so **no exam details or holder counts per certification are verified.**
- **Brainscape user decks:**

| Certification | User decks | Largest deck |
|---|---|---|
| PMI-PBA | 7 | 37 learners (250 cards) |
| PMI-SP | 2 | 3 learners |
| PgMP | 10 | 64 learners (798 cards) |
| PfMP | 1 (page fell back to search) | 9 learners |

- **Rules:** PMI's R.E.P. guide lists "Commercial products like flash cards" as needing a licence and says "PMI copyrighted material is not permitted for use on public websites" (prior: rules-risks.md §6). Rules 1 for all.
- **Verdict:** approach PMI for a licence covering the whole PMI family (PMP, CAPM, ACP, RMP, PBA, SP, PgMP, PfMP, PMOCP) or skip.

### 3.7 ASQ (full catalogue; https://www.asq.org/cert, `asq_certs.txt`)
- **Common facts:**
  - "All ASQ exams are open book and all reference materials (including all forms of notes) must be bound and remain bound during the exam" (every ASQ page).
  - "In 2022, five of ASQE's certification programs achieved ISO 17024 Accreditation": CQA, CQE, CSSBB, CMQ/OE and CRE.
- **BoK PDFs:** freely downloadable. I checked the 2026 CQA BoK and 2025 CRE BoK: 0 "©" or "copyright" matches in the extracted text (`asq_cqa_bok.txt`, `asq_cre_bok.txt`).
- The CQA BoK gives question counts per section, e.g. "I. Auditing Fundamentals (37 Questions)". It also says "Case studies will account for approximately 10–15% of the exam".
- ASQ's legal terms: **not verified** (403 in the first pass).

| Exam | Current BoK (page or PDF name) | Computer-based format (page) | Brainscape |
|---|---|---|---|
| CQA | 2026; "tested starting with the April 2026 testing window" | 165 Q (150 scored), 5 h 18 min | 3 decks; top 4 learners |
| CMQ/OE | 2026; "starting with the July 2026 testing window" | 180 Q (165 scored), 4 h 18 min | 1 deck (page fell back to search), 4 learners |
| CRE | 2025 ("2025-CRE-BoK.pdf") | 165 Q (150 scored), 4 h 18 min | "Reliability Engineer Certification CRE - ASQ", 503 cards, 7 learners (fallback search) |
| CQIA | year not verified | 110 Q (100 scored), 3 h 18 min | not fetched |
| CQT | 2024 | 110 Q, 4 h 18 min | not fetched |
| CQI | 2025 | 110 Q, 4 h 18 min | not fetched |
| CQPA | 2026 | 110 Q, 4 h 18 min | not fetched |
| CSQE | 2023 | 175 Q (160 scored), 4.5 h | not fetched |
| CSQP | 2023 | 165 Q (150 scored), 4.5 h | not fetched |
| CCQM | 2024 ("CCQM-BoK-2024.pdf") | 165 Q (150 scored) | not fetched |
| CCT | 2024; "tested starting with the December 2024 testing window" | 135 Q (125 scored), 4 h 18 min | not fetched |
| CMDA | 2026 ("2026 CMDA Body of Knowledge - FINAL.pdf") | 145 Q (135 scored), 4 h 18 min | not fetched |
| CPGP | 2023 | 165 Q (150 scored) | not fetched |
| CFSQA | year not verified | 145 Q (135 scored) | not fetched |
| CSSYB | year not verified | "90-question, 2 hour and 18 minutes" (80 scored) | not fetched |
| CMBB | year not verified | "110 multiple choice items and a performance-based assessment"; "At least 5 years of experience in the role of a SSBB or MBB" | not fetched |
| CQE, CSSGB, CSSBB | 2022 (prior) | prior | CQE: 6 decks, top 34 learners (this pass) |

- **Sources for the table:** `asq_<slug>.txt` at https://www.asq.org/cert/<slug>.
- **Candidate volumes:** no ASQ holder or candidate counts were found. Demand is 1 or 2 throughout.
- **Why Gap is 5 for most:** the Brainscape pages checked have at most 7 learners on any CQA, CMQ/OE or CRE deck, and no GitHub repo was found. AnkiWeb could not be checked, which is the main caveat.
- **Why Stability is 4:** BoKs are refreshed every few years, and the 2026 refreshes (CQA, CMQ/OE, CQPA, CMDA) have just landed. This is a good moment to build decks for them.
- **Family:** CQA, CQE, CQIA, CQT, CQI and CQPA share core quality tools and auditing. CMDA, CPGP and CFSQA form a "regulated" sub-family, whose regulatory sources I did not verify in this task.

### 3.8 IASSC
- **Black Belt:** "150 question, closed book, proctored exam with a 4 hour allotted time". "Approximately 30 multiple-choice and true/false questions from each major section of the IASSC Lean Six Sigma Black Belt Body of Knowledge". Delivered in "more than 8,000 Testing Centers" (`iassc_bb.txt`).
- **Yellow Belt:** "60 question, closed book, proctored exam with a 2 hour allotted time" (`iassc_yb.txt`).
- **Green Belt:** 100 questions, closed book, 3 h, $350 (prior).
- **Marks policy:** "may not be used in any manner, other than described herein, without advanced written permission" (`iassc_marks.txt`). Rules 3: avoid "IASSC" in deck titles and refer to it plainly in body text only.
- **BoK pages:** linked (e.g. https://iassc.org/body-of-knowledge/green-belt-body-of-knowledge/) but not readable (redirect loop, prior). **BoK licence not verified.**
- **Lean certifications:** the page (https://iassc.org/lean-certifications/) returned almost no text (1,180 bytes).
- **Brainscape:**
  - six-sigma-black-belt: 2 decks; the top deck ("Six Sigma Black Belt 2017") has 30 learners.
  - lean-six-sigma: 47 decks; the top deck ("Lean Six Sigma Primer") has 358 learners.

### 3.9 APMG and PeopleCert (notes only; licensing blocks)
- **PeopleCert/AXELOS** (PRINCE2 Agile, MSP, MoP, M_o_R, P3O): the first pass found that AXELOS requires a trade mark licence "where you wish to incorporate an Axelos word mark into the title or name of a product" (prior: `ax_legal_wb.txt`, Wayback 20250707). Not re-fetched. **Do not publish without a licence.**
- **AgilePM (Agile Business Consortium, via APMG):** the page returned 404, but its body text says "Globally accredited through APMG International". Handbook availability and terms are **not verified.** It does not qualify as an open BoK until checked.

### 3.10 Other open-BoK exams in this area
- **ISTQB CTFL v4.0.1** (`istqb_ctfl.txt`, `istqb_syl.txt`, `istqb_home.txt`):
  - ISTQB "has administered 1.5 million exams and issued more than 1.1 million certifications in over 130" countries. The sentence begins "As of May 2025"; the tail word "countries" is cut off in the extraction.
  - Exam: "Total Points: 40", "Passing Score: 26", "Exam Length (mins): 60 (+25% Non-Native Language)".
  - Syllabus v4.0.1 is dated "2024-09-15". Its copyright notice says: "Extracts, for non-commercial use, from this document may be copied if the source is acknowledged."
  - Brainscape subjects/istqb: 126 user decks. Top decks have 897 learners ("2018 ISTQB Foundation Level Mock Exams") and 561 learners. The newest v4.0 deck has 150 learners, so older decks dominate.
  - Scores: Demand 4, Gap 3 (AnkiWeb unchecked), Source 4, Rules 4, Stability 4, Partner 2, Search 3, for 24.
  - **Probably belongs to the IT and testing area; confirm it is not double-counted.**
- **ISTQB CTAL-AT v2.0:** the homepage says "ISTQB® has released the Certified Tester Advanced Level Agile Tester (CTAL-AT) v2.0". No syllabus was read. Stability 2 because it is brand new.
- **IREB CPRE Foundation Level:** the downloads page lists "CPRE Foundation Level - Handbook", "CPRE Foundation Level - Syllabus" and "CPRE Foundation Level and Agile Primer - Examination regulations" (`ireb_fl.txt`).
  - The handbook link resolves to a JavaScript shell, so **its licence is not verified.**
  - Brainscape subjects/ireb: 8 decks; top 17 learners.
  - Holder count: not found.
- **Agile Manifesto:** "© 2001, the above authors / this declaration may be freely copied in any form, but only in its entirety through this notice" (`manifesto.txt`, https://agilemanifesto.org/).
  - The whole text can be quoted, which suits a shared "agile foundations" subdeck.
  - The notice's "only in its entirety" condition may bar quoting single principles on separate cards; read it before splitting.

---

## 4. Notable empty niches (no free, sourced deck found in any source I could reach; AnkiWeb unchecked)
1. **PSM II and PSPO II** (56.8k and 25k holders). Brainscape has nothing, and there is only one Q&A repo.
2. **ProKanban PK I and Scrum.org PSK I.** The source is CC BY-SA, and the largest deck has 175 learners.
3. **PAL-EBM and PAL I.** The EBM Guide is CC BY-SA, and I found no supply at all.
4. **ASQ CQA and CMQ/OE,** whose 2026 BoKs just went live. The largest Brainscape deck has 4 learners.
5. **The IASSC Black and Yellow Belt closed-book exams.**
6. **IIBA CCBA, AAC, CBDA, CCA and CPOA:** almost no supply, but blocked by IIBA terms.

## 5. Raw files
`raw-agile/`:
- `so_*` — Scrum.org assessment pages via Wayback;
- `so_tmc_wb` — trademark and copyright guidelines;
- `nexus_guide_wb`, `ebm_online_wb`, `ebm_guide_wb` — Scrum.org guides;
- `pk_*` — ProKanban;
- `ku_*` — Kanban University;
- `ic_*` — ICAgile;
- `sa_*` — Scrum Alliance;
- `iiba_*` — IIBA;
- `pmi_*` — PMI (403 pages, plus a Wayback index);
- `asq_*` — ASQ;
- `iassc_*` — IASSC;
- `istqb_*` — ISTQB;
- `ireb_*` — IREB;
- `manifesto` — the Agile Manifesto;
- `bs_*` — Brainscape pages, with `bs_parse.py` and `bs_summary.txt`;
- `github_search_notes.txt` — GitHub searches;
- `rss/` — Reddit feeds;
- `ankiweb/` — failed AnkiWeb searches (429);
- `f.sh` — the fetch helper.
