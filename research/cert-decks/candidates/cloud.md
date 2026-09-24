# Candidate certifications: cloud, DevOps and platform

Researched 2026-09-24 for a free site of standardised, sourced flashcard decks (Anki + CSV + web page per deck).

**Evidence rules.**
- Every fact below was read in a page fetched during this task, or in the earlier research files, which are cited as `[prior: file §]`. The prior files are in `/home/user/law-tome/research/cert-decks/certification-market/`.
- Raw copies are in `scratchpad/candidates/raw-cloud/`. Each page has `<name>.raw`, `.txt` and `.url` files; the `.url` file holds the URL and the HTTP code.
- AnkiWeb deck data was decoded from AnkiWeb's own endpoint, `https://ankiweb.net/svc/shared/item-info?sharedId=<id>`. The files are `raw-cloud/ankiweb/*.bin`, the decoder is `aw2.py`, and the table is `ankiweb_table1.txt`. The fields are note count, last-modified date, thumbs up and "other" reviews.
- Reddit data comes from search RSS feeds in `raw-cloud/rss/` (top of all time, at most 100 entries per feed). They were counted with `rssan.py`. The RSS carries post bodies but no comments or scores.
  - A count of "deck posts" means posts with anki, flashcard or deck in the title.
  - A count of "mentions" means posts whose title or body matches a cert regex. The regexes are crude: "ACE" also matches the word "ace", and "SAA" matches generously.
- Search rankings: the rankings are **Claude's WebSearch tool (US), not Google**. The ranked lists are in `raw-cloud/websearch_log.md`. The session's web-search budget (200) ran out partway through, so some queries were never run. Those are marked "not run".
- "Not verified" means I did not read the fact in raw text.

---

## 1. Summary table

Scores run from 1 to 5, and higher is better on every column: Gap = weak existing supply, Stability = low churn. The maximum total is 35.

| Cert | Exam code (current) | Demand | Gap | Source | Rules | Stability | Partner | Search | Total | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| KCNA Kubernetes & Cloud Native Associate | KCNA | 3 | 4 | 5 | 5 | 4 | 4 | 4 | **29** | Build first: CC BY curriculum+docs, 31k regs (+72%), only paid/1-star supply, conceptual MCQ suits cards |
| CKA Certified Kubernetes Administrator | CKA (K8s v1.35) | 3 | 4 | 5 | 5 | 3 | 4 | 4 | **28** | Build: biggest CNCF volume (291k), top AnkiWeb deck now missing; keep deck to concepts + kubectl recall, re-check per K8s release |
| CKAD Certified Kubernetes App Developer | CKAD (K8s v1.35) | 3 | 4 | 5 | 5 | 3 | 5 | 3 | **28** | Build with CKA: MIT-licensed 10k-star exercise repo is a ready partner/source; AnkiWeb copies are 2019-2023 |
| CKS Certified Kubernetes Security Specialist | CKS (K8s v1.35) | 2 | 5 | 4 | 5 | 3 | 4 | 5 | **28** | Build as the 4th K8s deck: no CKS Anki deck at all, 75k regs; third-party tool docs need licence checks |
| AZ-305 Azure Solutions Architect Expert | AZ-305 | 3 | 5 | 4 | 4 | 4 | 3 | 5 | **28** | Build: an explicit flashcard request, no Anki deck exists, CC BY docs, stable (no retirement listed) |
| AZ-104 Azure Administrator | AZ-104 | 5 | 3 | 4 | 4 | 4 | 3 | 3 | **26** | Build: most-requested Azure deck; free supply is a 4k-MCQ AI-assisted repo and 'dump' decks - sourced cards differentiate |
| Google Cloud Digital Leader | CDL (guide launched 2026-08-12) | 2 | 5 | 4 | 4 | 4 | 2 | 5 | **26** | Build (cheap): brand-new guide, zero Anki supply, CC BY docs; demand evidence thin |
| AZ-900 Azure Fundamentals | AZ-900 | 4 | 3 | 4 | 4 | 4 | 3 | 3 | **25** | Build: high mentions, AnkiWeb decks 2019-2024 incl. a 'dump'; outline refreshed 2026-07-20 |
| DP-900 Azure Data Fundamentals | DP-900 | 2 | 4 | 4 | 4 | 4 | 3 | 4 | **25** | Later: only AnkiWeb deck is 2020; weak demand |
| AI-901 Azure AI Fundamentals | AI-901 (replaced AI-900 2026-06-30) | 3 | 5 | 4 | 4 | 2 | 3 | 4 | **25** | Later/optional: no Anki deck, but Microsoft AI exams churn fastest |
| Google Professional Cloud Architect | PCA | 2 | 5 | 4 | 4 | 3 | 2 | 5 | **25** | Later: no deck, CC BY docs, but low Reddit demand |
| Terraform Associate | 004 (Terraform 1.12) | 3 | 4 | 3 | 3 | 3 | 4 | 4 | **24** | Build if resourced: best free deck (94*) targets retired 003; BUSL docs usable for free site (my reading) |
| LFCS | LFCS | 1 | 5 | 2 | 4 | 3 | 3 | 5 | **23** | Skip for now: empty market but no demand signal and unclear source licences |
| Google Associate Cloud Engineer | ACE | 2 | 3 | 4 | 4 | 3 | 2 | 3 | **21** | Later: a 431-note AnkiWeb deck updated 2026-01 already exists |
| AWS Solutions Architect Associate | SAA-C03 | 5 | 1 | 2 | 4 | 4 | 3 | 2 | **21** | Skip: highest demand but AWSomecards (free) + Brainscape + Crucial + many AnkiWeb decks; AWS docs not open |
| AWS Cloud Practitioner | CLF-C02 | 5 | 1 | 2 | 4 | 4 | 3 | 1 | **20** | Skip: saturated (AWSomecards free, Procensic 1,521-note AnkiWeb, Brainscape, Crucial) |
| AWS AI Practitioner | AIF-C01 | 4 | 2 | 2 | 4 | 3 | 3 | 2 | **20** | Skip: served by AWSomecards 280+, Brainscape, AnkiWeb 293-note deck |
| AWS CloudOps Engineer Associate | SOA-C03 | 2 | 2 | 2 | 4 | 4 | 3 | 3 | **20** | Skip: AWSomecards covers it; low deck demand |
| RHCSA | EX200 (RHEL 10) | 2 | 4 | 2 | 3 | 3 | 3 | 3 | **20** | Later: free decks date from 2018 or target RHEL 9, but Red Hat docs licence unverified and demand thin |
| Salesforce Platform Administrator | Platform Administrator | 3 | 4 | 1 | 2 | 3 | 3 | 3 | **19** | Avoid: Program Terms make Trailhead learning content confidential/non-commercial |
| Databricks Data Engineer Associate | DEA (guide May 2026) | 2 | 5 | 1 | 3 | 2 | 2 | 4 | **19** | Avoid for now: no Anki supply but docs forbid derivative works and blueprint just restructured |
| AWS Developer Associate | DVA-C02 -> DVA-C03 (2026-10-27) | 3 | 2 | 2 | 4 | 1 | 3 | 3 | **18** | Wait: DVA-C02 ends 2026-12-01; reassess for C03 vs AWSomecards |
| AWS Security Specialty | SCS-C03 | 2 | 1 | 2 | 4 | 4 | 3 | 2 | **18** | Skip: AWSomecards 400+, Crucial 220, and a 426-card deck 'checked current Aug 2026' on GitHub |
| SnowPro Core | COF-C03 | 1 | 5 | 1 | 3 | 3 | 1 | 4 | **18** | Avoid: no demand signal; site terms forbid derivative works |
| AWS Solutions Architect Professional | SAP-C02 -> SAP-C03 (2026-10-27) | 2 | 2 | 2 | 4 | 1 | 3 | 3 | **17** | Wait: SAP-C02 ends 2026-11-17 |

**How to read the scores.**
- The top of the table is dominated by **Kubernetes/CNCF exams and Azure**. For these, the primary sources are CC BY 4.0, the certifying body is permissive, and the existing free supply is stale.
- **AWS has the most demand but the least gap.** AWSomecards is free and covers 11 AWS exams, and Brainscape Certified and Crucial Exams also sell decks. AWS docs are also not openly licensed.
- **Data-platform certs (Snowflake, Databricks) and Salesforce have near-zero Anki supply**, but their site terms forbid derivative works or treat learning content as confidential, so the sourcing needed is weak.

---

## 2. Cross-cutting evidence (applies to several certs)

**Existing multi-cert suppliers of cloud flashcards**
- **AWSomecards** (free, web only, AWS only).
  - It shows "3,900+ cards · 11 certifications · free forever" and "Every active AWS exam track, kept current with the latest blueprint codes".
  - Per-exam counts: CLF-C02 250+, AIF-C01 280+, SAA-C03 350+, DVA-C02 250+, SOA-C03 250+, MLA-C02 300+, SAP-C02 440+, DOP-C02 440+, AIP-C01 440+, ANS-C01 350+, SCS-C03 400+.
  - **DEA-C01 is not in its list.** Source: https://awsomecards.com/ (`awsomecards.txt`).
  - Its Anki decks were retired [prior: competitors.md §3d].
- **Crucial Exams** (paid; the IT package costs $19.99/month [prior: competitors.md §1]). Flashcard counts from its homepage (`crucial_home.txt`, https://www.crucialexams.com/):
  - AWS: CLF-C02 183, AIF-C01 88, SOA-C03 100, DEA-C01 85, DVA-C02 138, SAA-C03 194, SAP-C02 234, SCS-C03 220.
  - Azure: AZ-900 216, DP-900 125, AI-901 255, AZ-104 165, AZ-305 184.
  - It also lists GCP CDL, ACE and PCA, but I could not parse their counts cleanly.
  - No Kubernetes, Terraform, Red Hat, Salesforce, Snowflake or Databricks exam cards were seen.
- **Brainscape Certified**: the only cloud decks are AWS. Cloud Practitioner has 18 decks, 388 cards and 989 learners; SAA has 12 decks, 283 cards and 764 learners; AI Practitioner has 6 decks, 179 cards and 555 learners (https://www.brainscape.com/learn, `brainscape_learn.txt`). No Azure, GCP, Kubernetes, Terraform or data-platform certified decks were found in that catalogue.
- **flashkube.dev** (paid, Kubernetes only).
  - "$29, paid once. Sitting the exam costs $445". "248 cards written for CKA". It also lists CKAD, CKS and KCNA.
  - Its title reads "Kubernetes flashcards for CKAD, CKA, CKS, KCNA, KCSA" (the title appeared in search results only).
  - Source: https://flashkube.dev/cka (`flashkube.txt`).
- **tltaylor1/anki-decks** (GitHub, 1 star, created 2026-08-25, pushed 2026-09-23). Its concept is very close to this site's:
  - "one folder per deck ... an `.apkg` ... and a `.csv`"; "each card is checked for current truth before it is published, with the check date".
  - Cloud content: "aws-scs-c03 | 426 | AWS Certified Security Specialty (SCS-C03) ... checked current in August 2026". It also has a Bicep deck and others.
  - Sources: https://raw.githubusercontent.com/tltaylor1/anki-decks/main/README.md (`gh_tltaylor_readme.txt`); GitHub API (`github_search_notes.txt`).
- **Quizlet user sets** are the most common result type for "<cert> flashcards" queries [prior: distribution.md §1b], and they were again in this task (`websearch_log.md`). Quizlet returned 403, so set sizes are **not verified**.

**Licences for primary sources**
- **Kubernetes docs are CC BY 4.0.** The footer reads "Documentation Distributed under CC BY 4.0" (https://kubernetes.io/docs/home/, `k8s_home.txt`).
- **The CNCF curriculum is CC BY 4.0.** The curriculum README says:
  - "The Curriculum is available under the CC-BY 4.0+ License".
  - "CNCF encourages training companies to align their offerings to cover the contents of the curriculum".
  - It lists CKA, CKAD, CKS, KCNA and KCSA among other exams.
  - Source: https://raw.githubusercontent.com/cncf/curriculum/master/README.md (`cncf_readme.txt`).
- **Microsoft azure-docs is CC BY 4.0**, but the study guides carry no open licence. **Google Cloud docs are CC BY 4.0**, but the exam guides have no licence line. **AWS docs are for personal use only**, although "AWS does not object to limited fair use of such materials for educational or non-profit purposes". All of this is from [prior: rules-risks.md §4–5].
- **HashiCorp docs** (`hashicorp/web-unified-docs`) are under the **Business Source License**, with licensor IBM. The additional use grant permits production use that is not a paid "competitive offering". It says "Products that are not provided on a paid basis are not competitive", and the licence changes to MPL 2.0 four years after publication. Source: https://raw.githubusercontent.com/hashicorp/web-unified-docs/main/LICENSE (`hc_webdocs_license2.txt`).
  - Whether a free flashcard site that paraphrases the docs falls inside that grant is my reading, **not legal advice**.
- **Snowflake docs**: the footer reads "© ... Snowflake, Inc. All Rights Reserved" (`sf_docs.txt`).
  - The Site Terms allow copying "solely for your personal, non-commercial use". They forbid users to "copy, modify, translate, alter or create any derivative works from the Materials", and forbid automated scraping (https://www.snowflake.com/legal/snowflake-site-terms/, `snow_site_terms.txt`).
- **Databricks docs**: the footer reads "© Databricks 2026. All rights reserved." (`db_docs.txt`).
  - The Terms of Use say "you may not copy, collect, modify, create derivative works ... publish, re-publish ... the Content" except as needed to access the Sites (https://www.databricks.com/legal/terms-of-use, `db_terms.txt`).
  - The licences of the underlying Apache Spark and Delta Lake docs were **not checked**.
- **Red Hat docs**: docs.redhat.com and access.redhat.com returned **403**. The licence is **not verified**.
- **Salesforce**: see §3.23. Salesforce's Program Terms treat learning content as confidential.

**Search rankings, general pattern.** This matches the prior finding [prior: distribution.md §1a–1b]:
- For "<cert> anki deck", AnkiWeb and GitHub pages rank even when they are years old.
- For "<cert> flashcards", Quizlet, Brainscape, Crucial Exams and Tutorials Dojo dominate.
- Where no cert-specific deck exists, the Anki results fill up with **decks for other certs**, for example ACE decks for "Cloud Digital Leader anki deck" and AZ-104 decks for "AZ-305 anki deck". That is the clearest "winnable" signal.

---

## 3. Per-cert evidence

### AWS: shared facts
- **Volume:** "As of January 2025, there are more than 1.42 million active AWS Certifications and 1.05 million unique AWS Certified individuals" (https://aws.amazon.com/certification/, `aws_cert.txt`). No per-exam counts are published.
- **Reddit, r/AWSCertifications** (171,030 members per reddapi [prior: distribution.md §2a]). The "anki" feed (`rss/rss_AWSCertifications_anki.xml`) had 100 entries:
  - 20 were deck posts.
  - Mentions across all 100: SAA 60, CLF 37, DVA 19, AIF 10, MLA 9, SAP 5, DEA 5, SOA 4, SCS 2.
  - Deck posts by cert: SAA 6, CLF 5, MLA 2, AIF 1, SAP 1, DVA 1.
  - Two further deck posts are about AIP-C01 (the Generative AI Developer Professional exam).
  - The "flashcards" feed (`rss/rss2_AWSCertifications_flashcards.xml`, fetched after several HTTP 429 retries) had 100 entries and 9 deck posts. Mentions: SAA 66, CLF 33, DVA 18, SOA 11, AIF 11, SAP 10, MLA 9, DEA 5, SCS 4. Deck posts include "FREE AWS Certification Flashcards" (2025-08-18, the AWSomecards launch [prior]) and "Sharing for FREE my notes and flashcards for AI Practitioner AIF-C01" (2024-10-22).
  - The r/Anki search for "AWS OR Azure OR kubernetes OR terraform OR RHCSA OR salesforce OR snowflake OR databricks OR GCP" returned 100 entries. Almost all were about TTS add-ons (Azure and AWS voices). Only AWS cert posts appeared: "Anyone here use use Anki to study for Amazon Web Services (AWS) Certificate?" (2020-07-17), "Anyone know of a good, up-to-date deck for AWS Certified Cloud Practitioner?" (2024-10-10) and an SAA-C03 deck post (2025-10-04). **No post on r/Anki concerned Azure, GCP, Kubernetes, Terraform, RHCSA, Salesforce, Snowflake or Databricks certs** (`rss/rss2_Anki_*.xml`).
- **Official flashcards: paid or partly free, not Anki.** Each AWS exam page says "Reinforce your knowledge and identify learning gaps with exam-style questions and flashcards" as part of the Skill Builder Exam Prep Plan (`aws_clf.txt` etc.).
  - The prep page lists Official Practice Question Sets and Exam Prep courses as free, and Official Practice Exams as "Available with a subscription". "The Individual subscription starts at $29 USD per month" (https://aws.amazon.com/certification/certification-prep/, `aws_prep.txt`).
  - Whether the flashcards themselves are free is **not verified**.
- **Sources.** Exam guides are public on docs.aws.amazon.com (index: https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html, `aws_guides.txt`). The docs are for personal use only, with a fair-use statement for educational and non-profit use [prior: rules-risks.md §4].
- **Rules:**
  - The candidate agreement bans disclosing exam and assessment materials only [prior: rules-risks.md §1].
  - Trademarks: plain-text fair use only, no marks in the domain name; marks are allowed in URL paths [prior: rules-risks.md §2].
  - No clause restricting independent third-party flashcards was found.
- **Partnerships:**
  - AWS Community Builders [prior: distribution.md §3].
  - In the top 100 r/AWSCertifications "passed" posts, the most-named resources were Tutorials Dojo (43), Maarek (33) and Cantrill (11) [prior: distribution.md §2d].
  - Digital Cloud Training already sells AWS flashcards through Brainscape at $9.99/month [prior: competitors.md §1], so it is a competitor rather than a partner.
  - Tutorials Dojo bundles "BONUS Flashcards" [prior: competitors.md §1].

### 3.1 AWS Certified Cloud Practitioner (CLF-C02)
1. **Volume:** see AWS shared facts. The exam costs 100 USD and has 65 questions in 90 minutes (`aws_clf.txt`).
2. **Deck demand:**
   - 37 of 100 "anki" posts mention it, and 5 are deck posts. Sample titles: "Anki or other flashcard deck for Cloud Practitioner (CLF-C02)?" (2024-10-10), "Flashcards for CCP" (2024-08-20), "Anki Cards with Over 900 Questions for AWS Cloud Practitioner Certifications" (2024-11-22).
   - Brainscape Certified: 989 learners, the highest of any cloud deck.
3. **Supply** (strong):
   - AWSomecards 250+ (free); Crucial 183 (paid); Brainscape 388 cards (paid).
   - AnkiWeb:
     - 2018763693 "AWS Certified Cloud Practitioner CLF-C02 2026 Complete Exam": 1,521 notes, 2026-06-15, +1. This is the Procensic question bank.
     - 1469596231: 174 notes, 2024-02-22, +5.
     - 1766259221: 174 notes, 2024-11-06.
     - 449552125 "2021": 202 notes, +20/-3.
   - Source: `ankiweb_table1.txt`.
4. **Official flashcards:** Skill Builder (see shared facts).
5. **Sources:** the exam guide is public; the docs are not openly licensed.
6. **Rules:** see shared facts.
7. **Churn:** CLF-C02 is current (`aws_guides.txt`). The only announcement is language-specific: "The AWS Certified Cloud Practitioner exam in Italian and German will be retired after December 31, 2026" (`aws_clf.txt`). The English exam has no announced revision.
8. **Partnerships:** see shared facts.
9. **Search:** "AWS Cloud Practitioner anki deck" returned AnkiWeb ×3, GitHub ×3, an Anki forum thread, awsomecards.com and a paid Gumroad deck. "…CLF-C02 flashcards" returned Quizlet ×4, Amazon books, Crucial Exams and awsomecards.com [prior: distribution.md §1a–b].
10. **Scores:**
   - D5: 37/100 AWS anki posts, 5 deck requests, 989 Brainscape learners, 1.05M AWS-certified people
   - G1: AWSomecards free 250+, Crucial 183, Brainscape 388, Procensic 1,521-note AnkiWeb deck (2026-06)
   - S2: guide public but AWS docs personal-use only (fair-use statement only)
   - R4: agreement bans exam content only; plain-text trademark fair use
   - St4: CLF-C02 current; only Italian/German language retirement announced
   - P3: big community and instructors, but main flashcard players already partnered (DCT with Brainscape)
   - Se1: awsomecards.com ranks for both anki and flashcards queries alongside many AnkiWeb decks

### 3.2 AWS Certified Solutions Architect – Associate (SAA-C03)
1. **Volume:** see shared facts. The exam costs 150 USD and has 65 questions in 130 minutes (`aws_saa.txt`).
2. **Deck demand:**
   - It is the most-mentioned cert: 60 of 100 "anki" posts, and 6 deck posts.
   - Samples: "Anki Flashcards for SAA?" (2024-04-02), "Does anyone have a link to any good Anki cards for SAA?" (2025-03-24), "Flashcards for SAA-C03" (2025-11-01).
   - Brainscape: 764 learners.
3. **Supply** (strong):
   - AWSomecards 350+; Crucial 194; Brainscape 283 cards.
   - AnkiWeb: 1011207193 has 296 notes, last updated 2024-03-12, +12/-0.
   - GitHub: moraesvic/aws-saa-anki has 13 stars [prior: competitors.md §3b].
   - Paid: an Etsy SAA/SAP Anki listing and Ko-fi decks appeared in results.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide; the docs are not openly licensed.
6. **Rules:** see shared facts.
7. **Churn:** SAA-C03 is current. The only announcement: "The AWS Certified Solutions Architect - Associate exam in Italian will be retired after December 31, 2026" (`aws_saa.txt`).
8. **Partnerships:** see shared facts.
9. **Search:** "SAA-C03 anki" returned AnkiWeb, paid Ko-fi and Etsy decks, GitHub and awsomecards.com [prior: distribution.md §1a].
10. **Scores:**
   - D5: most-mentioned (60/100), 6 deck posts incl. 2025 requests; 764 Brainscape learners
   - G1: AWSomecards 350+, Crucial 194, Brainscape 283, AnkiWeb 296-note deck +12
   - S2: AWS docs not openly licensed
   - R4: as AWS
   - St4: SAA-C03 current, no English revision announced
   - P3: Tutorials Dojo/Maarek/Cantrill dominate; they sell or bundle their own flashcards
   - Se2: AnkiWeb, Etsy, Ko-fi, GitHub and awsomecards.com all rank

### 3.3 AWS Certified Developer – Associate (DVA-C02 → DVA-C03)
1. **Volume:** see shared facts.
2. **Deck demand:** 19 of 100 "anki" posts mention it; there was 1 deck post, "What rates/numbers/things should I memorize for Associate Developer DVA-C02? Any resources/flashcards?" (2023-05-25).
3. **Supply:**
   - AWSomecards 250+; Crucial 138.
   - AnkiWeb 1419064825 "AWS Certified Developer Associate DVA-C02": 86 notes, 2024-02-01, +2/-1.
   - An Amazon book, "AWS Flashcards - Certified Developer (DVA-C02)", appeared in search results.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide.
6. **Rules:** see shared facts.
7. **Churn (high):** "Registration for the updated version (DVA-C03) opens October 27, 2026. The last day to take the current exam (DVA-C02) is December 1, 2026" (`aws_dva.txt`). Any deck built now is obsolete within about 10 weeks.
8. **Partnerships:** see shared facts.
9. **Search:** "DVA-C02 anki deck" ranked the AnkiWeb 1419064825 deck #1, then docs.aws, an Amazon book, Brainscape, Quizlet, Crucial Exams and awsomecards.com.
10. **Scores:**
   - D3: 19/100 mentions, 1 deck post
   - G2: AWSomecards 250+, Crucial 138; AnkiWeb deck only 86 notes (2024)
   - S2: AWS docs
   - R4: as AWS
   - St1: DVA-C03 registration opens 2026-10-27; DVA-C02 ends 2026-12-01
   - P3: as AWS
   - Se3: a thin AnkiWeb deck ranks #1 - beatable once C03 exists

### 3.4 AWS Certified CloudOps Engineer – Associate (SOA-C03; formerly SysOps Administrator)
1. **Volume:** see shared facts.
2. **Deck demand:** SysOps or CloudOps is mentioned in 4 of 100 "anki" posts and 11 of 100 "flashcards" posts; there were 0 deck posts.
3. **Supply:** AWSomecards 250+; Crucial 100. The "SOA-C03 anki deck" search returned **no SOA-specific Anki deck**; an SAA AnkiWeb deck ranked #7.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide.
6. **Rules:** see shared facts.
7. **Churn:** "Registration is now open for the updated version of this exam, now known as the AWS Certified CloudOps Engineer - Associate. The last day to take the AWS Certified SysOps Administrator - Associate exam is September 29, 2025" (`aws_soa.txt`). SOA-C03 is therefore about one year old. Separately, "The AWS Certified CloudOps Engineer - Associate exam in Simplified Chinese and Korean will be retired after November 19, 2026" (`aws_soa_new.txt`).
8. **Partnerships:** see shared facts.
9. **Search:** docs.aws, Udemy, Pluralsight, a blog, Skill Builder, an SAA AnkiWeb deck, the AWS page and awsomecards.com.
10. **Scores:**
   - D2: 4/100 mentions, 0 deck posts
   - G2: AWSomecards 250+, Crucial 100; no Anki deck
   - S2: AWS docs
   - R4: as AWS
   - St4: SOA-C03 launched about Sept 2025
   - P3: as AWS
   - Se3: no SOA Anki deck ranks, but awsomecards.com does

### 3.5 AWS Certified AI Practitioner (AIF-C01)
1. **Volume:** see shared facts. The exam costs 100 USD and has 65 questions (`aws_aif.txt`).
2. **Deck demand:** 10 of 100 "anki" posts mention it. Brainscape Certified has 555 learners.
3. **Supply:**
   - AWSomecards 280+; Crucial 88; Brainscape 179 cards.
   - AnkiWeb 73981918 "AWS AI Practitioner AIF-C01 by GlosuU": 293 notes, 2025-11-07, +5. Its description says "I took notes from Stéphane Maarek's course".
   - Quizlet sets; an Etsy listing of 318 practice questions.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide.
6. **Rules:** see shared facts.
7. **Churn:** AIF-C01 is current. "The AWS Certified AI Practitioner exam in Italian and German will be retired after October 15, 2026" (`aws_aif.txt`). AI content churns fast [prior: size-demand.md §6].
8. **Partnerships:** see shared facts.
9. **Search:** "AIF-C01 anki deck" ranked the AnkiWeb GlosuU deck #1, then Medium, Tutorials Dojo, Quizlet, Etsy and others. "AWS AI Practitioner flashcards" ranked Brainscape (#1, #2 and #5), Digital Cloud Training, Quizlet ×3 and Crucial ×2.
10. **Scores:**
   - D4: 10/100 mentions, 555 Brainscape learners, new AI demand
   - G2: AWSomecards 280+, Brainscape 179, Crucial 88, AnkiWeb 293 notes (2025-11)
   - S2: AWS docs
   - R4: as AWS
   - St3: current, but AI exams churn
   - P3: as AWS
   - Se2: AnkiWeb deck #1, Brainscape owns 'flashcards'

### 3.6 AWS Certified Solutions Architect – Professional (SAP-C02 → SAP-C03)
1. **Volume:** see shared facts. The exam costs 300 USD and has 75 questions in 180 minutes (`aws_sap.txt`).
2. **Deck demand:** 5 of 100 "anki" posts mention it; there was 1 deck post, "AWS Solutions Architect Professional - flashcards" (2022-03-24).
3. **Supply:**
   - AWSomecards 440+; Crucial 234.
   - Search showed no SAP-specific AnkiWeb deck. It did show an Etsy "SAA-C03 & SAP-C02" Anki listing.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide.
6. **Rules:** see shared facts.
7. **Churn (high):** "Registration for the updated version (SAP-C03) opens October 27, 2026. The last day to take the current exam (SAP-C02) is November 17, 2026" (`aws_sap.txt`).
8. **Partnerships:** see shared facts.
9. **Search:** Etsy ×2, then SAA decks and repos, awsomecards.com and Coursera.
10. **Scores:**
   - D2: 5/100 mentions, 1 deck post (2022)
   - G2: AWSomecards 440+, Crucial 234
   - S2: AWS docs
   - R4: as AWS
   - St1: SAP-C03 opens 2026-10-27; SAP-C02 ends 2026-11-17
   - P3: as AWS
   - Se3: no SAP AnkiWeb deck ranks; Etsy does

### 3.7 AWS Certified Security – Specialty (SCS-C03)
1. **Volume:** see shared facts. The exam costs 300 USD and has 65 questions in 170 minutes (`aws_scs.txt`).
2. **Deck demand:** 2 of 100 "anki" posts mention it; there were no deck posts.
3. **Supply:**
   - AWSomecards 400+; Crucial 220.
   - **tltaylor1/anki-decks "aws-scs-c03": 426 cards, "checked current in August 2026"**. It is free and ranks #2 for the query.
4. **Official flashcards:** Skill Builder.
5. **Sources:** public exam guide (PDF at https://docs.aws.amazon.com/pdfs/aws-certification/latest/security-specialty-03/security-specialty-03.pdf, seen in search results).
6. **Rules:** see shared facts.
7. **Churn:** SCS-C03 is current (`aws_guides.txt`). The only announcement is language-specific: "in Simplified Chinese, Spanish (Latin America), and Portuguese (Brazil) will be retired after December 31, 2026" (`aws_scs.txt`).
8. **Partnerships:** see shared facts.
9. **Search:** docs.aws PDF, tltaylor1 GitHub, docs.aws, an SAA AnkiWeb deck, Etsy, moraesvic and Coursera.
10. **Scores:**
   - D2: 2/100 mentions, no deck posts
   - G1: AWSomecards 400+, Crucial 220, tltaylor1 426 cards checked Aug 2026
   - S2: AWS docs
   - R4: as AWS
   - St4: SCS-C03 current
   - P3: as AWS
   - Se2: tltaylor1 already ranks #2

### Microsoft Azure: shared facts
- **Volume:** no Microsoft holder counts were found [prior: size-demand.md §3]. Microsoft issued "more than 937,000" Credly badges in 2025 [prior: size-demand.md §3].
- **Reddit, r/AzureCertification** (92,358 members [prior]). The combined "anki OR flashcards OR flashcard" feed had 81 entries, 12 of them deck posts (`rss/rss2_AzureCertification.xml`).
  - Mentions across all 81: AZ-104 33, AZ-900 29, AZ-305 10, AI-900 7, AZ-204 4, DP-900 2.
  - Deck-post samples: "AZ-104 Anki Deck" (2024-11-07), "Looking for AZ104 Anki Flashcards" (2023-01-07), "Does somebody have AZ-104 flashcards or app?" (2026-01-15), "Looking for good Flashcards for AZ 305 Solution Architect" (2023-01-04), "65 Azure Flashcards for the Azure Fundamentals (AZ-900) exam" (2020-07-31), "AI-900 Flashcard/ Mindmap reserve" (2025-07-28), "Free Azure Flashcards are now available on ZeroToArchitect" (2026-02-09).
- **Official flashcards:** none found. The study guides offer a free Practice Assessment ("Take a free Practice Assessment", `ms_sg_az-900.txt`).
- **Sources:**
  - The study guides are public and list skills with a dated "Skills measured as of" line and a change log, but carry no open licence.
  - Microsoft Learn content in MicrosoftDocs/azure-docs is CC BY 4.0 [prior: rules-risks.md §4].
- **Rules:**
  - The NDA bans publishing or "summarize"-ing exam content only.
  - "Microsoft does not review study materials developed by third parties".
  - The publications guidelines require a prominent non-affiliation disclaimer, and the mark must not be the leading word of a title [prior: rules-risks.md §1–2].
  - No clause against independent flashcards was found.
- **Churn:** Microsoft updates the skills outline every few months and retires exams on rolling 12-month notice [prior: size-demand.md §5]. The retirement page (`ms_retired.txt`) lists as scheduled only MS-102 (30 Nov 2026) and AZ-800/AZ-801 (30 Sep 2026). **None of AZ-900, AZ-104, AZ-305, DP-900 or AI-901 is on it.**
- **Partnerships:** in the top 100 "passed" posts, the most-named resources were Microsoft Learn (52), John Savill (27), Tutorials Dojo (27) and Udemy (19) [prior: distribution.md §2d]. Other channels: the Microsoft MVP programme and ZeroToArchitect, which launched free flashcards on the subreddit.

### 3.8 AZ-900 Microsoft Azure Fundamentals
1. **Volume:** none published.
2. **Deck demand:** 29 of 81 posts mention it; there was 1 deck post (2020).
3. **Supply:**
   - Crucial 216 (paid). Quizlet sets, Amazon flashcard books, StudyStack and thomasmitchell.net "AZ-900 Flash Cards".
   - AnkiWeb:
     - 2049948283: 146 notes, **2019-12-24**, +13 ("Based on the Microsoft official 'Skills measured' document").
     - 90249090: 229 notes, 2021-11-30, +6.
     - 1121741533: 332 notes, 2022.
     - 599919324: 486 notes, 2024-09-27, sourced from a Ditectrev GitHub question set.
     - 2068465538 **"AZ-900 Dump with Explanations"**: 555 notes, 2022-10-29.
   - Every AnkiWeb deck predates the "Skills measured as of July 20, 2026" outline.
4. **Official flashcards:** none; a free Practice Assessment exists.
5. **Sources:** the outline is public (https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900, `ms_sg_az-900.txt`); the docs are CC BY 4.0.
6. **Rules:** see shared facts. Dump-derived decks rank on AnkiWeb, so a sourced deck differentiates.
7. **Churn:** "Skills measured as of July 20, 2026". There is no retirement notice.
8. **Partnerships:** see shared facts.
9. **Search:** "AZ-900 anki deck": 8 of 10 results were AnkiWeb or AnkiHub [prior: distribution.md §1a]. "AZ-900 flashcards" returned Amazon books ×2, Quizlet ×2, Brainscape, LinkedIn, thomasmitchell.net, StudyStack and Gumroad.
10. **Scores:**
   - D4: 29/81 Azure-feed mentions
   - G3: many decks but AnkiWeb ones date from 2019-2024, one is a 'Dump'; Crucial paid
   - S4: CC BY docs; outline public but unlicensed
   - R4: NDA covers exam content; disclaimer rules clear
   - St4: outline refreshed 2026-07-20; no retirement listed
   - P3: John Savill, MS Learn community, MVPs
   - Se3: AnkiWeb crowds the Anki query (8 of 10); Quizlet/books own 'flashcards'

### 3.9 AZ-104 Microsoft Azure Administrator
1. **Volume:** none published.
2. **Deck demand:** the most-asked Azure exam, with 33 of 81 posts and 4 deck posts, including requests in 2023 and 2026 (above).
3. **Supply:**
   - Crucial 165 (paid).
   - GitHub:
     - **connorsayers/AZ-104-Study-Deck**: 34 stars, "just under 4,000 multiple-choice questions ... based on content available on Microsoft Learn ... I had a little assistance from AI", updated 2026-09-23 (`gh_connor_readme.txt`, `github_search_notes.txt`).
     - juansasoc/AZ-104-Anki-Flashcards: 4 stars, 2026-08-18.
   - AnkiWeb:
     - 2119884346 "AZ-104 (AZ104) **Dump** with Explanations": 388 notes, 2022, +9.
     - 1965021719 "AZ-104 2024 Compilation & Corrected Q&A": 440 notes, 2025-01-08, +3.
     - 2030944470: 74 notes, 2022.
4. **Official flashcards:** none.
5. **Sources:** the outline is public ("Skills measured as of April 17, 2026", `ms_sg_az-104.txt`); the docs are CC BY 4.0.
6. **Rules:** see shared facts. Two of the ranking AnkiWeb decks are dumps or compilations, which is a risk to users that a sourced deck avoids.
7. **Churn:** the change log shows a "Minor" update on 17 April 2026. There is no retirement notice.
8. **Partnerships:** John Savill (27 "passed" mentions) [prior]; the connorsayers maintainer.
9. **Search:** "AZ-104 anki deck" returned GitHub connorsayers (#1, #2), an AnkiWeb dump deck, juansasoc, AnkiWeb 2030944470, mischavandenburg (GitHub and blog), Brainscape and an app. "AZ-104 flashcards" returned Brainscape, Quizlet ×3, GitHub, Crucial, certstud and apps [prior: distribution.md §1b].
10. **Scores:**
   - D5: most-asked Azure exam - 33/81 mentions, 4 deck posts incl. 2026-01 request
   - G3: connorsayers 4k-MCQ AI-assisted repo (34*) and dump decks exist; no sourced/versioned deck
   - S4: CC BY docs
   - R4: as Azure
   - St4: minor update 2026-04-17; no retirement listed
   - P3: John Savill (27 passed-post mentions); connorsayers
   - Se3: GitHub repo holds #1-2

### 3.10 AZ-305 Designing Microsoft Azure Infrastructure Solutions
1. **Volume:** none published.
2. **Deck demand:** 10 of 81 posts mention it. There was 1 explicit request, "Looking for good Flashcards for AZ 305 Solution Architect" (2023-01-04).
3. **Supply:**
   - Crucial 184 (paid); Brainscape user decks; Quizlet; Tutorials Dojo bonus flashcards (search snippet only).
   - **No AZ-305 Anki deck** appeared in "AZ-305 anki deck" results. Results 1–5 were decks for AZ-104, AZ-203 and AZ-900.
4. **Official flashcards:** none.
5. **Sources:** the outline is public ("Skills measured as of April 17, 2026", `ms_sg_az-305.txt`); the docs are CC BY 4.0.
6. **Rules:** see shared facts.
7. **Churn:** there is no retirement notice.
8. **Partnerships:** see shared facts.
9. **Search:** Anki results were wholly off-target (other exams and Wikipedia pages), which is **highly winnable**. "AZ-305 flashcards" returned Brainscape, Quizlet, Whizlabs, Crucial, Amazon, Tutorials Dojo, MindMesh and Microsoft Learn.
10. **Scores:**
   - D3: 10/81 mentions, explicit flashcard request
   - G5: no AZ-305 Anki deck anywhere in results; only paid Crucial/TD
   - S4: CC BY docs
   - R4: as Azure
   - St4: skills as of 2026-04-17; no retirement listed
   - P3: as Azure
   - Se5: Anki results are off-target (other exams, Wikipedia)

### 3.11 AI-901 Microsoft Azure AI Fundamentals (replaces AI-900)
1. **Volume:** none published.
2. **Deck demand:** 7 of 81 posts mention AI-900 or AI-901, including 1 deck post ("AI-900 Flashcard/ Mindmap reserve", 2025-07-28).
3. **Supply:**
   - Crucial 255 (paid); Tutorials Dojo; Quizlet; MindMesh ("158 flashcards", per a search snippet only); Open Exam Prep.
   - **No Anki deck was found.**
4. **Official flashcards:** none.
5. **Sources:** the outline is public ("Skills measured as of April 15, 2026", `ms_sg_ai-901.txt`); the docs are CC BY 4.0.
6. **Rules:** see shared facts.
7. **Churn (high):** "AI-900 ... was retired on June 30, 2026" (`ms_sg_ai-900.txt`), and AI-901 is its successor under the same certification name. Microsoft retired AI-102 and AI-900 and several AI credentials within a year [prior: size-demand.md §5].
8. **Partnerships:** see shared facts.
9. **Search:** "AI-901 … flashcards anki" returned Tutorials Dojo, Quizlet, Microsoft ×2, Brainscape (AI-900), Crucial, Open Exam Prep and MindMesh ×2. There was no Anki result.
10. **Scores:**
   - D3: 7/81 AI-900/901 mentions; fundamentals exams draw beginners
   - G5: no Anki deck; Crucial 255 paid
   - S4: CC BY docs
   - R4: as Azure
   - St2: successor to AI-900 retired 2026-06-30; MS AI line churns fastest
   - P3: as Azure
   - Se4: no Anki result for AI-901

### 3.12 DP-900 Microsoft Azure Data Fundamentals
1. **Volume:** none published.
2. **Deck demand:** weak. 2 of 81 posts mention it, with no deck posts.
3. **Supply:**
   - Crucial 125 (paid).
   - AnkiWeb 1694651438 "DP-900": 659 notes, **2020-10-16**, +1.
   - Quizlet; Brainscape.
4. **Official flashcards:** none.
5. **Sources:** the outline is public ("Skills measured as of July 21, 2026", `ms_sg_dp-900.txt`); the docs are CC BY 4.0.
6. **Rules:** see shared facts.
7. **Churn:** there is no retirement notice.
8. **Partnerships:** see shared facts.
9. **Search:** "DP-900 anki deck" ranked the stale AnkiWeb deck #1, then an AZ-900 dump deck, Quizlet, Brainscape, an Etsy Azure deck and Gumroad DP-600/700 bundles.
10. **Scores:**
   - D2: 2/81 mentions
   - G4: only AnkiWeb deck is from 2020
   - S4: CC BY docs
   - R4: as Azure
   - St4: skills as of 2026-07-21; no retirement listed
   - P3: as Azure
   - Se4: stale AnkiWeb deck #1, easy to beat

### Google Cloud: shared facts
- **Volume:** Google Cloud issued "Over 2.08 million" Credly badges in 2025. That figure includes training badges [prior: size-demand.md §3]. No per-exam counts were found.
- **Reddit, r/googlecloud** (97,921 members [prior]): the combined feed returned **only 11 entries, 1 of them a deck post**, "Flashcards I made while studying for the GCP ACE certification" (2026-07-16) (`rss/rss2_googlecloud.xml`). The prior research found that r/GoogleCloudCertification returned 404.
- **Official flashcards:** GoogleCloudPlatform/google-cloud-flashcards, "Anki flashcards to study and prepare Google Cloud Platform (GCP) certifications", is **archived**. It has 6 stars and was created on 2019-09-26 (`github_search_notes.txt`). **It ranks in every GCP Anki query.**
- **Sources:**
  - The exam guides are public PDFs linked from the cert pages (`gc_*_guide.txt`), but carry no licence line [prior: rules-risks.md §5].
  - The docs are CC BY 4.0 [prior: rules-risks.md §4].
  - The CDL and Generative AI Leader pages also link a "study guide" PDF (`gc_cdl.raw`).
- **Rules:** the terms ban sharing exam content, including memorised content. Brand features must not imply endorsement [prior: rules-risks.md §1–2].
- **Partnerships:** weak evidence. No Google-endorsed third-party list was found.

### 3.13 Google Cloud Digital Leader
1. **Volume:** none published. The exam costs $99 and takes 90 minutes (`gc_cdl.txt`).
2. **Deck demand:** no deck posts in r/googlecloud.
3. **Supply:** Quizlet (≥6 sets in results), Brainscape user decks and cloud-edify.com. **There is no CDL Anki deck**: the Anki query returned only ACE and Data Engineer decks and the archived Google repo.
4. **Official flashcards:** none current (the repo is archived).
5. **Sources:** the guide is public, and the docs are CC BY 4.0.
6. **Rules:** see shared facts.
7. **Churn:** the **new guide says "Cloud Digital Leader exam guide - launched on August 12, 2026"** (`gc_cdl_guide.txt`), and it adds "agentic AI" to Section 1.1. Existing Quizlet and Brainscape sets predate it.
8. **Partnerships:** weak.
9. **Search:** "Cloud Digital Leader anki deck" returned ACE AnkiWeb decks, Quizlet, Noji, the archived Google repo and a 2020 gist. "…flashcards" returned Quizlet ×6, Brainscape ×2 and cloud-edify.
10. **Scores:**
   - D2: no CDL deck posts; r/googlecloud feed only 11 flashcard posts
   - G5: no CDL Anki deck; Quizlet sets predate 2026-08-12 guide
   - S4: CC BY 4.0 Google Cloud docs
   - R4: exam-content-only terms; brand rules
   - St4: guide just launched 2026-08-12
   - P2: no identified community partner
   - Se5: Anki results are other-cert decks

### 3.14 Google Associate Cloud Engineer
1. **Volume:** none published. The exam costs $125 (`gc_ace.txt`).
2. **Deck demand:** 1 deck post (2026-07-16); ACE is named in 6 of 11 googlecloud posts. That count may include the word "ace".
3. **Supply:**
   - AnkiWeb:
     - **1707301842 "Google Cloud Associate Cloud Engineer (ACE) Study Deck": 431 notes, 2026-01-25**, +2.
     - 1428257012 GFT_GCP_ACE: 422 notes, 2019, +5.
     - 1346064888: 91 notes, 2018.
   - Noji and AnkiPro copies; Quizlet ×7 [prior].
4. **Official flashcards:** the archived repo only.
5. **Sources:** the guide is public (`gc_ace_guide.txt`, which includes "supported by AI tooling" language), and the docs are CC BY 4.0.
6. **Rules:** see shared facts.
7. **Churn:** the guide text carries no date. A renewal-exam guide exists. The revision date is **not verified**.
8. **Partnerships:** weak.
9. **Search:** AnkiWeb ×2 at the top, Noji ×2, a gist, AnkiPro, the Google repo, AnkiWeb GFT. "…flashcards" returned Quizlet ×7, Brainscape, Kindle and Medium [prior].
10. **Scores:**
   - D2: 1 deck post (2026-07)
   - G3: AnkiWeb 1707301842 has 431 notes, updated 2026-01-25
   - S4: CC BY docs
   - R4: as Google
   - St3: guide undated
   - P2: weak
   - Se3: two AnkiWeb decks hold #1-2

### 3.15 Google Professional Cloud Architect
1. **Volume:** none published. The exam costs $200 (`gc_pca.txt`).
2. **Deck demand:** 1 mention in r/googlecloud.
3. **Supply:** **no PCA-specific Anki deck** in results. There was a Medium post, "Free flash cards & practise exams for getting Google Cloud certified" (Sam Lee), and Crucial lists PCA (count not parsed).
4. **Official flashcards:** the archived repo only.
5. **Sources:**
   - The guide is public. Case-study questions make up "20-30% of the exam" (`gc_pca.txt`).
   - The docs are CC BY 4.0. The Well-Architected Framework is "a key requirement" (`gc_pca_guide.txt`).
6. **Rules:** see shared facts.
7. **Churn:** the revision date is **not verified**.
8. **Partnerships:** weak.
9. **Search:** "Professional Cloud Architect anki deck" results were all ACE decks, Medium posts, the Google repo and Brainscape, which is **winnable**. "…flashcards" was not run.
10. **Scores:**
   - D2: 1 mention
   - G5: no PCA-specific deck
   - S4: CC BY docs
   - R4: as Google
   - St3: guide undated
   - P2: weak
   - Se5: results are ACE decks

### Kubernetes / CNCF: shared facts
- **Volume (CNCF 2025 Annual Report, `cncf_ar25.txt`, https://www.cncf.io/wp-content/uploads/2026/03/cncf_ar25_033126a.pdf):**
  - "Certified Kubernetes Administrator (CKA) exam hit 291,000 enrollments (16% increase from 2024)".
  - "CKAD hit 131,000 exam registrations (18% increase from 2024)".
  - "CKS exam hit 75,000 registrations (21% increase from 2024)".
  - "KCNA exam hit 31,000 registrations (72% increase from 2024)".
  - "KCSA exam hit 10,000 registrations (90% increase from 2024)".
  - These look like cumulative totals, but the report does not say so.
  - The report also counts "over 3,000" Kubestronauts and "more than 200" Golden Kubestronauts. The live directory shows "Found 4466 Kubestronauts" and "Golden Kubestronauts (528)" (https://www.cncf.io/training/kubestronaut/, `kubestronaut.txt`).
- **Reddit:**
  - r/kubernetes (211,081 members [prior]): the combined feed returned **only 6 entries**, all generic "learn K8s with flashcards" promotions except "I turned dgkanatsios's CKAD prep exercises into an Anki deck" (2019).
  - Hands-on exams attract little flashcard talk [prior: distribution.md §2c]. In "passed" posts the most-named resources are killer.sh (25) and KodeKloud (23) [prior].
- **Sources (best in the whole set):**
  - The curriculum is CC BY 4.0 and versioned to the Kubernetes release ("The document major and minor version … match the version of Kubernetes").
  - kubernetes.io docs are CC BY 4.0.
  - dgkanatsios/CKAD-exercises is **MIT-licensed**, with 10,143 stars (`gh_ckadex_license.txt`, `github_search_notes.txt`).
- **Rules:**
  - The LF agreement bans disclosing exam content [prior: rules-risks.md §1].
  - CNCF "encourages training companies to align their offerings to cover the contents of the curriculum" (`cncf_readme.txt`).
  - Trademarks: fair use with a trademark notice; no marks in the domain name [prior: rules-risks.md §2].
- **Churn:** the CKA, CKAD and CKS pages each say "The exam is based on Kubernetes v1.35" (`lf_cka.txt`, `lf_ckad.txt`, `lf_cks.txt`). The exam follows Kubernetes minor releases, so the deck needs version-bump reviews. The cadence of those reviews is **not verified** from an LF page.
- **Partnerships:**
  - Kubestronauts: 4,466 listed; the programme has a "private Kubestronaut Slack channel" [prior: distribution.md §3].
  - CNCF training partners: "54 KTPs" at the end of 2025 (`cncf_ar25.txt`).
  - dgkanatsios (repo owner).
  - killer.sh and KodeKloud [prior].
- **Existing paid competitor:** flashkube.dev ($29 once; 248 CKA cards; also CKAD, CKS and KCNA).

### 3.16 KCNA Kubernetes and Cloud Native Associate
1. **Volume:** "31,000 registrations (72% increase from 2024)". The exam is multiple-choice, costs $250 and takes 90 minutes (`lf_kcna.txt`).
2. **Deck demand:** none seen on r/kubernetes. The earlier finding that r/CKAD returned 0 posts also applies [prior].
3. **Supply:** GitHub Invincibear/anki-kcna (1 star, updated 2026-07-04); flashkube (paid); Quizlet ×2; Tutorials Dojo. **No AnkiWeb KCNA deck** appeared in results.
4. **Official flashcards:** none.
5. **Sources:** the CC BY curriculum plus CC BY docs. The LF page shows the domain weights 44%, 28%, 16% and 12% (`lf_kcna.txt`).
6. **Rules:** permissive (see shared facts).
7. **Churn:** the page gives no version. It is a conceptual exam, so version bumps matter less (my judgment).
8. **Partnerships:** see shared facts.
9. **Search:** "KCNA anki deck" results were noisy: KCNA also means Korean news, and Korean-language decks ranked. GitHub anki-kcna was #1. "KCNA flashcards" returned Quizlet ×2, Tutorials Dojo ×2, GitHub notes, CNCF, flashkube and planetcert.
10. **Scores:**
   - D3: 31,000 registrations (+72%); little Reddit deck talk
   - G4: only a 1-star GitHub deck and paid flashkube
   - S5: CC BY 4.0 curriculum + CC BY docs
   - R5: CNCF 'encourages training companies to align' to curriculum
   - St4: conceptual exam; curriculum versioned
   - P4: 4,466 Kubestronauts, 54 training partners
   - Se4: noisy SERP (Korean 'KCNA'), GitHub deck #1

### 3.17 CKA Certified Kubernetes Administrator
1. **Volume:** "291,000 enrollments", the biggest figure in the CNCF set. The exam is performance-based, takes 2 hours and costs $445 (`lf_cka.txt`).
2. **Deck demand:** almost no Reddit flashcard talk (see shared facts).
3. **Supply:**
   - flashkube 248 CKA cards ($29).
   - **AnkiWeb 1108551055 "Certified Kubernetes Administrator (CKA)" now returns missing (removed)**, although it still ranks #1.
   - AnkiWeb 1593957582 "Kubernetes": 325 notes, 2022-09-07.
   - Brainscape pack by David Abarca; Quizlet ×2; a new GitHub repo, joshka0/k8s-cka-study (0 stars, 2026-08, "Anki decks").
4. **Official flashcards:** none. LF includes killer.sh simulator sessions (`lf_cka.txt`).
5. **Sources:** CC BY 4.0 (the best available).
6. **Rules:** permissive.
7. **Churn:** "based on Kubernetes v1.35". Kubernetes version drift is continuous.
8. **Partnerships:** see shared facts.
9. **Search:** "CKA anki deck" ranked the missing AnkiWeb deck #1, then CKAD decks, Brainscape, a TikTok account "@anki.cka" and others. "CKA exam flashcards" returned Quizlet ×2, flashkube, devopscube, LF, GitHub ×2 and examzify.
10. **Scores:**
   - D3: 291,000 enrollments, but hands-on exam gets almost no flashcard talk
   - G4: #1 AnkiWeb CKA deck is removed; flashkube paid $29
   - S5: CC BY 4.0
   - R5: as CNCF
   - St3: tied to Kubernetes v1.35; version drift
   - P4: Kubestronauts, killer.sh/KodeKloud
   - Se4: #1 result is a dead deck

### 3.18 CKAD Certified Kubernetes Application Developer
1. **Volume:** "131,000 exam registrations". The exam costs $445.
2. **Deck demand:** 1 Reddit deck post (2019).
3. **Supply:**
   - AnkiWeb 2137552993 "CKAD Exercises": 132 notes, 2023-05-26, +2.
   - AnkiWeb 959373608: 103 notes, **2019**, +5.
   - AnkiWeb 2047891717: missing.
   - All are conversions of dgkanatsios/CKAD-exercises.
   - flashkube (paid).
4. **Official flashcards:** none.
5. **Sources:** CC BY 4.0, plus the MIT-licensed exercise repo.
6. **Rules:** permissive.
7. **Churn:** "based on Kubernetes v1.35".
8. **Partnerships:** dgkanatsios (10,143 stars) is a strong partner candidate.
9. **Search:** AnkiWeb ×3 at the top, then the GitHub discussion "I've transformed this repo into an Anki deck", Medium, dev.to and a 2019 blog.
10. **Scores:**
   - D3: 131,000 registrations; 1 deck post (2019)
   - G4: AnkiWeb conversions from 2019/2023, one missing
   - S5: CC BY + MIT exercise repo
   - R5: as CNCF
   - St3: K8s v1.35
   - P5: dgkanatsios/CKAD-exercises 10,143 stars, MIT
   - Se3: three AnkiWeb decks hold #1-3

### 3.19 CKS Certified Kubernetes Security Specialist
1. **Volume:** "75,000 registrations". CKA is a prerequisite (`lf_cks.txt`).
2. **Deck demand:** none seen.
3. **Supply:** **no CKS-specific Anki deck** in results. There were practice-question repos, katademy/Kubernetes and flashkube (paid).
4. **Official flashcards:** none.
5. **Sources:** CC BY 4.0 curriculum plus K8s docs. Some objectives cover third-party tools, whose doc licences were not checked.
6. **Rules:** permissive.
7. **Churn:** "based on Kubernetes v1.35".
8. **Partnerships:** see shared facts. Golden Kubestronaut requires "all 15 CNCF certifications in addition to the ... LFCS" (`cncf_ar25.txt`).
9. **Search:** "CKS … anki flashcards" returned Quizlet (CKA), a GitHub question repo, LF, Brainscape (CKA), katademy, dev.to, AnkiWeb "Kubernetes", a blog and Coursera. That is winnable.
10. **Scores:**
   - D2: 75,000 registrations; no deck talk
   - G5: no CKS deck found
   - S4: CC BY curriculum; some tool docs unchecked
   - R5: as CNCF
   - St3: K8s v1.35
   - P4: Kubestronaut/Golden community
   - Se5: no CKS deck ranks

### 3.20 HashiCorp Certified: Terraform Associate (004)
1. **Volume:** none published (no figure found). The exam costs "$70.50 USD, plus locally applicable taxes and fees. Free retake" (https://developer.hashicorp.com/certifications/infrastructure-automation, `hc_certs.txt`).
2. **Deck demand:**
   - r/Terraform combined feed: **only 2 entries**, both deck posts. They are "A study guide and Anki cards for your Terraform Associate Certification" (2023-05-27, the allister-grange guide) and "Terraform flashcards" (2024-12-16) (`rss/rss2_Terraform.xml`).
   - The r/AWSCertifications "anki" feed has 3 Terraform mentions.
   - The strongest demand signal is the GitHub repo: **allister-grange/terraform-associate-guide-003 has 94 stars and 51 forks**. It was the top repo for "anki certification" [prior: competitors.md §3b] and was updated 2025-12-03 (`github_search_notes.txt`).
3. **Supply:**
   - The best free deck targets **003, which is no longer the current version** (README: "Terraform Associate Certification (003) Study Guide", `gh_allister_readme.txt`).
   - AnkiWeb:
     - 180398604 "Terraform Associate Certification 2020 Study Guide" now returns missing.
     - 519359512 "Terraform fundamentals": 160 notes, 2024-04-30, +4 (not exam-specific).
   - italoandreysb/flashcards-terraform-associate-003 (0 stars, created 2026-09-09, also 003).
   - ExamPro (004), whose "133 Flashcards" figure comes from a search snippet only. Quizlet ×3; Brainscape.
   - **No free 004-specific Anki deck was found.**
4. **Official flashcards:** none. HashiCorp publishes a study path, an "Exam Content List" and "Sample Questions - Terraform Associate 004" (https://developer.hashicorp.com/terraform/tutorials/certification-004, `hc_tf004.txt`).
5. **Sources:**
   - The objectives are public on developer.hashicorp.com, including a published "Content differences between the 003 and 004 exams" list (`hc_certs.txt`).
   - The docs repo is under **BUSL** with a grant for non-paid use (see §2). This is workable but not CC.
6. **Rules:**
   - The HashiCorp candidate agreement was **not read** (search budget ran out; a panel page returned 429).
   - A HashiCorp panel page reportedly says "HashiCorp does not officially endorse any externally created materials" (search snippet only, **not verified**).
7. **Churn:**
   - 004 is current and "Tests on Terraform version 1.12". It added four topics, among them "Ephemeral values and write-only arguments" and HCP Terraform projects (`hc_certs.txt`).
   - Holders of 002 or 003 can recertify on 004 (same page).
   - The launch date of 004 is **not verified**.
8. **Partnerships:** allister-grange (94 stars; could be invited to co-maintain a 004 update); the r/Terraform community. HashiCorp Ambassadors were **not verified**.
9. **Search:**
   - "Terraform Associate anki deck": GitHub allister-grange (#1, #3, #8), the missing AnkiWeb 2020 deck (#2), Mastodon, GitHub topics, AnkiWeb "Terraform fundamentals", ari-hacks and Cloudlane Gumroad.
   - "Terraform Associate flashcards": GitHub italoandreysb (003), Brainscape ×2, Quizlet ×3, ari-hacks, ExamPro (004) and Coursera (003).
   - The top results are for the old version, so this is **winnable with a 004 deck**.
10. **Scores:**
   - D3: 94-star/51-fork Anki guide; 2 r/Terraform deck posts
   - G4: best free deck targets 003; no free 004 deck
   - S3: objectives public; docs BUSL with non-paid-use grant
   - R3: HashiCorp candidate agreement not read
   - St3: 004 current, tied to Terraform 1.12
   - P4: allister-grange maintainer, r/Terraform
   - Se4: results are 003-era

### 3.21 LFCS Linux Foundation Certified System Administrator
1. **Volume:** none published. The exam is performance-based, takes 2 hours and costs $445 (`lf_lfcs.txt`). It is a requirement for Golden Kubestronaut, which requires "all 15 CNCF certifications in addition to the ... LFCS" (`cncf_ar25.txt`); that community has 528 members per the directory (`kubestronaut.txt`).
2. **Deck demand:** the r/linuxadmin combined feed returned **1 entry**, an RHCSA post (below). **No LFCS post** appeared in any feed collected (`rss/rss2_linuxadmin.xml`).
3. **Supply:**
   - **None found.** "LFCS anki deck" returned no LFCS deck at all: GitHub LPIC topic, Wikipedia, and irrelevant ACLS and Latin decks.
   - flashkube does not list LFCS (`flashkube.txt`).
4. **Official flashcards:** none.
5. **Sources:**
   - The domains are public on the LF page, with weights of 25/25/20/20/10% (`lf_lfcs.txt`).
   - The source material would be man pages and distribution docs. Their licences vary and were **not checked**. There is no CC BY curriculum as there is for CNCF.
6. **Rules:** the LF agreement bans disclosing exam content only [prior: rules-risks.md §1].
7. **Churn:** no version or revision notice on the LF page (**not verified** either way).
8. **Partnerships:** Golden Kubestronauts; LF training.
9. **Search:** empty for Anki, so **fully winnable** but low-volume. "LFCS flashcards" was not run.
10. **Scores:**
   - D1: no LFCS flashcard post in any feed
   - G5: no deck found
   - S2: man-page/distro licences unchecked; no open curriculum
   - R4: LF agreement exam-content only
   - St3: no version info
   - P3: Golden Kubestronauts (528) must hold LFCS
   - Se5: Anki SERP empty of LFCS decks

### 3.22 RHCSA Red Hat Certified System Administrator (EX200)
1. **Volume:** none published. A 2009 figure for RHCT was quoted in a search snippet only, so it is not used.
2. **Deck demand:**
   - r/redhat combined feed: **3 entries, 0 deck posts**. One, from 2020, is an RHCE (not RHCSA) request: "hoping someone out there has made a mindmap or some concise flashcard". Another, "What was your study strategy for RHCSA?" (2025-06-17), names "Sander Van Vugt's RHCSA guide on O'Reilly" (`rss/rss2_redhat.xml`).
   - r/linuxadmin: "Flashcards..." (2022-07-18): "When I was studying for the RHCSA, I ended up created over 200 flashcards (the 3x5 type). I found them very useful for rote memorization of basic facts" (`rss/rss2_linuxadmin.xml`).
3. **Supply:**
   - AnkiWeb:
     - 1832565974 "Anki Flashcard Deck - Study Guide - RHCSA": 367 notes, **2018-12-21**, +3/-1.
     - 28567033: missing.
   - GitHub:
     - kraker/rhcsa: 33 stars, created 2025-08, **archived**. A search snippet says it has 169 cards including flatpak; that count is not verified.
     - lrrb/RHCSA (Anki export).
   - rhcsaflash.com, titled "AI-Powered Exam Prep for RHEL 9". The exam is now RHEL 10.
   - Quizlet ×4; Brainscape; cram.com.
4. **Official flashcards:** none found.
5. **Sources:**
   - The objectives are public on the EX200 page (`rh_ex200.txt`, which includes the objective list).
   - Red Hat docs returned **403**, so their licence is **not verified**. Man pages vary.
6. **Rules:**
   - "Individual Exams are subject to the Red Hat Exam Privacy and Confidentiality Agreement". The training policies say "Unauthorized recording, copying, or transmission of ... Red Hat Learning Subscription content is strictly prohibited" (https://www.redhat.com/en/about/red-hat-training-policies, `rh_training_policies.txt`).
   - That covers Red Hat's own course content. The agreement text itself was **not read**.
7. **Churn:** "This exam is based on Red Hat® Enterprise Linux® 10" (`rh_ex200.txt`). The date of the switch to RHEL 10 is **not verified** from Red Hat. The r/redhat post "Passed RHCSAv10" is dated 2026-02-09. Existing free decks are for older RHEL versions.
8. **Partnerships:** Sander van Vugt (named in the r/redhat post); the Red Hat Learning Community (learn.redhat.com, seen in search results).
9. **Search:** "RHCSA anki deck": GitHub lrrb, AnkiWeb 1832565974 (2018), kraker, GitHub topics, Wikipedia ×2, Brainscape and the missing AnkiWeb deck. "RHCSA flashcards": Brainscape, Quizlet ×4, lrrb, rhcsaflash (RHEL 9), cram and Wikipedia.
10. **Scores:**
   - D2: r/redhat feed had 3 posts, 0 deck posts
   - G4: AnkiWeb deck is 2018; kraker repo archived; rhcsaflash targets RHEL 9
   - S2: objectives public; Red Hat docs licence not verified (403)
   - R3: confidentiality agreement not read
   - St3: now RHEL 10; switch date unverified
   - P3: Sander van Vugt, Red Hat Learning Community
   - Se3: GitHub/2018 AnkiWeb rank

### 3.23 Salesforce Certified Platform Administrator
1. **Volume:** none published (none found).
2. **Deck demand:**
   - r/salesforce combined feed: 45 entries, 5 deck posts, none of them for Admin. The deck posts concern Dev 401 (2014), Pardot (2017), PD1 (2020), Apex formatting (2021) and "Flashcards" (2025-07-15) (`rss/rss2_salesforce.xml`).
   - 25 of the 45 mention "admin". Many are "how I passed" posts, for example "Passed my admin exam!" (2026-03-04) and "Certified Admin exam passed - first attempt" (2025-04-17).
3. **Supply:**
   - AnkiWeb:
     - 2071354185 "Salesforce ADM201": 74 notes, **2020-02-26**. ADM201 is the old exam code.
     - 2067811412 "Salesforce": 418 notes, 2020-12-12, +4.
   - GitHub IbrahimIF/salesforce-notes (0 stars, 2026-03, "Platform Administrator exam notes ... Anki flashcards").
   - Quizlet ×3, Brainscape, cram, studystack, flashcardmachine [prior].
   - A user-made Trailhead trailmix, "Prepare with flashcards to study for the admin certification exam" [prior: distribution.md §3].
4. **Official flashcards:** none found. The Trailhead credential page is JavaScript-rendered, and its exam guide on help.salesforce.com was seen in search results only.
5. **Sources:**
   - The **Salesforce Program Terms** say: "You must only use this Program for your non-commercial personal, professional or educational purposes ... You agree that any Learning Asset, Course, Exam and all content related to Learning Assets, Courses and Exams is deemed Confidential Information" (https://www.salesforce.com/company/legal/program-terms-for-learning-and-credential-programs/, "Last Updated: October 4, 2024", `sfdc_program_terms.txt`).
   - That makes **Trailhead modules a poor source**. The licence of help.salesforce.com docs is **not verified**.
6. **Rules:**
   - Above, plus Salesforce's security blog: "Rely exclusively on these guides [official exam guides] to direct your preparation", and do not "Distribute, use, or request exam dumps" (https://www.salesforce.com/blog/safeguarding-salesforce-credentials/, `sfdc_security_blog.txt`).
   - The blog's "rely exclusively" line is advice to candidates, not a ban on third-party material, but it signals a less welcoming stance.
7. **Churn:** the exam name changed from ADM201 to "Platform Administrator". The Program Terms page and credential pages carry no dated revision. Release-driven change is **not verified**.
8. **Partnerships:** Salesforce Ben (it ranked for the exam guide query); the Trailblazer Community; trailmix authors.
9. **Search:** "Salesforce Administrator certification anki deck": an Arkus 2018 blog post, AnkiWeb ADM201 (2020), AnkiWeb "Salesforce", Brainscape, a Trailhead trailmix, Chegg, Brainscape, cram and a library record. "…flashcards": Quizlet ×3, Brainscape, 2 Trailhead URLs, flashcardmachine, cram and studystack [prior].
10. **Scores:**
   - D3: 25/45 r/salesforce flashcard-feed posts concern admin exam prep; no Admin deck requests
   - G4: AnkiWeb decks from 2020 under old ADM201 code
   - S1: Program Terms deem learning content confidential, non-commercial use
   - R2: 'rely exclusively' on official guides messaging; strict program terms
   - St3: no dated revision seen
   - P3: Salesforce Ben, Trailblazer groups
   - Se3: stale AnkiWeb and a trailmix rank

### 3.24 Snowflake SnowPro Core (COF-C03)
1. **Volume:** none published (none found).
2. **Deck demand:** r/snowflake combined "anki OR flashcards OR flashcard" feed returned **1 entry**: "SnowPro Core Certification (COF-C02) with 840! My Exam Review & Study Tips" (2025-11-01) (`rss/rss2_snowflake.xml`). No deck requests.
3. **Supply:**
   - **No Anki deck found.** "SnowPro Core anki deck" returned Brainscape, Japanese "Core 2k" decks, Quizlet and Medium.
   - "SnowPro Core flashcards" returned Quizlet ×5 (one titled COF-C02, the old version), Brainscape, a Sybex study guide at Target, Medium and Open Exam Prep.
   - GitHub "anki snowflake/snowpro": 0 relevant repos.
4. **Official flashcards:** none found.
5. **Sources:**
   - The exam overview is public (`sf_cof3.txt`).
   - The docs are "All Rights Reserved", and the **Site Terms forbid creating "derivative works from the Materials"** and scraping (`snow_site_terms.txt`). That is a weak basis for paraphrased cards: citation and linking only.
6. **Rules:** the SnowPro Certification Exam Terms say: "The Exam and all content related to the Exam is the confidential and proprietary information of Snowflake ... you agree not to disclose, copy, or publish any such Confidential Information", and forbid "unauthorized materials related to the Exam" (https://www.snowflake.com/legal/snowpro-certification-exam-terms/, `snow_exam_terms.txt`). These terms cover exam content only.
7. **Churn:** the page shows "SnowPro® Core Certification COF-C03", costing $175 (`sf_cof3.txt`). A search summary said COF-C03 went live on 16 Feb 2026, which is **not verified** from Snowflake.
8. **Partnerships:** Snowflake community pages exist (community.snowflake.com, seen in search results). No specific partner was verified.
9. **Search:** empty for Anki (**winnable**); Quizlet-dominated for flashcards.
10. **Scores:**
   - D1: r/snowflake flashcard feed returned 1 post (a COF-C02 pass report)
   - G5: no Anki deck; Quizlet sets reference COF-C02
   - S1: site terms forbid derivative works
   - R3: exam terms exam-content only
   - St3: COF-C03 current; live date unverified
   - P1: none identified
   - Se4: no Anki deck ranks

### 3.25 Databricks Certified Data Engineer Associate
1. **Volume:** "our certified community now sits at over 90,000 data and AI professionals" (Databricks blog, 15 January 2026, `db_blog_ai.txt`). A later post (9 March 2026) says "Hundreds of thousands of practitioners have earned Databricks certifications" (`db_blog_impact.txt`). The two figures conflict, and neither is per-exam.
2. **Deck demand:** r/databricks combined feed returned **2 entries**, 0 deck posts: "How to best Study for Databricks Data Engineer Associate? [May Update]" (2026-05-31) and "Just Built a Free Mobile-Friendly Swipable DB-DEA Cheat Sheet" (2025-07-11) (`rss/rss2_databricks.xml`).
3. **Supply:**
   - **No exam-specific Anki deck.** AnkiWeb 1586217157 "Data Engineering (Introductory Terms)" has 10 notes and is generic.
   - "…flashcards" returned **Quizlet ×8, two titled "Dumps"**, then CertSafari.
   - GitHub: 0 relevant repos.
4. **Official flashcards:** none found. Databricks publishes an "ai-prep-guide-any-databricks-certification.pdf" (linked from the cert page, `db_dea.raw`); it was not read.
5. **Sources:**
   - The exam guide PDF is public (https://www.databricks.com/sites/default/files/2026-05/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf, linked from `db_dea.raw`; not downloaded).
   - The docs are "All rights reserved", and the Terms of Use forbid derivative works (`db_terms.txt`).
   - Apache Spark and Delta Lake docs may be open-licensed, but that was **not checked**.
6. **Rules:** the Databricks certification agreement was **not read**.
7. **Churn (high):**
   - The exam guide URL is dated 2026-05 ("exam-guide-may-2026").
   - The cert page says "Recertification is required every two years ... you must take the current version of the exam" (`db_dea.txt`).
   - A search summary said the May 2026 blueprint restructured the July 2025 version from 5 to 7 sections. That is **not verified**.
8. **Partnerships:** a community.databricks.com thread, "Materials to pass Databricks Data Engineering Associate Exam", ranked (search results only).
9. **Search:** empty for Anki; Quizlet-dominated for flashcards.
10. **Scores:**
   - D2: 90,000+ certified (Jan 2026 blog); r/databricks flashcard feed had 2 posts, 0 deck posts
   - G5: no Anki deck; Quizlet sets include 'Dumps'
   - S1: terms forbid derivative works
   - R3: certification agreement not read
   - St2: guide dated May 2026, recert on current version every 2 years
   - P2: community forum only
   - Se4: no Anki deck ranks


---

## 4. Other certs with visible demand (not fully scored)

- **AWS Certified Data Engineer – Associate (DEA-C01).**
  - It is current in the exam-guide index (`aws_guides.txt`).
  - **AWSomecards does not cover it** (`awsomecards.txt`). Crucial Exams has 85 flashcards for it.
  - It had 5 mentions in the r/AWSCertifications "anki" feed.
  - This is a real gap inside AWS, where most exams are already served.
- **KCSA (Kubernetes and Cloud Native Security Associate).** CNCF says the exam "hit 10,000 registrations (90% increase from 2024)" (`cncf_ar25.txt`). It is also in the CC BY curriculum. It is worth bundling with KCNA.
- **AWS MLA-C02.** The beta opened on 1 September 2026, and the last day for MLA-C01 is 28 September 2026 (`aws_guides.txt`). It is in active churn: wait.
- **Google Generative AI Leader.** It costs $99 and has "50-60 multiple choice questions" (https://cloud.google.com/learn/certification/generative-ai-leader, `gc_genai.txt`). No demand data was collected.
- **Microsoft AI-200 and AI-103.** Study guides exist for "Exam AI-200: Developing AI Cloud Solutions on Azure" and for AI-103 "Skills measured as of April 16, 2026" (`ms_sg_ai-200.txt`, `ms_sg_ai-103.txt`). AZ-204 "was retired on July 31, 2026" (`ms_sg_az-204.txt`). Microsoft's AI line churns fastest [prior: size-demand.md §5].

## 5. Gaps in this research

- r/Anki: the combined cloud query was dominated by TTS add-on posts, so r/Anki gives little per-cert signal outside AWS.

- The **web-search budget ran out**. The following ranking queries were not run: "<cert> flashcards" for CLF, SAA, DVA, SOA, SAP, SCS, AZ-104 (the prior research ran it), DP-900, ACE (the prior research ran it), PCA, CKAD, KCNA-anki variants, LFCS, and Salesforce (the prior research ran it). "AWS DEA-C01 anki deck" was also not run.
- **Reddit:** the RSS was heavily rate-limited (HTTP 429). The feeds that were collected are listed in each section. Comment threads, and so the recommended decks, are not visible.
- **Holder counts** for Microsoft, Google (per exam), HashiCorp, Red Hat, Salesforce and Snowflake: none published was found.
- **Quizlet** set sizes and **AnkiWeb download counts** are not available.
- **Red Hat docs licence**, and the **HashiCorp, Red Hat and Databricks candidate agreements**: not read.
