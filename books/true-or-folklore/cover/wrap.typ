// Full paperback cover for KDP: back | spine | front, with 0.125 in bleed all round.
//
//   typst compile --root books/true-or-folklore --ignore-system-fonts --font-path books/_layout/fonts/static \
//     --input pages=246 --input paper=white books/true-or-folklore/cover/wrap.typ books/true-or-folklore/build/cover.pdf
//
// Spine width uses KDP's per-page thickness: white 0.002252 in, cream 0.0025 in.
// Re-run with the final page count; KDP's cover calculator is the check.
#let pages = int(sys.inputs.at("pages", default: "246"))
#let paper-kind = sys.inputs.at("paper", default: "white")
#let spine = pages * (if paper-kind == "cream" { 0.0025in } else { 0.002252in })
#let bleed = 0.125in
#let trim-w = 6in
#let trim-h = 9in
#let safe = 0.375in // keep text this far inside the trim

#let paper = rgb("#f4f1e8")
#let ink = rgb("#1d1b19")
#let verm = rgb("#d4432b")
#let display = "Fraunces 72pt"
#let mono = "Space Mono"
#let serif = ("LT Text", "LT Text Ext")

#set page(width: 2 * trim-w + spine + 2 * bleed, height: trim-h + 2 * bleed, margin: 0pt, fill: paper)
#set text(font: serif, fill: ink)

#let stamp(word, color, size: 30pt, angle: -8deg, fill: none) = rotate(angle, reflow: true,
  box(stroke: 5pt + color, radius: 6pt, inset: 6pt, fill: fill,
    box(stroke: 1.5pt + color, radius: 3pt, inset: (x: 16pt, y: 8pt),
      text(font: mono, size: size, weight: "bold", tracking: 0.16em, fill: color, word))))
#let mini-boxes = grid(columns: 3, column-gutter: 4pt, ..("TRUE", "FOLKLORE", "DISPUTED").map(w =>
  box(stroke: 1pt + ink, radius: 2pt, inset: (x: 5pt, y: 3pt), text(font: mono, size: 6.5pt, tracking: 0.08em, [☐ #w]))))

// Panels, measured from the left edge of the bleed.
#let back-x = bleed
#let spine-x = bleed + trim-w
#let front-x = bleed + trim-w + spine

// ---------- BACK ----------
// Text stays above the barcode zone: the top block ends 1.45 in above the bottom safe line.
#place(top + left, dx: back-x + safe, dy: bleed + safe, box(width: trim-w - 2 * safe, height: trim-h - 2 * safe - 1.45in, {
  text(font: mono, size: 8pt, tracking: 0.2em)[THE LAW TOME SERIES]
  v(0.2in)
  text(font: display, size: 22pt, hyphenate: false)[Did Newton get hit by an apple?]
  v(0.05in)
  text(font: display, size: 17pt, hyphenate: false)[Did Archimedes shout "Eureka!" in the bath?]
  v(0.05in)
  text(font: display, size: 14pt, hyphenate: false)[Did Galileo drop balls from the Leaning Tower?]
  v(0.16in)
  set par(leading: 0.55em)
  text(size: 10.5pt)[Everyone has heard these stories. Fewer people know which ones happened. *True or Folklore?* puts 100 famous stories from science, history, money and the mind to the test. Guess first: true, folklore or disputed. Then turn the page for the verdict, the real story, why the myth spread and the source that settles it.]
  v(0.16in)
  // "Can you guess?" strip: three real questions from the book, answers inside.
  box(width: 100%, stroke: 1.2pt + ink, radius: 4pt, inset: 10pt, {
    text(font: mono, size: 7.5pt, tracking: 0.18em)[CAN YOU GUESS? ANSWERS INSIDE]
    v(6pt)
    for q in ([Did Churchill promise "blood, sweat and tears"?], [Is the "Mount Stupid" curve in the Dunning–Kruger paper?], [Did roulette land on black 26 times in a row at Monte Carlo?]) {
      grid(columns: (1fr, auto), column-gutter: 8pt, align: horizon, text(size: 9pt, q), mini-boxes)
      v(5pt)
    }
  })
  v(0.14in)
  text(size: 9.5pt)[For quiz nights, family tables, classrooms and the friend who always knows the real story. Or thinks so.]
  v(0.06in)
  text(size: 8.5pt, style: "italic")[Every verdict is checked against the record, with the source named on the page. Seventeen stories are still genuinely disputed, and the book says so.]
}))
// The Librarian, ink on cream (art/librarian/final/back-cover-oncream.png), in the gap between the text block and the footer, left of the barcode zone.
#place(top + left, dx: back-x + safe, dy: bleed + trim-h - safe - 0.2in - 0.14in - 1.35in,
  image("/art/librarian/final/back-cover-oncream.png", width: 1.35in))
// Her name, to the right of the drawing, still left of the barcode zone.
#place(top + left, dx: back-x + safe + 1.5in, dy: bleed + trim-h - safe - 0.2in - 0.14in - 0.62in,
  box(width: 1.1in, text(size: 8pt, style: "italic", hyphenate: false)[Your host, Ida Verity. No source, no stamp.]))
// Footer to the left of the barcode zone.
#place(top + left, dx: back-x + safe, dy: bleed + trim-h - safe - 0.2in,
  text(font: mono, size: 8pt, tracking: 0.14em)[CONYSO PUBLISHING · CONYSO.COM/LAWTOME])
// KDP prints the barcode here: keep a clear 2 x 1.2 in area at the lower right of the back.
#place(top + left, dx: back-x + trim-w - safe - 2in, dy: bleed + trim-h - safe - 1.2in, rect(width: 2in, height: 1.2in, fill: white))

// ---------- SPINE ----------
#place(top + left, dx: spine-x, dy: bleed, box(width: spine, height: trim-h, fill: ink,
  align(center + horizon, rotate(90deg, reflow: true, box(width: trim-h - 1in, {
    grid(columns: (auto, 1fr, auto), align: horizon,
      text(font: display, size: 15pt, fill: paper)[True or Folklore?],
      [],
      text(font: mono, size: 7pt, tracking: 0.18em, fill: paper)[THE LAW TOME · CONYSO PUBLISHING])
  })))))

// ---------- FRONT (cover B, picked by Krishna 16 Nov 2026; quiz band A added 17 Nov) ----------
// Cream, an ink frame, the Newton cartoon with the vermillion FOLKLORE stamp slammed on it.
#place(top + left, dx: front-x + 0.32in, dy: bleed + 0.32in, rect(width: trim-w - 0.64in, height: trim-h - 0.64in, stroke: 3pt + ink))
#place(top + left, dx: front-x + 0.6in, dy: bleed + 0.7in, box(width: trim-w - 1.2in, height: trim-h - 1.3in, {
  set par(spacing: 0pt)
  // Quiz band (option A, picked by Krishna 17 Nov 2026): says "quiz" at Amazon thumbnail size.
  block(width: 100%, fill: verm, inset: (y: 9pt), align(center, text(font: mono, size: 15pt, weight: "bold", tracking: 0.12em, fill: paper)[THE MYTH-BUSTING QUIZ BOOK]))
  v(0.3in)
  align(center, block(text(font: display, size: 62pt, hyphenate: false, { set par(leading: 0.3em); [True or Folklore?] })))
  v(0.22in)
  align(center, text(size: 15pt, style: "italic")[100 famous stories you've been told wrong])
  v(1fr)
  box(width: 100%, height: 3.7in, {
    // Full tree (redrawn 17 Nov 2026 so the crown isn't cut); picture sits left so the stamp lands beside Newton, not on him.
    align(left + horizon, pad(left: 0.25in, image("/cover/002-fulltree-oncream.png", height: 3.6in, fit: "contain")))
    place(bottom + right, dx: 0.12in, dy: -1.05in, stamp("FOLKLORE", verm, size: 19pt, angle: -12deg, fill: paper))
  })
  v(1fr)
  align(center, text(font: mono, size: 9pt, tracking: 0.14em)[THE MYTH-BUSTING QUIZ FOR CURIOUS MINDS])
  v(0.1in)
  align(center, text(font: mono, size: 9pt, tracking: 0.14em)[ED. KRISHNA CHAGTI])
}))
