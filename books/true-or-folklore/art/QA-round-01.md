# Round 1 art — QA log

Made 2026-11-11 in ChatGPT (free plan), one new chat per image, `raw/002.png`
attached as the style reference, prompts in `prompts/`. Downloads are 1536 × 1024
PNG (≈334 ppi in the 4.6 in slot). Free plan stopped after 5 images:
"0 images left until 5:41 PM".

| # | Story | Status | Notes |
|---|---|---|---|
| 001 | Archimedes | Pass | Clean hands, no text. |
| 002 | Newton's apple | Pass | Style reference for the series. |
| 003 | Newton tells the story | **Fix** | Stray "6"-like mark on the listener's coat (glyph). Newton should read as old and white-haired; both figures look the same age. Edit: "remove the mark on the young man's coat; make the man in the armchair clearly elderly, keep everything else". |
| 004 | Galileo | Pass, minor | Tower is not visibly leaning; acceptable, the question names Pisa. |
| 005 | Pythagoras | **Fix** | The triangle in the sand, the key prop, is faint and thin; the temple in the background was not asked for. Edit: "draw the right triangle in the sand with thick bold black lines; remove the temple". |
| 006–010 | Einstein ×2, Moore, Churchill, Murphy | Not made | Free limit reached. Prompts ready in `prompts/`. |

Second-reviewer pass (contact sheet of all 100) still to do.

## Gemini app test (2026-11-11)

Tried the free Gemini app (Images, Flash) for the remaining round 1 stories.

- Refused the young-Einstein scene: "I can't depict some public figures." Churchill would hit the same rule. ChatGPT drew historical figures.
- An object-only version (#006, the 1905 desk with a glowing blank sheet) came out well in style: `drafts/006-gemini-desk-draft.png`.
- Full-size download is 1200 × 896, about 261 ppi in the 4.6 in slot: under KDP's 300.
- It carries a faint visible sparkle watermark in the bottom-right corner. `finish-art.py` clamps near-white to white and would erase it; removing a provider's visible AI mark is not something we do, so this file is a draft only.

Decision: Gemini free is not usable for print art. Keep it for drafts and layout tests.

### Second try: Pro model and different prompts

- Switched the model to 3.1 Pro and asked for "high-resolution, as large as possible, 2K or more". The download was again 1200 × 896: size is fixed by the free app, not by the prompt.
- In the same chat it reused the previous desk drawing for the Moore's law chips (`drafts/008-gemini-pro-chips-draft.png`), so each Gemini image needs a fresh chat.
- Prompts cannot get past the public-figure rule, and we should not try: those scenes stay with ChatGPT.

## Microsoft Copilot test (2026-11-12)

- With the style image attached, the request stalled on "Still working…" for over 6 minutes and never finished.
- Text-only prompt worked in about 2 minutes: `drafts/008-copilot-chips-test.png`, 1536 × 1024 PNG (≈334 ppi in the 4.6 in slot), no visible watermark. Lines are thinner and plainer than the ChatGPT set; the background carries faint near-white noise that `finish-art.py` cleans.
- The next request (Churchill caricature, to test historical figures) stopped at a "Verify you are human" check. That has to be done by Krishna; untested so far.
- After the human check, the Churchill caricature worked (`drafts/009-copilot-churchill-test.png`, 1536 × 1024): Copilot does draw historical figures. But without the style image it drifted off-style: heavy hatching, a more realistic face, the fist cropped at the top edge, and a microphone the prompt did not ask for.
- The earlier request with the style image finally answered "Sorry, I ran into a problem generating the image." Style references do not work in free Copilot.
- Verdict: Copilot is print-sized and watermark-free, but cannot hold the series style. Usable only for simple object scenes, if at all. Side-by-side: `drafts/compare-copilot.png`.

## ChatGPT free, second batch (2026-11-14)

006 to 010 made in ChatGPT free with `final/002.png` (or 006) attached as the style reference, one fresh chat each. All 1536 × 1024, no watermark.

| # | Story | Result | Notes |
|---|---|---|---|
| 006 | Einstein, 1905 desk | Pass | On style; desk grey heavier than 002, fine in print. |
| 007 | Einstein, medal | Pass | Curved-grid board reads as spacetime. |
| 008 | Moore's chips | Pass | Last group has nine chips, not eight; nobody will count. |
| 009 | Churchill | Pass, minor | Angry rather than stirring; right-hand member cropped at the edge. |
| 010 | Murphy | Pass | Goggles, steam ears, tangled harness. |

The free limit hit after 5 images ("out of image creations… wait for more tomorrow"). The 003 and 005 edits did not run; prompts are in this file above. Prompts for every scene: `prompts/gen/NNN.txt`.

## ChatGPT Plus batch (2026-11-14)

014 to 040 made in ChatGPT Plus, one fresh chat each, style reference attached. 017 to 040 used the handcrafted prompts in `prompts/hand/`; 014 to 016 used the scene template. All 1536 × 1024, no watermark. Contact sheet: `contact-14-40.png`.

Chrome stopped saving script-started downloads partway through (nothing reached `~/Downloads` and Chrome logged no download), so images were sent from the page to a small receiver on 127.0.0.1 instead. Several sends failed with ChatGPT's "Your account changed. Send your message again" error while three tabs were working at once; each was simply sent again.

| # | Story | Result | Notes |
|---|---|---|---|
| 003 | Newton and the apple (edit) | Fix, done | First edit added white blotches on the coat and lap. The second edit is clean: the stray mark is gone, the man in the armchair is balding with wrinkles and spectacles, slightly stooped. Old file kept as `raw/003-old.png`. |
| 005 | Pythagoras (edit) | Fix, done | Triangle redrawn in bold black lines, temple removed. Base of the triangle sits close to the bottom edge. Old file kept as `raw/005-old.png`. |
| 014 | Goodhart: giant nail | Pass | Gag reads at a glance. |
| 015 | Hanlon: toppled filing cabinet | Pass | Shrug and glare both clear. |
| 016 | Hanlon: Napoleon and the ink | Pass | Weary raised hand, spilled ink on a blank map. |
| 017 | Godwin: shouting terminals | Pass | Referee is clear; screens show faces only. |
| 018 | Sturgeon: books in the bin | Pass | Writer caricature; book spines blank. |
| 019 | Segal: two watches | Pass | Dials have ticks, no numbers. |
| 020 | Sayre: teaspoon tug-of-war | Fix, done | In the first version the spoon read as a squiggle. Regenerated with "an ordinary teaspoon, drawn large and clear"; the spoon now reads. Third professor and falling books not drawn. |
| 021 | Bystander: night apartment block | Pass, minor | No people. The flat grey sky was asked for in the brief, so this frame is not on white. |
| 022 | Stanford prison: mock-prison props | Pass | Taped cardboard bars, uniform, mirrored glasses. No people. |
| 023 | Hawthorne: workers under the light | Pass | One bulb, not the bright and dim pair in the scene. |
| 024 | Milgram: panel of switches | Pass | Switches unlabelled; no second room. |
| 025 | Small world: parcel chain | Pass, minor | Four people hand on a parcel. No hills and no city. |
| 026 | Asch: line card | Pass | Bars on the card, no numbers. The doubter is at the end of the row, not in the middle. |
| 027 | Marshmallow test | Pass, minor | Strain and clock read well, but the child isn't sitting on their hands. |
| 028 | Robbers Cave: tug-of-war over a creek | Pass | No pennant text. |
| 029 | Ebbinghaus: butterflies from ears | Pass | Plain falling curve on the board. |
| 030 | Little Albert: empty high chair | Pass | No people; quiet and respectful. |
| 031 | Dunning–Kruger: peak and valley | Pass | The curve's shape reads clearly. |
| 032 | Dunning–Kruger: karaoke | Pass | Notes only, no text. |
| 033 | Yerkes–Dodson: juggler on the hump | Pass | Three stages clear. |
| 034 | Maslow: stepped pyramid | Pass | A heart stands in for the group hug. |
| 035 | Wald: dotted plane | Pass, minor | Dots cover most of the plane, so the clean areas are small. The pencil taps a clean spot. |
| 036 | Wald: airfield armour | Pass, minor | The bomber runs off the frame on the left and top. The pointing gag is less clear than the brief. |
| 037 | Pareto: land split | Pass, minor | Follows the hand prompt (landowner against three farmers), not the pea pods in scenes.json. Furrow lines on the field are close to hatching. Pareto is cropped at the left edge. |
| 038 | Benford: grubby first pages | Pass, minor | Text is shown as grey lines, no letters. Smudges have soft grey edges, which finish-art clamps. |
| 039 | Gambler's fallacy: roulette | Pass | Wheel has no numbers. |
| 040 | Monty Hall: goat behind the door | Pass | Doors blank. |
