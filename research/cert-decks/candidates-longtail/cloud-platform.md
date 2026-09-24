# Candidate scoring, pass 2: cloud, platform, DevOps and developer-tool vendors

Researched 2026-09-24. This pass covers **full catalogues**, including advanced, specialty and small exams. It builds on pass 1, which is kept in `/home/user/law-tome/research/cert-decks/candidates/cloud.md` and cited here as `[prior §x]`.

**Evidence rules used.**
- Every fact comes from a page fetched today. Raw copies are in `scratchpad/candidates2/raw-cloud/` (each `name.raw`, `.txt` and `.url`, where the `.url` file holds the URL and HTTP code). Pass-1 raw files are in `scratchpad/candidates/raw-cloud/`. Source keys in [brackets] are file names in those folders.
- Microsoft facts come from the Learn Catalog API (`ms_catalog.json`), 97 certification pages (`ms/`) and 62 study guides (`ms_sg/`).
- Linux Foundation and CNCF facts come from 22 LF certification pages (`lf/`), the CNCF 2025 Annual Report (`cncf_ar25_raw.txt`, re-extracted in reading order) and HTTP checks of the curriculum PDFs (`cncf_curricula_http.txt`).
- GitHub supply was checked with the GitHub MCP repository search, because `api.github.com/search` is blocked in this session. Queries and results are in `github_search_notes.txt`.
- Reddit: four search RSS feeds (top of the past year) in `rss/`, counted with `rsscount.py`. The r/kubernetes feed returned 100 posts, but none matched any cert name, so it looks as if the query was ignored and it is **not used**.
- **What could not be checked:**
  - **AnkiWeb search** is login-walled: `list-decks?search=` returned HTTP 429 with "Please log in to perform more searches." (`aw/ankiweb_search_blocked.txt`).
  - DuckDuckGo and Bing HTML returned bot challenges.
  - So AnkiWeb supply is known only for exams checked in pass 1. For every other exam, **Gap is capped at 4**.
  - **Search** scores for new exams are *inferred* from supply found, because no ranking query was run. Treat them as provisional.

**Scoring.** Scores run from 1 to 5, and higher is better. G is Gap (little supply) and St is Stability (low churn). The maximum is 35.
- Totals within about 2 points are ties.
- Rows marked "(prior)" keep their pass-1 scores unchanged, for comparability.
- Source defaults:
  - S5: an explicit open licence on the docs and outline (CNCF curriculum CC BY 4.0, GitHub docs CC BY 4.0, OTel CC BY 4.0, Apache 2.0 project docs).
  - S4: Azure docs, which are CC BY 4.0 [prior], although the MS study guides themselves carry no licence.
  - S3: other Microsoft product docs whose repo licence was not checked this pass, HashiCorp BUSL, and Python docs.
  - S2: LPI (its Learning Materials are CC BY-NC-ND) or unverified.
  - S1: a NoDerivatives licence (Elastic) or a copyright notice with no open licence seen (Oracle).
- Demand defaults: D1 means no candidate figure and no community signal was found. It does not mean there is proven zero demand.

## 1. Summary table (sorted by total)

| Exam | Code / version | Family | D | G | S | R | St | P | Se | Total | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Kubernetes & Cloud Native Associate | KCNA | CNCF-K8s | 3 | 4 | 5 | 5 | 4 | 4 | 4 | **29** | Build first (prior score kept) |
| Certified Kubernetes Administrator | CKA (K8s v1.35) | CNCF-K8s | 3 | 4 | 5 | 5 | 3 | 4 | 4 | **28** | Build (prior) |
| Certified Kubernetes Application Developer | CKAD (K8s v1.35) | CNCF-K8s | 3 | 4 | 5 | 5 | 3 | 5 | 3 | **28** | Build (prior) |
| Certified Kubernetes Security Specialist | CKS (exam K8s v1.35; curriculum PDF v1.34) | CNCF-K8s | 2 | 5 | 4 | 5 | 3 | 4 | 5 | **28** | Build (prior) |
| Kubernetes & Cloud Native Security Associate | KCSA | CNCF-K8s | 2 | 4 | 5 | 5 | 4 | 4 | 4 | **28** | Build with KCNA |
| Prometheus Certified Associate | PCA | CNCF-projects | 2 | 4 | 5 | 5 | 4 | 4 | 4 | **28** | Build (cheap add-on) |
| Designing Azure Infrastructure Solutions | AZ-305 | MS-Azure | 3 | 5 | 4 | 4 | 4 | 3 | 5 | **28** | Build (prior) |
| Certified Argo Project Associate | CAPA | CNCF-projects | 1 | 4 | 5 | 5 | 4 | 4 | 4 | **27** | Next (cheap add-on) |
| Istio Certified Associate | ICA | CNCF-projects | 2 | 4 | 5 | 5 | 3 | 4 | 4 | **27** | Next |
| OpenTelemetry Certified Associate | OTCA | CNCF-projects | 1 | 4 | 5 | 5 | 4 | 4 | 4 | **27** | Next (cheap add-on) |
| GitHub Foundations | GH-900 | GitHub | 3 | 4 | 5 | 4 | 4 | 3 | 4 | **27** | Build |
| Certified Backstage Associate | CBA | CNCF-projects | 1 | 4 | 4 | 5 | 4 | 4 | 4 | **26** | Next (add-on) |
| Certified GitOps Associate | CGOA | CNCF-projects | 1 | 4 | 4 | 5 | 4 | 4 | 4 | **26** | Next (add-on) |
| Cilium Certified Associate | CCA | CNCF-projects | 1 | 4 | 4 | 5 | 4 | 4 | 4 | **26** | Next (add-on) |
| Kyverno Certified Associate | KCA | CNCF-projects | 1 | 4 | 4 | 5 | 4 | 4 | 4 | **26** | Next (add-on) |
| GitHub Actions | GH-200 | GitHub | 2 | 4 | 5 | 4 | 4 | 3 | 4 | **26** | Next |
| Cloud Digital Leader | CDL (new guide 2026-08-12) | Google | 2 | 5 | 4 | 4 | 4 | 2 | 5 | **26** | Next (prior) |
| Azure Administrator | AZ-104 | MS-Azure | 5 | 3 | 4 | 4 | 4 | 3 | 3 | **26** | Next (prior) |
| Designing and Implementing Microsoft DevOps Solutions | AZ-400 | MS-Azure | 3 | 4 | 4 | 4 | 4 | 3 | 4 | **26** | Next |
| Cloud Native Platform Engineering Associate | CNPA | CNCF-projects | 1 | 4 | 4 | 5 | 3 | 4 | 4 | **25** | Later |
| Professional Cloud Architect | PCA (Google) | Google | 2 | 5 | 4 | 4 | 3 | 2 | 5 | **25** | Next (prior) |
| LPI Linux Essentials | 010-160 (v1.6) | LPI | 2 | 4 | 2 | 4 | 4 | 5 | 4 | **25** | Next (partner-first) |
| Azure AI Fundamentals | AI-901 | MS-AI | 3 | 5 | 4 | 4 | 2 | 3 | 4 | **25** | Later (prior) |
| Azure Fundamentals | AZ-900 | MS-Azure | 4 | 3 | 4 | 4 | 4 | 3 | 3 | **25** | Next (prior) |
| Azure Networking Solutions | AZ-700 | MS-Azure | 2 | 4 | 4 | 4 | 4 | 3 | 4 | **25** | Next |
| Administering Azure SQL Solutions | DP-300 | MS-Data | 2 | 4 | 4 | 4 | 4 | 3 | 4 | **25** | Next |
| Azure Data Fundamentals | DP-900 | MS-Data | 2 | 4 | 4 | 4 | 4 | 3 | 4 | **25** | Next (prior) |
| Certified Cloud Native Platform Engineer | CNPE | CNCF-projects | 1 | 4 | 4 | 5 | 2 | 4 | 4 | **24** | Later |
| GitHub Administration (Enterprise Administrator) | GH-100 | GitHub | 1 | 4 | 5 | 4 | 3 | 3 | 4 | **24** | Later |
| GitHub Advanced Security | GH-500 | GitHub | 2 | 3 | 5 | 4 | 3 | 3 | 4 | **24** | Next |
| GitHub Copilot | GH-300 | GitHub | 2 | 4 | 5 | 4 | 2 | 3 | 4 | **24** | Next |
| Terraform Associate | 004 (Terraform 1.12) | HashiCorp | 3 | 4 | 3 | 3 | 3 | 4 | 4 | **24** | Build if resourced (prior) |
| LPIC-1 | 101-500 + 102-500 (v5.0) | LPI | 3 | 3 | 2 | 4 | 4 | 5 | 3 | **24** | Next (partner-first) |
| Azure Virtual Desktop | AZ-140 | MS-Azure | 1 | 4 | 4 | 4 | 4 | 3 | 4 | **24** | Later |
| Power BI Data Analyst | PL-300 | MS-Data | 2 | 4 | 3 | 4 | 4 | 3 | 4 | **24** | Later |
| Power Platform Fundamentals | PL-900 | MS-PowerDyn | 2 | 4 | 3 | 4 | 4 | 3 | 4 | **24** | Later |
| Identity and Access Administrator | SC-300 | MS-Security | 2 | 4 | 3 | 4 | 4 | 3 | 4 | **24** | Later |
| Security, Compliance, and Identity Fundamentals | SC-900 | MS-Security | 3 | 4 | 3 | 4 | 3 | 3 | 4 | **24** | Next |
| GitLab certifications (catalogue not captured) | n/a | GitLab | 1 | 4 | 5 | 3 | 3 | 3 | 4 | **23** | Verify catalogue first |
| LF Certified System Administrator | LFCS | LF-other/Linux | 1 | 5 | 2 | 4 | 3 | 3 | 5 | **23** | Skip for now (prior) |
| LPI DevOps Tools Engineer | 701-200 (v2.0; v1.0 ended 2026-06-30) | LPI | 1 | 4 | 2 | 4 | 3 | 5 | 4 | **23** | Later |
| LPI Open Source Essentials | 050 | LPI | 1 | 4 | 2 | 4 | 3 | 5 | 4 | **23** | Later |
| LPI Security Essentials | (code not captured) | LPI | 1 | 4 | 2 | 4 | 3 | 5 | 4 | **23** | Later |
| LPI Web Development Essentials | (code not captured) | LPI | 1 | 4 | 2 | 4 | 3 | 5 | 4 | **23** | Later |
| Managing Microsoft Teams | MS-700 | MS-365 | 1 | 4 | 3 | 4 | 4 | 3 | 4 | **23** | Later |
| Managing and Securing M365 Endpoints (Intune) | MD-102 | MS-365 | 1 | 4 | 3 | 4 | 4 | 3 | 4 | **23** | Later |
| AI Business Professional | AB-730 | MS-AI | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Later |
| AI Transformation Leader | AB-731 | MS-AI | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Later |
| Developing AI Apps and Agents on Azure | AI-103 | MS-AI | 3 | 4 | 3 | 4 | 2 | 3 | 4 | **23** | Later |
| Administering Windows Server | AZ-802 (replaces AZ-800/801, which retire 2026-09-30) | MS-Azure | 1 | 4 | 4 | 4 | 3 | 3 | 4 | **23** | Later |
| Azure for SAP Workloads | AZ-120 | MS-Azure | 1 | 4 | 4 | 4 | 4 | 2 | 4 | **23** | Later |
| Implementing Analytics Solutions Using Fabric | DP-600 | MS-Data | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Later |
| Implementing Data Engineering Solutions Using Fabric | DP-700 | MS-Data | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Later |
| Security Operations Analyst | SC-200 | MS-Security | 2 | 4 | 3 | 4 | 3 | 3 | 4 | **23** | Later |
| Certified Kubernetes Network Engineer | CKNE (beta closed) | CNCF-K8s | 1 | 4 | 3 | 5 | 1 | 4 | 4 | **22** | Wait |
| Associate Data Practitioner | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Generative AI Leader | - | Google | 2 | 4 | 4 | 4 | 2 | 2 | 4 | **22** | Later |
| Professional Cloud Database Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Cloud DevOps Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Cloud Developer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Cloud Network Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Cloud Security Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Data Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Professional Security Operations Engineer | - | Google | 1 | 4 | 4 | 4 | 3 | 2 | 4 | **22** | Later |
| Vault Associate | 003 | HashiCorp | 2 | 4 | 3 | 3 | 3 | 3 | 4 | **22** | Later |
| Confluent Certified Developer for Apache Kafka | CCDAK | Kafka | 2 | 4 | 4 | 3 | 3 | 2 | 4 | **22** | Later |
| LPI BSD Specialist | 702 | LPI | 1 | 4 | 2 | 4 | 3 | 4 | 4 | **22** | Skip for now |
| LPIC-2 | 201 + 202 | LPI | 1 | 4 | 2 | 4 | 3 | 4 | 4 | **22** | Later |
| LPIC-3 (Mixed Env / Security / Virtualization / HA) | 300 / 303 / 305 / 306 | LPI | 1 | 4 | 2 | 4 | 3 | 4 | 4 | **22** | Later |
| Collaboration Communications Systems Engineer | MS-721 | MS-365 | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| Copilot and Agent Administration Fundamentals | AB-900 | MS-365 | 2 | 3 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| Agentic AI Business Solutions Architect | AB-100 | MS-AI | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| Developing AI Cloud Solutions on Azure | AI-200 | MS-AI | 2 | 4 | 3 | 4 | 2 | 3 | 4 | **22** | Later |
| Building AI Applications with Azure Cosmos DB | DP-420 | MS-Data | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| Data Engineering Solutions Using Azure Databricks | DP-750 | MS-Data | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| Developing AI-Enabled Database Solutions | DP-800 | MS-Data | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| D365 Business Central Developer | MB-820 | MS-PowerDyn | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| D365 Business Central Functional Consultant | MB-800 | MS-PowerDyn | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| D365 Customer Service Functional Consultant | MB-230 | MS-PowerDyn | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| D365 Finance Functional Consultant | MB-310 | MS-PowerDyn | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| D365 Finance and Operations Apps Developer | MB-500 | MS-PowerDyn | 1 | 4 | 3 | 4 | 4 | 2 | 4 | **22** | Later |
| Administering Information Security in M365 | SC-401 | MS-Security | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| Cybersecurity Architect | SC-100 | MS-Security | 1 | 4 | 3 | 4 | 3 | 3 | 4 | **22** | Later |
| End-to-End Security Controls for Cloud and AI | SC-500 | MS-Security | 2 | 4 | 3 | 4 | 2 | 3 | 4 | **22** | Later |
| Neo4j Certified Professional | free exam | Neo4j | 1 | 4 | 3 | 3 | 4 | 3 | 4 | **22** | Later |
| AWS Certified Data Engineer Associate | DEA-C01 | AWS | 2 | 3 | 2 | 4 | 4 | 3 | 3 | **21** | Later (only AWS gap) |
| GitHub Certified: Agentic AI Developer | GH-600 | GitHub | 2 | 3 | 4 | 4 | 2 | 3 | 3 | **21** | Later |
| Associate Cloud Engineer | ACE | Google | 2 | 3 | 4 | 4 | 3 | 2 | 3 | **21** | Later (prior) |
| Professional Machine Learning Engineer | - | Google | 1 | 4 | 4 | 4 | 2 | 2 | 4 | **21** | Later |
| Terraform Authoring and Operations Advanced | (Professional-level; code not captured) | HashiCorp | 1 | 4 | 3 | 3 | 3 | 3 | 4 | **21** | Later |
| Confluent Certified Administrator for Apache Kafka | CCAAK | Kafka | 1 | 4 | 4 | 3 | 3 | 2 | 4 | **21** | Later |
| LF Certified IT Associate | LFCA | LF-other | 1 | 4 | 2 | 4 | 3 | 3 | 4 | **21** | Later |
| PyTorch Certified Associate | PTCA | LF-other | 1 | 4 | 2 | 4 | 3 | 3 | 4 | **21** | Later |
| Administering M365 and AI Services | AB-650 (beta) | MS-365 | 1 | 4 | 3 | 4 | 2 | 3 | 4 | **21** | Wait |
| Building Intelligent Applications | AB-410 | MS-AI | 1 | 4 | 3 | 4 | 2 | 3 | 4 | **21** | Later |
| Integrated AI Agent Solutions in Copilot Studio | AB-620 | MS-AI | 1 | 4 | 3 | 4 | 2 | 3 | 4 | **21** | Later |
| Operationalizing ML and GenAI Solutions | AI-300 | MS-AI | 1 | 4 | 3 | 4 | 2 | 3 | 4 | **21** | Later |
| D365 Supply Chain Management Functional Consultant | MB-330 | MS-PowerDyn | 1 | 4 | 3 | 4 | 3 | 2 | 4 | **21** | Later |
| Extending Power Platform with Code and AI | AB-400 | MS-PowerDyn | 1 | 4 | 3 | 4 | 2 | 3 | 4 | **21** | Wait |
| PCAP Certified Associate in Python Programming | PCAP-31-03 | PythonInst | 2 | 4 | 3 | 3 | 3 | 2 | 4 | **21** | Later |
| Associate Google Workspace Administrator | - | Google | 1 | 4 | 2 | 4 | 3 | 2 | 4 | **20** | Later |
| Professional Agentic Architect | (Beta) | Google | 1 | 4 | 4 | 4 | 1 | 2 | 4 | **20** | Wait |
| Vault Operations Professional | (code not captured) | HashiCorp | 1 | 4 | 3 | 3 | 3 | 2 | 4 | **20** | Skip for now |
| Model Context Protocol Associate | MCPA | LF-other | 1 | 4 | 2 | 4 | 2 | 3 | 4 | **20** | Later |
| Designing and Implementing Multi-Agent AI Solutions | AI-500 (beta) | MS-AI | 1 | 4 | 3 | 4 | 1 | 3 | 4 | **20** | Wait |
| Accelerating Sales Pipelines with AI in D365 | AB-210 | MS-PowerDyn | 1 | 4 | 3 | 4 | 2 | 2 | 4 | **20** | Later |
| Contact Center Experiences with AI in D365 | AB-250 | MS-PowerDyn | 1 | 4 | 3 | 4 | 2 | 2 | 4 | **20** | Later |
| Power Platform Developer | PL-400 -> AB-400 (from 2026-10-16) | MS-PowerDyn | 1 | 4 | 3 | 4 | 1 | 3 | 4 | **20** | Skip PL-400 |
| PCEP Certified Entry-Level Python Programmer | PCEP-30-02 (30-03 in development) | PythonInst | 2 | 4 | 3 | 3 | 2 | 2 | 4 | **20** | Later |
| PCPP1 / PCPP2 Professional | PCPP1 / PCPP2-32-0x | PythonInst | 1 | 4 | 3 | 3 | 3 | 2 | 4 | **20** | Skip for now |
| Red Hat Certified System Administrator | EX200 (RHEL 10) | RedHat | 2 | 4 | 2 | 3 | 3 | 3 | 3 | **20** | Later (prior) |
| Docker Certified Associate | DCA (study guide v1.5, Jan 2025) | Docker/Mirantis | 1 | 4 | 3 | 3 | 2 | 2 | 4 | **19** | Skip for now |
| Microsoft 365 Administrator | MS-102 (retires 2026-11-30) | MS-365 | 1 | 4 | 3 | 4 | 1 | 3 | 3 | **19** | Skip |
| MongoDB certifications (catalogue not captured) | not verified | MongoDB | 1 | 4 | 2 | 3 | 3 | 2 | 4 | **19** | Skip for now |
| Elastic Certified Engineer / Analyst / Observability / SIEM | not captured | Elastic | 1 | 4 | 1 | 3 | 3 | 2 | 4 | **18** | Skip |
| Oracle OCI certifications (catalogue not captured) | not verified | Oracle | 2 | 4 | 1 | 2 | 3 | 2 | 3 | **17** | Skip |

116 rows scored. The one AWS row is a note; the other AWS exams keep their pass-1 scores (see `candidates/cloud.md` §1) and are not repeated here.

## 2. Deck families (shared sources)

| Family | Exams | Best score | Shared source |
|---|---|---|---|
| CNCF-K8s | KCNA, CKA, CKAD, CKS, KCSA, CKNE | 29 | CNCF curriculum PDFs (CC BY 4.0) + kubernetes.io (CC BY 4.0) |
| CNCF-projects | PCA, CAPA, ICA, OTCA, CBA, CGOA, CCA, KCA, CNPA, CNPE | 28 | CNCF curriculum PDFs (CC BY 4.0) + each project's docs (Apache 2.0 / CC BY 4.0; check per project) |
| MS-Azure | AZ-305, AZ-104, AZ-400, AZ-900, AZ-700, AZ-140, AZ-802, AZ-120 | 28 | MicrosoftDocs/azure-docs (CC BY 4.0) + study guides |
| GitHub | GH-900, GH-200, GH-100, GH-500, GH-300, GH-600 | 27 | github/docs (CC BY 4.0) + MS study guide outline |
| Google | CDL, PCA, Associate Data Practitioner, Generative AI Leader, Professional Cloud Database Engineer, Professional Cloud DevOps Engineer, Professional Cloud Developer, Professional Cloud Network Engineer, Professional Cloud Security Engineer, Professional Data Engineer, Professional Security Operations Engineer, ACE, Professional Machine Learning Engineer, Associate Google Workspace Administrator, Professional Agentic Architect | 26 | cloud.google.com docs (CC BY 4.0 [prior]) + exam guide PDFs |
| LPI | 010-160, 101-500, 701-200, 050, LPI Security Essentials, LPI Web Development Essentials, 702, 201, 300 | 25 | LPI objectives + Learning Materials (CC BY-NC-ND 4.0 - partner contract needed for derivatives) |
| MS-AI | AI-901, AB-730, AB-731, AI-103, AB-100, AI-200, AB-410, AB-620, AI-300, AI-500 | 25 | MS Learn AI docs (licence per repo not checked) + study guides |
| MS-Data | DP-300, DP-900, PL-300, DP-600, DP-700, DP-420, DP-750, DP-800 | 25 | MS Learn data/Fabric docs + study guides |
| HashiCorp | 004, 003, Terraform Authoring and Operations Advanced, Vault Operations Professional | 24 | developer.hashicorp.com (BUSL, non-paid grant) |
| MS-PowerDyn | PL-900, MB-820, MB-800, MB-230, MB-310, MB-500, MB-330, AB-400, AB-210, AB-250, PL-400 | 24 | MS Learn Power Platform/Dynamics docs + study guides |
| MS-Security | SC-300, SC-900, SC-200, SC-401, SC-100, SC-500 | 24 | MS Learn security docs + study guides |
| GitLab | GitLab certifications (catalogue not captured) | 23 | docs.gitlab.com (CC BY-SA 4.0) |
| LF-other/Linux | LFCS | 23 | LF domain list + man pages |
| MS-365 | MS-700, MD-102, MS-721, AB-900, AB-650, MS-102 | 23 | MS Learn M365 docs + study guides |
| Kafka | CCDAK, CCAAK | 22 | kafka.apache.org (Apache 2.0) |
| Neo4j | Neo4j Certified Professional | 22 | Neo4j docs ('Creative Commons 4.0', variant unverified) |
| AWS | DEA-C01 | 21 | AWS docs (personal use only) |
| LF-other | LFCA, PTCA, MCPA | 21 | LF domain lists (no open curriculum) + upstream docs |
| PythonInst | PCAP-31-03, PCEP-30-02, PCPP1 | 21 | Python Institute syllabus + docs.python.org (PSF) |
| RedHat | EX200 | 20 | EX200 objectives + man pages (Red Hat docs licence unverified) |
| Docker/Mirantis | DCA | 19 | DCA study guide + docker/docs (Apache 2.0) |
| MongoDB | MongoDB certifications (catalogue not captured) | 19 | MongoDB docs (licence not found) |
| Elastic | Elastic Certified Engineer / Analyst / Observability / SIEM | 18 | Elastic docs (CC BY-NC-ND 4.0) |
| Oracle | Oracle OCI certifications (catalogue not captured) | 17 | Oracle docs (© Oracle; no open licence seen) |

## 3. Retired or retiring exams (excluded or flagged)

Microsoft's retirement page (`ms_retired.txt`, last updated 2026-07-09) and the study guides list these as retired in 2026: MS-900 (2026-03-31), DP-100 (06-01), AI-102, AI-900, MB-240, MB-335, MB-700, PL-500 and PL-600 (06-30), AZ-204 and MB-280 (07-31), and AZ-500 and PL-200 (08-31).

These are still scheduled to retire:
- **AZ-800 and AZ-801 retire on 2026-09-30.** AZ-802 replaces them.
- **MS-102 retires on 2026-11-30.**
- **PL-400 can be taken until 2026-10-30.** AB-400 is available from 2026-10-16.

The catalog also marks these certifications retired: Azure Security Engineer, Azure Developer, Azure AI Engineer, Azure Data Scientist, Power Platform Functional Consultant, Power Automate RPA, D365 Customer Experience Analyst, and Microsoft 365 Fundamentals (`ms/*.txt`, "Warning This certification ... retired").

Other bodies:
- **LPI:** DevOps Tools Engineer 701-100 ran "until June 30, 2026".
- **HashiCorp:** Consul Associate is not on the current certification hub.
- **LF:** OpenSearch Certified Associate is "Coming Soon", and CKNE's beta is closed.
- **Google:** Professional Agentic Architect is in beta, "open until September 30".

## 4. Evidence by exam

### CNCF-K8s

Shared: CNCF curriculum README: 'The Curriculum is available under the CC-BY 4.0+ License' and 'CNCF encourages training companies to align their offerings' [cncf_readme]. Every curriculum PDF linked from the LF pages returns 200 [cncf_curricula_http]. Kubestronaut needs CKA, CKAD, CKS, KCNA and KCSA. Golden Kubestronaut needs 'CKA, CKAD, CKS, KCNA, KCSA, PCA, ICA, CCA, CAPA, CGOA, CBA, OTCA, KCA, CNPA, CNPE' plus LFCS [prior kubestronaut.txt], and the directory lists 528 Golden Kubestronauts [prior]. Rules: the LF agreement covers exam content only [prior rules-risks §1]. Prices: associate MCQ exams are $250 and performance-based exams $445 (list prices seen on the pages; bundles also shown).

- **Kubernetes & Cloud Native Associate** (KCNA). Scores D3 G4 S5 R5 St4 P4 Se4 = **29**. Prior pass §3.16. 31,000 registrations (+72%) [AR25]. MCQ, 90 min, $250 [lf_kcna]. Curriculum PDF KCNA_Curriculum.pdf, CC BY 4.0 [cncf_readme, cncf_curricula_http]. No free deck beyond 1-star GitHub; paid flashkube [prior].
- **Certified Kubernetes Administrator** (CKA (K8s v1.35)). Scores D3 G4 S5 R5 St3 P4 Se4 = **28**. Prior §3.17. 291,000 enrollments [AR25]. Performance-based, 2 h [lf_cka]; curriculum CKA_Curriculum_v1.35.pdf. GitHub 'cka anki': only joshka0/k8s-cka-study 0* (2026-08).
- **Certified Kubernetes Application Developer** (CKAD (K8s v1.35)). Scores D3 G4 S5 R5 St3 P5 Se3 = **28**. Prior §3.18. 131,000 registrations [AR25]. GitHub adds quibueno/CKAD, lquirino-work/CKAD (0*, 2023, 'Anki CKAD').
- **Certified Kubernetes Security Specialist** (CKS (exam K8s v1.35; curriculum PDF v1.34)). Scores D2 G5 S4 R5 St3 P4 Se5 = **28**. Prior §3.19. 75,000 registrations [AR25]. LF page says 'based on Kubernetes v1.35' but links 'CKS_Curriculum v1.34.pdf' [lf_cks] - curriculum lags the exam.
- **Kubernetes & Cloud Native Security Associate** (KCSA). Scores D2 G4 S5 R5 St4 P4 Se4 = **28**. 10,000 registrations (+90% on 2024) [AR25]. MCQ, 90 min, $250 [lf_kcsa]. 'KCSA Curriculum.pdf' exists, CC BY 4.0. Required for Kubestronaut ('currently CKA, CKAD, CKS, KCNA, KCSA') [prior kubestronaut.txt]. GitHub 'anki kcsa' = 0 results. flashkube title lists KCSA [prior, search title only]. AnkiWeb not searchable this pass.
- **Certified Kubernetes Network Engineer** (CKNE (beta closed)). Scores D1 G4 S3 R5 St1 P4 Se4 = **22**. 'The beta is now closed. Please complete this form to be notified when CKNE is available' [lf_ckne]. Performance-based, 2 h. No curriculum PDF link seen.

### CNCF-projects

Shared: as CNCF-K8s. These exams exist mainly for Golden Kubestronaut completers, so demand is small (AR25 figures range from 170 to 4,400 registrations) but tied to a named, reachable community. Each associate exam is multiple-choice, which suits flashcards, except ICA (partly performance-based) and CNPE (performance-based).

- **Prometheus Certified Associate** (PCA). Scores D2 G4 S5 R5 St4 P4 Se4 = **28**. 4,400 registrations (+44%) [AR25]. MCQ, 90 min, $250 [lf_pca]. PCA_Curriculum.pdf CC BY. prometheus/docs repo LICENSE = Apache 2.0; prometheus.io footer '© Prometheus Authors 2014- Apache 2 License' [prom_docs_license, prom_docs]. No deck in GitHub queries.
- **Certified Argo Project Associate** (CAPA). Scores D1 G4 S5 R5 St4 P4 Se4 = **27**. No registration figure in AR25. MCQ, 90 min [lf_capa]. CAPA_Curriculum.pdf CC BY. argoproj/argo-cd LICENSE Apache 2.0 [argo_license].
- **Istio Certified Associate** (ICA). Scores D2 G4 S5 R5 St3 P4 Se4 = **27**. 3,100 registrations (+94%) [AR25]. 'online, proctored, performance-based and multiple-choice exam' [lf_ica] - partly hands-on. istio/istio.io repo LICENSE Apache 2.0 [istio_web_license]; site footer '© 2026 the Istio Authors'.
- **OpenTelemetry Certified Associate** (OTCA). Scores D1 G4 S5 R5 St4 P4 Se4 = **27**. 1,420 registrations since Nov 2024 launch [AR25]. MCQ, 90 min [lf_otca]. opentelemetry.io repo LICENSE = CC BY 4.0 [otel_docs_license].
- **Certified Backstage Associate** (CBA). Scores D1 G4 S4 R5 St4 P4 Se4 = **26**. 895 registrations since Nov 2024 [AR25]. MCQ, 90 min [lf_cba]. backstage repo LICENSE Apache 2.0, but backstage.io docs footer 'Copyright © 2026 Backstage Project Authors. All rights reserved.' [backstage_docs] - mixed signal.
- **Certified GitOps Associate** (CGOA). Scores D1 G4 S4 R5 St4 P4 Se4 = **26**. No figure in AR25. 'online, proctored, multiple-choice test' [lf_cgoa]; domains 'GitOps Terminology 20%', 'GitOps Principles 30%'... CGOA_Curriculum.pdf CC BY. OpenGitOps principles licence not checked.
- **Cilium Certified Associate** (CCA). Scores D1 G4 S4 R5 St4 P4 Se4 = **26**. No figure in AR25. MCQ, 90 min [lf_cca]. cilium/cilium repo LICENSE Apache 2.0; docs.cilium.io footer '© Copyright Cilium Authors' (docs licence line not seen) [cilium_license, cilium_docs].
- **Kyverno Certified Associate** (KCA). Scores D1 G4 S4 R5 St4 P4 Se4 = **26**. 790 registrations since Nov 2025 launch [AR25]. MCQ, 90 min [lf_kca]. KCA_Curriculum.pdf CC BY. Kyverno docs licence not checked.
- **Cloud Native Platform Engineering Associate** (CNPA). Scores D1 G4 S4 R5 St3 P4 Se4 = **25**. 720 registrations since Apr 2025 [AR25]. MCQ, 120 min [lf_cnpa]. CNPA_Curriculum.pdf CC BY; spans many projects.
- **Certified Cloud Native Platform Engineer** (CNPE). Scores D1 G4 S4 R5 St2 P4 Se4 = **24**. 170 registrations since Nov 2025 [AR25]. Performance-based, 2 h [lf_cnpe]. New and hands-on.

### LF-other

- **LF Certified IT Associate** (LFCA). Scores D1 G4 S2 R4 St3 P3 Se4 = **21**. MCQ, 90 min [lf_lfca]; domains Linux 16%, SysAdmin 30%, Cloud 18%, Security 14%, DevOps 12%. No CC BY curriculum found for LFCA.
- **PyTorch Certified Associate** (PTCA). Scores D1 G4 S2 R4 St3 P3 Se4 = **21**. MCQ, 120 min [lf_ptca]. PyTorch docs licence not checked.
- **Model Context Protocol Associate** (MCPA). Scores D1 G4 S2 R4 St2 P3 Se4 = **20**. MCQ, 90 min, $250 [lf_mcpa]; 'MCP Fundamentals 16%, Architecture & Components 14%'. Spec licence not checked. New, fast-moving topic.

### LF-other/Linux

- **LF Certified System Administrator** (LFCS). Scores D1 G5 S2 R4 St3 P3 Se5 = **23**. Prior §3.21. Required for Golden Kubestronaut [kubestronaut.txt]. r/linuxadmin top-year feed: 4 of 40 posts mention LFCS (e.g. 'Kodekloud LFCS mock exams', 2026-06-06) [rss/linux_certs].

### GitHub

Shared: GitHub exams are delivered through Microsoft Learn (GitHub certifications appear in `ms_catalog.json`, and the study guides are on learn.microsoft.com), so Microsoft's NDA, disclaimer and trademark rules apply [prior rules-risks]. github/docs is dual-licensed: 'Creative Commons Attribution 4.0 - for documentation and content in the assets, content, and data folders', MIT for code [gh_docs_readme, gh_docs_license]. This is the cleanest vendor-docs licence in the set. r/github top-year feed for certification queries: 32 posts, 27 about certification, 0 deck posts [rss/github_certs].

- **GitHub Foundations** (GH-900). Scores D3 G4 S5 R4 St4 P3 Se4 = **27**. Study guide 'Skills at a glance as of January 2026' [ms_sg/gh-900]; cert listed as 'fundamentals' in MS catalog [ms_catalog.json]. r/github top-year cert feed: 12 of 32 posts mention GH-900/Foundations (e.g. 'Gh-900 for free for students', 2026-08-15) [rss/github_certs]. github/docs README: 'Creative Commons Attribution 4.0 - for documentation and content' [gh_docs_readme]. No GH-900 deck in GitHub queries; Crucial does not list GH exams [prior crucial_home].
- **GitHub Actions** (GH-200). Scores D2 G4 S5 R4 St4 P3 Se4 = **26**. 'Skills measured as of January 2026' [ms_sg/gh-200]. 1 r/github mention. Docs CC BY 4.0. No deck found.
- **GitHub Administration (Enterprise Administrator)** (GH-100). Scores D1 G4 S5 R4 St3 P3 Se4 = **24**. Study guide title 'GitHub Enterprise Administrator', 'Skills measured as of July 2026' [ms_sg/gh-100]. 0 r/github mentions.
- **GitHub Advanced Security** (GH-500). Scores D2 G3 S5 R4 St3 P3 Se4 = **24**. 'Skills measured as of July 2026' [ms_sg/gh-500]. envico801/GitHub-Advanced-Security 5* 'Work in progress - Not finished ... anki flashcards' (2026-05-30).
- **GitHub Copilot** (GH-300). Scores D2 G4 S5 R4 St2 P3 Se4 = **24**. 'Skills measured as of August 7, 2026' with change table [ms_sg/gh-300]. Copilot features churn. 2 r/github mentions.
- **GitHub Certified: Agentic AI Developer** (GH-600). Scores D2 G3 S4 R4 St2 P3 Se3 = **21**. Role-based cert [ms_catalog]. r/github: 'GH-600: New GitHub Certified Agentic AI Developer Announcement and Beta Release' (2026-05-14). Vishal3698/gh-600-study-guide 3*, 'installable Anki flashcard deck', updated 2026-09-17 - already served for free.

### MS-Azure

Shared: see [prior §Microsoft shared]. The azure-docs LICENSE is CC BY 4.0 [msdocs_azure_license]. r/AzureCertification top-year feed on 14 exam codes: 100 posts, 0 deck posts. Mention counts (the query is biased toward listed codes): AZ-104 68, AZ-900 22, AZ-305 11, AI-103 6, SC-900 6, AZ-204 6, AZ-400 4, AZ-700 4, SC-300 2, AB-900 2, SC-200 1, DP-600 1, DP-700 1, SC-401 1; PL-300, DP-900, MS-102 and MD-102 0 [rss/azure_exams]. Crucial Exams (paid) flashcard counts are from the pass-1 homepage [prior crucial_home.txt]. Crucial does **not** list AZ-700, AZ-140, AZ-120, AZ-802, DP-300, DP-420, DP-600, DP-750, DP-800, SC-100, SC-300, SC-401, MS-700, MS-721, PL-900, the AB-2xx/4xx/6xx/7xx exams, MB-* or GH-*.

- **Designing Azure Infrastructure Solutions** (AZ-305). Scores D3 G5 S4 R4 St4 P3 Se5 = **28**. Prior §3.10. 11/100 mentions [rss/azure_exams]. 'Skills measured as of April 17, 2026'.
- **Azure Administrator** (AZ-104). Scores D5 G3 S4 R4 St4 P3 Se3 = **26**. Prior §3.9. Most-mentioned: 68/100 [rss/azure_exams]. New GitHub decks: juansasoc 4* (2026-08), Invincibear 1*, envico801 WIP.
- **Designing and Implementing Microsoft DevOps Solutions** (AZ-400). Scores D3 G4 S4 R4 St4 P3 Se4 = **26**. DevOps Engineer Expert [ms/devops-engineer]. 'Skills measured as of July 27, 2026' [ms_sg/az-400]. 4/100 mentions ('Got my AZ-400!', 2026-04-01). Crucial 168 cards (paid). No free deck found in GitHub queries.
- **Azure Fundamentals** (AZ-900). Scores D4 G3 S4 R4 St4 P3 Se3 = **25**. Prior §3.8. 'Skills measured as of July 20, 2026' [ms_sg/az-900]. 22 of 100 r/AzureCertification top-year posts mention it [rss/azure_exams]. Crucial 216 cards.
- **Azure Networking Solutions** (AZ-700). Scores D2 G4 S4 R4 St4 P3 Se4 = **25**. 'Skills measured as of July 27, 2026' [ms_sg/az-700]. 4/100 mentions. Not on Crucial list. No deck found.
- **Azure Virtual Desktop** (AZ-140). Scores D1 G4 S4 R4 St4 P3 Se4 = **24**. Specialty [ms/azure-virtual-desktop-specialty]. 'Skills measured as of July 20, 2026'. Not in RSS query.
- **Administering Windows Server** (AZ-802 (replaces AZ-800/801, which retire 2026-09-30)). Scores D1 G4 S4 R4 St3 P3 Se4 = **23**. 'Related exams AZ-800 and AZ-801 will retire on September 30, 2026 ... AZ-802 will remain as the available path' [ms/windows-server-administrator-associate].
- **Azure for SAP Workloads** (AZ-120). Scores D1 G4 S4 R4 St4 P2 Se4 = **23**. Specialty. 'Skills measured as of April 17, 2026' [ms_sg/az-120].

### MS-AI

Shared: Microsoft's AI line changed fastest. The retirement list shows AI-102, AI-900, DP-100 and AZ-204 retired in June and July 2026, and AI-500 and AB-650 are still beta. Stability is therefore scored at most 3.

- **Azure AI Fundamentals** (AI-901). Scores D3 G5 S4 R4 St2 P3 Se4 = **25**. Prior §3.11. AI-900 retired 2026-06-30 [ms_retired].
- **AI Business Professional** (AB-730). Scores D2 G4 S3 R4 St3 P3 Se4 = **23**. 'Skills measured as of October 20, 2026' [ms_sg/ab-730]. Launch post 'Microsoft launches 3 new AI-focused certifications (AB-900, AB-730, AB-731)' (2025-11-11) [rss/azure_exams].
- **AI Transformation Leader** (AB-731). Scores D2 G4 S3 R4 St3 P3 Se4 = **23**. 'Skills measured as of July 22, 2026' [ms_sg/ab-731].
- **Developing AI Apps and Agents on Azure** (AI-103). Scores D3 G4 S3 R4 St2 P3 Se4 = **23**. Azure AI Apps and Agents Developer Associate. 'Skills measured as of April 16, 2026' [ms_sg/ai-103]. 6/100 mentions ('Passed Azure ai 103 in first attempt', 2026-09-16). Crucial 225 cards. Replaces retired AI-102 (2026-06-30) [ms_retired]. AI docs repo licence not checked.
- **Agentic AI Business Solutions Architect** (AB-100). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. Expert cert. 'Skills measured as of October 14, 2026' (outline changes in 3 weeks) [ms_sg/ab-100].
- **Developing AI Cloud Solutions on Azure** (AI-200). Scores D2 G4 S3 R4 St2 P3 Se4 = **22**. Azure AI Cloud Developer Associate [ms catalog]; AZ-204 retired 2026-07-31 [ms_retired]. Crucial 234 cards. 0 mentions.
- **Building Intelligent Applications** (AB-410). Scores D1 G4 S3 R4 St2 P3 Se4 = **21**. Intelligent Applications Builder Associate.
- **Integrated AI Agent Solutions in Copilot Studio** (AB-620). Scores D1 G4 S3 R4 St2 P3 Se4 = **21**. AI Agent Builder Associate [ms/ai-agent-builder-associate].
- **Operationalizing ML and GenAI Solutions** (AI-300). Scores D1 G4 S3 R4 St2 P3 Se4 = **21**. MLOps Engineer Associate; DP-100 retired 2026-06-01 [ms_retired].
- **Designing and Implementing Multi-Agent AI Solutions** (AI-500 (beta)). Scores D1 G4 S3 R4 St1 P3 Se4 = **20**. Catalog title 'AI-500 ... (beta)' [ms_catalog]. Crucial 193 cards.

### MS-Data

Shared: a 'Skills measured as of' date in October 2026 means the outline changes within weeks, so build to the new outline (Stability 3).

- **Administering Azure SQL Solutions** (DP-300). Scores D2 G4 S4 R4 St4 P3 Se4 = **25**. Azure Database Administrator Associate. 'Skills measured as of April 24, 2026' [ms_sg/dp-300]. Not on Crucial list. Not in RSS query.
- **Azure Data Fundamentals** (DP-900). Scores D2 G4 S4 R4 St4 P3 Se4 = **25**. Prior §3.12. 0/100 mentions this pass [rss/azure_exams].
- **Power BI Data Analyst** (PL-300). Scores D2 G4 S3 R4 St4 P3 Se4 = **24**. 'Skills measured as of April 20, 2026' [ms_sg/pl-300]. 0/100 mentions in r/AzureCertification (r/PowerBI not queried). Crucial 112 cards.
- **Implementing Analytics Solutions Using Fabric** (DP-600). Scores D2 G4 S3 R4 St3 P3 Se4 = **23**. Fabric Analytics Engineer. 'Skills measured as of October 19, 2026' (change imminent) [ms_sg/dp-600]. 1 mention. Fabric docs licence not checked.
- **Implementing Data Engineering Solutions Using Fabric** (DP-700). Scores D2 G4 S3 R4 St3 P3 Se4 = **23**. 'Skills measured as of October 19, 2026' [ms_sg/dp-700]. Crucial 100 cards.
- **Building AI Applications with Azure Cosmos DB** (DP-420). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. Cosmos DB Developer Specialty. 'Skills measured as of October 6, 2026' [ms_sg/dp-420].
- **Data Engineering Solutions Using Azure Databricks** (DP-750). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. New cert [ms catalog]. 'Skills measured as of October 19, 2026'. Databricks' own docs forbid derivative works [prior §2]; Azure Databricks docs licence on Learn not checked.
- **Developing AI-Enabled Database Solutions** (DP-800). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. SQL AI Developer Associate. 'Skills measured as of October 19, 2026'.

### MS-Security

Shared: AZ-500 retired 2026-08-31 and SC-500 is its nearest successor (a judgment; Microsoft's mapping was not read).

- **Identity and Access Administrator** (SC-300). Scores D2 G4 S3 R4 St4 P3 Se4 = **24**. 'Skills measured as of April 27, 2026' [ms_sg/sc-300]. 2 mentions. Not on Crucial list.
- **Security, Compliance, and Identity Fundamentals** (SC-900). Scores D3 G4 S3 R4 St3 P3 Se4 = **24**. 'Skills measured as of October 21, 2026' (change imminent) [ms_sg/sc-900]. 6/100 mentions ('Passed SC-900 on first try!', 2026-05-18). Crucial 167 cards.
- **Security Operations Analyst** (SC-200). Scores D2 G4 S3 R4 St3 P3 Se4 = **23**. 'Skills measured as of October 21, 2026'. 1 mention ('I failed sc-200'). Crucial 103 cards.
- **Administering Information Security in M365** (SC-401). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. 'Skills measured as of October 28, 2026' [ms_sg/sc-401].
- **Cybersecurity Architect** (SC-100). Scores D1 G4 S3 R4 St3 P3 Se4 = **22**. 'Skills measured as of October 21, 2026'. 0 mentions.
- **End-to-End Security Controls for Cloud and AI** (SC-500). Scores D2 G4 S3 R4 St2 P3 Se4 = **22**. Cloud and AI Security Engineer Associate; AZ-500 'was retired on August 31, 2026' [ms_sg/az-500]. Crucial 212 cards.

### MS-365

- **Managing Microsoft Teams** (MS-700). Scores D1 G4 S3 R4 St4 P3 Se4 = **23**. 'Skills measured as of July 29, 2026' [ms_sg/ms-700].
- **Managing and Securing M365 Endpoints (Intune)** (MD-102). Scores D1 G4 S3 R4 St4 P3 Se4 = **23**. 'Skills measured as of July 24, 2026'. 0 mentions. Crucial 168 cards.
- **Collaboration Communications Systems Engineer** (MS-721). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of April 28, 2026'.
- **Copilot and Agent Administration Fundamentals** (AB-900). Scores D2 G3 S3 R4 St3 P3 Se4 = **22**. 'Skills measured as of October 14, 2026' [ms_sg/ab-900]. Crucial 195 cards; GitHub marchalvincent/AB-900 1* 'Notes and flashcards' (2026-08-15). MS-900 retired 2026-03-31 [ms_retired].
- **Administering M365 and AI Services** (AB-650 (beta)). Scores D1 G4 S3 R4 St2 P3 Se4 = **21**. Catalog title '(beta)' [ms_catalog].
- **Microsoft 365 Administrator** (MS-102 (retires 2026-11-30)). Scores D1 G4 S3 R4 St1 P3 Se3 = **19**. 'This exam will retire on November 30, 2026' [ms_sg/ms-102].

### MS-PowerDyn

Shared: Dynamics and Power Platform exams had no Reddit signal in the feed collected. Partner is scored 2 (no community identified).

- **Power Platform Fundamentals** (PL-900). Scores D2 G4 S3 R4 St4 P3 Se4 = **24**. 'Skills measured as of July 24, 2026' [ms_sg/pl-900]. 0 mentions. Not on Crucial list.
- **D365 Business Central Developer** (MB-820). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of June 10, 2025'.
- **D365 Business Central Functional Consultant** (MB-800). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of June 30, 2026'.
- **D365 Customer Service Functional Consultant** (MB-230). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of March 11, 2026'. MB-240 and MB-280 retired mid-2026 [ms_retired].
- **D365 Finance Functional Consultant** (MB-310). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of August 14, 2026'.
- **D365 Finance and Operations Apps Developer** (MB-500). Scores D1 G4 S3 R4 St4 P2 Se4 = **22**. 'Skills measured as of January 30, 2026'.
- **D365 Supply Chain Management Functional Consultant** (MB-330). Scores D1 G4 S3 R4 St3 P2 Se4 = **21**. 'Skills measured as of October 21, 2026'. MB-335 expert retired 2026-06-30.
- **Extending Power Platform with Code and AI** (AB-400). Scores D1 G4 S3 R4 St2 P3 Se4 = **21**. New from 2026-10-16 [ms_sg/ab-400].
- **Accelerating Sales Pipelines with AI in D365** (AB-210). Scores D1 G4 S3 R4 St2 P2 Se4 = **20**. D365 Sales AI Consultant Associate.
- **Contact Center Experiences with AI in D365** (AB-250). Scores D1 G4 S3 R4 St2 P2 Se4 = **20**. D365 Contact Center AI Engineer Associate.
- **Power Platform Developer** (PL-400 -> AB-400 (from 2026-10-16)). Scores D1 G4 S3 R4 St1 P3 Se4 = **20**. 'can continue to schedule and take the exam through October 30, 2026. The updated AB-400 exam will be available beginning October 16, 2026' [ms_sg/pl-400]. PL-200 and PL-600 retired 2026 [ms_retired].

### Google

Shared: see [prior §Google shared]. The catalogue page lists 15 certifications [gc_certs]. The only format facts captured are from the cert pages in `gc/`. No new demand feed was fetched; r/googlecloud returned only 11 flashcard entries in pass 1.

- **Cloud Digital Leader** (CDL (new guide 2026-08-12)). Scores D2 G5 S4 R4 St4 P2 Se5 = **26**. Prior §3.13. Page: 'new version of the exam is now live'; $99, 90 min, 50-60 questions [gc/cloud-digital-leader].
- **Professional Cloud Architect** (PCA (Google)). Scores D2 G5 S4 R4 St3 P2 Se5 = **25**. Prior §3.15. $200, 2 h. GitHub cfsmp3/GoogleCloudCertificationPreparation 10* 'Currently just architect' (2019).
- **Associate Data Practitioner** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. 50-60 MCQ [gc/data-practitioner].
- **Generative AI Leader** (-). Scores D2 G4 S4 R4 St2 P2 Se4 = **22**. $99, 90 min, '50-60 multiple choice questions' [gc/generative-ai-leader]. No demand data this pass.
- **Professional Cloud Database Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. 2 h.
- **Professional Cloud DevOps Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. Listed.
- **Professional Cloud Developer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. $200 [gc/cloud-developer].
- **Professional Cloud Network Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. $200, 2 h.
- **Professional Cloud Security Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. $200, 2 h.
- **Professional Data Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. '40-50 multiple choice' [gc/data-engineer].
- **Professional Security Operations Engineer** (-). Scores D1 G4 S4 R4 St3 P2 Se4 = **22**. $200, 2 h [gc/security-operations-engineer].
- **Associate Cloud Engineer** (ACE). Scores D2 G3 S4 R4 St3 P2 Se3 = **21**. Prior §3.14. $125, 2 h [gc/cloud-engineer].
- **Professional Machine Learning Engineer** (-). Scores D1 G4 S4 R4 St2 P2 Se4 = **21**. AI content churns.
- **Associate Google Workspace Administrator** (-). Scores D1 G4 S2 R4 St3 P2 Se4 = **20**. Listed [gc_certs]. Workspace admin help licence not checked.
- **Professional Agentic Architect** ((Beta)). Scores D1 G4 S4 R4 St1 P2 Se4 = **20**. 'Beta ... Registration fee: $120 (40% discount on retail price of $200' ; 'beta certification is open until September 30!' [gc/agentic-architect].

### HashiCorp

Shared: the hub lists Terraform Associate (004), Terraform Authoring and Operations Advanced, Vault Associate (003) and Vault Operations Professional [hc_certs, hc_vault]. The docs are under BUSL with a non-paid-use grant [prior §2]. The candidate agreement is still not read.

- **Terraform Associate** (004 (Terraform 1.12)). Scores D3 G4 S3 R3 St3 P4 Se4 = **24**. Prior §3.20. $70.50 [hc_certs]. GitHub 'anki terraform': best deck allister-grange 003 (94*, 51 forks, 2025-12-03); retrohacker/anki-terraform 1* (2022). No 004 deck.
- **Vault Associate** (003). Scores D2 G4 S3 R3 St3 P3 Se4 = **22**. $70.50 [hc_vault]. GitHub: guilhermeafonsoch/vault-study-hub 0* (2026-04) 'Vault Associate (003) ... flashcards' - a web app, not a deck. HashiCorp candidate agreement not read.
- **Terraform Authoring and Operations Advanced** ((Professional-level; code not captured)). Scores D1 G4 S3 R3 St3 P3 Se4 = **21**. Listed on the HashiCorp certifications hub [hc_certs]. Lab-style content not verified. Docs BUSL with non-paid grant [prior].
- **Vault Operations Professional** ((code not captured)). Scores D1 G4 S3 R3 St3 P2 Se4 = **20**. $295 [hc_vault]; requires Vault Associate (recommended). Hands-on format not verified. Consul Associate is not on the current hub page (consul URL redirected to security-automation) - Consul not scored.

### LPI

Shared: LPI says it has 'more than 350,000 certification holders' [lpi_learning].
  - The free Learning Materials cover Linux Essentials, Security Essentials, Web Development Essentials, Open Source Essentials, LPIC-1 101, LPIC-1 102 and DevOps Tools Engineer, with '1361' lessons [lpi_learning].
  - Licence: 'licensed under the Attribution-NonCommercial-NoDerivatives 4.0 International license or under a partner contract ... Commercial use is strictly prohibited' [lpi_faq]. NoDerivatives means the site cannot publish cards adapted from those texts without a partner contract.
  - The Publishing Partner programme is free for non-commercial providers [lpi_faq], so the route is partner first, which scores Partner 5 and Rules 4.
  - 'open technology track exam objectives are updated on average every three years' [lpi_summary].
  - The licence of the objectives wiki was not found [lpi_wiki_obj].

- **LPI Linux Essentials** (010-160 (v1.6)). Scores D2 G4 S2 R4 St4 P5 Se4 = **25**. 'Current version: 1.6 (Exam code 010-160)'; 40 questions, 60 min [lpi_le, lpi_summary]. LPI: 'more than 350,000 certification holders' (all LPI) [lpi_learning]. Free Learning Materials exist but are CC BY-NC-ND 4.0 [lpi_learning, lpi_faq]. LPP: 'Persons and institutions who make their material available free of charge or non-commercially are free to become partners' [lpi_faq]. No deck found (GitHub).
- **LPIC-1** (101-500 + 102-500 (v5.0)). Scores D3 G3 S2 R4 St4 P5 Se3 = **24**. 'Current version: 5.0 (Exam codes 101-500 and 102-500)' [lpi_lpic1]. Free decks: stueja/lpic-1-102-500-anki-flashcards 29*/11 forks (updated 2026-09-20); dshamanthreddy/lpic-1-anki-flashcards 9*/28 forks (2017, 101+102). Study repos with 500+ stars (jadijadi/lpic1book 555*, ksemaev/lpic_1-101 506*). r/linuxadmin top-year: 5/40 mention LPIC, incl. 'I built a mobile app for studying to LPIC-1 & 2 / Linux Essentials' (2026-04-03).
- **LPI DevOps Tools Engineer** (701-200 (v2.0; v1.0 ended 2026-06-30)). Scores D1 G4 S2 R4 St3 P5 Se4 = **23**. 'Current version: 2.0 (Exam code 701-200) Previous version: 1.0 (Exam code 701-100, available until June 30, 2026)' [lpi_devops]. Learning Materials exist for it [lpi_learning].
- **LPI Open Source Essentials** (050). Scores D1 G4 S2 R4 St3 P5 Se4 = **23**. 'Open Source Essentials 050 exam ... 40 questions ... 60-minutes' [lpi_summary].
- **LPI Security Essentials** ((code not captured)). Scores D1 G4 S2 R4 St3 P5 Se4 = **23**. Learning Materials exist [lpi_learning]. Exam code not captured.
- **LPI Web Development Essentials** ((code not captured)). Scores D1 G4 S2 R4 St3 P5 Se4 = **23**. Learning Materials exist. Exam code not captured.
- **LPI BSD Specialist** (702). Scores D1 G4 S2 R4 St3 P4 Se4 = **22**. 'Passing the 702 exam. The 90 minute exam is 60 multiple choice' [lpi_summary].
- **LPIC-2** (201 + 202). Scores D1 G4 S2 R4 St3 P4 Se4 = **22**. 'Passing exams 201 and 202' [lpi_summary]; version not captured. Borosan/lpic2book 124* (guide, not deck).
- **LPIC-3 (Mixed Env / Security / Virtualization / HA)** (300 / 303 / 305 / 306). Scores D1 G4 S2 R4 St3 P4 Se4 = **22**. Each 90 min, 60 questions [lpi_summary]. One deck family, four tags.

### PythonInst

Shared: the exam-policy and third-party-materials terms were not read.

- **PCAP Certified Associate in Python Programming** (PCAP-31-03). Scores D2 G4 S3 R3 St3 P2 Se4 = **21**. 40 questions, 65 min [pyi_pcap].
- **PCEP Certified Entry-Level Python Programmer** (PCEP-30-02 (30-03 in development)). Scores D2 G4 S3 R3 St2 P2 Se4 = **20**. 'PCEP-30-02 - Status: Active (current exam version) PCEP-30-03 - Status: In development'; 30 questions, 40 min [pyi_pcep]. Python docs: copyright PSF; code in docs under Zero-Clause BSD [py_copyright, py_docs_license]; licence of doc prose not established. No deck found (GitHub). Exam policy not read.
- **PCPP1 / PCPP2 Professional** (PCPP1 / PCPP2-32-0x). Scores D1 G4 S3 R3 St3 P2 Se4 = **20**. Listed [pyi_certs]. Tester/security tracks listed as 'Work in progress' - not scored.

### RedHat

Shared: docs.redhat.com returned 403 again (`rh_docs_home`, `rh_docs_rhel10`), and WebFetch returned 404 for a legal-notice URL. **The Red Hat docs licence is still not verified.** RHCE (EX294) was not fetched and is not scored.

- **Red Hat Certified System Administrator** (EX200 (RHEL 10)). Scores D2 G4 S2 R3 St3 P3 Se3 = **20**. Prior §3.22. docs.redhat.com still 403 this pass - licence not verified. r/linuxadmin: RHCSA in 31/40 posts [rss/linux_certs] (query included RHCSA; generic career posts).

### Docker/Mirantis

- **Docker Certified Associate** (DCA (study guide v1.5, Jan 2025)). Scores D1 G4 S3 R3 St2 P2 Se4 = **19**. $199, 90 min, '13 multiple choice and 42 discrete option multiple' [docker_dca]. Guide still tests 'swarm', 'UCP', 'DTR' [dca_guide]. docker/docs repo LICENSE Apache 2.0 [docker_docs_license] but UCP/DTR docs not checked.

### GitLab

- **GitLab certifications (catalogue not captured)** (n/a). Scores D1 G4 S5 R3 St3 P3 Se4 = **23**. university.gitlab.com is JS-rendered; list not verified. GitLab repo LICENSE: 'All content residing under the "doc/" directory ... CC BY-SA 4.0'; docs.gitlab.com footer links creativecommons by-sa/4.0 [gl_docs_license, gitlab_docs_page]. No deck searched.

### Oracle

- **Oracle OCI certifications (catalogue not captured)** (not verified). Scores D2 G4 S1 R2 St3 P2 Se3 = **17**. education.oracle.com 403/503. oracle.com says 'free training and certifications across Oracle Cloud Infrastructure' [oracle_cert]. OCI docs 'Copyright © 2026, Oracle' [oci_docs]; Oracle copyright page: 'may not directly or indirectly state or imply Oracle sponsorship' [oracle_legal]. GitHub: Priti126 Oracle Fusion ERP Anki repo 0*.

### MongoDB

- **MongoDB certifications (catalogue not captured)** (not verified). Scores D1 G4 S2 R3 St3 P2 Se4 = **19**. learn.mongodb.com JS-rendered; exam list not captured. Docs footer '© 2026 MongoDB, Inc' [mongo_docs_footer]; mongodb/docs LICENSE 404. No deck in GitHub queries.

### Elastic

- **Elastic Certified Engineer / Analyst / Observability / SIEM** (not captured). Scores D1 G4 S1 R3 St3 P2 Se4 = **18**. Four certs listed [elastic_cert]. elastic/docs-content LICENSE = 'Attribution-NonCommercial-NoDerivatives 4.0' [elastic_docs_lic2].

### Neo4j

- **Neo4j Certified Professional** (free exam). Scores D1 G4 S3 R3 St4 P3 Se4 = **22**. '80 questions · 80 % to pass', 60 min, 'Free' [neo4j_cert_page]. Docs 'License: Creative Commons 4.0' - variant not shown [neo4j_docs_page, neo4j_license].

### Kafka

- **Confluent Certified Developer for Apache Kafka** (CCDAK). Scores D2 G4 S4 R3 St3 P2 Se4 = **22**. Listed [confluent_cert]. kafka.apache.org: 'contents ... © 2026 Apache Software Foundation under the terms of the Apache License v2' [kafka_docs_page]; Confluent docs 'Copyright © Confluent' [confluent_docs]. No demand data.
- **Confluent Certified Administrator for Apache Kafka** (CCAAK). Scores D1 G4 S4 R3 St3 P2 Se4 = **21**. Listed [confluent_cert].

### AWS

Shared: AWS is saturated (see pass 1). No specialty exam without free coverage was found beyond DEA-C01 [prior §4]; this pass did not re-check AWSomecards.

- **AWS Certified Data Engineer Associate** (DEA-C01). Scores D2 G3 S2 R4 St4 P3 Se3 = **21**. Not in AWSomecards list; Crucial 85 cards [prior §4]. AWS docs personal-use [prior].

## 5. Source URL key

- **Microsoft:**
  - Catalog API: https://learn.microsoft.com/api/catalog/?locale=en-us&type=certifications,exams
  - Certification pages: https://learn.microsoft.com/en-us/credentials/certifications/<slug>/ (list in `ms_certlist.txt`)
  - Study guides: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/<code>
  - Retirements: https://learn.microsoft.com/en-us/credentials/support/retired-certification-exams
  - azure-docs licence: https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/main/LICENSE
- **GitHub docs:** https://raw.githubusercontent.com/github/docs/main/README.md and .../LICENSE
- **Google:** https://cloud.google.com/learn/certification and https://cloud.google.com/learn/certification/<slug>
- **Linux Foundation and CNCF:**
  - Catalogue: https://training.linuxfoundation.org/certification-catalog/
  - Certification pages: https://training.linuxfoundation.org/certification/<slug>/
  - Curriculum README: https://raw.githubusercontent.com/cncf/curriculum/master/README.md
  - Curriculum PDFs: https://raw.githubusercontent.com/cncf/curriculum/master/<file>.pdf
  - Annual report: https://www.cncf.io/wp-content/uploads/2026/03/cncf_ar25_033126a.pdf
- **Project docs licences:**
  - https://raw.githubusercontent.com/prometheus/docs/main/LICENSE
  - https://raw.githubusercontent.com/istio/istio.io/master/LICENSE
  - https://raw.githubusercontent.com/cilium/cilium/main/LICENSE
  - https://raw.githubusercontent.com/argoproj/argo-cd/master/LICENSE
  - https://raw.githubusercontent.com/backstage/backstage/master/LICENSE
  - https://raw.githubusercontent.com/open-telemetry/opentelemetry.io/main/LICENSE
- **HashiCorp:** https://developer.hashicorp.com/certifications and https://developer.hashicorp.com/certifications/security-automation
- **LPI:**
  - https://www.lpi.org/our-certifications/exam-information/
  - https://www.lpi.org/our-certifications/summary-of-lpi-certifications/
  - https://www.lpi.org/our-certifications/lpic-1-overview/
  - https://www.lpi.org/our-certifications/linux-essentials-overview/
  - https://www.lpi.org/our-certifications/devops-overview/
  - https://learning.lpi.org/en/
  - https://learning.lpi.org/en/about/faq/
- **Python Institute:**
  - https://pythoninstitute.org/certification-tracks
  - https://pythoninstitute.org/pcep
  - https://pythoninstitute.org/pcap
  - https://docs.python.org/3/license.html
  - https://docs.python.org/3/copyright.html
- **Docker:**
  - https://training.mirantis.com/certification/dca-certification-exam/
  - Study guide: https://a.storyblok.com/f/146871/x/2001ce939c/docker-study-guide_v1-5-jan-2025.pdf
  - https://raw.githubusercontent.com/docker/docs/main/LICENSE
- **GitLab:** https://gitlab.com/gitlab-org/gitlab/-/raw/master/LICENSE and https://docs.gitlab.com/user/project/
- **Oracle:**
  - https://www.oracle.com/education/certification/
  - https://www.oracle.com/legal/copyright/
  - https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/baremetalintro.htm
- **MongoDB:** https://www.mongodb.com/docs/manual/introduction/
- **Elastic:** https://www.elastic.co/training/certification and https://raw.githubusercontent.com/elastic/docs-content/main/LICENSE
- **Neo4j:**
  - https://graphacademy.neo4j.com/certifications/neo4j-certification/
  - https://neo4j.com/docs/cypher-manual/current/introduction/
  - https://neo4j.com/docs/license/
- **Confluent and Kafka:**
  - https://www.confluent.io/certification/
  - https://kafka.apache.org/documentation/
  - https://docs.confluent.io/platform/current/overview.html
- **Reddit RSS:** https://www.reddit.com/r/{AzureCertification,github,linuxadmin,kubernetes}/search.rss?q=...&restrict_sr=1&sort=top&t=year&limit=100 (the queries are in the file names and in `rss/`)

## 6. Gaps in this pass

- **AnkiWeb:** search is login-walled, so for exams new to this pass no AnkiWeb deck was checked. Gap is capped at 4 for them.
- **Search rankings:** none were run. Se scores for new exams are inferred.
- **Catalogues not captured** (JS-rendered or blocked pages): MongoDB, GitLab, Oracle and Elastic.
- **Licences not verified:** Red Hat docs, and the MS Learn repos for M365, Power Platform, Dynamics, Fabric and AI.
- **Rules not read:** the HashiCorp, Python Institute, Docker, Confluent and Neo4j candidate agreements.
- **Candidate numbers:** none found for Microsoft, Google, GitHub, HashiCorp, Python Institute or the data vendors. LPI publishes only an all-certification total.
