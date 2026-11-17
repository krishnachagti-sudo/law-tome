# Simulated readers go through True or Folklore? (17 Nov 2026)

**Label:** ranking and objections only. 16 simulated readers from the existing bank (reports/book-picks-check/bank.json: gift buyers, quiz regulars, curious readers, teachers/students, sceptics, Indian readers), n real = 0. 11 dev cards read by claude-opus-5-5 and claude-sonnet-5-5 in separate agents; 5 frozen holdout cards read once by claude-sonnet-5-5. They read the full text of every printed page (not the art or layout). No number here is survey data, and the 0-10 scores are not a star-rating forecast.

## Checks (checks.txt)
- **Decoys worked.** Two fake entries were planted: a verdict stamped TRUE whose text says it never happened, and a page in heavy jargon. Of the readers who got that far, 20 of 21 flagged the first and 14 of 15 the second. So these readers do notice real problems, which makes their friction list worth reading.
- **The decoys also pulled the 0-10 scores down** (both sceptics scored 1 out of 10 on Opus, citing "two pages nobody checked"), and shifted page references by 2-4 pages, which several readers flagged. Those complaints are artefacts and are ignored below.
- Story ranking (best vs flattest): Opus vs Sonnet agreement 0.59, dev vs holdout 0.67. Moderate; good for spotting the clear ends, not for fine order.
- Wording check: no reader's two reviews overlap above 60% (no copying).
- Opus readers were harsher than Sonnet readers (mean 3.5 vs 5.5 out of 10), consistent across all 11 cards. Holdout 5.6.
- Not run: persona_sim.py check/forecast (this is a reading panel, not a choice question with options); English-Hinglish gap only on one card.

## What readers hit, most-flagged first (real pages only)

| # | Problem | Pages | Readers | Status |
|---|---|---|---|---|
| 1 | **Back-to-back near-duplicate pairs**: two Newton apples (2-3), two Hanlon's razors (15-16), two Dunning-Krugers (31-32), two Wald planes (35-36), two Laffers (46-47). "Didn't I just read this?"; the second question gives away the first. | 20, 48, 84, 92, 116 | 12+ on p20, both models, holdout | **Your call** |
| 2 | **Answers too long to read aloud**; the first answer (Archimedes, p16) loses gift buyers and game-night players. | 16, 18 | 12 | Fixed in part: How to play now says the reader reads out the verdict and the Tell someone line |
| 3 | **Copyright page**: ISBN placeholder; the AI-drafting note makes sceptics and teachers read more suspiciously. | 2 | 11 | ISBN pending; disclosure kept (honest) |
| 4 | **How to play example** said № 1 was Newton; № 1 is Archimedes. | 5 | 3 | **Fixed** |
| 5 | **DISPUTED feels like a cop-out at a quiz table** (Murphy's law p32, snow words p126); quiz players want a ruling. Milgram's 65% (p66) reads as a trick: the number is right, the verdict DISPUTED. | 32, 66, 126 | 10 | Your call |
| 6 | **"The record gives no further detail... and this entry adds none"** read like a note left by the writer. | 144 | 7 | **Fixed** (sentence removed) |
| 7 | **"The stories that fooled the most people, ranked"** on the surprises page: ranked by what data? There is none. | 233 | 3 | **Fixed**: "Our pick of the ten most likely to fool you" |
| 8 | **Laffer napkin entry rests on one Wikipedia source** (the 12 Nov source check already flagged first-hand accounts). | 114 | 3 sceptics | Your call |
| 9 | **Contents**: page numbers wrapped onto their own line, titles hyphenated. | 7-11 | 1 | **Fixed** |
| 10 | **Dead cross-reference**: Benford said Stigler's law "has its own entry in Round 5"; that entry was swapped out on 15 Nov. | 100 | 1 | **Fixed** |
| 11 | Latin detours (Churchill's rule-of-three motto p34, Ockham p38), quantum page p130, US politics (Laffer) lose casual and Indian readers. | 34, 38, 114, 130 | 4-6 each | Note only |
| 12 | Every answer has the same skeleton ("the popular version... the record..."); felt by readers who go cover to cover. | throughout | 4 | Note only |

## Best-liked stories (both models)
Churchill's "blood, toil, tears and sweat" (10), Streisand effect (63), Monty Hall letters (39), Hanoi rat tails (92), buttered toast (80), Kitty Genovese (21).

## Review headlines readers would write (a flavour, not a forecast)
- "Great questions, answers need a diet" (quiz, US)
- "Good idea, way too much reading" (gift sceptic)
- "Strong psychology rounds" (A-level teacher, holdout)
- "Good stories, but written for someone in the West" (Indian student)
