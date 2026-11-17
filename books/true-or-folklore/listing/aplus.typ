// Amazon A+ modules, 970 x 600 px each (render at 144 ppi = 2x, then downscale).
// Words only from the book itself; no invented numbers or claims.
#let display = ("Fraunces 72pt",)
#let serif = ("LT Text", "LT Text Ext")
#let mono = ("Space Mono",)
#let red = rgb("#d4432b")
#let cream = rgb("#f4f1e8")
#set page(width: 485pt, height: 300pt, margin: 0pt, fill: cream)
#set text(font: serif, size: 10pt)
#let pg(f, w) = box(stroke: 0.6pt + luma(60%), image(f, width: w))
#let kicker(t) = text(font: mono, size: 7pt, tracking: 0.14em, upper(t))
#let ex(name) = sys.inputs.at(name, default: none)

// 1. Banner: three question pages side by side.
#page(fill: red, {
  place(top + left, dx: 22pt, dy: 22pt, block(width: 150pt, {
    set text(fill: cream)
    kicker[True or Folklore?]
    v(8pt)
    text(font: display, size: 24pt, hyphenate: false)[100 famous stories you've been told wrong]
    v(8pt)
    text(size: 9.5pt, style: "italic")[Guess first. Turn the page. See what the record says.]
  }))
  place(right + horizon, dx: -16pt, grid(columns: 3, column-gutter: 8pt,
    rotate(-4deg, pg("pages/p15.png", 92pt)), pg("pages/p17.png", 92pt), rotate(4deg, pg("pages/p21.png", 92pt))))
})

// 2. How it works: question page, turn, verdict page.
#page({
  place(top + center, dy: 18pt, text(font: display, size: 20pt)[How it works])
  place(center + horizon, dy: 14pt, grid(columns: 5, column-gutter: 14pt, align: center + horizon,
    [#box(stroke: 0.6pt + luma(60%), image("pages/p15.png", height: 186pt)) #v(4pt) #kicker[1 · Make your call]],
    text(font: display, size: 30pt, fill: red)[→],
    [#text(font: display, size: 15pt)[Turn the page] #v(2pt) #text(size: 9pt, style: "italic")[True, Folklore \ or Disputed?]],
    text(font: display, size: 30pt, fill: red)[→],
    [#box(stroke: 0.6pt + luma(60%), image("pages/p16.png", height: 186pt)) #v(4pt) #kicker[2 · The verdict, with sources]]))
})

// 3. Four "Tell someone" lines, straight from the book.
#page({
  place(top + center, dy: 18pt, text(font: display, size: 20pt)[One line worth repeating, on every answer])
  let card(t) = box(width: 205pt, height: 78pt, inset: 10pt, stroke: (left: 2pt + red), fill: white, [#kicker[Tell someone] #v(3pt) #text(size: 9pt, style: "italic", t)])
  place(center + horizon, dy: 16pt, grid(columns: 2, column-gutter: 12pt, row-gutter: 12pt,
    card[Archimedes did state the law of buoyancy, but the bath and the "Eureka!" almost certainly come from Vitruvius, writing some two centuries later.],
    card[In the earliest account of Newton's apple, published in 1752, the apple falls but never hits him; the bump came later.],
    card[Most of the chains in Milgram's small-world experiment never reached their target, and the famous six is a median of the minority that did.],
    card[Georges Lemaître derived Hubble's law in 1927, two years before Hubble's paper, and since 2018 the IAU recommends calling it the Hubble–Lemaître law.]))
})

// 4. Who it's for.
#page({
  place(top + center, dy: 18pt, text(font: display, size: 20pt)[Who it's for])
  let tile(img, t, s) = box(width: 105pt, height: 170pt, fill: white, inset: 6pt, {
    align(center, box(height: 80pt, width: 100%, if img != none { image(img, height: 80pt, fit: "contain") }))
    v(6pt)
    align(center, [#text(font: display, size: 13pt, t) #v(2pt) #text(size: 8.5pt, style: "italic", s)])
  })
  place(center + horizon, dy: 18pt, grid(columns: 4, column-gutter: 10pt,
    tile("../art/librarian/final/gift.png", [A gift], [with a page to sign]),
    tile("../art/librarian/final/game-night.png", [Game night], [teams, a scoresheet, ten rounds]),
    tile("../art/librarian/final/classroom.png", [Classrooms], [classroom ideas in the back]),
    tile(ex("host"), [Quiz hosts], [read the question, reveal the verdict])))
})

// 5. Art banner (linocut panorama), when it exists.
#if ex("panorama") != none { page(fill: white, {
  place(center + bottom, dy: -6pt, image(ex("panorama"), height: 84%, fit: "contain"))
  place(top + center, dy: 20pt, block(fill: white, inset: (x: 10pt, y: 4pt), text(font: display, size: 22pt)[Ten rounds. One hundred stories.]))
}) }
