# Candidates, second pass: the long tail of finance, securities, insurance, banking, compliance and tax exams

Researched 2026-09-24. This pass builds on `research/cert-decks/candidates/finance.md` (the first pass), which scored SIE, Series 7, 63, 65, 66, EA, CPA, CFP, FRM, CFA, CIA, CFE and others. Those scores are carried over here, not re-scored. Raw pages are in `scratchpad/candidates2/raw-fin/`. Text was extracted with `f.py` (curl + HTML-to-text) and PDFs with `pdftotext`. Every figure below comes from raw text I read. "Not verified" means I did not read it.

**Access notes.** finra.org answers 403 to scripted requests, so the FINRA exam pages come from Wayback Machine snapshots (mostly 2026-09-18). The snapshot date is given with each one. AnkiWeb search is still behind a login wall ("Please log in to perform more searches.", `ankiweb/series_24.pb`), and DuckDuckGo and Bing HTML search returned bot walls. **AnkiWeb supply for every exam in this report is therefore not verified.** Supply evidence comes from Brainscape subject pages, GitHub and the first pass. Reddit rate-limited most feeds (429), so the few that loaded are marked.

**Scores.** The scale is the first pass's: 1–5, higher is better for us, maximum 35. The criteria are Dem(and), Gap, S(ou)rc(e), Rules, Stab(ility), Part(nership) and Search. Several reports scored these, so treat totals within about 2 points of each other as ties. Because AnkiWeb could not be searched, I capped Gap at 4 unless another fact supported 5.

## Summary table

| # | Exam | Family | Version / status (verified) | Dem | Gap | Src | Rules | Stab | Part | Search | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| — | *Carried over:* EA SEE 29 · Series 7 28 · SIE 28 · Series 65 27 · Series 63/66 26 · CPA REG+TCP 25 | | see first pass | | | | | | | | |
| 1 | **NMLS SAFE MLO Test** | US consumer-finance regs | 120 items (115 scored); spec "As of April 5, 2021"; 53% first-time pass (to 31 Dec 2024) | 4 | 4 | 5 | 4 | 4 | 3 | 3 | **27** |
| 2 | **FINRA Series 24** | FINRA principal | 150 items, pass 70; outline © 2023 | 3 | 4 | 5 | 4 | 4 | 3 | 4 | **27** |
| 3 | **IRS VITA/TCE Link & Learn certification** (Basic/Advanced) | US tax (IRS pubs) | annual; six certification courses | 2 | 4 | 5 | 5 | 3 | 4 | 4 | **27** |
| 4 | **FINRA Series 9/10** | FINRA principal | S9 55 / S10 145 items, pass 70/70; outline © 2020 | 3 | 4 | 5 | 4 | 4 | 3 | 4 | **27** |
| 5 | **State insurance: Life & Health producer** (national general + state supplement) | State insurance | TX outlines effective 1 Sep 2026; FL effective 1 Jan 2026 | 5 | 4 | 4 | 4 | 3 | 3 | 3 | **26** |
| 6 | **FINRA Series 6** | FINRA rep | 50 items, pass 70; outline ©2020 | 3 | 4 | 5 | 4 | 4 | 3 | 3 | **26** |
| 7 | State insurance: Property & Casualty (incl. Personal Lines) | State insurance | TX 1 Sep 2026 | 4 | 4 | 4 | 4 | 3 | 3 | 3 | **25** |
| 8 | FINRA Series 4 | FINRA principal | 125 items, pass 72; © 2021 | 2 | 4 | 5 | 4 | 4 | 2 | 4 | **25** |
| 9 | FINRA Series 14 | FINRA principal | 110 items, pass 70; © 2021 | 1 | 5 | 5 | 4 | 4 | 2 | 4 | **25** |
| 10 | FINRA Series 26 | FINRA principal | 110 items, pass 70; © 2024 | 2 | 4 | 5 | 4 | 4 | 2 | 4 | **25** |
| 11 | FINRA Series 27 | FINRA FinOp | 145 items, pass 69; © 2024 | 2 | 4 | 5 | 4 | 4 | 2 | 4 | **25** |
| 12 | FINRA Series 57 | FINRA rep | 50 items, pass 70; © 2024 | 2 | 4 | 5 | 4 | 4 | 2 | 4 | **25** |
| 13 | FINRA Series 99 | FINRA rep | 50 items, pass 68; © 2020 | 2 | 4 | 5 | 4 | 4 | 2 | 4 | **25** |
| 14 | FINRA Series 79 | FINRA rep | 75 items, pass 73; outline © 2025 (2025-10 file) | 3 | 3 | 4 | 4 | 4 | 3 | 3 | **24** |
| 15 | FINRA Series 23 | FINRA principal | 100 items, pass 70; © 2023 | 1 | 4 | 5 | 4 | 4 | 2 | 4 | **24** |
| 16 | FINRA Series 22 | FINRA rep | 50 items, pass 70; © 2020 | 1 | 4 | 5 | 4 | 4 | 2 | 4 | **24** |
| 17 | FINRA Series 28 | FINRA FinOp | 95 items, pass 69; © 2024 | 1 | 4 | 5 | 4 | 4 | 2 | 4 | **24** |
| 18 | FINRA Series 39 | FINRA principal | 100 items, pass 70; © 2020 | 1 | 4 | 5 | 4 | 4 | 2 | 4 | **24** |
| 19 | FINRA Series 82 | FINRA rep | 50 items, pass 70; © 2020 | 1 | 4 | 5 | 4 | 4 | 2 | 4 | **24** |
| 20 | MSRB Series 52 | MSRB | 75 items, 70% | 2 | 4 | 5 | 3 | 4 | 2 | 4 | **24** |
| 21 | ABA CRCM | US consumer-finance regs | next window 1–19 Dec 2026 | 2 | 4 | 5 | 3 | 4 | 2 | 4 | **24** |
| 22 | IRS AFSP (AFTR course with test) | US tax | annual | 2 | 4 | 5 | 4 | 2 | 3 | 4 | **24** |
| 23 | FINRA Series 86/87 | FINRA rep | S86 85 / S87 50 items, pass 73/74; revised 2023 | 2 | 4 | 3 | 4 | 4 | 2 | 4 | **23** |
| 24 | NFA Series 3 | NFA/CFTC | 120 items, 70% | 2 | 4 | 4 | 3 | 4 | 2 | 4 | **23** |
| 25 | MSRB Series 50 / 54 / 53 | MSRB | 100 items each; 71% / 70% / 70% | 1 | 4 | 5 | 3 | 4 | 2 | 4 | **23** |
| 26 | FINRA Series 16 | FINRA principal | 2×50 items, pass 72/74 | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** |
| 27 | MSRB Series 51 | MSRB | 60 items, 70% | 1 | 4 | 5 | 3 | 4 | 1 | 4 | **22** |
| 28 | Joint Board Enrolled Actuary exams | US pension law | exam programme exists (IRS page); details not fetched | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** (provisional) |
| 29 | State insurance: adjuster licences | State insurance | TX All Lines adjuster | 2 | 4 | 4 | 4 | 3 | 2 | 3 | **22** |
| 30 | NFA Series 30 / 31 / 32 / 34 | NFA/CFTC | 35–50 items | 1 | 4 | 4 | 3 | 4 | 1 | 4 | **21** |
| 31 | ABA CAFP | AML | active | 1 | 4 | 4 | 3 | 3 | 2 | 4 | **21** |
| 32 | ACAMS CAMS | AML | 120 MCQ, 3.5 h; 65k+ certified | 4 | 2 | 3 | 3 | 3 | 2 | 3 | **20** |
| 33 | CISI (UK, e.g. regulation papers) | UK FCA | 40,000+ exams a year | 3 | 3 | 3 | 2 | 3 | 2 | 3 | **19** |
| 34 | CII (UK, R01-type regulation units) | UK FCA | not verified | 2 | 3 | 4 | 2 | 3 | 2 | 3 | **19** (provisional) |
| 35 | AFP CTP / FPAC | Treasury | 3-year recertification | 2 | 3 | 2 | 3 | 3 | 2 | 3 | **18** |
| — | FINRA Series 17 | — | **Retired 09/2018** (also Series 37/38/42/55/56/62/72) | | | | | | | | not scored |
| — | IRS ERPA | — | IRS ERPA page URL returns 404; status not verified | | | | | | | | not scored |
| — | NISM (India), CSI CSC / LLQP (Canada), ASIC exam (Australia), HKSI LE, CMFAS (Singapore) | national regulator exams | watchlist; see §12 | | | | | | | | not scored |

**Count:** 35 rows scored, covering 41 exams (the MSRB and NFA rows each group several). Six exams are carried over from the first pass. Six more are unscored or watchlist.

**Top 10 new (after the carried-over EA, SIE, Series 7 and NASAA decks):** NMLS SAFE MLO (27), Series 24 (27), VITA Link & Learn (27), Series 9/10 (27), Life & Health producer (26), Series 6 (26), P&C producer (25), then the 25-point FINRA group: Series 4, 14, 26, 27, 57 and 99.

### Deck families: build by shared source

| Family | Exams | Shared source (status) | Why a family |
|---|---|---|---|
| **FINRA/SEC core** | SIE, 7, 6, 22, 57, 79, 82, 86/87, 99 | FINRA rules, SEC rules under the '33/'34/'40 Acts, MSRB and Cboe rules. The statutes and CFR are public domain. FINRA's rulebook site is "non-commercial personal" use, so cards paraphrase and cite rule numbers. | All representative exams have the SIE as corequisite. One rule-atom bank tagged by exam feeds eight decks. |
| **FINRA principal** | 9/10, 23, 24, 26, 4, 14, 16, 39, 27, 28 | The same rules with a supervisory focus: FINRA 3110, 2210 and the like, plus SEC 15c3-1 and 15c3-3 for 27/28 | Series 23 is a subset of 9/10 plus 24. Series 27 and 28 share net-capital content. |
| **MSRB** | 50, 51, 52, 53, 54 | MSRB rules and the Exchange Act §15B. MSRB site terms were not fetched. | Small audiences, and every exam shares G-rules. |
| **NFA/CFTC** | 3, 30, 31, 32, 34 | The CEA, 17 CFR (public) and NFA rules (terms not fetched) | Series 3 is the parent; 30–34 are small add-ons. |
| **NASAA** (done) | 63, 65, 66 | The Uniform Securities Act and NASAA model rules | First pass |
| **US consumer-finance regs** | NMLS SAFE MLO, ABA CRCM (and the CAFP/AML part) | 12 CFR 1002/1003/1022/1024/1026 (Reg B, C, V, X, Z), GLBA, the BSA: all public domain | The NMLS outline and CRCM both rest on the same CFPB regulations. |
| **State insurance** | L&H, Life-only, Health, P&C, Personal Lines, adjuster, public adjuster, surplus lines | A national "General Knowledge" section plus a state supplement citing the state insurance code (public law) | One general deck plus 50+ state supplement decks: the biggest source of "hundreds of decks" in this area. |
| **US tax** | EA, CPA REG/TCP (done), VITA Link & Learn, AFSP AFTR | The IRC and IRS publications (public domain, 17 USC 105, per first pass) | One annual tax-year refresh serves four audiences. |
| **AML** | CAMS, CAFP, (CGSS) | FATF Recommendations (copyright terms not verified; site 403), the BSA (public) | The official CAMS package already includes flashcards, so it is the weakest gap. |
| **UK FCA** | CISI, CII | FCA Handbook, reusable under the **Open Government Licence v3.0** | A publishable source, but body rules and demand are unclear. |

---

## Evidence

### 0. Which FINRA exams are current (answers "check which are current")
The FINRA Qualification Exams index (Wayback snapshot 20260918184435 of https://www.finra.org/registration-exams-ce/qualification-exams; raw `web_archive_org_web_2026_https_www_finra_org_registration_exams_ce_qualification_exams.txt`) lists these current exams, with duration, questions and cost:
- **SIE:** 75 questions, $100.
- **Representative level:**
  - Series 6: 50 questions, $100
  - Series 7: 125 questions, $395
  - Series 22: 50 questions, $100
  - Series 57: 50 questions, $105
  - Series 79: 75 questions, $395
  - Series 82: 50 questions, $100
  - Series 86/87: 85 and 50 questions, $295 and $195
  - Series 99: 50 questions, $100
- **Principal level:**
  - Series 4: 125 questions, $200
  - Series 9/10: 55 and 145 questions, $175 and $235
  - Series 14: 110 questions, **$450** (the Series 14 page itself says **$350**, so the two pages disagree)
  - Series 16: 50 + 50 questions, $325
  - Series 23: 100 questions, $135
  - Series 24: 150 questions, $235
  - Series 26: 110 questions, $200
  - Series 27: 145 questions, $235
  - Series 28: 95 questions, $195
  - Series 39: 100 questions, $200
- **MSRB:**
  - Series 50: 100 questions, $265
  - Series 51: 60 questions, $255
  - Series 52: 75 questions, $260
  - Series 53: 100 questions, $265
  - Series 54: 100 questions, $265
- **NFA:**
  - Series 3: 120 questions, $140
  - Series 30: 50 questions, $90
  - Series 31: 45 questions, $90
  - Series 32: 35 questions, $90
  - Series 34: 40 questions, $90
- **NASAA:**
  - Series 63: 60 questions, $147
  - Series 65: 130 questions, $187
  - Series 66: 100 questions, $177

**Series 17 is retired.** The "Effective Dates of Qualification Exams" page (snapshot 20260314230603, `..._effective_dates.txt`) lists under Retired Exams: "Series 17 - United Kingdom Securities Representative Exam | 09/2018". It gives the same 09/2018 date for Series 37, 38, 42, 62 and 72, and 01/4/2016 for Series 55 and 56. The Series 17 page URL returns 404 in the archive.

### 1. FINRA per-exam records (FINRA/SEC core and principal families)
Sources: the "AT A GLANCE" block on each exam page, e.g. `web_archive_org_web_2026_https_www_finra_org_registration_exams_ce_qualification_exams_series24.txt` (https://www.finra.org/registration-exams-ce/qualification-exams/series24). Content outline PDFs were fetched from `web.archive.org/web/2026id_/https://www.finra.org/sites/default/files/<file>.pdf` into `raw-fin/outlines/`. The copyright year is from the PDF text. "Rule refs" counts occurrences of "FINRA/MSRB/SEC/Cboe/NYSE Rule" in the outline, as a rough measure of how rule-dense it is.

| Exam | Items / pass | Corequisite (per page) | Effective since | Outline © | Pages / rule refs | Brainscape user collections* |
|---|---|---|---|---|---|---|
| 6 | 50 / 70 | SIE | 08/1980 | ©2020 | 12 / 27 | Brainscape Certified Series 6, 186 learners (first pass) |
| 9/10 | 55 / 70; 145 / 70 | SIE + Series 7 | 09/1981 | © 2020 | 29 / 65 | S9: 10; S10: 15 |
| 4 | 125 / 72 | SIE + Series 7 | 04/1975 | © 2021 | 24 / 48 | 8 |
| 14 | 110 / 70 | None | 09/1989 | © 2021 | 14 / 90 | 2 |
| 16 | 50 / 72; 50 / 74 | None | 01/1965 | not fetched | – | not checked |
| 22 | 50 / 70 | SIE | 08/1980 | © 2020 | 12 / 22 | 2 |
| 23 | 100 / 70 | SIE + S7 + S9/10 | 07/2003 | © 2023 | 30 / 23 | not checked |
| 24 | 150 / 70 | SIE + S7, S57, S79, S82, S86/87 or S16 | 01/1979 | © 2023 | 30 / 22 | **48** (e.g. "Series 24 Group Share") |
| 26 | 110 / 70 | SIE + S6 or S7 | 06/1979 | © 2024 | 19 / 19 | 3 |
| 27 | 145 / 69 | None | 01/1979 | © 2024 | 22 / 17 | 14 |
| 28 | 95 / 69 | None | 01/1990 | © 2024 | 19 / 15 | not checked |
| 39 | 100 / 70 | SIE + S7 or S22 | 06/1979 | © 2020 | 24 / 58 | not checked |
| 57 | 50 / 70 | SIE | 01/2016 | © 2024 | 11 / 28 | 1 |
| 79 | 75 / 73 | SIE | 11/2009 | © 2025 | 15 / 19 | Brainscape Certified "Series 79 Top-Off", 1,057 learners (first pass) |
| 82 | 50 / 70 | SIE | 05/2001 | © 2020 | 9 / 18 | not checked |
| 86/87 | 85 / 73; 50 / 74 | SIE | 03/01/2004 | "Revised" 2023-03 file (PDF fetch failed) | – | not checked |
| 99 | 50 / 68 | SIE | 10/2011 | © 2020 | 9 / 19 | 5 |

\*Counts are the "User-Generated Flashcards (N)" figure on https://www.brainscape.com/subjects/series-N (raw `www_brainscape_com_subjects_series_*.txt`). Every one of these pages shows "Brainscape Certified Flashcards (0)". Brainscape's subject matching is loose, so treat the counts as an order of magnitude only. https://www.brainscape.com/subjects/finra shows 15 user collections, the first being "FINRA Series 3 Exam Prep".

- **Candidates:** FINRA publishes no candidate volumes on these pages (the first pass also found none in FINRA's 2025 snapshot).
- **Existing decks:** AnkiWeb not verified (login wall). GitHub "finra anki" and "series 7 exam flashcards" return 0 repos (`gh_search.txt`). UniPrep2Go sells Series 6 and 79 decks (120 cards, $29 each), and Brainscape Certified covers 6 and 79 (first pass). No certified or paid deck was seen for 24, 9/10, 4, 14, 22, 23, 26, 27, 28, 39, 57, 82, 86/87 or 99.
- **Public outline and primary sources:** every exam has a public outline that lists rules by number. The principal outlines (4, 9/10, 23, 24, 26, 27, 28) carry a REFERENCES section saying: "Candidates are encouraged to refer to the SRO websites for information memos or Regulatory Notices concerning amendments to rules and the announcement of new rules that may relate to the exam. Candidates can purchase copies of federal securities laws and SEC rules through the network of federal government printing offices" (`outlines/Series_24_Outline.txt`). The Series 24 outline cites the Securities Exchange Act 21 times, the Securities Act of 1933 8 times, and Regulation S, M, SHO, NMS and T, Rule 144, 15c3-3 and 10b5-1.
- **Rules:** FINRA site terms allow "ONLY … non-commercial personal or professional use", and works "may not be copied, reproduced … distributed" (first pass, `prior_finra_terms_of_use.txt`). So cards cite rule numbers and paraphrase; FINRA text is never pasted. The statutes and SEC CFR are public domain. No FINRA restriction on third-party prep was found.
- **Churn:** outlines are dated 2020–2025. Series 79 got a new outline file in 2025-10. The FINRA index's notice list shows Series 86/87 revised by Regulatory Notice 23-05 (20 Mar 2023), 9/10 by RN 16-02, and 27/28 by RN 15-39. Rule changes (the first pass cites T+1) matter more than outline changes.
- **Partners:** firm compliance and training departments; the prep companies behind Brainscape (Knopman Marks, per the first pass).
- **Demand signal:** r/Series7 search "series 24" returned 54 posts, 0 deck-titled (e.g. "3 FINRA and 2 NASAA Tests taken down in 5 months" 2024-05-29; "Series 24" 2021-03-12) (`rss/rss_Series7_series%2024.xml`). r/FinancialCareers "series 24 flashcards" returned 76 results, 0 deck-titled.
- **Score reasons:** Source is 5 throughout, because the content is rules. Rules 4 (paraphrase needed). Stability 4. Search 4 wherever no certified or paid product was seen. Demand ranges from 1 (Series 14, 22, 23, 28, 39, 82: tiny, specialised audiences) to 3 (Series 24, 9/10, 6, 79). Series 16 and 86 score Source 3 because Series 16 Part 2 and Series 86 test analysis and valuation more than rules.

### 2. MSRB Series 50–54 and NFA Series 3, 30–34
- FINRA pages (same snapshot set) give:
  - Series 50: 100 items, 71%, no corequisite, 09/2016
  - Series 51: 60 items, 70%, S24 or S26, 01/2003
  - Series 52: 75 items, 70%, SIE, 11/1978
  - Series 53: 100 items, 70%, "SIE + S52TO", 02/1980
  - Series 54: 100 items, 70%, Series 50, 11/2019
  - Series 3: 120 items, 70%, 1966
  - Series 30: 50 items, 03/1993
  - Series 31: 45 items, 03/1993
  - Series 32: 35 items, 12/1994
  - Series 34: 40 items, 09/2008
- The msrb.org outline URL tried returned 404, and the NFA proficiency page returned an 869-character JS shell. **MSRB and NFA outlines and site terms were not fetched.** Rules is therefore 3.
- Brainscape user collections: Series 3: 28; Series 50: 3; Series 52: 2.
- Primary law (the Exchange Act §15B and the CEA with 17 CFR) is public; that is general knowledge, not a page I fetched.

### 3. NMLS SAFE Mortgage Loan Originator Test, total 27
- **Version:** "As of April 5, 2021, the SAFE Mortgage Loan Originator Test consists of … National Test 120 total; 115 scored, 190 minutes … $110." The Act "requires all MLOs seeking state licensure to pass the NMLS-developed SAFE Mortgage Loan Originator Test with a score of 75% or better" (MLO Testing Handbook §1, https://mortgage.nationwidelicensingsystem.org/knowledge/products/nmls/pubs/testingHbk/education/mlo_testing/mlo_test_guide/mlo_testing_hbk_intro-1.html, raw `mortgage_…intro_1_html_77c8d7.txt`).
- **Candidates:** not published. The pass rate is: "As of December 31, 2024 the first-time pass rate for the SAFE MLO Test is 53%" (`…testPerformanceData_html_a90b7b.txt`).
- **Outline (public):** Federal Mortgage Related Laws 24%, Uniform State Content 11%, General Mortgage Knowledge 20%, Mortgage Loan Origination Activities 27%, Ethics 18%. The outline names RESPA (12 CFR 1024), ECOA (12 CFR 1002), TILA (12 CFR 1026, including HOEPA 1026.32, HPML 1026.35, LO compensation 1026.36(d) and TRID), HMDA (1003), FCRA (1022), GLBA (1016, 16 CFR 313), the Red Flags rule (16 CFR 681), TSR (16 CFR 310), the TCPA (47 CFR 64.1200), the BSA (31 CFR 1029.320), MAP (1014) and SAFE (1008) (`…testOutline_1_html_47fa75.txt`). **All of this is federal regulation, and so public domain.**
- **Churn:** "Legislative changes may occur throughout the test administration cycle. Candidates should answer test questions based on the current statutes … Candidates are responsible for keeping abreast of changes." The spec has been unchanged since April 2021.
- **Rules:** the candidate agreement says "The SAFE MLO Test is a confidential, copyrighted test, and you cannot share" and "you agree that you will not discuss or share with anyone any information about the" test (`…candidateAgreement_1_html_5a0408.txt`). That binds test-takers, not independent content. NMLS site terms were not read.
- **Existing decks:** Brainscape https://www.brainscape.com/subjects/nmls shows 77 user collections, "safe-mlo" 14 and "mortgage-loan-originator" 10, with 0 Certified. GitHub has seang1121/Loan-Officer-Exam-Prep-Study-Guide ("NMLS SAFE MLO exam prep — … flashcards, practice tests", 1 star, created 2026-02-19). AnkiWeb not verified.
- **Demand:** r/loanoriginators "flashcards" returned 7 results, 1 deck-titled ("Brainscape??" 2025-03-25). NMLS lists state PE/CE requirements for every state, and NMLS-approved education providers are the partner channel (testing handbook index).
- **Why Demand is 4:** licensure is mandatory for every state-licensed MLO, the 53% pass rate means candidates need help, and there are 100+ user collections. The count is still not verified.

### 4. State insurance producer licensing (Life & Health 26, P&C 25, adjusters 22)
- **Volume (verified, Texas only):** *Texas Department of Insurance Examination Pass Rates: January-December 2025* (https://www.pearsonvue.com/content/dam/VUE/vue/en/documents/clients/tx-insurance/2025-summary.pdf, `ins/tx2025.txt`):

| Exam | Graded | First-time pass rate |
|---|---|---|
| General Lines – Life, Accident and Health (English) | 42,566 | 57% |
| General Lines – Life, Accident and Health (Spanish) | 4,488 | 34% |
| Life Agent (English) | 33,620 | 47% |
| Life Agent (Spanish) | 5,856 | 24% |
| General Lines – P&C (English) | 19,789 | 59% |
| Personal Lines P&C (English) | 7,219 | 66% |
| Limited Lines (English) | 2,946 | not recorded |
| Adjuster – All Lines (English) | 628 | 42% |
| Public Insurance Adjuster (English) | 402 | not recorded |

  **One state alone graded more than 100,000 life/health and P&C exams in 2025.** This is by far the largest verified volume in this report. Other states were not fetched.
- **Structure (TX outlines, effective 1 Sep 2026, #124401):**

| Section | Scoreable questions | Pretest questions |
|---|---|---|
| Life general knowledge | 50 | 5 |
| Life state-specific | 30 | 5 |
| L&H general knowledge | 100 | 10 |
| L&H state-specific | 30 | 5 |
| P&C general knowledge | 100 | 10 |
| P&C state-specific | 30 | 5 |
| Personal Lines general | 75 | 5 |
| Personal Lines state | 25 | 5 |

  Other exams: Surplus Lines 60, Risk Manager 100, MGA 150. State sections cite the statute, e.g. "Ref.: TIC 4001.252", "TIC 541.056; 1702.102", "TAC § 4.621". The outline says "All references are to the Texas Insurance Code (TIC) or the Texas Administrative Code (TAC), Title 28" (`ins/124400.txt`). Florida's outlines (effective 1 Jan 2026, #121003) have the same GENERAL KNOWLEDGE / "FLORIDA STATUTES, RULES, AND REGULATIONS" split (`ins/fl.txt`).
- **How state law varies:** each state's supplement cites its own code (TIC/TAC for TX, Florida Statutes for FL), and states change outlines on their own dates (TX 1 Sep 2026, FL 1 Jan 2026). The general knowledge sections appear to follow a common Pearson VUE pattern, but I compared only TX and FL headings, **so "identical nationally" is not verified.** PSI (e.g. California) and Prometric states were not fetched (PSI bulletin returned 49 chars; prometric.com returned 403).
- **Rules:** "All examination questions … are copyrighted and are the property of Pearson VUE … any distribution of the examination content … is strictly prohibited." The handbook also says: "These content outlines are provided to publishers of study materials and to state-approved education providers for their use in developing and updating their educational materials" (TX handbook #124400, October 2024, modified 2026-09-04). **Third-party study material is expected.** State statutes are public law. Some states assert copyright in their annotated codes; not checked.
- **Supply:** Brainscape subject pages show user collections: insurance 1,263; life-insurance 309; health-insurance 145; insurance-exam 112; property-and-casualty 104; life-and-health 98; insurance-license 37. None is Certified. GitHub has 2 repos, both 0-star commercial or shell projects from July 2026. AnkiWeb not verified. Reddit r/Insurance "anki" returned a valid empty feed; r/InsuranceAgent was not fetched (429).
- **Scores:** Demand 5 for L&H and 4 for P&C (TX volumes). Source 4: the general knowledge part is insurance concepts, not law, but the state part is statute. Stability 3: 50+ jurisdictions each revise on their own. Partners are pre-licensing schools and agency recruiters. **Maintenance cost is the main risk: a general deck plus one supplement per state means 50+ supplements to keep current.**

### 5. IRS VITA/TCE Link & Learn certification, total 27 (demand thin)
- "Link & Learn Taxes is the web-based program providing six certification courses for volunteers and a refresher course" (https://www.irs.gov/individuals/link-learn-taxes, `www_irs_gov_individuals_link_learn_taxes.txt`). The levels are Basic, Advanced, Military and International, plus a "Federal tax law update test for Circular 230 professionals".
- Volume: "you will join the thousands of others who each year prepare millions of tax returns at thousands of tax sites" (https://www.irs.gov/individuals/irs-tax-volunteers). No exact count.
- Sources are IRS training materials, which are US Government works and public domain (17 USC 105, per first pass). Which publications they are was **not verified in this pass.**
- Churn is annual, with the tax-year refresh shared with EA and REG. Partners: VITA sponsoring organisations and university tax clinics. Supply and search were not checked (no search quota). Treat this as an add-on to the EA and REG family.

### 6. IRS AFSP, total 24
- "18 hours of continuing education, including a six hour federal tax law refresher course with test … consent to adhere to … Circular 230, Subpart B." Those who pass get an "Annual Filing Season Program – Record of Completion" (https://www.irs.gov/tax-professionals/annual-filing-season-program).
- The AFTR test is given by CE providers. The IRS AFTR outline and participant numbers were not fetched. Churn is annual.

### 7. Enrolled Actuary (Joint Board), provisional 22; ERPA not scored
- The IRS page https://www.irs.gov/tax-professionals/enrolled-actuaries lists "Joint Board Examination program" but no exam details were read.
- https://www.irs.gov/tax-professionals/enrolled-retirement-plan-agents returned 404, so ERPA status is not verified.
- Better handled with the actuarial family (see `candidates/data-actuarial-health.md`).

### 8. ACAMS CAMS, total 20
- "120k+ Dedicated ACAMS members working in AFC" and "65k+ CAMS-certified members, to date."
- "The CAMS exam consists of 120 multiple-choice questions … timed … 3.5 hours."
- **The package includes "Flashcards"**, a "Study Guide (PDF)" and an "Exam simulator … 1,000+ questions". The listed price is "CAMS Certification Exam US$2,095".
- Membership is required, and candidates need 40 eligibility credits.
- Source: Wayback snapshot 20260911151142 of https://www.acams.org/en/certifications/cams-certification; the live site returned 403.
- **Official flashcards come with the package, so Gap is 2.**
- FATF Recommendations pages returned 403 and have no archive copy, so FATF copyright terms are **not verified**. BSA statutes and regulations are public.
- Brainscape "cams" shows 26 user collections and "aml" 29; the matching is loose.

### 9. ABA CRCM (24) and CAFP (21)
- CRCM: "Next Exam Date: December 1 - 19, 2026" (https://www.aba.com/training-events/certifications/certified-regulatory-compliance-manager).
- CAFP: testing at "Meazure Learning's U.S. test sites or via … ProctorU" (https://www.aba.com/training-events/certifications/certified-aml-and-fraud-professional).
- Content outlines, holder counts and ABA terms were not fetched.
- Brainscape "crcm" shows 14 user collections.
- CRCM's subject matter (consumer-compliance regulations) overlaps heavily with the NMLS federal section, which is public CFR. That is why Source is 5 and Rules 3.

### 10. AFP CTP / FPAC, total 18
- https://www.afponline.org/certification covers only recertification: 36 (CTP) or 45 (FPAC) credits over three years. The CTP page returned 500 and 404.
- The exam source is proprietary AFP study material (the "Essentials" name is not verified here).
- Brainscape "ctp" shows 44 user collections; the matching is loose.

### 11. UK: CISI (19) and CII (19, provisional): notes on sources and licences
- **CISI:** "Each year, candidates take over 40,000 CISI exams in more than 80 countries." CISI sells workbooks and "Revision Express" (https://www.cisi.org/cisiweb2/cisi-website/study-with-us). The first pass found that CISI's exam regulations call exam content "copyright material that belongs to CISI" and forbid disclosure.
- **FCA Handbook licence (key finding):** "Content from the FCA Handbook can be reproduced and adapted in accordance with the Open Government Licence v3.0 and our Handbook Terms and Conditions" (https://www.fca.org.uk/legal, `www_fca_org_uk_legal.txt`). UK regulation-paper cards (CISI UK Financial Regulation, CII R01) can therefore quote the FCA Handbook with attribution.
- **CII:** https://www.cii.co.uk/qualifications/ returned only a navigation shell. Unit list, volumes and terms are not verified.

### 12. Watchlist: other national regulator exams (not scored)
- **India, NISM:** a live page (https://www.nism.ac.in/) shows constant SEBI-driven launches: "Launch of NISM-Series-V-D … w.e.f. July 22, 2026"; "NISM-Series-XXV-B … dated June 24, 2026"; "NISM Series XV: Research Analyst … December 05, 2025". High churn. Volumes and workbook licence not verified. It is a large market, but it needs its own pass.
- **Canada, CSI CSC:** the page was fetched but had navigation only. LLQP was not fetched.
- **Australia, ASIC financial adviser exam:** the URL returned 404 (page moved). Not verified.
- **Hong Kong, HKSI LE; Singapore, CMFAS:** URLs returned 404. Not verified.

## Notable empty niches
1. **State insurance producer exams.** Texas alone graded more than 100,000 exams in 2025. Brainscape has only user-made decks (0 Certified), and GitHub shows nothing substantial. The state sections cite public statutes, and Pearson VUE says outlines are provided to study-material publishers. This is the largest untapped volume found in this area. AnkiWeb could not be checked.
2. **NMLS SAFE MLO.** Mandatory for state-licensed MLOs, 53% first-time pass rate, the outline is entirely federal CFR, and there is no certified or official flashcard product.
3. **FINRA principal exams (24, 9/10, 4, 14, 26, 27).** No Brainscape Certified deck and no UniPrep2Go deck. One FINRA/SEC rule bank would feed them all.
4. **FCA Handbook under OGL.** A quotable UK regulatory source; the main uncertainties are body rules (CISI) and demand.

## Gaps and caveats
- AnkiWeb search is behind a login wall and HTML search engines returned bot walls, so **Gap scores rest on Brainscape, GitHub and first-pass AnkiWeb IDs only.**
- Reddit returned 429 for r/InsuranceAgent and r/AML (CAMS); both are not fetched.
- Not fetched: MSRB, NFA, NASAA, NMLS, ABA, ACAMS and AFP site terms; FATF licence; PSI/Prometric state bulletins; CII pages; the Series 16 and 86/87 outline PDFs.
- No FINRA, NMLS or NASAA candidate volumes were found. Texas insurance is the only verified volume.
