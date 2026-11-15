# True or Folklore? — cartoon style bible

Chosen by Krishna on 2026-11-11: **style B, bold modern cartoon.** The golden
reference is `style-tests/B-bold-cartoon.png` (Archimedes in the bath).

## The look

- Thick, even black outlines; big round shapes; exaggerated, readable expressions.
- Flat fills in black and one light grey only. No gradients, no hatching, no fine texture.
- Plain white background. One scene, one gag, centred, with breathing room at the edges.
- Children's-book energy for adults: warm and funny, never mocking a real person.
- **No text, letters, numbers or signs in the image.** The page sets all words in type.

## Why it suits this book

It prints cleanly on KDP's black-and-white paper (no thin lines to break up,
no midtones to go muddy), it reads at a glance under the question, and it is
the easiest style to keep consistent across 100 drawings.

## Prompt template

Every image uses the same frame, with only the scene changing:

> Bold modern cartoon with thick even black outlines, big round shapes and
> exaggerated expressions, flat fills in black and one light grey only,
> playful children's-book energy, plain white background, no color, no text,
> no letters, no numbers. Scene: {scene}

Plus the three style references (the golden image and the next two approved
images), passed as style references so the line weight and faces stay
consistent.

## Rules for scenes

1. **The scene shows the popular story, not the verdict.** It sits on the
   question page, so it must not give the answer away.
2. **Real historical people** may be drawn as friendly caricatures (Newton,
   Archimedes, Churchill), recognisable by props and period dress.
3. **People who may be living** are never drawn. Show the object, setting or
   idea instead (a napkin with a curve, a prison corridor, a jar of jam).
4. **Real victims** (Kitty Genovese, Little Albert) are never drawn and never
   played for laughs. Use a neutral object or setting, or no cartoon.
5. No logos, brands, trademarked characters or recognisable artworks.

## Print

- Generate at the largest size available (Nano Banana Pro 2K or 4K; Canva's
  originals are 1456 × 1088).
- Placed about 4.6 in wide on the question page: 1456 px gives about 316 ppi,
  over KDP's 300.
- Convert to grayscale; clamp near-whites to white so the page stays clean.

## Provenance

Every image is AI-generated and is disclosed on KDP. Keep the prompt, model,
date and reference images for each file in `art/manifest.json`.
