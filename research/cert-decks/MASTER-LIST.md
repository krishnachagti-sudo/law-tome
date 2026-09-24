# Master list of candidate exams

Every scored exam from both research passes, merged, de-duplicated and ranked: **392 exams**. Built on 24 September 2026 from the eleven reports in `candidates/` and `candidates-longtail/`. The evidence and source URL behind every score are in the report named in each row. The same data, including each researcher's original family label, is in `master-list.csv`.

## How to read it

**Scores.** Each exam is scored 1 to 5 on seven criteria, maximum 35:

| Column | Criterion | What scores high |
|---|---|---|
| D | Demand | people asking for decks, candidate volume |
| G | Gap | little existing supply |
| S | Source | public or open sources to write from |
| R | Rules | the certifying body's terms allow independent decks |
| St | Stability | low exam churn |
| P | Partner | instructors, communities or associations who could recommend a deck |
| Se | Search | whether search is winnable |

Eleven researchers scored, so treat totals within about 2 points as ties.

**Status:**

- **Build:** can be built now under the content policy.
- **Partnership first:** the body restricts third-party material (CFA Institute, PMI, CompTIA, ISACA, Cisco, PeopleCert, Scaled Agile, SHRM, IIBA, IASSC, AMA coding). Only an unnamed subject deck until they agree.
- **Skip or wait:** retiring, just released, already well served, essay or hands-on only, or no demand.
- **Terms forbid:** Salesforce, Snowflake, Databricks.
- **Not a deck target:** a course credential with no exam.

**Tiers (Build only):** A 27–35, B 24–26, C 20–23, D under 20.

**Band** comes from the Demand score alone: head = 5, medium = 3–4, long tail = 1–2. It is a rough guide to audience size, not a measured one.

**Known gaps in the evidence:**

- AnkiWeb search needed a login for most of the long-tail pass, so many Gap scores rest on GitHub, Reddit and Brainscape only. Check AnkiWeb by hand before building a family.
- The search checks used a search tool that is not Google, and many long-tail Search scores are neutral estimates.
- Reddit rate-limited several demand checks.

## Totals

| Status | Exams |
|---|---|
| Build | 307 |
| Partnership first | 44 |
| Skip or wait | 30 |
| Not a deck target | 7 |
| Skip (terms forbid derivative use) | 4 |

| Build tier | Exams |
|---|---|
| A | 34 |
| B | 86 |
| C | 156 |
| D | 31 |

| Band (all exams) | Exams |
|---|---|
| head | 21 |
| medium | 96 |
| long tail | 275 |

## Families to build (Build status only)

Build family by family: one research effort on the shared sources serves every deck in the family. Families are sorted by how many tier A and B decks they hold.

| Family | Decks | A | B | C | D | Best exam (score) |
|---|---|---|---|---|---|---|
| Securities (FINRA/NASAA/MSRB) | 25 | 5 | 16 | 4 | 0 | FINRA SIE (28) |
| Kubernetes & CNCF | 15 | 9 | 6 | 0 | 0 | Kubernetes & Cloud Native Associate (29) |
| Microsoft | 43 | 1 | 12 | 30 | 0 | Designing Azure Infrastructure Solutions (28) |
| Scrum & Kanban (open guides) | 13 | 3 | 6 | 4 | 0 | Scrum.org PSM I (30) |
| Actuarial (SOA/CAS) | 13 | 0 | 9 | 3 | 1 | CAS Exam 5 (Basic Ratemaking and Estimating Claim Liabilitie (26) |
| FAA aviation | 12 | 3 | 3 | 5 | 1 | FAA Remote Pilot / Part 107 (UAG) (28) |
| ISC2 / NIST | 9 | 1 | 5 | 3 | 0 | CCSP (ISC2) (28) |
| GitHub | 6 | 1 | 4 | 1 | 0 | GitHub Foundations (27) |
| US tax | 4 | 2 | 2 | 0 | 0 | IRS Enrolled Agent (SEE) (29) |
| Government safety & trades | 8 | 2 | 2 | 3 | 1 | EPA Section 608 (Core, Type I/II/III, Universal) (27) |
| Privacy (IAPP) | 9 | 1 | 3 | 5 | 0 | CIPP/E (IAPP) (27) |
| Software testing & requirements | 4 | 1 | 2 | 1 | 0 | ISTQB Certified Tester Foundation Level (CTFL v4.0.1) (29) |
| FCC radio | 6 | 2 | 1 | 3 | 0 | FCC Amateur Technician (Element 2, 2026–2030 pool) (28) |
| US consumer finance & banking | 2 | 1 | 1 | 0 | 0 | NMLS SAFE MLO Test (27) |
| Google Cloud | 15 | 0 | 2 | 12 | 1 | Cloud Digital Leader (26) |
| State insurance | 3 | 0 | 2 | 1 | 0 | State insurance: Life & Health producer (national general +  (26) |
| Cloud Security Alliance | 2 | 0 | 2 | 0 | 0 | CCSK v5 (CSA) (25) |
| EMS | 4 | 0 | 2 | 2 | 0 | NREMT EMT (25) |
| LPI | 8 | 0 | 2 | 6 | 0 | LPI Linux Essentials (25) |
| Public-list (civics) | 1 | 1 | 0 | 0 | 0 | US Civics test (2025 version) *(not a certification) (28) |
| IT service | 2 | 1 | 0 | 0 | 1 | KCS v6 Fundamentals (Consortium for Service Innovation), a n (27) |
| Engineering | 1 | 0 | 1 | 0 | 0 | NCEES FE (Fundamentals of Engineering) (24) |
| GIAC | 4 | 0 | 1 | 3 | 0 | GSEC (GIAC) (24) |
| HashiCorp | 3 | 0 | 1 | 2 | 0 | Terraform Associate (24) |
| Quality & Six Sigma | 18 | 0 | 1 | 16 | 1 | ASQ CSSGB (+ generic LSS GB) (24) |
| Data / programming | 1 | 0 | 0 | 1 | 0 | SAS Base Programming Specialist (A00-231) (23) |
| EC-Council | 3 | 0 | 0 | 2 | 1 | CEH (EC-Council) (23) |
| FRM | 2 | 0 | 0 | 2 | 0 | FRM Part I (23) |
| Financial planning | 1 | 0 | 0 | 1 | 0 | CFP (23) |
| GitLab | 1 | 0 | 0 | 1 | 0 | GitLab certifications (catalogue not captured) (23) |
| NFA/CFTC | 2 | 0 | 0 | 2 | 0 | NFA Series 3 (23) |
| Pharmacy | 1 | 0 | 0 | 1 | 0 | PTCB CPhT (PTCE) (23) |
| Programming | 3 | 0 | 0 | 3 | 0 | Python Institute PCAP-31-03 (new version due Q3 2026) (23) |
| Accounting bodies | 2 | 0 | 0 | 1 | 1 | CMA (IMA) (22) |
| Allied health | 6 | 0 | 0 | 5 | 1 | ARRT Radiography (content spec implemented 2022) (22) |
| Audit (IIA) | 2 | 0 | 0 | 1 | 1 | CIA (IIA) (22) |
| Kafka | 2 | 0 | 0 | 2 | 0 | Confluent Certified Developer for Apache Kafka (22) |
| Legal support | 3 | 0 | 0 | 3 | 0 | California Notary Public exam (state; a model for other stat (22) |
| Neo4j | 1 | 0 | 0 | 1 | 0 | Neo4j Certified Professional (22) |
| Programming / data | 1 | 0 | 0 | 1 | 0 | Oracle Database SQL (1Z0-071) (22) |
| US pension law | 1 | 0 | 0 | 1 | 0 | Joint Board Enrolled Actuary exams (22) |
| Wine | 3 | 0 | 0 | 3 | 0 | CMS Introductory Sommelier (22) |
| Wireless | 2 | 0 | 0 | 2 | 0 | CWSP (CWNP) (22) |
| AML | 2 | 0 | 0 | 2 | 0 | ABA CAFP (21) |
| AWS | 1 | 0 | 0 | 1 | 0 | AWS Certified Data Engineer Associate (21) |
| CPA | 3 | 0 | 0 | 3 | 0 | CPA AUD (21) |
| Food safety | 1 | 0 | 0 | 1 | 0 | ServSafe Manager (Food Protection Manager) (21) |
| HR | 1 | 0 | 0 | 1 | 0 | HRCI PHR (with SPHR) (21) |
| LF-other | 3 | 0 | 0 | 3 | 0 | LF Certified IT Associate (21) |
| PythonInst | 2 | 0 | 0 | 2 | 0 | PCAP Certified Associate in Python Programming (21) |
| USCG-Merchant-Mariner | 1 | 0 | 0 | 1 | 0 | USCG OUPV / Master (≤100 GT) (21) |
| Building / green | 1 | 0 | 0 | 1 | 0 | LEED Green Associate (20) |
| Data | 1 | 0 | 0 | 1 | 0 | INFORMS CAP (now CAP-Essentials / Pro / Expert) (20) |
| Hands-on | 1 | 0 | 0 | 1 | 0 | OSCP+ (OffSec) (20) |
| Medical assisting | 1 | 0 | 0 | 1 | 0 | AAMA CMA (medical assistant); lightly researched (20) |
| RedHat | 1 | 0 | 0 | 1 | 0 | Red Hat Certified System Administrator (20) |
| Data management | 1 | 0 | 0 | 0 | 1 | DAMA CDMP (DMBOK-based) (19) |
| Enterprise architecture | 1 | 0 | 0 | 0 | 1 | TOGAF Enterprise Architecture Foundation (OGEA-101) (19) |
| ISO management | 3 | 0 | 0 | 0 | 3 | ISO/IEC 27001 Lead Auditor (PECB) (19) |
| Language | 1 | 0 | 0 | 0 | 1 | ATA translation certification (performance exam) (19) |
| Nursing (skip) | 1 | 0 | 0 | 0 | 1 | NCLEX-RN / NCLEX-PN (licensure; for completeness) (19) |
| Real estate | 1 | 0 | 0 | 0 | 1 | Real-estate salesperson licence (state exams); lightly resea (19) |
| UK FCA | 2 | 0 | 0 | 0 | 2 | CII (UK, R01-type regulation units) (19) |
| Fitness | 3 | 0 | 0 | 0 | 3 | NASM CPT (18) |
| Medical (skip) | 1 | 0 | 0 | 0 | 1 | NCCPA PANCE (licensure-adjacent) (18) |
| Supply chain | 2 | 0 | 0 | 0 | 2 | ASCM CPIM / CSCP / CLTD (18) |
| Treasury | 1 | 0 | 0 | 0 | 1 | AFP CTP / FPAC (18) |
| CAIA | 1 | 0 | 0 | 0 | 1 | CAIA (17) |
| Fraud (ACFE) | 1 | 0 | 0 | 0 | 1 | CFE (ACFE) (17) |
| Data certificates | 1 | 0 | 0 | 0 | 1 | IBM Data Science Professional Certificate (16) |
| Resuscitation (skip) | 1 | 0 | 0 | 0 | 1 | AHA BLS / ACLS / PALS (course cards, not a proctored exam) (16) |

## Build, Tier A: build first (27–35)

| # | Exam | Family | Tier | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Scrum.org PSM I | Scrum & Kanban (open guides) | A | **30** | 5 | 4 | 5 | 4 | 5 | 3 | 4 | head | Build first | long tail: agile-business |
| 2 | IRS Enrolled Agent (SEE) | US tax | A | **29** | 3 | 5 | 5 | 5 | 3 | 4 | 4 | medium | Best fit. Public-domain law, no curriculum licence, no free Anki deck exists. | first pass: finance |
| 3 | ISTQB Certified Tester Foundation Level (CTFL v4.0.1) | Software testing & requirements | A | **29** | 5 | 4 | 5 | 4 | 4 | 4 | 3 | head |  | long tail: data-dev-health-other |
| 4 | Kubernetes & Cloud Native Associate | Kubernetes & CNCF | A | **29** | 3 | 4 | 5 | 5 | 4 | 4 | 4 | medium | Build first (prior score kept) | long tail: cloud-platform |
| 5 | CCSP (ISC2) | ISC2 / NIST | A | **28** | 3 | 5 | 4 | 4 | 5 | 3 | 4 | medium | Build. | long tail: security-privacy |
| 6 | Certified Kubernetes Administrator | Kubernetes & CNCF | A | **28** | 3 | 4 | 5 | 5 | 3 | 4 | 4 | medium | Build (prior) | long tail: cloud-platform |
| 7 | Certified Kubernetes Application Developer | Kubernetes & CNCF | A | **28** | 3 | 4 | 5 | 5 | 3 | 5 | 3 | medium | Build (prior) | long tail: cloud-platform |
| 8 | Certified Kubernetes Security Specialist | Kubernetes & CNCF | A | **28** | 2 | 5 | 4 | 5 | 3 | 4 | 5 | long tail | Build (prior) | long tail: cloud-platform |
| 9 | Designing Azure Infrastructure Solutions | Microsoft | A | **28** | 3 | 5 | 4 | 4 | 4 | 3 | 5 | medium | Build (prior) | long tail: cloud-platform |
| 10 | FAA Remote Pilot / Part 107 (UAG) | FAA aviation | A | **28** | 5 | 3 | 4 | 4 | 4 | 3 | 5 | head |  | long tail: government-public |
| 11 | FCC Amateur Technician (Element 2, 2026–2030 pool) | FCC radio | A | **28** | 4 | 3 | 5 | 5 | 4 | 3 | 4 | medium |  | long tail: government-public |
| 12 | FINRA SIE | Securities (FINRA/NASAA/MSRB) | A | **28** | 5 | 4 | 5 | 4 | 4 | 3 | 3 | head | Pair with Series 7 (co-requisite). Its free decks are stale. | first pass: finance |
| 13 | FINRA Series 7 | Securities (FINRA/NASAA/MSRB) | A | **28** | 5 | 4 | 5 | 4 | 4 | 3 | 3 | head | Highest finance flashcard demand. Content is public FINRA/SEC/MSRB rules. | first pass: finance |
| 14 | Kubernetes & Cloud Native Security Associate | Kubernetes & CNCF | A | **28** | 2 | 4 | 5 | 5 | 4 | 4 | 4 | long tail | Build with KCNA | long tail: cloud-platform |
| 15 | Prometheus Certified Associate | Kubernetes & CNCF | A | **28** | 2 | 4 | 5 | 5 | 4 | 4 | 4 | long tail | Build (cheap add-on) | long tail: cloud-platform |
| 16 | US Civics test (2025 version) *(not a certification) | Public-list (civics) | A | **28** | 5 | 2 | 5 | 5 | 3 | 3 | 5 | head |  | long tail: government-public |
| 17 | CIPP/E (IAPP) | Privacy (IAPP) | A | **27** | 2 | 5 | 5 | 4 | 4 | 3 | 4 | long tail | Build. | long tail: security-privacy |
| 18 | Certified Argo Project Associate | Kubernetes & CNCF | A | **27** | 1 | 4 | 5 | 5 | 4 | 4 | 4 | long tail | Next (cheap add-on) | long tail: cloud-platform |
| 19 | EPA Section 608 (Core, Type I/II/III, Universal) | Government safety & trades | A | **27** | 4 | 3 | 4 | 4 | 4 | 3 | 5 | medium |  | long tail: government-public |
| 20 | FAA Instrument Rating Airplane (IRA) | FAA aviation | A | **27** | 4 | 4 | 4 | 4 | 4 | 3 | 4 | medium |  | long tail: government-public |
| 21 | FAA Private Pilot Airplane (PAR) | FAA aviation | A | **27** | 5 | 3 | 4 | 4 | 4 | 3 | 4 | head |  | long tail: government-public |
| 22 | FCC Amateur General (Element 3, 2023–2027 pool) | FCC radio | A | **27** | 4 | 3 | 5 | 5 | 3 | 3 | 4 | medium |  | long tail: government-public |
| 23 | FEMA ICS/NIMS IS-100.c / IS-200.c / IS-700.b / IS-800.d | Government safety & trades | A | **27** | 3 | 4 | 5 | 4 | 4 | 3 | 4 | medium |  | long tail: government-public |
| 24 | FINRA Series 24 | Securities (FINRA/NASAA/MSRB) | A | **27** | 3 | 4 | 5 | 4 | 4 | 3 | 4 | medium |  | long tail: finance-regulatory |
| 25 | FINRA Series 9/10 | Securities (FINRA/NASAA/MSRB) | A | **27** | 3 | 4 | 5 | 4 | 4 | 3 | 4 | medium |  | long tail: finance-regulatory |
| 26 | GitHub Foundations | GitHub | A | **27** | 3 | 4 | 5 | 4 | 4 | 3 | 4 | medium | Build | long tail: cloud-platform |
| 27 | IRS VITA/TCE Link & Learn certification (Basic/Advanced) | US tax | A | **27** | 2 | 4 | 5 | 5 | 3 | 4 | 4 | long tail |  | long tail: finance-regulatory |
| 28 | Istio Certified Associate | Kubernetes & CNCF | A | **27** | 2 | 4 | 5 | 5 | 3 | 4 | 4 | long tail | Next | long tail: cloud-platform |
| 29 | KCS v6 Fundamentals (Consortium for Service Innovation), a niche | IT service | A | **27** | 1 | 5 | 5 | 4 | 5 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 30 | NASAA Series 65 | Securities (FINRA/NASAA/MSRB) | A | **27** | 4 | 4 | 5 | 4 | 4 | 3 | 3 | medium | Uniform Securities Act plus investment basics. Active r/Series65 flashcard threads. | first pass: finance |
| 31 | NMLS SAFE MLO Test | US consumer finance & banking | A | **27** | 4 | 4 | 5 | 4 | 4 | 3 | 3 | medium |  | long tail: finance-regulatory |
| 32 | OpenTelemetry Certified Associate | Kubernetes & CNCF | A | **27** | 1 | 4 | 5 | 5 | 4 | 4 | 4 | long tail | Next (cheap add-on) | long tail: cloud-platform |
| 33 | ProKanban PK I (Professional Kanban I) | Scrum & Kanban (open guides) | A | **27** | 2 | 5 | 5 | 4 | 4 | 3 | 4 | long tail | Build: cheap, open source, empty niche | long tail: agile-business |
| 34 | Scrum.org PSPO I | Scrum & Kanban (open guides) | A | **27** | 4 | 4 | 4 | 4 | 5 | 3 | 3 | medium | Build first | long tail: agile-business |


## Build, Tier B: build next (24–26)

| # | Exam | Family | Tier | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Azure Administrator | Microsoft | B | **26** | 5 | 3 | 4 | 4 | 4 | 3 | 3 | head | Next (prior) | long tail: cloud-platform |
| 2 | CAS Exam 5 (Basic Ratemaking and Estimating Claim Liabilities) | Actuarial (SOA/CAS) | B | **26** | 3 | 4 | 4 | 4 | 4 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 3 | CC (ISC2) | ISC2 / NIST | B | **26** | 3 | 4 | 5 | 4 | 4 | 3 | 3 | medium | Build. | long tail: security-privacy |
| 4 | CIPP/US (IAPP) | Privacy (IAPP) | B | **26** | 2 | 5 | 5 | 4 | 3 | 3 | 4 | long tail | Build. | long tail: security-privacy |
| 5 | CISSP (ISC2) | ISC2 / NIST | B | **26** | 5 | 3 | 4 | 4 | 3 | 4 | 3 | head | Build. | long tail: security-privacy |
| 6 | Certified Backstage Associate | Kubernetes & CNCF | B | **26** | 1 | 4 | 4 | 5 | 4 | 4 | 4 | long tail | Next (add-on) | long tail: cloud-platform |
| 7 | Certified GitOps Associate | Kubernetes & CNCF | B | **26** | 1 | 4 | 4 | 5 | 4 | 4 | 4 | long tail | Next (add-on) | long tail: cloud-platform |
| 8 | Cilium Certified Associate | Kubernetes & CNCF | B | **26** | 1 | 4 | 4 | 5 | 4 | 4 | 4 | long tail | Next (add-on) | long tail: cloud-platform |
| 9 | Cloud Digital Leader | Google Cloud | B | **26** | 2 | 5 | 4 | 4 | 4 | 2 | 5 | long tail | Next (prior) | long tail: cloud-platform |
| 10 | Designing and Implementing Microsoft DevOps Solutions | Microsoft | B | **26** | 3 | 4 | 4 | 4 | 4 | 3 | 4 | medium | Next | long tail: cloud-platform |
| 11 | FAA Aviation Mechanic General / Airframe / Powerplant (3 decks) | FAA aviation | B | **26** | 4 | 4 | 4 | 4 | 4 | 3 | 3 | medium |  | long tail: government-public |
| 12 | FCC Amateur Extra (Element 4, 2024–2028 pool) | FCC radio | B | **26** | 3 | 3 | 5 | 5 | 4 | 3 | 3 | medium |  | long tail: government-public |
| 13 | FINRA Series 6 | Securities (FINRA/NASAA/MSRB) | B | **26** | 3 | 4 | 5 | 4 | 4 | 3 | 3 | medium |  | long tail: finance-regulatory |
| 14 | GitHub Actions | GitHub | B | **26** | 2 | 4 | 5 | 4 | 4 | 3 | 4 | long tail | Next | long tail: cloud-platform |
| 15 | IREB CPRE Foundation Level (syllabus v3.3.0) | Software testing & requirements | B | **26** | 2 | 5 | 5 | 4 | 3 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 16 | Kyverno Certified Associate | Kubernetes & CNCF | B | **26** | 1 | 4 | 4 | 5 | 4 | 4 | 4 | long tail | Next (add-on) | long tail: cloud-platform |
| 17 | NASAA Series 63 | Securities (FINRA/NASAA/MSRB) | B | **26** | 3 | 4 | 5 | 4 | 4 | 3 | 3 | medium | Small, pure state law. Build it inside the Series 66 deck. | first pass: finance |
| 18 | NASAA Series 66 | Securities (FINRA/NASAA/MSRB) | B | **26** | 3 | 4 | 5 | 4 | 4 | 3 | 3 | medium | Cheap add-on once the Series 63 and 65 cards exist. | first pass: finance |
| 19 | SOA Exam FAM (Fundamentals of Actuarial Mathematics) | Actuarial (SOA/CAS) | B | **26** | 3 | 5 | 3 | 4 | 4 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 20 | SOA Exam P | Actuarial (SOA/CAS) | B | **26** | 3 | 3 | 4 | 4 | 5 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 21 | SOA Exam SRM (Statistics for Risk Modeling) | Actuarial (SOA/CAS) | B | **26** | 3 | 4 | 4 | 4 | 4 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 22 | SSCP (ISC2) | ISC2 / NIST | B | **26** | 2 | 5 | 4 | 4 | 4 | 2 | 5 | long tail | Build. | long tail: security-privacy |
| 23 | Scrum.org PSM II | Scrum & Kanban (open guides) | B | **26** | 3 | 5 | 3 | 4 | 5 | 3 | 3 | medium | Build as advanced subdeck | long tail: agile-business |
| 24 | State insurance: Life & Health producer (national general + state supplement) | State insurance | B | **26** | 5 | 4 | 4 | 4 | 3 | 3 | 3 | head |  | long tail: finance-regulatory |
| 25 | Administering Azure SQL Solutions | Microsoft | B | **25** | 2 | 4 | 4 | 4 | 4 | 3 | 4 | long tail | Next | long tail: cloud-platform |
| 26 | Azure AI Fundamentals | Microsoft | B | **25** | 3 | 5 | 4 | 4 | 2 | 3 | 4 | medium | Later (prior) | long tail: cloud-platform |
| 27 | Azure Data Fundamentals | Microsoft | B | **25** | 2 | 4 | 4 | 4 | 4 | 3 | 4 | long tail | Next (prior) | long tail: cloud-platform |
| 28 | Azure Fundamentals | Microsoft | B | **25** | 4 | 3 | 4 | 4 | 4 | 3 | 3 | medium | Next (prior) | long tail: cloud-platform |
| 29 | Azure Networking Solutions | Microsoft | B | **25** | 2 | 4 | 4 | 4 | 4 | 3 | 4 | long tail | Next | long tail: cloud-platform |
| 30 | CAS Exam 6U (Regulation and Financial Reporting, US) | Actuarial (SOA/CAS) | B | **25** | 4 | 3 | 4 | 4 | 3 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 31 | CAS Exam MAS-I | Actuarial (SOA/CAS) | B | **25** | 3 | 4 | 3 | 4 | 4 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 32 | CCSK v5 (CSA) | Cloud Security Alliance | B | **25** | 3 | 4 | 4 | 4 | 4 | 3 | 3 | medium | CSA's default licence expressly allows explanatory works. The exam is open-book. | long tail: security-privacy |
| 33 | CCZT (CSA) | Cloud Security Alliance | B | **25** | 1 | 5 | 5 | 4 | 4 | 3 | 3 | long tail | NIST 800-207 and CISA sources are public domain; no demand data. | long tail: security-privacy |
| 34 | CGRC (ISC2) | ISC2 / NIST | B | **25** | 3 | 4 | 5 | 4 | 3 | 3 | 3 | medium | Best new find. It is NIST 800-37/53 almost end to end, and Reddit shows people making thei | long tail: security-privacy |
| 35 | CPA REG (+ TCP) | US tax | B | **25** | 4 | 4 | 5 | 3 | 3 | 3 | 3 | medium | The tax-law half of the CPA. The IRC is public domain and no deck exists. | first pass: finance |
| 36 | Cloud Native Platform Engineering Associate | Kubernetes & CNCF | B | **25** | 1 | 4 | 4 | 5 | 3 | 4 | 4 | long tail | Later | long tail: cloud-platform |
| 37 | FAA Commercial Pilot Airplane (CAX) | FAA aviation | B | **25** | 4 | 4 | 4 | 4 | 4 | 2 | 3 | medium |  | long tail: government-public |
| 38 | FAA Flight Instructor Airplane + FOI + CFII (FIA / FOI / FII) | FAA aviation | B | **25** | 4 | 4 | 4 | 4 | 4 | 2 | 3 | medium |  | long tail: government-public |
| 39 | FINRA Series 14 | Securities (FINRA/NASAA/MSRB) | B | **25** | 1 | 5 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 40 | FINRA Series 26 | Securities (FINRA/NASAA/MSRB) | B | **25** | 2 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 41 | FINRA Series 27 | Securities (FINRA/NASAA/MSRB) | B | **25** | 2 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 42 | FINRA Series 4 | Securities (FINRA/NASAA/MSRB) | B | **25** | 2 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 43 | FINRA Series 57 | Securities (FINRA/NASAA/MSRB) | B | **25** | 2 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 44 | FINRA Series 99 | Securities (FINRA/NASAA/MSRB) | B | **25** | 2 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 45 | ISTQB Advanced (CTAL-TA / TM / TTA) | Software testing & requirements | B | **25** | 2 | 5 | 4 | 4 | 3 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 46 | LPI Linux Essentials | LPI | B | **25** | 2 | 4 | 2 | 4 | 4 | 5 | 4 | long tail | Next (partner-first) | long tail: cloud-platform |
| 47 | NREMT EMT | EMS | B | **25** | 5 | 4 | 2 | 3 | 4 | 4 | 3 | head |  | long tail: data-dev-health-other |
| 48 | Professional Cloud Architect | Google Cloud | B | **25** | 2 | 5 | 4 | 4 | 3 | 2 | 5 | long tail | Next (prior) | long tail: cloud-platform |
| 49 | SOA Exam ALTAM | Actuarial (SOA/CAS) | B | **25** | 2 | 5 | 3 | 4 | 4 | 4 | 3 | long tail |  | long tail: data-dev-health-other |
| 50 | SOA Exam FM | Actuarial (SOA/CAS) | B | **25** | 3 | 3 | 4 | 4 | 4 | 4 | 3 | medium |  | long tail: data-dev-health-other |
| 51 | Scrum Alliance CSM | Scrum & Kanban (open guides) | B | **25** | 3 | 3 | 5 | 4 | 5 | 2 | 3 | medium | Tag on PSM deck | long tail: agile-business |
| 52 | Scrum.org PAL-EBM | Scrum & Kanban (open guides) | B | **25** | 1 | 5 | 5 | 4 | 4 | 2 | 4 | long tail | Build: small, fully open source | long tail: agile-business |
| 53 | Scrum.org PSPO II | Scrum & Kanban (open guides) | B | **25** | 2 | 5 | 3 | 4 | 5 | 3 | 3 | long tail | Build as advanced subdeck | long tail: agile-business |
| 54 | State insurance: Property & Casualty (incl. Personal Lines) | State insurance | B | **25** | 4 | 4 | 4 | 4 | 3 | 3 | 3 | medium |  | long tail: finance-regulatory |
| 55 | ABA CRCM | US consumer finance & banking | B | **24** | 2 | 4 | 5 | 3 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 56 | AIGP (IAPP) | Privacy (IAPP) | B | **24** | 3 | 4 | 4 | 4 | 3 | 3 | 3 | medium | Open sources (EU AI Act, NIST AI RMF); fast-moving law. | long tail: security-privacy |
| 57 | ASQ CSSGB (+ generic LSS GB) | Quality & Six Sigma | B | **24** | 2 | 4 | 3 | 4 | 5 | 2 | 4 | long tail | Build | long tail: agile-business |
| 58 | Azure Virtual Desktop | Microsoft | B | **24** | 1 | 4 | 4 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 59 | CIPT (IAPP) | Privacy (IAPP) | B | **24** | 2 | 5 | 3 | 4 | 4 | 3 | 3 | long tail |  | long tail: security-privacy |
| 60 | Certified Cloud Native Platform Engineer | Kubernetes & CNCF | B | **24** | 1 | 4 | 4 | 5 | 2 | 4 | 4 | long tail | Later | long tail: cloud-platform |
| 61 | DOT Hazmat employee training (49 CFR 172 Subpart H) *(employer testing, no natio | Government safety & trades | B | **24** | 2 | 4 | 5 | 5 | 4 | 2 | 2 | long tail |  | long tail: government-public |
| 62 | FINRA Series 22 | Securities (FINRA/NASAA/MSRB) | B | **24** | 1 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 63 | FINRA Series 23 | Securities (FINRA/NASAA/MSRB) | B | **24** | 1 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 64 | FINRA Series 28 | Securities (FINRA/NASAA/MSRB) | B | **24** | 1 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 65 | FINRA Series 39 | Securities (FINRA/NASAA/MSRB) | B | **24** | 1 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 66 | FINRA Series 79 | Securities (FINRA/NASAA/MSRB) | B | **24** | 3 | 3 | 4 | 4 | 4 | 3 | 3 | medium |  | long tail: finance-regulatory |
| 67 | FINRA Series 82 | Securities (FINRA/NASAA/MSRB) | B | **24** | 1 | 4 | 5 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 68 | GSEC (GIAC) | GIAC | B | **24** | 1 | 5 | 4 | 3 | 4 | 2 | 5 | long tail |  | long tail: security-privacy |
| 69 | GitHub Administration (Enterprise Administrator) | GitHub | B | **24** | 1 | 4 | 5 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 70 | GitHub Advanced Security | GitHub | B | **24** | 2 | 3 | 5 | 4 | 3 | 3 | 4 | long tail | Next | long tail: cloud-platform |
| 71 | GitHub Copilot | GitHub | B | **24** | 2 | 4 | 5 | 4 | 2 | 3 | 4 | long tail | Next | long tail: cloud-platform |
| 72 | IRS AFSP (AFTR course with test) | US tax | B | **24** | 2 | 4 | 5 | 4 | 2 | 3 | 4 | long tail |  | long tail: finance-regulatory |
| 73 | ISSEP (ISC2) | ISC2 / NIST | B | **24** | 1 | 4 | 5 | 4 | 5 | 2 | 3 | long tail | Empty niche, small audience; cheap once the NIST family exists. | long tail: security-privacy |
| 74 | Identity and Access Administrator | Microsoft | B | **24** | 2 | 4 | 3 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 75 | LPIC-1 | LPI | B | **24** | 3 | 3 | 2 | 4 | 4 | 5 | 3 | medium | Next (partner-first) | long tail: cloud-platform |
| 76 | MSRB Series 52 | Securities (FINRA/NASAA/MSRB) | B | **24** | 2 | 4 | 5 | 3 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 77 | NCEES FE (Fundamentals of Engineering) | Engineering | B | **24** | 4 | 4 | 3 | 3 | 4 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 78 | NREMT EMR | EMS | B | **24** | 2 | 5 | 2 | 3 | 4 | 4 | 4 | long tail |  | long tail: data-dev-health-other |
| 79 | OSHA Outreach 10/30 (Construction, General Industry, Maritime) *(course card, no | Government safety & trades | B | **24** | 4 | 3 | 3 | 4 | 4 | 2 | 4 | medium |  | long tail: government-public |
| 80 | Power BI Data Analyst | Microsoft | B | **24** | 2 | 4 | 3 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 81 | Power Platform Fundamentals | Microsoft | B | **24** | 2 | 4 | 3 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 82 | SOA Exam ASTAM | Actuarial (SOA/CAS) | B | **24** | 1 | 5 | 3 | 4 | 4 | 4 | 3 | long tail |  | long tail: data-dev-health-other |
| 83 | Scrum.org PAL-E (PAL I) | Scrum & Kanban (open guides) | B | **24** | 2 | 5 | 3 | 4 | 5 | 2 | 3 | long tail | Build as subdeck | long tail: agile-business |
| 84 | Scrum.org PSK I | Scrum & Kanban (open guides) | B | **24** | 2 | 4 | 4 | 4 | 4 | 2 | 4 | long tail | Build with PK I | long tail: agile-business |
| 85 | Security, Compliance, and Identity Fundamentals | Microsoft | B | **24** | 3 | 4 | 3 | 4 | 3 | 3 | 4 | medium | Next | long tail: cloud-platform |
| 86 | Terraform Associate | HashiCorp | B | **24** | 3 | 4 | 3 | 3 | 3 | 4 | 4 | medium | Build if resourced (prior) | long tail: cloud-platform |


## Build, Tier C: build later (20–23)

| # | Exam | Family | Tier | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | AI Business Professional | Microsoft | C | **23** | 2 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 2 | AI Transformation Leader | Microsoft | C | **23** | 2 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 3 | ASQ CMQ/OE (2026 BoK) | Quality & Six Sigma | C | **23** | 2 | 5 | 3 | 4 | 4 | 1 | 4 | long tail | Build: fresh BoK, empty niche | long tail: agile-business |
| 4 | ASQ CQA (2026 BoK) | Quality & Six Sigma | C | **23** | 2 | 5 | 3 | 4 | 4 | 1 | 4 | long tail | Build: fresh BoK, empty niche | long tail: agile-business |
| 5 | Administering Windows Server | Microsoft | C | **23** | 1 | 4 | 4 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 6 | Azure for SAP Workloads | Microsoft | C | **23** | 1 | 4 | 4 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 7 | CAS Exam MAS-II | Actuarial (SOA/CAS) | C | **23** | 2 | 4 | 3 | 4 | 4 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 8 | CDL General Knowledge (+ Air Brakes, Combination, HazMat endorsement) | Government safety & trades | C | **23** | 5 | 2 | 3 | 2 | 4 | 2 | 5 | head |  | long tail: government-public |
| 9 | CEH (EC-Council) | EC-Council | C | **23** | 3 | 4 | 4 | 3 | 3 | 2 | 4 | medium |  | long tail: security-privacy |
| 10 | CFP | Financial planning | C | **23** | 4 | 3 | 3 | 3 | 4 | 3 | 3 | medium | Good demand. Trademark rules are strict and paid supply is crowded. | first pass: finance |
| 11 | CIPM (IAPP) | Privacy (IAPP) | C | **23** | 2 | 5 | 2 | 4 | 4 | 3 | 3 | long tail |  | long tail: security-privacy |
| 12 | CIPP/AU (IAPP) | Privacy (IAPP) | C | **23** | 1 | 5 | 3 | 4 | 5 | 2 | 3 | long tail | Launch window: online exam "early in 2027". | long tail: security-privacy |
| 13 | CIPP/C (IAPP) | Privacy (IAPP) | C | **23** | 1 | 5 | 4 | 4 | 4 | 2 | 3 | long tail | Federal law is free to reproduce under an Order (see evidence). | long tail: security-privacy |
| 14 | Developing AI Apps and Agents on Azure | Microsoft | C | **23** | 3 | 4 | 3 | 4 | 2 | 3 | 4 | medium | Later | long tail: cloud-platform |
| 15 | FAA Airline Transport Pilot Multiengine (ATM) | FAA aviation | C | **23** | 3 | 3 | 4 | 4 | 4 | 2 | 3 | medium |  | long tail: government-public |
| 16 | FINRA Series 86/87 | Securities (FINRA/NASAA/MSRB) | C | **23** | 2 | 4 | 3 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 17 | FRM Part I | FRM | C | **23** | 3 | 5 | 2 | 3 | 3 | 3 | 4 | medium | No AnkiWeb deck at all. The sources are GARP/Pearson books. | first pass: finance |
| 18 | GCIH (GIAC) | GIAC | C | **23** | 2 | 5 | 4 | 3 | 4 | 2 | 3 | long tail | Largest GIAC deck signal (one 2023 post), but the exam is open-book. | long tail: security-privacy |
| 19 | GitLab certifications (catalogue not captured) | GitLab | C | **23** | 1 | 4 | 5 | 3 | 3 | 3 | 4 | long tail | Verify catalogue first | long tail: cloud-platform |
| 20 | ISED Canada Basic amateur qualification *(open for non-commercial use) | FCC radio | C | **23** | 3 | 3 | 4 | 3 | 4 | 3 | 3 | medium |  | long tail: government-public |
| 21 | ISSAP (ISC2) | ISC2 / NIST | C | **23** | 1 | 4 | 4 | 4 | 5 | 2 | 3 | long tail | As ISSEP. | long tail: security-privacy |
| 22 | Implementing Analytics Solutions Using Fabric | Microsoft | C | **23** | 2 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 23 | Implementing Data Engineering Solutions Using Fabric | Microsoft | C | **23** | 2 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 24 | LPI DevOps Tools Engineer | LPI | C | **23** | 1 | 4 | 2 | 4 | 3 | 5 | 4 | long tail | Later | long tail: cloud-platform |
| 25 | LPI Open Source Essentials | LPI | C | **23** | 1 | 4 | 2 | 4 | 3 | 5 | 4 | long tail | Later | long tail: cloud-platform |
| 26 | LPI Security Essentials | LPI | C | **23** | 1 | 4 | 2 | 4 | 3 | 5 | 4 | long tail | Later | long tail: cloud-platform |
| 27 | LPI Web Development Essentials | LPI | C | **23** | 1 | 4 | 2 | 4 | 3 | 5 | 4 | long tail | Later | long tail: cloud-platform |
| 28 | MSRB Series 50 / 54 / 53 | Securities (FINRA/NASAA/MSRB) | C | **23** | 1 | 4 | 5 | 3 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 29 | Managing Microsoft Teams | Microsoft | C | **23** | 1 | 4 | 3 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 30 | Managing and Securing M365 Endpoints (Intune) | Microsoft | C | **23** | 1 | 4 | 3 | 4 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 31 | NFA Series 3 | NFA/CFTC | C | **23** | 2 | 4 | 4 | 3 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 32 | NREMT AEMT | EMS | C | **23** | 2 | 5 | 2 | 3 | 3 | 4 | 4 | long tail |  | long tail: data-dev-health-other |
| 33 | PTCB CPhT (PTCE) | Pharmacy | C | **23** | 3 | 4 | 4 | 2 | 4 | 3 | 3 | medium |  | first pass: data-actuarial-health |
| 34 | Python Institute PCAP-31-03 (new version due Q3 2026) | Programming | C | **23** | 2 | 4 | 5 | 3 | 2 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 35 | Python Institute PCEP-30-02 (new version due Q3 2026) | Programming | C | **23** | 2 | 4 | 5 | 3 | 2 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 36 | SAS Base Programming Specialist (A00-231) | Data / programming | C | **23** | 2 | 5 | 3 | 3 | 4 | 2 | 4 | long tail |  | long tail: data-dev-health-other |
| 37 | Scrum.org PSD I | Scrum & Kanban (open guides) | C | **23** | 2 | 4 | 3 | 4 | 5 | 2 | 3 | long tail | Later | long tail: agile-business |
| 38 | Scrum.org SPS | Scrum & Kanban (open guides) | C | **23** | 2 | 5 | 2 | 3 | 5 | 2 | 4 | long tail | Later, in paraphrase only | long tail: agile-business |
| 39 | Security Operations Analyst | Microsoft | C | **23** | 2 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 40 | ARRT Radiography (content spec implemented 2022) | Allied health | C | **22** | 3 | 4 | 2 | 3 | 4 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 41 | ASQ CQE | Quality & Six Sigma | C | **22** | 2 | 4 | 3 | 4 | 5 | 1 | 3 | long tail | Build in family | long tail: agile-business |
| 42 | ASQ CRE (2025 BoK) | Quality & Six Sigma | C | **22** | 1 | 5 | 3 | 4 | 4 | 1 | 4 | long tail | Later | long tail: agile-business |
| 43 | ASQ CSSBB | Quality & Six Sigma | C | **22** | 2 | 4 | 3 | 4 | 5 | 1 | 3 | long tail | Build in family | long tail: agile-business |
| 44 | Administering Information Security in M365 | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 45 | Agentic AI Business Solutions Architect | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 46 | Associate Data Practitioner | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 47 | Building AI Applications with Azure Cosmos DB | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 48 | CAS Exam 7 | Actuarial (SOA/CAS) | C | **22** | 2 | 3 | 3 | 4 | 4 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 49 | CIA (IIA) | Audit (IIA) | C | **22** | 2 | 4 | 2 | 3 | 4 | 3 | 4 | long tail | The Global Internal Audit Standards are copyrighted. Low visible demand. | first pass: finance |
| 50 | CIPP/A (IAPP) | Privacy (IAPP) | C | **22** | 1 | 5 | 3 | 4 | 4 | 2 | 3 | long tail | Singapore, Hong Kong and India law reuse terms not verified. | long tail: security-privacy |
| 51 | CMA (IMA) | Accounting bodies | C | **22** | 3 | 4 | 3 | 3 | 3 | 3 | 3 | medium | Moderate. The IMA site blocked scripted reads. | first pass: finance |
| 52 | CMS Introductory Sommelier | Wine | C | **22** | 4 | 3 | 2 | 3 | 4 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 53 | CSSLP (ISC2) | ISC2 / NIST | C | **22** | 2 | 4 | 4 | 4 | 2 | 3 | 3 | long tail | A refresh is likely due (inference); 52-star notes repo is a partner lead. | long tail: security-privacy |
| 54 | CWSP (CWNP) | Wireless | C | **22** | 1 | 5 | 3 | 3 | 5 | 2 | 3 | long tail | Stable but tiny. | long tail: security-privacy |
| 55 | California Notary Public exam (state; a model for other states) | Legal support | C | **22** | 2 | 4 | 4 | 4 | 3 | 2 | 3 | long tail |  | long tail: data-dev-health-other |
| 56 | Collaboration Communications Systems Engineer | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 57 | Confluent Certified Developer for Apache Kafka | Kafka | C | **22** | 2 | 4 | 4 | 3 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 58 | Copilot and Agent Administration Fundamentals | Microsoft | C | **22** | 2 | 3 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 59 | Cybersecurity Architect | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 60 | D365 Business Central Developer | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 61 | D365 Business Central Functional Consultant | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 62 | D365 Customer Service Functional Consultant | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 63 | D365 Finance Functional Consultant | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 64 | D365 Finance and Operations Apps Developer | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 65 | Developing AI Cloud Solutions on Azure | Microsoft | C | **22** | 2 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 66 | Developing AI-Enabled Database Solutions | Microsoft | C | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 67 | End-to-End Security Controls for Cloud and AI | Microsoft | C | **22** | 2 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 68 | FAA Aircraft Dispatcher | FAA aviation | C | **22** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | long tail |  | long tail: government-public |
| 69 | FAA Ground Instructor (Basic / Advanced / Instrument) | FAA aviation | C | **22** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | long tail |  | long tail: government-public |
| 70 | FAA Inspection Authorization (IA) | FAA aviation | C | **22** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | long tail |  | long tail: government-public |
| 71 | FAA Private Pilot Helicopter | FAA aviation | C | **22** | 2 | 4 | 4 | 4 | 4 | 2 | 2 | long tail |  | long tail: government-public |
| 72 | FCC GROL (Elements 1 + 3) | FCC radio | C | **22** | 3 | 4 | 3 | 4 | 3 | 2 | 3 | medium |  | long tail: government-public |
| 73 | FINRA Series 16 | Securities (FINRA/NASAA/MSRB) | C | **22** | 1 | 4 | 3 | 4 | 4 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 74 | FRM Part II | FRM | C | **22** | 2 | 5 | 2 | 3 | 3 | 3 | 4 | long tail | As Part I, with less demand. | first pass: finance |
| 75 | GPEN / GCIA / GFACT (GIAC) | GIAC | C | **22** | 1 | 5 | 4 | 3 | 4 | 2 | 3 | long tail | Open-book; no demand signal. | long tail: security-privacy |
| 76 | Generative AI Leader | Google Cloud | C | **22** | 2 | 4 | 4 | 4 | 2 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 77 | ISSMP (ISC2) | ISC2 / NIST | C | **22** | 1 | 4 | 3 | 4 | 5 | 2 | 3 | long tail | Management content with fewer open sources. | long tail: security-privacy |
| 78 | Joint Board Enrolled Actuary exams | US pension law | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 79 | LPIC-2 | LPI | C | **22** | 1 | 4 | 2 | 4 | 3 | 4 | 4 | long tail | Later | long tail: cloud-platform |
| 80 | LPIC-3 (Mixed Env / Security / Virtualization / HA) | LPI | C | **22** | 1 | 4 | 2 | 4 | 3 | 4 | 4 | long tail | Later | long tail: cloud-platform |
| 81 | MSRB Series 51 | Securities (FINRA/NASAA/MSRB) | C | **22** | 1 | 4 | 5 | 3 | 4 | 1 | 4 | long tail |  | long tail: finance-regulatory |
| 82 | NCRA RPR Written Knowledge Test (court reporter) | Legal support | C | **22** | 1 | 5 | 2 | 3 | 4 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 83 | NREMT Paramedic | EMS | C | **22** | 5 | 2 | 2 | 3 | 4 | 4 | 2 | head |  | long tail: data-dev-health-other |
| 84 | Neo4j Certified Professional | Neo4j | C | **22** | 1 | 4 | 3 | 3 | 4 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 85 | Oracle Database SQL (1Z0-071) | Programming / data | C | **22** | 2 | 4 | 3 | 3 | 4 | 2 | 4 | long tail |  | long tail: data-dev-health-other |
| 86 | Oracle Java SE 21 Developer (1Z0-830); Java SE 17 (1Z0-829) as a tag | Programming | C | **22** | 2 | 4 | 3 | 3 | 4 | 2 | 4 | long tail |  | long tail: data-dev-health-other |
| 87 | Professional Cloud Database Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 88 | Professional Cloud DevOps Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 89 | Professional Cloud Developer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 90 | Professional Cloud Network Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 91 | Professional Cloud Security Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 92 | Professional Data Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 93 | Professional Security Operations Engineer | Google Cloud | C | **22** | 1 | 4 | 4 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 94 | SOA Exam PA (Predictive Analytics) | Actuarial (SOA/CAS) | C | **22** | 2 | 4 | 3 | 4 | 3 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 95 | Scrum.org PSPBM | Scrum & Kanban (open guides) | C | **22** | 1 | 5 | 3 | 4 | 5 | 1 | 3 | long tail | Tag on PSPO deck | long tail: agile-business |
| 96 | Scrum.org PSU I | Scrum & Kanban (open guides) | C | **22** | 1 | 5 | 2 | 4 | 5 | 1 | 4 | long tail | Low priority | long tail: agile-business |
| 97 | State insurance: adjuster licences | State insurance | C | **22** | 2 | 4 | 4 | 4 | 3 | 2 | 3 | long tail |  | long tail: finance-regulatory |
| 98 | Vault Associate | HashiCorp | C | **22** | 2 | 4 | 3 | 3 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 99 | ABA CAFP | AML | C | **21** | 1 | 4 | 4 | 3 | 3 | 2 | 4 | long tail |  | long tail: finance-regulatory |
| 100 | ASQ CMDA (2026 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 101 | ASQ CPGP (2023 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 102 | ASQ CQI (2025 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 103 | ASQ CQIA | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 104 | ASQ CQPA (2026 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 105 | ASQ CQT (2024 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 106 | ASQ CSQE (2023 BoK) | Quality & Six Sigma | C | **21** | 1 | 5 | 3 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 107 | AWS Certified Data Engineer Associate | AWS | C | **21** | 2 | 3 | 2 | 4 | 4 | 3 | 3 | long tail | Later (only AWS gap) | long tail: cloud-platform |
| 108 | Associate Cloud Engineer | Google Cloud | C | **21** | 2 | 3 | 4 | 4 | 3 | 2 | 3 | long tail | Later (prior) | long tail: cloud-platform |
| 109 | Building Intelligent Applications | Microsoft | C | **21** | 1 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 110 | CMS Certified Sommelier | Wine | C | **21** | 3 | 3 | 2 | 3 | 4 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 111 | CPA AUD | CPA | C | **21** | 3 | 4 | 2 | 3 | 3 | 3 | 3 | medium | AICPA standards are copyrighted, so sourcing is harder. | first pass: finance |
| 112 | CPA FAR | CPA | C | **21** | 4 | 3 | 3 | 3 | 3 | 3 | 2 | medium | The biggest CPA section. The FASB ASC is free to read but licensed; Becker dominates. | first pass: finance |
| 113 | CPA disciplines BAR / ISC | CPA | C | **21** | 2 | 4 | 3 | 3 | 3 | 3 | 3 | long tail | Thin demand signal (TCP is grouped with REG in this report because it is tax). | first pass: finance |
| 114 | CWNA (CWNP) | Wireless | C | **21** | 1 | 5 | 3 | 3 | 4 | 2 | 3 | long tail | Build only for 110; its objectives were not fetched. | long tail: security-privacy |
| 115 | Confluent Certified Administrator for Apache Kafka | Kafka | C | **21** | 1 | 4 | 4 | 3 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 116 | D365 Supply Chain Management Functional Consultant | Microsoft | C | **21** | 1 | 4 | 3 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 117 | GCFA / GICSP / GSLC (GIAC) | GIAC | C | **21** | 1 | 5 | 3 | 3 | 4 | 2 | 3 | long tail | Notes only. | long tail: security-privacy |
| 118 | GitHub Certified: Agentic AI Developer | GitHub | C | **21** | 2 | 3 | 4 | 4 | 2 | 3 | 3 | long tail | Later | long tail: cloud-platform |
| 119 | HRCI PHR (with SPHR) | HR | C | **21** | 2 | 3 | 3 | 3 | 4 | 2 | 4 | long tail |  | first pass: project-business |
| 120 | Integrated AI Agent Solutions in Copilot Studio | Microsoft | C | **21** | 1 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 121 | LF Certified IT Associate | LF-other | C | **21** | 1 | 4 | 2 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 122 | NALA Certified Paralegal (CP) | Legal support | C | **21** | 2 | 4 | 2 | 3 | 3 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 123 | NATE HVAC Core/Specialty; lightly researched | Government safety & trades | C | **21** | 2 | 4 | 2 | 3 | 3 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 124 | NCHEC CHES (Certified Health Education Specialist) | Allied health | C | **21** | 1 | 5 | 2 | 3 | 3 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 125 | NFA Series 30 / 31 / 32 / 34 | NFA/CFTC | C | **21** | 1 | 4 | 4 | 3 | 4 | 1 | 4 | long tail |  | long tail: finance-regulatory |
| 126 | NHA Certified Phlebotomy Technician (CPT) | Allied health | C | **21** | 3 | 4 | 2 | 3 | 3 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 127 | Operationalizing ML and GenAI Solutions | Microsoft | C | **21** | 1 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 128 | PCAP Certified Associate in Python Programming | PythonInst | C | **21** | 2 | 4 | 3 | 3 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 129 | Professional Machine Learning Engineer | Google Cloud | C | **21** | 1 | 4 | 4 | 4 | 2 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 130 | PyTorch Certified Associate | LF-other | C | **21** | 1 | 4 | 2 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 131 | ServSafe Manager (Food Protection Manager) | Food safety | C | **21** | 2 | 3 | 5 | 3 | 3 | 3 | 2 | long tail |  | first pass: data-actuarial-health |
| 132 | Terraform Authoring and Operations Advanced | HashiCorp | C | **21** | 1 | 4 | 3 | 3 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 133 | USCG OUPV / Master (≤100 GT) | USCG-Merchant-Mariner | C | **21** | 3 | 4 | 2 | 3 | 3 | 2 | 4 | medium |  | long tail: government-public |
| 134 | WSET Level 2 / Level 3 Award in Wines | Wine | C | **21** | 5 | 2 | 2 | 3 | 4 | 3 | 2 | head |  | first pass: data-actuarial-health |
| 135 | AAMA CMA (medical assistant); lightly researched | Medical assisting | C | **20** | 3 | 3 | 2 | 3 | 3 | 3 | 3 | medium |  | first pass: data-actuarial-health |
| 136 | ACAMS CAMS | AML | C | **20** | 4 | 2 | 3 | 3 | 3 | 2 | 3 | medium |  | long tail: finance-regulatory |
| 137 | ASCP BOC Phlebotomy Technician (PBT); mostly not verified | Allied health | C | **20** | 2 | 4 | 2 | 3 | 3 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 138 | ASE A-series (A1–A8); not verified (site 403) | Government safety & trades | C | **20** | 3 | 4 | 2 | 3 | 3 | 3 | 2 | medium |  | long tail: data-dev-health-other |
| 139 | ASQ CCQM (2024 BoK) | Quality & Six Sigma | C | **20** | 1 | 5 | 2 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 140 | ASQ CCT (2024 BoK) | Quality & Six Sigma | C | **20** | 1 | 5 | 2 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 141 | ASQ CSQP (2023 BoK) | Quality & Six Sigma | C | **20** | 1 | 5 | 2 | 4 | 4 | 1 | 3 | long tail | Later | long tail: agile-business |
| 142 | ASQ CSSYB | Quality & Six Sigma | C | **20** | 1 | 4 | 3 | 4 | 4 | 1 | 3 | long tail | Tag in LSS family | long tail: agile-business |
| 143 | Accelerating Sales Pipelines with AI in D365 | Microsoft | C | **20** | 1 | 4 | 3 | 4 | 2 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 144 | Associate Google Workspace Administrator | Google Cloud | C | **20** | 1 | 4 | 2 | 4 | 3 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 145 | CDR Registration Examination for Dietitians (RD); lightly researched | Allied health | C | **20** | 2 | 4 | 2 | 3 | 3 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 146 | CIPP/CN (IAPP) | Privacy (IAPP) | C | **20** | 1 | 5 | 2 | 4 | 4 | 1 | 3 | long tail | Chinese law reuse and translations not verified. | long tail: security-privacy |
| 147 | CND (EC-Council) | EC-Council | C | **20** | 1 | 5 | 4 | 3 | 3 | 1 | 3 | long tail |  | long tail: security-privacy |
| 148 | Contact Center Experiences with AI in D365 | Microsoft | C | **20** | 1 | 4 | 3 | 4 | 2 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 149 | FCC Marine Radio Operator Permit (Element 1 only) | FCC radio | C | **20** | 2 | 4 | 3 | 4 | 3 | 2 | 2 | long tail |  | long tail: government-public |
| 150 | INFORMS CAP (now CAP-Essentials / Pro / Expert) | Data | C | **20** | 1 | 5 | 2 | 3 | 2 | 3 | 4 | long tail |  | long tail: data-dev-health-other |
| 151 | LEED Green Associate | Building / green | C | **20** | 3 | 4 | 2 | 3 | 2 | 3 | 3 | medium |  | long tail: data-dev-health-other |
| 152 | Model Context Protocol Associate | LF-other | C | **20** | 1 | 4 | 2 | 4 | 2 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 153 | OSCP+ (OffSec) | Hands-on | C | **20** | 1 | 3 | 4 | 3 | 4 | 2 | 3 | long tail |  | long tail: security-privacy |
| 154 | PCEP Certified Entry-Level Python Programmer | PythonInst | C | **20** | 2 | 4 | 3 | 3 | 2 | 2 | 4 | long tail | Later | long tail: cloud-platform |
| 155 | Red Hat Certified System Administrator | RedHat | C | **20** | 2 | 4 | 2 | 3 | 3 | 3 | 3 | long tail | Later (prior) | long tail: cloud-platform |
| 156 | iSAQB CPSA-F (software architecture) | Software testing & requirements | C | **20** | 2 | 5 | 2 | 1 | 4 | 2 | 4 | long tail |  | long tail: data-dev-health-other |


## Build, Tier D: backlog (under 20)

| # | Exam | Family | Tier | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ASQ CFSQA (HACCP auditor) | Quality & Six Sigma | D | **19** | 1 | 5 | 2 | 4 | 3 | 1 | 3 | long tail | Later | long tail: agile-business |
| 2 | ATA translation certification (performance exam) | Language | D | **19** | 1 | 5 | 1 | 3 | 4 | 2 | 3 | long tail |  | long tail: data-dev-health-other |
| 3 | CII (UK, R01-type regulation units) | UK FCA | D | **19** | 2 | 3 | 4 | 2 | 3 | 2 | 3 | long tail |  | long tail: finance-regulatory |
| 4 | CISI (UK, e.g. regulation papers) | UK FCA | D | **19** | 3 | 3 | 3 | 2 | 3 | 2 | 3 | medium |  | long tail: finance-regulatory |
| 5 | DAMA CDMP (DMBOK-based) | Data management | D | **19** | 2 | 4 | 1 | 3 | 3 | 3 | 3 | long tail |  | long tail: data-dev-health-other |
| 6 | FAA Sport Pilot (after the MOSAIC changes) | FAA aviation | D | **19** | 1 | 4 | 4 | 4 | 2 | 2 | 2 | long tail |  | long tail: government-public |
| 7 | HDI Customer Service Rep / Desktop Support Technician | IT service | D | **19** | 1 | 5 | 1 | 3 | 3 | 2 | 4 | long tail |  | long tail: data-dev-health-other |
| 8 | ISO/IEC 27001 Lead Auditor (PECB) | ISO management | D | **19** | 2 | 4 | 1 | 3 | 4 | 2 | 3 | long tail | As LI. | long tail: security-privacy |
| 9 | ISO/IEC 27001 Lead Implementer (PECB) | ISO management | D | **19** | 2 | 4 | 1 | 3 | 4 | 2 | 3 | long tail | The ISO text is paywalled, and the exam is open-book with the standard allowed. | long tail: security-privacy |
| 10 | NCLEX-RN / NCLEX-PN (licensure; for completeness) | Nursing (skip) | D | **19** | 5 | 1 | 2 | 3 | 5 | 2 | 1 | head |  | long tail: data-dev-health-other |
| 11 | Real-estate salesperson licence (state exams); lightly researched | Real estate | D | **19** | 3 | 3 | 3 | 3 | 3 | 2 | 2 | medium |  | first pass: data-actuarial-health |
| 12 | SOA ATPA | Actuarial (SOA/CAS) | D | **19** | 1 | 4 | 2 | 4 | 3 | 2 | 3 | long tail |  | long tail: data-dev-health-other |
| 13 | TOGAF Enterprise Architecture Foundation (OGEA-101) | Enterprise architecture | D | **19** | 3 | 4 | 2 | 2 | 3 | 2 | 3 | medium |  | long tail: data-dev-health-other |
| 14 | AFP CTP / FPAC | Treasury | D | **18** | 2 | 3 | 2 | 3 | 3 | 2 | 3 | long tail |  | long tail: finance-regulatory |
| 15 | ASCM CPIM / CSCP / CLTD | Supply chain | D | **18** | 2 | 4 | 1 | 2 | 3 | 2 | 4 | long tail |  | first pass: project-business |
| 16 | CBCI (BCI) | ISO management | D | **18** | 2 | 5 | 1 | 2 | 3 | 2 | 3 | long tail | GPG is members-only or paid, and the course is mandatory. | long tail: security-privacy |
| 17 | CHFI (EC-Council) | EC-Council | D | **18** | 1 | 4 | 3 | 3 | 3 | 1 | 3 | long tail |  | long tail: security-privacy |
| 18 | CIMA (CGMA PQ) | Accounting bodies | D | **18** | 2 | 3 | 2 | 3 | 2 | 3 | 3 | long tail | Low Anki demand and recent churn. | first pass: finance |
| 19 | CIPS (Level 4 Diploma) | Supply chain | D | **18** | 2 | 4 | 1 | 2 | 3 | 2 | 4 | long tail |  | first pass: project-business |
| 20 | CNA (state nurse-aide exams) | Allied health | D | **18** | 2 | 3 | 2 | 3 | 3 | 2 | 3 | long tail |  | long tail: data-dev-health-other |
| 21 | Electrician journeyman/master (NEC-based state exams) | Government safety & trades | D | **18** | 3 | 4 | 1 | 2 | 3 | 2 | 3 | medium |  | long tail: data-dev-health-other |
| 22 | Juniper JNCIA-Junos | Audit (IIA) | D | **18** | 1 | 4 | 3 | 3 | 3 | 1 | 3 | long tail | Low demand. | first pass: security |
| 23 | NASM CPT | Fitness | D | **18** | 4 | 3 | 1 | 3 | 3 | 2 | 2 | medium |  | first pass: data-actuarial-health |
| 24 | NCCPA PANCE (licensure-adjacent) | Medical (skip) | D | **18** | 3 | 2 | 2 | 3 | 4 | 2 | 2 | medium |  | long tail: data-dev-health-other |
| 25 | ACE Personal Trainer | Fitness | D | **17** | 3 | 3 | 1 | 3 | 3 | 2 | 2 | medium |  | first pass: data-actuarial-health |
| 26 | CAIA | CAIA | D | **17** | 2 | 4 | 1 | 2 | 2 | 2 | 4 | long tail | Only licensed providers get the curriculum. Low demand. | first pass: finance |
| 27 | CFE (ACFE) | Fraud (ACFE) | D | **17** | 1 | 2 | 2 | 3 | 4 | 2 | 3 | long tail | The official prep course has ~800 flashcards, and the source (Fraud Examiners Manual) is p | first pass: finance |
| 28 | Google Data Analytics Professional Certificate | Google Cloud | D | **17** | 2 | 3 | 2 | 3 | 2 | 2 | 3 | long tail |  | first pass: data-actuarial-health |
| 29 | AHA BLS / ACLS / PALS (course cards, not a proctored exam) | Resuscitation (skip) | D | **16** | 3 | 3 | 1 | 2 | 3 | 2 | 2 | medium |  | long tail: data-dev-health-other |
| 30 | IBM Data Science Professional Certificate | Data certificates | D | **16** | 1 | 3 | 2 | 3 | 2 | 2 | 3 | long tail |  | first pass: data-actuarial-health |
| 31 | NSCA CSCS; lightly researched | Fitness | D | **16** | 2 | 3 | 1 | 3 | 3 | 2 | 2 | long tail |  | first pass: data-actuarial-health |


## Partnership first

| # | Exam | Family | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ISACA CISM | ISACA | **25** | 4 | 5 | 3 | 2 | 4 | 3 | 4 | medium | Large base and a new outline in six weeks; ISACA's terms ban using its content as AI input | first pass: security |
| 2 | CompTIA CySA+ | CompTIA | **24** | 3 | 5 | 4 | 1 | 4 | 3 | 4 | medium | No free V4 deck found, but CompTIA's policy on AI-made and free materials is the blocker. | first pass: security |
| 3 | IASSC Lean Six Sigma Black Belt | Quality & Six Sigma | **23** | 2 | 5 | 3 | 3 | 4 | 2 | 4 | long tail | Build inside LSS family | long tail: agile-business |
| 4 | IASSC Lean Six Sigma Green Belt | Quality & Six Sigma | **23** | 2 | 4 | 3 | 3 | 5 | 2 | 4 | long tail | Tag on CSSGB deck | long tail: agile-business |
| 5 | ISACA CISA | ISACA | **23** | 4 | 4 | 3 | 2 | 3 | 3 | 4 | medium | Largest audit base; the supply is Etsy, Gumroad and one 2024 Reddit giveaway. ISACA terms  | first pass: security |
| 6 | CMMC CCP (ISACA as CAICO) | NIST / CMMC | **22** | 3 | 4 | 5 | 3 | 2 | 2 | 3 | medium | Sources are all public, but the programme is in flux (ISACA took over; DoW reform RFI). | long tail: security-privacy |
| 7 | CompTIA A+ | CompTIA | **22** | 4 | 3 | 3 | 1 | 4 | 4 | 3 | medium | Big and stable, but crowded and under CompTIA rules. | first pass: security |
| 8 | CompTIA Network+ | CompTIA | **22** | 4 | 3 | 4 | 1 | 3 | 4 | 3 | medium | RFC-sourceable, but crowded and under CompTIA rules. | first pass: security |
| 9 | CyberOps Associate (Cisco) | Cisco | **22** | 3 | 3 | 4 | 3 | 3 | 3 | 3 | medium | Some supply exists; Cisco docs not reusable. | long tail: security-privacy |
| 10 | IASSC Lean Six Sigma Yellow Belt | Quality & Six Sigma | **22** | 2 | 4 | 3 | 3 | 4 | 2 | 4 | long tail | Tag in LSS family | long tail: agile-business |
| 11 | CFA Level II | CFA | **21** | 4 | 4 | 2 | 1 | 4 | 3 | 3 | medium | Demand is real, but LOS use is restricted. Partnership-first. | first pass: finance |
| 12 | CMMC CCA | NIST / CMMC | **21** | 1 | 5 | 5 | 3 | 2 | 2 | 3 | long tail | A tag on the CCP deck. | long tail: security-privacy |
| 13 | CRISC (ISACA) | US tax | **21** | 2 | 5 | 3 | 2 | 3 | 2 | 4 | long tail |  | long tail: security-privacy |
| 14 | ENCOR (Cisco) | Cisco | **21** | 3 | 4 | 3 | 3 | 3 | 2 | 3 | medium |  | long tail: security-privacy |
| 15 | PMI PMP (2026 ECO) | PMI | **21** | 5 | 3 | 2 | 2 | 3 | 4 | 2 | head |  | first pass: project-business |
| 16 | CFA Level III | CFA | **20** | 3 | 4 | 2 | 1 | 4 | 3 | 3 | medium | Same restriction as L1/L2. | first pass: finance |
| 17 | Cisco CCNA | Cisco | **20** | 5 | 1 | 4 | 3 | 3 | 2 | 2 | head | Demand is real but already served free by Jeremy's IT Lab and a +268-rated AnkiWeb deck. | first pass: security |
| 18 | CompTIA PenTest+ | CompTIA | **20** | 2 | 4 | 4 | 1 | 3 | 2 | 4 | long tail | Low deck demand, and CompTIA rules apply. | first pass: security |
| 19 | CompTIA Security+ | CompTIA | **20** | 5 | 2 | 4 | 1 | 2 | 4 | 2 | head | Biggest audience and a V8 launch window, but the most crowded field and the riskiest rules | first pass: security |
| 20 | CompTIA SecurityX (ex-CASP+) | Actuarial (SOA/CAS) | **20** | 2 | 4 | 4 | 1 | 3 | 2 | 4 | long tail | Same as PenTest+. | first pass: security |
| 21 | DevNet Associate (Cisco) | Cisco | **20** | 2 | 4 | 3 | 3 | 3 | 2 | 3 | long tail | Current name and version nv. | long tail: security-privacy |
| 22 | IIBA CBAP | BABOK | **20** | 2 | 4 | 2 | 2 | 3 | 3 | 4 | long tail | Partnership first | long tail: agile-business |
| 23 | IIBA ECBA | BABOK | **20** | 2 | 4 | 2 | 2 | 3 | 3 | 4 | long tail | Partnership first | long tail: agile-business |
| 24 | IIBA-CCA | BABOK + security | **20** | 1 | 5 | 3 | 2 | 3 | 2 | 4 | long tail | Partnership first | long tail: agile-business |
| 25 | PMI-ACP | PMI | **20** | 2 | 4 | 3 | 2 | 4 | 2 | 3 | long tail |  | first pass: project-business |
| 26 | IIBA CCBA | BABOK | **19** | 1 | 5 | 2 | 2 | 3 | 2 | 4 | long tail | Partnership first | long tail: agile-business |
| 27 | IIBA-AAC | Agile Extension to BABOK | **19** | 1 | 5 | 2 | 2 | 3 | 2 | 4 | long tail | Partnership first | long tail: agile-business |
| 28 | IIBA-CBDA | Guide to Business Data Analytics | **19** | 1 | 5 | 2 | 2 | 3 | 2 | 4 | long tail | Partnership first | long tail: agile-business |
| 29 | PMI CAPM | PMI | **19** | 3 | 3 | 2 | 2 | 3 | 3 | 3 | medium |  | first pass: project-business |
| 30 | PRINCE2 7 Foundation | PeopleCert | **19** | 3 | 4 | 1 | 1 | 4 | 2 | 4 | medium |  | first pass: project-business |
| 31 | SCOR (Cisco) | Cisco | **19** | 2 | 4 | 2 | 3 | 3 | 2 | 3 | long tail | Product-specific; closed docs. | long tail: security-privacy |
| 32 | SHRM-CP / SHRM-SCP | HR | **19** | 4 | 3 | 3 | 1 | 2 | 3 | 3 | medium |  | first pass: project-business |
| 33 | AAPC CPC (medical coding) | Medical coding | **18** | 3 | 4 | 1 | 2 | 2 | 3 | 3 | medium |  | first pass: data-actuarial-health |
| 34 | AHIMA CCS | Medical coding | **18** | 2 | 4 | 2 | 3 | 2 | 2 | 3 | long tail |  | first pass: data-actuarial-health |
| 35 | CFA Level I | CFA | **18** | 5 | 3 | 2 | 1 | 2 | 3 | 2 | head | Biggest demand. CFA's own LES flashcards, the LOS restriction and 2027 churn make it the w | first pass: finance |
| 36 | IIBA-CPOA | BABOK / product ownership | **18** | 1 | 5 | 2 | 2 | 3 | 1 | 4 | long tail | Partnership first | long tail: agile-business |
| 37 | PMI-PBA | PMI (licence) | **16** | 1 | 4 | 2 | 1 | 3 | 2 | 3 | long tail | Partnership-first note | long tail: agile-business |
| 38 | PMI-RMP | PMI | **16** | 1 | 4 | 2 | 2 | 3 | 1 | 3 | long tail |  | first pass: project-business |
| 39 | PMI-SP | PMI (licence) | **16** | 1 | 5 | 2 | 1 | 3 | 1 | 3 | long tail | Partnership-first note | long tail: agile-business |
| 40 | PMI PfMP | PMI (licence) | **15** | 1 | 5 | 1 | 1 | 3 | 1 | 3 | long tail | Partnership-first note | long tail: agile-business |
| 41 | PMI PgMP | PMI (licence) | **15** | 1 | 4 | 1 | 1 | 3 | 2 | 3 | long tail | Partnership-first note | long tail: agile-business |
| 42 | PeopleCert ITIL 4 Foundation | PeopleCert | **15** | 3 | 3 | 1 | 2 | 1 | 2 | 3 | medium | Being replaced by ITIL (Version 5), and the framework is proprietary. | first pass: security |
| 43 | SAFe Agilist | SAFe | **15** | 4 | 3 | 1 | 1 | 2 | 1 | 3 | medium |  | first pass: project-business |
| 44 | PMI-PMOCP | PMI (licence) | **14** | 1 | 5 | 1 | 1 | 2 | 1 | 3 | long tail | Partnership-first note | long tail: agile-business |


## Skip or wait

| # | Exam | Family | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | LF Certified System Administrator | LF-other/Linux | **23** | 1 | 5 | 2 | 4 | 3 | 3 | 5 | long tail | Skip for now (prior) | long tail: cloud-platform |
| 2 | Certified Kubernetes Network Engineer | Kubernetes & CNCF | **22** | 1 | 4 | 3 | 5 | 1 | 4 | 4 | long tail | Wait | long tail: cloud-platform |
| 3 | ISTQB CTAL-AT v2.0 (Agile Tester) | ISTQB syllabus | **22** | 1 | 5 | 4 | 4 | 2 | 2 | 4 | long tail | Wait: just released | long tail: agile-business |
| 4 | LPI BSD Specialist | LPI | **22** | 1 | 4 | 2 | 4 | 3 | 4 | 4 | long tail | Skip for now | long tail: cloud-platform |
| 5 | AWS Solutions Architect Associate | AWS | **21** | 5 | 1 | 2 | 4 | 4 | 3 | 2 | head | Skip: highest demand but AWSomecards (free) + Brainscape + Crucial + many AnkiWeb decks; A | first pass: cloud |
| 6 | Administering M365 and AI Services | Microsoft | **21** | 1 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Wait | long tail: cloud-platform |
| 7 | Extending Power Platform with Code and AI | Microsoft | **21** | 1 | 4 | 3 | 4 | 2 | 3 | 4 | long tail | Wait | long tail: cloud-platform |
| 8 | Scrum.org PSM III | Scrum & Kanban (open guides) | **21** | 1 | 5 | 2 | 4 | 5 | 2 | 2 | long tail | Skip: essay exam | long tail: agile-business |
| 9 | ACCA | Accounting bodies | **20** | 4 | 2 | 3 | 3 | 1 | 4 | 3 | medium | Wait for the 2027 structure. OpenTuition already gives free flashcards. | first pass: finance |
| 10 | AWS AI Practitioner | AWS | **20** | 4 | 2 | 2 | 4 | 3 | 3 | 2 | medium | Skip: served by AWSomecards 280+, Brainscape, AnkiWeb 293-note deck | first pass: cloud |
| 11 | AWS Cloud Practitioner | AWS | **20** | 5 | 1 | 2 | 4 | 4 | 3 | 1 | head | Skip: saturated (AWSomecards free, Procensic 1,521-note AnkiWeb, Brainscape, Crucial) | first pass: cloud |
| 12 | AWS CloudOps Engineer Associate | AWS | **20** | 2 | 2 | 2 | 4 | 4 | 3 | 3 | long tail | Skip: AWSomecards covers it; low deck demand | first pass: cloud |
| 13 | Designing and Implementing Multi-Agent AI Solutions | Microsoft | **20** | 1 | 4 | 3 | 4 | 1 | 3 | 4 | long tail | Wait | long tail: cloud-platform |
| 14 | PCPP1 / PCPP2 Professional | PythonInst | **20** | 1 | 4 | 3 | 3 | 3 | 2 | 4 | long tail | Skip for now | long tail: cloud-platform |
| 15 | Power Platform Developer | Microsoft | **20** | 1 | 4 | 3 | 4 | 1 | 3 | 4 | long tail | Skip PL-400 | long tail: cloud-platform |
| 16 | Professional Agentic Architect | Google Cloud | **20** | 1 | 4 | 4 | 4 | 1 | 2 | 4 | long tail | Wait | long tail: cloud-platform |
| 17 | Scrum.org PSFS | Facilitation (no open source) | **20** | 1 | 5 | 1 | 4 | 5 | 1 | 3 | long tail | Skip | long tail: agile-business |
| 18 | Scrum.org PSPO III | Scrum & Kanban (open guides) | **20** | 1 | 5 | 2 | 4 | 5 | 1 | 2 | long tail | Skip: essay exam | long tail: agile-business |
| 19 | Vault Operations Professional | HashiCorp | **20** | 1 | 4 | 3 | 3 | 3 | 2 | 4 | long tail | Skip for now | long tail: cloud-platform |
| 20 | ASQ CMBB | Quality & Six Sigma | **19** | 1 | 5 | 2 | 4 | 4 | 1 | 2 | long tail | Skip: performance-based part | long tail: agile-business |
| 21 | Docker Certified Associate | Docker/Mirantis | **19** | 1 | 4 | 3 | 3 | 2 | 2 | 4 | long tail | Skip for now | long tail: cloud-platform |
| 22 | Microsoft 365 Administrator | Microsoft | **19** | 1 | 4 | 3 | 4 | 1 | 3 | 3 | long tail | Skip | long tail: cloud-platform |
| 23 | MongoDB certifications (catalogue not captured) | MongoDB | **19** | 1 | 4 | 2 | 3 | 3 | 2 | 4 | long tail | Skip for now | long tail: cloud-platform |
| 24 | Scrum.org PPDV | Product discovery (no open sourc | **19** | 1 | 5 | 1 | 4 | 4 | 1 | 3 | long tail | Skip | long tail: agile-business |
| 25 | AWS Developer Associate | AWS | **18** | 3 | 2 | 2 | 4 | 1 | 3 | 3 | medium | Wait: DVA-C02 ends 2026-12-01; reassess for C03 vs AWSomecards | first pass: cloud |
| 26 | AWS Security Specialty | AWS | **18** | 2 | 1 | 2 | 4 | 4 | 3 | 2 | long tail | Skip: AWSomecards 400+, Crucial 220, and a 426-card deck 'checked current Aug 2026' on Git | first pass: cloud |
| 27 | Elastic Certified Engineer / Analyst / Observability / SIEM | Elastic | **18** | 1 | 4 | 1 | 3 | 3 | 2 | 4 | long tail | Skip | long tail: cloud-platform |
| 28 | SnowPro Core | Snowflake | **18** | 1 | 5 | 1 | 3 | 3 | 1 | 4 | long tail | Avoid: no demand signal; site terms forbid derivative works | first pass: cloud |
| 29 | AWS Solutions Architect Professional | AWS | **17** | 2 | 2 | 2 | 4 | 1 | 3 | 3 | long tail | Wait: SAP-C02 ends 2026-11-17 | first pass: cloud |
| 30 | Oracle OCI certifications (catalogue not captured) | Oracle | **17** | 2 | 4 | 1 | 2 | 3 | 2 | 3 | long tail | Skip | long tail: cloud-platform |


## Terms forbid derivative use

| # | Exam | Family | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Data Engineering Solutions Using Azure Databricks | Microsoft | **22** | 1 | 4 | 3 | 4 | 3 | 3 | 4 | long tail | Later | long tail: cloud-platform |
| 2 | Tableau (Salesforce Certified Tableau Data Analyst) | Data | **20** | 2 | 4 | 3 | 3 | 2 | 2 | 4 | long tail |  | long tail: data-dev-health-other |
| 3 | Databricks Data Engineer Associate | Databricks | **19** | 2 | 5 | 1 | 3 | 2 | 2 | 4 | long tail | Avoid for now: no Anki supply but docs forbid derivative works and blueprint just restruct | first pass: cloud |
| 4 | Salesforce Platform Administrator | Salesforce | **19** | 3 | 4 | 1 | 2 | 3 | 3 | 3 | medium | Avoid: Program Terms make Trailhead learning content confidential/non-commercial | first pass: cloud |


## Not a deck target

| # | Exam | Family | Total | D | G | S | R | St | P | Se | Band | Verdict | Report |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Scrum Alliance CSPO | Scrum & Kanban (open guides) | **23** | 2 | 3 | 4 | 4 | 5 | 2 | 3 | long tail | Tag on PSPO deck (no exam seen) | long tail: agile-business |
| 2 | ICAgile ICP (Agile Fundamentals) | Agile Manifesto | **18** | 1 | 4 | 2 | 3 | 4 | 1 | 3 | long tail | Skip: course-based, no exam seen | long tail: agile-business |
| 3 | Scrum Alliance A-CSM | — | **18** | 1 | 3 | 3 | 4 | 4 | 1 | 2 | long tail | Skip: no exam (course plus experience) | long tail: agile-business |
| 4 | Scrum Alliance CSP-SM | — | **18** | 1 | 3 | 3 | 4 | 4 | 1 | 2 | long tail | Skip: no exam (course plus experience) | long tail: agile-business |
| 5 | Kanban University KMP | KU (all rights reserved) | **16** | 1 | 4 | 1 | 2 | 4 | 1 | 3 | long tail | Skip: course-based credential | long tail: agile-business |
| 6 | Scrum.org PSM-AI Essentials | — | **16** | 1 | 5 | 1 | 4 | 2 | 1 | 2 | long tail | Skip: course students only | long tail: agile-business |
| 7 | Scrum.org PSPO-AI Essentials | — | **16** | 1 | 5 | 1 | 4 | 2 | 1 | 2 | long tail | Skip: course students only | long tail: agile-business |

