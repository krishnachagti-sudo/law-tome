// Three front-cover directions for True or Folklore? (6 x 9 in + 0.125 in bleed).
// Colour is allowed on the cover; the palette is the Law Tome's: paper, ink, vermillion.
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

#let subtitle = [100 famous stories you've been told wrong]
#let kicker = [The myth-busting quiz for curious minds]
#let series = text(font: mono, size: 9pt, tracking: 0.2em)[THE LAW TOME SERIES]

// A — "The Stamp": all type, vermillion ground, one huge crooked stamp.
#page(fill: verm, {
  pad(x: 0.6in, top: 0.75in, bottom: 0.6in, {
    set text(fill: paper)
    series
    v(0.45in)
    text(font: display, size: 74pt, hyphenate: false)[True or]
    v(-0.2in)
    text(font: display, size: 74pt, hyphenate: false)[Folklore?]
    v(0.25in)
    text(size: 17pt, style: "italic", subtitle)
    v(1fr)
    align(center, stamp("FOLKLORE", ink, size: 34pt, angle: -9deg, fill: paper))
    v(1fr)
    grid(columns: (1fr, auto), align(bottom, text(font: mono, size: 9pt, tracking: 0.12em, upper(kicker))), align(bottom, text(font: mono, size: 9pt, tracking: 0.12em)[ED. KRISHNA CHAGTI]))
  })
})

// B — "The Debunked Cartoon": cream, ink frame, one famous myth with the stamp slammed on it.
#page(fill: paper, {
  place(top + left, dx: 0.32in, dy: 0.32in, rect(width: 6.125in - 0.64in, height: 9.25in - 0.64in, stroke: 3pt + ink))
  pad(x: 0.6in, top: 0.7in, bottom: 0.6in, {
    align(center, series)
    v(0.2in)
    align(center, text(font: display, size: 62pt, hyphenate: false)[True or Folklore?])
    v(0.05in)
    align(center, text(size: 15pt, style: "italic", subtitle))
    v(1fr)
    box(width: 100%, {
      align(center, image("/art/final/002.png", width: 95%))
      place(bottom + right, dx: 0.1in, dy: 0.15in, stamp("FOLKLORE", verm, size: 22pt, angle: -12deg, fill: paper))
    })
    v(1fr)
    align(center, text(font: mono, size: 9pt, tracking: 0.14em, upper(kicker)))
  })
})

// C — "The Verdict Grid": ink ground, four stamped cartoon tiles, title band.
#let tile(img, word, color) = box(width: 100%, height: 1.45in, fill: paper, radius: 4pt, clip: true, inset: 6pt, {
  align(center + horizon, image(img, height: 100%, fit: "contain"))
  place(bottom + right, dx: -2pt, dy: -2pt, stamp(word, color, size: 10pt, angle: -10deg, fill: paper))
})
#page(fill: ink, {
  pad(x: 0.5in, top: 0.6in, bottom: 0.5in, {
    set text(fill: paper)
    series
    v(0.15in)
    text(font: display, size: 60pt, hyphenate: false)[True or Folklore?]
    v(0.05in)
    text(size: 14pt, style: "italic", fill: paper, subtitle)
    v(0.3in)
    grid(columns: (1fr, 1fr), gutter: 10pt,
      tile("/art/final/001.png", "FOLKLORE", verm),
      tile("/art/final/004.png", "?", ink),
      tile("/art/final/005.png", "?", ink),
      tile("/art/final/003.png", "TRUE", ink))
    v(1fr)
    align(center, text(font: mono, size: 9pt, tracking: 0.14em, fill: paper, upper(kicker)))
  })
})
