// Three ways to make the front say "quiz" at thumbnail size (expert panel, 17 Nov 2026). Front only, with bleed.
#let paper = rgb("#f4f1e8")
#let ink = rgb("#1d1b19")
#let verm = rgb("#d4432b")
#let display = "Fraunces 72pt"
#let mono = "Space Mono"
#let serif = ("LT Text", "LT Text Ext")
#set page(width: 6.25in, height: 9.25in, margin: 0pt, fill: paper)
#set text(font: serif, fill: ink)
#let stamp(word, color, size: 30pt, angle: -8deg, fill: none) = rotate(angle, reflow: true,
  box(stroke: 5pt + color, radius: 6pt, inset: 6pt, fill: fill,
    box(stroke: 1.5pt + color, radius: 3pt, inset: (x: 16pt, y: 8pt),
      text(font: mono, size: size, weight: "bold", tracking: 0.16em, fill: color, word))))
#let frame = place(top + left, dx: 0.445in, dy: 0.445in, rect(width: 5.36in, height: 8.36in, stroke: 3pt + ink))
#let art(h) = box(width: 100%, height: h, {
  align(center + horizon, image("/cover/002-oncream.png", height: h - 0.2in, fit: "contain"))
  place(bottom + right, dx: 0.05in, dy: -0.15in, stamp("FOLKLORE", verm, size: 22pt, angle: -12deg, fill: paper))
})
#let body(top-band: none, under-title: none, cartoon: 3.7in, bottom: true) = {
  frame
  place(top + left, dx: 0.725in, dy: 0.825in, box(width: 4.8in, height: 7.95in, {
    set par(spacing: 0pt)
    if top-band != none { top-band } else { align(center, text(font: mono, size: 9pt, tracking: 0.2em)[THE LAW TOME SERIES]) }
    v(0.3in)
    align(center, block(text(font: display, size: 62pt, hyphenate: false, { set par(leading: 0.3em); [True or Folklore?] })))
    v(0.22in)
    if under-title != none { under-title } else { align(center, text(size: 15pt, style: "italic")[100 famous stories you've been told wrong]) }
    v(1fr)
    art(cartoon)
    v(1fr)
    if bottom { align(center, text(font: mono, size: 9pt, tracking: 0.14em)[THE MYTH-BUSTING QUIZ FOR CURIOUS MINDS]); v(0.1in) }
    align(center, text(font: mono, size: 9pt, tracking: 0.14em)[ED. KRISHNA CHAGTI])
  }))
}
// A: a vermillion band across the top
#body(top-band: block(width: 100%, fill: verm, inset: (y: 9pt), align(center, text(font: mono, size: 15pt, weight: "bold", tracking: 0.12em, fill: paper)[THE MYTH-BUSTING QUIZ BOOK])), bottom: true)
#pagebreak()
// B: the subtitle becomes the quiz line, big
#body(under-title: { align(center, text(font: mono, size: 17pt, weight: "bold", tracking: 0.06em, fill: verm)[A 100-QUESTION QUIZ]); v(5pt); align(center, text(size: 14pt, style: "italic")[on the famous stories you've been told wrong]) }, bottom: false)
#pagebreak()
// C: an ink banner at the foot with the three answers
#body(cartoon: 3.3in, bottom: false)
#place(bottom + left, dx: 0.445in, dy: -1.05in, block(width: 5.36in, fill: ink, inset: (y: 9pt), align(center, text(font: mono, size: 13pt, weight: "bold", tracking: 0.1em, fill: paper)[QUIZ: TRUE · FOLKLORE · DISPUTED?])))
