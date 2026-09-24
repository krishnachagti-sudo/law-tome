# Candidates, second pass: government-run and government-sourced exams (public domain or open material)

Compiled 2026-09-24. Raw pages are in `candidates2/raw-gov/` (`*.raw` is the original, `*.txt` is text extracted with curl plus python or pdftotext). GitHub results are in `raw-gov/github_mcp_results.txt`.

**Scale.** Each score runs from 1 (poor) to 5 (strong), for a maximum total of 35. The columns are:
- **Dem (demand):** how many people sit the exam.
- **Gap:** how poorly current free decks serve it (5 = wide open).
- **Src (source):** how complete the open material is.
- **Rules:** how freely we may reuse the material and publish on the topic.
- **Stab (stability):** 5 = content changes rarely.
- **Part (partner):** whether schools, clubs or other bodies could distribute the decks.
- **Srch (search):** search intent.

**What could not be checked.** Scores rest only on the evidence below. When a demand figure could not be verified, Demand is capped at 3 unless there was indirect evidence.
- **AnkiWeb:** every search returned HTTP 429 ("Please log in to perform more searches."), so Gap scores do **not** reflect AnkiWeb.
- **Blocked sites:** fcc.gov, uscg.mil (dco.uscg.mil), uscis.gov, fmcsa.dot.gov and phmsa.dot.gov returned 403 (Akamai) to curl. Anything from those sites is marked "not verified".

## Summary table (sorted by total)

| # | Exam | Dem | Gap | Src | Rules | Stab | Part | Srch | **Total** | Family |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | FCC Amateur **Technician** (Element 2, 2026–2030 pool) | 4 | 3 | 5 | 5 | 4 | 3 | 4 | **28** | FCC-Amateur (NCVEC pool) |
| 2 | FAA **Remote Pilot / Part 107** (UAG) | 5 | 3 | 4 | 4 | 4 | 3 | 5 | **28** | FAA-Airman-ACS |
| 3 | US **Civics test** (2025 version) *(not a certification)* | 5 | 2 | 5 | 5 | 3 | 3 | 5 | **28** | Public-list (civics) |
| 4 | FAA **Private Pilot Airplane** (PAR) | 5 | 3 | 4 | 4 | 4 | 3 | 4 | **27** | FAA-Airman-ACS |
| 5 | FAA **Instrument Rating Airplane** (IRA) | 4 | 4 | 4 | 4 | 4 | 3 | 4 | **27** | FAA-Airman-ACS |
| 6 | FCC Amateur **General** (Element 3, 2023–2027 pool) | 4 | 3 | 5 | 5 | 3 | 3 | 4 | **27** | FCC-Amateur (NCVEC pool) |
| 7 | **EPA Section 608** (Core, Type I/II/III, Universal) | 4 | 3 | 4 | 4 | 4 | 3 | 5 | **27** | Trades-Environmental (EPA) |
| 8 | **FEMA ICS/NIMS** IS-100.c / IS-200.c / IS-700.b / IS-800.d | 3 | 4 | 5 | 4 | 4 | 3 | 4 | **27** | FEMA-NIMS/ICS |
| 9 | FCC Amateur **Extra** (Element 4, 2024–2028 pool) | 3 | 3 | 5 | 5 | 4 | 3 | 3 | **26** | FCC-Amateur (NCVEC pool) |
| 10 | FAA **Aviation Mechanic** General / Airframe / Powerplant (3 decks) | 4 | 4 | 4 | 4 | 4 | 3 | 3 | **26** | FAA-AMT-ACS |
| 11 | FAA **Commercial Pilot Airplane** (CAX) | 4 | 4 | 4 | 4 | 4 | 2 | 3 | **25** | FAA-Airman-ACS |
| 12 | FAA **Flight Instructor Airplane** + FOI + CFII (FIA / FOI / FII) | 4 | 4 | 4 | 4 | 4 | 2 | 3 | **25** | FAA-Airman-ACS |
| 13 | **OSHA Outreach** 10/30 (Construction, General Industry, Maritime) *(course card, not a certification exam)* | 4 | 3 | 3 | 4 | 4 | 2 | 4 | **24** | Trades-Safety (OSHA standards) |
| 14 | **DOT Hazmat employee** training (49 CFR 172 Subpart H) *(employer testing, no national exam)* | 2 | 4 | 5 | 5 | 4 | 2 | 2 | **24** | DOT-Transport |
| 15 | **CDL General Knowledge** (+ Air Brakes, Combination, HazMat endorsement) | 5 | 2 | 3 | 2 | 4 | 2 | 5 | **23** | DOT-Transport |
| 16 | FAA **Airline Transport Pilot** Multiengine (ATM) | 3 | 3 | 4 | 4 | 4 | 2 | 3 | **23** | FAA-Airman-ACS |
| 17 | **ISED Canada Basic** amateur qualification *(open for non-commercial use)* | 3 | 3 | 4 | 3 | 4 | 3 | 3 | **23** | FCC-Amateur (intl) |
| 18 | FCC **GROL** (Elements 1 + 3) | 3 | 4 | 3 | 4 | 3 | 2 | 3 | **22** | FCC-Commercial |
| 19 | FAA **Ground Instructor** (Basic / Advanced / Instrument) | 2 | 4 | 4 | 4 | 4 | 2 | 2 | **22** | FAA-Airman-ACS |
| 20 | FAA **Private Pilot Helicopter** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | **22** | FAA-Airman-ACS |
| 21 | FAA **Aircraft Dispatcher** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | **22** | FAA-Airman-ACS |
| 22 | FAA **Inspection Authorization** (IA) | 2 | 4 | 4 | 4 | 4 | 2 | 2 | **22** | FAA-AMT-ACS |
| 23 | **USCG OUPV / Master** (≤100 GT) | 3 | 4 | 2 | 3 | 3 | 2 | 4 | **21** | USCG-Merchant-Mariner |
| 24 | FCC **Marine Radio Operator Permit** (Element 1 only) | 2 | 4 | 3 | 4 | 3 | 2 | 2 | **20** | FCC-Commercial |
| 25 | FAA **Sport Pilot** (after the MOSAIC changes) | 1 | 4 | 4 | 4 | 2 | 2 | 2 | **19** | FAA-Airman-ACS |

**25 exams scored.** A further 2 were looked at but not scored for lack of evidence: EU/EASA A1/A3 and UK CAA drone tests, and the NRC.

**Main structural finding.** The two families with explicitly public question pools are FCC amateur (NCVEC "releases ... into the public domain") and FCC commercial (47 CFR 13.215: "The FCC will issue public announcements detailing the questions in the pool"). The rest are syllabus-sourced, with public-domain federal content (ACS, handbooks, CFR, course text) but **confidential live questions**. For those, the decks must be written from the syllabus. They cannot claim to be "real questions".

---

## Cross-cutting evidence

- **17 U.S.C. §105(a):** "Copyright protection under this title is not available for any work of the United States Government…" — https://www.copyright.gov/title17/92chap1.html (raw-gov/usc105.txt line 288).
- **FAA handbooks page:** "Any reproduction or modification of this material from original FAA source material is solely the responsibility of the publisher." — https://www.faa.gov/regulations_policies/handbooks_manuals/aviation (faa_handbooks.txt). No dedicated FAA copyright notice was found on /web_policies or /web_policies/disclaimer (faa_webpol.txt, faa_disclaimer.txt).
- **FAA live questions are confidential.** The Airman Testing Community Advisory, August 2026, says: "While the specifics of active test questions remain confidential, the Testing Standards Section will continue to provide updates on knowledge tests through this advisory." — https://www.faa.gov/training_testing/testing/August_2026_ATCA.pdf (faa_atca_aug.txt line 109). The same advisory says FAA is "embedding images directly in test questions, eliminating the need for printed test supplements."
- **FAA sample questions have moved.** The former sample-question URLs https://www.faa.gov/training_testing/testing/test_questions and /test_guides now return **404**. The ACS page's "Review airmen knowledge test questions" link now points to the PSI (Talogy) login at https://faa.psiexams.com/FAA/login (faa_acs.txt). Public sample questions could not be verified.
- **FAA 2025 knowledge-test volumes** (raw PDF text): https://www.faa.gov/data_research/aviation_data_statistics/test_statistics/CY2025_AKT_Volume_Report.pdf (faa_akt2025.txt). The total is **293,516** tests with an 89.56% pass rate.
- **FAA active airmen at 31 Dec 2025** (Table 1 of the xlsx): https://www.faa.gov/data_research/aviation_data_statistics/civil_airmen_statistics/2025_Active_Civil_Airmen_Statistics_FINAL.xlsx (faa_airmen2025.xlsx).

  | Category | Holders |
  |---|---|
  | Remote Pilots | 492,311 |
  | Student | 370,286 |
  | Private | 174,155 |
  | Commercial | 118,314 |
  | ATP | 181,742 |
  | Flight Instructor certificates | 145,538 |
  | Instrument ratings | 355,473 |
  | Mechanic | 348,426 |
  | Ground Instructor | 84,190 |
  | Dispatcher | 27,497 |
  | Parachute Rigger | 8,207 |
- **ACS list with effective dates:** https://www.faa.gov/training_testing/testing/acs (page last updated 16 Sep 2026; faa_acs.txt).

  | ACS | Version | Effective |
  |---|---|---|
  | Private Airplane | FAA-S-ACS-6C | 31 May 2024 |
  | Instrument Airplane | FAA-S-ACS-8C | 31 May 2024 |
  | Commercial Airplane | FAA-S-ACS-7B | 31 May 2024 |
  | ATP | FAA-S-ACS-11A | 31 May 2024 |
  | CFI Airplane | FAA-S-ACS-25 | 31 May 2024 |
  | Aviation Mechanic G/A/P | FAA-S-ACS-1 | 21 Sep 2022 |
  | Remote Pilot | FAA-S-ACS-10B | 6 Apr 2021 |
  | Sport Pilot PTS | FAA-S-8081-31B | 14 Sep 2026 |
- **Knowledge-element (K) codes in the ACS PDFs.** These are rough counts from a regex over pdftotext output, not verified by hand:
  - Private Airplane: about 368
  - Commercial Airplane: about 363
  - Instrument Airplane: about 90
  - Remote Pilot: about 176
  - Aviation Mechanic: about 495
  - CFI (including the FOI "AI" codes): about 683

  Files: acs_pa.txt, acs_ca.txt, acs_ir.txt, acs_uas.txt, acs_amt.txt, acs_cfi.txt.
- **Handbooks listed on the FAA Aviation Handbooks page** (faa_handbooks.txt):
  - PHAK FAA-H-8083-25C (2023), with a MOSAIC addendum in October 2025
  - AFH FAA-H-8083-3C (2021), with a MOSAIC addendum in October 2025
  - AMT General / Airframe / Powerplant handbooks FAA-H-8083-30B / 31B / 32B (2023)
  - Instrument Flying Handbook (2012, plus addenda)
  - Aviation Weather Handbook (04/02/2026)
  - Risk Management Handbook -2A (2022)
  - Remote Pilot Study Guide FAA-G-8082-22 (8/18/2016)
  - AIM, via /air_traffic/publications
- **Reddit (RSS, r/flying, search "anki").** Recurring requests for current decks:
  - "Up to date IFR or VFR Anki Decks?" (2022-01-30): "found ones from 3 years ago, and I don't know whether to use those"
  - "PilotsCafe Anki Decks?" (2024-09-12) and "Does anyone have an Anki deck for Pilots Cafe?" (2025-01-09)

  Source: rss_flying.raw. The r/part107 RSS returned 429 and was not fetched.

---

## Evidence per exam

### 1. FCC Amateur Technician (Element 2): 28/35
- **Version:** 2026–2030 Technician pool, released 18 Dec 2025 with errata on 19 Feb 2026. The PDF header reads "Effective 7/01/2026 – 6/30/2030" — https://www.ncvec.org/index.php/2026-2030-technician-question-pool (ncvec_tech.txt; pool PDF ncvec_techpool.txt).
- **Size:** 409 unique question IDs (T#X##) found in the raw PDF text. This may include deleted-but-listed IDs; not verified by hand.
- **Licence:** "The NCVEC Question Pool Committee (QPC) hereby releases the 2026-2030 Technician Class (Element 2) Question Pool into the public domain." The release includes diagrams (JPG/PDF). The basis is 47 CFR 97.523: "Each question pool must be published and made available to the public prior to its use" (ncvec_pools.txt).
- **Rules:** The General page says users "are free to correct minor typographical and punctuation errors…" provided the meaning does not change (ncvec_gen.txt).
- **Churn:** "The pools are normally valid for 4 years and each question pool is reviewed and updated on a four-year rotation", released "normally 6 months prior to becoming effective" (ncvec_pools.txt).
- **Candidates / licences:** not verified, because fcc.gov returned 403.
- **Existing decks:**
  - HamStudy.org is a free study site ("Register for FREE!", hamstudy.txt).
  - On GitHub, several tiny apps exist, one already on the 2026–2030 pool: dwelsh0718 "...2026-2030-409-Questions-Included-", updated 2026-09-17. One Anki repo, maccam912, covers the **2022–2026** pool and is archived. See github_mcp_results.txt.
  - AnkiWeb: not fetched (429).
- **Why this score:**
  - Source and Rules are perfect.
  - Gap is moderate: HamStudy is dominant, but the new pool took effect on 1 Jul 2026, so older Anki decks are stale.
  - Partners: VEC teams and clubs. The QPC lists ARRL VEC, W5YI, Anchorage, LAUREL, SANDARC and W4VEC (ncvec_qpc.txt).

### 2. FCC Amateur General (Element 3): 27/35
- **Version:** 2023–2027 pool, 6th errata issued 4 Feb 2026, "Effective 7/01/2023 – 6/30/2027". 433 IDs in the raw text (ncvec_gen.txt, ncvec_genpool.txt).
- **Licence:** "The NCVEC Question Pool Committee hereby releases into public domain the 2023-2027 General, Element 3, Question pool."
- **Churn:** The pool has had six errata so far. It expires 30 Jun 2027, and a replacement should be released around January 2027, about 6 months ahead. That date is inferred from the NCVEC rule; the release itself is not verified. Stability is set to 3 because a deck built now lives about 9 months.
- **Existing decks:** HamStudy; JSON conversions on GitHub (witheej, updated 2024; joshoshosh, 2022). AnkiWeb not fetched.

### 3. FCC Amateur Extra (Element 4): 26/35
- **Version:** 2024–2028 pool, 4th errata issued 4 Feb 2026, "Effective July 1, 2024". 604 IDs in the raw text. SVG diagrams are published as a zip (ncvec_extra.txt, ncvec_extrapool.txt).
- **Licence:** "hereby releases into public domain the 2024-2028 Element 4 Extra Class Question Pool."
- **Why this score:** Demand is lower than for the lower classes (no numbers verified).

### 4. FAA Remote Pilot / Part 107 (UAG): 28/35
- **Volume and holders:** "Unmanned Aircraft General – Small": **73,914 tests in 2025** at an 82.96% pass rate, the largest of any FAA knowledge test (faa_akt2025.txt). There were 492,311 active remote pilots (airmen xlsx T1).
- **Outline:** Remote Pilot ACS FAA-S-ACS-10B (effective 6 Apr 2021). The topic list is on https://www.faa.gov/uas/commercial_operators/become_a_drone_pilot. Recurrent training is the free online ALC-677 course, required "every 24 calendar months" (faa_107.txt).
- **Source:** The ACS, the Remote Pilot Study Guide FAA-G-8082-22 and the PHAK are federal works, public domain under 17 USC 105.
- **Rules:** Live questions are confidential (ATCA, August 2026), so the cards must be written from the ACS and handbooks.
- **Existing decks:** GitHub shows a burst of 2026 projects, all with 0 stars:
  - ullbergm/faa-drone-trainer: "279 questions from the FAA Remote Pilot Study Guide and AC 107-2A", updated 2026-08-28
  - part-107-flight-deck: 2026-09-22
  - Part107_StudyGuide: 2026-08
  - Part-107-Study-Buddy: 2026-09

  AnkiWeb and Quizlet not fetched. A large commercial prep market exists but was not verified here.
- **Churn:** stable since 2021, apart from the questions changing to embedded images.

### 5. FAA Private Pilot Airplane (PAR): 27/35
- **Volume and holders:** 44,657 tests in 2025, 89.56% pass rate. 174,155 active private pilots and 370,286 student certificates.
- **Outline:** ACS FAA-S-ACS-6C, effective 31 May 2024. About 368 K-codes (regex count).
- **Source:** PHAK -25C (2023) plus the October 2025 MOSAIC addendum, the AFH, the AIM and 14 CFR. All are public domain under 17 USC 105.
- **Existing decks:** GitHub has only small or old projects: mmngtb/Anki-Flashcards "Private to CFI" (2025-08), mtsrcruz/flashcard-ppl (2026-09). Reddit repeatedly asks for up-to-date decks (see the cross-cutting section).
- **Churn:** The MOSAIC addenda of October 2025 show that the handbooks do change.

### 6. FAA Instrument Rating Airplane (IRA): 27/35
- **Volume:** 27,143 tests in 2025, 94.38% pass rate. There were 355,473 instrument ratings.
- **Outline:** ACS -8C, effective 31 May 2024.
- **Source:** Instrument Flying Handbook (2012, plus addenda A and B), Instrument Procedures Handbook (2017), AIM.
- **Gap:** Reddit's "Up to date IFR or VFR Anki Decks?" post, and the 2018 IFR deck post still being cited in 2024.

### 7. FAA Commercial Pilot Airplane (CAX): 25/35
- **Volume and holders:** 20,530 tests, 99.17% pass rate. 118,314 active commercial pilots.
- **Outline:** ACS -7B.
- **Why this score:** The high pass rate lowers urgency.

### 8. FAA Flight Instructor (FIA + FOI + FII): 25/35
- **Volumes (2025):**

  | Test | Tests in 2025 |
  |---|---|
  | Fundamentals of Instructing | 14,846 |
  | Flight Instructor Airplane | 14,736 |
  | Flight Instructor Instrument Airplane | 12,781 |
- **Holders:** 145,538 flight instructor certificates.
- **Outline:** CFI ACS FAA-S-ACS-25 (2024).
- **Source:** Aviation Instructor's Handbook (2020).
- **Deck design:** A good FOI deck should also serve the Ground Instructor tests.

### 9. FAA Aviation Mechanic General / Airframe / Powerplant: 26/35
- **Volumes and pass rates (2025):**

  | Test | Tests in 2025 | Pass rate |
  |---|---|---|
  | AMT General | 22,585 | **69.59%** |
  | Airframe | 16,885 | 74.01% |
  | Powerplant | 17,572 | **63.04%** |

  These are the lowest pass rates among the high-volume tests, which is a strong study-aid signal. There were 348,426 mechanics.
- **Outline:** FAA-S-ACS-1 (effective 21 Sep 2022, about 495 K-codes), plus a companion guide.
- **Source:** AMT Handbooks -30B, -31B and -32B (2023), all public domain.
- **Existing decks:** GitHub search "aviation mechanic A&P test prep" returned 0 results.
- **Churn:** The practical test banks were revised in 2026 (ATCA, September 2026). The knowledge ACS has been stable since 2022.
- **Partners:** Part 147 schools, via the Airman Testing / Joint Service Aviation Maintenance Technician Certification Council (JSAMTCC) pages.

### 10. FAA Airline Transport Pilot Multiengine: 23/35
9,972 tests, 99.82% pass rate. ACS -11A. 181,742 ATPs. The near-100% pass rate reduces the need for study aids.

### 11–14. Smaller FAA tests (22 each unless noted)
2025 volumes and pass rates:

| Test | Tests in 2025 | Pass rate |
|---|---|---|
| Ground Instructor Advanced | 2,694 | 97.29% |
| Ground Instructor Instrument | 2,751 | 99.71% |
| Ground Instructor Basic | 41 | 70.73% |
| Private Pilot Helicopter | 939 | 89.88% |
| Aircraft Dispatcher | 1,410 | 82.41% |
| Inspection Authorization | 1,117 | 90.78% |
| Sport Pilot Airplane | 420 | 96.90% |

- **Sport Pilot scores 19**, because the MOSAIC-harmonised PTS take effect on 14 Sep 2026 (ATCA September 2026 special edition, faa_atca_sep.txt).
- **Cost:** All share the same public-domain handbooks, so each extra deck is cheap once the FAA pipeline exists.

### 15. EPA Section 608 Technician (Core + Types I/II/III/Universal): 27/35
- **Requirement:** Required for technicians handling refrigerants. "Section 608 Technician Certification credentials do not expire." Page last updated 23 Mar 2026 — https://www.epa.gov/section608/section-608-technician-certification (epa608.txt).
- **Outline:** The public topic outline is https://www.epa.gov/section608/test-topics, last updated 5 Dec 2025, with Core and Types 1–3 (epa608_topics.txt).
- **Question bank is not public.** 40 CFR 82 Subpart F, Appendix D: "A bank of test questions developed by the Administrator … The Administrator will release this bank of questions only to approved technician certification programs." Each test has "25 questions drawn from Group 1 and 25" from the technical group. The test is closed-book and proctored (ecfr40_part_82_subpart_F.txt).
- **EPA reuse terms:** "These documents may be freely distributed and used for non-commercial, scientific and educational purposes. Commercial use … may be protected" — https://www.epa.gov/web-policies-and-procedures/epa-disclaimers (epa_copyright.txt). A free, non-commercial site fits these terms.
- **Rules:** The CFR text itself is public domain.
- **Partners:** More than 80 approved certifying programs are listed, including trade schools, unions and ESCO. The page adds: "EPA does not review or approve any training preparatory programs or materials" (epa608_progs.txt).
- **Existing decks:** GitHub "EPA 608" returned 30 repos, mostly 2025–26, most with 0 stars. That signals demand but no dominant open deck.
- **Candidate numbers:** not verified.

### 16. FEMA ICS/NIMS (IS-100.c, IS-200.c, IS-700.b, IS-800.d): 27/35
- **Course list:** https://training.fema.gov/is/crslist.aspx (fema_is.txt). It lists 127 IS course codes. Last updated dates:

  | Course | Last updated |
  |---|---|
  | IS-100.c | 06/25/2018 |
  | IS-200.c | 06/03/2021 |
  | IS-700.b | 11/02/2018 |
  | IS-800.d | **09/01/2026** |
- **IS-100.c overview:** https://training.fema.gov/is/courseoverview.aspx?code=IS-100.c (fema_is100.txt). It gives course objectives, a 2-hour length and 0.2 CEUs. It has a "Take Final Exam Online" link (needs a FEMA SID) and "Download Classroom Materials".
- **Status:** There is an online final exam per course. The course material is a federal work. Exam items are not public (not verified whether they are released). The decks should come from course materials and the NIMS doctrine.
- **Demand:** Numbers not verified; the course is widely required for responders (not verified), so Demand is scored 3.
- **Existing decks:** GitHub "FEMA ICS 100 NIMS quiz" returned 0 results. The other 120+ IS courses are a long-tail expansion.

### 17. US citizenship civics test: 28/35 (not a certification)
- **Versions** (WebFetch summary of https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test, **not verified in raw text** because curl got 403):

  | Version | Applies to | Questions | Pass mark |
  |---|---|---|---|
  | 2008 test | N-400 filed before 20 Oct 2025 | 100 | 6 of 10 |
  | 2025 test | N-400 filed on or after 20 Oct 2025 | 128 | 12 of 20 |
- **Licence:** The list is a federal work (17 USC 105). Rules and Source are strong. Answers that depend on who holds office change over time; that dependence is inferred and not verified.
- **Existing decks:** GitHub UpmaxAutomation/us-citizenship-prep ("all 128 USCIS civics questions", 2026-04) and vforge (2026-05). Many commercial apps were assumed but not verified. The Gap is small.

### 18. OSHA Outreach 10/30: 24/35
- **Program:** "Students receive an OSHA 10-hour or 30-hour course completion card." "The Outreach Training Program provides basic safety and health information and education — it does not fulfill an employer's requirement to provide training under specific OSHA standards … this is a voluntary program." It is delivered by authorized trainers or online providers — https://www.osha.gov/training/outreach (osha_outreach.txt).
- **Source:** The underlying 29 CFR 1910/1926 standards are federal works. The course content belongs to trainers and providers. No national question bank exists.
- **Framing:** Treat it as a "safety standards" deck family (Construction, General Industry, Maritime), not exam prep.
- **Existing decks:** GitHub "OSHA 10 flashcards" returned 0 results.

### 19. DOT Hazmat employee training (49 CFR 172 Subpart H): 24/35
- **No national exam:** "A hazmat employer shall ensure that each of its hazmat employees is tested by appropriate means on the training subjects covered in § 172.704" (ecfr49_part_172_subpart_H.txt).
- **Source:** 49 CFR (public domain). The PHMSA training modules page returned 403.
- **Scope:** The deck would overlap with the CDL HazMat endorsement.

### 20. CDL General Knowledge and endorsements: 23/35
- **Federal knowledge requirement:** 49 CFR 383.111: "All CMV operators must have knowledge of the following 20 general areas" (ecfr49_383G.txt). This is public domain.
- **State manuals are AAMVA-copyrighted.** Texas CDL handbook: "COPYRIGHT © 2025 AAMVA. All rights reserved. … Permission to reproduce, use, distribute or sell this material has been granted to SDLAs only." — https://www.dps.texas.gov/internetforms/Forms/DL-7C.pdf (tx_cdl.txt). Rules score 2.
- **What we can do:** Write from 49 CFR, not from the manual.
- **Existing decks:** GitHub atupkalo claims "exact DMV questions" (2025). The market was assumed crowded; not verified.
- **Fetch failures:** FMCSA returned 403. The NY manual returned 403 and the California handbook URL returned 404.

### 21. ISED Canada Basic amateur qualification: 23/35
- **Terms:** "Unless otherwise specified, you may reproduce the materials in whole or in part for non-commercial purposes … without charge or further permission", with attribution. Commercial redistribution needs permission — https://ised-isde.canada.ca/site/ised/en/terms-and-conditions (ised_terms.txt).
- **Bank:** The practice exam generator is live at https://apc-cap.ic.gc.ca/pls/apc_anon/apeg_practice.practice_form (ised_gen.txt). The question-bank download page URL tried returned 404, so the bank file was not verified.
- **Existing decks:** Reddit "ISED basic amateur radio exam questions (July 2025) Anki deck" (2025-04-20) says ISED "recently published their latest (July 2025)" questions (rss_amateur.raw). GitHub fredlarochelle/Canada-Ham-Pool (JSON, 2022).

### 22. FCC GROL (Elements 1 + 3) and Marine Radio Operator Permit (Element 1): 22 and 20
- **Pools are public by rule:** 47 CFR 13.215: "Each question pool must contain at least five (5) times the number of questions required for a single examination. The FCC will issue public announcements detailing the questions in the pool for each element." Under 13.9, a GROL needs "Written Elements 1 and 3" and a Marine Radio Operator Permit needs "Written Element 1" (ecfr47_part_13.txt). The pools are therefore FCC-issued and public domain as federal works, but **the current pool documents were not fetched** (fcc.gov returned 403 and a guessed docs.fcc.gov ID returned 404). Source is scored 3 until they are found.
- **Existing decks:** GitHub "GROL element 3 FCC commercial" returned 0 results.
- **Demand:** Numbers not verified.

### 23. USCG OUPV / Master: 21/35
- **Exam subjects:** 46 CFR 11 Subpart I: "each applicant … must pass an examination on the appropriate subjects listed in this subpart." Tables in §11.910 list the deck-officer subjects (ecfr46_part_11_subpart_I.txt).
- **Question bank not verified:** National Maritime Center exam pages (dco.uscg.mil) returned 403 to both curl and WebFetch, and the Wayback Machine returned 404. **The public status of the NMC sample questions and question bank is not verified.** Source is scored 2 until it is.
- **Existing decks:** GitHub "coast guard captain license questions" and "OUPV captain exam" both returned 0 results.
- **Search:** "captain's license" is scored 4, but that is not verified.

### Looked at, not scored
- **EASA A1/A3 (EU drones):** The page confirms a "Proof of completion for online training" for the A1/A3 subcategory (easa_drone.txt). No open question bank was found.
- **UK CAA Flyer ID test:** The URL redirected to the general drones page (ukcaa_drone.txt). Nothing verified.
- **NRC and other agencies:** not researched in the time available.

## Notable empty niches (evidence of no open deck)
1. **FAA Aviation Mechanic G/A/P.** About 57,000 tests in 2025, with pass rates of 63–74%. Public-domain 2023 AMT handbooks plus the ACS. GitHub search found 0 repos.
2. **FAA IRA / CAX / CFI + FOI.** About 90,000 combined tests, with public-domain handbooks. Reddit keeps asking for up-to-date Anki decks. Only tiny GitHub projects exist.
3. **FEMA IS-100/200/700/800,** plus a long tail of 127 IS courses. Public-domain material. GitHub found 0 repos.
4. **FCC GROL / Element 1.** Pools are public by regulation (47 CFR 13.215). GitHub found 0 repos. The next step is to locate the current FCC pool public notices.
5. **USCG OUPV/Master.** GitHub found 0 repos, but the source status must be confirmed from a non-blocked network.
6. **Timing opening:** The FCC Technician pool changed on 1 Jul 2026, and the General pool will be replaced for 1 Jul 2027 (inferred from the 4-year rule). Refreshed public-domain decks will be scarce around these changes.
