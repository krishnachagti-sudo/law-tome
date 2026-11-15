# Answer-page background prompts: brief

Each answer page in *True or Folklore?* gets a second cartoon: **what really happened.**
The question page already has a cartoon of the popular story (`art/final/NNN.png`,
prompt in `art/prompts/hand/NNN.txt`, else `art/prompts/gen/NNN.txt`). This one is
printed in one flat pale grey behind the bottom of the answer text (style F2).

There is no gradient: we can't get a proof copy (Krishna is in India), and a smooth
fade is what most often bands or blotches on KDP's black-and-white press. So **the
drawing itself must do the fading**:

- **Everything sits in the bottom 40% of the frame**: figures, objects, ground line.
  The top 60% is completely empty white. Nothing reaches up into it, no tall props,
  no raised arms past that line, no clouds, birds or hanging lamps.
- The **densest, heaviest shapes sit lowest** (solid black objects, the ground, feet,
  furniture). Toward the top of the drawing, only outlines and open shapes, so the
  picture thins out as it rises.
- **Big, simple, bold silhouettes.** In pale grey, fine detail disappears.
  One clear action, two or three figures at most, spread wide across the frame
  rather than stacked tall.
- It is read *after* the verdict, so it may show the answer.

## Numbering

`NNN` = the story's position in draft order: round-01.md entries are 001–010 in file
order, round-02.md 011–020, and so on. (The book reorders some entries for print;
ignore that and use file order.) Write each prompt to `art/prompts/bg/NNN.txt`.

## What the scene shows

Read the whole answer. Pick the single most visual true fact from the record, the
thing a reader would retell. Examples:
- Archimedes (FOLKLORE): a Roman writer two centuries later, at a low desk writing the
  bath story, while a small Archimedes works calmly with a balance scale nearby.
- TRUE verdicts: the real moment, shown plainly.
- DISPUTED: both versions side by side, or a figure weighing two piles of papers.
- Misattributed quotes: the real author at work, the famous name looking on, puzzled.

Don't repeat the question-page cartoon's composition. Check its prompt first.

## Rules (same as the book's style bible, `art/STYLE.md`)

1. No text, letters, numbers, signs, labels, captions or speech bubbles. Blank pages,
   blank boards, blank screens.
2. Real historical people who are dead: friendly caricature, recognisable by props and
   period dress. **People who may be living are never drawn**: show the object,
   setting or idea instead. If unsure whether someone is alive, treat them as living.
3. Real victims (e.g. Kitty Genovese, Little Albert) are never drawn and never played
   for laughs: neutral object or setting.
4. No logos, brands, trademarked characters or recognisable artworks.
5. Warm, never mocking.

## Prompt format

One paragraph, exactly this frame. Fill the braces, and add story-specific
constraints at the end of CONSTRAINTS.

Create an image. Image 1 is the STYLE REFERENCE. Match its line weight, shape language, face style and grey usage exactly. Do not copy its subject or composition. USE: a wide strip cartoon that will be printed pale grey behind the bottom of a block of text on a black-and-white book page; the words are set separately, so the image has none. STYLE: bold modern cartoon; thick, even, uniform black outlines; big round simplified shapes; exaggerated, readable facial expressions; warm, playful children's-book energy for adults, never mocking. Flat fills only: solid black plus one light grey. Pure white background. No shading, no gradients, no texture, no hatching, no colour. SCENE: {setting}. {what happens, one sentence}. This shows what really happened. PERIOD MARKER: {…}. SECONDARY ELEMENT: {…}. COMPOSITION: very wide, low composition; everything sits in the bottom 40% of the frame on a plain ground line; the top 60% of the frame is completely empty white and nothing reaches into it; heaviest solid-black shapes at the very bottom, lighter open outlines higher up; figures spread side by side across the width, not stacked; big simple silhouettes with limbs separated from bodies; no small details; no background scenery beyond what is named. CONSTRAINTS: no text, no letters, no numbers, no captions, no signs, no labels, no signature, no watermark, no speech bubbles. Blank surfaces on any book, paper, board, screen or sign. Each character has two arms, two legs and simple cartoon hands. No logos, brands or recognisable characters or artworks. No modern objects unless named. {story-specific}. FORMAT: 3:2 landscape (1536 x 1024).

## Also write

`art/prompts/bg/NOTES-<rounds>.md`: one line per story with NNN, verdict, the fact the
scene shows, and any rule you applied (living person avoided, victim rule).
