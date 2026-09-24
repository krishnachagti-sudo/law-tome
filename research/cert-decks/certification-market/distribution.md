# Distribution research: free, sourced flashcard decks for certification exams

Researched 2026-09-23. This describes the market; it does not recommend which certs to build.
Scope: after a scope change from the founder, the focus is **flashcards and Anki** (not study material in general) across IT, security, cloud, project management and finance exams. The partnership section is kept.

## Evidence rules used

- Every claim links to the page where I read it. Raw copies are saved in `scratchpad/certs/raw-dist/`:
  - `pages/*.html` and `pages/*.txt`: curl downloads plus text extraction
  - `rss_*.xml`: Reddit search RSS feeds
  - `websearch_log.md`: the result list for each search query
  - `github_search_notes.txt`: GitHub repository searches
- **"Seen in a search result"** means I saw the result title and URL in the WebSearch tool's list. I did not open the page. The tool's summary text is not treated as verified. Page facts marked "raw-verified" were read in the curl text.
- **The search tool is not Google.** It is Claude's WebSearch, US-only. Rankings here show what that engine returned and are not Google SERPs.
- **Pages I could not read:**
  - Reddit HTML and JSON (403).
  - AnkiWeb deck pages, which need JavaScript. Card counts, ratings and download counts on AnkiWeb are therefore **not verified** except where a Reddit post states them.
  - GitHub HTML and REST API (403). I used the GitHub MCP search instead.
  - The AWS Community Builders and Microsoft MVP homepages (JavaScript shells).
  - pmi.org exam-prep pages (403).
  - The Cisco Learning Network article bodies.

---

## 1. Who ranks for flashcard and Anki queries

I ran about 40 queries (full list in `raw-dist/websearch_log.md`). The patterns below come from the result lists.

### 1a. "<cert> anki deck" / "<exam code> anki": AnkiWeb dominates, and real decks do rank

For almost every Anki query, most results were **ankiweb.net/shared/info/...** deck pages, plus GitHub repos and paid decks on Gumroad or Etsy:

| Query | What ranked (in order, abbreviated) |
|---|---|
| "AZ-900 anki deck" | 8 of 10 results were AnkiWeb or AnkiHub decks, including one titled "AZ-900 Dump with Explanations" |
| "Security+ anki deck" | 2 AnkiWeb decks, AnkiWeb search pages, a free deck on TeachersPayTeachers, 3 paid Gumroad decks (zeroxriq) |
| "CCNA anki deck" | GitHub midifolk deck, AnkiWeb "CCNA Jeremy's IT lab (day 1)", AnkiWeb "Cisco CCNA 200-301", a Quizlet copy of the JITL deck, a JITL YouTube video |
| "AWS Cloud Practitioner anki deck" | AnkiWeb x3, GitHub x3, an Anki forum thread, awsomecards.com, a paid Gumroad deck |
| "SAA-C03 anki" | AnkiWeb, paid Ko-fi and Etsy decks, a GitHub repo, awsomecards.com |
| "PMP anki deck" | 6 AnkiWeb decks or searches, paid Gumroad (ankiguru) and Etsy decks, a ProjectManagement.com forum thread |
| "CISSP anki deck" | AnkiWeb x4 (including "CISSP 10k" and "CISSP - By Josh Madakor"), a LinkedIn post announcing a free deck, an ISC2 page |
| "CFA Level 1 anki deck" | AnkiWeb x2, Etsy, Gumroad (ankiguru), Podia "Anki template" (paid), a 300hours forum thread, TeachersPayTeachers |
| "Network+ N10-009 anki deck" | 5 AnkiWeb decks (including per-domain and "Acronyms" decks), Etsy, Quizlet |
| "CompTIA A+ anki deck 1201" | 5 AnkiWeb decks split by objective domain, an AnkiWeb deck "Based on Professor Messer", a Josh Madakor LinkedIn post |
| "CKA kubernetes anki deck" | AnkiWeb x4 (CKA, Kubernetes, 2 CKAD exercise decks), GitHub, Brainscape |
| "CISM anki deck" / "CISA exam anki deck" | Mostly paid Etsy and Gumroad bundles, a LognPacific "free CISM Anki decks" page (returned 404 when I fetched it: `raw-dist/pages/lognpacific_cism.txt`), a few AnkiWeb decks |
| "ACCA anki flashcards" | 1 AnkiWeb deck (F5), OpenTuition flashcards, Brainscape, several Gumroad sellers |

Source for all rows: `raw-dist/websearch_log.md`.

**What this means for distribution:**
- AnkiWeb pages rank for "<cert> anki" in this engine. A deck published to AnkiWeb is itself a search surface, and it can link back to a site.
- The Anki SERP is also where a **cottage industry of paid decks** shows up. These are $5–$15 Gumroad and Etsy listings (for example the Security+ acronym and vocabulary decks on zeroxriq.gumroad.com, seen in results), and one Etsy listing is titled "Official ISACA Practice Questions". A free, sourced site would compete with these.
- One AnkiWeb result is a deck literally titled **"AZ-900 Dump with Explanations"** (https://ankiweb.net/shared/info/2068465538, seen in results only). Dump-derived decks are present on AnkiWeb.

### 1b. "<cert> flashcards": Quizlet, Brainscape, apps and books dominate. Anki is rarely present.

| Query | Pattern |
|---|---|
| "AWS Cloud Practitioner CLF-C02 flashcards" | 4 Quizlet sets, 3 Amazon flashcard books, crucialexams, awsomecards.com |
| "PMP flashcards" | Apple App Store x2, Brainscape, Udemy, Quizlet x2, PM PrepCast, Agilemania, masterofproject, PMAspirant |
| "CISSP flashcards" | 3 app-store apps, Scribd, **ISC2 official** (2 URLs), DestCert app, Thor Teaches |
| "CCNA flashcards" | Google Play and App Store apps, Amazon books, ipcisco, Cisco Press, Brainscape, a Cisco Learning Network user article |
| "AZ-104 flashcards" | Brainscape, 3 Quizlet sets, a GitHub repo, crucialexams, certstud, 2 apps |
| "Google Associate Cloud Engineer flashcards" | 7 Quizlet sets, Brainscape, a Kindle book, a Medium post |
| "Salesforce Administrator certification flashcards" | Quizlet x3, Brainscape, 2 Trailhead URLs (one a user-made trailmix), flashcardmachine, cram, studystack |
| "CPA exam flashcards" | UWorld x2, Becker, Brainscape, Varsity Tutors, Mometrix, NINJA CPA, Amazon |
| "FRM Part 1 flashcards" | Brainscape x3, Quizlet x3, frmquizbank, kardsai x2 |
| "CFA flashcards" | 300hours, UWorld, Quizlet, Kaplan Schweser x2 (including a free L1 flashcards page), AnalystPrep, TPT, Gumroad |
| "Series 7 exam flashcards" | Brainscape x2, Quizlet x3, Mometrix, Wikipedia, open-exam-prep, cram |

Source: `raw-dist/websearch_log.md`.

**Summary of result types:**
- Quizlet user sets are the single most common result for "<cert> flashcards" in IT and cloud.
- Brainscape shows up across every vertical.
- Finance and accounting results are dominated by the big prep providers (UWorld, Becker, Kaplan Schweser, Mometrix).
- App-store listings are common for security and PM.
- **Exam dumps** appeared in "practice questions" queries (validexamdumps, itexams, certshero for CKA, Terraform 004 and Security+). They did not appear in the flashcard queries.
- **Reddit did not appear in any of the ~40 result lists** (see the note at the end of `websearch_log.md`). This may be specific to this engine; Google's behaviour is not verified.

### 1c. Generic study-guide and "how to pass" queries (for contrast)

- Study guides:
  - "CompTIA Security+ SY0-701 study guide": publishers (Pearson, Wiley/Sybex, O'Reilly), GitHub notes, free-content sites (Union Test Prep).
  - "AZ-900 study guide": the vendor page (Microsoft Learn) and individual experts (thomasmaurer.ch, marczak.io).
- "How to pass" queries:
  - Mostly blogs and Medium posts.
  - Also course platforms (Udemy for CCNA and SAA) and vendor pages (cisco.com, docs.aws.amazon.com).
- Practice questions:
  - Many free "practice test" sites, such as examcompass, flashgenius, crucialexams and certpreps.
  - Some dump sites.

Source: `raw-dist/websearch_log.md`.

### 1d. Vendors and associations publish their own flashcards (this competes with a free deck site)

**Free from the vendor:**
- **ISC2** offers free interactive flash cards. Its page says: "Boost Your Cybersecurity Exam Success with Free Interactive Flash Cards" ... "Our free interactive flash cards are designed to help you build confidence" (raw-verified: https://www.isc2.org/certifications/flash-cards, `pages/isc2_flash.txt`). It ranked for "CISSP flashcards".

**Paid, or included with paid registration:**
- **PMI Study Hall** includes "digital flashcards" and lists "200+ Flashcards" in its packages. Source: PMI's Study Hall FAQ PDF (raw-verified: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/pmi-study-hall-faq102023.pdf?rev=cf2d122b454743f6858def99ac3ac966, `pages/pmi_sh_faq.txt`). One r/pmp user quotes the subscription as "$79 for 2 months" (https://www.reddit.com/r/pmp/comments/1spqj6v/flash_cards_pmi_study_hall_or_diy/, from the RSS).
- **CFA Institute's Learning Ecosystem** includes "curriculum-based flashcards" (raw-verified: https://www.cfainstitute.org/programs/cfa-program/learning-ecosystem, `pages/cfa_les.txt`). One r/CFA user wrote that "CFAI flashcards aren't easy to use ... the website only support is a pain for Anki users". They then scraped the cards into Anki with an AI browser (https://www.reddit.com/r/CFA/comments/1urx7qk/psa_use_ai_for_cfai_flashcards_anki_deck/, RSS).
- **CompTIA CertMaster Learn** (paid) has "flashcard and games built into the platform to help with terminology and acronyms". This comes from a reply in a 2020 CompTIA Instructor Network thread (raw-verified: https://cin.comptia.org/threads/comptia-vocabulary-flashcards.253/, `pages/cin_vocab.txt`).

---

## 2. Communities: where candidates ask for and share decks

### 2a. Community sizes

I could not read Reddit directly (HTTP 403). The figures below come from a third-party aggregator, reddapi.dev, with its page titles raw-verified in `pages/reddapi_*.html`. The snapshot date is **not stated**, so treat the numbers as approximate:

| Subreddit | Members (reddapi.dev) | Source |
|---|---|---|
| r/ITCareerQuestions | 568,617 | https://reddapi.dev/subreddits/itcareerquestions/insights |
| r/CompTIA | 307,309 | https://reddapi.dev/subreddits/comptia/insights |
| r/CFA | 222,249 | https://reddapi.dev/subreddits/cfa/insights |
| r/kubernetes | 211,081 | https://reddapi.dev/subreddits/kubernetes/insights |
| r/Anki | 204,839 | https://reddapi.dev/subreddits/anki/insights |
| r/AWSCertifications | 171,030 | https://reddapi.dev/subreddits/awscertifications/insights |
| r/ccna | 149,553 | https://reddapi.dev/subreddits/ccna/insights |
| r/pmp | 129,000 | https://reddapi.dev/subreddits/pmp/insights |
| r/CPA | 128,370 | https://reddapi.dev/subreddits/cpa/insights |
| r/googlecloud | 97,921 | https://reddapi.dev/subreddits/googlecloud/insights |
| r/cissp | 95,995 | https://reddapi.dev/subreddits/cissp/insights |
| r/AzureCertification | 92,358 | https://reddapi.dev/subreddits/azurecertification/insights |
| r/ccnp | 33,938 | https://reddapi.dev/subreddits/ccnp/insights |

- r/FRM: reddapi had no page. **Not verified.**
- r/GoogleCloudCertification: the RSS returned 404, and I don't know whether the subreddit exists.
- The only dedicated Kubernetes-cert subreddit I tried, r/CKAD, returned 0 flashcard posts.

### 2b. Method for the Reddit analysis

- For each subreddit I pulled the top-all-time Reddit search RSS for `anki`, `flashcards` and `passed` (100 posts maximum per feed; files `raw-dist/rss_<sub>_<query>.xml`).
- I then counted posts whose **title** contains anki, flashcard or deck. For resource mentions, I counted posts whose title plus body matched a regex for each resource (`raw-dist/analyze.py`).
- **Limits:**
  - The RSS gives the post body only, with no comments and no scores. I cannot say which deck gets recommended most in comment threads, or how many upvotes posts got.
  - The regexes are crude. For example, "AI" matches many unrelated words, and "TIA" is used as a proxy for Andrew Ramdayal.

### 2c. How much flashcard and Anki activity each community has

Posts with "anki", "flashcard" or "deck" in the title, among the top results of each search feed:

| Subreddit | `anki` search: results / deck-titled | `flashcards` search: results / deck-titled |
|---|---|---|
| r/CFA | 100 / **39** | 100 / 15 |
| r/AWSCertifications | 100 / 19 | 100 / 9 |
| r/ccna | 100 / 10 | 100 / 6 |
| r/ccnp | 63 / 10 | 64 / 11 |
| r/CPA | **15** / 8 | 100 / 3 |
| r/FRM | 2 / 1 | 6 / 1 |
| r/ITCareerQuestions | 11 / 2 | 22 / 5 |
| r/cissp | 67 / 7 | 100 / 0 |
| r/CompTIA | 100 / 6 | 100 / 5 |
| r/AzureCertification | 28 / 6 | 62 / 10 |
| r/pmp | **18** / 4 | 100 / 1 |
| r/kubernetes | 1 / 1 | 6 / 6 |

Source: `raw-dist/rss_*.xml`, output of `analyze.py`.

**Reading the table:**
- **Finance (r/CFA) is by far the most Anki-heavy community.**
- Networking (r/ccna, r/ccnp) and AWS come next.
- PMP candidates hardly search for "anki": only 18 posts matched in r/pmp.
- Hands-on exams (CKA and CKAD) have almost no flashcard discussion on Reddit.

- CPA and FRM candidates rarely post about Anki, but when they do, it is almost always a **request** for a deck (2g).

### 2d. What "passed" posts credit (top 100 "passed" posts per sub, count of posts naming each resource)

| Sub | Most-named resources | Anki / flashcards mentioned in |
|---|---|---|
| r/AWSCertifications | Tutorials Dojo 43, Maarek 33, Udemy 27, Cantrill 11, Skill Builder 9 | Anki 1, flashcards 4 |
| r/AzureCertification | Microsoft Learn 52, John Savill 27, Tutorials Dojo 27, Udemy 19, MeasureUp 7 | Anki 1, flashcards 2 |
| r/CompTIA | Jason Dion 20, Professor Messer 16, Udemy 16 | Anki 3, flashcards 5, Quizlet 4 |
| r/ccna | Boson 46, Jeremy's IT Lab 39, Odom OCG 22, Udemy 19, Neil Anderson 11 | **Anki 12, flashcards 20** |
| r/cissp | Sybex OSG/Chapple 38, Destination Certification 33, LearnZapp 28, Zerger 25, Boson 14, Pocket Prep 12, Handerhan 10 | flashcards 11 |
| r/pmp | "Study Hall" 53, Udemy 37, Ramdayal 34, David McLachlan 27, PrepCast 4 | flashcards 6 |
| r/kubernetes | killer.sh 25, KodeKloud 23, Udemy 19 | none |
| r/CFA | Kaplan Schweser 13 | Anki 1, flashcards 2 |

Source: `raw-dist/rss_*_passed.xml`, via `analyze.py`.

**Takeaways:**
- In "passed" posts, **practice-question banks and a single video course dominate.** Flashcards are a minor mention everywhere except CCNA.
- CCNA is the exception because the dominant free course, Jeremy's IT Lab, **ships Anki decks** (see 4a).

### 2e. Recurring post types (examples from the RSS)

**Requests for decks: people asking whether a good pre-made deck exists.** These recur in every IT sub:

- AWS:
  - "Anki or other flashcard deck for Cloud Practitioner (CLF-C02)?" The poster had made their own deck and wanted one that is free "or doesn't have the basic functionality locked behind a paywall (I'm looking at you, Quizlet!)" (https://www.reddit.com/r/AWSCertifications/comments/1g0e2o6/anki_or_other_flashcard_deck_for_cloud/).
  - "Does anyone have a link to any good Anki cards for SAA?" (https://www.reddit.com/r/AWSCertifications/comments/1jidzu0/does_anyone_have_a_link_to_any_good_anki_cards/).
  - "Anki Flashcards for SAA?" (https://www.reddit.com/r/AWSCertifications/comments/1bu57oh/anki_flashcards_for_saa/).
- Azure:
  - "Looking for AZ104 Anki Flashcards" (https://www.reddit.com/r/AzureCertification/comments/105gz5y/looking_for_az104_anki_flashcards/).
  - "Anki for AZ-700?": "don't trust chatGPT to put correct information on them but premade ones would help a ton" (https://www.reddit.com/r/AzureCertification/comments/1l1mv6v/anki_for_az700/).
  - "SC-300 anki": "I found some great CCNA pre-made anki flashcards (Jeremy IT has a link for them on his Youtube) and they're amazing" (https://www.reddit.com/r/AzureCertification/comments/1rkm5b3/sc300_anki/).
  - "Does somebody have AZ-104 flashcards or app?" (https://www.reddit.com/r/AzureCertification/comments/1qdx41f/does_somebody_have_az104_flashcards_or_app/).
- CISSP:
  - "Are there any premade flashcards for CISSP?": "writing/typing ... feels like more of a time sink than a help" (https://www.reddit.com/r/cissp/comments/smpiqs/are_there_any_premade_flashcards_for_cissp/).
  - "Anki cards" (https://www.reddit.com/r/cissp/comments/1mi51av/anki_cards/).
  - "Does anyone have any flashcards for anki?" (https://www.reddit.com/r/cissp/comments/b9qc5w/does_anyone_have_any_flashcards_for_anki/).
- PMP:
  - "Anki decks for PMP" (https://www.reddit.com/r/pmp/comments/n3g21u/anki_decks_for_pmp/).
- CFA:
  - "Flashcards CFA Level 1 - 2026": "does anyone have any link to free flashcards" (https://www.reddit.com/r/CFA/comments/1qjs9xt/flashcards_cfa_level_1_2026/).
  - "Anki Decks for Level 1" (https://www.reddit.com/r/CFA/comments/1m0gqvq/anki_decks_for_level_1/).
- CCNP:
  - "Anki flashcards for CCNP ENSLD 300-420?" (https://www.reddit.com/r/ccnp/comments/1tcor9e/anki_flashcards_for_ccnp_ensld_300420/).

**Explicit complaints about quality.** The one I found in post bodies: "Anki had some available but they're fucking awful and the opposite of what a flash card should be" (https://www.reddit.com/r/AWSCertifications/comments/1ftpgkf/does_anyone_sell_flash_cards/). The RSS carries no comments, so **I could not measure how often replies say "no good deck exists".** That is not verified.

**Posts sharing decks. Individuals give decks away, often as a "thank you" after passing:**
- CCNA: "CCNA 200-301 flashcard deck", an AnkiWeb deck said by its author to have "over 14,000 downloads", with each card referencing an Official Cert Guide chapter (https://www.reddit.com/r/ccna/comments/pqq4uz/ccna_200301_flashcard_deck/; author's claim, not verified).
- AWS:
  - An Anki deck of "over 900" CLF questions converted from an open-source GitHub repo (https://www.reddit.com/r/AWSCertifications/comments/1gxkwkp/anki_cards_with_over_900_questions_for_aws_cloud/).
  - Free-flashcard websites announced by their builders, for example AWSomecards: "1000+ interactive flashcards ... Completely FREE (no paywall or signup required)" (https://www.reddit.com/r/AWSCertifications/comments/1mtjq6s/free_aws_certification_flashcards/).
  - A free-flashcards promo with "limited codes" (https://www.reddit.com/r/AWSCertifications/comments/1nzn4cc/hundreds_free_mobile_flashcards_for_aws/).
- Azure: ZeroToArchitect announcing free Azure flashcards (https://www.reddit.com/r/AzureCertification/comments/1r0fgiq/free_azure_flashcards_are_now_available_on/).
- CompTIA:
  - A free Security+ Quizlet set given "as a way to give back to this awesome community" (https://www.reddit.com/r/CompTIA/comments/1hny2hh/free_flashcards_for_security_sy0701/).
  - Net+ and Sec+ decks migrated from Quizlet to Anki because "Anki may be better for those of you who don't have a Quizlet plus subscription" (https://www.reddit.com/r/CompTIA/comments/12xsixk/anki_decks_for_net_and_sec_to_help_you_pass/).
- CFA and CCNP: many "L1/L2/L3 Anki deck" shares in r/CFA, and chapter-by-chapter ENCOR decks in r/ccnp (lists in `analyze.py` output; e.g. https://www.reddit.com/r/CFA/comments/1ozy185/cfa_level_2_anki_flashcards/, https://www.reddit.com/r/ccnp/comments/1b1oqw7/my_encor_study_notes_and_anki_flashcards/).
- Kubernetes: the only CKAD deck found was a 2019 conversion of a public exercise set (https://www.reddit.com/r/kubernetes/comments/b5mvde/i_turned_dgkanatsioss_ckad_prep_exercises_into_an/).

**Copyright hesitation.** An r/CFA user with "almost 4k" Anki cards asked whether sharing them is legal, because "almost all of them have content from Kaplan, CFAI, PrepNuggets and other PrepProviders" (https://www.reddit.com/r/CFA/comments/1iy1crj/almost_4k_of_flashcards_is_it_legalin_compliance/). This supports the "sourced, original wording" positioning. It also shows why so many community decks are legally grey.

**Debate over whether pre-made decks are worth using:**
- "Honestly, are the flash card decks totally overkill?" (https://www.reddit.com/r/ccna/comments/15rvrgq/honestly_are_the_flash_card_decks_totally_overkill/).
- A 2025 r/ccna post notes that people "tried using Anki for their CCNA prep, especially JITL's decks, but gave up" (https://www.reddit.com/r/ccna/comments/1obg9s8/for_everyone_who_studies_with_anki_flashcards_and/).
- Many askers pre-emptively acknowledge that "I know the best is to create your own" (e.g. https://www.reddit.com/r/AWSCertifications/comments/1bu57oh/anki_flashcards_for_saa/).

### 2f. Decks that get named

- **Jeremy's IT Lab (CCNA) decks.** JITL appears in 60 of the 100 r/ccna "anki" posts and 67 of the 100 "flashcards" posts. A posted study method starts: "Find the link in his video description to receive 'Free CCNA 200-301 flashcards/packet tracer labs'" (https://www.reddit.com/r/ccna/comments/14utw2s/ccna_200301_study_method_using_jitl_anki_pt_boson/).
- **Neil Anderson's CCNA decks.** "Which Anki deck is better, Jeremy's Lab or Neil's?" (https://www.reddit.com/r/ccna/comments/11jkzco/which_anki_deck_is_better_jeremys_lab_or_neils/).
- **Josh Madakor's free CISSP and A+ Anki decks** (LinkedIn, see 4b). "CISSP - By Josh Madakor" also ranked on AnkiWeb (websearch_log).
- **Messer-aligned community decks** on AnkiWeb, for example "CompTIA A+ 220-1101 (Based on Professor Messer)" and "Professor Messer SY0-701 Security+ Free Video Course". These were seen in results only. PrepForCerts states that "all Messer-based decks are community-built" (raw-verified: https://prepforcerts.org/professor-messer-anki-flashcards, `pages/messer_prep.txt`); that is a third-party SEO site's claim.
- **The "Vargas" PMP deck** on AnkiWeb, based on a popular YouTube video (https://www.reddit.com/r/pmp/comments/kfy4dy/anki_vargas_deck/).

### 2g. Finance, r/Anki and other communities

**r/CFA is the most flashcard-heavy community found.**
- In the `anki` search, 39 of the top 100 posts have anki, flashcard or deck in the title. The `flashcards` search gives 15 of 100 (`rss_CFA_*.xml`).
- Post types:
  - Deck shares for each level. Examples: "CFA Level 2 Anki Flashcards" (https://www.reddit.com/r/CFA/comments/1ozy185/cfa_level_2_anki_flashcards/) and "Anki CFA Level 3 Decks 2020" (https://www.reddit.com/r/CFA/comments/i1ux9b/anki_cfa_level_3_decks_2020/).
  - Requests. Examples: "Flashcards CFA Level 1 - 2026" (https://www.reddit.com/r/CFA/comments/1qjs9xt/flashcards_cfa_level_1_2026/) and "Anki Decks for Level 1" from someone "coming from a medical background" (https://www.reddit.com/r/CFA/comments/1m0gqvq/anki_decks_for_level_1/).
  - Method threads. Example: "My CFA secret for passing all 3 first try: flashcards + spaced repetition" (https://www.reddit.com/r/CFA/comments/1sfz210/my_cfa_secret_for_passing_all_3_first_try/).
- In "passed" posts, Kaplan Schweser is the most-named resource (13 of 100). Anki is named in only 1.
- Two more signals:
  - The copyright question in 2e.
  - The AI-scraping of CFAI's own flashcards into Anki (1d).

**r/CPA:**
- Only 15 posts matched `anki`, but 8 of those 15 have deck-related titles. All are requests:
  - "Any one willing to share their Anki Decks for any of the CPA exams?" (https://www.reddit.com/r/CPA/comments/eeercm/any_one_willing_to_share_their_anki_decks_for_any/)
  - "Anyone have Anki decks for TCP? ... Preferably from Becker's flashcards" (https://www.reddit.com/r/CPA/comments/1k9k7il/anyone_have_anki_decks_for_tcp/)
  - "Anki decks for REG?" (https://www.reddit.com/r/CPA/comments/1exdjez/anki_decks_for_reg/)
  - "Recommendations for AUD Flashcard Apps? ... I don't have Becker ... Making Anki cards one by one is excruciating for me so I'd prefer to get or buy some that someone's already made" (https://www.reddit.com/r/CPA/comments/1o3crwz/recommendations_for_aud_flashcard_apps/)
- In the `flashcards` search, Becker is named in 68 of 100 posts. Becker sells printed flashcards (result seen: https://www.becker.com/cpa-review/support-products/printed-flashcards). Its card products define the category here.

**r/FRM:**
- 2 posts matched `anki` and 6 matched `flashcards`.
- The one deck post is a 2026 request: "Is there anyone with frm part 1 anki or any flashcard decks you can share?" (https://www.reddit.com/r/FRM/comments/1vb2z83/frm_1_ankiflashcard_decks/).
- Kaplan Schweser leads in "passed" posts (16 of 100).
- Reddit activity is small here. The subreddit's size is not verified.

**r/Anki (general Anki community):**
- Cert posts are rare. Searches for `CISSP` returned 0 results, `PMP` returned 2 (both unrelated), and `FRM` returned 1.
- `AWS` and `certification` returned mostly unrelated Anki posts, with a few cert ones:
  - "Anyone know of a good, up-to-date deck for AWS Certified Cloud Practitioner?" (https://www.reddit.com/r/Anki/comments/1g0e1em/anyone_know_of_a_good_uptodate_deck_for_aws/)
  - "Anki flashcards based on my experience with AWS Solutions Architect - Associate (SAA-C03) exam", cross-posted (https://www.reddit.com/r/Anki/comments/1nxrw1n/anki_flashcards_based_on_my_experience_with_aws/)
  - "Want to hire someone to make an Anki deck for me for CIPS certification exam" (https://www.reddit.com/r/Anki/comments/592y27/want_to_hire_someone_to_make_an_anki_deck_for_me/)
  - "Using Anki to study for the OCP Java SE 11 Programmer I | 1Z0-815?" (https://www.reddit.com/r/Anki/comments/eu5ezh/using_anki_to_study_for_the_ocp_java_se_11/)
  - "Anki for topics other than Languages and Medicine" (https://www.reddit.com/r/Anki/comments/g4mn50/anki_for_topics_other_than_languages_and_medicine/)
- The r/Anki `CFA` search had 15 results, mostly CFA users asking how to structure decks (`rss_Anki_CFA.xml`).
- The `Security+` query matched general "security" posts and is not usable.
- The r/Anki `CompTIA` search returned only 10 posts. Examples: "My Anki flashcard stats and settings after completing CompTIA A+ 1101" (https://www.reddit.com/r/Anki/comments/17gab1r/my_anki_flashcard_stats_and_settings_after/) and "Net+ Flashcards" (https://www.reddit.com/r/Anki/comments/1pty2h5/net_flashcards/).
- The r/Anki searches for CCNA and Azure were rate-limited (HTTP 429) and **not collected**.
- **r/Anki is a secondary channel.** Candidates ask in the exam subreddits, not in r/Anki.

**Other subreddits:**
- r/ITCareerQuestions: 11 posts matched `anki` and 22 matched `flashcards`. Its "passed" posts name Professor Messer most (11 of 100).
- r/securityplus: the RSS redirected (HTTP 302) and was not collected.
- r/CKAD: 0 flashcard posts.
- r/ccnp: 63 posts matched `anki`, with 10 deck-titled, including chapter-by-chapter ENCOR decks. Odom's OCG and Boson dominate its "passed" posts (36 and 35 of 100).

### 2h. Non-Reddit forums

- **300hours (CFA forum)** has an "Anki and other SRS/flash card study methods" thread. One member calls their CFA Anki deck "my secret weapon" (raw-verified: https://300hours.com/f/cfa/general/t/anki-and-other-srs-flash-card-study-methods/, `pages/hours300_anki.txt`).
- **ProjectManagement.com** (PMI-owned) has an "ANKI-Flashcard deck for the PMP?" thread. It was seen in results; the page returned 403.
- **Cisco Learning Network** is Cisco's own community. It hosts user-posted content, such as the result "CCNA eye opener - 1600 CCNP / CCIE study flashcards" (learningnetwork.cisco.com/s/article/..., seen in results; the body needs JavaScript). It also hosts threads about Jeremy's IT Lab (seen in results).
- **The official Anki forum and AnkiHub:**
  - forums.ankiweb.net has a "Shared Decks" category with cert threads, for example "AWS Certified Cloud Practitioner Exam CLF-C01" (seen in results).
  - The AnkiHub community homepage's popular and recent topics were all **medical** decks (AnKing, Malleus) when I fetched it (raw-verified: `pages/ankihub_az900.txt`; the AZ-900 wiki URL itself returned 404).
  - This suggests AnkiHub's collaborative-deck audience is medical, not cert. That is an inference from one page.
- **GitHub decks are small:**
  - Top results by stars: a Security+ deck (JordanyJI99/CompTIA-Security-Flash, 16 stars), midifolk/Anki-CCNA-Flashcards (13), an LPIC-1 deck (29), and AWS CCP decks (2 stars or fewer).
  - Source: GitHub search via MCP, 2026-09-23 (`raw-dist/github_search_notes.txt`).
  - GitHub is not where cert decks get traction.

---

## 3. Vendor and community programmes a free resource could join or be listed in

| Programme | What it is (from source) | Could an independent free-deck maker take part? |
|---|---|---|
| **AWS Community Builders** | Community guides (not AWS pages; the official page is a JavaScript shell) say the programme looks for "consistent community engagement through content creation, knowledge sharing, and helping others learn AWS". Evidence includes "Technical blog posts", "Video content", and so on. Links must be public, and you apply in a category where you have already contributed. (raw-verified in a dev.to guide: https://dev.to/aws-builders/how-to-become-an-aws-community-builder-complete-guide-for-2026-applications-3902, `pages/awscb_devto.txt`) | Yes, as an **individual content creator**. It recognises a person, not a listing or directory. Official page: https://builder.aws.com/community/community-builders (content not readable). |
| **Microsoft MVP** | Given to "technology experts who passionately share their knowledge with the community". The award "lasts for a year and is awarded for a person's Microsoft related activity, contributions and influence over the previous year" (raw-verified: https://en.wikipedia.org/wiki/Microsoft_Most_Valuable_Professional, `pages/wiki_mvp.txt`). Microsoft's own pages (mvp.microsoft.com, and a Tech Community guide to becoming an MVP) are JavaScript shells I could not read. | An individual award for community contributors. Whether a flashcard site counts as a contribution is **not verified**. |
| **Microsoft Learn Collections** | "Collections allow you to create curated lists of **Microsoft Learn content** to share with your followers." You add content "from the Microsoft Learn site". Microsoft recommends "fewer than 10 items". (raw-verified: https://learn.microsoft.com/en-us/contribute/content/collections, `pages/ms_collections.txt`) | **No for external links.** Collections hold Microsoft Learn items only, so a third-party deck cannot be listed. |
| **Microsoft Learn study guides** | The AZ-900 study guide page lists "Take a free Practice Assessment" and "Get community support: Azure Community Support ... Microsoft Tech Community" (raw-verified: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900, `pages/ms_az900_guide.txt`). | I saw no third-party study resources listed. |
| **CompTIA Authorized Partner Program (CAPP)** | CertBlaster (dti Publishing) says: "CompTIA considers its Learning Content partners as one of their most important strategic assets", and "CompTIA works with partners like CertBlaster to help market the highest-quality learning products" (raw-verified: https://certblaster.com/comptia-practice-tests/certblaster-and-comptia-authorized-partner-program-overview-capp/, `pages/certblaster_capp.txt`). A search result also describes Authorized, Gold and Platinum tiers (https://trainingcamp.com/articles/what-it-means-to-be-a-platinum-comptia-partner/, not raw-verified). | This is a **commercial content-partner track** that commercial practice-test publishers use. Requirements and cost were **not verified**. |
| **CompTIA Instructor Network (CIN)** | A community for instructors who deliver CompTIA training. In a 2020 CIN thread, an instructor asked: "Anyone know of flashcards that match up with the CompTIA books for Network+ and Linux+? It is a bit daunting to have to work through each chapter and pull them out." Replies pointed to paid CertMaster. (raw-verified: https://cin.comptia.org/threads/comptia-vocabulary-flashcards.253/, `pages/cin_vocab.txt`) | Eligibility: help.comptia.org returned 403, so **not verified**. CryptoKait says CIN "is free to NCL coaches" (raw-verified: https://cryptokait.com/2021/02/25/everything-you-need-to-know-about-our-comptia-partnership/). This is a **demand signal from instructors**, and CIN is a place to reach them. |
| **Cisco Learning Network** | Cisco's community. It hosts study-material pages by exam topic and user-posted articles and threads, including flashcard articles and threads on Jeremy's IT Lab (seen in results; bodies not readable). | User posting appears open. The rules for posting links are **not verified**. |
| **ISC2 chapters / ISC2 Community** | ISC2 runs chapters (https://www.isc2.org/chapters, fetched) and offers its **own free flash cards** (see 1d). | ISC2 is a potential competitor rather than a channel. Whether chapters promote third-party material is **not verified**. |
| **PMI chapters** | PMI chapters run PMP study groups, for example the PMI Palmetto "PMP Study Group" (seen in results; 403 on fetch) and PMI Memphis's blog post "How to Pass the PMP Exam on Your First Try", which ranked in "how to pass PMP" (seen in results). PMI also sells Study Hall with 200+ flashcards (1d). | Chapter study groups are a possible local channel. Their policy on third-party resources is **not verified**. |
| **CNCF Kubestronaut / Ambassadors** | Kubestronauts are people who passed CKA, CKAD, CKS, KCNA and KCSA. Benefits include a "private Kubestronaut Slack channel and mailing list" and "Five coupons for 50%-off certifications each year". (raw-verified: https://www.cncf.io/training/kubestronaut/, `pages/kubestronaut.txt`) The CNCF Ambassadors page lists many members who describe themselves as "content creator"s (raw-verified: https://www.cncf.io/people/ambassadors/, `pages/cncf_amb.txt`). | Both recognise people, not resources. Kubestronauts are a concentrated audience of multi-cert candidates. Kubernetes exams are hands-on, and Reddit shows little flashcard demand for them (2c). |
| **Salesforce Trailhead trailmixes** | Trailhead lets anyone "Create and follow custom learning playlists" (Trailmixes). A user trailmix titled "Prepare with flashcards to study for the admin certification exam" ranked for "Salesforce Administrator certification flashcards" (raw-verified: https://trailhead.salesforce.com/users/cmrworldtech/trailmixes/prepare-with-flashcards-to-study-for-the-admin-certification-exa, `pages/trailmix.txt`). | Whether trailmixes can hold external URLs is **not verified**. The ranking result shows that user-made vendor-platform pages can rank. |
| **Brainscape partnerships (a model, not a vendor programme)** | Brainscape's PMP flashcards were "designed in partnership with Instructing.com", led by "renowned PMP instructor Joseph Phillips". Its Series 7 cards were "Developed in partnership with ... Knopman Marks". (raw-verified: https://www.brainscape.com/learn/pmp and https://www.brainscape.com/learn/series-7-top-off-exam) | This shows **instructor co-branding of decks** is an established model in this market. |

---

## 4. Instructors and associations

### 4a. Instructors who bundle or recommend Anki decks

**Jeremy's IT Lab (free CCNA course on YouTube):**
- His course page says: "Each lecture video includes a set of flashcards ... The flashcards can be opened in the free software Anki" (raw-verified: https://courses.jeremysitlab.com/p/ccna, `pages/jitl_course.txt`).
- The free-course flashcards are distributed through **email sign-up**: "Sign up to receive links to the supplementary flashcards and Packet Tracer practice labs for my free CCNA course" (raw-verified: https://jitl.jp/ccna-files, which redirects to sendfox.com/jeremysitlab; `pages/jitl_files.txt`).
- The deck is itself used as a list-building lead magnet.

**Neil Anderson (Flackbox / Udemy CCNA):**
- An r/ccna poster refers to "his Anki decks" and says they are "good enough" (https://www.reddit.com/r/ccna/comments/11jkzco/which_anki_deck_is_better_jeremys_lab_or_neils/).
- Flackbox's own page returned 403, so I could not read it directly.

**Josh Madakor (YouTube cybersecurity instructor):**
- A reshared post reads: "I created a free CISSP Practice Question Anki deck with over 1000 questions w/explanations and references **as a promotion for my Cybersecurity course**" (raw-verified: https://www.linkedin.com/posts/rachelbicknell_free-cissp-practice-question-anki-deck-with-activity-7071869396368986112-AK3r, `pages/rachel_li.txt`).
- On A+: "Here is a completely free CompTIA A+ practice questions deck I made with over 1150 questions and explanations (Anki) ... please subscribe to my YouTube if you haven't already". The post shows 319 reactions and 34 comments (raw-verified: https://www.linkedin.com/posts/joshmadakor_free-comptia-a-practice-test-1150-questions-activity-7037891538542092288-FlDf, `pages/madakor_li.txt`).

**Thor Pedersen (CISSP):**
- Sells "Thor's CISSP Flashcards – Over 2,800 Cards". The result title was seen at https://thorteaches.com/flashcards/.
- The search summary says the cards are delivered via Brainscape, but the fetched page was too thin to confirm this, so it is **not raw-verified**.

**Destination Certification:**
- Its "DestCert App" includes CISSP, CCSP and CISM flashcards (title seen: https://destcert.com/destcert-app/).
- It is the second most-named resource in r/cissp "passed" posts (2d).

**Pattern:** in the IT space, Anki decks are mostly a **free add-on to a video course**, used as a lead magnet (JITL, Madakor). In finance, security and PM, flashcards are a **paid feature** of a prep platform (Kaplan, UWorld, Becker, DestCert, Thor, PMI Study Hall). A free, sourced deck site could position itself as the "companion deck" for free video courses. That is an observation, not a recommendation.

### 4b. Associations and certifying bodies

- None of the vendor or association pages I could read (ISC2, CFA Institute, PMI, CompTIA, Microsoft Learn, Kubestronaut) publishes a list of third-party free flashcard resources.
  - They either sell or give away their own flashcards: ISC2 free, PMI Study Hall paid, CFA LES included with registration, CompTIA CertMaster paid (1d).
  - Or they point to their own learning platforms (Microsoft Learn, 3).
- Whether any association publishes a list of third-party study resources is **not verified** beyond these pages.
- **OpenTuition (ACCA)** is a free-content site whose tagline is "Free notes, lectures and more", with "ACCA Flashcards" (raw-verified: https://opentuition.com/acca/acca-flashcards/, `pages/opentuition_fc.txt`). It is a free-resource precedent in accounting.

---

## 5. How free resources gained traction

**Professor Messer (CompTIA):**
- "The online portion of our courses is completely free. There's no registration required to view any of the videos."
- "The financial plan for this project was modeled from the television model in the United States. I've combined online advertising with our free content."
- Both quotes are raw-verified: https://www.professormesser.com/about/, `pages/messer_about.txt`.
- The homepage shows paid add-ons next to the free videos: "Course Notes", "Practice Exams", "Downloadable ... Videos", plus free "Study Group Replays" and "Pop Quizzes" (raw-verified: https://www.professormesser.com/, `pages/messer_home.txt`).
- A press release titled "Professor Messer Hits One Million Subscribers on YouTube" appeared in results (cbs42.com); it returned 403, so the date and details are **not verified**.
- He is named in 16 of the top 100 r/CompTIA "passed" posts and 81 of the top 100 r/CompTIA "anki" posts (2c, 2d).
- Community decks "based on Professor Messer" exist on AnkiWeb (1a). Free video courses create downstream demand for matching decks, which the community fills informally.

**Jeremy's IT Lab (CCNA):**
- A CCNA review site writes: "Ask the same question in any CCNA forum or subreddit and one name comes up more than any other: Jeremy's IT Lab. It's free, it's on YouTube, and it's become the default recommendation for candidates starting from scratch" (raw-verified: https://ccnatraining.com/jeremys-it-lab-ccna-course-review-the-best-free-resource-in-the-game-with-one-catch/, `pages/ccnatraining_jitl.txt`).
- The Reddit data agrees: 39 of 100 r/ccna "passed" posts and 60 of 100 r/ccna "anki" posts mention JITL (2d, 2c).
- The model:
  - Free course on YouTube.
  - Free Anki decks gated behind an email sign-up.
  - A paid version on courses.jeremysitlab.com (raw-verified pages above).

**Reddit-driven growth of individual decks and sites:**
- **Individual decks:** an AnkiWeb CCNA deck whose author reports "over 14,000 downloads" before formally announcing it on r/ccna (https://www.reddit.com/r/ccna/comments/pqq4uz/ccna_200301_flashcard_deck/; the count is the author's claim).
- **Free-flashcard sites launched on Reddit:**
  - AWSomecards launched on r/AWSCertifications (https://www.reddit.com/r/AWSCertifications/comments/1mtjq6s/free_aws_certification_flashcards/). awsomecards.com later ranked for both "AWS Cloud Practitioner CLF-C02 flashcards" and "SAA-C03 anki" (websearch_log). I saw that the site ranks; I did not verify cause and effect.
  - ZeroToArchitect launched its free Azure flashcards on r/AzureCertification (https://www.reddit.com/r/AzureCertification/comments/1r0fgiq/free_azure_flashcards_are_now_available_on/).
- **Launch style:** the typical launch post is framed as giving back to the community ("as a way to give back to this awesome community", https://www.reddit.com/r/CompTIA/comments/1hny2hh/free_flashcards_for_security_sy0701/). Traffic or adoption numbers after launch are **not verified** for any of these.

**Instructor lead magnets:**
- Madakor's free Anki decks were explicitly promotions for a paid course and his YouTube channel (4a). The A+ post got 319 reactions on LinkedIn (raw-verified).

---

## Gaps and things I could not verify

- Google rankings: the search engine used is not Google.
- AnkiWeb download counts and ratings (the pages need JavaScript).
- Upvotes and comments on Reddit posts. RSS has no scores or comments, so how often replies say "no good deck exists" is unmeasured.
- The date of the subreddit member-count snapshot (reddapi.dev, third party).
- Eligibility details for Microsoft MVP, AWS Community Builders (official page) and CompTIA CIN, and CAPP costs.
- Whether PMI chapters, ISC2 chapters or Cisco Learning Network moderators allow third-party resource links.
