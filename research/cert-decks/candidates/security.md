# Candidate certifications: security, networking, IT service and audit

Researched 2026-09-24. This scores 24 certifications for a free site of standardised, sourced flashcard decks (Anki, CSV and a web page per deck).

**Evidence rules.**
- Every fact below was read in raw text fetched during this task (curl plus HTML-to-text or pdftotext). Raw copies are in `scratchpad/candidates/raw-security/`:
  - `pages/*.html|.txt|.pdf`: official pages and PDFs
  - `rss/*.xml`: Reddit search RSS feeds; `rss_log*.txt` lists each feed and its HTTP status
  - `ankiweb/`: AnkiWeb deck-info records (from AnkiWeb's `svc/shared/item-info` endpoint)
  - `websearch_log.md`: result lists from the WebSearch tool
  - `github_search_notes.txt`: GitHub repository searches (GitHub MCP)
- Findings reused from the earlier market reports (`research/cert-decks/certification-market/`, researched 2026-09-23) are marked **[prior: file §]**. Those reports have their own raw evidence. I did not re-fetch those pages.
- **Search ranking.** The WebSearch tool is not Google, and this session's quota of 200 searches ran out after 12 of my queries. I then tried Bing, DuckDuckGo, Brave and Mojeek by curl. DuckDuckGo returned a bot challenge (HTTP 202), Brave returned 429 and Mojeek returned 403. Bing returned unrelated results (bank log-ins, celebrity pages), so I have **not used Bing results as ranking evidence**. Where no search was run, the Search score is marked **nv** (not verified) and left at a neutral 3.
- **Reddit counts** come from top-of-all-time search RSS (at most 100 posts per feed). "Deck-titled" means the post title contains anki, flashcard(s), deck or quizlet. The feed carries post bodies but no comments or scores. Several feeds returned HTTP 429 (rate-limited); those are marked "not collected".
- **AnkiWeb search is blocked** for anonymous use ("Please log in to perform more searches."). Deck data therefore exists only for deck IDs found through search results or earlier reports.
- Scores run from 1 to 5, and 5 is always good for the site: high demand, a big gap, open sources, safe rules, low churn, partners available, winnable search. Totals are out of 35.

---

## Summary table

| Cert | Exam code (current) | Demand | Gap | Source | Rules | Stability | Partner | Search | **Total** | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| ISC2 CCSP | Outline eff. 1 Aug 2026 | 3 | 5 | 4 | 4 | 5 | 3 | 4 | **28** | Top pick: 8-week-old outline, the one AnkiWeb deck is gone, NIST cloud sources are public domain, and r/CCSP asks for flashcards. |
| IAPP CIPP/E | BoK v1.3.3 (eff. 1 Sep 2025) | 2 | 5 | 5 | 4 | 4 | 3 | 4 | **27** | Cleanest to build: GDPR text is reusable, no free Anki deck exists, and the rules only bar sharing exam content. Demand for flashcards is shown by Brainscape (382 learners), not Reddit. |
| ISC2 CISSP | Outline eff. 15 Apr 2024 | 5 | 3 | 4 | 4 | 3 | 4 | 3 | **26** | Highest demand in this area, but the existing free decks are old and copyright-grey, and ISC2 gives cards away. A sourced deck can still stand out. |
| ISC2 CC | Outline eff. 1 Sep 2026 | 3 | 4 | 5 | 4 | 4 | 3 | 3 | **26** | Fresh outline, one stale deck; demand may fall now the free One Million programme has closed. |
| IAPP CIPP/US | BoK v2.6.1 (eff. 1 Sep 2025) | 2 | 5 | 5 | 4 | 3 | 3 | 4 | **26** | Federal statutes are public domain; the gap is empty; state-law churn needs upkeep. |
| ISC2 SSCP | Outline eff. 1 Oct 2025 | 2 | 5 | 4 | 4 | 4 | 2 | 5 | **26** | An empty niche; the search is easy to win but the audience is small. |
| ISACA CISM | New outline eff. 3 Nov 2026 | 4 | 5 | 3 | 2 | 4 | 3 | 4 | **25** | Large base and a new outline in six weeks; ISACA's terms ban using its content as AI input. |
| CompTIA CySA+ | CS0-004 (V4, launched 23 Jun 2026) | 3 | 5 | 4 | 1 | 4 | 3 | 4 | **24** | No free V4 deck found, but CompTIA's policy on AI-made and free materials is the blocker. |
| IAPP CIPT | BoK v4.0.0 (eff. 1 Sep 2025) | 2 | 5 | 3 | 4 | 4 | 3 | 3 | **24** | Clean gap, thin demand evidence. |
| GIAC GSEC | New version from 6 Apr 2026 | 1 | 5 | 4 | 3 | 4 | 2 | 5 | **24** | Nothing exists, but little sign of flashcard demand. |
| ISACA CISA | 150 questions, 5 domains (outline date nv) | 4 | 4 | 3 | 2 | 3 | 3 | 4 | **23** | Largest audit base; the supply is Etsy, Gumroad and one 2024 Reddit giveaway. ISACA terms are restrictive. |
| EC-Council CEH | 312-50 (v13) | 3 | 4 | 4 | 3 | 3 | 2 | 4 | **23** | Weak supply (2020 and 2023 AnkiWeb decks); EC-Council third-party policy not verified. |
| IAPP CIPM | BoK v4.2.0 (eff. 1 Sep 2025) | 2 | 5 | 2 | 4 | 4 | 3 | 3 | **23** | A gap, but the content is programme management with few open primary sources. |
| CompTIA A+ | 220-1201 / 220-1202 (V15) | 4 | 3 | 3 | 1 | 4 | 4 | 3 | **22** | Big and stable, but crowded and under CompTIA rules. |
| CompTIA Network+ | N10-009 (V9) | 4 | 3 | 4 | 1 | 3 | 4 | 3 | **22** | RFC-sourceable, but crowded and under CompTIA rules. |
| Cisco CCNP ENCOR | 350-401 (version nv) | 3 | 4 | 3 | 3 | 3 | 2 | 3 nv | **21** | Active r/ccnp deck sharing; Cisco exam-topics PDF could not be fetched. |
| ISACA CRISC | 150 questions, 4 domains | 2 | 5 | 3 | 2 | 3 | 2 | 4 | **21** | Small base (46,000+ holders); a "dumps" listing ranks. |
| Cisco CCNA | 200-301 v1.1 | 5 | 1 | 4 | 3 | 3 | 2 | 2 | **20** | Demand is real but already served free by Jeremy's IT Lab and a +268-rated AnkiWeb deck. |
| CompTIA Security+ | SY0-701 → SY0-801 (V8) on 17 Nov 2026 | 5 | 2 | 4 | 1 | 2 | 4 | 2 | **20** | Biggest audience and a V8 launch window, but the most crowded field and the riskiest rules. |
| CompTIA PenTest+ | PT0-003 (V3) | 2 | 4 | 4 | 1 | 3 | 2 | 4 | **20** | Low deck demand, and CompTIA rules apply. |
| CompTIA SecurityX (ex-CASP+) | CAS-005 (V5) | 2 | 4 | 4 | 1 | 3 | 2 | 4 | **20** | Same as PenTest+. |
| OffSec OSCP (OSCP+) | PEN-200 / 24-hour practical | 1 | 3 | 4 | 3 | 4 | 2 | 3 | **20** | A hands-on exam; zero Anki posts in r/oscp. |
| Juniper JNCIA-Junos | JN0-106 | 1 | 4 | 3 | 3 | 3 | 1 | 3 nv | **18** | Low demand. |
| PeopleCert ITIL 4 Foundation | ITIL 4 (sunset 31 Dec 2027) → ITIL (Version 5) | 3 | 3 | 1 | 2 | 1 | 2 | 3 nv | **15** | Being replaced by ITIL (Version 5), and the framework is proprietary. |

Ties are listed with higher Demand first.

## Top 5 in this area

1. **ISC2 CCSP (28).** The outline took effect on 1 Aug 2026, so every existing deck is out of date. The one AnkiWeb deck that ranked is gone. r/CCSP asks for flashcards, including a 2026 complaint about a paid deck. The NIST cloud material is public domain, and ISC2 bans only the sharing of exam content.
2. **IAPP CIPP/E (27).** Nothing free exists: no AnkiWeb or GitHub deck, only Brainscape (382 learners, paid). EU material is reusable under CC BY 4.0, the BoK PDF is public and stable since 1 Sep 2025, and IAPP's rules only cover exam confidentiality. The weakness is thin Reddit demand.
3. **ISC2 CISSP (26).** The largest demand here: about 191k holders (secondary source) and 1,359 Brainscape learners. The free decks are from 2021–2023 and built from copyrighted books. A per-card sourced deck stands out; the risks are that ISC2 gives away official cards and an outline refresh is likely around 2027 (not verified).
4. **ISC2 CC (26).** New outline from 1 Sep 2026 and 65,000+ holders from the One Million programme. There is an unanswered 2026 request for "up to date premade decks", and the only AnkiWeb deck is 166 notes from 2023. Now that the free programme has closed, demand may fall.
5. **ISACA CISM (25).** More than 107,000 holders and a new outline on 3 Nov 2026 makes a clean launch window. ISACA's terms bar using its content "as an input into AI", so cards must be built from other sources (NIST and law) only.

Also note:
- **CompTIA Security+ V8 (SY0-801, 17 Nov 2026)** and **CySA+ V4** have the biggest demand and the clearest version gaps, but CompTIA's published policy against AI-made and "not approved" study material puts users at risk. Both score Rules 1.
- **CIPP/US (26)** and **SSCP (26)** tie with CC on total. CIPP/US has thin Reddit demand and fast state-law churn; SSCP has a small audience.


---

## Cross-cutting evidence

### Rules for CompTIA (applies to A+, Network+, Security+, CySA+, PenTest+ and SecurityX): Rules-safety = 1

From **[prior: rules-risks.md §3]**:
- CompTIA "does not authorize or condone the use of artificial intelligence (AI), large language models (LLMs), or similar automated tools to generate study questions, practice exams, or exam-related content".
- Its FAQ lists "Study resources that break copyright laws or aren't approved by CompTIA" as unauthorized.
- Its vetting blog calls free resources, and sites covering many vendors, possible red flags.
- Its exam objectives say "Reproduction or dissemination prohibited without the written consent of CompTIA" [prior: §5].
- Penalty for candidates: a ban of "at least 12 months" and loss of certification "even if the candidate did not have fraudulent intentions".

A free, multi-vendor, AI-assisted site fits several of these flags, whatever its sourcing. Using its decks could expose *users* to risk, so all CompTIA certs get 1.

### Open primary sources (used for Sourceability)

- **US federal government works (NIST SPs, US statutes):** "Copyright protection under this title is not available for any work of the United States Government" (17 U.S.C. §105, https://www.law.cornell.edu/uscode/text/17/105). NIST's page also says "The software developed by NIST employees is not subject to copyright protection within the United States" (https://www.nist.gov/copyrights-disclaimers). For publications, that page points to a separate "Copyright, Fair Use, and Licensing Statements" page, which **I did not fetch**. Public-domain status of NIST publications therefore rests on §105.
- **RFCs (IETF Trust Legal Provisions 5.0):** outside the IETF process, anyone may "copy, publish, display and distribute unmodified portions" provided "each such portion is clearly attributed to IETF and identifies the RFC". The licence does not grant "any license to modify IETF Contributions or IETF Documents" (https://trustee.ietf.org/wp-content/uploads/Corrected-TLP-5.0-legal-provsions.pdf). RFC 9293's notice points to these provisions (https://www.rfc-editor.org/rfc/rfc9293.txt). Consequence: cards can quote RFC text verbatim with attribution, or state facts in original words, but cannot adapt RFC text.
- **EU material:** "content owned by the EU on this website is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence", under "the Commission Decision of 12 December 2011 on the reuse of Commission documents" (https://commission.europa.eu/legal-notice_en). EUR-Lex's own legal notice (where the GDPR text sits) returned HTTP 202 with an empty body, so **EUR-Lex's specific reuse terms are not verified**. The Commission page states the Commission's policy, not EUR-Lex's.
- **MITRE ATT&CK:** "a non-exclusive, royalty-free license to use ATT&CK® for research, development, and commercial purposes… provided that you reproduce MITRE's copyright designation and this license" (https://attack.mitre.org/resources/legal-and-branding/terms-of-use/).
- **OWASP:** the licence file could not be fetched (owasp.org/Top10 redirected to a 326-byte page; the GitHub LICENSE path returned 404). **Not verified.**
- **Closed sources:**
  - Cisco documentation is not licensed for reuse [prior: rules-risks §4].
  - Juniper's site says: "Any other use, including the reproduction, modification, distribution, transmission, republication, display, or performance, of the content on this site is strictly prohibited" (https://www.juniper.net/us/en/legal-notices.html).
  - ISACA: "no license to use, copy, distribute… any ISACA Content", and it prohibits "using any ISACA Content… as an input into AI or AI-powered tools" [prior: rules-risks §4]. COBIT in commercial products needs a licence [prior: §6].
  - ITIL: the itil.com footer reads "©2026 ITIL, PeopleCert and 'Dream it, do it' are registered trademarks of PeopleCert International Ltd. All rights reserved." (https://www.itil.com/). No open licence was found; PeopleCert's terms pages returned 404.

### Brainscape-Certified learner counts (read 2026-09-24, https://www.brainscape.com/learn)

| Deck | Decks | Cards | Learners |
|---|---|---|---|
| CISSP® | 16 | 2,805 | 1,359 |
| CCNA | 53 | 1,329 | 1,160 |
| CompTIA A+ 1201 | 7 | 626 | 884 |
| CIPP-US | 13 | 1,076 | 497 |
| CIPP-E | 12 | 730 | 382 |
| ITIL 4 Foundations | 12 | 374 | 303 |

No Brainscape-Certified deck was listed for Security+, Network+, CySA+, PenTest+, SecurityX, CCSP, SSCP, CC, CISA, CISM, CRISC, CEH, OSCP, GSEC, ENCOR, JNCIA, CIPM or CIPT. The Brainscape "Isc2 Cc" subject page shows "Brainscape Certified Flashcards (0)" (https://www.brainscape.com/subjects/isc2-cc).

### Instructor giveaways have moved behind community gates

- LogNPacific (Josh Madakor's brand) appeared in search results with free CySA+, SecurityX and CISM Anki/practice pages (websearch_log.md).
- On fetch today:
  - The CySA+ and SecurityX URLs redirect to https://joshmadakor.tech/exams/.
  - The CISM Anki page (https://lognpacific.com/free-cism-practice-questions-anki-decks/) returns **404**.
- The exams page now says: "Access to the Practice Exam comes through the Cyber Community on Skool." It covers "Security+, CySA+, CCNA, ITIL Foundation, AZ-900, and SC-200", and the community is described as "a free group on Skool, run by Josh Madakor, with 10,000+ members". The questions are delivered as an in-app deck ("Questions you get wrong come back more often"), not as Anki files.
- Madakor is still a plausible partner, with an existing audience and a free-first stance, but his material is no longer a free Anki download.

---

## Per-certification evidence

### 1. CompTIA Security+ (SY0-701 now; SY0-801 from 17 Nov 2026)
- **Volume:** "More than one million individuals worldwide have earned the CompTIA Security+ certification" [prior: size-demand §3, comptia.org press release].
- **Deck demand:**
  - In r/CompTIA's top-100 `anki` feed, 50 posts mention Security+ (27 in the title). In the `flashcards` feed, 60 do (43 in the title) (`rss/rss_CompTIA_anki_.xml`, `rss_CompTIA_flashcards_.xml`).
  - Sample posts: "Free Flashcards for Security+ (SY0-701)" (https://www.reddit.com/r/CompTIA/comments/1hny2hh/free_flashcards_for_security_sy0701/); "Anki Decks for Net+ and Sec+ to help you pass!" (https://www.reddit.com/r/CompTIA/comments/12xsixk/anki_decks_for_net_and_sec_to_help_you_pass/).
  - r/CompTIA has 307,309 members (reddapi.dev) [prior: distribution §2a].
- **Supply (crowded):**
  - At least nine AnkiWeb SY0-701 decks, including Procensic's 1,475-note deck (updated 2026-06-11), an 843-note port of learn.comptia.org flashcards (2025-11-23) and four acronym decks [prior: competitors §3a].
  - GitHub: JordanyJI99/CompTIA-Security-Flash, "1,600+ flashcards covering all domains of the CompTIA Security+ (SY0-701) exam", 16 stars, updated 2026-09-13 (`github_search_notes.txt`).
  - Crucial Exams: 374 flashcards, paid [prior: competitors §1].
  - Gumroad acronym decks (zeroxriq) [prior: distribution §1a].
  - AnkiWeb 282182839 "Comptia (cyber) Security + certification flip cards": 500 notes, updated 2025-01-24, rated 0 (`ankiweb/`).
  - **No SY0-801 deck can exist from official objectives before launch; I did not search for V8 decks.**
- **Official flashcards:** CompTIA's learning platform appears to have flashcards (an AnkiWeb deck calls itself a port of them) and CertMaster Learn (paid) has "flashcard and games" [prior: competitors §2; distribution §1d]. They are paid, not Anki.
- **Sources:**
  - The objectives PDF is public but carries "Reproduction or dissemination prohibited" [prior: rules-risks §5].
  - Primary sources are largely open: NIST SPs are US-government works; RFCs can be quoted unmodified.
- **Rules:** see the CompTIA section above. Score 1.
- **Churn:**
  - V7 SY0-701 launched 7 Nov 2023. It retires in "English – June 11, 2027; Japanese, Portuguese, Spanish, and Thai – August 13, 2027".
  - V8 SY0-801 has "Launch date: November 17, 2026" and "Retirement: Estimated 3 years after launch" (https://www.comptia.org/en-us/certifications/security/v7/ ; https://www.comptia.org/en-us/certifications/security/v8/). V8 adds "AI-related risks, security operations, and modern environments" (https://www.comptia.org/en-us/certifications/security/).
- **Partners:**
  - Professor Messer is named in 81 of 100 r/CompTIA `anki` posts [prior: distribution §5].
  - Jason Dion is the top-named resource in r/CompTIA "passed" posts (20 of 100) [prior: distribution §2d].
  - Madakor's community covers Security+ (see above).
- **Search:** "Security+ anki deck" returned AnkiWeb decks, a free TeachersPayTeachers deck and three paid Gumroad decks [prior: distribution §1a].
- **Scores:**
  - Demand 5: more than 1M holders and the most-discussed exam.
  - Gap 2: many free decks, including one updated this month; the only gap is the V8 window.
  - Source 4: NIST and RFCs are open; the objectives are all-rights-reserved.
  - Rules 1: CompTIA's AI and free-resource policy.
  - Stability 2: new version in 8 weeks, V7 retires June 2027.
  - Partner 4: Messer, Dion and Madakor.
  - Search 2: a crowded field of AnkiWeb, Gumroad, Quizlet and Etsy.

### 2. CompTIA A+ (220-1201 / 220-1202, V15)
- **Volume:** none published on the pages fetched.
- **Deck demand:**
  - A+ is mentioned in 46 of 100 r/CompTIA `anki` posts (30 in the title) and 48 of 100 `flashcards` posts.
  - Samples: "I made an Anki flash card deck for studying the A+ acronyms, here it is." (https://www.reddit.com/r/CompTIA/comments/5t0945/); "A gift for you guys. I created 1500+ flashcards for the A+ 901." (https://www.reddit.com/r/CompTIA/comments/5nje6y/).
  - Brainscape "CompTIA A+ 1201": 884 learners.
- **Supply:**
  - A 670-note AnkiWeb 220-1201 deck (2025-08-09) and five per-domain Core 1 decks (2026-01-15) [prior: competitors §3a].
  - Madakor's free "1150 questions" A+ Anki deck, posted to LinkedIn for the older exam (319 reactions) [prior: distribution §4a].
  - Two personal GitHub A+ decks with 0 stars (`github_search_notes.txt`).
  - Crucial Exams: 152 cards (paid).
- **Official flashcards:** CertMaster (paid) [prior].
- **Sources:**
  - Objectives are all-rights-reserved.
  - The content is hardware and operating systems. Vendor docs are mixed: Microsoft azure-docs is CC BY 4.0 [prior: rules-risks §4], but the Windows client docs licence was not checked.
- **Rules:** 1.
- **Churn:** "Launch date: March 25, 2025… Retirement: Usually three years after launch (estimated 2028)" (https://www.comptia.org/en-us/certifications/a/core-1-and-2-v15/).
- **Partners:** Messer, Dion, Madakor.
- **Search:** "CompTIA A+ anki deck 1201" returned AnkiWeb per-domain decks and a Madakor LinkedIn post [prior: distribution §1a].
- **Scores:**
  - Demand 4: high Reddit activity but no holder figure.
  - Gap 3: fragmented per-domain decks.
  - Source 3: less standards-based content.
  - Rules 1.
  - Stability 4: to 2028.
  - Partner 4.
  - Search 3.

### 3. CompTIA Network+ (N10-009, V9)
- **Volume:** none published.
- **Deck demand:**
  - Mentioned in 49 of 100 `anki` posts (32 in the title).
  - Samples: "Network+ Exam Success (789 Score)… (400+ Anki Flashcards Provi[ded])" (https://www.reddit.com/r/CompTIA/comments/1ihuukh/); "Here are my Network + (007) ANKI flash cards!" (https://www.reddit.com/r/CompTIA/comments/tsdb9b/).
- **Supply:** AnkiWeb decks "N10-009 2025" (531 notes), "N10-009 COMPLETE" (422) and "N10-009 Acronyms" (161) [prior: competitors §3a]. Crucial Exams: 111 cards (paid).
- **Official:** CertMaster (paid).
- **Sources:** the page itself lists RFC-level topics ("RFC1918, loopback, subnetting (VLSM, CIDR)"). RFCs are quotable unmodified.
- **Rules:** 1.
- **Churn:** "Launch date: June 20, 2024… Retirement: usually three years after launch (estimated 2027)" (https://www.comptia.org/en-us/certifications/network/).
- **Partners / Search:** as for A+. "Network+ N10-009 anki deck" returned 5 AnkiWeb decks, Etsy and Quizlet [prior: distribution §1a].
- **Scores:** Demand 4; Gap 3; Source 4 (RFCs); Rules 1; Stability 3 (estimated 2027); Partner 4; Search 3.

### 4. CompTIA CySA+ (CS0-004, V4)
- **Volume:** none published.
- **Deck demand:**
  - CySA+ is mentioned in 7 of 100 r/CompTIA `anki` posts and 5 of 100 `flashcards` posts.
  - A dedicated `cysa anki` search of r/CompTIA returned 4 posts, none deck-titled (`rss/rss_CompTIA_cysa_anki_.xml`).
  - A Medium post "Passing my CompTIA CySA+ with Anki" appeared in results (websearch_log.md; not opened).
- **Supply:**
  - Search for "CompTIA CySA+ CS0-003 anki deck" returned Etsy listing 1835463169, titled "Comptia Cysa+ CS0-003 Anki Flashcards | Exam Prep **Official Questions**" (Etsy returned 403; seen in results only).
  - noji.io decks for the CS0-001 and CS0-002 versions, which are retired.
  - LogNPacific free domain pages, which now redirect to the gated Skool app.
  - **No CS0-004 deck was seen in any result.**
- **Official:** CertMaster (paid).
- **Sources:** NIST incident-response SPs (public domain under §105); MITRE ATT&CK (royalty-free licence).
- **Rules:** 1.
- **Churn:**
  - V4 CS0-004: "Launch date: June 23, 2026".
  - V3 CS0-003 "will retire in English on December 22, 2026" (https://www.comptia.org/en-us/certifications/cybersecurity-analyst/v4/ ; …/v3/).
- **Partners:** Madakor's community lists CySA+.
- **Search:** results were Etsy, noji.io, LogNPacific and a Coursera course (websearch_log.md). No AnkiWeb deck ranked.
- **Scores:**
  - Demand 3: a mid-level exam with modest Reddit activity.
  - Gap 5: no V4 deck seen.
  - Source 4.
  - Rules 1.
  - Stability 4: launched in June 2026.
  - Partner 3.
  - Search 4: weak incumbents.

### 5. CompTIA PenTest+ (PT0-003, V3)
- **Volume:** none published.
- **Demand:** 2 of 100 r/CompTIA `anki` posts mention it (none in the title). A dedicated `pentest anki` search returned 6 posts, none deck-titled (`rss/rss_CompTIA_pentest_anki_.xml`).
- **Supply:**
  - Etsy 1824559724, "Pentest+ PT0-003 Exam Prep | Official Flashcards Anki Exam Question" (seen in results only).
  - GitHub UGL13RTH4NU/Pentest-003 ("Repo for CompTIA Pentest+ - 003/ WGU D332"; the search summary said an Anki deck is planned, which is not verified).
  - A Quizlet study guide.
  - LogNPacific pages for the retired PT0-002.
- **Sources:** MITRE ATT&CK licensed; tool documentation varies.
- **Rules:** 1.
- **Churn:** "Launch date: December 17, 2024… Retirement: Usually three years after launch (estimated 2027)" (https://www.comptia.org/en-us/certifications/pentest/).
- **Scores:** Demand 2; Gap 4; Source 4; Rules 1; Stability 3; Partner 2; Search 4 (Etsy, GitHub, Quizlet only).

### 6. CompTIA SecurityX (formerly CASP+; CAS-005, V5)
- **Volume:** none published.
- **Demand:** 4 of 100 `anki` posts mention CASP or SecurityX (1 in the title). A `securityx` search returned 100 posts, none deck-titled (`rss/rss_CompTIA_securityx_.xml`).
- **Supply:** Etsy 1838198579 "SecurityX (V5) Anki Flashcards: CAS-005"; LogNPacific's free SecurityX page (now gated). Older AnkiWeb Security+ 601 decks rank for the query (websearch_log.md).
- **Churn:** "Launch date: December 17, 2024… Retirement: usually three years after launch (estimated 2027)" (https://www.comptia.org/en-us/certifications/securityx/).
- **Scores:** Demand 2; Gap 4; Source 4; Rules 1; Stability 3; Partner 2; Search 4.

### 7. ISC2 CISSP (outline effective 15 Apr 2024)
- **Volume:**
  - ISC2 has "more than 270,000 certified members, and associates" (https://www.isc2.org/about).
  - 191,036 CISSP holders as of December 2025 comes from Wikipedia (secondary; not verified at source) [prior: size-demand §3]. ISC2's member-counts URL redirects to /about, and the Wayback copy returned 403.
- **Deck demand:**
  - r/cissp: 67 results for `anki`, 7 deck-titled (re-fetched today, `rss/rss_cissp_anki_.xml`); 100 results for `flashcards`, 0 deck-titled [prior feed: certs/raw-dist/rss_cissp_flashcards.xml].
  - Samples: "Are there any premade flashcards for CISSP?" (https://www.reddit.com/r/cissp/comments/smpiqs/); "Anki cards" (2025, https://www.reddit.com/r/cissp/comments/1mi51av/anki_cards/); "Making effective Anki cards from Practice Exams" (2026-06-24, https://www.reddit.com/r/cissp/comments/1uei3vi/).
  - Brainscape CISSP: 1,359 learners.
  - r/cissp has 95,995 members [prior: distribution §2a].
- **Supply:**
  - AnkiWeb "CISSP 10k" (9,103 notes, "from AIO and OSG", 2021-04-19, +3).
  - "CISSP – By Josh Madakor" (1,043 notes, 2023-06-29, +8/-1).
  - "CISSP Flash cards" (624, 2022) [prior: competitors §3a].
  - Thor's CISSP Flashcards (2,800 cards, paid); the DestCert app [prior: distribution §4a].
  - GitHub: 0 repos for "anki cissp" (`github_search_notes.txt`).
- **Official flashcards:** free, interactive and form-gated: "Fill out the short form for FREE access" [prior: competitors §2]. ISC2's CISSP page links "Test your knowledge with CISSP Flash Cards" (https://www.isc2.org/certifications/cissp).
- **Sources:**
  - The outline page is public, with a "View PDF" link (CISSP-Exam-Outline-April-2024-English.pdf, https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline).
  - The site footer says contents "may not be copied, reproduced or distributed without prior written permission" [prior: rules-risks §4].
  - Primary sources: NIST SPs and US statutes are public domain; ISO standards are paywalled (not fetched).
- **Rules:** the NDA covers exam items. "General discussions about exams that do not share specific exam items are permissible" [prior: rules-risks §1]. No anti-third-party-prep policy was found. Marks: CISSP is a registered mark to be used with ® [prior: §2].
- **Churn:**
  - "Effective Date: April 15, 2024".
  - The page now describes AI tasks woven "across all eight domains" (outline page).
  - The triennial cycle is sourced only to Wikipedia [prior: size-demand §5]. A 2027 refresh is therefore **not verified**.
- **Partners:**
  - Destination Certification (33 of 100) and Sybex/Chapple (38 of 100) are the top-named resources in r/cissp "passed" posts [prior: distribution §2d].
  - Madakor has made a CISSP deck before.
  - ISC2 chapters exist.
- **Search:** "CISSP anki deck" returned 4 AnkiWeb decks plus ISC2. "CISSP flashcards" returned apps, ISC2 official pages, DestCert and Thor [prior: distribution §1].
- **Scores:**
  - Demand 5.
  - Gap 3: large free decks exist but date from 2021–2023, are built from copyrighted books, and have tiny ratings. ISC2's cards are free but gated.
  - Source 4.
  - Rules 4.
  - Stability 3.
  - Partner 4.
  - Search 3.

### 8. ISC2 CCSP (outline effective 1 Aug 2026)
- **Volume:** none published per cert.
- **Deck demand:**
  - r/CCSP `anki` returned 1 post ("Passed CCSP!", 2019; `rss/rss_ccsp_anki_.xml`).
  - r/CCSP `flashcards` returned 23 posts, 3 deck-titled (`rss/rss_ccsp_flashcards_.xml`): "Best CCSP Flashcards?" (2022, https://www.reddit.com/r/CCSP/comments/uaiw17/); "ISC2 Flashcard question" (2022); "Using Dest Cert Flash Cards and its mentioning things not in the course or book." (2026-08-09, https://www.reddit.com/r/CCSP/comments/1vjyiga/).
  - The 2026 post is a quality complaint about a paid deck.
- **Supply:**
  - AnkiWeb 587987390 "CCSP Study" ranked first for "CCSP anki deck", but its info endpoint now returns "not available" (`ankiweb/info_587987390.pb`). The deck appears to have been removed.
  - Etsy 1557791123 ("CCSP Flashcards 2024 Anki") and 1854425881 ("CCSP… Official Cloud Security Exam Question"); a "Mega Bundle" Etsy deck (websearch_log.md; Etsy 403).
  - DestCert app includes CCSP [prior: distribution §4a].
- **Official:** ISC2 free flash cards page lists CCSP [prior: competitors §2].
- **Sources:**
  - Outline PDF: EXAMS-CCSP-Exam-Outline-English-01-2026-V2.pdf.
  - The outline cites NIST, ISO, CIS, COBIT and ITIL (https://www.isc2.org/certifications/ccsp/ccsp-certification-exam-outline). NIST is open; ISO, COBIT and ITIL are proprietary.
- **Rules:** as for CISSP.
- **Churn:** "AUGUST 1, 2026 CCSP Certification Exam Outline" (outline page).
- **Partners:** DestCert; ISC2 chapters.
- **Search:** AnkiWeb (dead deck), Etsy x3, a LinkedIn post and Gumroad (websearch_log.md).
- **Scores:**
  - Demand 3: no count and little Reddit signal.
  - Gap 5.
  - Source 4.
  - Rules 4.
  - Stability 5: outline is 8 weeks old.
  - Partner 3.
  - Search 4.

### 9. ISC2 SSCP (outline effective 1 Oct 2025)
- **Volume:** none published.
- **Deck demand:** no SSCP-specific Reddit feed was collected.
- **Supply:** none found. "SSCP anki deck" returned no SSCP deck, only CISSP decks, Wikipedia and ISC2's SSCP flash cards (websearch_log.md).
- **Official:** "Test Your Knowledge with FREE SSCP Flash Cards… Fill out the form for free access" (https://cloud.connect.isc2.org/sscp-flashcards).
- **Churn:** "Effective Date: October 1, 2025 SSCP Certification Exam Outline" (https://www.isc2.org/certifications/sscp/sscp-certification-exam-outline).
- **Scores:** Demand 2; Gap 5; Source 4; Rules 4; Stability 4; Partner 2; Search 5 (nothing competing).

### 10. ISC2 Certified in Cybersecurity (CC; outline effective 1 Sep 2026)
- **Volume:**
  - "1 million+ people enrolled", "570,000+ participants took their CC course", "65,000+ individuals progressed through the program to earn their CC certification".
  - The programme "has closed new enrollments". Codes can be used "by December 31, 2026", and course access continues for those who "enrolled… before May 20, 2026" (https://www.isc2.org/landing/1mcc).
  - Future candidates will pay, so volume may fall. That is an inference.
- **Deck demand:**
  - "Recommended Anki decks for CC?": "are there any good up to date premade decks with definitions of the material for the CC?" (r/isc2, 2026-07-07, https://www.reddit.com/r/isc2/comments/1upkhm3/).
  - r/isc2 `flashcards` returned 27 posts, 2 deck-titled: "ISC2 CC Flashcards for prepping" (2023) and "Certification in Cybersecurity flashcard query" (2024) (`rss/rss_isc2_flashcards_.xml`).
- **Supply:**
  - AnkiWeb 394560362 "Certified in Cybersecurity Flash Cards ISC2": 166 notes, updated 2023-12-25, +6/-1 (`ankiweb/`). This predates the 2026 outline.
  - Brainscape: 0 certified decks.
- **Official:** free, form-gated: "Test Certified in Cybersecurity Knowledge with FREE Interactive Flash Cards" (https://cloud.connect.isc2.org/cc-flashcards).
- **Churn:** "EFFECTIVE DATE: SEPTEMBER 1, 2026". The new outline adds AI topics (https://www.isc2.org/certifications/cc/cc-certification-exam-outline).
- **Scores:**
  - Demand 3: large past cohort, but the free pipeline has ended.
  - Gap 4.
  - Source 5: foundational concepts, NIST.
  - Rules 4.
  - Stability 4.
  - Partner 3.
  - Search 3: AnkiWeb, ISC2 and Brainscape rank.

### 11. ISACA CISA
- **Volume:** "Since its inception in 1978, more than 200,000 people have obtained ISACA's CISA certification" (https://www.isaca.org/credentialing/cisa/cisa-exam-content-outline). ISACA overall: "300,000+ Certifications awarded to date" (https://www.isaca.org/credentialing) and "185,000 members… 225 chapters" (https://www.isaca.org/about-us).
- **Deck demand:**
  - r/CISA `anki` returned 6 posts, none deck-titled; the matches are pinned resource threads and "passed" posts (`rss/rss_CISA_anki_.xml`).
  - r/CISA `flashcards` returned 35 posts, 4 deck-titled (`rss/rss_CISA_flashcards_.xml`):
    - "Need a source for valid up to date CISA flashcards YES I plan on buying them" (2024-08-20, https://www.reddit.com/r/CISA/comments/1exam9d/)
    - "QAE alternative on Quizlet?" (2024)
    - "CISA Flashcards" (2026-08-11): "My weakest point is terminology" (https://www.reddit.com/r/CISA/comments/1vlxg4y/cisa_flashcards/)
- **Supply:**
  - Etsy 1835698299 "CISA Exam Prep Flashcards Anki | **Official ISACA Practice Questions**"; Gumroad (anthonytoday101); cisaexamstudy.com flashcards page (websearch_log.md).
  - A Reddit giveaway: "Some (around 1,500) flashcards I made for the CISA exam if anyone wants to use them" (2024-10-17, https://www.reddit.com/r/CISA/comments/1g5quvl/). The format and host are not in the RSS body.
  - No CISA AnkiWeb deck appeared. GitHub: 0 repos.
- **Official:** no flashcards found. ISACA sells a QAE database, "a comprehensive 1,070-question pool", and offers "10 free questions" and a member-only study forum (https://www.isaca.org/credentialing/cisa).
- **Sources:** the outline is public on isaca.org (150 questions, 5 domains). Audit sources are partly proprietary (COBIT is licensed [prior]). NIST is open.
- **Rules:**
  - ISACA terms bar reuse of ISACA content and its use "as an input into AI or AI-powered tools".
  - The candidate guide bans "use of unauthorized study materials" without defining the term [prior: rules-risks §1, §4].
  - Score 2.
- **Churn:** outline effective date **not verified**. The current Review Manual is the "28th Edition 2024" (CISA page).
- **Partners:** 225 chapters; no deck-friendly partner identified.
- **Search:** "CISA exam anki deck" returned Etsy, Medium, Wikipedia, CC and Security+ AnkiWeb decks, Gumroad x2 and cisaexamstudy (websearch_log.md). There is no strong incumbent.
- **Scores:** Demand 4; Gap 4 (one community set, from 2024); Source 3; Rules 2; Stability 3; Partner 3; Search 4.

### 12. ISACA CISM (new outline from 3 Nov 2026)
- **Volume:** "Since its inception in 2002, more than 107,000 people have obtained ISACA's CISM certification" (https://www.isaca.org/credentialing/cism/cism-exam-content-outline).
- **Deck demand:** r/cism `anki` returned 0 entries. The subreddit is active: its `passed` feed returned 100 posts, including one dated 2026-09-18. Only 3 of those 100 mention Anki, flashcards or Quizlet (`rss/rss_CISM_passed_.xml`).
- **Supply:**
  - Etsy 1821501820 (CISM Anki) and the mega bundle ("CISM with 700+ cards" per the search summary; not verified).
  - LogNPacific's free CISM Anki page now returns 404.
  - DestCert app includes CISM [prior].
  - GitHub: 0 repos.
- **Official:** a QAE database, "1,047-question pool" (paid), and 10 free questions (https://www.isaca.org/credentialing/cism).
- **Churn:** "the CISM Exam Content Outline will be updated effective 3 November 2026" (CISM page). There is a support article, "Certification-CISM-Job-Practice-Update-2026" (JavaScript shell; content not readable).
- **Rules:** 2, as for CISA.
- **Scores:**
  - Demand 4.
  - Gap 5: every existing deck predates the new outline.
  - Source 3.
  - Rules 2.
  - Stability 4: fresh outline, so a deck built for November would stay current.
  - Partner 3.
  - Search 4.

### 13. ISACA CRISC
- **Volume:** "Since its inception in 2010, more than 46,000 people have obtained ISACA's CRISC certification" (https://www.isaca.org/credentialing/crisc/crisc-exam-content-outline).
- **Demand:** r/CRISC `anki` returned 0; r/isaca `anki` returned 1 ("CRISC passed March 2020").
- **Supply:** no Anki deck found. The search returned Gumroad "ykiob6i.gumroad.com/l/CRISCExamDumps", two iOS apps and a DestCert guide (websearch_log.md).
- **Official:** QAE, "833-question pool" (paid) (https://www.isaca.org/credentialing/crisc).
- **Churn:** outline date not verified.
- **Scores:** Demand 2; Gap 5; Source 3; Rules 2; Stability 3; Partner 2; Search 4.

### 14. EC-Council CEH (312-50, v13)
- **Volume:** none published on the pages fetched.
- **Deck demand:**
  - r/CEH `anki` returned 7 posts, 3 deck-titled: "Anki CEH flash cards" (2019), "CEH Anki?" (2023), "Anki flash card" (2024) (`rss/rss_CEH_anki_.xml`).
  - r/CEH `flashcards` returned 16 posts, 4 deck-titled. One is "CEH v13 Flashcards" (2025-03-05): "Someone please tell me where I can find CEH exam module-wise flash cards." (https://www.reddit.com/r/CEH/comments/1j3uhen/).
- **Supply:**
  - AnkiWeb 43324513 "CEH Study Deck": 174 notes, 2020-10-01, no ratings.
  - AnkiWeb 1507379050 "ChuckMaster CEH": 372 notes, 2023-10-06, +1/-1 (`ankiweb/`).
  - A Brainscape user pack by Jeff Corbett; IPSpecialist "CEHv13 study cards" on Gumroad (websearch_log.md).
- **Official:** "Students receive official exam prep test banks" (course buyers) (https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/).
- **Sources:** the CEH v13 brochure PDF is offered as a "Free Download". MITRE ATT&CK is licensed; OWASP licence not verified.
- **Rules:** EC-Council's exam policy URL returned 404. The legal page gave no usable text. **Not verified**, score 3.
- **Churn:** "The Certified Ethical Hacker exam (312-50)" (https://cert.eccouncil.org/certified-ethical-hacker.html). "Currently in its 13th version" (CEH page). No retirement date found.
- **Scores:** Demand 3; Gap 4; Source 4; Rules 3; Stability 3; Partner 2; Search 4.

### 15. OffSec OSCP / OSCP+
- **Volume:** none published.
- **Demand:** r/oscp `anki` returned 0 entries and `flashcards` returned 1 (`rss/rss_oscp_anki_.xml`, `rss_oscp_flashcards_.xml`). The exam is "24-hour proctored" and hands-on (https://www.offsec.com/courses/pen-200/).
- **Supply:** GitHub "anki oscp" returned 0. "OSCP anki deck" returned no OSCP deck (websearch_log.md).
- **Rules:** users must not "(a) share… our course materials with any third party including by posting on any platform" (https://www.offsec.com/legal-docs/). Independent methodology cards are not addressed.
- **Churn:** "the OSCP certification has no expiration date"; OSCP+ is renewed "every 3 years" (PEN-200 page).
- **Scores:** Demand 1; Gap 3; Source 4; Rules 3; Stability 4; Partner 2; Search 3.

### 16. GIAC GSEC
- **Volume:** none published.
- **Demand:** r/GIAC `anki` returned 5 posts, 1 deck-titled ("Anki/BrainScape decks for Sec504", 2023, which is GCIH, not GSEC). `flashcards` returned 6 posts, 0 deck-titled. r/SANSInstitute `anki` returned 0 (`rss/rss_GIAC_*`). GIAC exams are open-book: GIAC lists "Open Book Testing Guidelines" (https://www.giac.org/policies). That may reduce the value of flashcards (an inference).
- **Supply:** none found. "GIAC GSEC anki deck" returned only an unrelated surgery deck ("gsse-anki") and course pages (websearch_log.md).
- **Official:** practice tests (paid): "Practice exams never include actual exam questions" (https://www.giac.org/certifications/security-essentials-gsec).
- **Rules:** exam integrity lists "Using illegally obtained and copyrighted material from GIAC or a third-party source such as training providers" (https://www.giac.org/policies/exam-integrity). Cards must not reuse SANS courseware.
- **Churn:** "106 questions", "passing score… 72% for… the exam version released on or after April 6, 2026" (GSEC page).
- **Scores:** Demand 1; Gap 5; Source 4; Rules 3; Stability 4; Partner 2; Search 5.

### 17. Cisco CCNA (200-301 v1.1)
- **Volume:** cisco.com returned 403, so this is not verified [prior].
- **Deck demand:**
  - r/ccna `anki`: 100 results, 10 deck-titled (`rss/rss_ccna_anki_.xml`). Examples: "Anki Cards are a godsend" (2024); "Which Anki deck is better, Jeremy's Lab or Neil's?"
  - In "passed" posts, Anki is named 12 times and flashcards 20 times [prior: distribution §2d].
  - Brainscape CCNA: 1,160 learners.
- **Supply (strong):**
  - AnkiWeb 591991787 (884 notes, +268/-4, 2024-07-31) [prior: competitors §3a].
  - Jeremy's IT Lab free decks, email-gated [prior: distribution §4a].
  - Neil Anderson decks.
- **Sources:** exam topics PDF is public: "CCNA Exam v1.1 (CCNA 200-301) is a 120-minute exam"; "the guidelines below may change at any time without notice" (https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf). Cisco docs are not licensed for reuse; RFCs are usable.
- **Rules:** Cisco's trademark agreement tells certified individuals not to use marks on training materials. A nominative-use rule for third parties is not verified [prior: rules-risks §2].
- **Churn:** v1.1 current; next version not verified.
- **Scores:**
  - Demand 5.
  - Gap 1.
  - Source 4.
  - Rules 3.
  - Stability 3.
  - Partner 2: JITL is itself the incumbent.
  - Search 2.

### 18. Cisco CCNP Enterprise core (ENCOR 350-401)
- **Volume:** not verified.
- **Deck demand:**
  - r/ccnp `anki`: 63 results, 10 deck-titled (`rss/rss_ccnp_anki_.xml`).
  - Examples: "My ENCOR study notes and Anki flashcards" (2024, https://www.reddit.com/r/ccnp/comments/1b1oqw7/); "Anki flash cards for ENCOR" (2023); "Anki flashcards for CCNP ENSLD 300-420?" (2026-05-14, a request).
  - r/ccnp has 33,938 members [prior: distribution §2a].
- **Supply:** personal chapter-by-chapter decks shared on Reddit. GitHub "anki ccnp OR anki encor" returned 0. No Brainscape-Certified deck.
- **Sources:** the Cisco Learning Network ENCOR exam-topics page is a JavaScript shell (142 characters of text), and guessed exam-topic PDF URLs returned 403. **The exam version is not verified.**
- **Scores:** Demand 3; Gap 4; Source 3; Rules 3; Stability 3; Partner 2; Search 3 (nv).

### 19. Juniper JNCIA-Junos (JN0-106)
- **Exam details:** "Exam code JN0-106… 90 minutes… 65 multiple-choice questions… Software versions Junos OS 21.2… Juniper certifications are valid for three years" (https://www.juniper.net/us/en/training/certification/tracks/junos/jncia-junos.html).
- **Demand:** r/Juniper `anki`: 2 results, 0 deck-titled; one is "JNCIA-Junos (JN0-105) study materials" (2025). A `jncia` search returned 100 posts; 1 mentions Anki, flashcards or Quizlet (`rss/rss_Juniper_jncia_.xml`).
- **Supply:** GitHub 0; none found.
- **Sources:** Juniper site content reproduction "strictly prohibited" (legal notices).
- **Scores:** Demand 1; Gap 4; Source 3; Rules 3; Stability 3; Partner 1; Search 3 (nv).

### 20. PeopleCert ITIL 4 Foundation
- **Volume:** "over three million professionals worldwide have achieved ITIL certification" (https://www.itil.com/). Brainscape ITIL 4 Foundations: 303 learners.
- **Deck demand:** r/ITIL `flashcards` returned 20 posts, 3 deck-titled ("ITIL 4 Flashcards?", 2022; two 2019 PDFs). All 3 `anki` results are "passed" posts that mention Anki, including 2025-12-29 and 2026-04-23 (`rss/rss_ITIL_*`).
- **Supply:**
  - GitHub: sergekby/ITIL_4_Glossary_EnEn (7 stars, updated 2026-06-05).
  - ronator/itil4anki (6 stars, "based on almost 300 example questions publicly available on the internet").
  - allanlopesprado/itil4-foundation ("180 Anki Flashcards covering 100% of Syllabus v4.2", updated 2026-09-10) (`github_search_notes.txt`).
  - Madakor's gated practice exam covers "ITIL Foundation".
- **Official:** "Official Training Materials for ITIL 4 Foundation… Learner Workbook and Quick Reference Guide" (https://www.peoplecert.org/…/itil-4-foundation-2565). The exam has 40 questions and runs 60 minutes (same page).
- **Churn:**
  - "The current plan is to sunset all ITIL 4 modules on 31 December 2027."
  - ITIL (Version 5) Foundation now exists, along with a one-day "ITIL Foundation Bridge (Version 5)" (https://www.itil.com/Itil-News-and-Announcements/itil-version-5-explained).
- **Sources:** proprietary; no open licence found.
- **Scores:**
  - Demand 3.
  - Gap 3.
  - Source 1.
  - Rules 2.
  - Stability 1: sunset announced. If ITIL is pursued at all, target Version 5, and that needs a licence check first.
  - Partner 2.
  - Search 3 (nv).

### 21. IAPP CIPP/E
- **Volume:** IAPP: "100,000 Certifications awarded", "90,000+ Members", "160+ Local chapters" (https://iapp.org/about). No per-cert figure. Brainscape CIPP-E: 382 learners (12 decks, 730 cards).
- **Deck demand:**
  - r/iapp `anki` returned 0, and r/iapp `CIPP` returned 19 posts, none mentioning Anki, flashcards or Quizlet.
  - r/gdpr `CIPP` returned 79 posts; 2 mention them: "CIPP/E exam passed, lessons learned" (2023) and "Best materials for self-studying CIPP/E?" (2026-03-25, https://www.reddit.com/r/gdpr/comments/1s3ihgy/) (`rss/rss_iapp_CIPP_.xml`, `rss_gdpr_CIPP_.xml`).
  - **Reddit flashcard demand is weak.** Brainscape learners are the main signal, so Demand is 2.
- **Supply:** GitHub "anki gdpr OR anki cipp" returned 0. No AnkiWeb deck seen. The paid Brainscape-Certified deck is the only structured competitor found.
- **Official:** "Free study guides… downloadable guide that covers the exam format and offers sample questions" (https://iapp.org/certify/cippe). No flashcards.
- **Sources:**
  - The Body of Knowledge PDF is public: "Version: 1.3.3… Approved on: 4 March 2025, Effective date: 1 Sept. 2025". It covers "2016/679 and related legislation, the NIS/NIS 2" (IAPP_Training-CIPPE_BOK.pdf).
  - EU law is reusable under the Commission's CC BY 4.0 policy (EUR-Lex terms not verified).
- **Rules:**
  - The handbook's confidentiality agreement: "I will not disclose the exam questions or answers or discuss any of the content of the exam".
  - "No question will be on the exam that is not covered by a topic or subtopic on that exam's body of knowledge. The body of knowledge should serve as the candidate's core resource" (IAPP-Certification_Handbook.pdf).
  - No third-party-materials ban found. IAPP trademark rules not fetched.
- **Scores:**
  - Demand 2.
  - Gap 5.
  - Source 5.
  - Rules 4.
  - Stability 4.
  - Partner 3: chapters.
  - Search 4 (only one WebSearch query was run for IAPP; the rest is nv).

### 22. IAPP CIPP/US
- **BoK:** "Version: 2.6.1… Effective date: 1 Sept. 2025". It lists recent state laws, for example "the Delete Act (SB 362) (2023)" and "Nevada Consumer Health Data Privacy" (IAPP_Training-CIPPUS_BOK.pdf).
- **Demand:** Brainscape CIPP-US: 497 learners (13 decks, 1,076 cards). IAPP offers a free CIPP/US study guide (https://pages.iapp.org/Free-Study-Guides_CIPPUS-FSG.html).
- **Supply:** none free found (GitHub 0).
- **Sources:** US federal statutes are public domain under 17 U.S.C. §105.
- **Scores:**
  - Demand 2: Brainscape only; no Reddit deck talk.
  - Gap 5.
  - Source 5.
  - Rules 4.
  - Stability 3: the BoK tracks fast-moving state law.
  - Partner 3.
  - Search 4.

### 23. IAPP CIPM
- **BoK:** "Version 4.2.0… Effective date: 1 Sept. 2025" (CIPM_BoK_EBP.pdf).
- **Demand:** no Brainscape-Certified deck; no Reddit signal.
- **Supply:** none found.
- **Sources:** programme-management content with few open primary texts.
- **Scores:** Demand 2; Gap 5; Source 2; Rules 4; Stability 4; Partner 3; Search 3 (nv).

### 24. IAPP CIPT
- **BoK:** "Version: 4.0.0… Effective date: 1 Sept. 2025" (IAPP_Training-CIPT_BOK.pdf). IAPP sells "90 practice exam questions" (https://iapp.org/certify/cipt).
- **Scores:** Demand 2; Gap 5; Source 3 (NIST open; ISO paywalled); Rules 4; Stability 4; Partner 3; Search 3 (nv).

---

## Others noticed (not scored)
- **CompTIA SecAI+ (CY0-001):** a GitHub study guide with "210+ Anki flashcards", created 2026-06 (`github_search_notes.txt`). It is new, but CompTIA's rules apply.
- **Cisco CyberOps Associate (CBROPS 200-201):** "An Anki deck for Cisco Cyberops Associate CBROPS 200-201" (r/cybersecurity, 2024-11-24).
- **CCNP DCCORE 350-601:** two r/ccnp deck-sharing posts (2024, 2026).

## Not verified
- Google rankings for any query. The WebSearch quota ran out after 12 queries, and the curl-based engines were blocked or unusable.
- Holder counts for Cisco, CompTIA (apart from Security+), EC-Council, GIAC, OffSec, Juniper and IAPP per certification.
- Etsy, Quizlet and Gumroad listing contents (seen as titles only).
- EUR-Lex reuse terms, the OWASP licence, and NIST's publication-specific licensing statement.
- The CISA and CRISC outline effective dates, the ENCOR version and a CCNA successor.
- Reddit feeds that returned HTTP 429 in the first pass (see `rss_log.txt`). Most were re-fetched in `rss_log2.txt`. Still missing: CySA/PenTest/SecurityX `flashcards`, `ITIL` in r/sysadmin and r/ITCareerQuestions, and r/netsecstudents.
