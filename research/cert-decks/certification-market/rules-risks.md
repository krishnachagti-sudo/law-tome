# Certification flashcard site: rules and risks (source report)

Researched 2026-09-23. **This is not legal advice.** It reports what published sources say, quoting the key wording exactly. Every claim links to a page fetched during this task. Raw copies (HTML/PDF plus extracted `.txt`) are in `scratchpad/certs/raw-rules/`. Quotes come from raw text taken with curl, HTML-to-text extraction, or pdftotext. Search-engine summaries were used only to find URLs and are never cited as evidence. Anything I could not read in raw text is marked **not verified**.

Bodies covered: AWS, Microsoft, Google Cloud, CompTIA, Cisco, ISC2, ISACA, Linux Foundation/CNCF, PMI, CFA Institute. Non-IT enforcement examples: ETS, ABIM, and GMAC (GMAC is not verified).

---

## 0. Findings that limit what the site can publish

1. **Every candidate agreement bans disclosing exam content, including content recalled from memory.** Microsoft's ban goes further and includes "summarize". None of these agreements prohibits independent study material built from public sources. The rules target exam questions, answers and "exam-related information" (see §1).
2. **CompTIA is the strictest about third-party material.** Its FAQ lists "Study resources that break copyright laws or aren't approved by CompTIA" as unauthorized material. It also says it "does not authorize or condone the use of artificial intelligence (AI), large language models (LLMs), or similar automated tools to generate study questions, practice exams". Its vetting blog calls a free resource a possible red flag. A free flashcard site, especially an AI-assisted one, is a prime candidate to be flagged (see §3).
3. **Trademark use is limited to plain-text, factual, nominative reference.** No logos, no "official", "approved" or "certified" claims, no marks in the site or domain name, and a non-affiliation disclaimer. Microsoft, PMI, CFA and CompTIA each prescribe specific wording (see §2).
4. **Only some documentation is openly licensed:**
   - **Openly licensed:** Kubernetes docs (CC BY 4.0), Google Cloud docs pages that carry the CC BY 4.0 footer, Microsoft docs in public MicrosoftDocs repos such as azure-docs (CC BY 4.0), and the CNCF exam curriculum (CC BY 4.0).
   - **Not openly licensed:** AWS docs (site terms allow personal use only; the CC BY-SA GitHub repos were archived in 2023), Cisco documentation, CompTIA, ISC2, ISACA, PMI and CFA site content (see §4).
5. **Exam outlines are mostly all-rights-reserved.** The CompTIA objectives PDF says "Reproduction or dissemination prohibited without the written consent of CompTIA". PMI and ISC2 carry copyright notices. The CNCF curriculum is the one openly licensed outline (see §5).
6. **CFA Institute and PMI restrict their curricula by contract.** CFA says: "Only CFA Institute Prep Providers can use Learning Outcome Statements (LOS) in their materials". Non-program use requires a paid licence. PMI's REP guide lists "Commercial products like flash cards and smartphone apps" as needing a custom licence, and says "PMI copyrighted material is not permitted for use on public websites" (see §6).
7. **Case law, in one precedent:** in *ETS v. Katzman* (3d Cir. 1986) the court was "not convinced that ETS' copyright in the text of a question precludes a coaching school from testing the same concept in the same order, as long as it does not use the same or substantially similar language". Where test-prep firms used real exam content, enforcement has meant injunctions, settlements and sanctions on candidates (see §3).

---

## 1. Candidate agreements and NDAs

### AWS: AWS Certification Program Agreement ("Last Updated: July 17, 2026")
Source: https://aws.amazon.com/certification/certification-agreement/
- Confidentiality (§1.6): "You agree that all Credential Assessment Materials are AWS Confidential Information… You may not use, disclose, reproduce, copy, transmit, distribute, or make derivative works of AWS Confidential Information in any form."
- Definition: "'Credential Assessment Materials' means any materials that are provided to you in connection with a Credential Assessment including, but not limited to, instructions, study materials, assessment questions, computer-based labs, or other content." Note that **AWS-provided "study materials" given in connection with an assessment** fall inside the confidentiality clause.
- Testing rules (§2.2): candidates will not "(b) possess, access, or use unauthorized materials including Unauthorized Content Disclosures of any Certification Exam or Credential Assessment Materials" or "(g) disclose or disseminate the content of any Certification Exam or Credential Assessment Materials".
- "'Unauthorized Content Disclosures' means any Credential Assessment Materials that are disclosed by or to anyone without the express permission of AWS including, but not limited to, Credential Assessment Materials listed on third-party websites without the express permission of AWS."
- Third-party study materials in general: no statement found in the agreement. AWS's testing-policy page says only: "We offer training and exam preparation materials on AWS Skill Builder" (https://aws.amazon.com/certification/policies/before-testing/).

### Microsoft: Certification Exam Candidate Agreement (page "Last updated on 2024-02-28")
Source: https://learn.microsoft.com/en-us/learn/certifications/microsoft-exam-non-disclosure-agreement
- "You will not and will not allow any other person or entity to distribute, copy, display, publish, **summarize**, photograph, record, download, transmit or post any exam or any exam tasks, questions, answers, computations, diagrams, drawings, worksheets or other content or exam-related information."
- Listed misconduct: "Seeking or obtaining unauthorized access to any exam or any of the following elements of an exam… (this includes using braindump material or unauthorized publication of exam questions with or without answers)"; "Using Artificial Intelligence or related products or services in any way to assist you".
- The Microsoft Credentials Program Agreement (https://learn.microsoft.com/en-us/credentials/certifications/microsoft-certification-program-agreement) defines Confidential Information to include "Program Content (including Evaluation tasks, questions, answers, computations, diagrams, drawings, worksheets, lab environments and other content and Evaluation Related information…)". Its restrictions bar anyone to "distribute, copy, display, publish, summarize… or post Licensed Content or any other Evaluation Related Information".
- Exam security policy (https://learn.microsoft.com/en-us/credentials/support/exam-and-assessment-lab-security-policies, "Last updated on 2023-10-25"): "A brain dump is a source, such as a website, that contains exam questions or assessment lab content that has been fraudulently obtained… The content included in brain dumps is exactly the same or substantially similar to what appears on the exam… Brain dump providers are in violation of Microsoft intellectual property rights and candidate agreements."
- On third-party study materials, the FAQ (https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions) says: "Microsoft does not review study materials developed by third parties and is not responsible for their content." It adds: "Microsoft exams are not intended as post-tests of any preparation or training product created by Microsoft or any third-party provider."

### Google Cloud: Exam Terms & Conditions
Source: https://cloud.google.com/certification/terms
- §3: "The content of the Exam, including questions, answers, or any communication, oral or written, regarding or related to the Exam is Google's confidential information… You may not use Exam content for any other purpose, including publishing, copying, selling, posting, downloading or transmitting any Exam content, in whole or in part".
- §5 prohibited: "vi. Share Exam content in any format (including content that you memorize) with anyone else, including through online posts, discussion groups, forums, chat rooms, or blogs"; "vii. Use or access any unauthorized Exam content shared by someone else, including content that you find online".
- §4: certifications may be used "only in accordance with the then-current Google Brand Feature Guidelines".
- Third-party prep in general: no statement found.

### CompTIA: Candidate Agreement
Source: https://www.comptia.org/en-us/resources/test-policies/comptia-candidate-agreement/
- Reporting duty (§C): candidates must report exposure to "any unauthorized training materials—including, but not limited to, 'braindumps,' leaked exam content, or any other materials that contain actual or purported CompTIA examination content… whether the exposure or use was intentional, accidental, or if you did not realize the nature of the materials until after your testing session."
- Conduct (§D): "Disseminating actual exam content by any means, including, but not limited to, web postings, formal or informal test preparation or discussion groups, chat rooms, reconstruction through memorization, study guides, or any other method." Also "Seeking and/or obtaining unauthorized access to examination materials (this includes using brain dump material…)" and "Using any AI software, program, or application to generate or recreate the examination."
- §8: "Examination Materials are the proprietary, confidential, and copyrighted materials of CompTIA."
- CompTIA's wider unauthorized-materials policy is covered in §3.

### Cisco: Certification and Confidentiality Agreement ("Version 25 September 2023", PDF)
Source: https://www.cisco.com/c/dam/en_us/training-events/downloads/certificationNDA.pdf
- Confidential Information includes "the contents of any exam and any related information including… any questions, answers, worksheets, computations, drafts, workings, drawings, diagrams, schematics, the length or number of exam segments or questions".
- §3a: "You are expressly prohibited from disclosing, publishing, reproducing, or transmitting any Confidential Information, in whole or in part, in any form or by any means".
- Exhibit 1 B: "Disseminate actual exam content in whole or in part by any means, including… formal or informal test preparation or discussion groups, chat rooms, reconstruction through memorization, study guides, or any other method"; "Seek and/or obtain unauthorized access to examination materials."
- §11.1b: "any reference by Cisco to a third party does not imply approval or endorsement of such third party by Cisco."
- The exam policies page (https://www.cisco.com/site/us/en/learn/training-certifications/exams/policies.html) says penalties "can include up to and including a lifetime ban on all future exams and the nullification of all previous certifications."

### ISC2: Exam Non-Disclosure Agreement and Examination Agreement
Sources: https://www.isc2.org/Exams/Non-Disclosure-Agreement and https://www.isc2.org/exams/exam-agreement
- NDA: "you may not disclose the Exam questions, items or answers or discuss any of the content of the Exam Materials with any person without prior written approval of ISC2"; "Not to sell, license, distribute, exchange, give away, comment or discuss the Exam Materials, questions or answers, whether before, during or after the Examination".
- Exam Agreement §2.1 defines as confidential "the specific examination items (questions) and the content, structure, and organization of the tests".
- The ISC2 member policies (https://www.isc2.org/policies-procedures/member-policies) say: "General discussions about exams that do not share specific exam items are permissible."

### ISACA: Certification Exam Candidate Guide (Version 1.26, © 2026)
Source: https://www.isaca.org/credentialing/-/media/fa494652c5f149289af38cef18328650.ashx
- Prohibited: "Giving or receiving assistance using notes, papers, or other aids; use of unauthorized study materials"; "Copying, photographing, recording, memorizing, or otherwise attempting to retain or re-create any exam content or assisting anyone in retaining, recreating, or reconstructing exam content for any purpose"; "Attempting to sell, license, distribute, exchange, give away, share, comment on, disclose, or discuss, either directly or indirectly, any exam content… including but not limited to the internet, email, or online forum".
- The guide does not define "unauthorized study materials" (no definition found in the text).

### Linux Foundation (CKA/CKAD etc.): Global Certification and Confidentiality Agreement
Source: https://docs.linuxfoundation.org/tc-docs/certification/lf-cert-agreement
- "You are expressly prohibited from disclosing, publishing, reproducing, or transmitting any exam and any related information including… questions, answers, worksheets, computations, drawings, diagrams, length or number of exam segments or questions".
- "Examination Materials are proprietary, confidential and copyrighted materials of LF (except open source code incorporated therein…)".
- Misconduct: "Seeking and/or obtaining unauthorized access to examination materials (this includes using recollections of others or materials from previous administration of any Exam, a.k.a. braindump material…)".

### PMI: Certification Handbook (revised June 2026)
Source: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/generic-certification-handbook.pdf
- The Application/Renewal Agreement "addresses discussions post-exam regarding questions. Any such discussion would be a potential violation… up to and including revocation of your certification or permanent suspension".
- "The exam, answer sheets, worksheets, and/or any other test or test-related materials remain the sole and exclusive property of PMI. These materials are confidential".
- The full Application/Renewal Agreement and PMI's Exam Security page returned HTTP 403 to my fetches. **Their wording is not verified.**

### CFA Institute: Standard VII(A)
Source: https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-vii-a
- Information that cannot be disclosed includes "specific details of questions appearing on an exam and broad topical areas and formulas tested or not tested on the exam."
- "Standard VII(A) does not prohibit candidates from discussing nonconfidential information or material with others or in study groups in preparation for an exam."
- Worked example: a candidate who emails a prep company ("CFA4Sure") the hardest questions after the exam "violated Standard VII(A)". CFA4Sure staff who solicited the questions also violated it if they are members or candidates.

---

## 2. Trademark and logo rules for certification names

### AWS: Trademark Guidelines ("Last Updated: July 17, 2026")
Source: https://aws.amazon.com/trademark-guidelines/
- §13 Fair Use: "AWS does not object to fair use of its marks by third parties, so long as the use would not be confusing for customers. Any such use should be in plain text only (no logos) and used to make true factual statements. Fair use does not permit you to state or imply affiliation, sponsorship, or endorsement by AWS." The prescribed format is "[Your Brand or Use Case] [relational phrase] [AWS Mark]", with phrases such as "for", "for use with", "compatible with".
- §7: "You will not incorporate AWS Marks into the names of your organization, products, or services".
- §11: "You will not register any domain name that contains an AWS Mark… However, you may use AWS Marks in the URL path or subdirectory (Example: www.YourDomain.com/aws) solely for content related to AWS".
- §10: no imitation of AWS "trade dress" or "look and feel".
- §14: paid search ads with AWS marks are restricted to validated AWS Partners.
- The certification agreement (§1.5) gives certified individuals, not third parties, a licence to display the credential name and badge.

### Microsoft: Trademark and Brand Guidelines, and Publications guidelines
Sources: https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks and https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/publications.aspx (reached via https://aka.ms/trademarks-publications)
- General rule: "wordmarks can be used to truthfully convey information about your product or service, as long as customers and the public will not be confused… However, our logos, app and product icons… can never be used without an express license."
- Don'ts include using Brand Assets "in the name of your business, product, service, app, domain name, social media account"; "in entertainment titles (including book, films, and magazines)"; and implying "affiliation, endorsement, sponsorship, or approval".
- Suggested footnote: "Microsoft, (list additional trademarks in alphabetical order) are trademarks of the Microsoft group of companies."
- The publications guidelines permit word marks "in the title of publications" if "Your name and logo appear more prominently than the Mark". They require a prominent disclaimer: "[Title] is an independent [publication / seminar / conference] and is neither affiliated with, nor authorized, sponsored, or approved by, Microsoft Corporation."
- The publications guidelines also forbid: "Use the Marks as the leading word or most prominent element in your publication… title"; "Use any Microsoft logos."

### Google: Brand Feature guidelines
Source: https://about.google/brand-resource-center/rules/ (Google's certification terms point to https://www.google.com/permissions/guidelines.html, which redirects to Google's brand resource centre)
- "Don't display Google Brand Features in any manner that implies a relationship with, affiliation with, sponsorship by, or endorsement by Google."
- "Don't incorporate Google Brand Features into your own product names…"; "Don't register Google trademarks as second- or third-level domain names."
- "Don't display any Google Brand Features as the most prominent element in your content."

### CompTIA: Using CompTIA Trademarks
Source: https://www.comptia.org/en-us/legal/trademarks/
- "The name of any CompTIA certification must not be without the word 'CompTIA'. For example: CompTIA A+ certified, NOT A+ certified".
- "No CompTIA Logo or Trademark may be used as a domain name or as a part of a domain name."
- "You may not use CompTIA's trademarks to promote any products or services not created by CompTIA." The same page's DO list includes: "We create our own training materials and courses to help students prepare for the CompTIA A+ certification." It also offers "This training program is aligned with the objectives validated by CompTIA [certification name]." The page is internally in tension. Only the DO examples describe independent prep materials.
- DON'T examples: "We are an authorized partner so CompTIA approves our training program"; naming a course "CompTIA A+ Certification".
- Logos: "Only authorized users can use or display a CompTIA logo". Authorized users are certified individuals, Delivery Partners and Academic Partners.

### Cisco
- The Cisco Certifications Trademark Agreement (v10, 2019) applies to certified individuals: https://www.cisco.com/c/dam/en_us/training-events/downloads/Cisco_Certifications_Logo_and_Trademark_Agreement.pdf. It says: "Do not use the Marks on or in connection with any… (c) training materials, including but not limited to, study guides, syllabi, outlines, labs, or practice tests". It also says: "Do not use the Marks in conjunction or affiliation with any training activity".
- The exam policies page lists "Improper use of CCIE logo" as suspicious activity: https://www.cisco.com/site/us/en/learn/training-certifications/exams/policies.html
- Cisco's general trademark list page (https://www.cisco.com/c/en/us/about/legal/trademarks.html) points to "www.cisco.com/go/logo". That page (https://www.cisco.com/go/logo) says logo use requires permission via ciscologos@cisco.com.
- **Not verified:** a Cisco guideline specific to third-party nominative use of certification names such as "CCNA". I did not find or fetch one.

### ISC2
Source: https://www.isc2.org/policies-procedures/member-policies
- The marks rules are addressed to certified members: "The Mark may not be used in any manner that expresses or might imply ISC2's affiliation, sponsorship, endorsement, certification, or approval, unless approved by ISC2 in writing." Also: "The respective Marks (e.g. 'CISSP' or 'SSCP', etc.) shall always be accompanied by ®".
- The site footer (e.g. https://www.isc2.org/exams/exam-agreement) states: "ISC2, CISSP, SSCP, CCSP, CGRC, CSSLP, HCISPP, ISSAP, ISSEP, ISSMP, CC, and CBK are registered marks of ISC2, Inc."

### ISACA
Source: https://www.isaca.org/terms-of-use ("Last Updated: 22 June 2026")
- "the ISACA name, logo, and trademarks… ('ISACA Marks') are the trademarks of ISACA and may not be used without permission in connection with your, or any third-party's, products or services."

### Linux Foundation / LF Projects (Kubernetes, CKA, CKAD, CKS)
Sources: https://www.linuxfoundation.org/legal/trademark-usage and https://lfprojects.org/policies/trademark-policy/
- The LF Projects list includes "Certified Kubernetes Administrator®", "Certified Kubernetes Application Developer®" and "Certified Kubernetes Security Specialist®".
- "You may make fair use of word marks to make true factual statements. But fair use does not permit you to state or imply that the owner of a mark produces, endorses, or supports your company, products, or services. Even when making fair use of a trademark, you should acknowledge the owner of the trademark with a trademark notice".
- Also: "Do not use a LF Projects logo on the cover of a book or magazine without written permission"; "A trademark should not be used as your domain name or as part of your domain name." (The last is from the LF policy.)
- CNCF brand guidelines (https://www.cncf.io/brand-guidelines/): "Please check in with us before using our logo on websites, products, packaging, manuals, or for other commercial or product use."

### PMI: Trademark Usage Guidelines (Rev. Jan 2023)
Source: https://www.pmi.org/-/media/pmi/documents/public/pdf/about/press-media/trademark-usage-guidelines-new.pdf
- "Third parties may not incorporate any PMI mark into their own product names, services, trademarks, logos, company names, domain names or URLs." Course-heading use of certification marks is allowed only for "PMI Authorized Training Partners, Registered Education Providers, colleges and universities and training centers… provided notice is given".
- "Third parties are free to use PMI word marks (i.e., not logos) to refer to PMI products and services, as long as such references are truthful, fair, and comply with these guidelines."
- "Only third parties expressly authorized by PMI (i.e., by executed written agreement) may use the PMI logo."
- Required attribution "at or near the first mention of the mark": "'PMP' is a registered mark of Project Management Institute, Inc."
- Style rules: "Use of PMP by itself is discouraged and pluralizing a certification mark, such as, 'PMPs' is incorrect."

### CFA Institute
- Prep providers (program members) must carry: "CFA Institute does not endorse, promote, review or warrant the accuracy or quality of the product and services offered by [PP]. CFA Institute®, CFA® and 'Chartered Financial Analyst®' are trademarks owned by CFA Institute." They "must NOT use the CFA Institute logo". Source: https://www.cfainstitute.org/sites/default/files/docs/programs/cfa-program/prep-provider-agreement-2027.pdf
- The prep providers page (https://www.cfainstitute.org/programs/cfa-program/prep-providers) says: "CFA logo use is forbidden by any and all prep providers."
- University trademark guidelines (https://www.cfainstitute.org/sites/default/files/-/media/documents/policy/university-partner-guidelines.pdf) allow "Our Trademarks in plain text, but not any design logos". They require the notice "_________ is a registered trademark owned by CFA Institute." They also forbid implying a program "will guarantee acceptance into or passage".
- **Not verified:** a CFA trademark guideline addressed to non-program third parties in general.

---

## 3. Policies on third-party prep and unauthorized materials, plus enforcement

### CompTIA: the strictest of the bodies surveyed
- Unauthorized Training Materials page (https://www.comptia.org/en/resources/test-policies/unauthorized-training-materials/):
  - "CompTIA defines unauthorized training materials as a source… that contains certification exam content. The content included in unauthorized training materials is exactly the same or substantially similar to questions appearing on a CompTIA certification exam."
  - Consequence: "the candidate will be banned from taking CompTIA exams for at least 12 months and lose his or her CompTIA certification… even if the candidate did not have fraudulent intentions."
  - On AI: "CompTIA does not authorize or condone the use of artificial intelligence (AI), large language models (LLMs), or similar automated tools to generate study questions, practice exams, or exam‑related content for CompTIA certifications." It warns that AI-generated material may "Include material that is identical or substantially similar to live CompTIA exam questions, even if unintentionally".
  - ATP red flags include: "Any site or training that only provides questions/answers and has no educational content" and "Any site or training that covers a wide variety of exams in different sectors and industries."
  - The page offers a URL lookup to "determine if a site is considered valid or invalid".
- FAQ (https://www.comptia.org/en-us/resources/test-policies/unauthorized-training-materials-faq/):
  - Lists as unauthorized: "Study resources that break copyright laws or aren't approved by CompTIA". Tip: "Use only study guides, books, or courses from CompTIA or official partners."
  - Q: "Can I make my own notes or join a study group?" A: "Absolutely! As long as you don't create, post, or share real exam questions or answers."
  - Enforcement: CompTIA says it will "take action to remove or block content that violates our policies".
- Vetting blog (https://www.comptia.org/en-us/blog/how-to-vet-legit-training-materials/):
  - "If a resource is free or very cheap, it may be questionable regarding quality and legitimacy."
  - "Any website that promotes extensive lists of test questions for an all-inclusive list of certifications is suspect… This could be a website or PDF file that lists everything from CompTIA, Microsoft, Cisco, and more."
  - "Legit training providers do not update their training materials until there's a new exam version".
  - A free, multi-vendor, frequently updated flashcard site matches several of these listed red flags, whatever its sourcing.

### Microsoft
- "Brain dump providers are in violation of Microsoft intellectual property rights and candidate agreements." Microsoft provides a report form. Source: https://learn.microsoft.com/en-us/credentials/support/exam-and-assessment-lab-security-policies
- "Microsoft does not review study materials developed by third parties": https://learn.microsoft.com/en-us/credentials/certifications/frequently-asked-questions

### Cisco
- Blog by Cisco's exam security team (https://blogs.cisco.com/learning/cheating-certification-exam-dumps-and-proxy-testing-behind-the-scenes-of-cisco-exam-security):
  - "a brain dump is when someone who has taken the exam remembers the specifics of a problem or section and then disseminates it online, either for sale or free… this is covered specifically by the Cisco Candidate NDA"
  - "we're also invalidating certifications for people who accessed the material and giving them lifetime bans"
  - "there are legit study resources out there"
  - "Sending an e-mail to security-tipline@cisco.com is the best way to figure out if what you're looking at… is going legit."

### ISC2
- Blog (https://www.isc2.org/Insights/2022/03/3-Myth-Busting-Facts-about-ISC2-Certification-Training): "you'll find many training companies out there offering exam prep… You might assume ISC2 endorses all of them but that's not the case". Also: "Only ISC2 and our Official Training Partners offer Official ISC2 Courseware." ISC2 warns against pass-rate guarantees: "no one knows the exact questions on the exam".

### CFA Institute
- Prep providers page: "If the provider you're considering is not listed, they are NOT a CFA Institute Prep Provider." Also: "Only CFA Institute Prep Providers can use Learning Outcome Statements (LOS) in their materials." Source: https://www.cfainstitute.org/programs/cfa-program/prep-providers
- Standard VII(A): "CFA Institute actively polices blogs, forums, and related social networking groups for dissemination of confidential information." Source: https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-vii-a

### CNCF (the permissive end)
- "CNCF encourages training companies to align their offerings to cover the contents of the curriculum." Source: https://raw.githubusercontent.com/cncf/curriculum/master/README.md

### Enforcement actions and lawsuits

| Case | What happened | Outcome | Source |
|---|---|---|---|
| **Microsoft v. Certification Trendz (TestKing)**, W.D. Wash. case 2:06-cv-01116-JLR | Suit filed Aug 2006 over the braindump site TestKing | Stipulated permanent injunction, April 2007. Terms per Network World: never "copy, use, sell, market, distribute, publish, or transfer any Microsoft Certified Exam, in whole or in part"; the domains must display "Materials do not contain actual questions and answers from Microsoft's Certification Exams". A Microsoft blog (May 10, 2007) says TestKing "agreed to immediately cease marketing, selling, distributing… any actual Microsoft Certification Exams content." | https://www.networkworld.com/article/900036/microsoft-v-testking-part-ii-has-testking-complied.html ; https://learn.microsoft.com/en-us/archive/blogs/trika/this-just-in-somewhat-recently-braindump-settlement |
| **Educational Testing Service v. Katzman (Princeton Review)**, 793 F.2d 533 (3d Cir. 1986) | A test-prep company used ETS "secure test" questions | Preliminary injunction on copyright largely affirmed. The injunction was narrowed by excising "adapting" and "or any other information". Key limit: "We are not convinced that ETS' copyright in the text of a question precludes a coaching school from testing the same concept in the same order, as long as it does not use the same or substantially similar language." Fair use rejected: "We are also unpersuaded by defendants' argument that the teaching instruction offered by Review makes 'fair use' of ETS' questions." | https://static.case.law/f2d/793/cases/0533-01.json (Caselaw Access Project) |
| **ABIM v. Arora Board Review** (E.D. Pa.) | Suit alleged "copyright infringement and theft of trade secrets"; a board review course used recalled exam questions | Court-ordered seizure on Dec 7, 2009; "On December 23, the court entered a preliminary injunction against all defendants." A later settlement included a permanent injunction, per Plagiarism Today. ABIM sanctioned about 139 physicians. | https://www.prnewswire.com/news-releases/american-board-of-internal-medicine-files-complaint-against-arora-board-review-rajender-arora-md-and-anise-kachadourian-md-80729427.html ; https://www.plagiarismtoday.com/2026/01/28/a-15-year-long-fight-over-exam-questions/ |
| **ABIM v. Salas-Rushford** (3d Cir., Jan 2026; 1st Cir., Aug 2024) | ABIM sued a doctor who emailed recalled questions to Arora | ABIM **lost** the copyright claim. Per Bloomberg Law, "ABIM failed to establish that Dr. Jaime Salas Rushford had accessed and copied 2007 and 2008 test materials". Also, "The board also failed to register its 2009 test questions before the alleged infringement occurred, ruling out any potential award of statutory damages". ABIM's suspension of his certification was upheld. | https://news.bloomberglaw.com/ip-law/medical-boards-loss-upheld-in-test-question-copyright-appeal ; https://www.plagiarismtoday.com/2026/01/28/a-15-year-long-fight-over-exam-questions/ |
| **GMAC v. Lei Shi (Scoretop.com)** (E.D. Va., 2008) | Reported $2.3M default judgment over live GMAT questions | **Not verified.** The GMAC press-release pages (gmac.gcs-web.com) failed to load: connection reset or timeout. The figure appears only in search-result snippets. | — |

No lawsuit was found against a publisher of **independent** (non-leaked) study material for any of the ten bodies. That is a search result, not proof that none exists.

---

## 4. Licences for vendor documentation (can docs be quoted or adapted into flashcards?)

| Source | Licence as published | Notes | URL |
|---|---|---|---|
| **Kubernetes docs** (kubernetes.io) | Footer: "© 2026 The Kubernetes Authors \| Documentation Distributed under CC BY 4.0". The repo LICENSE is "Attribution 4.0 International". | Trademark policy: "For website terms of use, trademark policy and other project policies please see https://lfprojects.org/policies/" | https://kubernetes.io/docs/home/ ; https://raw.githubusercontent.com/kubernetes/website/main/LICENSE |
| **CNCF exam curricula** (CKA, CKAD, CKS, KCNA…) | "The Curriculum is available under the CC-BY 4.0+ License" | — | https://raw.githubusercontent.com/cncf/curriculum/master/README.md |
| **Google Cloud / Google Developers docs** | Page footer: "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License." | Site Policies (cloud.google.com/site-policies redirects to developers.google.com/terms/site-policies) say: "Google's trademarks and other brand features are not included in this license." Images, audio and video are "not covered by the license, unless specifically noted." Suggested attribution: "Portions of this page are modifications based on work created and shared by Google and used according to terms described in the Creative Commons 4.0 Attribution License." | https://cloud.google.com/compute/docs/overview ; https://developers.google.com/site-policies |
| **Microsoft docs** (MicrosoftDocs/azure-docs) | "Microsoft and any contributors grant you a license to the Microsoft documentation and other content in this repository under the Creative Commons Attribution 4.0 International Public License… and… any code in the repository under the MIT License". Also: "The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks." | Licensing is per repository; only azure-docs was checked. The Learn Terms of Use default is "Unless otherwise specified, the Services are for your personal and non-commercial use". They also say "Certain documentation may be subject to explicit license terms separate from the terms contained here." | https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/main/ThirdPartyNotices.md ; https://learn.microsoft.com/en-us/legal/termsofuse |
| **Microsoft exam study guides** (e.g. AZ-900 "Skills measured") | No CC notice on the page (0 matches for "Creative Commons"); footer "© Microsoft 2026" | Page metadata names the source as `MicrosoftDocs/learn-certs-pr`. The raw file at that path returned **404** anonymously. No public licence was found, so the Learn ToU default (personal, non-commercial) appears to apply. **Not verified** whether the repo is private. | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900 |
| **AWS docs** (docs.aws.amazon.com) | Site Terms ("Last Updated: June 4, 2025"): "AWS grants you a limited license to access and make personal use of the AWS Site and not to download… or modify it… This license does not include any resale or commercial use… any derivative use of the AWS Site or its contents". Trademark Guidelines §15: "In most cases, AWS does not provide licenses or other authorization for use of AWS content in third party publications, including screenshots, diagrams, code, documentation… However, AWS does not object to limited fair use of such materials for educational or non-profit purposes." | The old GitHub copies were CC BY-SA 4.0 (e.g. "The documentation is made available under the Creative Commons Attribution-ShareAlike 4.0 International License"). AWS announced on 17 May 2023: "we will archive most of the repos starting the week of June 5th". The archive notice says "the content on this branch is out of date". No CC notice was found on current docs pages checked. | https://aws.amazon.com/terms/ ; https://aws.amazon.com/trademark-guidelines/ ; https://raw.githubusercontent.com/awsdocs/amazon-s3-userguide/main/README.md ; https://aws.amazon.com/blogs/aws/retiring-the-aws-documentation-on-github/ |
| **Cisco** documentation and white papers | Copyright Use policy: "Cisco does not generally license these materials for reproduction or distribution for commercial purposes… Instead, Cisco encourages and specifically authorizes parties to 'deep link'". On product docs: "Except as described above, no permission or license is given to reproduce or distribute copies of Cisco product documentation for sale to the general public or for any other purpose." Screen captures are allowed with conditions: "No more than five (5) screen captures may be used in any single document, page or other work". | Site terms: "Cisco grants you a limited, revocable, nonsublicensable right to view the Site Content solely for your internal use of the Site." | https://www.cisco.com/c/en/us/about/brand-center/copyright-use.html ; https://www.cisco.com/c/en/us/about/legal/terms-conditions.html |
| **CompTIA** site | "You may not modify, copy, reproduce, republish, upload, post, transmit, perform, display, prepare derivative works based on, or distribute in any way any portion of the Services" | — | https://www.comptia.org/en-us/legal/terms-of-use/ |
| **ISC2** site | Footer: "All contents of this site constitute the property of ISC2, Inc. and may not be copied, reproduced or distributed without prior written permission." | — | https://www.isc2.org/exams/exam-agreement |
| **ISACA** site | "no license to use, copy, distribute, republish, transmit or otherwise exploit any ISACA Content is given to you". Also: "You are prohibited from using any ISACA Content or the Services as an input into AI or AI-powered tools". | Relevant if AI is used to draft cards from ISACA pages. | https://www.isaca.org/terms-of-use |
| **CFA Institute** site | "CFA Institute authorizes you to view and download a single copy of the material on this website solely for your personal, noncommercial use… You may not… reproduce, display, publicly perform, distribute, or otherwise use the material in any way for any public or commercial purpose." | — | https://www.cfainstitute.org/about/governance/policies/terms-conditions |

CC BY 4.0 requires attribution. Google's and Microsoft's grants both exclude trademarks.

---

## 5. Exam outline documents

| Body | Notice on the outline | URL |
|---|---|---|
| CompTIA (Security+ SY0-701 objectives v5.0) | "Copyright © 2023 CompTIA, Inc. All rights reserved." Also: "Reproduction or dissemination prohibited without the written consent of CompTIA, Inc." Caveat: the copy was fetched from a Contentful CDN URL (assets.ctfassets.net). That it is hosted by CompTIA is **not verified**, but the document carries CompTIA's own notices. | https://assets.ctfassets.net/82ripq7fjls2/6TYWUym0Nudqa8nGEnegjG/0f9b974d3b1837fe85ab8e6553f4d623/CompTIA-Security-Plus-SY0-701-Exam-Objectives.pdf |
| PMI (PMP ECO 2026) | "© 2026 Project Management Institute, Inc. All rights reserved." Also: "'PMI', the PMI logo, and 'PMP' are marks of Project Management Institute, Inc." | https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf |
| ISC2 (CISSP outline, effective April 15, 2024) | The PDF text layer has no copyright line (none found by pdftotext). The hosting web page carries "© Copyright 1996-2026. ISC2, Inc. All Rights Reserved." and the no-copying footer. | https://www.isc2.org/certifications/cissp/cissp-certification-exam-outline |
| ISACA (Candidate Guide, which includes content outlines) | "® 2026 ISACA. All Rights Reserved." on each page | https://www.isaca.org/credentialing/-/media/fa494652c5f149289af38cef18328650.ashx |
| Google Cloud (PCA exam guide PDF) | No copyright or licence line in the extracted text. The certification page has no CC notice. With no licence, the default is all rights reserved (general copyright principle, not stated by Google). | https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf |
| AWS (SAA-C03 exam guide, now on docs.aws.amazon.com) | No CC notice. Covered by the AWS Site Terms (§4). | https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html |
| Microsoft (study guides) | "© Microsoft 2026". No open licence found (§4). | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900 |
| Cisco (CCNA 200-301 v1.1 exam topics PDF) | No copyright line in the extracted text. Cisco site terms apply to cisco.com content. | https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf |
| CNCF (CKA, CKAD etc.) | CC BY 4.0 | https://raw.githubusercontent.com/cncf/curriculum/master/README.md |
| CFA (LOS) | Only program members may use LOS; see §6 | https://www.cfainstitute.org/programs/cfa-program/prep-providers |

No body other than CNCF publishes a licence that permits reproducing its objectives list. CompTIA alone states an explicit prohibition on reproduction. I found no body stating that paraphrasing or referencing outline topics is prohibited. The ETS v. Katzman quote in §3 concerns questions, not outlines.

---

## 6. Proprietary curricula (CFA, PMI, ISC2 CBK)

### CFA Institute
- "Only CFA Institute Prep Providers can use Learning Outcome Statements (LOS) in their materials." Source: https://www.cfainstitute.org/programs/cfa-program/prep-providers
- The Prep Provider Agreement for Curriculum Year 2027 (https://www.cfainstitute.org/sites/default/files/docs/programs/cfa-program/prep-provider-agreement-2027.pdf) sets these terms for members:
  - Members may include "unaltered content from the Curriculum in your materials up to a limit of 20% of the relevant Curriculum".
  - Members "may NOT make any use whatsoever of CFA Program Practical Skills Modules or any mock exams".
  - Members are "required to reproduce/reprint the unaltered Learning Outcome Statements".
  - Fees for curriculum year 2027 start at "US$3,100" (revenue "<US$0.1M") and rise to "US$163,700" (">US$5M").
  - Members are "not permitted to use the following words: 'Official'; 'Approved'; 'Affiliated' or 'Preferred'" (subject to clause 2.8).
  - Liquidated damages of "US$ 100,000" apply for breaching confidentiality of early curriculum access.
- Copyright permissions page (https://www.cfainstitute.org/about/governance/policies/copyright-permissions-reprints): requests for "curriculum content such as Readings, Learning Outcome Statements, and End of Reading Questions" go through a request form. It also says: "Material should not be posted on any online programs with free open access given to the public" and "Previous year's Level III essay questions and answers should not be incorporated into any mock exam, question bank, or study materials".
- Best-practices document (https://www.cfainstitute.org/sites/default/files/docs/programs/cfa-program/app-website-2024-best-practices-76.pdf): mandatory wording is "Studying the curriculum issued by CFA Institute is essential to success. Prep provider courses and materials are developed to complement the curriculum". Providers "shall NOT ask candidates to share test questions or topics… after an exam".
- **Implication, from the sources above:** reproducing LOS text or curriculum text requires the paid agreement. What can be built independently is not stated by CFA. No page says CFA objects to original explanations of finance concepts, and none says CFA permits them.

### PMI
- R.E.P. IP guide (Version 1.1, November 2017; the R.E.P. programme may since have been renamed, so this is an older document): https://www.pmi.org/-/media/pmi/documents/public/pdf/learning/rep/intellectual-property-guidelines-rep-tutorial.pdf
  - "PMI copyrighted material is not permitted for use on public websites."
  - A Custom Level IP License is needed for "Commercial products like flash cards and smartphone apps sold outside of the classroom".
  - "An excerpt is text (up to 650 words) taken from one section of a PMI publication."
  - "Instances of paraphrasing count as excerpts when determining the licensing requirements".
  - R.E.P.s "may use an unlimited number of terms from the PMBOK® Guide glossary" under their licence.
  - "Use of content beyond your selected license option without permission from PMI is copyright infringement".
- **Implication:** PMI treats paraphrase of PMBOK® Guide text as licensable use. That position comes from a guide written for its licensees.
- PMI's permissions pages (pmi.org/permissions and /permissions/faq) returned 403. **Their current terms are not verified.**

### ISC2 CBK
- "CBK" is a registered mark (site footer). The Myth-Busting blog says: "Because ISC2 is the creator of the CISSP CBK®, our authorized educators always have access to the most current course materials. Only ISC2 and our Official Training Partners offer Official ISC2 Courseware." Source: https://www.isc2.org/Insights/2022/03/3-Myth-Busting-Facts-about-ISC2-Certification-Training
- I found no ISC2 document licensing CBK content to third parties. The site footer's no-copying notice applies to site content.

### ISACA (review manuals, COBIT)
- "When content from COBIT 2019 is sold, given to third parties and or used in commercial works or products… an annual license from ISACA is required." Source: https://isaca.org/why-isaca/about-us/intellectual-property-and-licensing

---

## 7. Not verified or not found

- GMAC v. Scoretop outcome: the GMAC press pages would not load.
- PMI's current Permissions FAQ, Exam Security page and Certification Application/Renewal Agreement text: all returned HTTP 403.
- Whether `MicrosoftDocs/learn-certs-pr` (the source of the study guides) is private: raw path 404; GitHub web pages return 403 through this proxy.
- A Cisco third-party nominative-use guideline for certification names.
- A CFA trademark guideline for non-program third parties.
- AWS's licence for current docs.aws.amazon.com pages beyond the general Site Terms. No page-level licence was found.
- Current ISC2 and Cisco exam-outline copyright text beyond what is quoted above.

## 8. Raw files
All fetched pages are saved in `scratchpad/certs/raw-rules/`. File names are the URL with non-alphanumerics replaced by `_`. Each page is kept as the original `.html` or PDF plus an extracted `.txt`. The fetch helper is `raw-rules/fr.py`.
