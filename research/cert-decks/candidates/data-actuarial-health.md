# Candidate certifications: data/AI, actuarial, non-licensure healthcare and other professional

*Researched 2026-09-24. Scores are 1–5 on seven criteria (max 35).*

**How this was sourced.**
- Every fact below was read in the raw text of a page fetched during this task (curl plus text extraction, or `pdftotext` for PDFs). Copies are in `scratchpad/candidates/raw-dah/`. File names are the URL with non-alphanumerics replaced by `_`.
- AnkiWeb deck data (note count, last update, thumbs up/down) comes from AnkiWeb's `svc/shared/item-info` endpoint. Decoded files are in `raw-dah/ankiweb/`. AnkiWeb's anonymous deck search worked once ("PTCB") and then returned "Please log in to perform more searches."
- Reddit data comes from subreddit search RSS feeds in `raw-dah/rss/`, analysed with `rss/analyze.py`, which counts titles containing anki, flashcard or deck. Reddit rate-limited this session heavily (HTTP 429), so some feeds were never retrieved and are marked as such.
- Subreddit sizes come from reddapi.dev (`raw-dah/reddapi/`), an aggregator that gives no snapshot date, so treat them as approximate.
- "Search" rows are the result lists from Claude's WebSearch tool (US-only, **not Google**), recorded in `raw-dah/websearch_log.md`. "Seen in results only" means I saw the URL but did not open the page. The session's WebSearch budget ran out partway through.
- Reused without refetching: the Brainscape learner counts from `size-demand.md` (I also refetched https://www.brainscape.com/learn as `raw-dah/www_brainscape_com_learn.txt`), and the trademark and doc-licence findings for Microsoft and Google in `rules-risks.md`.
- **"Not verified"** means the page blocked me, or the figure appeared only in a search snippet.

---

## Summary table

| # | Certification | Demand | Gap | Source-ability | Rules-safety | Stability | Partner-ship | Search-winnability | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **SOA Exam P** (Probability; CAS accepts it for Exam 1) | 3 | 3 | 4 | 4 | 5 | 4 | 3 | **26** |
| 2 | **NREMT EMT** (cognitive exam) | 5 | 4 | 2 | 3 | 4 | 4 | 3 | **25** |
| 3 | **SOA Exam FM** (Financial Mathematics; CAS Exam 2) | 3 | 3 | 4 | 4 | 4 | 4 | 3 | **25** |
| 4 | **PTCB CPhT** (PTCE) | 3 | 4 | 4 | 2 | 4 | 3 | 3 | **23** |
| 5 | **Microsoft PL-300** (Power BI Data Analyst) | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** |
| 6 | NREMT Paramedic | 5 | 2 | 2 | 3 | 4 | 4 | 2 | **22** |
| 7 | ServSafe Manager (Food Protection Manager) | 2 | 3 | 5 | 3 | 3 | 3 | 2 | **21** |
| 8 | WSET Level 2 / Level 3 Award in Wines | 5 | 2 | 2 | 3 | 4 | 3 | 2 | **21** |
| 9 | Tableau (Salesforce Certified Tableau Data Analyst / Desktop Foundations) | 2 | 4 | 3 | 3 | 2 | 2 | 4 | **20** |
| 10 | AAMA CMA (medical assistant); lightly researched | 3 | 3 | 2 | 3 | 3 | 3 | 3 | **20** |
| 11 | Real-estate salesperson licence (state exams); lightly researched | 3 | 3 | 3 | 3 | 3 | 2 | 2 | **19** |
| 12 | AAPC CPC (medical coding) | 3 | 4 | 1 | 2 | 2 | 3 | 3 | **18** |
| 13 | AHIMA CCS | 2 | 4 | 2 | 3 | 2 | 2 | 3 | **18** |
| 14 | NASM CPT | 4 | 3 | 1 | 3 | 3 | 2 | 2 | **18** |
| 15 | ACE Personal Trainer | 3 | 3 | 1 | 3 | 3 | 2 | 2 | **17** |
| 16 | Google Data Analytics Professional Certificate | 2 | 3 | 2 | 3 | 2 | 2 | 3 | **17** |
| 17 | NSCA CSCS; lightly researched | 2 | 3 | 1 | 3 | 3 | 2 | 2 | **16** |
| 18 | IBM Data Science Professional Certificate | 1 | 3 | 2 | 3 | 2 | 2 | 3 | **16** |

AI-focused cloud certificates (AWS AI Practitioner, Google Generative AI Leader, Azure AI) are left to the cloud agent. Nothing seen here made them distinctive. Brainscape's AWS AI Practitioner deck has 555 learners (`size-demand.md`), and Microsoft retired AI-102 and AI-900 in 2026 (`size-demand.md` §5).

**How to read the scores.** The actuarial exams score well because their sources, rules and stability are clean, not because demand is huge. The healthcare certifications have the demand, but most of their content comes from copyrighted textbooks or code sets. The one exception is the PTCE, whose outline maps onto federal law and FDA material.

---

## 1. SOA Exam P (Probability) — 26

**1. Volume.** SOA publishes each sitting's results with a count of candidates:

| Sitting | Candidates | Passed | Pass rate |
|---|---|---|---|
| January 2026 | 2,363 | 1,163 | 49.2% |
| March 2026 | 2,117 | 978 | 46.2% |
| May 2026 | 1,952 | 873 | 44.7% |

Sources: `edu-2026-01-p-percents-kfasvrdo.pdf`, `-03-p-percents-adt9brfb.pdf`, `-05-p-percents-9jvtxwa1.pdf` (https://www.soa.org/globalassets/assets/files/exam-results/2026/…), linked from https://www.soa.org/education/exam-results/. Exam P sittings in odd-numbered months run to about 2,000 candidates each. I did not verify the number of sittings per year, but application forms exist for September 2026, November 2026 and January 2027. The CAS co-sponsors the exam: the result PDFs list "Casualty Actuarial Society" among the sponsoring organisations.

**2. Deck demand.**
- r/actuary has about 75,462 members (reddapi.dev).
- The r/actuary `anki` RSS returned 41 posts, 23 of them deck-titled. Most concern memory-heavy upper exams: "Exam 6U Anki flashcards" (2026-03-14), "Anki for Exam 6U", "MAS-I flashcards + general advice", "Anki for LTAM exam", "TIA in Anki" (2026-02-11), "If FSA exams are so qualitative and memory based why not just crank Anki 24/7?" (2026-02-04).
- Only one is about P: "Exam P Flashcards" (2025-05-18, https://www.reddit.com/r/actuary/comments/1kpsz7x/exam_p_flashcards/). The poster "created an Anki Deck for Exam P formulas". The linked deck (AnkiWeb 210224639) now returns "not available".
- Several posts ask how to move paid provider flashcards into Anki: "Importing TIA flashcards into Anki?", "Converting Bedford flashcards into anki", "Anki VS TIA Flashcards App".
- Brainscape has no Certified Exam P deck in its catalogue (`www_brainscape_com_learn.txt`).
- The `flashcards` RSS returned 100 results, 19 deck-titled, again mostly FSA-level (§Reddit status).

**3. Existing supply.**
- **AnkiWeb 334660848**, "Probability for SOA Exam P / CAS Exam I": 365 notes, last updated 2017-09-26, +1/-0. Its description says it covers "terminology, formulas, and important concepts".
- **GitHub** lathaniel/anki-actuary, "Open Source Anki Decks for Actuarial Exams": 1 star, updated 2025-10-02. Its README describes a planned YAML-per-exam layout (`raw-dah/github_search_notes.txt`, `anki_actuary_readme.md`).
- **Paid:**
  - ACTEX "140+ expertly written flashcards, aligned directly with Exam P syllabus topics" (https://www.actexlearning.com/exams/p/exam-p-flashcards). The price is not in the raw text.
  - Coaching Actuaries and The Infinite Actuary include flashcards in their programmes (SOA provider list, below).
- **Free:** SOA's own provider list says The Actuarial Nexus offers "P & FM (FREE and comprehensive materials): Study manual, flashcards, practice questions, mock exams, AI tools" (https://www.soa.org/education/exam-req/resources/edu-txt-manuals/). The Nexus site itself returned a Vercel bot check, so its card count is **not verified**.

**4. Official flashcards.** None. SOA offers a free "Online Sample P Exam" ("Available at no cost") at https://www.soa.org/education/exam-req/syllabus-study-materials/edu-exam-p-online-sample/.

**5. Sources.**
- The syllabus PDF is public, with weighted learning outcomes: General Probability 23–30%, Univariate Random Variables 44–50%, Multivariate Random Variables 23–30% (https://www.soa.org/globalassets/assets/files/edu/2027/spring/syllabi/2027-01-exam-p-syllabus.pdf).
- "There is no required text for this exam." The suggested textbooks (Ross, Wackerly, Hassett, Hogg) are commercial.
- SOA's study note P-21-05 "Risk and Insurance" is "Copyright 2005 by the Society of Actuaries".
- The content is standard probability, so cards can be written in original wording against the learning outcomes.

**6. Rules.**
- "The contents of Actuarial Exams are copyrighted, proprietary, and confidential. Disclosure or reproduction of any portion of an Actuarial Exam … is prohibited" (https://www.soa.org/education/exam-req/exam-day-info/edu-confidentiality-discipline/).
- SOA lists third-party providers and says "None of these services are sponsored or endorsed by the Society" (edu-txt-manuals).
- No bar on independent study material was seen. The SOA trademark policy was **not checked**.

**7. Churn.**
- "Updates - Exam P: There are currently no updates" (https://www.soa.org/education/exam-req/syllabus-study-materials/edu-updates-exam-p/).
- Syllabi are reissued for each sitting window (Sept 2026, Nov 2026, Jan 2027). I did not diff them.
- The 2017 AnkiWeb deck's author says the material "doesn't change much over time". That is the author's claim.

**8. Partnerships.** SOA's page lists the providers: ACTEX, Actuarial Bookstore, ASM, Coaching Actuaries, The Infinite Actuary, **The Actuarial Nexus (free)** and others. SOA also runs the UCAP and CAE university programmes and actuarial clubs (navigation on soa.org). The free Nexus is a natural partner or competitor.

**9. Search.**
- "SOA Exam P anki deck": the AnkiWeb 2017 deck is #1, the GitHub repo #2, then ACTEX flashcards.
- "Exam P flashcards": Quizlet, studymanuals.com, The Infinite Actuary, a 2012 BPP sample PDF, CogniGuide AI, the AnkiWeb deck, The Actuarial Nexus.
- The leading free Anki deck is from 2017, so the query is winnable.

**Scores.**
- **Demand 3:** about 2,000 candidates per sitting, but Anki talk in r/actuary centres on the upper exams (1 P post among 23).
- **Gap 3:** the only free Anki deck is from 2017, but free Nexus flashcards exist and paid providers bundle cards.
- **Sourceability 4:** public weighted outcomes and a free SOA sample exam; the textbooks are copyrighted, but the maths is standard.
- **Rules-safety 4:** SOA forbids reproducing exam content and nothing else seen restricts independent decks; trademark policy unchecked.
- **Stability 5:** "no updates" page, stable topic weights.
- **Partnership 4:** SOA publicly lists providers, including a free one, plus university programmes.
- **Search-winnability 3:** a stale AnkiWeb deck ranks first for the Anki query; the "flashcards" query is crowded.

---

## 2. NREMT EMT — 25

**1. Volume.** "Nationally Certified EMS Clinicians by Certification": **EMT 423,988 (67.5%)**, Paramedic 155,005, AEMT 31,565, EMR 17,996, total 628,554 ("data updated daily") (https://www.nremt.org/maps, `www_nremt_org_maps.txt`). Only the 2011 annual table was in the static HTML (EMT tested that year: 77,218), so current annual tester numbers are **not verified**.

**2. Deck demand.**
- Brainscape **NREMT EMT 7,158 learners**; **NREMT Paramedic 57,086** (`www_brainscape_com_learn.txt`).
- Subreddit sizes: r/NewToEMS about 85,330; r/ems about 201,104 (reddapi).
- r/NewToEMS RSS: `anki` returned 29 results, 9 deck-titled; `flashcards` returned 96 results, 14 deck-titled. These include repeated requests: "Anki Decks for EMT-B?" (2026-01-01), "NREMT-Paramedic Anki Deck?" (2024-11-04), and a textbook-specific one, "EMT course JB Emergency Care & Transportation … Anki deck?" (2021).
- AnkiHub community:
  - "NREMT Deck? How to Upload?" (2024-12-25, 233 views). The poster says they could not find an NREMT deck on AnkiHub.
  - "[Wiki] Emergency Care – NREMT Prep" (978 views). A user wrote that "independent study of these flashcards helped me a lot for the NREMT".
  - Source: `ankihub_*.json`.
- Reddit RSS: see §Reddit status.

**3. Existing supply.**
- AnkiWeb 722550778 "EMT-B" ("NREMT FOCUSED ALL FROM Daniel Limmer Emergency Care Textbook"): 841 notes, 2021-06-17, +8.
- AnkiWeb 1515970148 "NREMT EMT-B Anki Deck" ("Based on the EMT … Crash Course book"): 575 notes, 2023-07-26, +1/-1.
- The AnkiHub deck is based on the Limmer *Emergency Care* 14th edition, per its maintainer.
- Paid: an Etsy "Anki Flashcard Set for EMT Certification – 2,500+ Flashcards" (seen in results only), Brainscape Certified (11 decks, 525 cards), and Amazon card sets.
- Every free deck found is derived from a copyrighted textbook.

**4. Official flashcards.** None found. NREMT publishes free EMT sample items and a sample packet (https://www.nremt.org/Pages/Examinations/EMR-and-EMT-Certification-Examinations).

**5. Sources.**
- The test plan is public. EMT domains: Scene Size-Up and Safety 15–19%, Primary Assessment 39–43%, Secondary Assessment 5–9%, Patient Treatment and Transport 20–24%, Operations 10–14% (same page).
- Primary content lives in commercial textbooks and in AHA resuscitation guidelines (copyrighted).
- The public-domain National EMS Education Standards (NHTSA) could be the citation spine, but ems.gov returned 403, so their licence and text are **not verified**.
- **Accuracy and liability are sensitive.** This is clinical treatment content, and the updated exam is organised around assessment and treatment decisions.

**6. Rules.**
- The trademark page says marks "may be used when necessary to accurately refer to the National Registry, its programs, certifications or examinations", but not "as part of another organization's … product name … domain name", nor in a way implying official association (https://www.nremt.org/about/trademarks).
- The security page lists as misconduct "Possessing, disclosing, reproducing, distributing, or using any examination content … without authorization" and "item harvesting". It adds: "The National Registry does not guarantee passes or endorse any program, site, or examination prep material of any kind" (https://www.nremt.org/Pages/Examinations/Security-Page).

**7. Churn.** The updated EMR/EMT exams "launch[ed] on April 7, 2025", built on the "2023 BLS Practice Analysis". The domains changed completely from the old five (Airway…, Cardiology…, Trauma, Medical/OB, Operations). The new exams include technology-enhanced items. Every older deck, including all the free ones above, is organised by the old structure or by textbook chapter.

**8. Partnerships.** nremt.org's navigation has partner sections for "Program Director", "Training Officer", "Medical Director" and "State Contacts". These are EMS educators who could recommend a deck. No formal endorsement route exists ("does not … endorse").

**9. Search.**
- "NREMT EMT anki deck": AnkiWeb ×2, AnkiHub ×2, Etsy.
- "NREMT flashcards": Amazon, Brainscape, Quizlet ×3, OpenExamPrep (free, 50 cards).

**Scores.**
- **Demand 5:** about 424k certified EMTs; Brainscape EMT and Paramedic decks with 64k learners combined; 23 deck-titled posts across two r/NewToEMS feeds; AnkiHub requests.
- **Gap 4:** free decks are textbook-derived, 2021–2023, and built for the pre-April-2025 domains.
- **Sourceability 2:** public test plan, but clinical sources are copyrighted textbooks and guidelines; NHTSA standards not verified; high accuracy stakes.
- **Rules-safety 3:** nominative use allowed; strict anti-harvesting language.
- **Stability 4:** freshly revised in 2025, so a long run is likely.
- **Partnership 4:** named educator and program-director audiences.
- **Search-winnability 3:** a few weak AnkiWeb decks; Brainscape and Quizlet are strong for "flashcards".

---

## 3. SOA Exam FM (Financial Mathematics) — 25

**1. Volume.**

| Sitting | Candidates | Passed | Pass rate |
|---|---|---|---|
| December 2025 | 1,905 | 829 | 43.5% |
| February 2026 | 1,790 | 821 | 45.9% |
| April 2026 | 1,650 | 805 | 48.8% |
| June 2026 | 2,132 | 981 | 46.0% |

Source: SOA result PDFs `edu-2025-12-fm-percents`, `edu-2026-02-fm-percents`, `edu-2026-04-fm-percents`, `edu-2026-06-fm-percents` (raw-dah). The CAS co-sponsors the exam.

**2. Deck demand.** As for P. No FM-titled post appeared among r/actuary's top 41 `anki` results.

**3. Existing supply.**
- AnkiWeb 1352239448 "Financial Mathematics for SOA Exam FM / CAS Exam 2": 382 notes, 2017-10-08, +3/-0.
- Paid: ACTEX/ASM FM flashcards (studymanuals.com, seen in results) and The Infinite Actuary.
- Free: The Actuarial Nexus (SOA list).

**4. Official flashcards.** None. SOA offers a free "Online Sample FM Exam".

**5. Sources.**
- The syllabus PDF is public, with weighted topics including Annuities/cash flows 20–30%, Loans 15–25%, Bonds 15–25%, General Cash Flows/ALM 20–30% (https://www.soa.org/globalassets/assets/files/edu/2026/fall/syllabi/2026-12-exam-fm-syllabus.pdf).
- Suggested texts (Broverman 8th edition, Vaaler et al.) are commercial.
- One SOA study note is "required reading".

**6. Rules.** As P.

**7. Churn.** Three FM syllabi (Aug, Oct and Dec 2026) are linked from the study page. I did not diff them, so any change between them is **not verified**.

**8. Partnerships.** As P.

**9. Search.**
- "Exam FM flashcards": Quizlet ×3, studymanuals ×2, ACTEX, TIA, careeremployer.
- The 2017 AnkiWeb deck ranks for "anki".

**Scores.** As P, except Stability 4 (unexamined syllabus revisions).

---

## 4. PTCB Certified Pharmacy Technician (PTCE) — 23

**1. Volume.**
- "According to the Pharmacy Technician Certification Board, 49,253 PTCE exams were administered in 2025, and the 2025 pass rate … was 69%."
- "PTCB has granted more than 876,000 pharmacy technician certifications since 1995."
- Read on Mometrix (https://www.mometrix.com/academy/ptcb-practice-test/), a secondary source attributing the figures to PTCB. PTCB's own report was **not found**.

**2. Deck demand.**
- r/pharmacytechnician has about 76,449 members (reddapi).
- Brainscape has no Certified PTCE deck.
- The AnkiWeb search for "PTCB" returned 10 decks (the only AnkiWeb search that worked).
- The r/PharmacyTechnician `anki` RSS returned only **7 results, 1 deck-titled**: "Pharm Tech Anki Deck" (2021-02-12, https://www.reddit.com/r/PharmacyTechnician/comments/li3iyt/pharm_tech_anki_deck/). The `flashcards` feed returned 74 results, 9 deck-titled, including "PTCB Flashcards" (2024-12-05) and "PTCB Flashcards?" (2024-12-12).

**3. Existing supply.** All AnkiWeb:
- 558410786 "PTCB Study Guide": 1,655 notes, 2024-01-29, 0 ratings.
- 838882168 "Pharmacy Technician Certification Exam Practice": 1,000 notes ("1000 PTCE questions"), 2020-10-31, +1/-1.
- 1283946004 "Top 200 Drugs PTCB": 200 notes, 2021.
- 595453733 "Top 200 drugs for pharmacy techs": 196 notes, 2024.
- 846523509 "suffix/prefix drug classes": 71 notes, 2026-09-06.

Paid options include REA flashcard books, a "PTCE Flashcards" Play app and Mometrix; Union Test Prep has free flashcards (seen in results).

**4. Official flashcards.** Paid. "PTCE Practice Bank … 300+ Study Questions and a 400-flashcard Study Deck … Price: $65 per candidate"; Pre-PTCE $29 (https://ptcb.org/official-ptcb-practice-tools/).

**5. Sources.**
- The content outline is public. "Effective January 6, 2026": Medications 35%, Federal Requirements 18.75%, Patient Safety & QA 23.75%, and more; footer "v1.4 – August 2024" (https://ptcb.org/wp-content/uploads/2025/07/PTCE-Content-Outline.pdf).
- The Federal Requirements domain (DEA schedules, REMS, DSCSA, FDA recalls) maps to US-government sources. The FDA website states: "Unless otherwise noted, the contents of the FDA website … are in the public domain" (https://www.fda.gov/about-fda/about-website/website-policies).
- PTCB's reference list gives commercial textbooks only.
- **Accuracy sensitivity:** drug names, doses and interactions must be exact. Cards should cite FDA labelling. DailyMed was not checked this task.

**6. Rules.**
- PTCB's trademark policy: "Individuals, businesses, and other organizations, including PTCB certificants, are not permitted to use the PTCB Trademarks … [except] subject to a PTCB-approved license agreement" (https://ptcb.org/trademark-and-certification-mark-policy/).
- This is stricter wording than any other body in this set. Plain nominative reference ("for the PTCE") would need care and a disclaimer; a legal view is **not verified**.
- The certification page says: "PTCB does not endorse, recommend, or sponsor any review course, manuals, or books."

**7. Churn.** The new outline took effect on 6 January 2026. Drug-list content changes more often than the outline.

**8. Partnerships.**
- PTCB runs a "PTCB-Recognized Education/Training Program (REP)" scheme, which "recognizes the completion of certain education/training programs as fulfilling the eligibility requirements" (https://myaccount.ptcb.org/become-a-ptcb-recognized-education-training-program/ptcb-recognized-education-training-program-terms-and-conditions).
- The attestation form accepts "Completion of an ASHP/ACPE-accredited training program" and tutoring by a CPhT, so schools and pharmacist tutors are the audience.

**9. Search.** "PTCB anki deck" is dominated by AnkiWeb decks with 0–1 ratings. "PTCE flashcards" is dominated by Amazon books, a Play app and PTCB's own tools.

**Scores.**
- **Demand 3:** about 49k exams a year; repeated "PTCB Flashcards?" requests, but only 1 Anki post.
- **Gap 4:** the free decks are unrated and scattered, and none is sourced.
- **Sourceability 4:** public outline, and much of it maps to public-domain federal and FDA material.
- **Rules-safety 2:** restrictive trademark policy wording.
- **Stability 4:** outline just refreshed in 2026.
- **Partnership 3:** recognised programmes and accredited schools.
- **Search-winnability 3.**

---

## 5. Microsoft PL-300 (Power BI Data Analyst Associate) — 23

**1. Volume.** None published on the certification page (https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/). r/PowerBI has about 211,189 members (reddapi).

**2. Deck demand.** The r/PowerBI `anki` RSS returned only **4 results**, 1 deck-titled: "DAX Anki cards" (2026-08-22). The `flashcards` feed was not fetched (rate-limited). Brainscape has user-made PL-300 packs (e.g. "PL-300 Microsoft Power BI Data Analyst" by Kiki's Kastle), seen in results only, and no Certified PL-300 deck in its catalogue.

**3. Existing supply.**
- No free PL-300 Anki deck surfaced in the "PL-300 Power BI anki deck" results.
- GitHub "anki power bi" returned 21 repos, none of them exam decks.
- Paid: WarpBI sells a PL-300 study pack with an Anki bonus (warpbi.gumroad.com, seen in results only), and Crucial Exams sells PL-300 practice tests.
- "PL-300 flashcards" results: Quizlet ×6, Brainscape, OpenExamPrep (50 free terms).

**4. Official flashcards.** None. Microsoft offers a free practice assessment, an Exam Sandbox and prep videos (certification page).

**5. Sources.**
- The study guide is public. "Skills measured as of April 20, 2026": Prepare the data 25–30%, Model the data 25–30%, Visualize and analyze 25–30%, Manage and secure Power BI 15–20%. It includes a change log (https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300).
- Microsoft Learn's Terms of Use default is "personal and non-commercial use", and CC BY 4.0 was verified only for the azure-docs repo (`rules-risks.md`).
- The licence for the Power BI docs repo is **not verified**: raw GitHub LICENSE returned 404, and the MCP call was denied.
- Cards would therefore cite and paraphrase the docs rather than copy them.

**6. Rules.** Microsoft prohibits brain dumps, and its trademark guidelines allow plain-text reference with a notice (`rules-risks.md`).

**7. Churn.** The study guide says "Our exams are updated periodically", and the current skills date is 20 April 2026. Microsoft retired 15 exams in the year to August 2026, including AI-102 and DP-100 (`size-demand.md`). PL-300 is not among them.

**8. Partnerships.** Power BI user groups and MVPs are plausible, but I did not verify them this task.

**9. Search.** No free Anki deck ranks for "PL-300 anki". The Anki query shows Brainscape, Quizlet and a paid Gumroad pack.

**Scores.**
- **Demand 2:** large community (211k), but only 4 Anki posts in r/PowerBI.
- **Gap 4:** no free Anki deck found.
- **Sourceability 3:** public, dated outline; doc licence unverified.
- **Rules-safety 4:** clear Microsoft rules.
- **Stability 3:** periodic skill updates and Microsoft's retirement habit.
- **Partnership 3:** plausible but unverified.
- **Search-winnability 4:** empty free-Anki space.

---

## 6. NREMT Paramedic — 22

- **Volume:** 155,005 certified paramedics (nremt.org/maps).
- **Demand:** Brainscape Certified "NREMT® Paramedic: 49 decks, 2,166 cards, **57,086 learners**", the largest non-nursing, non-admissions health count in this set.
- **Gap:** a strong paid incumbent (Brainscape). A free Anki gap is likely, but the AnkiWeb search was blocked, so it is **not verified**.
- **Sources, rules and partnerships:** as EMT, with more pharmacology and cardiology, so the clinical-accuracy risk is higher.
- **Churn:** nremt.org marks "ALS (AEMT, Paramedic) Examination Information *Updated*" (navigation); details not read.
- **Scores:** Demand 5; Gap 2 (Brainscape incumbent); Sourceability 2; Rules-safety 3; Stability 4; Partnership 4; Search-winnability 2.

---

## 7. ServSafe Manager — 21

**1. Volume.** None found. servsafe.com shows no count.

**2. Demand.** Brainscape "ServSafe Manager: 10 decks, 342 cards, 385 learners"; Food Handler 415 learners. That is weak demand.

**3. Supply.**
- Free: Union Test Prep ("160" flashcards per the search summary, **not verified**), OpenExamPrep (50), Quizlet, Cram.
- Paid: Mometrix, Test Prep Books.
- All seen in results only.

**4. Official flashcards.** None seen. ServSafe publishes a diagnostic test and a practice test with answer keys as PDFs (seen in results only).

**5. Sources.** The primary source is the **FDA Food Code**, which is public domain: "the contents of the FDA website … are in the public domain" (FDA website policies). "FDA has issued the 2026 edition of the FDA Food Code" (https://www.fda.gov/food/retail-food-protection/fda-food-code). State adoption varies; FDA lists "2024 Adoption of the FDA Food Code by State".

**6. Rules.** "© 2026. National Restaurant Association Educational Foundation." ServSafe's trademark terms were **not checked**.

**7. Churn.** The 2026 Food Code has just been issued. Earlier codes came every four years ("FDA decided to move to a four-year interval"), so ServSafe material will likely re-align. The timing is **not verified**.

**8. Partnerships.** Registered ServSafe proctors and instructors (servsafe.com FAQ mentions "Registered ServSafe Proctor").

**9. Search.** "ServSafe Manager flashcards": Quizlet, Brainscape, Amazon ×2, Union Test Prep, Mometrix, OpenExamPrep, Cram. No Anki results.

**Scores.**
- **Demand 2.**
- **Gap 3:** several free web sets exist, but none is Anki or sourced.
- **Sourceability 5:** public-domain Food Code.
- **Rules-safety 3:** unchecked.
- **Stability 3:** new 2026 Food Code.
- **Partnership 3.**
- **Search-winnability 2.**

---

## 8. WSET Level 2 / Level 3 Award in Wines — 21

- **Volume:** none found. The wsetglobal.com about page shows no count.
- **Demand:**
  - Brainscape Certified **WSET Level 3 Wine 26,470 learners**, **Level 2 Wine 25,021**, Level 2 Spirits 4,216, Level 1 Wine 11,105 (`www_brainscape_com_learn.txt`).
  - r/wine has about 320,279 members (reddapi).
- **Supply:**
  - AnkiWeb 1521584113 "WSET Level 3 — NEW": 4,075 notes, 2019-09-06, +1.
  - AnkiWeb 1660499704 "WSET Level 2": 198 notes, 2023.
  - AnkiWeb 1981971485 "CMS Advanced Study Deck": 5,290 notes, 2018, +7/-1.
  - Paid, all seen in results only: Napa Valley Wine Academy, ThirtyFifty ("2,400+" L3 cards), Wine & Spirit IQ, Wine Academy of Las Vegas, BrainBeats audio.
  - Several paid sellers are themselves course providers.
- **Official flashcards:** none seen.
- **Sources:** "Specification (2022, Issue 2)" is downloadable (https://www.wsetglobal.com/qualifications/wset-level-3-award-in-wines/). The course textbook is WSET's own; not verified whether it is sold separately. Appellation rules are public law, but I did not check that this task.
- **Rules:** WSET terms of use returned 404; **not verified**.
- **Churn:** the specification is dated 2022.
- **Partnerships:** the schools that sell flashcards are potential partners, and competitors.
- **Search:** "WSET Level 2 flashcards": Brainscape ×2, NVWA, Quizlet ×2, Wine & Spirit IQ, WALV, Cram ×2, Gumroad.
- **Scores:**
  - **Demand 5:** Brainscape counts rival NREMT Paramedic.
  - **Gap 2:** many paid decks, and Brainscape Certified already covers it.
  - **Sourceability 2.**
  - **Rules-safety 3.**
  - **Stability 4.**
  - **Partnership 3.**
  - **Search-winnability 2.**

---

## 9. Tableau (Salesforce Certified Tableau Data Analyst; "Desktop Foundations") — 20

- **Volume:** none published. tableau.com/learn/certification returned 403. r/tableau has about 94,251 members.
- **Exam facts** (Trailhead prep module, raw-verified):
  - "60 multiple-choice/multiple-select questions and five nonscored questions".
  - Passing score "65%".
  - Domains: Connect to and Transform Data 24%, Explore and Analyze Data 41%, Create Content 26%.
  - "You'll be required to complete the Salesforce Certified Tableau certification maintenance module on Trailhead once a year."
- **Rename:** according to open-exam-prep.com (secondary), the Desktop Specialist is now "Salesforce Certified Tableau Desktop Foundations", $75 (was $100).
- **Supply:** "Tableau Desktop Specialist anki deck flashcards" returned one Quizlet set and no Anki deck.
- **Sources:** the exam guide is public on Trailhead. The Tableau help licence is **not verified**.
- **Rules:** Salesforce trademark terms **not checked**.
- **Scores:**
  - **Demand 2.**
  - **Gap 4.**
  - **Sourceability 3.**
  - **Rules-safety 3.**
  - **Stability 2:** rebranding and annual maintenance.
  - **Partnership 2.**
  - **Search-winnability 4:** empty Anki space.

---

## 10. AAMA CMA (medical assistant) — 20, lightly researched

- **Demand:** Brainscape "CMA®: 58 decks, 2,867 cards, 4,032 learners"; CNA 1,217 learners.
- **Supply:** AnkiWeb 651460605 "CMA 1": 691 notes, 2016, +3. AnkiWeb 2019018474 "CCMA EXAM 2024 Quizlet ANKI DECK": 275 notes, 2024 (this is NHA's CCMA, not AAMA).
- **Not researched:** AAMA volume, content outline, rules and churn were not fetched, so those scores are default 3s or evidence-light 2s.

---

## 11. Real-estate salesperson licence (state exams) — 19, lightly researched

- **Demand:**
  - r/realestate has about 2,515,298 members, but it is a general subreddit.
  - Brainscape "Texas Real Estate Pre-License: 213 learners".
  - Reddit `realestate anki` RSS: not fetched (rate-limited).
- **Supply:** AnkiWeb decks are old and state-specific:
  - 1747258188 "Real Estate University Flashcards": 2,550 notes, 2019, +2.
  - 1833181629 Indiana: 1,642 notes, 2016.
  - 886895363 Illinois: 69 notes, 2017.
  - 1424315321 BC vocab: 353 notes, 2020.
  - Free web: Union Test Prep and StudyStack (seen in results).
- **Structural issue:** every state has its own law portion and exam vendor, so one deck cannot serve all candidates. A national-portion deck is possible, but vendor outlines were not fetched.
- **Scores:** default or low where unresearched. **Not recommended without further research.**

---

## 12. AAPC CPC (medical coding) — 18

**1. Volume.** AAPC: "With a network of more than 300,000 professionals" (https://www.aapc.com/about-us, HTML). CPC exam volume is not published.

**2. Deck demand.**
- The r/MedicalCoding `anki` search RSS returned **0 results** (`rss/MedicalCoding_anki.xml`).
- r/medicalcoding has about 35,193 members.
- Brainscape has no Certified CPC deck.
- The r/MedicalCoding `flashcards` feed returned 5 results, 2 deck-titled, including "Flashcard Sets Quizlet?" (2026-08-01).

**3. Supply.**
- AnkiWeb 1333611709 "CPC Study 1: … Initialisms and Abbreviations": 42 notes, 2024.
- AnkiWeb 231733969 "Medical Billing & Coding <3": 380 notes, 2024-12-27, 0 ratings.
- AnkiWeb 1446832054: 58 notes. Its author wrote: "i haven't found many decks on here catered to us".
- Paid, seen in results only: Mometrix, Trivium, Flashcard Secrets. One Quizlet set is titled "…ACTUAL EXAM 140 QUESTIONS … (VERIFIED ANSWERS)", a dump-like signal.

**4. Official flashcards.**
- There is no deck, but AAPC eBooks have a "Create Flashcard" feature (https://www.aapc.com/blog/91800-using-your-ebook-for-exam-prep/).
- The Official CPC Study Guide costs $149.95 ($99.95 for members) and has "200+ Test Your Knowledge questions" (https://www.aapc.com/shop2/study-guides/cpc-study-guide.aspx).

**5. Sources.** This is the key blocker.
- The AMA says: "The AMA holds the copyright to the CPT code set … Any individual or entity using CPT content needs permission or a license." Its examples of when a licence is required include "Any proposed use of CPT content including the creation of derivative works of CPT content" (https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs).
- ICD-10-CM belongs to NCHS/CDC. WHO says national modifications are licensed by "the authorities concerned … US Clinical Modification … Contact: National Center for Health Statistics" (WHO ICD-10 licensing FAQ).
- CDC says "Most of the information on the CDC … websites is not subject to copyright, is in the public domain", read on a restoredcdc.org mirror because cdc.gov returned "Access Denied".
- Cards on ICD-10-CM guidelines and anatomy are feasible. Cards quoting CPT descriptors are not, without an AMA licence.

**6. Rules.** CPC® is an AAPC mark. A report of a court finding that a test-prep provider "could have infringed mark for medical coding exam" was seen in results only; the page text did not extract, so it is **not verified**.

**7. Churn.** The exam is open-book: "You will be able to reference approved medical code books … the AMA's CPT® Professional Edition … ICD-10-CM and HCPCS Level II", with "100 multiple-choice questions" (aapc.com, taking-the-CPC and FAQ pages). "Certification exams are based on the current calendar year's code sets", so the content changes every year. Open-book also lowers the value of memorising codes.

**8. Partnerships.** AAPC has local chapters and an instructor programme ("Become an Instructor" in navigation).

**9. Search.**
- "CPC medical coding anki deck": AnkiWeb ×3, a Goodreads book, anki-decks.com.
- "CPC exam flashcards": Amazon ×2, Quizlet ×2, Brainscape, Mometrix, OpenExamPrep, Flashcard Secrets, Cram.

**Scores.**
- **Demand 3:** large profession; zero Anki posts.
- **Gap 4.**
- **Sourceability 1:** CPT is copyrighted.
- **Rules-safety 2:** AMA licensing plus an assertive mark holder.
- **Stability 2:** annual code sets.
- **Partnership 3:** chapters and instructors.
- **Search-winnability 3.**

---

## 13. AHIMA CCS — 18

- **Volume:** none published on the page.
- **Supply:** Quizlet sets, including "AHIMA CCS Practice Exam [2019] - EDIT Version"; Amazon and Mometrix physical cards (seen in results only).
- **Official prep:** "Certified Coding Specialist (CCS) Exam Preparation, 16th Edition", with "291 multiple choice questions and 28 medical scenarios", and an online course. No flashcards.
- **Content domains:** Coding Knowledge and Skills, Coding Documentation, Provider Queries, Regulatory Compliance, Information Technologies. "2025 code sets and guidelines" are used in the prep book.
- **Churn:** "The CCS exam will be updating to the 2026 codebook list starting May 1st 2026 … candidates must bring the correct code books" (https://www.ahima.org/certification-careers/certifications-overview/ccs/). This is annual churn and open-book, like CPC.
- **Sources:** the inpatient focus (ICD-10-CM/PCS) is more government-sourced than CPC, but CPT is still in scope (the page lists "CPT/HCPCS" courses).
- **Scores:** Demand 2, Gap 4, Sourceability 2, Rules-safety 3, Stability 2, Partnership 2, Search-winnability 3.

---

## 14. NASM CPT — 18

- **Volume:** "In 2025, 19,338 of 22,843 candidates passed the NASM-CPT exam, a pass rate of 85%" (https://www.nasm.org/certified-personal-trainer).
- **Demand:** Brainscape "NASM® CPT: 23 decks, 1,014 cards, 4,817 learners". r/personaltraining has about 95,321 members. Its `anki` RSS returned 7 results, 2 deck-titled: "NASM CPT Flash Cards (Anki)" (2021) and "ACE Exam Personal Training Anki Deck" (2025-10-14).
- **Supply:**
  - PT Pioneer "Free NASM CPT Flashcards – Over 1000 cards" (raw-verified). That page itself notes that spaced-repetition versions are a premium feature elsewhere.
  - AnkiWeb module decks: 54–130 notes each, 2018–2021, 0 ratings.
  - Quizlet and Amazon.
- **Official flashcards:** "NASM EDGE … 500+ flashcards … $16.99" (search summary only, **not verified**).
- **Sources:** the exam is built on NASM's proprietary OPT model and course: "The learning content is supported by 1,223 scholarly references". There is no open primary text. The exam is "closed-book … 120 questions".
- **Churn:** the "7th Edition" appears in Amazon titles (results only).
- **Scores:** Demand 4, Gap 3, Sourceability 1, Rules-safety 3, Stability 3, Partnership 2, Search-winnability 2.

## 15. ACE Personal Trainer — 17

- **Volume:** "90,000+ ACE Pros" (acefitness.org).
- **Supply:** PT Pioneer "Free ACE CPT Flashcards – Over 650 cards" (raw-verified), Quizlet, Brainscape.
- **Sources:** ACE's own textbook, "The Exercise Professional's Guide to Personal Training". An Exam Content Outline is referenced on the page.
- **Scores:** Demand 3, Gap 3, Sourceability 1, Rules-safety 3, Stability 3, Partnership 2, Search-winnability 2.

## 16. Google Data Analytics Professional Certificate — 17

- **Volume:** "3,848,350 already enrolled" (https://www.coursera.org/professional-certificates/google-data-analytics).
- **Format:** a course certificate with "Regular assessments", not a proctored exam (grow.google page). It now includes AI content: "Learn how to use AI to help with ideas for data visualization".
- **Supply:** Quizlet ×3, Brainscape user decks by course; no Anki deck found.
- **Sources:** the course content is proprietary to Google and Coursera, and there is no public exam outline. Weak fit for a sourced exam deck.
- **Scores:** Demand 2, Gap 3, Sourceability 2, Rules-safety 3, Stability 2, Partnership 2, Search-winnability 3.

## 17. NSCA CSCS — 16, lightly researched

- **Supply:** AnkiWeb 1750838600 "NSCA CSCS Review": 309 notes, 2016, +2. PT Pioneer "Free NSCA CSCS Flashcards – Over 950 cards" (raw-verified). Brainscape.
- **Sources:** the NSCA study-materials page did not extract. The search summary says the prep text is "Essentials of Strength Training", which is proprietary.
- **Scores:** Demand 2, Gap 3, Sourceability 1, Rules-safety 3, Stability 3, Partnership 2, Search-winnability 2.

## 18. IBM Data Science Professional Certificate — 16

- **Volume:** "960,823 already enrolled" (https://www.coursera.org/professional-certificates/ibm-data-science). A course certificate with no proctored exam, as for Google.
- **Scores:** Demand 1, Gap 3, Sourceability 2, Rules-safety 3, Stability 2, Partnership 2, Search-winnability 3.

---

## Reddit RSS status

Feeds were fetched from `https://www.reddit.com/r/<sub>/search.rss?q=<q>&restrict_sr=1&sort=top&t=all&limit=100` into `raw-dah/rss/` and analysed with `rss/analyze.py`, which counts titles containing anki, flashcard or deck. Reddit returned HTTP 429 for most of the session.

| Feed | Results | Deck-titled | Sample titles (date, URL) |
|---|---|---|---|
| r/actuary `anki` | 41 | 23 | Mostly FSA, 6U, MAS and LTAM; one "Exam P Flashcards" (2025-05-18, /comments/1kpsz7x/) |
| r/actuary `flashcards` | 100 | 19 | "FSA Exams: Automated Excel Grading and Flashcards" (2026-02-09, /comments/1r01ze3/); "How well are you actually learning FSA flashcards?" (2025-12-12, /comments/1pl2ykk/); "Exam P Flashcards" (2025-05-18) |
| r/MedicalCoding `anki` | **0** | 0 | — |
| r/MedicalCoding `flashcards` | 5 | 2 | "Prefix List Flashcards" (2020-05-22, /comments/gos5vr/); "Flashcard Sets Quizlet?" (2026-08-01, /comments/1vcrlgy/) |
| r/PharmacyTechnician `anki` | 7 | 1 | "Pharm Tech Anki Deck" (2021-02-12, /comments/li3iyt/) |
| r/PharmacyTechnician `flashcards` | 74 | 9 | "PTCB Flashcards" (2024-12-05, /comments/1h6w2rh/); "PTCB Flashcards?" (2024-12-12, /comments/1hc9d45/); "Flashcard advice" (2024-12-12, /comments/1hckyhq/) |
| r/NewToEMS `anki` | 29 | 9 | "Anki Decks for EMT-B?" (2026-01-01, /comments/1q1akpi/); "NREMT-Paramedic Anki Deck?" (2024-11-04, /comments/1gjqqst/); "Comprehensive EMT-B NREMT Anki Deck, based on the Crash Course book" (2023-07-27, /comments/15b9bs8/); "Jones/Bartlett EMR Anki Deck" (2025-03-14, /comments/1jbdbi8/) |
| r/NewToEMS `flashcards` | 96 | 14 | "Flashcards? Emt" (2025-06-12, /comments/1l9ej9g/); "Paramedic flashcards" (2021-09-14, /comments/po6803/); "What set of Flashcards (paid is fine) do you guys recommend for studying for my EMT certification?" (2020-02-04, /comments/eyqjqc/) |
| r/personaltraining `anki` | 7 | 2 | "NASM CPT Flash Cards (Anki)" (2021-03-16, /comments/m6kvot/); "ACE Exam Personal Training Anki Deck" (2025-10-14, /comments/1o6rq2l/) |
| r/personaltraining `flashcards` | 27 | 1 | "ACE Exam Personal Training Anki Deck" (2025-10-14) |
| r/PowerBI `anki` | 4 | 1 | "DAX Anki cards" (2026-08-22, /comments/1vvoan8/) |
| r/PowerBI `flashcards`, r/tableau `flashcards`, r/dataanalysis `flashcards`, r/WSET `anki`, r/realestate `anki`, r/ems `anki` | — | — | **not fetched (rate-limited)** |

All URLs are under https://www.reddit.com/r/<sub>. The RSS carries post bodies but no comments or scores.

**Reading the table.**
- The EMS and pharmacy-tech communities ask for decks repeatedly. Many EMS requests name a specific textbook.
- Medical coders barely discuss Anki.
- Power BI users almost never do.
- Actuarial Anki talk is real but concentrated on the memory-heavy upper exams, not P or FM.

## Cross-cutting healthcare notes

- **Liability and accuracy.**
  - NREMT, the PTCE and CMA are about patient care or medications. A wrong dose or contraindication card is a safety issue, not just a study error.
  - Decks should cite a primary source per card: FDA labelling or CFR for the PTCE, and guideline or standard documents for EMS.
  - Decks should carry "study aid, not clinical guidance" wording.
- **Code sets.**
  - CPT is AMA-copyrighted, and the AMA says derivative works need a licence.
  - ICD-10-CM and ICD-10-PCS are government-maintained, and CDC material is generally public domain (mirror-verified).
  - The difference makes CPC/CCS cards on code descriptors unsafe to publish. Guideline and anatomy cards are possible.
- **Textbook-derived community decks.** Every free NREMT deck found says it is built from a commercial textbook (Limmer, Crash Course, AAOS). This mirrors the copyright hesitation noted for CFA in `distribution.md`, and it is the opening for an original-wording, source-cited deck.
