// A + B combined: the Stamp's vermillion ground and big type, with the
// debunked-cartoon panel. Two takes on how the cartoon sits.
#let paper = rgb("#f4f1e8")
#let ink = rgb("#1d1b19")
#let verm = rgb("#d4432b")
#let display = "Fraunces 72pt"
#let mono = "Space Mono"
#let serif = ("LT Text", "LT Text Ext")
#set page(width: 6.125in, height: 9.25in, margin: 0pt)
#set text(font: serif, fill: ink)

#let stamp(word, color, size: 30pt, angle: -8deg, fill: none) = rotate(angle, reflow: true,
  box(stroke: 5pt + color, radius: 6pt, inset: 6pt, fill: fill,
    box(stroke: 1.5pt + color, radius: 3pt, inset: (x: 16pt, y: 8pt),
      text(font: mono, size: size, weight: "bold", tracking: 0.16em, fill: color, word))))
#let series = text(font: mono, size: 9pt, tracking: 0.2em, fill: paper)[THE LAW TOME SERIES]
#let subtitle = text(size: 16pt, style: "italic", fill: paper)[100 famous stories you've been told wrong]
#let kicker = text(font: mono, size: 8.5pt, tracking: 0.12em, fill: paper)[THE MYTH-BUSTING QUIZ FOR CURIOUS MINDS]

// D1 — title on top, cartoon in a cream card with an ink frame, ink stamp slammed across the card's corner.
#page(fill: verm, pad(x: 0.55in, top: 0.6in, bottom: 0.5in, {
  series
  v(0.2in)
  block(text(font: display, size: 60pt, fill: paper, hyphenate: false, { set par(leading: 0.35em); [True or Folklore?] }))
  v(0.08in)
  subtitle
  v(1fr)
  box(width: 100%, {
    box(width: 100%, fill: paper, stroke: 3pt + ink, radius: 6pt, inset: 10pt, align(center, image("/art/final/002.png", height: 3.05in, fit: "contain")))
    place(bottom + right, dx: 0.18in, dy: 0.22in, stamp("FOLKLORE", ink, size: 24pt, angle: -11deg, fill: paper))
  })
  v(0.35in)
  kicker
}))

// D2 — big stamp-led title like A; the cartoon tucked into a round cream badge, like a seal on the cover.
#page(fill: verm, pad(x: 0.55in, top: 0.6in, bottom: 0.5in, {
  series
  v(0.3in)
  block(text(font: display, size: 70pt, fill: paper, hyphenate: false, { set par(leading: 0.3em); [True or #linebreak() Folklore?] }))
  v(0.15in)
  subtitle
  v(1fr)
  grid(columns: (1fr, 2.2in), column-gutter: 8pt, align: horizon,
    stamp("FOLKLORE", ink, size: 17pt, angle: -9deg, fill: paper),
    box(width: 2.2in, height: 2.2in, radius: 1.1in, fill: paper, stroke: 4pt + ink, clip: true,
      align(center + horizon, image("/art/final/001.png", width: 92%))))
  v(1fr)
  kicker
}))
