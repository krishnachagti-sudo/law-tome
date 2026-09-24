# Competitive landscape: certification flashcards and spaced repetition

Researched 2026-09-23. Scope was narrowed partway through: this report covers **flashcards and spaced-repetition (SRS) offerings for certification exams**. Courses, video platforms and general practice-test publishers get one line each.

**Evidence rules.** Every claim below comes from a page fetched during this task and saved under `scratchpad/certs/raw-comp/`. Pages were fetched with curl and the text was extracted with a small script (`scratchpad/certs/fetchc.py`).
- AnkiWeb deck data came from AnkiWeb's own JSON/protobuf endpoint behind each public deck page: `https://ankiweb.net/svc/shared/item-info?sharedId=<id>`. The decoded raw files are in `raw-comp/ankiweb/`, and the script is `scratchpad/certs/ankiweb_info.py`.
- GitHub data came from the GitHub search API through the GitHub MCP tool, because the session proxy returned 403 for direct github.com fetches. It is recorded in `raw-comp/github/search_results_via_mcp.txt`.
- "Not verified" means the page could not be fetched as raw text (Quizlet, Etsy, Reddit, parts of Skill Builder, the CompTIA help centre), or the number appeared only in a search snippet or a summarising tool.

---

## 0. Summary

1. **Nobody found offers free, sourced (citing official docs per card), versioned, standardised flashcards across many certifications with Anki export.** The closest offerings each lack at least one of these properties:
   - **AWSomecards:** free, but AWS only and web only. Its Anki decks were retired.
   - **Brainscape Certified:** multi-cert, but paid and has no Anki export. Its user-generated CompTIA catalogue includes retired exam versions.
   - **Crucial Exams:** flashcards for about 80 exams, but paid, bundled with practice tests, and not Anki.
   - **UniPrep2Go:** a catalogue of paid Anki decks covering 124 pathways, mostly finance, licensing and trades.
   - **Procensic:** a single author publishing large AI-coach-linked "2026 Complete Exam Question Bank" Anki decks. They are free on AnkiWeb and act as a funnel to a paid Custom GPT.
2. **AnkiWeb is where free cert decks live, but it is fragmented and stale.** For every cert sampled there were several overlapping decks. Most were last updated one or more exam versions ago and have single-digit ratings. Several popular deck IDs are now "missing" (removed). Anonymous search is rate-limited: the API returned "Please log in to perform more searches."
3. **Vendors increasingly ship their own flashcards, mostly behind a form or a paywall, and none as Anki decks.** This includes ISC2 (free, gated by a form), AWS Skill Builder exam-prep plans, and CompTIA CertMaster (partly not verified). Google Cloud's own GitHub Anki flashcard repo is **archived**.
4. **The SRS category is growing.** AnkiDroid's Play Store install band grew from "1,000,000 - 5,000,000" (2016) to "5,000,000+" (2021) to "10M+" (2023 and still today). Anki's GitHub repo has 31,467 stars. FSRS is built into Anki 23.10+. Market-research estimates are mutually inconsistent and should not be relied on.

---

## 1. Flashcard offerings from practice-test and exam-prep publishers

| Provider | Flashcards? | Scale / price seen | Anki export? | Source |
|---|---|---|---|---|
| **Tutorials Dojo** | Yes, as a bonus. The course page for AWS SAA practice exams says "BONUS Flashcards" and "NEW FEATURE! FLASHCARDS – unique visual tools found at the end of the course" and lists "Flash Cards - Part 1 / Part 2" and "Interactive Flashcards". | Practice exams are listed at $14.99; the homepage shows "400+ questions, ⭐4.9/5 from 200,000+ learners" for SAA-C03. | Not verified (no Anki mention seen). | https://portal.tutorialsdojo.com/courses/aws-certified-solutions-architect-associate-practice-exams/ ; https://portal.tutorialsdojo.com/product-category/aws/ ; https://tutorialsdojo.com/ |
| **Crucial Exams** | Yes, a core product: "Certification practice tests, Questions and Flashcards for certification exams." Each exam lists a flashcard count, e.g. Security+ SY0-701 has 1,400 questions and 374 flashcards; A+ 220-1201 has 1,000 questions and 152 flashcards; Network+ N10-009 has 600 questions and 111 flashcards. The homepage counts 159 "Flashcards" labels. | "80,374+ users". IT & Cybersecurity package: $19.99/month, $44.99 for 3 months, $119.99/year, $189.99 lifetime. Includes an "AI Tutor". Android app: 50K+ downloads. | Not seen. The site is a web and app platform. | https://www.crucialexams.com/ ; https://www.crucialexams.com/plans/information-technology ; https://play.google.com/store/apps/details?id=com.crucialexams |
| **Digital Cloud Training** (with Brainscape) | Yes. "AWS Certification Flashcards – powered by Brainscape", with decks of 287, 130 and 254 flashcards for CLF, AIF and SAA. | "Access ALL Flashcards for 6 Months for only $9.99/month." | No. The decks live inside Brainscape. | https://digitalcloud.training/aws-certification-flashcards/ |
| MeasureUp | No flashcards seen. Sells practice tests, including "ServiceNow Official Practice Test". | "From $21/month" subscription; single tests $99.00 (shown discounted to $64.35). | n/a | https://www.measureup.com/ |
| Boson | No flashcards seen. Sells ExSim-Max practice exams. | For example, "6 Exams – 900 Questions $99.00 / year" (CISSP). | n/a | https://www.boson.com/exsim-max-practice-exams |
| Whizlabs | No flashcards seen. | Its blog claims "4,500+ training videos, 25,000 practice tests, and 1,000+ Hands-on Labs" and "more than 5 million professionals". Subscription prices were not visible in raw text (not verified). | n/a | https://www.whizlabs.com/blog/whizlabs-premium-subscription-plans/ |
| Professor Messer | Free videos plus paid course notes and "Pop Quizzes". No flashcards seen. | n/a | n/a | https://www.professormesser.com/ |
| ExamCompass | Free practice tests, including acronym quizzes such as "A+ 220-1201 Exam Acronyms Quiz". No flashcards. | Free | n/a | https://www.examcompass.com/ |
| Dion Training | Courses and bundles ($29.99 to $1,029.00 seen). No flashcards seen on the homepage. Claims "more than 3 million learners across the Dion Training platform". | | n/a | https://www.diontraining.com/ |

Kaplan IT: kaplanlearn.com returned only an LMS stub, and kaplanitcertprep.com failed through the proxy (502). Not verified.

Course platforms (Udemy, Pluralsight, CBT Nuggets and others) were **not mapped**, per the scope change. They exist as a large adjacent paid market.

---

## 2. Vendor-official flashcards and official practice material

| Vendor | What's offered | Anki? | Source |
|---|---|---|---|
| **ISC2** | "Official ISC2 Flash Cards … Our free interactive flash cards." The CISSP page says: "Fill out the short form for FREE access to this resource." Pages also exist for CCSP, CC, CSSLP, ISSAP, ISSMP and ISSEP (ISSEP is not verified). The paid ISC2 Official Exam Prep app has "5,000+ practice questions based on Sybex/Wiley content" and 50K+ Android downloads. | No. They are interactive and gated behind a form. | https://www.isc2.org/certifications/flash-cards ; https://cloud.connect.isc2.org/cissp-flashcards ; https://play.google.com/store/apps/details?id=com.learnzapp.cissp |
| **AWS** | The Cloud Practitioner page says: "Reinforce your knowledge and identify learning gaps with exam-style questions and flashcards" (Skill Builder exam prep). The cert-prep page says: "Use free content like AWS Certification Official Practice Question Sets … Subscribe to get access to AWS Certification Official Practice Exams." | No | https://aws.amazon.com/certification/certified-cloud-practitioner/ ; https://aws.amazon.com/certification/certification-prep/ |
| **CompTIA** | One AnkiWeb deck description says it is "mostly a port of the learn.comptia.org flashcards", which implies CompTIA's learning platform has flashcards. CompTIA's CertMaster Learn page and help article did not confirm this in raw text (403 / no match). **Not verified** directly from CompTIA. | No | https://ankiweb.net/shared/info/2104123105 |
| **Google Cloud** | The GoogleCloudPlatform org has a repo, `google-cloud-flashcards`: "Anki flashcards to study and prepare Google Cloud Platform (GCP) certifications". It is **archived**, has 6 stars and was created in 2019. | Yes, but abandoned. | raw-comp/github/search_results_via_mcp.txt (GitHub API) |
| Microsoft | No official flashcards found in this task. Its official practice tests are sold through MeasureUp (e.g. "Microsoft Practice Test AZ-104"); the "official" label is MeasureUp's, not verified with Microsoft. | n/a | https://www.measureup.com/ |

---

## 3. Flashcard marketplaces and deck sources

### 3a. AnkiWeb shared decks (free)

Sample: decks found by web search for each cert. Data comes from AnkiWeb's endpoint behind each page. "Notes" is the note count (cards may be higher). "Rating" is thumbs up/down. Each row's URL is `https://ankiweb.net/shared/info/<id>`.

**AWS Solutions Architect Associate**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 1011207193 | AWS Certified Solutions Architect Associate (SAA-C03) | 296 | 2024-03-12 | +12/-0 |
| 2070564159 | AWS Solutions Architect Deck (Niche & Difficult Questions) | 46 | 2025-10-03 | 0 |
| 210617321 | My AWS Solution Architect Associate Notes | 466 | 2017-10-11 | +7 |
| 1259908002 | AWS Solutions Architect Cert | 208 | 2016-01-13 | +6 |
| 427498513, 189094824, 58183279 | (removed: API returns "missing") | | | |

**AWS Cloud Practitioner**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 2018763693 | AWS Certified Cloud Practitioner CLF-C02 2026 Complete Exam (Procensic) | 1521 | 2026-06-15 | +1 |
| 1766259221 | AWS CLF-C02 Certified Cloud Practitioner | 174 | 2024-11-06 | 0 |
| 1469596231 | AWS Cloud Practitioner (CLF-C02) | 174 | 2024-02-22 | +5 |
| 449552125 | AWS Cloud Practitioner 2021 | 202 | 2021-01-18 | +20/-3 |
| 205735104, 1199695339 | (removed) | | | |

**CompTIA Security+ SY0-701**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 2012142972 | CompTIA Security+ SY0-701 2026 Complete Exam Question Bank (Procensic) | 1475 | 2026-06-11 | +1 |
| 2104123105 | CompTIA Security+ 701 ("mostly a port of the learn.comptia.org flashcards") | 843 | 2025-11-23 | +4 |
| 633229907 | Security+ SY0-701 Vocabulary | 538 | 2024-05-30 | 0 |
| 1869989249 | Comptia Security+ SY0-701 Acronym List ("from the official … guide") | 328 | 2024-03-29 | +11 |
| 660264602 / 667641678 | Acronyms / Abbreviations (two more separate acronym decks) | 327 / 322 | 2025 | +1 each |
| 1310400593 | My CompTIA Security+ SY0-701 Hardened Playbook | 329 | 2025-03-07 | +1 |
| 725030515 | Ports ("from my notes Udemy Notes (Dion Training)") | 28 | 2024-03-29 | +1 |
| 1745056245 | General Security Concepts | 25 | 2025-06-25 | 0 |

**CompTIA A+ and Network+**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 913591342 | comptia a+ 220-1201 ("based off of a brainscape deck built by user felipe perla") | 670 | 2025-08-09 | +3 |
| 514172082, 455923775, 1064848707, 862599225, 32936139 | A+ Core 1 (220-1201): one deck per domain, same author | 142 / 27 / 38 / 159 / 154 | 2026-01-15 | 0–1 |
| 1072443810 | CompTIA A+ 220-1101 (Based on Professor Messer) | 500 | 2023-02-17 | +16/-3 |
| 101398690 | CompTIA Network+ N10-009 2025 | 531 | 2025-03-29 | +4 |
| 1667201337 | CompTIA Network+ N10-009 COMPLETE | 422 | 2025-03-09 | +5 |
| 1845717606 | N10-009 Acronyms | 161 | 2024-07-25 | +4 |
| 1483554286 | Network+ based on Professor Messer | 207 | 2019-02-05 | +2 |

**Cisco CCNA 200-301.** This is the one strong example of a community deck that is well kept up.
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 591991787 | Cisco CCNA 200-301 (maps to "CCNA 200-301 Official Cert Guide" chapters) | 884 | 2024-07-31 | **+268/-4** |
| 450062116 / 289625562 / 459642636 | Three re-splits or reworks of the same deck | 882–885 | 2020–2024 | +1 / +9 / +16 |
| 107508859 | Randrage's CCNA (200-125), a retired exam | 4141 | 2020-09-13 | +2 |

**ISC2 CISSP**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 1644481277 | CISSP 10k ("~10k cards from AIO and OSG") | 9103 | 2021-04-19 | +3 |
| 773862970 | CISSP – By Josh Madakor | 1043 | 2023-06-29 | +8/-1 |
| 1296455785 | Same deck "without Josh Madakor" (ads removed) | 1043 | 2024-09-16 | +1 |
| 837027284 | CISSP Flash cards | 624 | 2022-12-06 | 0 |
| 28471173 | (removed) | | | |

**Microsoft Azure**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 2049948283 | Exam AZ-900 (built from the official "Skills measured" document) | 146 | 2019-12-24 | +13 |
| 599919324 | AZ-900 Practice (cites a GitHub source, Ditectrev) | 486 | 2024-09-27 | 0 |
| 90249090 / 1121741533 | AZ-900 Exam Review Deck / its fork | 229 / 332 | 2021 / 2022 | +6 / +4 |
| 2119884346 | "AZ-104 (AZ104) **Dump** with Explanations" | 388 | 2022-11-17 | +9 |
| 2030944470 | AZ-104: Azure Administrator Exam | 74 | 2022-10-06 | +1 |

**PMI PMP**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 177433003 | PMETIS — PMP 2026 Complete Exam Question Bank (Procensic) | 1656 | 2026-06-08 | 0 |
| 919640566 | PMP Deck ACo 249 | 1112 | 2025-01-20 | +1 |
| 201627782 | PMP/CAPM – PMBOK 7th Edition | 457 | 2024-01-24 | +6 |
| 2102690929 | PMI Lexicon of Project Management Terms | 190 | 2024-01-29 | 0 |
| 1287927771 | PMP 2023 (from a Udemy course) | 294 | 2024-03-26 | 0 |
| 2115418494, 128136558 | (removed) | | | |

**Finance**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 1338419429 | The Ultimate CFA Level 1 Anki Deck | 1400 | **2015**-07-31 | +6 |
| 1532887591 | CFA Level 1 | 1305 | 2023-05-12 | 0 |
| 1328202034 | CPA FAR (after June 2022) ("based off Becker study materials") | 1804 | 2023-01-21 | +4 |
| 1798603809 | CPA FAR | 385 | 2013-12-24 | 0 |
| 2100725365 | CPA – Audit & Assurance Elective Module | 240 | 2020-05-29 | +2 |
| 892986835 | FINRA Series 7 | 922 | 2017-07-20 | 0 |

FRM: web search surfaced no FRM deck on AnkiWeb.

**Healthcare (NCLEX)**
| ID | Title | Notes | Last updated | Rating |
|---|---|---|---|---|
| 215588071 | nclex review | 2647 | 2021-03-23 | +3 |
| 405918878 | Saunders Comprehensive Review NCLEX-RN (8th Ed.) | 1026 | 2021-10-08 | +8 |
| 1438949479 | NCLEX-RN 400+ Flashcards | 407 | 2025-09-08 | 0 |
| 2147420791 | NCLEX 2019 (modelled on NRSNG flashcards) | 118 | 2019-09-02 | +2 |

**What the sample shows about quality and recency (all from the rows above):**
- **Fragmentation.** Security+ SY0-701 alone has at least nine separate decks, including four separate acronym decks.
- **Ratings are tiny.** Only one sampled deck (CCNA 591991787) has more than 25 thumbs up.
- **Staleness.** Several top decks are years old (CFA 2015, Series 7 2017, CPA FAR 2013). Retired exam versions coexist with current ones.
- **Deletion.** 12 of the 83 sampled IDs now return "missing".
- **Sourcing is ad hoc.** Some decks cite official objective documents (Security+ acronyms, AZ-900 "Skills measured"). Others are derived from third-party courses (Becker, Dion, Messer, Udemy, Saunders) or from "dumps".
- **Access.** AnkiWeb's list API returned "Please log in to perform more searches." to an anonymous request (`https://ankiweb.net/svc/shared/list-decks?search=aws`).

### 3b. GitHub (free)

From the GitHub search API (see raw-comp/github/search_results_via_mcp.txt):
- The query "anki certification" returns **57 repos in total**. The top result, a Terraform Associate guide, has 94 stars. Everything else has 29 stars or fewer.
- The query "anki aws" returns 67 repos. The top AWS deck repo, moraesvic/aws-saa-anki, has 13 stars.
- Individual efforts include LPIC-1, a CompTIA SecAI+ guide ("210+ Anki flashcards … structured to the official exam objectives", created 2026-06), AZ-104 ("aligned with Microsoft Learn AZ-104 modules"), and GH-600.
- chlebik/CertificationMaterials (22 stars) is a single person's multi-cert collection.
- **No multi-cert, community-maintained, sourced catalogue repo was found.**

### 3c. Brainscape (paid; the closest "catalogue" of certified cert decks)
- The "Brainscape-Certified Flashcards" catalogue lists **Professional Certifications (130)**. Examples as decks / cards / learners:

  | Cert | Decks | Cards | Learners |
  |---|---|---|---|
  | PMP | 16 | 1,626 | 1,547 |
  | CISSP | 16 | 2,805 | 1,359 |
  | CCNA | 53 | 1,329 | 1,160 |
  | CompTIA A+ 1201 | 7 | 626 | 884 |
  | AWS Cloud Practitioner | 18 | 388 | 989 |
  | AWS SAA | 12 | 283 | 764 |
  | ITIL 4 | 12 | 374 | 303 |
  | CFA | 10 | 1,000 | 2,136 |
  | CPA | 22 | 1,938 | 3,959 |
  | SIE | 14 | 1,496 | 12,584 |
  | Series 7 Top-off | 8 | 1,509 | 21,836 |
  | Enrolled Agent | 54 | 2,472 | 9,216 |
  | NCLEX-RN | 78 | 3,767 | 181,093 |
  | AIGP | 9 | 783 | 1,977 |

  Source: https://www.brainscape.com/learn. Note that /learn/cfa-level-1 and similar URLs redirect there.
- The AWS decks were "Developed in partnership with Digital Cloud Training". Brainscape describes them as "Up to date" and "Rigorously tested and vetted by experts" (https://www.brainscape.com/learn/aws-cloud-practitioner). They do not cite official documentation per card; none was seen.
- Pricing: the free tier includes "Study 2,500 pre-loaded flashcards". Pro costs **$7.99/mo** and includes "Study unlimited Certified flashcards" (https://www.brainscape.com/pricing).
- Recency signal: Brainscape's CompTIA subject page (user-generated content) still lists Security+ SY0-401 / SY0-501, Network+ N10-006 / N10-007 and A+ 220-901 (https://www.brainscape.com/subjects/professional-certifications/technology-certifications/comptia-certifications).
- Android app: 1M+ downloads (https://play.google.com/store/apps/details?id=com.brainscape.mobile.portal).

### 3d. AWSomecards (free; the nearest to the founder's idea, but AWS only)
- The site describes itself as "Free, interactive flashcards for every major AWS certification". It shows "3,900+ flashcards", "11 certifications", "$0 forever free", "no signup", and "Every active AWS exam track, kept current with the latest blueprint codes." Progress is stored in the browser. Requests go through Telegram (https://awsomecards.com/).
- **Its Anki decks were retired.** The old Anki URL now says "Anki decks have been retired … now available as free interactive web flashcards" (https://awsomecards.com/anki-flashcards/cloud-practitioner).
- No per-card source citations were seen on the homepage.

### 3e. Paid Anki-deck sellers and catalogues
- **UniPrep2Go** (https://uniprep2go.study/decks) is a paid Anki-deck catalogue of "124 study pathways with free timed practice tests and linked Anki decks". Its questions are "original UniPrep2Go study aids — not leaked official items", with topic weights "modeled on published official exam outlines". Checkout runs through Gumroad and Lemon Squeezy. It publishes `/llms.txt` and `/api/facts`, which indicates it is optimising for AI answer engines.
  - Prices: CFA L1 342+ cards $29; CFA L2 495 cards $39; FRM Part 1 444 cards $29; SIE 300 cards $19; Series 7 300 cards $29; PMP 346+ cards $11; LEED GA 250+ cards $11; many state real-estate decks of 60 cards at $29.
  - No IT or cloud certs were seen in its list.
- **Procensic / PMETIS** (single author, "Farhad Mohammadi"). The author has shared 9 items on AnkiWeb (per the endpoint's `items_shared_by_user`). These are free on AnkiWeb and include: Security+ with 1,475 cards tagged by domain, objective, difficulty and skill; CLF-C02 with 1,521 cards; and PMP with 1,656 cards. The descriptions funnel users to a "Custom GPT … Exam Coach". The PMP description begins with leftover drafting text ("Use this revised version. It adds Procensic as the parent brand…"), which is a quality signal (https://ankiweb.net/shared/info/2012142972 ; https://ankiweb.net/shared/info/177433003).
- **Gumroad sellers:**
  - "ankiguru": CFA Level 1 deck at $9.99 ("over 1,000 flashcards … 10 organized decks … Based on trusted sources"); PMP deck at $9.99. Sources: https://ankiguru.gumroad.com/l/cfa-level-1-anki-flashcards-deck ; https://ankiguru.gumroad.com/l/pmp-exam-anki-flashcards-deck
  - "ankiking": INCOSE ASEP/CSEP deck at $19.99 (https://ankiking.gumroad.com/l/asep-anki-deck).
- **Etsy:** listings for CFA and AWS Anki decks appeared in search results, but Etsy returned 403. **Not verified.**
- **ankidecks.com** (a general Anki deck marketplace): no certification decks seen on its homepage, which is dominated by languages and medicine (https://ankidecks.com/).
- **Quizlet:** returned 403 to every fetch (including /mission and subject pages). Set counts are **not verified**. Its Android app shows 50M+ downloads (https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid).

---

## 4. AI flashcard generators marketed to cert candidates
- **AnkiGenix:** "Create AWS Certification flashcards instantly with AI. Turn notes, PDFs, and practice materials into Anki-ready study cards." Also: "Targeted flashcard generators for popular exams and certifications" (https://ankigenix.com/en/solutions).
- **CogniGuide:** has a page per cert (e.g. CompTIA A+). "Our engine parses the input, extracts core concepts, and crafts accurate question/answer pairs." It lets you set a target exam date. Free tier with "limited daily generation credits" (https://www.cogniguide.app/flashcards/anki-flashcards-comptia-a-plus).
- **FluentFlash:** "Browse 1,000+ subjects with AI-generated flashcards". Counts include AWS Solutions Architect 24 sets, CompTIA Security+ 20 sets and CompTIA A+ 19 sets (https://fluentflash.com/flashcards).
- **anki-decks.com (AnkiDecks AI):** an AI generator with .apkg export. It claims "100,000+ ready-made decks" and "100,000+ students". The free plan allows "up to 4 decks per month" (https://anki-decks.com/).
- **Custom GPTs as the upsell** (Procensic, above), and the **"AI Tutor"** built into Crucial Exams' paid plans ("Access to our AI assistant, Bash") (https://www.crucialexams.com/plans/information-technology).
- **The common pattern:** you bring your own material (course notes, PDFs), or the tool generates cards from a subject prompt. None of the pages seen claims per-card citation of official vendor documentation or version tracking against exam-objective changes.

---

## 5. Evidence that flashcards / SRS is a growing category
- **AnkiDroid install bands** from Google Play, via Wayback snapshots saved in raw-comp/wb_ankidroid_*.html:

  | When | Install band |
  |---|---|
  | June 2016 | "1,000,000 - 5,000,000" |
  | May 2019 | "1,000,000+" |
  | May 2021 | "5,000,000+" |
  | June 2023 | "10M+" |
  | Today | "10M+" downloads, 165K reviews |

  Wayback sources: https://web.archive.org/web/20160607061248/https://play.google.com/store/apps/details?id=com.ichi2.anki ; …/20190510172120/… ; …/20210523193752/… ; …/20230610191800/…. Current listing: https://play.google.com/store/apps/details?id=com.ichi2.anki&hl=en_US
- **Open-source traction** (GitHub API):

  | Repo | Stars | Forks |
  |---|---|---|
  | ankitects/anki | 31,467 | 3,257 |
  | ankidroid/Anki-Android | 11,848 | 2,925 |
  | open-spaced-repetition/fsrs4anki (created 2022-09) | 4,074 | — |

  The query "fsrs spaced repetition" returns 446 repos.
- **FSRS is mainstream in Anki.** The manual says "Ensure all of your Anki clients support FSRS. Anki 23.10, AnkiMobile 23.10…" and describes desired retention "The default is 90%" (https://docs.ankiweb.net/deck-options.html). Anki desktop and AnkiDroid are free; AnkiMobile is paid ("all purchases help fund Anki's development") (https://apps.ankiweb.net/).
- **Other install bands:** Quizlet 50M+, Brainscape 1M+, ISC2 official prep app 50K+, Crucial Exams 50K+ (Play Store pages above).
- **Market reports are inconsistent; do not cite them as fact.**

  | Report | Estimate |
  |---|---|
  | Market Intelo | "$1.8 billion in 2025 … $4.2 billion by 2034 … CAGR of 11.2%" |
  | Verified Market Reports | North America alone "USD 2.5 billion in 2024" |
  | Market Research Intellect | "approximately USD 553 Million in 2025 … CAGR of 10.5%" |
  | WiseGuy | "USD 2164.2 Million in 2025 … CAGR of 6.3%" |

  Sources: https://marketintelo.com/report/flashcard-apps-market ; https://www.verifiedmarketreports.com/product/flashcard-app-market/ ; https://www.marketresearchintellect.com/product/flashcard-app-market/ ; https://www.wiseguyreports.com/reports/flashcard-app-market. The web-search snippets for these same reports gave *different* numbers from the raw pages, which is an example of why snippets are unreliable.
- **r/Anki subscriber growth:** Reddit returned 403. **Not verified.**

---

## 6. Brain dumps (brief, facts only)
- **ExamTopics** calls itself "Free Exam Prep By IT Professionals". It shows the stats "94% Said the test questions were almost same" and "Passed the exams with Examtopics materials", and sells "EXAMTOPICS PRO" (https://www.examtopics.com/).
- **Microsoft** defines a brain dump as "a source … that contains exam questions or assessment lab content that has been fraudulently obtained … exactly the same or substantially similar to what appears on the exam". It says "using this type of material … constitutes cheating. Brain dump providers are in violation of Microsoft intellectual property rights" and lists "using brain dump sites to prepare" as misconduct (https://learn.microsoft.com/en-us/credentials/support/exam-and-assessment-lab-security-policies).
- **CompTIA** says: "some individuals and companies steal and share confidential exam content … violating protocols and copyright laws … If you encounter brain dumps or unauthorized content, please report it." It also says: "Using 'brain dumps' or leaks is a serious policy violation" (https://www.comptia.org/en-us/resources/test-policies/unauthorized-training-materials-faq/).
- **Dump content is present in the Anki ecosystem:** AnkiWeb deck 2119884346 is titled "AZ-104 (AZ104) Dump with Explanations" (+9 rating).
- Legal actions against dump sites were **not researched** after the scope change.

---

## 7. Gaps: what nobody offers

These gaps are judged from everything found above. Absence of evidence is limited to what this task searched.
1. **Free + Anki export + many certs.** No offering combines all three. The free multi-cert players are web-only or single-vendor (AWSomecards for AWS; ISC2 for its own certs behind a form). Multi-cert catalogues are paid (Brainscape $7.99/mo, Crucial Exams $19.99/mo, UniPrep2Go $11–$39 per deck).
2. **Per-card citations to official documentation.** Not seen on any provider. The best sourcing seen is deck-level, for example "Based on the Microsoft official 'Skills measured' document" (a 2019 deck) and "All acronyms from the official Comptia Security+ SY0-701 guide".
3. **Versioning against exam-objective changes.** AWSomecards claims to be "kept current with the latest blueprint codes". No provider seen publishes a changelog or version per deck. On AnkiWeb, old and new exam versions sit side by side, and decks disappear.
4. **A standard schema across certs.** Procensic tags by domain, objective and difficulty, but across only a few certs and with an AI-coach upsell. Nobody publishes a common card format across vendors.
5. **Maintainers who survive.** Google Cloud's official Anki repo is archived. AWSomecards retired its Anki decks. Several popular AnkiWeb decks now return "missing".
6. **Non-IT certs on the free side.** Free AnkiWeb coverage for CFA, CPA and Series 7 is years out of date (2013–2023). No FRM deck was found on AnkiWeb. The paid side (UniPrep2Go, Brainscape, Gumroad) is where finance and licensing decks are currently sold.

**Watch list** (closest to the founder's concept): AWSomecards (free, AWS); UniPrep2Go (paid catalogue, AEO-optimised); Procensic (free AnkiWeb question banks funnelling to GPTs); Brainscape Certified (paid, 130 professional certs); Crucial Exams (flashcards plus tests plus AI tutor).
