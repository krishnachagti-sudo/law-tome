# Candidates, second pass: security, privacy, networking and GRC long tail

Researched 2026-09-24. This pass covers the full catalogues of the security and privacy bodies. The first pass covered only their flagship exams.

**Evidence rules.**
- Every fact below comes from raw text fetched during this task (curl, then HTML-to-text or pdftotext). Raw copies are in `scratchpad/candidates2/raw-sec/`:
  - `pages/`: official pages and PDFs, as `.html`/`.pdf` plus `.txt`
  - `rss/`: Reddit search RSS feeds
  - `github/summary.txt`: GitHub repository searches
  - `fetch_log.txt`, `rss_log.txt`: fetch logs
- Facts reused from the first pass are marked **[P1]** (`research/cert-decks/candidates/security.md`), or **[RR §n]** (`certification-market/rules-risks.md`). I did not re-fetch those pages.
- **Not available this pass:**
  - No web-search engine was used, so every new Search score is **3 (nv, neutral)**. First-pass Search scores are kept where a search was actually run.
  - AnkiWeb search still returns "Please log in to perform more searches." (`raw-sec/ankiweb/CISM.pb`). **No new AnkiWeb deck data was collected.** "No deck found" below means GitHub and Reddit only.
  - The GitHub REST API refused curl ("sessions are bound to their configured repositories"), so searches ran through the GitHub MCP tool.
  - cisco.com, iso.org and dodcio.defense.gov returned 403. www.cmmccaico.org failed with a proxy 502.
  - Only 5 Reddit feeds were fetched: r/iapp AIGP, r/CMMC CCP, r/isc2 CGRC, r/isc2 CSSLP and r/CWNP anki. **All other Reddit demand is "not fetched".**
- **Scoring:** 1 to 5 per criterion, where 5 is always good for the site. Totals are out of 35. Demand is scored 1 wherever no demand evidence was collected; that low score reflects missing evidence, not proven low demand.

---

## Summary table

45 certifications are scored in 41 rows (two rows group three GIAC exams each): 32 new and 13 carried from the first pass. The table is sorted by total. Search "3" means neutral (nv) unless marked [P1].

| # | Cert (body) | Current version / outline date | D | G | So | R | St | P | Se | **Total** | Family | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CCSP (ISC2) [P1] | Outline eff. 1 Aug 2026 | 3 | 5 | 4 | 4 | 5 | 3 | 4 | **28** | NIST security | Build. |
| 2 | KCSA (Linux Foundation / CNCF) | 6 domains (curriculum PDF) | 3 | 4 | 5 | 5 | 4 | 4 | 3 | **28** | Kubernetes | Build with KCNA/CKS; overlaps with cloud.md. |
| 3 | CIPP/E (IAPP) [P1] | BoK v1.3.3, eff. 1 Sep 2025 | 2 | 5 | 5 | 4 | 4 | 3 | 4 | **27** | Privacy law | Build. |
| 4 | CISSP (ISC2) [P1] | Outline eff. 15 Apr 2024 | 5 | 3 | 4 | 4 | 3 | 4 | 3 | **26** | NIST security | Build. |
| 5 | CC (ISC2) [P1] | Outline eff. 1 Sep 2026 | 3 | 4 | 5 | 4 | 4 | 3 | 3 | **26** | NIST security | Build. |
| 6 | SSCP (ISC2) [P1] | Outline eff. 1 Oct 2025 | 2 | 5 | 4 | 4 | 4 | 2 | 5 | **26** | NIST security | Build. |
| 7 | CIPP/US (IAPP) [P1] | BoK v2.6.1, eff. 1 Sep 2025 | 2 | 5 | 5 | 4 | 3 | 3 | 4 | **26** | Privacy law | Build. |
| 8 | **CGRC (ISC2)** | Outline eff. 15 Jun 2024 | 3 | 4 | 5 | 4 | 3 | 3 | 3 | **25** | NIST security (RMF) | **Best new find.** It is NIST 800-37/53 almost end to end, and Reddit shows people making their own RMF flashcards. |
| 9 | **CCSK v5 (CSA)** | Guidance v5, released 15 Jul 2024, updated 26 Aug 2025 | 3 | 4 | 4 | 4 | 4 | 3 | 3 | **25** | Cloud / zero trust | CSA's default licence expressly allows explanatory works. The exam is open-book. |
| 10 | **CCZT (CSA)** | nv | 1 | 5 | 5 | 4 | 4 | 3 | 3 | **25** | Cloud / zero trust | NIST 800-207 and CISA sources are public domain; no demand data. |
| 11 | AIGP (IAPP) | BoK v2.1, eff. 2 Feb 2026 | 3 | 4 | 4 | 4 | 3 | 3 | 3 | **24** | Privacy / AI governance | Open sources (EU AI Act, NIST AI RMF); fast-moving law. |
| 12 | CIPT (IAPP) [P1] | BoK v4.0.0 | 2 | 5 | 3 | 4 | 4 | 3 | 3 | **24** | Privacy | |
| 13 | ISSEP (ISC2) | Outline eff. 1 Aug 2025 | 1 | 4 | 5 | 4 | 5 | 2 | 3 | **24** | NIST security | Empty niche, small audience; cheap once the NIST family exists. |
| 14 | GSEC (GIAC) [P1] | Version from 6 Apr 2026 | 1 | 5 | 4 | 3 | 4 | 2 | 5 | **24** | GIAC | |
| 15 | CEH (EC-Council) [P1, rules now verified] | 312-50 v13 | 3 | 4 | 4 | 3 | 3 | 2 | 4 | **23** | EC-Council | |
| 16 | CIPM (IAPP) [P1] | BoK v4.2.0 | 2 | 5 | 2 | 4 | 4 | 3 | 3 | **23** | Privacy | |
| 17 | GCIH (GIAC) | 106 Q / 4 h / 69% | 2 | 5 | 4 | 3 | 4 | 2 | 3 | **23** | GIAC | Largest GIAC deck signal (one 2023 post), but the exam is open-book. |
| 18 | ISSAP (ISC2) | Outline eff. 1 Aug 2025 | 1 | 4 | 4 | 4 | 5 | 2 | 3 | **23** | NIST security | As ISSEP. |
| 19 | CIPP/C (IAPP) | BoK v3.1.0, eff. 1 Sep 2025 | 1 | 5 | 4 | 4 | 4 | 2 | 3 | **23** | Privacy law | Federal law is free to reproduce under an Order (see evidence). |
| 20 | CIPP/AU (IAPP) | BoK v1.0, eff. 30 Jun 2026; first sitting Dec 2026 | 1 | 5 | 3 | 4 | 5 | 2 | 3 | **23** | Privacy law | Launch window: online exam "early in 2027". |
| 21 | CyberOps Associate (Cisco) | CBROPS 200-201 v1.1 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | **22** | Cisco | Some supply exists; Cisco docs not reusable. |
| 22 | CMMC CCP (ISACA as CAICO) | Domains on isaca.org | 3 | 4 | 5 | 3 | 2 | 2 | 3 | **22** | NIST / CMMC | Sources are all public, but the programme is in flux (ISACA took over; DoW reform RFI). |
| 23 | CSSLP (ISC2) | Outline eff. 15 Sep 2023 | 2 | 4 | 4 | 4 | 2 | 3 | 3 | **22** | NIST security | A refresh is likely due (inference); 52-star notes repo is a partner lead. |
| 24 | ISSMP (ISC2) | Outline eff. 1 Aug 2025 | 1 | 4 | 3 | 4 | 5 | 2 | 3 | **22** | NIST security | Management content with fewer open sources. |
| 25 | CIPP/A (IAPP) | BoK v2.0.0, eff. 14 Jul 2025 | 1 | 5 | 3 | 4 | 4 | 2 | 3 | **22** | Privacy law | Singapore, Hong Kong and India law reuse terms not verified. |
| 26 | CWSP (CWNP) | CWSP-208, Dec 2025; next 31 Dec 2028 | 1 | 5 | 3 | 3 | 5 | 2 | 3 | **22** | Wireless | Stable but tiny. |
| 27 | GPEN / GCIA / GFACT (GIAC) | 82 Q / 3 h (GPEN) | 1 | 5 | 4 | 3 | 4 | 2 | 3 | **22** each | GIAC | Open-book; no demand signal. |
| 28 | ENCOR (Cisco) [P1] | 350-401, version nv | 3 | 4 | 3 | 3 | 3 | 2 | 3 | **21** | Cisco | |
| 29 | CRISC (ISACA) [P1] | | 2 | 5 | 3 | 2 | 3 | 2 | 4 | **21** | Partnership-first | |
| 30 | CWNA (CWNP) | CWNA-109 → CWNA-110 (Sep 2026) | 1 | 5 | 3 | 3 | 4 | 2 | 3 | **21** | Wireless | Build only for 110; its objectives were not fetched. |
| 31 | CMMC CCA | | 1 | 5 | 5 | 3 | 2 | 2 | 3 | **21** | NIST / CMMC | A tag on the CCP deck. |
| 32 | GCFA / GICSP / GSLC (GIAC) | 82–115 Q / 3 h | 1 | 5 | 3 | 3 | 4 | 2 | 3 | **21** each | GIAC | Notes only. |
| 33 | DevNet Associate (Cisco) | DEVASC 200-901 v1.1 | 2 | 4 | 3 | 3 | 3 | 2 | 3 | **20** | Cisco | Current name and version nv. |
| 34 | CND (EC-Council) | v3, exam 312-38, 100 Q / 4 h | 1 | 5 | 4 | 3 | 3 | 1 | 3 | **20** | EC-Council | |
| 35 | OSCP+ (OffSec) [P1] | PEN-200, 24 h practical | 1 | 3 | 4 | 3 | 4 | 2 | 3 | **20** | Hands-on | |
| 36 | CIPP/CN (IAPP) | BoK v1.0.0, eff. 3 Jun 2024 | 1 | 5 | 2 | 4 | 4 | 1 | 3 | **20** | Privacy law | Chinese law reuse and translations not verified. |
| 37 | SCOR (Cisco) | 350-701 v1.1 | 2 | 4 | 2 | 3 | 3 | 2 | 3 | **19** | Cisco | Product-specific; closed docs. |
| 38 | ISO/IEC 27001 Lead Implementer (PECB) | Handbook v1.5 | 2 | 4 | 1 | 3 | 4 | 2 | 3 | **19** | ISO management | The ISO text is paywalled, and the exam is open-book with the standard allowed. |
| 39 | ISO/IEC 27001 Lead Auditor (PECB) | | 2 | 4 | 1 | 3 | 4 | 2 | 3 | **19** | ISO management | As LI. |
| 40 | CBCI (BCI) | CBCI 7.0 on GPG 7.0 | 2 | 5 | 1 | 2 | 3 | 2 | 3 | **18** | ISO management | GPG is members-only or paid, and the course is mandatory. |
| 41 | CHFI (EC-Council) | 312-49, 150 Q / 4 h | 1 | 4 | 3 | 3 | 3 | 1 | 3 | **18** | EC-Council | |

Partnership-first (not scored here): the CompTIA and ISACA catalogues. [P1] scores are CISM 25, CISA 23, CRISC 21 and all CompTIA exams 20–24 with Rules 1. See **Catalogue notes**.

Not scored:
- HCISPP: sunset.
- CWTS: retired 2018.
- OSEP, OSWE, OSDA, OSIR, OSTH: hands-on.
- The remaining GIAC certifications.
- DRII CBCP.
- FedRAMP: no individual exam found. **Not verified; not researched.**

Ties are listed with higher Demand first.

### Top 10 in this area (all build candidates, partnership-first excluded)
1. CCSP (28)
2. KCSA (28)
3. CIPP/E (27)
4. CISSP (26)
5. CC (26)
6. SSCP (26)
7. CIPP/US (26)
8. **CGRC (25)**
9. **CCSK v5 (25)**
10. **CCZT (25)**

The next group (22–24) is ISSEP, AIGP and the CMMC CCP. They are cheap add-ons to the NIST and privacy families.

### Notable empty niches (no Anki or GitHub deck found; AnkiWeb unsearchable)
- **CGRC:**
  - No GitHub repo.
  - Reddit posts describe self-made flashcards for RMF, NIST documents and roles.
  - The only packaged cards are ISC2's form-gated free set.
- **ISSAP, ISSEP, ISSMP:** only 2-star personal note repos on GitHub.
- **CIPP/C, CIPP/A, CIPP/AU and CIPP/CN, plus CIPM and CIPT:** GitHub search returned 0.
  - CIPP/AU is brand new: first in-person sitting in December 2026, online "early in 2027".
- **CCZT:** nothing found. **CCSK v5:** only a 2019 v4 prep kit and course repos.
- **CMMC CCP/CCA:** Quizlet user sets, plus one 0-star Code of Professional Conduct flashcard repo. ISACA's own QAE is "Coming Soon".
- **CWNA-110 and CWSP-208:** nothing on GitHub beyond 2017–2022 notes; the r/CWNP `anki` feed returned 0 entries.
- **EC-Council CND and CHFI:** resource repos only.

---

## Cross-cutting evidence (new this pass)

### Open sources
- **NIST publications, now verified at source.** "Works authored by NIST employees are not subject to Copyright protection within the United States; foreign rights are reserved. To the extent NIST may assert rights outside of the United States, the public is granted the non-exclusive, perpetual, paid-up, royalty-free, worldwide right to reprint works in all formats including print, electronically, and online, and in all subsequent editions, and derivative works. Please use the recommended citation format below followed by 'Republished courtesy of the National Institute of Standards and Technology.' Some works published by NIST may have been written by third parties and may be subject to copyright protection." (https://www.nist.gov/open/copyright-fair-use-and-licensing-statements-srd-data-software-and-technical-series-publications; `pages/nist_licensing.txt`)
  - Consequence: cards can reuse NIST SP text worldwide with that credit line. Check each SP for third-party-authored parts.
- **CSA (Cloud Security Alliance) research publications,** from the website terms, section "Our Research and Publications" (https://cloudsecurityalliance.org/legal/website-terms-and-conditions/; `pages/csa_webterms.txt`):
  - "You may not modify or translate these Publications, except with the prior written consent of the Cloud Security Alliance. You may use, copy, print, or link to these Publications subject to the terms and conditions attached to a specific Publication, and if no such terms are attached, subject to the following license: © 2013 Cloud Security Alliance…"
  - The default licence says: "Works that comment on, or explain this document, or assist in its implementation may be prepared, copied, published, and distributed, in whole or in part, without restriction of any kind, provided that the above copyright notice and this section are included on all such copies and derivative works."
  - Copies "must be provided free of charge".
  - **Caveat:** the Security Guidance v5 PDF sits behind a download gate (artifact page: "Released: 07/15/2024 Updated: 08/26/2025", `pages/csa_sg5.txt`). **Whether the v5 PDF carries its own, different terms is not verified.**
  - The general site-content clause bars commercial exploitation "except with an appropriate license from CSA". A free, no-ads site fits the explanatory-works licence better than a monetised one (inference).
- **Canadian federal law.** Reproduction of Federal Law Order, SI/97-5: "Anyone may, without charge or request for permission, reproduce enactments and consolidations of enactments of the Government of Canada… provided due diligence is exercised in ensuring the accuracy of the materials reproduced and the reproduction is not represented as an official version." (https://laws-lois.justice.gc.ca/eng/regulations/SI-97-5/FullText.html)
  - Provincial laws (Quebec Law 25, Alberta and BC PIPA) are **not verified**.
- **Australian law** (legislation.gov.au): the copyright and disclaimer pages are a JavaScript shell with no readable text. **Not verified.**
- **Chinese law:** the WIPO Lex page for the PRC Copyright Law gave only metadata, not the article text. The public-domain status of PRC statutes and the licensing of English translations are **not verified**.
- **ISO standards:** iso.org copyright and terms pages returned 403. The ITTF "Publicly Available Standards" site now says: "The ISO/IEC Information Technology Task Force (ITTF) web site is now closed. The deliverables previously available on this site are now available at no charge on the ISO and IEC webstores" (`pages/iso_pas.txt`).
  - Whether ISO/IEC 27000 remains free there, and ISO's reuse terms, are **not verified**. Treat ISO text as all-rights-reserved and paraphrase only.
- **US federal works** (17 U.S.C. §105), **EU material (CC BY 4.0 Commission policy)** and **MITRE ATT&CK licence**: see [P1] "Open primary sources".
  - CISA (the agency) documents such as the Zero Trust Maturity Model are US-government works under §105. That rests on §105 alone; no CISA licence page was fetched.

### Rules for third-party study aids (new bodies)
- **EC-Council** (now verified; CEH, CND, CHFI):
  - The NDA v3.0 bans "publishing any brain dump, exam dump and/or any other unauthorized material that contains Confidential Information" (`pages/ec_nda.txt`, https://cert.eccouncil.org/images/doc/NDA-Non-Disclosure-Agreement-v3.0.pdf).
  - Confidential Information covers "exam items, materials… questions… exam content and/or exam standards… which contain or reflect, or are generated from, such exam materials".
  - The Certification Agreement 6.2 defines "Examination Materials" as the exam items "and any accompanying materials. The list is inclusive of all related EC-Council Training Materials", and requires members "To not create any exam dumps, brain dumps" (`pages/ec_agreement.txt`).
  - The Exam Security page covers proctoring and "prohibited materials" in the exam room (`pages/ec_examsec.txt`).
  - **No clause banning independent study aids was found.** Rules = 3: independent sourced decks look permitted, but the Confidential Information definition is broad.
- **IAPP:** the handbook confidentiality clause is as in [P1]. The certify page says "exam questions do not correspond directly to training materials" (`pages/iapp_certify.txt`). No third-party ban was found. Rules = 4.
- **CWNP:**
  - The terms-of-use URL returned 404.
  - The exam guide PDF had no extractable text on third-party materials.
  - The footer reads "Copyright 2026 Certified Wireless Network Professionals. All rights reserved."
  - **Not verified.** Rules = 3.
- **GIAC** [P1]: the exam-integrity policy bans "Using illegally obtained and copyrighted material from GIAC or a third-party source such as training providers". Exams are open-book. Rules = 3.
- **OffSec** [P1]: users must not "share… our course materials with any third party". Rules = 3.
- **PECB:**
  - "Any disclosure of information about the content of PECB exams is a direct violation of PECB's Code of Ethics… PECB will also pursue legal action against individuals or organizations who infringe upon its copyrights".
  - "This is an open-book exam. The candidate is allowed to use… A hard copy of the ISO/IEC 27001 standard; Training course materials…; Any personal notes" (`pages/pecb_li_handbook.txt`, https://pecb.com/pdf/candidate-handbooks/pecb-candidate-handbook-iso-27001-lead-implementer-mc.pdf).
  - Rules = 3.
- **CMMC:** ISACA is now the CAICO (CMMC Assessor and Instructor Certification Organization).
  - The CAICO FAQ says: "ISACA has been authorized as the CMMC Assessor and Instructor Certification Organization (CAICO) and is now managing the training, examination and professional certification… CMMC Certified Professional, CMMC Certified Assessor (CCA), Lead CCA and CMMC Certified Instructor (CCI)" (https://cyberab.org/Portals/0/Documents/CAICO%20FAQ%2012.17.25.pdf; `pages/caico_faq.txt`).
  - Curriculum is developed by "Approved Publishing Partners (APP), formerly Licensed Publishing Partners (LPP)… approved by the CAICO to develop the CMMC certification curriculum" (https://cyberab.org/CMMC-Ecosystem/Ecosystem-Roles/Training-and-Instruction).
  - Cyber AB site content: "do not sell, resell, or otherwise exploit for any commercial purposes" (https://cyberab.org/Terms-of-Use).
  - ISACA's terms ban using ISACA content "as an input into AI" [RR §4].
  - Rules = 3: build only from 32 CFR 170, NIST and DFARS/FAR, never from ISACA or APP curriculum.

---

## Per-certification evidence

### ISC2 (catalogue: CISSP, SSCP, CCSP, CGRC, CSSLP, ISSAP, ISSEP, ISSMP, HCISPP, CC)
- **Catalogue:**
  - The footer marks list is in [RR §2].
  - ISC2 has "more than 270,000 certified members, and associates" (https://www.isc2.org/about).
  - No per-certification holder counts were found.
- **Official free flash cards exist for every certification scored here.** Each page says "Test Your Knowledge with [CGRC|CSSLP|ISSAP|ISSEP|ISSMP] Flash Cards", and ISSAP, ISSEP and ISSMP also show "Get the Flash Cards" (`pages/isc2_*.txt`). They are form-gated [P1]. That caps Gap at 4.
- **Rules:** NDA and member policy as in [RR §1–2]. Score 4.
- **CC, SSCP, CISSP, CCSP:** all [P1]; not re-scored.

#### CGRC (Certified in Governance, Risk and Compliance; formerly CAP)
- **Outline:** "Effective Date: June 15, 2024 CGRC Certification Exam Outline". 3 hours, 125 items, 7 domains (16/10/14/17/16/14/13%). Domain 1 cites "National Institute of Standards and Technology (NIST), cybersecurity framework… COBIT… ISO/IEC".
  - The page now adds AI text citing "NIST AI Risk Management Framework (AI RMF) and ISO/IEC 42001".
  - Sources: https://www.isc2.org/certifications/cgrc/cgrc-certification-exam-outline; PDF CGRC-Exam_Outline-English.pdf.
  - Experience: "2 Years Required Work Experience" (https://www.isc2.org/certifications/cgrc).
- **Demand:** r/isc2 search `CGRC` returned 97 posts, 96 of which mention CGRC; the newest is 2026. 8 mention Anki, flashcards, Quizlet or decks (`rss/rss_isc2_CGRC_.xml`).
  - "Passed CGRC after 2nd attempt" (2026-03-19): "I started reading material like NIST 800-37 R5 and 800-53, 53A, and 53B… I also wrote up flash cards for the RMF, NIST documents, and Roles and responsibilities (that's a big portion of the test)" (https://www.reddit.com/r/isc2/comments/1ry0ndv/).
  - "My CGRC study and exam experience" (2024): "go through the CGRC flashcards provided by ISC2" (https://www.reddit.com/r/isc2/comments/1gew9n6/).
  - A 2026-08-23 post: the new job "requires CGRC as a condition to pass probation" (https://www.reddit.com/r/isc2/comments/1vw7y34/).
- **Supply:** GitHub `CGRC OR ISSAP OR ISSEP OR ISSMP` returned no CGRC study repo (`github/summary.txt`). AnkiWeb nv.
- **Sources:** NIST SP 800-37 and 800-53 are open under NIST's statement. COBIT and ISO are proprietary.
- **Scores:**
  - Demand 3: an active subreddit topic and people self-making cards.
  - Gap 4: ISC2 free cards exist.
  - Source 5.
  - Rules 4.
  - Stability 3: the outline is 27 months old; the refresh timing is not verified.
  - Partner 3: ISC2 chapters and r/isc2.
  - Search 3 nv.
  - **25.**

#### CSSLP
- **Outline:** "Effective Date: September 15, 2023". 3 hours, 125 items, 8 domains, citing "ISO, PCI, NIST, OWASP, SAFECode, SAMM, BSIMM" (https://www.isc2.org/certifications/csslp/csslp-certification-exam-outline). "4 Years Required Work Experience".
- **Demand:** r/isc2 `CSSLP` returned 19 posts; 1 mentions flashcards, and that one is a CC post (`rss/rss_isc2_CSSLP_.xml`).
- **Supply:** GitHub `CSSLP` returned 40 repos, all notes and code: joeyhage/csslp-notes (52 stars, updated 2026-08-27), lukeciatt/csslp-notes (9). No deck.
- **Sources:** NIST publications are open. The OWASP licence was not verified [P1]. ISO is paywalled.
- **Scores:**
  - Demand 2.
  - Gap 4.
  - Source 4.
  - Rules 4.
  - Stability 2: the outline is three years old, so a refresh is likely (inference, not verified).
  - Partner 3: the joeyhage repo.
  - Search 3.
  - **22.**

#### ISSAP, ISSEP, ISSMP (CISSP concentrations)
- **Outlines:** all "EFFECTIVE DATE: AUGUST 1, 2025". Each is 3 hours and 125 items, and requires "CISSP + 2 Years or 7 years cumulative".
  - ISSAP has 4 domains (GRC 21%, architecture modelling 22%, infrastructure 32%, IAM 25%).
  - ISSEP has 5 domains and cites the "NIST engineering framework, ISO 27001".
  - ISSMP has 6 domains and cites "NIST AI RMF and ISO/IEC 42001".
  - Sources: https://www.isc2.org/certifications/issap/issap-certification-exam-outline, …/issep/…, …/issmp/…
- **Supply:** GitHub has chaffin/ISSEP (2 stars, 2024), jameskittle/issmp-repo (2 stars, 2023 notes) and nobinuxlab/cissp-issap (2 stars, updated 2026-08-24). No decks.
- **Scores:**
  - Demand 1: no data; small, post-CISSP audiences.
  - Gap 4.
  - Source: ISSEP 5 (NIST SP 800-160 family; that the outline covers it is an inference from "NIST engineering framework"), ISSAP 4, ISSMP 3.
  - Rules 4.
  - Stability 5: outlines are 13 months old.
  - Partner 2.
  - Search 3.
  - **ISSEP 24, ISSAP 23, ISSMP 22.**

#### HCISPP (not scored)
- "This credential will be sunset. The HCISPP will be designated inactive effective December 1, 2026" (https://www.isc2.org/certifications/hcispp; notice https://www.isc2.org/notice/HCISPP-Sunset). **Skip.**

### IAPP (catalogue: CIPP/A, /AU, /C, /CN, /E, /US; CIPM; CIPT; AIGP; plus FIP and PLS designations)
- The CIPP page lists "Asia - CIPP/A Australia - CIPP/AU Canada - CIPP/C China - CIPP/CN Europe - CIPP/E United States - CIPP/US". The same page still says "five distinct CIPP designation concentrations"; the certify page says six (https://iapp.org/certify/cipp; https://iapp.org/certify).
- "IAPP certifications are standalone credentials… exam questions do not correspond directly to training materials."
- "CIPM, CIPP/E, CIPP/US and CIPT credentials are accredited by the ANSI National Accreditation Board under… ISO 17024: 2012."
- Every certification page offers a free BoK and exam-blueprint PDF, plus (on most) a free study guide.
- Rules = 4 for all (see above). CIPP/E, CIPP/US, CIPM and CIPT are [P1].

#### AIGP (AI Governance Professional)
- **BoK:** "VERSION 2.1 Effective date: 2 February 2026", approved 9 September 2025. It cites "current AI laws (e.g., the EU AI Act, the South Korean AI Basic Law, federal and state AI…" and asks candidates to "Understand the NIST AI Risk Management Framework" (`pages/aigp_bok.txt`, from https://iapp.org/certify/aigp).
- **Demand:** r/iapp `AIGP` returned 12 posts; 1 is deck-titled: "Free Quizlet AIGP Study Set" (2024-06-07, https://www.reddit.com/r/iapp/comments/1dab1e2/).
- **Supply:** GitHub KirthanaRupanagudi/AIGP-PREP, "Self-paced, source-backed prep for the IAPP AIGP certification — lessons, flashcards, and quizzes mapped to BoK v2.1" (1 star, created 2026-07-17, updated 2026-09-20). This is a small direct competitor and a possible partner.
- **Sources:** the EU AI Act is EU law (Commission CC BY policy [P1]; EUR-Lex terms nv). The NIST AI RMF is open. ISO/IEC 42001 is paywalled. The OECD licence nv.
- **Scores:**
  - Demand 3: a new, growing field, but thin data.
  - Gap 4.
  - Source 4.
  - Rules 4.
  - Stability 3: AI law is moving.
  - Partner 3.
  - Search 3.
  - **24.**

#### CIPP/C
- **BoK:** "VERSION 3.1.0 EFFECTIVE DATE: 1 Sept. 2025", approved 24 Jan. 2025. It covers PIPEDA, "'substantially similar' provincial laws", the Privacy Act and provincial health acts, and cites "the OECD AI Principles, NIST's 'AI RMF'" (`pages/cippc_bok.txt`).
- **Supply:** GitHub `CIPP…` returned 0. Demand not fetched.
- **Sources:** federal law is free to reproduce (SI/97-5, above). Provincial law nv.
- **Scores:** Demand 1; Gap 5; Source 4; Rules 4; Stability 4; Partner 2; Search 3. **23.**

#### CIPP/A
- **BoK:** "Version 2.0.0", approved 10 Feb. 2025, effective 14 July 2025 (page header), superseding 1.0.2. It covers the OECD Guidelines, APEC, and Singapore, Hong Kong and India privacy law (`pages/cippa_bok.txt`).
- **Supply:** GitHub returned 0.
- **Sources:** Singapore, Hong Kong and India reuse terms were **not verified**.
- **Scores:** Demand 1; Gap 5; Source 3; Rules 4; Stability 4; Partner 2; Search 3. **22.**

#### CIPP/AU (new)
- "The new IAPP CIPP/AU certification… Register now to take the CIPP/AU certification exam in person at IAPP ANZ Summit in December. The exam will be available for purchase online early in 2027" (https://iapp.org/certify/cippau).
- **BoK:** "VERSION 1.0 EFFECTIVE DATE: 30 June 2026", approved 22 June 2026 (`pages/cippau_bok.txt`).
- **Sources:** Australian legislation licence **not verified** (site is a JS shell).
- **Scores:**
  - Demand 1: not yet launched.
  - Gap 5.
  - Source 3.
  - Rules 4.
  - Stability 5: v1.0.
  - Partner 2.
  - Search 3.
  - **23.** Timing advantage: a deck ready by early 2027 would be first.

#### CIPP/CN
- **BoK/EBP:** "Version 1.0.0", effective 3 June 2024. It covers the CSL, DSL and PIPL (`pages/cippcn_bok.txt`).
- **Sources:** PRC law reuse and English translations are **not verified**.
- **Scores:** Demand 1; Gap 5; Source 2; Rules 4; Stability 4; Partner 1; Search 3. **20.**

### Cloud Security Alliance

#### CCSK v5
- "The CCSK exam is open-book and online. It contains 60 multiple-choice questions selected randomly from a larger pool, and you must complete it in 120 minutes. The minimum passing score is 80%." "The CCSK v5 covers 12 domains", Domain 1 being "Cloud Computing Concepts & Architectures". There is a "Free Prep Kit" and the page says "Winner of the Best Cloud Security Certification 2025" (https://cloudsecurityalliance.org/education/ccsk).
- **Body of knowledge:** Security Guidance v5 ("Completely revamped from v4… Zero Trust, Generative AI"; https://cloudsecurityalliance.org/research/guidance). The artifact was released 07/15/2024 and updated 08/26/2025.
- **Licence:** see above. Explanatory works are allowed with the notice. v5's PDF-specific terms nv.
- **Supply:** GitHub `CCSK` gave Skillsoft-Content/CCSKBootcamp (24 stars, 2025-09-30), spadigala/CCSKv4 ("exam preparation kit", 11 stars, v4, 2019) and bvoris/CCSKTraining (6 stars, 2026-01-07). No v5 deck.
- **Partners:** CSA runs an affiliate programme (`/artifacts/ccsk-affiliate-marketing-program-faq` linked from the page; not read).
- **Scores:**
  - Demand 3: nv; the repo counts show some study activity.
  - Gap 4.
  - Source 4: the licence is favourable but v5-specific terms nv.
  - Rules 4.
  - Stability 4.
  - Partner 3.
  - Search 3.
  - **25.** Caveat: an open-book exam lowers the value of recall cards (inference).

#### CCZT (Certificate of Competence in Zero Trust)
- "The CCZT exam is open-book and online. It contains 60 multiple-choice questions… 120 minutes… 80%". It "includes foundational Zero Trust components released by CISA and NIST, innovative work in the Software Defined Perimeter by CSA…" (https://cloudsecurityalliance.org/education/cczt).
- **Supply:** no relevant GitHub repo found (the query was dominated by generic Anki repos; treat as nv).
- **Sources:** NIST SP 800-207 is open; CISA is under §105; the CSA licence is as above.
- **Scores:** Demand 1 (no data); Gap 5; Source 5; Rules 4; Stability 4 (version date nv); Partner 3; Search 3. **25.**

### GIAC (catalogue)
- **The certification sitemap lists 73 URLs** (https://www.giac.org/sitemaps/certifications.xml; `pages/giac_cert_urls.txt`):
  - AI, cloud and new: GAIPT, GAIPS, GASAE, GOAA, GCAD, GCIL, GEIR, GLIR, GRTP, GSOA, GBFA, GCSA, GPCS, GCLD, GCTD, GCPN, GCFR, GMLE
  - Core: GSEC, GCIH, GCIA, GCFA, GCFE, GPEN, GWAPT, GXPN, GREM, GNFA, GCTI, GCDA, GMON, GCCC, GDSA, GDAT, GCED, GWEB, GMOB, GASF, GIME, GOSI, GPYC, GEVA, GSNA, GSOC, GSOM, GAWN, GCWN, GCIP, GRID, GICSP, GFACT, GISF, GISP, GLEG, GCPM, GSLC, GSTRT
  - "Experienced" series: GXFE, GXFA, GXIA, GXIH, GXPT, GXCS
  - Legacy slugs (retirement status not verified): gcim, g2700, gnet, gsip, gssp-net, gssp-c, gssp-java, gse, gcux, gppa
- **Formats read:**
  - GCIH: 106 questions, 4 hours, 69%.
  - GPEN: 82 questions, 3 hours, 73%.
  - GCFA: 82 questions, 3 hours, 71%.
  - GICSP: 82 questions, 3 hours, 71%.
  - GSLC: 115 questions, 3 hours, 70%.
  - GCIA: 67%. GFACT: 71%. GCLD: 61%. GISF: 75 questions.
  - Each page adds: "GIAC periodically reviews and may update certification specifications" (`pages/giac_g*.txt`).
- **Open-book** [P1]. The only GitHub hit for `GIAC anki OR GCIH…` was chris2ao/cramdex, "Study app for SANS courses and GIAC open-book exams… Bring your own course PDFs". Candidates index their own courseware rather than use flashcards (inference).
- **Scores:**
  - GCIH: 2/5/4/3/4/2/3 = **23** (one "Anki/BrainScape decks for Sec504" post [P1]).
  - GPEN, GCIA, GFACT: 1/5/4/3/4/2/3 = **22**.
  - GCFA, GICSP (ISA/IEC 62443 is paywalled; NIST SP 800-82 is open), GSLC: 1/5/3/3/4/2/3 = **21**.
  - The other ~60: noted, not scored.
  - Recommendation: **low priority family.** If built at all, build one "GIAC glossary" deck on NIST and ATT&CK sources, not per-cert decks.

### OffSec (notes only; hands-on)
- **OSCP / OSCP+ (PEN-200):** "24-hour proctored" (https://www.offsec.com/courses/pen-200/). Scored 20 [P1].
- **OSEP (PEN-300):** "48-hour proctored exam". Like "OSCP+, OSIR, and OSTH", the OSEP "does not expire" (https://www.offsec.com/courses/pen-300/).
- **OSWE (WEB-300):** "48-hour proctored". Passing "OSEP and OSED" as well awards "OSCE³" (https://www.offsec.com/courses/web-300/).
- **OSDA (SOC-200):** "The OSDA exam is a 24-hour, proctored assessment conducted over a secure VPN" (https://www.offsec.com/courses/soc-200/).
- **Demand:** r/oscp returned 0 `anki` posts [P1]. Course-material sharing is banned [P1].
- **Not scored:** practical exams with no flashcard demand. At most, a command-recall appendix to a later "pentest methodology" deck.

### CWNP (Certified Wireless Network Professional)
- **Catalogue:** CWSS, CWTS, CWNA, CWSP, CWAP, CWDP, CWNE, CWNT and CWISA (https://www.cwnp.com/it-certifications/).
- **CWNA:** "Current version: CWNA-109 released in September 2023 - CWNA-109 exam can be taken until December 31, 2026. Next scheduled update: CWNA-110 releasing in September 2026" (https://www.cwnp.com/certifications/cwna). The exam-update page confirms: CWNA-109 until December 31, 2026; CWNA-110 September 2026.
  - **Whether 110 has launched, and its objectives, were not verified.**
- **CWSP:** "Current version: CWSP-208 released in December 2025. Next scheduled update: CWSP-209 releasing on December 31, 2028" (https://www.cwnp.com/certifications/cwsp).
- **CWTS:** "The CWTS exam was retired on December 31, 2018" (https://www.cwnp.com/certifications/cwts-retired/). Not scored.
- **Demand:** r/CWNP `anki` returned **0** entries (HTTP 200, `rss/rss_CWNP_anki_.xml`). GitHub has CWNA notes from 2017 and 2022 only.
- **Sources:** CWNP objectives PDFs are public (cwna-109-objectives-2023.pdf). IEEE 802.11 access terms were not checked.
- **Scores:**
  - CWNA: 1/5/3/3/4/2/3 = **21** (Stability 4 assumes building for CWNA-110).
  - CWSP: 1/5/3/3/5/2/3 = **22**.

### Cisco (cisco.com returned 403; content terms from [RR §4]: docs not licensed for reproduction; "deep link" encouraged)
- **CyberOps Associate, CBROPS 200-201 v1.1:** "a 120-minute exam that is associated with the Cisco Certified CyberOps Associate Certification… security concepts, security monitoring, host-based analysis, network intrusion analysis, and security policies and procedures" (https://learningcontent.cisco.com/documents/marketing/exam-topics/200-201-CBROPS-v1.1.pdf).
  - v1.0 and v1.2 URLs returned 403, so the current version is nv.
  - Supply: gothburz/200-201-CBROPS-…-Study-Guide (115 stars, quick-reference PDFs per chapter of the official guide, updated 2026-09-04); santosomar/cyberops (33 stars, Cisco Press supplemental); a 2024 r/cybersecurity Anki-deck post [P1].
  - Scores 3/3/4/3/3/3/3 = **22**.
- **CCNP Security core, SCOR 350-701 v1.1:** "a 120-minute exam associated with the CCNP and CCIE Security Certifications… network security, cloud security, content security, endpoint protection…" (…/350-701-SCOR-v1.1.pdf).
  - Product-specific, and Cisco docs are closed.
  - Scores 2/4/2/3/3/2/3 = **19**.
- **CCNP Enterprise core, ENCOR 350-401:** [P1] 21. Exam-topic PDF guesses v1.1–1.3 all returned 403.
- **DevNet Associate, DEVASC 200-901 v1.1:** "a 120-minute exam associated with the DevNet Associate - Developer Certification" (…/200-901-DEVASC-v1.1.pdf).
  - **Any rebrand (e.g. to "CCNA Automation") is not verified.**
  - Scores 2/4/3/3/3/2/3 = **20**.
- **Other CCNP concentrations** (ENARSI, ENSLD, SVPN, SISE and others) and CCNP Data Center: not fetched. [P1] notes r/ccnp requests for ENSLD and DCCORE decks.

### EC-Council (catalogue from https://cert.eccouncil.org/exam-policies.html)
- **Catalogue:** CEH, CEH (Practical), CCISO, CHFI, CND, BDC, BFC, BBLC, CCT, CCSE, ECDE, NDE, EHE, DFE, CSE, DSE, ISE, SCE, TIE, AIE, WAHS, CPENT, CNDA, CTIA, CASE, CSA, CSCU, ECES, ECSS, ECIH, CAIPM (beta), CRAGE (beta), COASP (beta), EDRP, ICS/SCADA and LPT (Master).
- **CND:** "The Certified Network Defender v3 (CND)" (eccouncil.org page). "Candidate is required to pass exam 312-38"; "Exam Duration 4 Hours; Number of Questions 100" (https://cert.eccouncil.org/certified-network-defender.html). The blueprint "CND Exam Blueprint v4.0" is at …/wp-content/uploads/2024/04/CND-Exam-Blueprint-v4.pdf.
  - Scores 1/5/4/3/3/1/3 = **20**.
- **CHFI:** "awarded after successfully passing the exam EC0 312-49"; "4 Hours; Questions 150" (https://cert.eccouncil.org/computer-hacking-forensic-investigator.html).
  - The current version number is nv on the fetched pages; GitHub repos mention "CHFI v11".
  - Scores 1/4/3/3/3/1/3 = **18**.
- **CEH:** [P1] 23. Rules stay at 3, now verified (see Rules above).

### Linux Foundation security
- **KCSA:** 6 domains: "Overview of Cloud Native Security 14%, Kubernetes Cluster Component Security 22%, Kubernetes Security Fundamentals 22%, Kubernetes Threat Model 16%, Platform Security 16%, Compliance and Security Frameworks 10%"; "Duration of Exam 90 minutes". The curriculum is at github.com/cncf/curriculum (https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/).
  - 10,000 registrations (cloud.md, from the CNCF annual report).
  - The curriculum and docs are CC BY 4.0 [RR §5].
  - Supply: thiago4go/kubernetes-security-kcsa-mock (306 stars, mock-exam web app) and aysabzevar/kcsa (28 stars, source list). No Anki deck in the top results.
  - Scores 3/4/5/5/4/4/3 = **28**. Build inside the Kubernetes family with the cloud report's CKS.
- **Other LF security certifications:** the certification catalogue lists CKS (cloud.md, 28) and CKNE ("securing… Kubernetes networking"). No other security-specific LF certification was seen (https://training.linuxfoundation.org/full-catalog/?_sft_product_type=certification).

### CMMC (the US Department of War's Cybersecurity Maturity Model Certification)
- **Programme:** "Formal implementation of the CMMC began 10 November 2025, with requirements increasing for each of the following three years to full implementation by November 2028. The program impacts more than 200,000 organizations" (CAICO FAQ).
- **Governing rule:** 32 CFR Part 170, "Cybersecurity Maturity Model Certification (CMMC) Program" (eCFR XML, `pages/ecfr_170.html`), a US-government work.
- **Administration:**
  - ISACA is the CAICO. Cyber AB "remains the accreditation body".
  - Renewals and exam processes changed from 1 April 2026 (FAQ).
  - The Cyber AB home page links "The Cyber AB's Response to the DoW's 'Reforming CMMC and Reducing Compliance Burden (RFI)'" (https://cyberab.org/), so programme change is possible.
- **CCP:** domains are "CMMC Ecosystem; CMMC-AB Code of Professional Conduct (Ethics); CMMC Governance and Source Documents; CMMC Model Construct and Implementation Evaluation; CMMC Assessment Process (CAP)". "CCP training is available through an ATP"; "CCP Questions, Answers & Explanation Database (Coming Soon)" (https://www.isaca.org/credentialing/ccp).
- **CCA:** requires the CCP, "DoD 8140.03's Work Role 612… CISA and CISM are two certifications that candidates can choose from", plus "experience, training, exam and security clearance" (FAQ).
- **Demand:**
  - r/CMMC `CCP` returned 100 posts, 62 with CCP in the title and 7 mentioning Anki, flashcards, Quizlet or decks (`rss/rss_CMMC_CCP_.xml`).
  - "Passed CCP Yesterday!" (2025-07-27) lists "CAP V5.6.1 L1&L2 AGs L1&L2 Scoping guides DFARS 7012, 7019, 7020, 7021, 7024… FAR 52.204-21… NIST SP 800-171/171A NIST SP 800-88 CoPC PocketPrep… found some quizlet sets" (https://www.reddit.com/r/CMMC/comments/1matjnl/).
  - "CCP Exam - Quizlet" (2024) asks if a Quizlet set is correct (https://www.reddit.com/r/CMMC/comments/1afqqft/).
- **Supply:** Quizlet user sets; GitHub cmmclevel/CMMC-CoPC-Flashcards (0 stars, 2024).
- **Scores:**
  - CCP: Demand 3; Gap 4; Source 5 (the study list above is almost all federal text; the CAP is a Cyber AB document with restrictive terms); Rules 3; Stability 2; Partner 2; Search 3. **22.**
  - CCA: 1/5/5/3/2/2/3 = **21**. Build as a tag on the CCP deck.
- **Family:** shares NIST SP 800-171/171A with the ISC2 NIST family.

### FedRAMP
- No individual FedRAMP certification exam was researched this pass. **Not verified.** Not scored.

### Business continuity
- **BCI CBCI:**
  - "CBCI 7.0 Certification Course… Aligned to the latest Good Practice Guidelines (GPG 7.0)… the six Professional Practices".
  - "To be eligible to register for the Online CBCI Exam, you must complete the entire CBCI Certification Course" (https://www.thebci.org/certification-training/business-continuity-certification-cbci.html).
  - GPG 7.0: "this guide will be reviewed every year… If you are a BCI Member, you can download a free PDF… Non-members can purchase" (https://www.thebci.org/certification-training/good-practice-guidelines.html).
  - Scores 2/5/1/2/3/2/3 = **18**. The source is proprietary.
- **DRII CBCP (note):** "all course, exam, and results materials are confidential and should not be shared online" (https://drii.org/certification/cbcp). Not scored.

### ISO/IEC 27001 Lead Implementer and Lead Auditor (PECB)
- **LI:** a 5-day course, "Day 5: Certification exam", with 7 competency domains including "Domain 7: Preparation for an ISMS certification audit". It refers to the "ISO/IEC 27001 Certification Scheme_v4.7" (https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27001/iso-iec-27001-lead-implementer).
- **Handbook v1.5 (©2026):** multiple-choice, "stand-alone and scenario-based questions", three options each. **Open-book**, with a hard copy of the standard allowed.
- **ISO text:** paywalled; ISO's own terms were not fetched (403).
- **Supply:** 2026 GitHub tools (WissemZD/iso27001-interactive-training, 0 stars; kleckie7/grc-learning-hub, "CISA + ISO 27001 … 501 flashcards", 1 star).
- **Scores:** LI and LA each 2/4/1/3/4/2/3 = **19**. Only feasible as original paraphrase keyed to clause numbers; the open-book format lowers value. Other issuers (e.g. other ISO 27001 LA certification bodies) were not researched.

---

## Catalogue notes (partnership-first; not scored here)
- **CompTIA:** the catalogue page links these certifications (https://www.comptia.org/en-us/certifications/):
  - Core IT: A+, a+ Cyber, a+ Network, Network+, Security+, CySA+, PenTest+, SecurityX, SecAI+, SecOT+, Linux+, Server+, Cloud+, CloudNetX, Data+, DataSys+, DataAI, Tech+, Project+, AutoOps+
  - AI Essentials line: AI Essentials, AI Fundamentals, AI Agent Essentials, AI Prompting Essentials and more
  - "Pro" line: Cyber Defense Pro, Ethical Hacker Pro, Security Pro, Client Pro, Hybrid Server Pro, Cisco Networking Pro
  - Rules 1 for all [P1: CompTIA AI and "not approved" material policy].
- **ISACA:** the credentialing page lists CISA, CISM, CRISC, CGEIT, CDPSE, CCOA, AAIA, AAISM, AAIR, **CCP and CCA (CMMC)**, CMMI credentials, COBIT certificates and the Fundamentals certificates (https://www.isaca.org/credentialing). "CISM Exam Updates Take Effect on 3 November".
  - Rules 2 [RR §4]: no ISACA content as AI input.
  - Note: CMMC CCP/CCA are ISACA-administered but built on federal sources, which is why they are scored above rather than parked.

## Not verified / not fetched
- AnkiWeb deck data for every new certification (search requires log-in).
- Search rankings for every new certification (no search engine used).
- Reddit feeds beyond the 5 listed: all IAPP regional CIPPs, CCSK/CCZT, GIAC catalogue, CWSP, Cisco CyberOps/SCOR/DevNet, EC-Council CND/CHFI, PECB, BCI.
- Holder counts for every new certification (none published on the pages read), except ISC2's 270,000+ total and the CMMC organisation count.
- CSA Security Guidance v5 PDF-specific licence; CWNP terms; ISO terms; Australian, Chinese, Singapore, Hong Kong and India law reuse terms; OWASP licence; CISA (agency) licence page.
- Current Cisco exam versions beyond the v1.1 PDFs found; the DevNet rename; CWNA-110 objectives; the CHFI version; the CCZT version date; FedRAMP.
