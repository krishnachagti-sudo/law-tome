# Candidates, second pass: data, software, IT service, health, science and other professional exams

*Researched 2026-09-24. Scores are 1–5 on seven criteria, for a maximum of 35: Demand, Gap, Source, Rules, Stability, Partner, Search.*

**How this was sourced.**
- Raw pages are in `candidates2/raw-other/`. Each file is named after the fetch label shown in brackets below, for example `[soa_fam]` is `raw-other/soa_fam.txt` (or `.raw`). Each `.txt` is a curl fetch with text extraction; PDFs went through `pdftotext -layout`.
- **AnkiWeb figures** (note count, last update, thumbs) come from the `svc/shared/item-info` endpoint, decoded by `raw-other/ankiweb_info.py` into `raw-other/ankiweb/info_batch_*.json`.
  - AnkiWeb's anonymous search is closed ("Please log in to perform more searches.").
  - Deck IDs were therefore found with WebSearch restricted to ankiweb.net (not Google) and then checked one by one. Every note count below was verified that way.
  - When a search found no relevant deck, the record says "none found". That does **not** prove no deck exists.
- **GitHub:** REST search is blocked by the proxy, so repositories were searched with the GitHub MCP tool (`raw-other/search_log.md`).
- **Reddit:** only a few search RSS feeds were fetched (`raw-other/rss/`), and several returned HTTP 429.
- **Brainscape:** learner counts come from a fresh fetch of https://www.brainscape.com/learn (`[brainscape_learn]`), parsed into `brainscape_subjects.tsv`.
- **Reused evidence** from the first pass (`candidates/data-actuarial-health.md` and its `raw-dah/`) is marked *(reused)*. Its r/actuary, r/NewToEMS and r/PowerBI RSS titles were re-read from `raw-dah/rss/*.xml` during this task.
- **Blocked pages** are marked "not verified": Oracle Education (403), ASCP BOC (403), AHA/heart.org (403), ASE (403), ATA (403), ems.gov (403), DAMA cdmp.info (bot challenge 202), and ISTQB Advanced pages (500).
- **Scope overlaps:**
  - PL-300 and other Microsoft data exams sit with the cloud agent; PL-300 is listed here only as reused.
  - EPA 608 is a federal certification and may overlap the government agent.
  - LPI Linux may overlap the cloud agent.

---

## Summary table

Sorted by total. "Family" is the proposed deck family (see the end of the file).

| # | Certification (code, version) | D | G | Src | R | Stab | P | Srch | **Total** | Family |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **ISTQB Certified Tester Foundation Level (CTFL v4.0.1)** | 5 | 4 | 5 | 4 | 4 | 4 | 3 | **29** | Software testing |
| 2 | **EPA Section 608 technician (Core, Type I/II/III, Universal)**; possible gov-agent overlap | 3 | 5 | 5 | 5 | 4 | 3 | 3 | **28** | Trades (federal regs) |
| 3 | **KCS v6 Fundamentals** (Consortium for Service Innovation), a niche | 1 | 5 | 5 | 4 | 5 | 3 | 4 | **27** | IT service |
| 4 | **SOA Exam FAM** (Fundamentals of Actuarial Mathematics) | 3 | 5 | 3 | 4 | 4 | 4 | 3 | **26** | Actuarial |
| 5 | **SOA Exam SRM** (Statistics for Risk Modeling) | 3 | 4 | 4 | 4 | 4 | 4 | 3 | **26** | Actuarial / stats |
| 6 | **CAS Exam 5** (Basic Ratemaking and Estimating Claim Liabilities) | 3 | 4 | 4 | 4 | 4 | 4 | 3 | **26** | Actuarial (CAS) |
| 7 | **IREB CPRE Foundation Level** (syllabus v3.3.0) | 2 | 5 | 5 | 4 | 3 | 3 | 4 | **26** | Software engineering |
| 8 | SOA Exam P *(reused, re-confirmed)* | 3 | 3 | 4 | 4 | 5 | 4 | 3 | **26** | Actuarial |
| 9 | SOA Exam FM *(reused)* | 3 | 3 | 4 | 4 | 4 | 4 | 3 | **25** | Actuarial |
| 10 | **SOA Exam ALTAM** | 2 | 5 | 3 | 4 | 4 | 4 | 3 | **25** | Actuarial |
| 11 | **CAS Exam MAS-I** | 3 | 4 | 3 | 4 | 4 | 4 | 3 | **25** | Actuarial (CAS) |
| 12 | **CAS Exam 6U** (Regulation and Financial Reporting, US) | 4 | 3 | 4 | 4 | 3 | 4 | 3 | **25** | Actuarial (CAS) |
| 13 | **ISTQB Advanced (CTAL-TA / TM / TTA)** | 2 | 5 | 4 | 4 | 3 | 3 | 4 | **25** | Software testing |
| 14 | NREMT EMT *(reused; supply updated)* | 5 | 4 | 2 | 3 | 4 | 4 | 3 | **25** | EMS |
| 15 | **SOA Exam ASTAM** | 1 | 5 | 3 | 4 | 4 | 4 | 3 | **24** | Actuarial |
| 16 | **NREMT EMR** | 2 | 5 | 2 | 3 | 4 | 4 | 4 | **24** | EMS |
| 17 | **NCEES FE** (Fundamentals of Engineering) | 4 | 4 | 3 | 3 | 4 | 3 | 3 | **24** | Engineering |
| 18 | **CAS Exam MAS-II** | 2 | 4 | 3 | 4 | 4 | 3 | 3 | **23** | Actuarial (CAS) |
| 19 | **NREMT AEMT** | 2 | 5 | 2 | 3 | 3 | 4 | 4 | **23** | EMS |
| 20 | **SAS Base Programming Specialist (A00-231)** | 2 | 5 | 3 | 3 | 4 | 2 | 4 | **23** | Data / programming |
| 21 | **Python Institute PCEP-30-02** (new version due Q3 2026) | 2 | 4 | 5 | 3 | 2 | 3 | 4 | **23** | Programming |
| 22 | **Python Institute PCAP-31-03** (new version due Q3 2026) | 2 | 4 | 5 | 3 | 2 | 3 | 4 | **23** | Programming |
| 23 | **LPI Linux Essentials (010-160, v1.6)**; possible cloud overlap | 2 | 4 | 3 | 3 | 4 | 3 | 4 | **23** | Programming / OS |
| 24 | Microsoft PL-300 *(reused; cloud-agent overlap)* | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Data (Microsoft) |
| 25 | NREMT Paramedic *(reused; supply updated)* | 5 | 2 | 2 | 3 | 4 | 4 | 2 | **22** | EMS |
| 26 | **SOA Exam PA** (Predictive Analytics) | 2 | 4 | 3 | 4 | 3 | 3 | 3 | **22** | Actuarial / stats |
| 27 | **CAS Exam 7** | 2 | 3 | 3 | 4 | 4 | 3 | 3 | **22** | Actuarial (CAS) |
| 28 | **Oracle Java SE 21 Developer (1Z0-830)**; Java SE 17 (1Z0-829) as a tag | 2 | 4 | 3 | 3 | 4 | 2 | 4 | **22** | Programming |
| 29 | **Oracle Database SQL (1Z0-071)** | 2 | 4 | 3 | 3 | 4 | 2 | 4 | **22** | Programming / data |
| 30 | **ARRT Radiography** (content spec implemented 2022) | 3 | 4 | 2 | 3 | 4 | 3 | 3 | **22** | Allied health |
| 31 | **CMS Introductory Sommelier** | 4 | 3 | 2 | 3 | 4 | 3 | 3 | **22** | Wine |
| 32 | **California Notary Public exam** (state; a model for other states) | 2 | 4 | 4 | 4 | 3 | 2 | 3 | **22** | Legal support |
| 33 | **NCRA RPR Written Knowledge Test** (court reporter) | 1 | 5 | 2 | 3 | 4 | 3 | 4 | **22** | Legal support |
| 34 | **NHA Certified Phlebotomy Technician (CPT)** | 3 | 4 | 2 | 3 | 3 | 3 | 3 | **21** | Allied health |
| 35 | **NCHEC CHES** (Certified Health Education Specialist) | 1 | 5 | 2 | 3 | 3 | 3 | 4 | **21** | Allied health |
| 36 | **CMS Certified Sommelier** | 3 | 3 | 2 | 3 | 4 | 3 | 3 | **21** | Wine |
| 37 | **NALA Certified Paralegal (CP)** | 2 | 4 | 2 | 3 | 3 | 3 | 4 | **21** | Legal support |
| 38 | **NATE HVAC Core/Specialty**; lightly researched | 2 | 4 | 2 | 3 | 3 | 3 | 4 | **21** | Trades |
| 39 | **INFORMS CAP** (now CAP-Essentials / Pro / Expert) | 1 | 5 | 2 | 3 | 2 | 3 | 4 | **20** | Data |
| 40 | Tableau (Salesforce Certified Tableau Data Analyst) *(reused)* | 2 | 4 | 3 | 3 | 2 | 2 | 4 | **20** | Data |
| 41 | **ASCP BOC Phlebotomy Technician (PBT)**; mostly not verified | 2 | 4 | 2 | 3 | 3 | 3 | 3 | **20** | Allied health |
| 42 | **CDR Registration Examination for Dietitians (RD)**; lightly researched | 2 | 4 | 2 | 3 | 3 | 3 | 3 | **20** | Allied health |
| 43 | **LEED Green Associate** | 3 | 4 | 2 | 3 | 2 | 3 | 3 | **20** | Building / green |
| 44 | **ASE A-series (A1–A8)**; not verified (site 403) | 3 | 4 | 2 | 3 | 3 | 3 | 2 | **20** | Trades |
| 45 | **iSAQB CPSA-F** (software architecture) | 2 | 5 | 2 | 1 | 4 | 2 | 4 | **20** → partnership first | Software engineering |
| 46 | **SOA ATPA** | 1 | 4 | 2 | 4 | 3 | 2 | 3 | **19** → poor fit | Actuarial |
| 47 | **TOGAF Enterprise Architecture Foundation (OGEA-101)** | 3 | 4 | 2 | 2 | 3 | 2 | 3 | **19** | Enterprise architecture |
| 48 | **DAMA CDMP** (DMBOK-based) | 2 | 4 | 1 | 3 | 3 | 3 | 3 | **19** | Data management |
| 49 | **HDI Customer Service Rep / Desktop Support Technician** | 1 | 5 | 1 | 3 | 3 | 2 | 4 | **19** | IT service |
| 50 | **NCLEX-RN / NCLEX-PN** (licensure; for completeness) | 5 | 1 | 2 | 3 | 5 | 2 | 1 | **19** | Nursing (skip) |
| 51 | **ATA translation certification** (performance exam) | 1 | 5 | 1 | 3 | 4 | 2 | 3 | **19** → poor fit | Language |
| 52 | **NCCPA PANCE** (licensure-adjacent) | 3 | 2 | 2 | 3 | 4 | 2 | 2 | **18** | Medical (skip) |
| 53 | **CNA (state nurse-aide exams)** | 2 | 3 | 2 | 3 | 3 | 2 | 3 | **18** | Allied health |
| 54 | **Electrician journeyman/master (NEC-based state exams)** | 3 | 4 | 1 | 2 | 3 | 2 | 3 | **18** | Trades |
| 55 | **AHA BLS / ACLS / PALS** (course cards, not a proctored exam) | 3 | 3 | 1 | 2 | 3 | 2 | 2 | **16** | Resuscitation (skip) |

**Also reused without rescoring** (see the first-pass file): PTCB CPhT 23, ServSafe 21, WSET 21, AAMA CMA 20, AAPC CPC 18, AHIMA CCS 18, NASM 18, ACE 17, Google Data Analytics 17, NSCA CSCS 16, IBM Data Science 16.

**Named but not scored** (no usable page fetched): CAS Exams 8 and 9 (candidate counts only), IFoA CS1/CM1 and others, ISTQB CT-AI and Agile, LPIC-1, EXIN/BCS SIAM Foundation (the fetch landed on an unrelated article), MBLEx (no body text), CCRN, DP-600 and DP-700 (cloud agent), Databricks and Snowflake (terms forbid, per CANDIDATES.md).

**Count: 55 rows (44 newly researched; the rest reused), plus 11 reused without rescoring.**

---

## Evidence

### A. Actuarial: current SOA and CAS structure

**Current SOA ASA pathway.** The links on https://www.soa.org/education/exam-req/edu-asa-req/ `[soa_asa_req]` are to:
- Exams P, FM, FAM, ALTAM, ASTAM, SRM and PA;
- the ATPA assessment;
- the PAF and FAP modules, ASF and APC;
- VEE.

**FAM.** The FAM page `[soa_fam]` says: "A transition period from October 2022 to July 2024 allowed any candidate needing either the FAM – Long-Term (FAM-L) half or the FAM – Short-Term (FAM-S) half … Any candidate who did not complete the credit for the full FAM exam by July 2024 must now take the full FAM exam."

**CAS.** Exams 1 and 2 are credited through the SOA exams: "Credit can be obtained for these exams by taking the exams of one of the following organizations" (https://www.casact.org/exams-admissions/associateship-exams/exams-1-2-and-3f `[cas_exams-1-2-and-3f]`). The site sat behind a Sucuri JS challenge, which cleared on retry.

**Cross-cutting sources.**
- All SOA syllabi publish weighted topics, but their textbooks are commercial (Dickson/Hardy/Waters; Klugman/Panjer/Willmot *Loss Models*; Frees).
- SRM's second text, ISLR, is offered as a PDF from the authors' site. Its licence was **not verified**.
- CAS content outlines mark readings "OP": "All text references marked as Online Publications will be available by clicking the hyperlink within the syllabus" (`[cas_5_co]`, `[cas_6u_co]`).

**Rules.** SOA bans reproducing exam content and does not endorse providers (reused, `data-actuarial-health.md`). CAS terms of use were **not checked**.

**Demand.** The r/actuary search RSS (reused raw, `raw-dah/rss/actuary_anki.xml` and `actuary_flashcards.xml`, re-read this task) shows most Anki talk on upper and CAS exams:
- "Exam 6U Anki flashcards" (2026-03-14, /comments/1rt9gcq/), "Anki for Exam 6U" (2024-12-22, /comments/1hjugnn/), "Flashcard/Anki App for Exam 6U" (2022-12-15), "TIA 6U Flashcard" (2026-08-20, /comments/1vt6vcw/).
- "MAS-I flashcards + general advice" (2024-02-29, /comments/1b2pk06/), "MAS - I Flash Cards" (2025-03-04, /comments/1j2yq6e/), "Exam MAS-I Mahler Flashcard Collaboration Group" (2021-01-18), "Anki deck for MAS2" (2023-11-21, /comments/180jwmh/).
- "Exam 5 - What am I doing wrong???" (2025-06-05, in the anki feed), "Exam 7 RF Flashcards" (2025-01-04), "Anki for LTAM exam" (2020-03-20), "Exam ALTAM" (2024-07-15).
- "Free Exam SRM - The Actuarial Nexus" (2026-07-26, /comments/1v7ij3c/).

**Existing free Anki supply** (item-info verified):
- 334660848 P: 365 notes, 2017-09-26.
- 1352239448 FM: 382 notes, 2017-10-08.
- 1015097162 "IFoA actuarial deck": 1,867 notes, 2022-02-12.
- No deck surfaced for FAM, ALTAM, ASTAM, SRM, MAS-I, 5 or 6U.
- GitHub: only lathaniel/anki-actuary (1 star, updated 2025-10-02).

#### SOA FAM: 26
- **Volume:** July 2026, N 1,341, passing 764, 57.0% (https://www.soa.org/globalassets/assets/files/exam-results/2026/edu-2026-07-fam-percents-eyae1jrb.pdf `[res_edu-2026-07-fam…]`).
- **Outline:** ten weighted topics, e.g. "Severity, Frequency, and Aggregate Models (12.5-17.5%)", "Premium and Policy Value Calculation for Long-Term Insurance Coverages (15-22.5%)" (https://www.soa.org/globalassets/assets/files/edu/2026/fall/syllabi/2026-10-fam-syllabus.pdf `[syl_fam]`).
- **Sources:** textbooks are commercial (Dickson et al. 2020, Cambridge; *Loss Models*).
- **Scores:**
  - Demand 3: about 1,300 per sitting; no FAM-specific Anki post seen.
  - Gap 5: no deck found.
  - Source 3.
  - Rules 4.
  - Stability 4: restructured 2022–24, stable since.
  - Partner 4: SOA provider list (reused).
  - Search 3: not checked.

#### SOA SRM: 26
- **Volume:** May 2026, N 1,550, passing 1,050, 67.7%, pass mark 63% `[res_edu-2026-05-srm…]`.
- **Outline** (2027-01 syllabus `[syl_srm]`): Basics of Statistical Learning 5–10%, Linear Models 40–50%, Time Series 10–15%, Decision Trees 20–25%, Unsupervised Learning 10–15%.
- **Texts:** Frees 2010 (Cambridge), plus "An Introduction to Statistical Learning … A PDF of the text can be obtained via … https://www.statlearning.com".
- **Churn:** registration opens the week of 26 October 2026 `[soa_srm]`.
- **Supply:** a free Actuarial Nexus SRM course exists (Reddit title above). Its card count was not checked.
- **Why it scores:** its conceptual ML and statistics content suits cards and reuses across data-science learners.
- **Scores:** Demand 3; Gap 4 (free Nexus material); Source 4 (a free textbook PDF, licence unverified); Rules 4; Stability 4; Partner 4; Search 3.

#### SOA ALTAM: 25; ASTAM: 24
- **Volume** (April 2026): ALTAM N 1,116, 45.8% `[res_edu-2026-04-altam…]`; ASTAM N 639, 50.9% `[res_edu-2026-04-astam…]`.
- **Outlines:**
  - ALTAM: seven topics, e.g. "Profit Analysis (10-20%)", "Pension Plans and Retirement Benefits (10-18%)" `[syl_altam]`.
  - ASTAM: six topics, e.g. "Credibility (12-20%)", "Reserving and Pricing for Short-Term Insurance Coverages (15-29%)" `[syl_astam]`.
- **Texts:** Dickson et al. for ALTAM; *Loss Models* 5th edition and Brown and Lennox for ASTAM. All commercial.
- **Churn:** both pages say "Registration opens the week of February 8, 2027."
- **Scores:** as FAM, with Demand 2 for ALTAM and 1 for ASTAM.

#### SOA PA: 22; ATPA: 19
- **PA:** April 2026, N 1,965, 65.1% `[res_edu-2026-04-pa…]`. The exam has "two components: e-Learning modules … and an exam to demonstrate their ability to solve a business problem using a data set" `[soa_pa]`. It is project-style, so cards only support it.
- **ATPA** is "e-learning Modules and Assessment" `[soa_atpa]`. Flashcards fit poorly.

#### CAS MAS-I: 25; MAS-II: 23
- **Volume:** spring 2026, MAS-I 751 candidates (43.4%); MAS-II 577 (49.4%) (https://www.casact.org/exams-admissions/exam-results/passing-candidates-spring-2026 `[cas_pass_spring26]`).
- **MAS-I outline:** Probability Models 20–30%, Statistics 20–30%, Extended Linear Models 45–55%. Cognitive levels: "Remember: 5-10%" (https://www.casact.org/sites/default/files/2026-06/MASI_ContentOutline_2026.pdf `[cas_masi_co]`).
- **Scores:** see the table. Demand comes from the flashcard threads above. Gap 4: Mahler and other paid cards are mentioned; no free deck found.

#### CAS Exam 5: 26
- **Volume:** 851 candidates, 38.3% (spring 2026).
- **Outline:** Ratemaking 45–55%, Reserving 45–55% (https://www.casact.org/sites/default/files/2026-03/Exam_5_CO_2026_Fall.pdf `[cas_5_co]`).
- **Sources:** the main texts, "Werner, G., and Modlin, C., Basic Ratemaking" and "Friedland, J.F., Estimating Unpaid Claims Using Basic Techniques", are marked **OP** (online publications). The page also says "Updated September 2026" `[cas_exam-5…]`.
- **Scores:** Source 4 (free to read; reuse licence not verified).

#### CAS Exam 6U: 25
- **Volume:** 638 candidates, 36.4% (spring 2026).
- **Outline:** "Remember: 40–50%", the most recall-heavy outline found. Domains: US Laws and Regulations 10–20%, Government Programs 5–15%, a 60–75% domain, Reinsurance Accounting 5–10% `[cas_6u_co]`.
- **Sources:** content includes NAIC functions, RBC and ORSA. Much of it is statute or NAIC-derived material; the NAIC licence was **not checked**.
- **Supply:** the strongest actuarial Anki demand, but paid incumbents exist (TIA 6U flashcards, BattleActs, both named in Reddit titles).
- **Scores:** Stability 3, because regulation changes by sitting.

#### CAS Exam 7: 22
- **Volume:** 642 candidates, 23.7% (spring 2026). Outline PDF linked (`Exam_7_CO_2026_Fall.pdf`, not parsed).
- **Scores:** light; Source 3 is **not verified**.
- **Exams 8 and 9:** 476 and 464 candidates. Not scored.

### B. Data and analytics

#### SAS Base Programming Specialist (A00-231): 23
- **Page:** https://www.sas.com/en_us/certification/credentials/foundation-tools/base-programming-specialist.html `[sas_base]`.
- **Outline:** "20-25% - Access and create data structures; 35-40% - Manage data; 15-20% - Error handling; 15-20% - Generate reports and output".
- **Format:** "40-45 multiple choice and short-answer questions", "135 minutes", "Passing score is 725", "based on SAS® 9.4 M5", exam ID A00-231, $180.
- **Official prep:** free practice exams and a content-guide PDF.
- **Supply:** no AnkiWeb deck surfaced.
- **Not checked:** SAS documentation licence and trademark terms (so Rules 3).
- **Scores:** Stability 4, since it is pinned to 9.4 M5. The site also promotes Viya credentials, so the Viya equivalents are a future risk.

#### INFORMS CAP: 20
- **Page:** https://www.certifiedanalytics.org/ `[informs_cap]`. It now lists "CAP-Expert, CAP-Pro, CAP-Essentials", plus aCAP and an Academic Pathway. "CAP comes in three levels."
- **Stability 2:** a fresh restructure.
- **Unknowns:** exam page 404; outline and volume **not verified**.

#### DAMA CDMP: 19
- **DMBOK:** "Published by DAMA International®". The page links "Order the DAMA-DMBOK®" to technicspub.com and mentions a "DAMA-DMBOK® Revision" (https://dama.org/learning-resources/dama-data-management-body-of-knowledge-dmbok/ `[dama_dmbok]`).
- **Source 1:** the body of knowledge is a sold, copyrighted book, and a revision is under way.
- **Blocked:** cdmp.info returned a bot challenge (HTTP 202), so exam rules are **not verified**.

#### Microsoft PL-300, Tableau
- Reused from the first pass (23 and 20). PL-300 belongs to the cloud agent's Microsoft family.

### C. Software and programming

#### ISTQB CTFL v4.0.1: 29
- **Volume:** "As of May 2025, ISTQB® has administered 1.5 million exams and issued more than 1.1 million certifications in over 130 countries" (https://www.istqb.org/ `[istqb_home]`).
- **Download counts** on the CTFL page `[istqb_ctfl]`:
  - "ISTQB CTFL Syllabus v4.0.1 — 800856 Downloads";
  - Sample Exam A Questions 367,843;
  - Sample Exams B, C and D about 95k to 120k each.
  - ISTQB publishes four free sample exams.
- **Syllabus terms** (https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf `[istqb_ctfl_syl]`):
  - "Extracts, for non-commercial use, from this document may be copied if the source is acknowledged."
  - "Any individual or group of individuals may use this syllabus as the basis for articles and books, if the authors and the ISTQB® are acknowledged as the source and copyright owners."
  - "Any other use of this syllabus is prohibited without first obtaining the approval in writing."
  - A free, non-commercial site with acknowledgement fits these terms. Ads or paid tiers would need a check. ISTQB® is a registered trademark.
- **Existing supply:**
  - AnkiWeb 2079727228 "Foundations of Software Testing ISTQB Certification, 4th ed.": 382 notes, updated 2026-03-04, +5/−2, book-chapter based.
  - AnkiWeb 837841315 ISTQB Glossary: 801 notes, 2016-06-08 (glossary v2.2).
  - Two further glossary decks (881633303, 928010749) are now "not available".
  - GitHub: syafiqhadzir/anki-ctfl-v4.0 (0 stars, 2024-11-25); GaboDevCode/istqb-study-resources (Spanish, 1 star, 2026-06-29).
- **Demand:** r/QualityAssurance "ISTQB" RSS returned 50 posts, including "I built a free platform to study for ISTQB CTFL v4.0" (2026-08-04, /comments/1vfkx7y/) and several "passed CTFL" posts `[rss/QualityAssurance_ISTQB.xml]`.
- **Churn:** v4.0 from 2023; v4.0.1 is dated 2024-09-15.
- **Partners:** Member Boards and Accredited Training Providers `[istqb_ctfl]`.
- **Scores:** Demand 5, Gap 4, Source 5, Rules 4, Stability 4, Partner 4, Search 3 (a crowded prep market; not checked).

#### ISTQB Advanced (CTAL-TA, TM, TTA): 25
- The CTAL-TA page returned HTTP 500, so version and terms are **not verified**. I assumed the same copyright-notice pattern as CTFL, which is unconfirmed.
- CTFL holders "may choose … Test Analyst, Technical Test Analyst, or Test Management Advanced Level" `[istqb_ctfl]`.
- No Advanced deck surfaced.

#### IREB CPRE Foundation Level (v3.3.0): 26
- **Syllabus:** "3.3.0 | April 1, 2026" (https://hub.ireb.org/…/cpre_foundationlevel_syllabus_en_v.3.3.0.pdf `[ireb_fl_syl]`).
- **Terms of use:** "Any individual or group of individuals may use this syllabus as a basis for articles, books, or other derived publications, provided the copyright of the authors and IREB e.V. … is acknowledged". The advertising clause needs consent.
- **Format:** "75-minute multiple-choice test with approx. 45 questions" `[ireb_fl_fact]`.
- **Free resources:** a handbook, a glossary and an online glossary are listed `[ireb_cpre_fl]`.
- **Supply:** none found (AnkiWeb search, GitHub).
- **Unknown:** candidate volume **not verified**.
- **Stability 3:** the syllabus was just revised.

#### iSAQB CPSA-F: 20 (partnership first)
- The licence (https://raw.githubusercontent.com/isaqb-org/license-copyright/main/LICENSE.adoc `[isaqb_license_main]`) says: "If any other use of documents and/or curricula is intended, for instance for their dissemination to third parties … A separate license agreement would then have to be entered into."
- Rules 1: an independent deck built on the curriculum needs a licence.

#### Python Institute PCEP-30-02 and PCAP-31-03: 23 each
- **Churn:** "PCEP-30-02 – Status: Active … (Updated exam version scheduled for release in Q3 2026 …)" (https://pythoninstitute.org/pcep `[pyinst_pcep]`). PCAP says the same (https://pythoninstitute.org/pcap `[pyinst_pcap]`). **Wait for the new versions.**
- **Format:** PCEP runs 40 minutes; PCAP runs 65 minutes.
- **Sources:** "Python software and documentation are licensed under the Python Software Foundation License Version 2" (https://docs.python.org/3/license.html `[py_doc_lic]`), which allows reuse with notice.
- **Supply:**
  - AnkiWeb 1621142538 "PCEP – Certified Entry-Level Python Programmer exam.": 100 notes, 2024-09-18, 0 ratings.
  - AnkiWeb 825206389 "PCAP Python Certification Questions": 36 notes, 2021-06-08.
- **Not checked:** OpenEDG trademark terms.

#### Oracle Java SE 21 (1Z0-830) and 17 (1Z0-829), Oracle SQL (1Z0-071): 22 each
- education.oracle.com returned **403**, so exam topics, versions and rules are **not verified**.
- **Supply:** only Java 8 decks were found.
  - AnkiWeb 1917178363 "Java Oracle Certified Professional 8": 800 notes, 2020-12-10, "used for passing the Oracle's 1z0-809".
  - A 12-part OCP 8 series (e.g. 780965115: 50 notes, 2021).
  - GitHub Pance/OCPJP6_flashcards (2013).
  - No 1Z0-071 deck. Generic SQL decks exist (53827622 "Ultimate SQL": 113 notes, 2025-06-04, +9).
- **Why it scores:** the gap is real for Java 17 and 21. Demand and sources are unverified.

#### TOGAF EA Foundation: 19
- **Portfolio** (https://www.opengroup.org/certifications/togaf-certification-portfolio `[togaf_cert]`): certifications are built on both "Version 9.2" and "10th Edition". Exams are OGEA-101 (Part 1), OGEA-102 and OGEA-103.
- **Unknowns:** the Standard's licence and the Open Group trademark rules were **not verified** (the help-centre page returned 403).
- **Supply:** AnkiWeb 596634696 "Togaf 9.2 Cards for Foundation 1": 177 notes, 2023-11-21, "used to pass my TOGAF 10 stage 1 exam".
- **Scores:** Rules 2 and Source 2, pending the licence.

#### LPI Linux Essentials (010-160): 23
- **Exam:** "Current version: 1.6 (Exam code 010-160) … 40 questions … 60 minutes … Validity period: Lifetime" (https://www.lpi.org/our-certifications/linux-essentials-overview/ `[lpi_le]`). Objectives are weighted `[lpi_le_obj]`.
- **LPI's free learning materials:** "licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4" (https://learning.lpi.org/en/ `[lpi_learning]`). NoDerivatives means cite, don't adapt.
- **Supply:** GitHub Invincibear/anki-linuxessentials (0 stars, 2023).

### D. IT service

#### KCS v6 Fundamentals: 27 (small audience)
- **Licence:** "KCS Practices Guide v6 by Consortium for Service Innovation is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License" (https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide `[kcs_guide]`). That allows non-commercial derivatives such as cards.
- **Trademark:** "KCS® … are service marks of the Consortium for Service Innovation" `[kcs_cert]`.
- **An exam exists:** "Buy a Fundamentals course AND corresponding exam" `[kcs_cert]`. HDI also sells "KCS Principles" `[hdi_certs]`.
- **Unknown:** volume **not verified**. Cheap to build and uncontested.

#### HDI role certifications: 19
- HDI offers role certifications "from Customer Service Representative up through Support Center Director" (https://www.thinkhdi.com/certification `[hdi_certs]`).
- Training is course-bound, and no public outline was found, so Source is 1.

**ITIL** is covered elsewhere (ITIL 4 retiring 31 December 2027, per CANDIDATES.md). **SIAM** is not scored.

### E. Health and science

#### NREMT EMR 24, AEMT 23, EMT 25 (reused), Paramedic 22 (reused)
- **Certified counts, current** (https://www.nremt.org/maps `[nremt_maps]`): EMR 17,996; EMT 423,990; AEMT 31,565; Paramedic 155,005; total 628,556.
- **EMR:**
  - "Updated … EMR and EMT Certification Examinations launch on April 7, 2025", based on "the 2023 BLS Practice Analysis".
  - Domains: Scene Size-Up and Safety 19–23%, Primary Assessment 37–41%, Secondary Assessment 4–8%, Patient Treatment and Transport 20–24%.
  - "EMR - $88 per examination attempt" (https://www.nremt.org/Pages/Examinations/EMR-and-EMT-Certification-Examinations `[nremt_emr]`).
- **AEMT and Paramedic** test plans come from "the 2019 National EMS Practice Analysis and the 2021 … Addendum" (https://www.nremt.org/Pages/Examinations/AEMT-and-Paramedic-Certification-Examinations `[nremt_als]`).
  - AEMT: Clinical Judgment 31–35%, Medical/OB/GYN 25–29%.
  - Paramedic: Clinical Judgment 34–38%, Medical/OB/GYN 24–28%.
  - The exams use "Technology Enhanced Items".
- **Supply** (item-info verified):
  - EMT-textbook decks: 116491440 "Emergency Care 14th Edition EMT Deck", 1,178 notes, 2024-08-08; 1345448597 "EMTbee EMT Deck (11th ed.)", 1,177 notes, 2022; 1595741398 "EMS (EMT-B)", 1,503 notes, 2019; 285602000, 361 notes, 2025-08-15, 0 ratings; plus the reused 722550778 and 1515970148.
  - Paramedic pharmacology: 2002485477, 581 notes, 2026-03-01, 0 ratings; 1601249537, 373 notes, 2020; 2132010923, 338 notes, 2015.
  - **No EMR or AEMT deck surfaced.** The only EMR request seen is the reused title "Jones/Bartlett EMR Anki Deck" (2025-03-14).
- **Reddit:** r/Paramedics "anki" returned 3 posts, including "Progress on EMS browser based game: Made NREMT prep platform" (2026-09-23) `[rss/Paramedics_anki.xml]`.
- **Rules:** the trademark page allows reference "when necessary to accurately refer to the National Registry" (https://www.nremt.org/about/trademarks `[nremt_trademarks]`).
- **Clinical review is required.**

#### NCCPA PANCE: 18
- The blueprint is "effective January 2025" (https://www.nccpa.net/become-certified/pance-blueprint/ `[nccpa_blueprint]`). Passing earns "PA-C®" `[nccpa_pance]`.
- It is a medical-school-level exam. A large medical Anki ecosystem likely serves it, but that is **not checked**. Not recommended.

#### NHA CPT: 21; ASCP PBT: 20
- **NHA sells its own cards.** Its study guide includes "interactive games, quizzes, flashcards", with practice tests "(based on actual exam)" and a "CPT Test Plan" (https://www.nhanow.com/certification/nha-certifications/certified-phlebotomy-technician-(cpt) `[nha_cpt]`).
- **Employer claim:** "96% of employers require or encourage certification … (Source: 2025 Industry Outlook)". This is not a candidate count.
- **Supply:** AnkiWeb 1475605380 "Order of Draw Phlebotomy": 49 notes, 2022.
- **ASCP:** pages and the PBT content guideline returned **403**.
- **Sources:** phlebotomy standards are CLSI documents, whose copyright was **not verified**.

#### ARRT Radiography: 22
- **Content specifications:** "ARRT BOARD APPROVED: JANUARY 2021 · IMPLEMENTATION DATE: JANUARY 1, 2022". Scored questions: Patient Care 33, Safety 50, Image Production 51, Procedures 66, plus "30 unscored (pilot) questions" (arrt.org content-spec PDF `[arrt_rad_cs]`).
- **Unknown:** whether a newer spec exists (**not verified**).
- **Supply:** AnkiWeb 185131158 "Rad Tech Program": 1,130 notes, 2019; 1633236510 "Radiography projections": 48 notes, 2019.

#### CDR RD exam: 20 (lightly researched)
- "Registration Examination for Dietitians" and "for Dietetic Technicians" appear under Examination Resources (https://www.cdrnet.org/study `[cdr_study]`). The outline was **not fetched**.
- **Supply:** no RD deck surfaced. An "NDLE Reviewer" deck (Philippine exam) is unavailable.

#### NCHEC CHES: 21
- "165 multiple-choice questions (150 scored and 15 pilots) … 3 hours", measured against "the Eight Areas of Responsibility". "Registration Currently Closed-Reopen November 1, 2026" (https://www.nchec.org/ches-exam `[nchec_ches]`).
- **Not checked:** the competency framework's licence. No deck found.

#### AHA BLS / ACLS / PALS: 16
- heart.org and cpr.heart.org returned **403**, so the AHA copyright terms are **not verified** this task.
- **Supply:** small decks, e.g. 1622488531 "2023 BLS, ALS, & PALS Algorithms" (141 notes, sourced from a third-party site), 1072448355 (134 notes, 2021), 67325361 (50 notes, 2025-12-29).
- **Skip:** these are course-completion cards, and the algorithms are AHA-owned.

#### NCLEX-RN / PN: 19 (skip)
- "2026 RN Test Plan — Effective April 1, 2026, through March 31, 2029"; the PN plan has the same window (https://www.nclex.com/test-plans.page `[ncsbn_nclex]`).
- Brainscape: NCLEX-RN 181,093 learners; NCLEX-PN 34,520 `[brainscape_learn]`. The market is saturated.

#### CNA: 18
- Brainscape CNA has 1,217 learners. The exams are state-specific. Lightly researched.

### F. Other professional

#### EPA Section 608: 28 (government-agent overlap)
- **Legal basis:** "EPA regulations (40 CFR Part 82, Subpart F) under Section 608 of the Clean Air Act require that technicians who maintain, service, repair, or dispose…"; "EPA does not issue certification cards" (https://www.epa.gov/section608/section-608-technician-certification-0 `[epa608]`).
- **Types:** Type I (small appliances), Type II (high-pressure), Universal. "The core test must be taken as a proctored exam in order to attain Universal Certification" (https://www.epa.gov/section608/section-608-technician-certification-requirements `[epa608_req]`).
- **Sources:** the source is federal regulation (eCFR), so public-domain law.
- **Unknowns:** the EPA disclaimer page's "Copyright Status" paragraph concerns contractor documents `[epa_copyright]`. Candidate volume is **not verified**.
- **Supply:** none found on AnkiWeb or GitHub.
- **Why it scores:** mandatory for every refrigerant-handling technician. Pairs with NATE.

#### CMS Introductory Sommelier: 22; Certified Sommelier: 21
- **Fees:** "In-Person … $949; Online … $649" `[cms_introexam]`.
- **Rules:** "Posting or disclosing any recollection of questions presented during the examination in any form is prohibited" (https://www.mastersommeliers.org/certification/exams/examination-integrity/ `[cms_integrity]`). This concerns recall, not study material.
- **Demand (Brainscape):** Introductory 10,778 learners; Certified (CMS 2) 2,445.
- **Supply:**
  - AnkiWeb 191778428 "Study for Court of Master Sommeliers Level 1 Exam": 337 notes, 2015-02-14, +7.
  - 1981971485 "CMS Advanced Study Deck": 5,290 notes, 2018 (reused).
  - GitHub sandoche/Wine-Flashcards-Anki: 8 stars, updated 2026-08-16.
- **Reddit:** r/Sommelier "anki" returned 1 post, "Certified/Advanced/Master Flashcards" (2025-06-02).
- **Family:** build with WSET (first pass).

#### California Notary Public: 22
- "The Notary Public Handbook contains California laws relating to notaries public and is designed to assist an applicant in preparing for the notary public examination" (https://www.sos.ca.gov/notary/handbook `[ca_notary]`).
- **Sources:** the law is public. The site carries "Copyright © 2026 California Secretary of State".
- **Unknowns:** other states' exams were not researched (the NNA page returned 404), and demand was not measured.

#### NCRA RPR Written Knowledge Test: 22
- "a 120*- question, multiple-choice test … Technology and Innovation (43%), Industry Practices (34%), NCRA, Professionalism, and Ethics (23%)", from the 2019 RPR Job Analysis. The skills tests run at 180, 200 and 225 wpm and cannot be served by cards (https://www.ncra.org/certification/NCRA-Certifications/registered-professional-reporter `[ncra_rpr]`).

#### NALA CP: 21
- "For over 50 years … NCCA granted accreditation" on 30 April 2014 (https://nala.org/certification/ `[nala_cert]`).
- **Unknown:** the outline was not fetched.

#### NATE: 21; ASE: 20; ATA: 19
- **NATE:** "the nation's largest nonprofit certification organization for … HVACR technicians" (https://natex.org/ `[nate]`). No exam detail was extracted.
- **ASE and ATA:** both returned **403**. ATA is a translation performance exam, which flashcards do not suit.

#### NCEES FE: 24
- "The FE exam includes 110 questions. The exam appointment time is 6 hours" (https://ncees.org/exams/fe-exam/ `[ncees_fe]`).
- **Unknowns:** volume and the handbook's licence were **not verified**.
- **Reddit:** r/FE_Exam "anki" returned 5 posts, including "FE Civil how to use flash cards" (2025-12-01, /comments/1pb65os/) `[rss/FE_Exam_anki.xml]`.
- **Supply:** no FE-engineering deck surfaced. "All ACEM FE decks" (1765783503: 4,167 notes) is Australasian emergency-medicine, not engineering.
- **Card fit:** the exam is calculation-heavy and allows the reference handbook, so cards serve concepts and handbook navigation.

#### LEED Green Associate: 20
- The USGBC page lists "LEED v5, LEED v4.1, LEED v4" (https://www.usgbc.org/credentials/leed-green-associate `[leed_ga]`).
- **Stability 2:** a new rating-system version creates exam-alignment risk. Exam version **not verified**.
- **Demand:** Brainscape LEED Green Associate has 6,108 learners.
- **Supply:** no AnkiWeb deck surfaced.

#### Electricians (NEC): 18
- **Demand (Brainscape):** "2023 Journeyman Electrician" 457 learners; "2023 Master Electrician" 508.
- **Rules and sources:** NFPA's NFPA 70 page includes a "Free Access" entry and a "No Free Access" label string `[nfpa70]`, but the free-access page returned 500. Terms **not verified**.
- The NEC is NFPA-copyrighted (task premise, not re-verified), and state exams vary. Skip unless NFPA partners.

---

## Deck families (build together)

| Family | Decks | Shared spine |
|---|---|---|
| **Actuarial: SOA core** | P, FM, FAM, ALTAM, ASTAM, SRM (PA and ATPA as concept supplements) | SOA weighted syllabi; standard probability, interest theory, life contingencies, loss models |
| **Actuarial: CAS** | MAS-I, MAS-II, 5, 6U, 7 | CAS content outlines; OP readings (Werner & Modlin, Friedland); US insurance law for 6U |
| **Software testing** | ISTQB CTFL, CTAL-TA/TM/TTA (later CT-AI, Agile) | ISTQB syllabi (non-commercial extracts with acknowledgement) and the ISTQB glossary |
| **Software engineering** | IREB CPRE-FL (+ Advanced modules); iSAQB only under licence | IREB syllabus terms allow derived publications |
| **Programming** | PCEP, PCAP (after the Q3 2026 update), Java SE 17/21, Oracle SQL, Linux Essentials | Python docs (PSF licence); language specs; LPI objectives |
| **Data** | SAS Base, PL-300 (cloud), Tableau, CAP, SRM (cross-list) | vendor outlines; statistical-learning concepts |
| **IT service** | KCS v6 Fundamentals, HDI (thin), ITIL (retiring) | KCS v6 Practices Guide (CC BY-NC 4.0) |
| **EMS** | EMR, EMT, AEMT, Paramedic | NREMT test plans; National EMS Education Standards (ems.gov 403, not verified) |
| **Allied health** | Phlebotomy (NHA, ASCP), ARRT, CHES, RD, CNA | public outlines; clinical review required |
| **Wine** | CMS Intro, CMS Certified, WSET 2/3 | public appellation law (not checked) |
| **Trades** | EPA 608, NATE, ASE, electrician | 40 CFR 82 Subpart F (public); NEC is licensed |
| **Legal support** | Notary (per state), NALA CP, NCRA RPR WKT | state notary statutes |
| **Engineering / green** | FE, LEED GA | NCEES specs; USGBC |

## Notable empty niches (no free, current deck found)
- **SOA FAM, ALTAM, ASTAM and SRM, and CAS MAS-I, 5 and 6U.** Actuarial candidates ask for decks repeatedly; the only free decks are for P and FM, from 2017.
- **ISTQB CTFL v4.0.** 800k syllabus downloads and permissive syllabus terms; the only free deck is book-based.
- **IREB CPRE-FL.** The syllabus explicitly allows derived publications.
- **NREMT EMR and AEMT.** No deck at all; every EMT deck predates the April 2025 domains.
- **EPA 608.** Public-domain federal regulation; nothing on AnkiWeb or GitHub.
- **Java SE 17/21 (1Z0-829/830) and Oracle SQL 1Z0-071.** Only Java 8 decks exist.
- **KCS v6.** A CC BY-NC source with no competition.
- **SAS Base (A00-231).** No deck found.
