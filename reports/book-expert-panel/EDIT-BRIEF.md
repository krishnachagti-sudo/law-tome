# Editing pass on True or Folklore? drafts (approved by Krishna, 17 Nov 2026)

Files: /Users/vivek/law-tome/books/true-or-folklore/drafts/round-NN.md. Each entry runs from `<!-- slug: ... -->` to `---`. Only edit the answer text after `*(turn the page)*`: the body paragraphs, the `**Tell someone:**` line and the `*Sources:*` line. Never edit the `## ` question, the `**VERDICT.**` word, the `<!-- slug -->` comment, or the `> **QA notes**` / `> **Source check**` blockquotes. Edit with exact string replacements, entry by entry, never with a script that rewrites text.

SKIP these entries entirely (someone else is editing them): Pareto's 80/20 land; roulette black 26 times; Little Albert; Delhi cobra bounty; Rousseau "noble savage"; Clausewitz "fog of war"; "Thucydides trap" 12 of 16.

## Hard rules
- **No new facts.** Every fact, name, date and number you write must already be in that same entry (body, Tell line, sources, or its Source check note). If a clearer sentence would need a fact the entry doesn't have, leave the sentence alone.
- **No verdict changes**, no softening or hardening of hedges ("likely", "reportedly", "almost certainly" stay).
- **Never longer.** Each entry's body + Tell line must end up the same length or shorter (count words before and after). Every answer must fit one printed page; it does now.
- American spelling, as the book uses. Plain words. No em dashes.

## The three jobs, per entry
1. **Tell someone line**: the one line a quiz host reads aloud. Rewrite so it opens with the fact, not with an attribution or the myth ("According to Britannica...", "The record finds no basis...", "Contrary to popular belief..."). 25 words or fewer. Keep it true to the verdict: a DISPUTED line must still say it is disputed or unsettled. If the line already opens with the fact and is 25 words or fewer, leave it.
2. **"The record"**: the book says "the record" about 210 times; it gets monotonous. In each entry, keep at most two uses. Replace the others with the actual source where the entry names it ("Quote Investigator found...", "Stukeley's memoir records..."), or state the fact plainly. "The record" means the Law Tome's sourced entry for that law, so never replace it with a source the entry doesn't name.
3. **Sources line**: reorder so primary and named sources (papers, books, archives, named authors) come first, and Wikipedia and general websites come last, just before "Full list: ...". Never delete or add a source.

## Report
When done, run a python check over your files: every entry still has its question, verdict, Tell line and sources; no entry got longer (print before/after word counts of body + Tell for each changed entry); no Tell line over 25 words (except skipped entries). Report: entries changed, any you left because a rule blocked the edit, and any Tell line you couldn't get under 25 words without dropping a fact.
