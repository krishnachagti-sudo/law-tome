# Content policy

What the site may build decks from, how it may name exams, and what it never
does. It is written to be published, almost as is, as a trust page. Draft 1,
24 September 2026.

**This is not legal advice.** It records what the certifying bodies' own terms
say, with sources in `certification-market/rules-risks.md`. Before any deck
names a CompTIA, CFA, PMI, ISACA or Cisco exam, a lawyer should review the
trademark and disclaimer wording.

## 1. What we publish

- Flashcard decks and the readable pages that go with them. Every card cites
  its source, and every deck has a version number and a public changelog.
- **Free.** No paywall, no account, no email gate.
- **Licence:** decks and pages are CC BY-SA 4.0. That is compatible with the
  openly licensed sources we use: CC BY 4.0 (Kubernetes, CNCF, Google, the
  Microsoft azure-docs repository) and CC BY-SA 4.0 (the Scrum Guide). It also
  lets anyone share and adapt the decks, provided they credit the source and
  keep the same licence.

## 2. What we never do

1. **No exam content, ever.** No questions recalled from an exam, no "dumps",
   and nothing a candidate shares after sitting an exam. Every candidate
   agreement we read forbids disclosing exam content. Microsoft's forbids
   even summarising it. We never ask for it, and we remove anything reported
   as exam content the same day.
2. **No proprietary curricula.** We never use a body's paid curriculum,
   textbook, question bank or prep-provider material: CFA readings or Learning
   Outcome Statements, the PMBOK Guide text, ISC2's CBK books, CompTIA
   CertMaster, or any vendor's paid training.
3. **We never copy exam outlines,** except where the outline itself is openly
   licensed. The CNCF curriculum is, "under the CC-BY 4.0+ License". Every
   other outline we checked is all rights reserved. The CompTIA objectives
   say "Reproduction or dissemination prohibited without the written consent
   of CompTIA". So we link to an outline and describe our coverage in our own
   topic labels.
4. **No logos, no "official", no "approved", no "certified"** claims, and no
   exam marks in the site name, the deck names as a product brand, or the
   domain.
5. **We never feed ISACA content into AI tools.** ISACA's terms forbid it:
   "You are prohibited from using any ISACA Content or the Services as an
   input into AI or AI-powered tools".
6. **No paid search ads using a vendor's marks.** AWS limits these to
   validated partners.
7. **We never call practice cards "real questions",** except where the real
   question pool is public. See §3, tier A.

## 3. Sources, in four tiers

| Tier | What | How we may use it | Examples |
|---|---|---|---|
| **A. Public-domain question pools** | Question pools the body itself releases into the public domain | Cards may use the real pool questions, cited to the pool | FCC amateur radio pools (Technician, General, Extra), released "into the public domain" |
| **B. Open licence** | CC BY, CC BY-SA, or public domain | Quote and adapt, with attribution per the licence | Kubernetes docs and the CNCF curriculum (CC BY 4.0); Google Cloud docs pages that carry the CC BY 4.0 footer; Microsoft's azure-docs repository (CC BY 4.0); the Scrum Guide (CC BY-SA 4.0); US federal works such as NIST publications, FAA handbooks, IRS publications and the Internal Revenue Code; EU legislation |
| **C. Facts only** | Readable, but licensed for personal use or all rights reserved | Facts in our own words, linked to the page, never copied. Facts are not protected; wording is. The one court precedent we found, *ETS v. Katzman* (3d Cir. 1986), declined to stop a coaching school "testing the same concept in the same order, as long as it does not use the same or substantially similar language". | AWS docs (Site Terms: personal use only; AWS "does not object to limited fair use… for educational or non-profit purposes"); Cisco docs; FINRA and SEC rule pages (paraphrase the rule; cite the rule number); Microsoft Learn pages outside openly licensed repositories; the FAA question bank (confidential), so FAA decks come from the handbooks instead; state CDL manuals (© AAMVA), so CDL decks come from 49 CFR |
| **D. Never** | Exam content, proprietary curricula, anything whose terms forbid derivative use | Not used at all | Everything in §2, plus Salesforce Trailhead content (treated as confidential by its programme terms), and Snowflake and Databricks docs (site terms forbid derivative works) |

**Every card records its source tier in `SourceLicence`.** The card checker
refuses a tier-D source.

## 4. How exams are named

**The general rule:** name an exam only to state a true fact about what the
deck covers.
- Plain text, never a logo.
- Our brand always leads, never the exam mark.
- A non-affiliation disclaimer on every deck page.

This follows the published guidelines:
- **AWS:** fair use "in plain text only (no logos)", "to make true factual
  statements", in the form "[Your Brand] [relational phrase] [AWS Mark]",
  e.g. "for".
- **Microsoft:** the mark must not be "the leading word or most prominent
  element" of the title.
- **Google:** never "the most prominent element" of the content.
- **Linux Foundation:** "fair use of word marks to make true factual
  statements", with a trademark notice.

### Title pattern

For example: `[Site name] deck for the Certified Kubernetes Administrator
(CKA) exam`. Not: "CKA Flashcards", and never "Official CKA deck".

A URL path such as `/decks/kubernetes/cka/` is acceptable. AWS, for example,
allows its marks "in the URL path or subdirectory… solely for content related
to AWS". Never in a domain name.

### Required notices

These appear in the deck page footer, verbatim where a body prescribes the
wording:

| Body | Notice |
|---|---|
| Microsoft | "[Deck title] is an independent publication and is neither affiliated with, nor authorized, sponsored, or approved by, Microsoft Corporation." Plus "Microsoft, [marks] are trademarks of the Microsoft group of companies." |
| PMI (once cleared, §5) | "'PMP' is a registered mark of Project Management Institute, Inc." Never "PMP" alone, never plural. |
| ISC2 | Marks with ®, plus "ISC2, CISSP, SSCP, CCSP… are registered marks of ISC2, Inc." |
| CompTIA (once cleared, §5) | Always "CompTIA" before the certification name; alignment wording only in the forms CompTIA's own guidance shows. |
| Everyone else | "[Exam] is a trademark of [owner]. This deck is independent and is not affiliated with, sponsored, endorsed or approved by [owner]." |

## 5. Bodies we don't name yet

For the bodies below, a deck aimed at their exam is published only as a
**subject deck** until they agree in writing. A subject deck:
- is built from tier B and C sources only;
- makes no claim to cover the exam;
- carries no mapping to the body's outline or learning objectives (`ExamRefs`
  stays empty; the card checker enforces this);
- does not use the exam name in its title.

When a body agrees, the deck gets the exam name, the prescribed notices and
an outline mapping.

| Body | Why | Subject deck in the meantime (examples) |
|---|---|---|
| CFA Institute | "Only CFA Institute Prep Providers can use Learning Outcome Statements (LOS) in their materials" | Investment and corporate-finance fundamentals from open sources |
| PMI | Its licensing guide lists "Commercial products like flash cards and smartphone apps" as needing a custom licence, and counts paraphrase as licensable use | Project-management fundamentals from open sources |
| CompTIA | Lists "Study resources that… aren't approved by CompTIA" as unauthorised; does "not authorize or condone" AI-generated study material; candidates caught using unauthorised material lose certification and are banned for at least 12 months | Networking and security fundamentals from RFCs and NIST |
| ISACA | Marks "may not be used without permission"; no ISACA content as AI input | Audit and governance fundamentals from public frameworks |
| Cisco | Its trademark agreement bars its marks on "training materials" | Networking fundamentals from RFCs |
| AXELOS/PeopleCert (PRINCE2, ITIL), Scaled Agile (SAFe), SHRM | Name-in-title licensing, bans on competing training material, or restrictive trademark terms | Only where open sources cover the subject |
| AMA (CPT codes: medical coding) | Derivative use of CPT codes needs a licence | None until licensed |

**CompTIA needs extra care.** Because CompTIA decides what counts as
unauthorised, and the candidate bears the penalty, we do not market any deck
to CompTIA candidates until CompTIA has agreed.

## 6. How the cards are made, and the part AI plays

Stated publicly on every deck page:

- Cards are drafted with AI assistance, **only from the public sources listed
  on each card.**
- Every card cites its exact source section.
- A second, independent pass re-checks every card against its source, and a
  person reviews every card before release.
- **No card is generated from, or checked against, exam content.** No AI tool
  is asked to produce "likely exam questions".

This is our answer to the concern CompTIA states: that AI output may "Include
material that is identical or substantially similar to live CompTIA exam
questions, even if unintentionally". Our cards are built from the documentation
up, never from the exam down.

## 7. Corrections and removal

- Anyone can report an error. A correction ships as a patch release with a
  changelog entry crediting the reporter, if they wish.
- A certifying body that believes a deck breaches its terms gets a reply and
  a review within a set time. A deck that does breach them is withdrawn.
- A report that a card matches live exam content triggers immediate removal
  and a review of how the card was sourced.

## 8. Before launch

- A lawyer reviews §4 and §5.
- Re-check each body's trademark and disclaimer wording against its current
  page. These pages change; AWS's guidelines were updated on 17 July 2026.
- Confirm the tier of every source a deck family uses, before the family is
  built.
