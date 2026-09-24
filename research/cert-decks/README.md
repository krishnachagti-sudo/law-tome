# Certification flashcard decks: research

Temporary home. This folder moves to the project's own repository once it
exists; it is here only so the research is not lost. It is not part of the Law
Tome site and nothing in the build reads it.

Researched 23 and 24 September 2026 by parallel agents under the no-invented-facts rules
(`.claude/skills/reference-site-playbook/references/research-protocol.md`).
Every claim in the reports carries its source URL. Anything the researcher
could not read is marked "not verified".

## The decision so far

- **Product:** free, standardised, sourced flashcard decks for professional
  certification exams. They import into Anki, with CSV and Markdown for other
  apps, and each deck has a readable web page.
- **Scope:** certifications only, for now. Languages and general subjects are
  out.
- **Why:** nobody offers free, sourced, versioned, standardised decks across
  many certifications. No deck found cites official documentation or
  publishes a version history. The free decks on AnkiWeb are fragmented and
  stale.
- **Main constraints:**
  - Candidate agreements ban exam content, so cards may only use public
    sources, written in their own words.
  - Documentation licences vary: Kubernetes/CNCF, Microsoft and Google are
    open; AWS and Cisco allow personal use only.
  - CompTIA, CFA Institute and PMI restrict third-party material, so they are
    partnership-first.
  - CompTIA objects to AI-generated study material.
- **Distribution:** through instructors, associations and each exam's own
  community.
- **Card standard:** `CARD-STANDARD.md`, covering how every card is written, structured,
  checked and released.
- **Content policy:** `CONTENT-POLICY.md`, covering allowed sources, how exams are named,
  the bodies we don't name yet, and how AI is used.
- **Hosting:** a conyso.com subpath (decided 24 September 2026).
- **Candidate list:** `CANDIDATES.md` ranks about 110 certifications from the five area reports in `candidates/`.

## Reports

| File | What it covers |
|---|---|
| `flashcards-general/tech.md` | Anki formats, stable IDs for updates, other apps' import formats, FSRS |
| `flashcards-general/market.md` | Deck makers, quality complaints, AnkiHub, the gap |
| `flashcards-general/demand.md` | Which subjects people want decks for, who ranks, what people pay |
| `flashcards-general/legal-design.md` | The Anki trademark, licences, copyright, audio, card-design principles and evidence |
| `certification-market/size-demand.md` | Exam volumes, number of certifications, exam churn, flashcard category growth |
| `certification-market/competitors.md` | Every flashcard and Anki offering for certifications found |
| `certification-market/distribution.md` | Search results, communities, instructors, vendor programmes |
| `certification-market/rules-risks.md` | Candidate agreements, trademarks, documentation licences, curricula, court cases |
