# Simulated expert review of "True or Folklore?" (read fully first)

A 246-page 6x9 paperback quiz book for adults: 100 famous stories in ten rounds of ten; the reader guesses TRUE / FOLKLORE / DISPUTED on a right-hand page, then turns over for a one-page answer with sources. Black-and-white interior with cartoon art; colour cover. Sold on Amazon KDP (US/UK first, India second) as a gift, game-night and classroom book. Host character: Ida Verity, a retired reference librarian, and her credulous cat Hearsay.

Folder: /Users/vivek/law-tome/reports/book-expert-panel/
- `book-text.txt`: the text of every printed page. Read all of it.
- `pages/`: rendered images (open every one with the Read tool): p001-p246 samples (title, copyright, gift page, How to play, frontispiece, contents, round opener, first question/answer spreads, a round-score page, DISPUTED answers, surprises page, back matter, scoresheet, certificate, index, last pages), `cover-wrap.png` (full back | spine | front cover), `aplus-1..5.png` (Amazon A+ listing banners).
Open nothing else on the computer, and don't search the web: judge as an expert reviewer with the book in hand.

Already known and being fixed (don't spend findings on these): back-to-back near-duplicate story pairs; answers too long to read aloud (the group rule now says read the verdict and the Tell someone line); DISPUTED feeling like a cop-out at quiz nights; the ISBN placeholder on the copyright page; contents page numbers.

## The experts (interview each one separately, in their own voice; never "You are a...")
1. **Design psychologist**: attention, cognitive load, reading flow, how the guess-then-turn mechanic, stamps, stars and score bands motivate (or don't), memory for the corrected fact.
2. **Book designer / typographer**: type sizes, hierarchy, margins, density, art placement, consistency, how it prints in black and white on KDP paper.
3. **Non-fiction editor** (trivia and popular-science books): structure, voice, repetition, openings, pacing across 100 entries, what readers will skim.
4. **Game and quiz designer**: the play mechanics, scoring, sure/guessing ticks, team rules, round structure, replay value.
5. **Secondary-school teacher** who builds lessons from books like this: classroom use, reading level, lesson-plan pages, what a head of department would object to.
6. **Amazon listing and KDP conversion specialist**: cover at thumbnail size, title/subtitle, back cover, A+ banners, look-inside first pages, reviews risk.
7. **Accessibility reviewer for older readers** (65+, reading glasses): type size, contrast, line length, fill-in boxes, how easy it is to write in.
8. **Historian of science and fact checker**: whether verdicts, hedges and sources would survive an expert reader; where a specialist reviewer would pounce.

## For each expert, in order, save `round-1/<MODEL>-<n>-<slug>.json`:
{"expert": ..., "model": "<exact model string>", "date": "2026-11-17",
 "first_impression": "2-3 sentences after a first flick through",
 "findings": [{"page": "printed page number or 'cover'/'aplus-N'/'throughout'", "issue": "...", "why_it_matters": "for readers or sales, one line", "fix": "a specific change", "severity": 1-3 (3 = fix before print)}, ... 5 to 10, most severe first],
 "keep": ["2-4 things that work and must not be lost"],
 "sign_off": "yes / yes with fixes / no", "sign_off_reason": "one line"}
Each expert speaks only from their own field. Be concrete: name the page and the exact change. Don't praise to be polite; don't invent problems either. Write each expert's answers yourself, one at a time, never with a script or template. After saving, run a short python check that all 8 files parse and have 5-10 findings. Report only: files written, and the 5 findings you'd fix first across all experts.
