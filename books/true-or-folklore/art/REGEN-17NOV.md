# Redraw run, 17 Nov 2026 (from reports/book-expert-panel/art-audit.md)

Read art/GENERATE.md first, all of it: it holds the method and every lesson from earlier runs. Its rules bind this run too.

## Rules (non-negotiable)
- Chrome only, through the claude-in-chrome tools. Create your OWN new tab (tabs_create_mcp) and work only in it. Never touch any other tab (in particular not 1668857888 or 1668858330). Close your tab at the end.
- One tab, one image at a time, at least 90 seconds between sends. Start every prompt with "Create exactly one image".
- If ChatGPT shows "Unusual activity", any limit message, or asks you to wait or upgrade: STOP at once, don't press Retry or any button, and report which items are done.
- No eval or injected scripts into ChatGPT; short read-only DOM checks (like counting `img[alt^="Generated image"]`) are fine. Never enter passwords, never click upgrade or purchase offers.
- Downloads: after clicking Download, move the file ONLY with the age-checked script: `bash /Users/vivek/law-tome/books/scripts/tools/mvdl.sh <target.png>` (it refuses files older than 90 s). Target: `/Users/vivek/law-tome/books/true-or-folklore/art/regen-17nov/<ID>.png` (make the folder). Never move any other file from Downloads.
- If ChatGPT returns two options, download the one that better fits and note it.
- Do not edit anything else in the project. I (the parent session) will prep and place the files.

## How to prompt each item
Upload the item's CURRENT file as Image 1 (the reference), with one file_upload call. Ask for the same scene redrawn with the fix below, in the same style as Image 1, and say what must stay the same. Always add: "Everything must sit fully inside the frame with a clear white margin on every side; nothing may touch or be cut by any edge. No text, no letters, no numbers, no signature, no watermark."
- Cartoons (art/raw/NNN.png): "bold modern cartoon, thick even black outlines, flat fills of solid black and one light grey only, pure white background, no shading, no gradients, no texture", 3:2 landscape (1536 x 1024).
- Linocuts (openers, tail-piece): "bold hand-carved linocut, pure black ink on white, no greys", same size and orientation as the reference; keep its carved border if it has one.
- Mascot spot (game-night): same cartoon style as the reference, Ida Verity exactly as drawn there (bun with a pencil through it, half-moon glasses on a beaded chain, grey cardigan with index cards in the pockets, black skirt), Hearsay a round fluffy mid-grey cat.

## Items (reference file → ID → fix)
1. art/raw/065.png → 065: whole tree inside the frame (rounded crown, whole trunk), white margin all round; same Rousseau scene.
2. art/openers/raw/r09*.png (pick the one matching art/openers/final/r09.png; if unsure use the final) → r09: the woman (Rosalind Franklin) holds an X-ray diffraction photograph showing a dark X-shaped cross of spots (Photo 51), NOT a medical chest X-ray or ribcage; dress her in 1950s clothes (simple blouse and skirt or a lab coat), not Victorian. Everything else the same.
3. art/raw/064.png → 064: the tree fully inside the frame (or drop the tree), nothing cut at top or left.
4. art/raw/093.png → 093: the locomotive's smoke plume ends inside the frame with white above it.
5. art/raw/021.png → 021: same Kitty Genovese street scene but as a vignette on pure white, with NO grey background rectangle; the scene's edges end in white.
6. art/raw/082.png → 082: same Watson and Crick scene as a vignette on white, no grey background box; lamp and desk whole.
7. art/raw/086.png → 086: same Mendeleev scene as a vignette on white, no grey background box; the card rows whole.
8. art/raw/024.png → 024: the shock generator and desk whole, inside the frame.
9. art/raw/009.png → 009: Churchill and the audience all inside the frame (fewer listeners if needed).
10. art/raw/036.png → 036: the whole bomber including nose and propeller inside the frame.
11. art/raw/037.png → 037: Pareto shown whole, head to feet, standing in front of the field; field ends inside the frame.
12. art/raw/039.png → 039: the whole roulette table inside the frame.
13. art/raw/057.png → 057: the whole fridge with a margin around it.
14. art/raw/066.png → 066: the fog as a rounded cloud mass that ends inside the frame, not a grey slab to the edges.
15. art/raw/071.png → 071: fewer office workers, all whole and inside the frame; desk whole.
16. art/raw/004.png → 004: the Leaning Tower of Pisa: round, white, arcaded, tilting clearly; NOT a straight castle turret. Galileo at the top dropping two balls; base whole.
17. art/raw/043.png → 043: two ordinary newspaper readers (one bald, one dark-haired, 1990s clothes); neither may look like Einstein (no wild white hair, no moustache).
18. art/raw/088.png → 088: a teenage Carl Friedrich Gauss (about 15, 1790s clothes, no beard) poring over tables of numbers.
19. art/raw/085.png → 085: Kikunae Ikeda as a Japanese chemist of the 1900s (Meiji-era suit, Japanese features) tasting a bowl of kombu broth in a lab.
20. art/bg/085.png → bg085: same change for the answer-page scene: Ikeda drawn as Japanese. Keep the bg style of the reference (scene low in the frame, empty white above).
21. art/openers/raw/r07*.png (match art/openers/final/r07.png) → r07: replace the thought bubble with goalposts by one showing a pair of prisoners' cells (the prisoner's dilemma); everything else identical.
22. art/extras/raw/ (the source of art/extras/final/tail-r03.png; if not found use the final) → tail-r03: replace the bell and dog bowl with props from Round 3 (a shock-generator dial and a marshmallow on a plate); same linocut tailpiece shape.
23. art/librarian/raw/game-night.png (or final) → game-night: the whole group and table inside the frame with a white margin; nobody cut at the edges.

## After each download
Look at the result with the Read tool. If it fails the fix (still cut, wrong person, text in it, grey box), redo it once with a sharper prompt; if it fails twice, skip it and note why. Append one line per item to art/regen-17nov/LOG.md: ID, done/skipped, any note. Report at the end: done, skipped, and anything odd.
