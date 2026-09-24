# Card standard

How every card on the site is written, structured, checked and released. It
applies to every deck, from the first to the last. A deck that does not meet it
does not ship.

Draft 2, 24 September 2026 (adds foundations-first and primer cards). The evidence behind each rule is in
`flashcards-general/legal-design.md` §5, and the Anki mechanics are in
`flashcards-general/tech.md`. Both give their sources.

## How strong is the evidence?

Every rule below carries one label, so nobody mistakes a habit for a finding:

| Label | Meaning |
|---|---|
| **[E]** | Experimental: a controlled study found it |
| **[P]** | Practitioner guidance from an experienced source (Wozniak, Matuschak, Nielsen), not tested as a rule |
| **[M]** | What the Anki manual or the file format requires |
| **[H]** | House rule: our own choice, for consistency |

The honest summary for the public page:
- A controlled study found that self-made cards beat premade ones (Pan et
  al. 2022, d = 0.45, even against high-quality premade cards) **[E]**.
- Short-answer recall improved retention of the targeted information (Endres et
  al. 2020) **[E]**.
- The minimum-information principle and most card-writing advice have not been
  tested experimentally as rules **[P]**.

We say this on the site. A premade deck is a starting point, and the rules
below are built to narrow that gap, not to deny it.

## 1. Principles

1. **Understand before you memorise.** Every deck has a readable page that
   explains the topic, and every card links to the section it drills. Wozniak
   rule 1, "Do not learn if you do not understand", and rule 2, "Learn before
   you memorize" **[P]**. The Anki manual says shared decks lack "background
   information or explanations" **[M]**.
2. **Foundations first, inside the deck itself.** A deck must never assume
   knowledge it hasn't taught. This was the main failure of the owner's own
   earlier deck: its cards treated concepts as already understood and never
   explained them at the start. The deck page (principle 1) is not enough,
   because learners study in the app and skip the page. So every topic opens
   with **primer cards** (§2a) that introduce the idea before any detail
   card tests it. And **no card may use a term that has not been introduced
   earlier in the deck**, or in a prerequisite deck it names. Wozniak rule 3,
   "Build upon the basics" **[P]**; the card checker enforces the term rule
   (§5) **[H]**.
3. **One idea per card.** A card asks for one fact, one distinction or one
   step. Sources: Wozniak rule 4, the minimum information principle; Nielsen,
   "as atomic as possible"; Matuschak, "focus on one detail at a time"
   **[P]**.
4. **Recall, not recognition.** The default card asks a question with a
   short, typed-in-your-head answer. Short-answer retrieval improved retention
   of the targeted information (Endres et al. 2020) **[E]**.
5. **Cloze only on fresh sentences.** Matuschak warns that cloze deletions
   "seem particularly susceptible" to pattern matching, "especially when
   created by copying and editing passages from texts" **[P]**. So a cloze card
   is written as its own sentence, never cut from a source passage. Wozniak
   finds cloze "easy and effective" (rule 5) **[P]**.
6. **Precise and consistent.** Each prompt has exactly one correct answer, the
   same every time. Matuschak: precise, consistent, tractable, effortful
   **[P]**.
7. **No sets, no long lists.** Wozniak rules 9 and 10, "Avoid sets" and
   "Avoid enumerations" **[P]**. A list answer has at most 3 items **[H]**.
   Anything longer is split into cards, or taught as an ordered sequence with
   one card per step.
8. **Contrast what gets confused.** Where two terms are commonly mixed up,
   add a card that asks for the difference. Wozniak rule 11, "Combat
   interference" **[P]**.
9. **Context on the front.** The front shows the deck and topic (for example
   "Kubernetes › Scheduling"), so the prompt can stay short. Wozniak rule 16
   **[P]**.
10. **An example where it helps.** Every card that tests a concept has an
   example field. Wozniak rule 14, "Personalize and provide examples" **[P]**.
11. **Make it yours.** Every card has an empty "My note" field, and every
    deck page invites learners to rewrite, add and suspend cards. This is
    our response to the finding that self-made cards win **[E]**. Whether it
    closes the gap is untested, and we don't claim it does **[H]**.
12. **Source every card.** Wozniak rule 18, "Provide sources" **[P]**.
    For us it's mandatory (§3).
13. **Date what can change.** Wozniak rule 19: "time stamping is useful for
    volatile knowledge that changes in time" **[P]**. Any fact that depends
    on an exam version, a law, a rule or a product release carries a "valid as
    of" date **[H]**.
14. **Core first.** Cards are tagged `core` or `extra`, so a learner short of
    time can study the core only. Wozniak rule 20, "Prioritize" **[P]**.
15. **Images only when they teach, and only when licensed.** Wozniak rule 6,
    "Use imagery" **[P]**. Every image carries its licence and source
    **[H]**.

## 2. Anatomy of a card

Two note types are used across the whole site: `Basic` and `Cloze`. Their
fields are fixed at release. The Anki manual says updating "is generally not
possible if the note type is changed (e.g. … add an extra field)" **[M]**. So
every field that might ever be needed exists from version 1, even if empty.

| Field | Required | What it holds |
|---|---|---|
| `ID` | yes | Permanent ID, e.g. `scrum.psm1.events.sprint-length`. Never reused, never changed. |
| `Front` | yes | The prompt (Basic), or the sentence with `{{c1::…}}` (Cloze) |
| `Back` | Basic only | The answer, short |
| `Explanation` | yes | One or two sentences of why, in plain words |
| `Example` | concept cards | A concrete case |
| `Contrast` | where relevant | What it is commonly confused with, and the difference |
| `Source` | yes | Citation text: title, section, publisher |
| `SourceURL` | yes | Link to the exact section |
| `SourceLicence` | yes | e.g. `CC BY 4.0`, `public domain`, `facts only` |
| `ValidAsOf` | for volatile facts | ISO date, plus the exam version or law version |
| `Topic` | yes | Our own topic label, shown on the front |
| `ExamRefs` | only where permitted | Mapping to an exam outline, only for bodies whose rules allow it (see the content policy) |
| `Priority` | yes | `core` or `extra` |
| `MyNote` | yes, always empty | For the learner |
| `PageURL` | yes | The deck page section the card drills |
| `Kind` | yes | `primer`, `detail` or `contrast` (§2a) |
| `Introduces` | primers | The terms this card teaches for the first time |
| `Uses` | yes | Every technical term the card relies on (prompt or answer) |
| `Order` | yes | The card's position in the deck's teaching sequence |

The **Deck** is identified by the family and the exam or subject, e.g.
`Scrum::PSM I`. **Tags** give the family, the topic, the priority, and
`valid-as-of-<year>` where relevant.

## 2a. Primer cards and teaching order

This fixes the failure the owner met in their own earlier deck: cards that
assumed the concept was already known (principle 2).

**A primer card introduces a concept before anything tests it.** It asks the
most basic question about the idea, and its back gives:
- a plain-language answer of one or two sentences;
- the `Explanation` of why the idea matters;
- an `Example`.

Typical primer prompts:
- "What is a Sprint, in one sentence?"
- "What problem does a Kubernetes Pod solve?"
- "What does 'suitability' mean in securities rules?"

**Every topic starts with its primers.** A topic opens with one primer for
each core concept it introduces, before any `detail` or `contrast` card that
uses those concepts.

**Order is part of the deck.** Every card has an `Order` value. The deck
ships so that new cards appear in that order: foundations, then details, then
contrasts. Import options are the learner's choice, so the deck page also
tells them to study new cards in order. **To verify:** which Anki deck-option
settings an .apkg can carry, and how they import. The research did not cover
this.

**Terms are tracked, not assumed.** Every card lists the terms it `Uses`;
primers list the terms they `Introduce`. A term counts as introduced when a
primer with a lower `Order` introduces it, either in this deck or in a
prerequisite deck the deck page names. The deck page also has a short "Start
here" section listing the prerequisites, and the terms the deck assumes (the
fewer the better).

## 3. IDs, and the rules that keep updates from wiping progress

These are what let a new release update the cards a learner already has,
keeping their review history, instead of duplicating or resetting them.

1. **The note GUID comes from the `ID` field only,** never from the content.
   genanki's default GUID is "a hash of all field values", so any edit makes a
   duplicate. We override it to hash the `ID` only **[M]**.
2. **The IDs of the note types, decks, fields and templates are fixed
   constants in the repository,** and never regenerated. Anki's note-type
   merge relies on "template and field IDs, introduced in Anki 2.1.67"
   **[M]**.
3. **The note types never change after release.** Adding a field would break
   updates for everyone who already imported the deck **[M]**. If a change is
   unavoidable, it is a new major version, announced on the deck page.
4. **CSV exports put the `ID` in the first column.** Anki matches text
   imports on the first field within a note type **[M]**.

## 4. Styling

- One stylesheet for both note types, with a night mode
  (`.card.nightMode` / `.nightMode .x`) **[M]**.
- System fonts only, so the deck carries no font files and renders the same
  on every platform **[H]**.
- No JavaScript on cards. RemNote, for one, does not run card JavaScript, and
  it does not import custom CSS. So cards must be readable unstyled
  **[M]**/**[H]**.
- Source and "valid as of" lines sit in small type on the back, never on the
  front **[H]**.

## 5. The card checker (runs in the build; a failure blocks release)

A card fails if it has any of these:

- a missing `ID`, a duplicate `ID`, or an `ID` that changed since the last
  release (compared with the previous release's manifest);
- no `Source`, `SourceURL` or `SourceLicence`;
- a `SourceURL` that does not return 200 when the release is built;
- a volatile-fact tag without `ValidAsOf`;
- a `Back` over 25 words (Basic) **[H]**;
- a list answer with more than 3 items **[H]**;
- a cloze sentence that also appears word for word in a cached source text
  (the copied-passage rule in §1.4);
- a `Front` without a question mark or a cloze;
- an `ExamRefs` value on a deck whose body is not cleared for exam mapping in
  the content policy;
- any exam logo or image not on the licensed-image list;
- a change to a note type's fields since the last release;
- a term in `Uses` that no primer with a lower `Order` introduces, in this
  deck or a named prerequisite deck (the no-assumed-knowledge rule);
- a `detail` or `contrast` card placed before the primers of its topic;
- a primer without `Explanation` and `Example`;
- a missing or duplicate `Order` value.

A deck also fails if:
- its page does not exist;
- it has no changelog entry for the release;
- its licence notice is missing.

## 6. Making a deck

1. **Research.** An agent reads the sources for the deck's scope, under the
   research protocol. Every figure is read in two raw fetches, and the brief
   is not evidence.
2. **Draft.** An agent writes cards to this standard, citing the exact
   section for each. Agents never commit.
3. **Check.** The card checker runs.
4. **Source audit.** A second agent re-opens every source and confirms each
   card against it. Any card that can't be confirmed is removed, not
   softened.
5. **Human review.** A person reads every card before first release, and
   every changed card after that.
6. **Release.** Version number and changelog, then export.

## 7. Versions and changelog

- **Patch** (1.0.1): corrections to existing cards.
- **Minor** (1.1.0): new cards, or new facts dated to a new exam or law
  version.
- **Major** (2.0.0): a note-type change (avoid), or a new exam version that
  retires much of the deck.

Every release has a public changelog entry. It lists the cards added, changed
(with the reason) and suspended. A removed card is never deleted from the
file: it is moved to a `retired` tag, because a card deleted from the package
never disappears from a learner's collection anyway **[M]**.

## 8. Exports

| Format | For | Notes |
|---|---|---|
| `.apkg` | Anki desktop, AnkiDroid, AnkiMobile, and apps that import it (RemNote, Mochi, Noji) | full styling in Anki; other apps drop CSS |
| CSV | Quizlet, Brainscape, Knowt, Mnemosyne, and anything else | uses Anki's `#separator`, `#html`, `#columns`, `#notetype` and `#deck` headers; ID in the first column |
| Markdown | Obsidian, Logseq, reading and printing | `Q::A` form for Obsidian Spaced Repetition |
| Web page | everyone | every card readable in HTML, with sources |

## Open questions

- British or US spelling for card text. The house style is British
  (`VOICE.md`), but many exams are American and use American terms.
  Suggestion: British for our own prose, and official terms exactly as the
  source writes them.
- The 25-word and 3-item limits are starting points. Review them after the
  first family ships.
