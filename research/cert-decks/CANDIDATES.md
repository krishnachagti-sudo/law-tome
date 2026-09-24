# Candidate certifications: the ranked list

Merged from five area reports in `candidates/`, researched 24 September 2026:
cloud, security, finance, project and business, and data, actuarial and
health. About 110 certifications were scored. Each report gives the evidence,
with a source URL, behind every score.

**How to read it.** Each certification is scored 1 to 5 on seven criteria, for
a maximum of 35:

| Criterion | What scores high |
|---|---|
| Demand | people asking for decks, candidate volume |
| Gap | little existing supply |
| Source | public sources we can write from |
| Rules | the certifying body's terms allow independent decks |
| Stability | low exam churn |
| Partner | instructors, communities or associations who could recommend a deck |
| Search | whether search is winnable |

Five different researchers scored, so treat totals within about 2 points of
each other as ties. Two things weaken the evidence:

- Reddit rate-limited many feeds, so demand evidence is thin in places; each
  report marks what it could not fetch.
- Search checks used a search tool that is not Google.

## Tier 1: build first (27 to 30)

| Certification | Score | Why |
|---|---|---|
| Scrum.org PSM I | 30 | 759,519 holders. The Scrum Guide is CC BY-SA 4.0, so cards can quote it. Unchanged since 2020. The top AnkiWeb deck has been removed. |
| IRS Enrolled Agent (SEE) | 29 | Tax law is public domain and no curriculum licence applies. No Anki deck exists. Needs an update every tax year. |
| Kubernetes KCNA | 29 | The curriculum and docs are CC BY 4.0. 31,000 registrations, up 72%. Only paid or 1-star decks exist. |
| Kubernetes CKA | 28 | 291,000 enrolments. The top AnkiWeb deck is gone. Hands-on exam, so little flashcard talk. |
| Kubernetes CKAD | 28 | An MIT-licensed exercise repo with 10,143 stars is both a source and a partner. The existing decks date from 2019 to 2023. |
| Kubernetes CKS | 28 | No CKS deck exists. 75,000 registrations. |
| Azure AZ-305 | 28 | An explicit request for flashcards, no Anki deck, CC BY docs, no retirement scheduled. |
| ISC2 CCSP | 28 | New outline from 1 August 2026. The one AnkiWeb deck is gone. NIST sources are public domain. |
| FINRA Series 7 | 28 | The highest flashcard demand in finance. Public FINRA, SEC and MSRB rules, which cards must paraphrase, not copy. |
| FINRA SIE | 28 | A co-requisite of Series 7. The free decks are stale. |
| Scrum.org PSPO I | 27 | 268,195 holders. Shares the Scrum Guide deck. |
| IAPP CIPP/E | 27 | GDPR and EU material is reusable under CC BY 4.0. No free deck exists. Thin demand evidence. |
| NASAA Series 65 | 27 | Uniform Securities Act. Active flashcard threads. |

## Tier 2: build next (25 to 26)

| Group | Certifications |
|---|---|
| Azure and Google Cloud | AZ-104 (26, the most-requested Azure deck), Google Cloud Digital Leader (26, brand-new outline), AZ-900, DP-900, AI-901 (fast churn), Google Professional Cloud Architect (25 each) |
| ISC2 and privacy | CISSP (26, highest security demand; ISC2 gives cards away free), ISC2 CC (26), SSCP (26), CIPP/US (26) |
| Securities and tax | Series 66 and 63 (26, build inside one deck with 65), CPA REG with TCP (25, public tax law) |
| Actuarial | SOA Exam P (26), SOA Exam FM (25) |
| Scrum | Scrum Alliance CSM (25, a tag on the PSM deck, not its own deck) |
| Health | NREMT EMT (25): strong demand, but every free deck predates the April 2025 redesign, and clinical accuracy needs expert review |

## Partnership first: do not publish without the body's agreement

| Body | Certifications | Blocker |
|---|---|---|
| CFA Institute | CFA Levels I to III | Only approved Prep Providers may use Learning Outcome Statements. CFA's own flashcards come with registration. |
| PMI | PMP, CAPM, PMI-ACP, PMI-RMP | The licensing guide treats flash cards, even paraphrase, as needing a licence. |
| CompTIA | Security+, CySA+, A+, Network+, PenTest+, SecurityX | The policy on unapproved and AI-made material. Candidates risk bans. |
| ISACA | CISM, CISA, CRISC | The terms ban using ISACA content as AI input. |
| AXELOS, Scaled Agile, SHRM | PRINCE2, SAFe, SHRM-CP/SCP | Name-in-title licensing, bans on competing material, or restrictive trademark terms. |
| AMA | CPC and CCS (medical coding) | Derivative use of CPT codes needs a licence. |

## Skip or wait

| Why | Certifications |
|---|---|
| Already served | AWS exams (AWSomecards covers 11, and AWS docs are personal-use only); CCNA (Jeremy's IT Lab and a highly rated AnkiWeb deck) |
| Wait for change | ACCA (new qualification from 2027); AWS Developer and SA Pro (new versions in October to November 2026); ITIL 4 (retired 31 December 2027) |
| Terms forbid | Salesforce, Snowflake, Databricks |
| Proprietary textbook sources | NASM, ACE, CSCS; FRM and CAIA readings; CFE |
| Low demand | LFCS, OSCP, GSEC, JNCIA, IBM and Google data certificates |

## Build by family, not one at a time

Decks that share sources and card designs are cheaper to build and build
topical authority together:

| Family | Decks | Shared source |
|---|---|---|
| Scrum | PSM I, PSPO I, CSM | the Scrum Guide |
| Kubernetes | KCNA, CKA, CKAD, CKS | the Kubernetes docs and the CNCF curriculum |
| Securities | SIE, Series 7, 63, 65, 66 | FINRA, SEC and NASAA rules and the Uniform Securities Act |
| US tax | Enrolled Agent, CPA REG with TCP | the Internal Revenue Code and IRS publications |
| Azure | AZ-900, AZ-104, AZ-305 | Microsoft Learn docs |
| ISC2 and privacy | CC, CCSP, SSCP, CISSP; CIPP/E, CIPP/US | NIST publications and the laws themselves |
| Actuarial | SOA P, FM | the published syllabi and public probability and finance theory |

## Open questions before building

- Demand evidence is thinnest for CIPP/E, CKS and Google Cloud Digital Leader.
  Check it before committing.
- Kubernetes exams are hands-on. Decks should cover concepts and command
  recall, and the page should say so.
- Tax and securities decks need a documented update cycle: every tax year,
  and every rule change.
- EMT decks need a qualified clinical reviewer before publishing.
