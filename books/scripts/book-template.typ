// The Law Tome series interior, 6 x 9 in, black ink.
// The site's "Index" concept carried into print: Fraunces for the question
// (the law itself), Space Mono for the system (round, number, verdict),
// Newsreader for the prose. No colour: the vermillion lives on the cover.

#let serif = ("LT Text", "LT Text Ext")
#let display = ("Fraunces 72pt",)
#let mono = ("Space Mono",)
#let ink = black
#let rule-gray = luma(55%)

#set document(title: "True or Folklore?", author: "Krishna Chagti")
#set text(font: serif, size: 10.25pt, lang: "en", region: "us", hyphenate: true, number-type: "old-style")
#set par(justify: true, leading: 0.6em, spacing: 0.75em, first-line-indent: (amount: 1.1em, all: false))

// KDP gutter: 0.5 in minimum at 151–300 pages, 0.625 in at 301–500; we give 0.7 in.
#let running = state("running", none)
// Design extras: art the build found (see typeset.mjs). ex("name") is its path or none.
#let ex(name) = extras.at(name, default: none)
// Flipbook frames flip-001, flip-002, ... in order, one per right-hand page, so the
// story runs once through the book instead of looping.
#let flip-frames = extras.keys().filter(k => k.starts-with("flip-")).sorted().map(k => extras.at(k))
#set page(

  width: 6in, height: 9in,
  margin: (inside: 0.7in, outside: 0.55in, top: 0.72in, bottom: 0.78in),
  header: context {
    let r = running.get()
    if r == none { return }
    let p = here().page()
    set text(font: mono, size: 6.5pt, tracking: 0.08em)
    if calc.even(p) [#upper("True or Folklore?") #h(1fr)] else [#h(1fr) #upper(r)]
  },
  footer: context {
    if running.get() == none { return }
    let p = here().page()
    set text(font: mono, size: 7pt)
    // Flipbook: a small frame beside the folio on every right-hand page inside the
    // rounds, one step per spread, so thumbing the pages animates it.
    let fl = if flip-frames.len() > 0 and calc.odd(p) { box(baseline: 30%, image(flip-frames.at(calc.rem(calc.max(0, calc.quo(p, 2) - 7), flip-frames.len())), height: 0.34in)) + h(6pt) } else { none }
    if calc.even(p) [#counter(page).display() #h(1fr)] else [#h(1fr) #fl #counter(page).display()]
  },
)

#show heading.where(level: 1): it => {
  set text(font: display, size: 22pt, weight: 400)
  block(below: 1em, it.body)
}
#show heading.where(level: 2): it => {
  set text(font: display, size: 14pt, weight: 400)
  block(above: 1.4em, below: 0.8em, { it.body; v(4pt); line(length: 28pt, stroke: 2pt + ink) })
}
#show heading.where(level: 3): it => {
  set text(font: mono, size: 8pt, tracking: 0.08em)
  block(above: 1.2em, below: 0.6em, upper(it.body))
}

#let label-mono(body) = text(font: mono, size: 7pt, tracking: 0.1em, number-type: "lining", upper(body))

#let tick-mark = box(width: 11pt, height: 11pt, baseline: 2pt, {
  place(line(start: (1pt, 6pt), end: (4.5pt, 9.5pt), stroke: (paint: ink, thickness: 2.2pt, cap: "round")))
  place(line(start: (4.5pt, 9.5pt), end: (10pt, 1.5pt), stroke: (paint: ink, thickness: 2.2pt, cap: "round")))
})
#let cross-mark = box(width: 11pt, height: 11pt, baseline: 2pt, {
  place(line(start: (1pt, 1pt), end: (10pt, 10pt), stroke: 2.2pt + ink))
  place(line(start: (10pt, 1pt), end: (1pt, 10pt), stroke: 2.2pt + ink))
})
#let balance-mark = box(width: 12pt, height: 11pt, baseline: 2pt, {
  place(line(start: (6pt, 1pt), end: (6pt, 10pt), stroke: 1.4pt + ink))
  place(line(start: (0pt, 3pt), end: (12pt, 3pt), stroke: 1.4pt + ink))
  place(dx: 0pt, dy: 5pt, circle(radius: 2pt, stroke: 1.2pt + ink))
  place(dx: 8pt, dy: 5pt, circle(radius: 2pt, stroke: 1.2pt + ink))
})
// A row of the three verdict marks between rules: the book's recurring ornament.
#let ornament() = align(center, box(width: 70%, grid(columns: (1fr, auto, 1fr), column-gutter: 8pt, align: horizon,
  line(length: 100%, stroke: 0.5pt + ink), [#tick-mark #h(6pt) #cross-mark #h(6pt) #balance-mark], line(length: 100%, stroke: 0.5pt + ink))))


#let title-page() = {
  // Each of these is its own page() so no page setting leaks and forces a blank.
  page(header: none, footer: none, {
  v(1.6in)
  align(center)[
    #label-mono[The Law Tome series]
    #v(0.35in)
    #text(font: display, size: 38pt, weight: 400)[True or \ Folklore?]
    #v(0.25in)
    #block(width: 80%, text(font: serif, size: 12pt, style: "italic")[100 famous stories you've been told wrong: the myth-busting quiz for curious minds])
    #if ex("emblem") != none { v(0.45in); image(ex("emblem"), width: 0.85in); v(0.4in) } else { v(1.6in) }
    #text(font: serif, size: 11pt)[Edited by Krishna Chagti]
    #v(0.15in)
    #label-mono[Conyso Publishing]
  ]
  })
  // Copyright page.
  page(header: none, footer: none, {
  set par(first-line-indent: 0pt, justify: false, leading: 0.55em, spacing: 0.9em)
  set text(size: 7.5pt)
  v(1fr)
  text(weight: "bold")[True or Folklore?]
  [ 100 Famous Stories You've Been Told Wrong: The Myth-Busting Quiz for Curious Minds \ The Law Tome series, book 1]
  par[Copyright © 2026 Krishna Chagti. Published by Conyso Publishing, conyso.com. First edition, 2026.]
  par[ISBN #box(fill: luma(88%), inset: (x: 2pt))[TO ADD FROM KDP] (paperback)]
  par[All rights reserved. No part of this book may be reproduced without written permission, except for short quotations in reviews. The score table and team scoresheet may be copied for personal and classroom use, and teachers may copy single question-and-answer spreads for their own classes.]
  par[Parts of the text adapt records from the Law Tome (conyso.com/lawtome), which are published under the Creative Commons Attribution 4.0 license (CC BY 4.0, creativecommons.org/licenses/by/4.0).]
  par[How this book was made: the entries were drafted with AI tools from the Law Tome's sourced records and checked against the sources named on each page. The illustrations were made with AI image tools.]
  par[This book is for entertainment and education. Each verdict reflects the evidence available when it was written. If the evidence changes, or we got one wrong, the correction goes up at conyso.com/lawtome/errata.]
  v(0.3in)
})
}

// Dedication: the verso after the gift page, which is otherwise blank, so it costs no pages.
#let dedication-page(body) = page(header: none, footer: none, {
  v(2.4in)
  align(center, block(width: 75%, text(size: 11pt, style: "italic", body)))
})

#let gift-page() = {
  // page() opens its own page; the title and copyright leave us on an odd one.
  page(header: none, footer: none, {
  set par(first-line-indent: 0pt)
  v(0.25in)
  box(width: 100%, height: 6.9in, stroke: 1.6pt + ink, inset: 6pt, box(width: 100%, height: 100%, stroke: 0.5pt + ink, inset: 0.4in, {
    align(center, {
      v(0.5in)
      ornament()
      v(0.35in)
      text(font: display, size: 26pt)[For]
      v(0.25in); line(length: 70%, stroke: 0.6pt + ink)
      v(0.3in)
      text(style: "italic", size: 12pt)[who always knows the real story.]
      linebreak()
      text(style: "italic", size: 12pt)[Or thinks so.]
      v(0.45in)
      text(font: display, size: 16pt)[From]
      v(0.25in); line(length: 55%, stroke: 0.6pt + ink)
      v(0.3in)
      // The Librarian holds up her stamp beside the certificate (MASCOT.md).
      grid(columns: (auto, auto), column-gutter: 10pt, align: horizon,
        rotate(-6deg, reflow: true, box(stroke: 2pt + ink, radius: 3pt, inset: (x: 10pt, y: 6pt), text(font: mono, size: 10pt, weight: "bold", tracking: 0.2em)[CERTIFIED KNOW-IT-ALL])),
        image("/art/librarian/final/gift.png", width: 1.25in))
    })
  }))
})
}

#let front-matter(body) = {
  set page(header: none)
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt)
  body
}

#let back-matter(body) = {
  running.update("Back matter")
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt)
  body
}

#let score-table(cols, cells) = {
  set text(size: 9.5pt)
  table(
    columns: if cols == 3 { (auto, 1fr, 1.3in) } else { cols },
    stroke: (x, y) => (bottom: 0.5pt + rule-gray, top: if y == 0 { 0.8pt + ink } else { none }),
    inset: (x: 5pt, y: 7pt),
    ..cells.enumerate().map(((i, c)) => if i < cols { text(font: mono, size: 7pt, tracking: 0.08em, upper(c)) } else { c }),
  )
}

#let round-opener(n, name, blurb, intro, art: none) = {
  running.update(none)
  // A small vignette on the blank left-hand page before round 1, if there is one.
  if n == 1 and ex("tail-1") != none {
    pagebreak(to: "even", weak: true)
    page(header: none, footer: none, align(center + horizon, image(ex("tail-1"), width: 2.2in)))
  }
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt)
  v(0.35in)
  text(font: display, size: 120pt, fill: luma(80%), str(n))
  v(-0.5in)
  [#label-mono[Round #n of 10] #label("round-" + str(n))]
  v(0.15in)
  { set par(justify: false); text(font: display, size: 30pt, weight: 400, hyphenate: false, name) }
  v(0.12in)
  text(style: "italic", size: 11.5pt, blurb)
  v(0.25in)
  ornament()
  v(0.2in)
  intro
  v(1fr)
  let tail = ex("tail-r" + (if n < 10 { "0" } else { "" }) + str(n))
  if tail != none { align(center, image(tail, width: 2.5in, height: 1.4in, fit: "contain")); v(1fr) }
  label-mono[Ten stories. Guess first. Score at the end of the round.]
  // The round's linocut fills the facing left-hand page, so the first
  // question still lands on a right-hand page with nothing blank between.
  pagebreak()
  if art != none {
    align(center + horizon, image(art, width: 100%, height: 100%, fit: "contain"))
  } else {
    block(width: 100%, height: 100%, stroke: (paint: rule-gray, thickness: 0.6pt, dash: "dashed"), inset: 10pt,
      align(center + horizon, label-mono[Illustration · linocut · round #n]))
  }
  running.update(name)
}

#let verdict-icon(v) = if v == "TRUE" { tick-mark } else if v == "FOLKLORE" { cross-mark } else { balance-mark }
// The verdict as a stamp in words, never colour alone.
// Each verdict has its own shape, so it reads at a glance in black ink only:
// TRUE is upright and solid with a tick, FOLKLORE is a crooked rubber stamp
// with a cross, DISPUTED is a dashed box with a balance mark.
#let stamp(v) = {
  let word = text(font: mono, size: 12pt, weight: "bold", tracking: 0.22em, v)
  let lv = lower(v)
  if ex("stamp-" + lv) != none {
    // A drawn rubber stamp with the word in it.
    return box(inset: (y: 2pt), image(ex("stamp-" + lv), height: 0.46in))
  }
  if ex("stamp-frame") != none {
    // A drawn empty stamp frame, the word set in type inside it.
    return box(height: 0.36in, width: 1.6in, {
      place(center + horizon, image(ex("stamp-frame"), width: 100%, height: 100%, fit: "stretch"))
      place(center + horizon, rotate(-4deg, [#verdict-icon(v) #h(4pt) #word]))
    })
  }
  if ex("seal-" + lv) != none {
    // A drawn round seal with the verdict's mark, the word set beside it.
    return box(grid(columns: 2, column-gutter: 7pt, align: horizon, image(ex("seal-" + lv), height: 0.5in), word))
  }
  if v == "TRUE" {
    box(stroke: 1.6pt + ink, inset: (x: 6pt, y: 4pt), box(stroke: 0.5pt + ink, inset: (x: 7pt, y: 4pt), [#tick-mark #h(5pt) #word]))
  } else if v == "FOLKLORE" {
    box(inset: (y: 3pt), rotate(-3deg, reflow: true, box(stroke: 2.4pt + ink, radius: 3pt, inset: (x: 9pt, y: 6pt), [#cross-mark #h(5pt) #word])))
  } else {
    box(stroke: (paint: ink, thickness: 1.4pt, dash: "dashed"), inset: (x: 10pt, y: 6pt), [#balance-mark #h(5pt) #word])
  }
}

// The answer boxes carry the same marks as the verdict stamps, so the key is
// learned on the first question, before any reveal.
#let guess-box(word) = box(width: 1fr, stroke: 0.8pt + ink, radius: 3pt, inset: (x: 8pt, y: 8pt))[
  #box(width: 8pt, height: 8pt, stroke: 0.8pt + ink) #h(4pt) #box(scale(65%, reflow: true, if word == "TRUE" { tick-mark } else if word == "FOLKLORE" { cross-mark } else { balance-mark })) #h(3pt) #text(font: mono, size: 7.5pt, tracking: 0.1em, word)
]

// Difficulty as drawn stars (no font in the set carries a star glyph).
#let star(filled) = box(baseline: 1pt, polygon(
  fill: if filled { ink } else { none }, stroke: 0.6pt + ink,
  ..range(10).map(i => {
    let r = if calc.even(i) { 4.2pt } else { 1.8pt }
    let a = -90deg + i * 36deg
    (4.2pt + r * calc.cos(a), 4.2pt + r * calc.sin(a))
  }),
))
#let stars(d) = { for i in range(3) { star(i < d); h(1.5pt) } }

// The share line closes each answer: the one fact worth repeating.
#let tell(body) = block(width: 100%, inset: (left: 9pt, y: 5pt), stroke: (left: 1.6pt + ink), above: 0.7em, below: 0.6em, {
  set par(first-line-indent: 0pt, justify: false)
  // The icon hangs in the outside margin, left of the rule, so it adds no height to the answer.
  if ex("tell-icon") != none { place(dx: -0.42in, dy: -1pt, image(ex("tell-icon"), height: 0.26in)) }
  text(font: mono, size: 6.5pt, tracking: 0.1em, upper[Tell someone])
  linebreak()
  text(style: "italic", body)
})

#let story(n, wc, round, rname, question, verdict, paras, sources, art: none, difficulty: 0, share: none, next: none, bg: none) = {
  // Question alone on a right-hand page, with its cartoon under it.
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt)
  v(if art == none { 1.1in } else { 0.35in })
  [#label-mono[Round #round · № #n] #label("q-" + str(n))]
  if difficulty > 0 { h(8pt); stars(difficulty) }
  v(0.14in)
  block(width: 100%, { set par(justify: false, leading: 0.5em); text(font: display, size: if art == none { 25pt } else { 22pt }, weight: 400, hyphenate: false, question) })
  if art != none {
    v(1fr)
    align(center, image(art, width: 100%, height: 3.6in, fit: "contain"))
    v(1fr)
  } else { v(0.5in) }
  label-mono[Your call]
  v(6pt)
  grid(columns: (1fr, 1fr, 1fr), column-gutter: 6pt, guess-box("TRUE"), guess-box("FOLKLORE"), guess-box("DISPUTED"))
  // Confidence: a confident wrong guess is the one people remember the answer to.
  v(5pt)
  align(right, text(font: mono, size: 6.5pt, tracking: 0.1em)[#box(width: 6pt, height: 6pt, stroke: 0.6pt + ink) SURE #h(10pt) #box(width: 6pt, height: 6pt, stroke: 0.6pt + ink) GUESSING])
  if art == none { v(1fr) } else { v(0.25in) }
  align(right, label-mono[Answer overleaf →])
  pagebreak()
  // "What really happened": a pale scene behind the answer, strongest at the
  // foot of the page and fading out upward so the top of the text stays clean.
  // The answer page is always a left-hand page, so the outside margin is on the left.
  // The answer. Long answers step down so each fits on its one page.
  set text(size: if wc > 445 { 8.5pt } else if wc > 425 { 8.7pt } else if wc > 405 { 8.9pt } else if wc > 400 { 9pt } else if wc > 380 { 9.2pt } else if wc > 360 { 9.45pt } else if wc > 340 { 9.7pt } else if wc > 315 { 9.95pt } else { 10.25pt })
  let body = {
    [#label-mono[№ #n · #question] #label("ans-" + str(n))]
    v(0.08in)
    stamp(verdict)
    v(0.1in)
    for (i, p) in paras.enumerate() { if i == 0 { p } else { h(1.1em); p }; parbreak() }
    if share != none { tell(share) }
    line(length: 30%, stroke: 0.5pt + rule-gray)
    set par(first-line-indent: 0pt, justify: false)
    text(size: 8pt, style: "italic")[Sources: #sources]
    if next != none {
      v(0.6em)
      // The confident miss is the story people retell, so the score line asks for it by number.
      align(right, label-mono[Round score: #box(width: 22pt, height: 7pt, stroke: (bottom: 0.5pt + ink)) / 10 #h(8pt) Most confident miss: № #box(width: 18pt, height: 7pt, stroke: (bottom: 0.5pt + ink))])
      v(3pt)
      align(right, label-mono[Next → #next])
    }
  }
  // "What really happened": a pale scene at the foot of the answer page. It is sized to the
  // space the text leaves (measured first) and drawn behind it, so it never runs under any
  // words (art audit, 17 Nov 2026). It may run into the bottom margin, as before, and is left
  // out when there is no real room for it.
  context {
    if bg != none {
      let used = measure(block(width: 4.75in, body)).height
      let nat = measure(image(bg, width: 5.8in)).height
      let h = calc.min(nat, 7.5in - used + 0.58in - 0.18in)
      if h > 0.9in {
        place(top + left, dx: -0.55in, dy: 7.5in + 0.58in - h, box(width: 6in, align(center + top, image(bg, height: h))))
      }
    }
    body
  }
}

// "The 10 biggest surprises": the page readers photograph. Answers are
// referenced by page so a reader can jump straight to each one.
#let verdict-mark(v) = if v == "TRUE" { tick-mark } else if v == "FOLKLORE" { cross-mark } else { balance-mark }
#let surprises(items) = {
  running.update("The 10 biggest surprises")
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt, justify: false)
  heading(level: 1)[The 10 biggest surprises]
  text(style: "italic")[Our pick of the ten most likely to fool you. Answers on the pages shown.]
  v(0.1in)
  ornament()
  v(0.12in)
  for (i, it) in items.enumerate() {
    block(breakable: false, grid(columns: (30pt, 1fr, 16pt, 30pt), column-gutter: 8pt, align: horizon,
      text(font: display, size: 22pt, str(i + 1)),
      it.question,
      verdict-mark(it.verdict),
      align(right, text(font: mono, size: 8pt, context { "p. " + str(counter(page).at(label("ans-" + str(it.n))).first()) }))))
    v(2pt); line(length: 100%, stroke: 0.4pt + luma(70%)); v(4pt)
  }
  v(6pt)
  align(center, [#tick-mark #h(3pt) #label-mono[True] #h(14pt) #cross-mark #h(3pt) #label-mono[Folklore] #h(14pt) #balance-mark #h(3pt) #label-mono[Disputed]])
  if ex("surprises") != none {
    pagebreak()
    v(1fr)
    align(center, image(ex("surprises"), width: 3.4in))
    v(0.2in)
    align(center, text(style: "italic", size: 11pt)[How many of the ten did you call right?])
    v(1fr)
  }
}

// Contents: rounds with page numbers, and every question under its round, so
// a browser in Look Inside sees the full range of stories.
#let leaders = box(width: 1fr, repeat(text(fill: rule-gray, size: 7pt)[. ]))
#let contents(rounds) = {
  // Frontispiece: the otherwise blank left-hand page facing the contents.
  if ex("frontispiece") != none {
    pagebreak(to: "even", weak: true)
    page(header: none, footer: none, margin: 0.45in, align(center + horizon, image(ex("frontispiece"), width: 100%, height: 100%, fit: "contain")))
  }
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt, justify: false)
  heading(level: 1)[Contents]
  ornament()
  v(4pt)
  for r in rounds {
    v(10pt)
    block(breakable: false, grid(columns: (34pt, 1fr, if r.art != none { 0.75in } else { 0pt }), column-gutter: 10pt,
      // big round numeral
      align(top, text(font: display, size: 34pt, str(r.n))),
      {
        grid(columns: (1fr, auto), align: bottom,
          text(font: display, size: 14pt, r.name),
          text(font: mono, size: 8pt, context { "p. " + str(counter(page).at(label("round-" + str(r.n))).first()) }))
        v(1pt)
        line(length: 100%, stroke: 0.5pt + ink)
        v(3pt)
        set text(size: 8.3pt)
        // Number | title with leaders | page: the page number keeps its own column, so it never wraps onto a line by itself.
        for q in r.qs {
          grid(columns: (14pt, 1fr, 16pt), align: (left + top, left + top, right + bottom),
            text(font: mono, size: 6.5pt, str(q.n)),
            { set text(hyphenate: false); set par(leading: 0.5em); [#q.question #leaders] },
            text(font: mono, size: 6.5pt, context { str(counter(page).at(label("q-" + str(q.n))).first()) }))
          v(4.2pt, weak: true)
        }
      },
      if r.art != none { align(top, box(stroke: 0.6pt + ink, radius: 3pt, inset: 3pt, image(r.art, width: 100%))) },
    ))
  }
}

// Index: laws and effects, then people, each pointing at the question page.
#let index-pages(laws, people) = {
  running.update("Index")
  pagebreak(to: "odd", weak: true)
  set par(first-line-indent: 0pt, justify: false)
  heading(level: 1)[Index]
  let block-of(title, items) = {
    heading(level: 3, title)
    set text(size: 8.5pt)
    for it in items {
      [#it.name #h(1fr) #text(font: mono, size: 7pt, it.ns.map(n => context str(counter(page).at(label("q-" + str(n))).first())).join(", "))]
      linebreak()
    }
  }
  columns(2, gutter: 18pt, { block-of([Laws and effects], laws); colbreak(); block-of([People], people) })
}

// How to play, drawn: three miniature pages with arrows between them.
#let mini-page(body) = box(width: 1.25in, height: 1.75in, stroke: 0.8pt + ink, radius: 2pt, inset: 7pt, body)
#let how-diagram() = {
  v(6pt)
  align(center, grid(columns: 5, column-gutter: 6pt, align: horizon,
    mini-page({
      text(font: mono, size: 5pt)[ROUND 1 · № 2]
      v(2pt); text(font: display, size: 9pt)[Did an apple fall on Newton’s head?]
      v(1fr)
      grid(columns: 3, column-gutter: 2pt, ..("T", "F", "D").map(w => box(width: 100%, stroke: 0.5pt + ink, inset: 2pt, align(center, text(font: mono, size: 5pt, w)))))
    }),
    text(font: mono, size: 14pt)[→],
    mini-page({
      align(center, scale(55%, reflow: true, stamp("FOLKLORE")))
      v(3pt)
      for i in range(7) { line(length: 100% - 6pt * calc.rem(i, 3), stroke: 0.6pt + luma(60%)); v(3.5pt) }
    }),
    text(font: mono, size: 14pt)[→],
    mini-page({
      v(1fr)
      block(stroke: (left: 1.2pt + ink), inset: (left: 4pt), [#text(font: mono, size: 4.5pt)[TELL SOMEONE] #linebreak() #text(size: 6pt, style: "italic")[The apple fell. It never hit him.]])
      v(1fr)
    }),
  ))
  v(4pt)
  align(center, grid(columns: (1.25in, 0.3in, 1.25in, 0.3in, 1.25in), column-gutter: 6pt,
    align(center, label-mono[1 · Guess]), [], align(center, label-mono[2 · Turn]), [], align(center, label-mono[3 · Tell someone])))
  v(8pt)
}

// Score bands as badges, the Librarian above each one (art 1 in wide: prep-librarian.py sizes for it).
#let badge(title, range, filled, art) = box(width: 100%, inset: (x: 2pt, y: 5pt), stroke: if filled { 1.6pt + ink } else { (paint: ink, thickness: 0.8pt, dash: "dashed") }, radius: 4pt,
  align(center, [#image("/art/librarian/final/band-" + art + ".png", width: 1in) #v(-2pt) #text(font: display, size: 11pt, hyphenate: false, title) #linebreak() #text(font: mono, size: 7pt, range)]))
#let bands() = grid(columns: 4, column-gutter: 5pt,
  badge([Myth Buster], [85–100], true, "myth-buster"), badge([Fact Checker], [70–84], true, "fact-checker"),
  badge([Healthy Skeptic], [55–69], false, "healthy-skeptic"), badge([Easily Fooled], [0–54], false, "easily-fooled"))

// A spot illustration of the Librarian in the back matter: {{spot:name}} in the markdown.
// Widths match SIZES in prep-librarian.py, which checks line weight at these sizes.
#let spot-widths = ("game-night": 3.6in, "classroom": 3.6in, "how-checked": 3.6in, "round-11": 2in)
#let spot(name) = block(above: 1.6em, width: 100%, align(center, image("/art/librarian/final/" + name + ".png", width: spot-widths.at(name))))

// The scorecard: a tick box per story, a total per round.
#let tickrow = box(grid(columns: 10, column-gutter: 3pt, ..range(10).map(_ => box(width: 9pt, height: 9pt, stroke: 0.6pt + ink))))
#let scorecard() = {
  let names = ("Famous scenes", "Who really said it?", "Famous experiments, retold", "Charts and numbers", "Names that mislead", "Physics in the kitchen and the sky", "Words and phrases", "Jokes that became laws", "Discovery stories", "Money, power and policy")
  ornament()
  v(6pt)
  set text(size: 8.5pt)
  for (i, nm) in names.enumerate() {
    grid(columns: (22pt, 1fr, auto, 34pt), column-gutter: 8pt, align: horizon,
      text(font: display, size: 16pt, str(i + 1)), nm, tickrow,
      box(width: 100%, height: 14pt, stroke: 0.8pt + ink, radius: 2pt, align(right + horizon, text(font: mono, size: 6pt)[/10 ])))
    v(5pt)
  }
  v(4pt)
  align(right, [#label-mono[Total] #h(6pt) #box(width: 54pt, height: 20pt, stroke: 1.6pt + ink, radius: 3pt, align(right + horizon, text(font: mono, size: 7pt)[/100 ]))])
  v(14pt)
  bands()
}

// Two teams, a box per round, a running total.
#let teamsheet() = {
  ornament()
  v(8pt)
  grid(columns: (1fr, 1fr), column-gutter: 18pt,
    ..("Team A", "Team B").map(t => {
      align(center, text(font: display, size: 16pt, t))
      v(2pt); line(length: 100%, stroke: 0.5pt + ink); v(4pt)
      for i in range(10) {
        grid(columns: (20pt, 1fr, 30pt), column-gutter: 6pt, align: horizon,
          text(font: mono, size: 7pt)[R#(i + 1)], box(width: 100%, height: 13pt, stroke: (bottom: 0.5pt + luma(60%))), box(width: 100%, height: 13pt, stroke: 0.8pt + ink, radius: 2pt))
        v(3pt)
      }
      v(4pt)
      align(right, [#label-mono[Total] #h(4pt) #box(width: 44pt, height: 18pt, stroke: 1.6pt + ink, radius: 3pt)])
    }))
  v(8pt)
  align(center, text(size: 8pt, style: "italic")[Write each team's name on the line, its score in the box.])
}

// The myth-buster certificate: a drawn border, the words set in type in its empty centre.
#let certificate() = {
  if ex("certificate") == none { return }
  pagebreak(weak: true)
  page(header: none, footer: none, margin: 0.4in, {
    place(center + horizon, image(ex("certificate"), width: 100%, height: 100%, fit: "contain"))
    place(center + horizon, dy: -0.55in, block(width: 2.9in, {
      set par(first-line-indent: 0pt, justify: false)
      align(center, {
        label-mono[The Law Tome series]
        v(0.12in)
        text(font: display, size: 22pt)[Certificate of \ Myth-Busting]
        v(0.18in)
        text(style: "italic")[This certifies that]
        v(0.3in); line(length: 85%, stroke: 0.6pt + ink); v(0.12in)
        text(style: "italic")[called the evidence on #box(width: 0.5in, stroke: (bottom: 0.6pt + ink)) of 100 famous stories in]
        v(0.06in)
        text(font: display, size: 15pt)[True or Folklore?]
        v(0.14in)
        text(style: "italic")[and has earned the rank of]
        v(0.3in); line(length: 70%, stroke: 0.6pt + ink); v(0.18in)
        grid(columns: (1fr, 1fr), column-gutter: 0.3in,
          [#line(length: 100%, stroke: 0.6pt + ink) #label-mono[Date]],
          [#line(length: 100%, stroke: 0.6pt + ink) #label-mono[Witnessed by]])
      })
    }))
  })
}
