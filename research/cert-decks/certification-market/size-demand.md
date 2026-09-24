# Professional certification market: size and demand

*Research date: 2026-09-23. This covers the market as a whole. It does not pick certifications to build.*

**How this was sourced.** Every figure below was read in the raw text of a page fetched during this task, using curl plus text extraction. The copies are saved in `scratchpad/certs/raw-size/` (`<name>.txt`, with the source URL in `<name>.url`). Where a page blocked curl (pmi.org, cisco.com, quizlet.com, prometric.com, businesswire.com), the figure is marked **not verified**, or taken from a mirror that was read and named as a mirror. Figures from a company's own marketing are marked *(vendor claim)*. Search-engine summaries were used only to find URLs. Where a summary disagreed with the page, the page wins. One example: a search summary said "3.8 million badges were issued on Credly in 2025", but the page shows that figure is Cisco's alone.

---

## 0. Headline numbers

| Measure | Figure | Source |
|---|---|---|
| Pearson VUE (now "Pearson Professional Assessments") exams per year | "more than 19 million certification and licensure exams every year" *(vendor claim, May 2023 article)* | pearsonvue.com (below) |
| PSI test-centre network | "delivers 17 million tests every year" *(vendor claim)* | psiexams.com |
| ETS + PSI combined | "nearly 50 million tests annually" *(vendor claim; includes TOEFL/GRE/Praxis)* | psiexams.com/about-psi |
| Prometric | "7 million exams annually in more than 180 countries" *(vendor claim, Japan subsidiary page)* | prometric-jp.com |
| Certiport (Pearson VUE business) | "Roughly 175,000 exams are administered monthly" *(vendor claim)* | certiport.pearsonvue.com |
| US certifications (Credential Engine 2025) | 6,892 certifications from 1,250 providers, out of 1,850,034 credentials of all types | Credential Engine |
| US workers holding a certification but no licence (BLS 2025) | 2.5% of 163.5 million employed; 24.0% hold a certification or licence | BLS CPS table 52 |
| CFA Program exam sittings, 2025 | 162,589 (2019 peak: 270,456) | CFA Institute |
| CompTIA Security+ holders | "more than one million" | comptia.org |
| AWS | "more than 1.42 million active AWS Certifications and 1.05 million unique AWS Certified individuals" (as of Jan 2025) | aws.amazon.com |
| ISC2 | "more than 270,000 certified members, and associates" | isc2.org |

---

## 1. How many exams are delivered each year

### Test-delivery providers' own figures (all vendor claims)

- **Pearson VUE.** A Pearson VUE page reproducing an Arabian Business article of 24 May 2023 says: "The company delivers more than 19 million certification and licensure exams every year." It also describes "nearly 20,000 highly secure test centers, in addition to online testing across over 180 countries" and "Nearly 500 clients". Source: https://www.pearsonvue.com/us/en/about/news/highlights/pearson-vues-innovative-solutions-revolutionize-t.html
  - Pearson VUE's current vision page gives no number, only "delivering millions of exams annually". It lists "5,500 test centers in more than 180 countries" for its own Pearson Professional Centers, plus the OnVUE online-proctoring tool launched in 2019. Source: https://www.pearsonvue.com/us/en/about/vision.html
  - A search snippet mentioned "close to 21 million exams a year". I did not find that figure in any fetched page, so it is **not verified**.
  - **Rename and financials.** Pearson's 2025 Annual Report calls the unit "Pearson Professional Assessments (formerly known as Pearson VUE)". https://plc.pearson.com/sites/pearson-corp/files/annual-reports/2025/pearson-annual-report-2025.pdf
  - Pearson's 2025 full-year results (27 Feb 2026) say: "Pearson Professional Assessments sales increased 1% on an underlying basis driven by new contract launches partially offset by the pause in a contract delivered in 2024, which resumed in Q3, and headwinds in PDRI." For the division, they add: "we expect low to mid-single digit underlying sales growth in 2026". Neither document states an exam volume for 2025. https://plc.pearson.com/sites/pearson-corp/files/annual-reports/pearson-2025-full-year-results-27-february-2026.pdf
- **PSI (a wholly owned subsidiary of ETS).** "The ever-expanding PSI Test Center network spans +140 countries and delivers 17 million tests every year." https://www.psiexams.com/test-owners/test-delivery/test-center-network/
  - "together ETS and PSI deliver nearly 50 million tests annually across more than 200 countries". This includes ETS's academic and language tests (TOEFL, TOEIC, GRE, Praxis), so it is not a certification-only figure. https://www.psiexams.com/about-psi/
- **Prometric.** "delivering 7 million exams annually in more than 180 countries" (Prometric Japan company profile; undated). https://www.prometric-jp.com/en/corporate/company_profile/
  - Wikipedia says Prometric serves "approximately 500 clients" through "3,000 Prometric test centers". This is a secondary source. https://en.wikipedia.org/wiki/Prometric
  - prometric.com returned HTTP 403, so a newer figure (search snippets mentioned "9.5 million") is **not verified**.
- **Certiport** (Pearson VUE business; Microsoft Office Specialist, Adobe and other entry-level certifications): "Roughly 175,000 exams are administered monthly through a network of more than 14,000 Certiport Authorized Testing Centers" and "Certiport has delivered more than 10 million exams worldwide". https://certiport.pearsonvue.com/About/Press-room/Fast-facts.aspx
- **Meazure Learning, Kryterion.** The Meazure home page was fetched but shows no volume figure. A search snippet said "around five million exams per year", which is **not verified**. I found no Kryterion figure.

**Reading these together.** The three large delivery networks together claim somewhere in the tens of millions of proctored exams a year. That total cannot be computed cleanly, for three reasons:
- the figures come from different years;
- they mix licensure, academic admissions and driving-theory tests with professional certification;
- ETS/PSI report a combined figure.

No provider publishes a certification-only count.

### Industry bodies

- **Association of Test Publishers (ATP).** Its "About" page (https://www.testpublishers.org/about-atp) links to an "Annual Report" but gives no testing-volume statistics. I found no ATP industry-volume figure: **not found / not verified**.

---

## 2. How many certifications exist and how the landscape splits

### Credential Engine, *Counting Credentials 2025* (December 2025)
Source: https://credentialengine.org/wp-content/uploads/2025/12/Counting-Credentials-2025-Report.pdf

- "This report identifies 1,850,034 unique credentials in seven distinct credential categories, 134,491 providers".
- Counts by type (2025, with the 2022 count in brackets):

  | Type | 2025 (2022) |
  |---|---|
  | Badges | 1,022,028 (430,272) |
  | Certificates | 486,352 (330,830) |
  | Micro-credentials | 3,384 (1,603) |
  | **Certifications** | **6,892 (7,051)** |
  | Degrees | 264,099 (238,271) |
  | Occupational licences | 14,331 (12,152) |

- **Certification providers:** 1,250 in 2025, down from 1,586 in 2022.
- Definition used: "Certifications require a test and typically expire", unlike certificates. Example certifications the report names: "Project Management Professional, Certified Medical Assistant, or Certified Welder".
- On the method, the report says the lower count "reflects improved deduplication techniques across the multiple data sources, rather than fewer certifications being offered in the United States". The sources were ETA COS Certification Finder, ACAP, ANSI, COOL, ICAC and NCCA. The research team also "found 886 certifications not included in Certification Finder."
- **Implication:** in the US alone there are roughly 7,000 distinct exam-based certifications from about 1,250 bodies. That is a very long tail.

### Who holds certifications, by sector: BLS Current Population Survey, 2025 annual averages
Sources: https://www.bls.gov/cps/cpsaat52.htm (by industry) and https://www.bls.gov/cps/cpsaat53.htm (by occupation). The 2025 figures are 11-month averages, because October 2025 was not collected due to the federal shutdown.

- 163,493 thousand employed. **24.0%** hold a certification or licence. **2.5%** hold a certification but no licence; 21.6% hold a licence.
- BLS definition: "Certifications are issued by a non-governmental certification body… A license is awarded by a government agency".
- **By occupation.** The "certification, no licence" column is the purest signal of voluntary, non-government certification:

| Occupation group | Certification or licence | Certification, no licence |
|---|---|---|
| Healthcare practitioners and technical | 75.1% | 3.8% |
| Legal | 62.2% | 2.4% |
| Education, training, library | 49.8% | 1.6% |
| Community and social services | 40.4% | 4.4% |
| Healthcare support | 36.0% | 2.6% |
| Architecture and engineering | 22.4% | 3.3% |
| Installation, maintenance and repair | 23.1% | 4.2% |
| Business and financial operations | 21.3% | 4.0% |
| **Computer and mathematical** | **13.3%** | **6.9%** (highest of any group) |
| Construction and extraction | 18.1% | 1.8% |
| Office and administrative support | 10.3% | 1.4% |

- **By industry:** Financial activities 31.4% (4.1% certification only). Education and health services 44.7%. Professional and business services 20.1% (3.4% certification only). Information 9.1% (2.7% certification only).
- **Reading.** In the US, IT and computing is where voluntary certification without a licence is most common. Healthcare, legal and education are dominated by licensing (state boards, government exams). Finance and trades mix both.

### Other registries
- The Credential Engine report above draws on the ETA COS (CareerOneStop) Certification Finder, ANSI, NCCA, ICAC and others. I fetched no breakdown by sector from those registries, so **not verified**.

---

## 3. Candidate volumes for major programmes

| Programme | Figure (as published) | Source |
|---|---|---|
| **AWS** | "As of January 2025, there are more than 1.42 million active AWS Certifications and 1.05 million unique AWS Certified individuals." | https://aws.amazon.com/certification/ |
| **CompTIA** | "More than one million individuals worldwide have earned the CompTIA Security+ certification"; Security+ "was introduced in 2002 and surpassed the 500,000 certified milestone in 2019". Boilerplate: "Over four million CompTIA certifications have been awarded". | https://www.comptia.org/en/about-us/news/press-releases/1-million-strong-how-comptia-security-shapes-cybersecurity-skills-around-the-world/ |
| **ISC2** | "more than 270,000 certified members, and associates" | https://www.isc2.org/about |
| ISC2 CISSP | "As of December 2025, there were 191,036 ISC2 members holding the CISSP certification worldwide". This is from Wikipedia, citing ISC2 member counts. The official member-count page redirected to /about when fetched, so the figure is secondary and not verified at source. | https://en.wikipedia.org/wiki/Certified_Information_Systems_Security_Professional |
| **CFA Institute** | Exam sittings (all levels) by year: 2019 = 270,456; 2024 = 156,727; **2025 = 162,589** (Feb 30,979 + May 39,227 + Aug 50,628 + Nov 41,755). Level I in November 2025: "26,752 candidates… 43 percent have passed". Cumulative 1963–2026 sittings: 4,164,359. | https://www.cfainstitute.org/sites/default/files/docs/programs/cfa-program/candidate-resources/1963-current-candidate-examination-results.pdf ; https://www.cfainstitute.org/about/press-room/2026/cfa-program-results-level-i-november-2025 |
| **PMI / PMP** | pmi.org returned 403, so the current holder count is **not verified**. Search snippets said "1.7M" and "over 1.6 million". Wikipedia (secondary) gives "As of 31 July 2020, there are 1,036,368 active PMP-certified individuals". It also says PMI had "746,689 members" in 2025. A PMI statement reproduced by gbcghanaonline.com says: "In the first five months of 2026, PMP certifications granted increased by 36% year over year." That window came just before the 9 July 2026 exam change, so it may include a rush to certify before the change. | https://en.wikipedia.org/wiki/Project_Management_Professional ; https://en.wikipedia.org/wiki/Project_Management_Institute ; https://www.gbcghanaonline.com/general/pmi-pmp-certification/2026/ |
| **CPA (US)** | "In 2025, first-time CPA Exam candidates were at their highest level since 2018, except for the 2023 spike in volume preceding the change to the new exam format." Exam passers and unique candidates were "at their highest since 2017, with the same exception." No absolute number is given on that page. | https://www.aicpa-cima.com/news/article/u-s-accounting-undergraduate-enrollment-continues-to-outpace-growth-rate-for-business-majors-overall |
| **Microsoft** | No total certification count found on a fetched page: **not verified**. | — |
| **Cisco** | cisco.com returned 403, so this is **not verified**. | — |

### Badge issuance as a proxy (Credly by Pearson, vendor claims)
Credly badges include training completions as well as exam-based certifications, so these are an upper-bound proxy, not exam counts.

- "Credly, issued its 100 millionth unique badge" (7 Jan 2025). "over 48 million individuals have earned credentials through Credly". https://plc.pearson.com/en-GB/news-and-insights/news/100-million-digital-credentials-issued-through-credly-pearson-fosters-future
- Badges issued on Credly in 2025, by issuer:

  | Issuer | 2025 badges |
  |---|---|
  | Cisco | "More than 3.8 million" |
  | IBM | "over 2.78 million" |
  | Google Cloud | "Over 2.08 million" |
  | AWS | "over 1.32 million" |
  | PMI | "over 1 million" |
  | Microsoft | "more than 937,000" |
  | SAP | "More than 895,000" |
  | CompTIA | "over 665,000" |

  Source: https://info.credly.com/top-credly-elite-issuers

---

## 4. Why people certify: salary and hiring surveys

All of these are surveys run by organisations that sell certification or training. The samples are self-selected, often certified candidates themselves, so treat them as directional.

### Pearson VUE, *2025 Value of IT Certification Candidate Report*
Source: https://www.pearsonvue.com/content/dam/VUE/vue/en/documents/voc/pearson-vue-2025-value-of-certification-report.pdf

- The sample was "Nearly 24,000 professionals who prepared for and earned IT certifications" with Pearson VUE, so it is not representative of all IT workers.
- 82% "gained confidence to explore and pursue new job opportunities".
- 63% "received a job promotion or anticipated one".
- 32% "received a salary increase after certification and 41% were hoping to receive one. 31% of raises received were above 20%."
- 79% saw work quality rise; 70% "are more productive".
- 84% "are likely or very likely to pursue additional certifications in the next 12 months". This matters because certification is repeat demand.

### Skillsoft, *IT Skills and Salary Report* (2024 edition, released 14 Nov 2024)
Sources: https://www.skillsoft.com/press-releases/skillsoft-new-it-skills-and-salary-report-highlights-trends-impacting-technology-careers-investments-and-talent-strategies-for-2025 ; PDF mirror https://img.itmastersmag.com/wp-content/uploads/2025/09/10031250/Skillsoft_IT_Skills_Salary_Report_2024-2025.pdf ; blog https://www.skillsoft.com/blog/tech-salaries-climbed-5--thanks-to-skills-and-certifications

- The survey had "more than 5,100" responses, recruited through Skillsoft's own channels (blogs, newsletters, social media).
- "88% of respondents reported that they held at least one certification. In 2024, that figure rose to 93%." This reflects the sample as much as the market.
- "Nearly all (97%) IT decision-makers say certified staff adds value"; "Twenty-two percent estimate that value at $30,000 or more".
- The top reasons IT professionals train include "Prepare for a career certification 43%" and "Maintain certification(s) or recertify 41%".
- Of job-changers, 67% "said their technical certifications appealed to hiring managers".
- The worldwide average IT salary was "$88,448", with IT professionals earning "an average of 5% more than last year".
- After training: "I received a raise 20%", "I got a new job 16%", "I received a promotion 16%".

### PMI, *Earning Power: Project Management Salary Survey*, 14th edition (13 Nov 2025)
Source: PDF mirror of PMI press release, https://pmworldlibrary.net/wp-content/uploads/2025/11/251113-PMI-Salary-Survey-14th-Edition-Press-Release.pdf (pmi.org itself returned 403)

- PMP holders "Earn 17% Higher Median Salaries Than Non-Certified Professionals Across 21 Countries Surveyed".
- In the US, the median was "$135,000, compared to $109,157 for those non-certified - a nearly 24% difference".
- "up to 30 million more project professionals are needed by 2035".
- The sample was 14,628 project professionals, fielded March–April 2025.

### Labour-market context (CompTIA, *State of the Tech Workforce 2026*)
Source: https://www.comptia.org/en-us/about-us/news/press-releases/key-employment-metrics-market-insights-and-the-impact-of-ai-revealed-in-comptia-state-of-tech-workforce-2026-report/

- "In 2025, net tech employment decreased 0.3%, resulting in approximately 33,624 fewer jobs."
- For 2026, CompTIA "estimates net tech employment will grow by 1.9%… creating 185,499 new jobs".
- "In January 2026, more than 275,000 active job postings referenced a need for some level of AI skills."

---

## 5. Exam churn: how often exams are retired or revised

This matters most for a free-deck site, because every revision can make existing decks out of date.

- **CompTIA (published policy).** "new exams are released approximately every three years". "When a new version of the exam launches, the old one is still available for at least six months". "With three years between launches, new exams often have significant changes… other times, exam domains are completely overhauled." Source: https://www.comptia.org/en/blog/certification-exam-development-lifecycle/
- **Microsoft.** Microsoft says it continually reviews certifications "and retire those that are no longer relevant". It publishes rolling 12-month retirement lists. Sources: https://learn.microsoft.com/en-us/credentials/support/credential-retirement and https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams
  - **Certifications** retired between 31 Dec 2025 and 31 Aug 2026: 14. Examples: Azure AI Engineer Associate (30 Jun 2026), Azure Developer Associate (31 Jul 2026), Azure Security Engineer Associate (31 Aug 2026), Azure Data Scientist Associate (1 Jun 2026), Microsoft 365 Fundamentals (31 Mar 2026). Microsoft 365 Administrator Expert is scheduled for 30 Nov 2026.
  - **Exams** retired in the same window: 15, including AI-102, AI-900, AZ-204, AZ-500 and DP-100. AZ-800 and AZ-801 are scheduled for 30 Sep 2026, and MS-102 for 30 Nov 2026.
  - **Applied Skills** credentials retired or scheduled in the last year: 21. Some were AI-agent credentials retired only months after launch, for example "Create an AI agent" (28 May 2026).
  - Put simply: several of Microsoft's most-taken Azure exams were retired inside a single year.
- **AWS.** "We are retiring three specialty AWS Certifications in April 2024: … Data Analytics – Specialty, … Database – Specialty, and … SAP on AWS – Specialty." AWS also retired its own "Official Practice Question Sets, Official Practice Exams, and the Exam Prep courses" for those three. New in 2024: Data Engineer – Associate. Source (30 Jan 2024): https://aws.amazon.com/blogs/training-and-certification/aws-certification-retirements-and-launches/
- **PMI / PMP.** The new PMP exam launched on 9 July 2026. PMI's text, reproduced by gbcghanaonline.com, says it "places greater emphasis on business alignment, strategic decision-making… and real-world delivery in AI-enabled environments". https://www.gbcghanaonline.com/general/pmi-pmp-certification/2026/ The official PMI page returned 403. The domain-weight changes quoted in search snippets (Business Environment 8% to 26%) are **not verified**.
- **ISC2 / CISSP.** "On April 15, 2024, a refreshed exam outline applies… Job Task Analysis… on a triennial cycle" (Wikipedia, secondary). https://en.wikipedia.org/wiki/Certified_Information_Systems_Security_Professional
- **CFA.** The CFA press release mentions "newly introduced Practical Skills Modules", but I found no published revision cadence: **not verified**.
- **Cisco.** The policy pages returned 403. Search snippets mentioned "3-month notice for minor updates and 6-month notice for major updates", which is **not verified**.
- **Why this matters.** Credential Engine defines certifications as credentials that "require a test and typically expire" (report cited in section 2), so demand for study material recurs through both new candidates and recertification.

---

## 6. Trends

### Direction of demand
- **Mixed, and varying by programme.**
  - **CFA** exam sittings fell about 40% from the 2019 peak (270,456) to 2025 (162,589). 2025 was up 3.7% on 2024 (156,727). February and May 2026 sittings (84,952) were up 21% on the same windows of 2025 (70,206). CFA PDF, section 3.
  - **CompTIA Security+** holders doubled from 500,000 (2019) to more than 1 million (2025). comptia.org, section 3.
  - **PMP**: "certifications granted increased by 36% year over year" in January–May 2026, possibly pulled forward by the July exam change (section 3).
  - **CPA**: first-time candidates in 2025 were the highest since 2018, excluding the 2023 spike (section 3).
  - **Pearson Professional Assessments** revenue was up only 1% underlying in 2025, with "low to mid-single digit" growth guided for 2026 across its division (section 1).
  - **Credential Engine:** US certifications were flat (6,892 vs 7,051, a deduplication effect), while badges grew from 430,272 to 1,022,028 between 2022 and 2025. Growth is in micro-credentials and badges, not in the number of formal certifications.

### AI-related certifications
- **Pearson VUE 2025:** candidates' interest in "Artificial Intelligence/Machine Learning" rose from 17% (2022) to 35% (2024). Cloud rose from 40% to 49%. Networking and wireless fell from 22% to 14%, and virtualisation from 23% to 15%. (VoC PDF, above.)
- **Skillsoft:** IT decision-makers' top investment priorities are "AI / ML (47%), cybersecurity and information security (42%), and cloud computing (36%)". Teams' AI/ML skills are rated lowest of about 30 competencies (34%). (Skillsoft press release, above.)
- **New AI certifications:**
  - AWS Certified AI Practitioner is a "Foundational" certification covering "AI, machine learning (ML), and generative AI concepts". https://aws.amazon.com/certification/certified-ai-practitioner/ (A launch date of 13 Aug 2024 was in search snippets only: **not verified**.)
  - Google Cloud announced "a first-of-its-kind Generative AI Leader certification program… designed for non-technical professionals". https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/generative-ai-leader-certification/
  - Microsoft is simultaneously retiring AI certifications (AI-102, AI-900) and AI Applied Skills (section 5). AI credentials churn fastest.

### How candidates study
- **Pearson VUE 2025:** "Participation in employer-sponsored training and commercial training centers for exam preparation decreased, while self-directed learning increased from 28% to 33% in 2024." Also: "The proportion of candidates purchasing training and certification vouchers from training course providers and from exam provider websites has decreased significantly, while Amazon.com purchases have increased." The full breakdown by prep method is a chart image, so it was not extractable and is **not verified**. (VoC PDF, above.)
- **Skillsoft:** "IT professionals find in-person, instructor-led sessions as the most effective". (Skillsoft press release, above.)
- **No survey was found that measures flashcard or spaced-repetition use among professional-certification candidates** (IT, finance, PM). This is a real evidence gap.

---

## 7. The flashcard and spaced-repetition category

### Anki
- **AnkiDroid (Google Play):** "10M+ Downloads", "165K reviews". The listing shows "Updated on" May 3, 2026. Fetched 2026-09-23. https://play.google.com/store/apps/details?id=com.ichi2.anki&hl=en_US
- **AnkiMobile (iOS, US store):** "2.3K Ratings" (fetched 2026-09-23). https://apps.apple.com/us/app/ankimobile-flashcards/id373493387 Apple does not publish download counts. A search snippet quoted Sensor Tower's "30k downloads and $700k revenue" for a month, which is **not verified**.
- **Anki official site:** no user count; it says only that "Anki can handle decks of 100,000+ cards". https://apps.ankiweb.net/ I found no official AnkiWeb user figure: **not verified**.
- **AnkiHub:** "trusted by over 100,000 medical students" (AnKing Step Deck page; vendor claim). https://www.ankihub.net/step-deck
- **Medical-school evidence.** This is not professional certification, but it is the best-documented flashcard use for a high-stakes exam. In a survey at one school, "165 students responded… 92 (56%) identified as daily Anki users. Daily Anki use was correlated with increased Step 1 score". https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10176558/fullTextXML (J Med Educ Curric Dev, 2023). In an Irish graduate-entry cohort, "80% of study participants reported using Anki… there was no statistically significant benefit for Anki usage in terms of performance outcome". https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12961065/fullTextXML (Med Sci Educ). Figures in search snippets ("86.2% of American medical students use Anki", "68.3% of 560 students") are **not verified**.

### Quizlet
- **Google Play:** "50M+ Downloads", "916K reviews" (fetched 2026-09-23). https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid&hl=en_US
- **Wikipedia (secondary):** "as of 2021, Quizlet reported more than 60 million monthly active users and over 500 million user-generated study sets". Also: "In March 2026, Quizlet integrated with ChatGPT". https://en.wikipedia.org/wiki/Quizlet
- quizlet.com returned 403, so its own current figures are **not verified**.

### Brainscape
- **Google Play:** "1M+ Downloads", "13.8K reviews". https://play.google.com/store/apps/details?id=com.brainscape.mobile.portal&hl=en_US
- **Learner counts on Brainscape's "Certified" (publisher-made) decks.** These are vendor figures, read 2026-09-23 from https://www.brainscape.com/learn. They are one of the few public signals of demand for flashcards by exam:

  | Deck | Learners |
  |---|---|
  | **Healthcare, law and admissions** | |
  | USMLE Step 1 | 848,881 |
  | MBE (bar) | 205,371 |
  | NCLEX-RN | 181,093 |
  | MCAT | 113,763 |
  | NREMT Paramedic | 57,086 |
  | NCLEX-PN | 34,520 |
  | **Finance** | |
  | Series 7 Top-off | 21,836 |
  | SIE | 12,584 |
  | CPA | 3,959 |
  | Series 65 | 2,632 |
  | CFA | 2,136 |
  | CFP | 2,106 |
  | **IT and project management** | |
  | PMP | 1,547 |
  | CISSP | 1,359 |
  | CCNA | 1,160 |
  | AWS Cloud Practitioner | 989 |
  | CompTIA A+ 1201 | 884 |
  | AWS Solutions Architect Associate | 764 |
  | AWS AI Practitioner | 555 |
  | **Trades** | |
  | Journeyman and Master Electrician decks | 240–508 each |

  - **Reading.** On this platform, flashcard uptake is concentrated in medical, nursing, bar and securities licensing. IT certification decks have about 1,000 learners each. That may reflect Brainscape's audience and deck age rather than the whole market.

### Flashcard-app market-size estimates (vendor research reports, not audited, and inconsistent with each other)
- **Market Intelo:** "The global flashcard apps market reached $1.8 billion in 2025 and is projected to grow to $4.2 billion by 2034, representing a… compound annual growth rate of 11.2%". https://marketintelo.com/report/flashcard-apps-market
- **WiseGuy Reports:** "valued at USD 2164.2 Million in 2025 and is projected to grow to USD 4000 Million by 2035, at a CAGR of 6.3%". https://www.wiseguyreports.com/reports/flashcard-app-market
- **Verified Market Reports:** a global "Market Size (2026) USD 2.01 Billion". The same page also states a North American market of "USD 2.5 billion in 2024", which is larger than its own global figure. This inconsistency shows how unreliable these reports are. https://www.verifiedmarketreports.com/product/flashcard-app-market/
- **Reading.** Treat these reports as saying only "low single-digit billions of dollars". None is usable for sizing.

---

## 8. Gaps and caveats

- **No certification-only exam volume** is published by any delivery provider, and I found no ATP industry-volume statistic.
- Current PMP holder totals, Cisco figures, Prometric's current volume and Quizlet's own figures could not be verified because of 403 blocks.
- I found no survey of study-method preferences, flashcards included, among professional-certification candidates. The evidence for flashcard use in high-stakes exams comes from medical education and platform learner counts.
- Candidate surveys (Pearson VUE, Skillsoft, PMI) are self-selected and run by organisations with a commercial interest in certification.
