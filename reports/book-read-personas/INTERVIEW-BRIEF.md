# Interview brief: simulated readers go through the finished book (read fully first)

You are running a simulated reader panel on the finished paperback "True or Folklore?" (246 pages; 100 stories in ten rounds of ten; the reader guesses TRUE / FOLKLORE / DISPUTED on a right-hand page, then turns over for the answer). Method: the persona-sim skill, /Users/vivek/.claude/skills/persona-sim/SKILL.md, and its references/cards-and-prompts.md §6 (persona framing). Folder: /Users/vivek/law-tome/reports/book-read-personas/.

## Inputs (read these, nothing else)
- `pack/book-pack.txt`: the text of every printed page, labelled [P001]..[P250]. Read ALL of it once, carefully, before answering for anyone. It is extracted text: the cartoons, verdict stamps and layout are not shown. Do not judge the art or layout; if a page is only an illustration it shows as blank or near-blank.
- `pack/w2-titles.txt`: the story titles in shuffled order (for wording 2).
- `/Users/vivek/law-tome/reports/book-picks-check/bank.json`: persona cards. Use ONLY the ids assigned to you.
- `/Users/vivek/law-tome/reports/book-picks-check/facts.md`: evidence about these reader types. Give each persona the lines its card cites.
Do NOT open anything in books/, stories.json, map.json or other reports. Don't fact-check the book with the web: personas react as readers, they don't research.

## For EACH persona, one at a time, fully in that person's voice
Interview framing ("We're asking a few readers about a quiz book they've just been through..."), never "You are a...". Never say whose book it is or that anyone involved made it. No chain-of-thought about what the answer "should" be; the persona gives its own short reasons. Answer as that person would read: a reader who skims or stops early does not notice problems on page 200. Readers of this kind are often lukewarm, bored or annoyed; let them be.

1. `card_quote`: the persona quotes the 1-2 lines of its card most relevant to reading a book like this.
2. `how_read`: how this person would actually go through it (cover to cover / dip in / game night only / stop), and `stopped_at`: the last page label they'd realistically reach in a first sitting or week (P250 if all).

### Wording 1 (as they read)
3. `w1_friction`: every page where they got confused, bored, lost, irritated, talked down to, doubted the book, or spotted something that looks wrong or inconsistent. Each: {"page":"P###","type": one of "confused","bored","talked-down","doubt-verdict","looks-wrong","too-dense","other","note":"one line in their voice","quote":"<=12 words from the page"}. Only pages up to `stopped_at`. As many or as few as the person would really notice (zero is allowed).
4. `w1_best`: 5 stories they enjoyed most ({"no": story number, "why"}), `w1_flat`: 5 that fell flattest ({"no","why"}).
5. `w1_juster`: "How likely is it you'd recommend this book to a friend or give it as a gift in the next year?" on this scale, answer with the number: 10 Certain, practically certain (99 in 100); 9 Almost sure (9 in 10); 8 Very probable (8 in 10); 7 Probable (7 in 10); 6 Good possibility (6 in 10); 5 Fairly good possibility (5 in 10); 4 Fair possibility (4 in 10); 3 Some possibility (3 in 10); 2 Slight possibility (2 in 10); 1 Very slight possibility (1 in 10); 0 No chance, almost no chance (1 in 100). The price is not set yet; don't assume one.
6. `w1_review`: {"headline":..., "body": 2-4 sentences}, the honest review they'd post, ending in a one-line bottom line.

### Wording 2 (a fresh pass, different questions and order; don't copy wording 1)
For the India student card (india-02), ask wording 2 in Hinglish and let her answer in Hinglish; translate nothing.
7. `w2_review_first`: "Before anything else: if a friend asked you about this book, what would you say?" 2-3 sentences.
8. `w2_lost`: "Were there bits where you lost interest or put it down?" list of {"page","why"} from memory (may differ from w1).
9. From `pack/w2-titles.txt` (shuffled), `w2_read_aloud`: the 5 they'd most want to read aloud at a table; `w2_cut`: the 5 they'd cut from the book. Each {"no","why"}.
10. `w2_juster`: "Out of 10, how likely is it you'd tell someone to get this book?" same scale as above.
11. `w2_book2`: "What would make you NOT buy a second book in this series?" one line.

## Save
One file per persona: `round-1/<MODEL>-<id>.json` with keys id, model (exact model string), date "2026-11-17", card_quote, how_read, stopped_at, w1_friction, w1_best, w1_flat, w1_juster, w1_review, w2_review_first, w2_lost, w2_read_aloud, w2_cut, w2_juster, w2_book2. Write each persona's answers yourself, persona by persona; never generate them with a script or template, and never copy w1 text into w2 (runs that do are rejected). After saving, run a short python check that each file has every key, 5+5 picks in w1 and w2, and juster values 0-10. Report only: files written, and anything that made a persona hard to answer for.
