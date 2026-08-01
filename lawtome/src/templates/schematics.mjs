// Concept schematics — illustrative diagrams of a law's core idea, drawn as
// inline SVG. These depict the SHAPE of an idea, not measured data, so each is
// explicitly captioned "schematic / illustrative". A law opts in via a `schematic`
// key naming one of the types below; unknown/absent => no figure. XSS-safe: no
// corpus text is interpolated into these (fixed, author-controlled markup only).

const figures = {
  // Goodhart: the proxy keeps climbing while the goal it stood for peaks and falls.
  'goodhart-divergence': {
    caption: 'As optimisation pressure rises, the proxy keeps climbing while the goal it was standing in for peaks and falls away.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: proxy and goal diverging under optimisation pressure">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M44,150 C170,132 300,80 424,44"/>
      <path class="s-goal" d="M44,150 C130,116 200,62 250,62 C322,62 372,120 424,166"/>
      <circle class="s-dot-proxy" cx="424" cy="44" r="3.5"/>
      <circle class="s-dot-goal" cx="424" cy="166" r="3.5"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">optimisation pressure →</text>
      <text class="s-tick" x="30" y="30" text-anchor="end" transform="rotate(-90 30 30)">value</text>
      <g><rect class="s-proxy-sw" x="300" y="18" width="14" height="3"/><text class="s-label" x="318" y="22">proxy (the number)</text></g>
      <g><rect class="s-goal-sw" x="300" y="32" width="14" height="3"/><text class="s-label" x="318" y="36">goal (what you wanted)</text></g>
    </svg>`,
  },
  // Pareto: a small share of causes drives most of the effect.
  'pareto-split': {
    caption: "A small share of causes drives most of the effect. The exact 80/20 is illustrative — the real split might be 90/10 or 70/30.",
    svg: `<svg viewBox="0 0 460 190" role="img" aria-label="Schematic: 20 percent of causes, 80 percent of effects">
      <text class="s-label" x="44" y="44">Causes</text>
      <rect class="s-track" x="44" y="52" width="372" height="26" rx="5"/>
      <rect class="s-fill" x="44" y="52" width="74" height="26" rx="5"/>
      <text class="s-inbar" x="52" y="69">20%</text>
      <text class="s-label" x="44" y="122">Effects</text>
      <rect class="s-track" x="44" y="130" width="372" height="26" rx="5"/>
      <rect class="s-fill" x="44" y="130" width="298" height="26" rx="5"/>
      <text class="s-inbar" x="52" y="147">80%</text>
    </svg>`,
  },
  // Dunning–Kruger: the popular confidence-vs-experience curve (itself contested).
  'dk-curve': {
    caption: 'The popular depiction: confidence spikes with a little knowledge, dips as its limits appear, then climbs with real expertise. The size of the real effect is disputed — see “Where it breaks down”.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: the popular confidence-versus-experience curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M44,150 C66,70 96,40 132,54 C168,68 176,150 214,152 C266,154 250,150 268,148 C340,140 386,112 424,92"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">experience →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">confidence</text>
    </svg>`,
  },
  // Parkinson: the same task expands to fill whatever time it is given.
  'parkinson-fill': {
    caption: 'The same task expands to fill whatever time it is given — a tight box and a loose box both end up full.',
    svg: `<svg viewBox="0 0 460 190" role="img" aria-label="Schematic: work expanding to fill the time available">
      <text class="s-label" x="44" y="44">Tight deadline</text>
      <rect class="s-track" x="44" y="52" width="150" height="26" rx="5"/>
      <rect class="s-fill" x="44" y="52" width="150" height="26" rx="5"/>
      <text class="s-inbar" x="52" y="69">the task</text>
      <text class="s-label" x="44" y="122">Loose deadline</text>
      <rect class="s-track" x="44" y="130" width="372" height="26" rx="5"/>
      <rect class="s-fill" x="44" y="130" width="372" height="26" rx="5"/>
      <text class="s-inbar" x="52" y="147">the same task</text>
    </svg>`,
  },
  // The normal distribution: symmetric hump around the average.
  'bell-curve': {
    caption: 'Values cluster around the average and thin out symmetrically toward the extremes — the familiar bell.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a symmetric bell-shaped distribution">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-area" d="M52,176 C150,176 176,48 237,48 C298,48 324,176 422,176 Z"/>
      <path class="s-proxy" d="M52,176 C150,176 176,48 237,48 C298,48 324,176 422,176"/>
      <line class="s-mean" x1="237" y1="52" x2="237" y2="176"/>
      <text class="s-tick" x="237" y="192" text-anchor="middle">mean</text>
      <text class="s-tick" x="44" y="204" text-anchor="start">value →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">how often</text>
    </svg>`,
  },
  // Long tail / Zipf: a few big, then a long low tail of the many.
  'long-tail': {
    caption: 'A few items dominate; a long tail of many rare ones stretches out to the right. The exact steepness is illustrative.',
    svg: `<svg viewBox="0 0 460 200" role="img" aria-label="Schematic: a few tall bars and a long low tail">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="170"/>
      <line class="s-axis" x1="44" y1="170" x2="440" y2="170"/>
      ${[128, 84, 58, 42, 32, 25, 20, 16, 13, 11, 9, 8, 7, 6].map((h, i) => `<rect class="s-fill" x="${52 + i * 27}" y="${170 - h}" width="19" height="${h}" rx="2"/>`).join('')}
      <text class="s-tick" x="44" y="190" text-anchor="start">ranked items →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">frequency</text>
    </svg>`,
  },
  // S-curve: slow start, fast middle, saturating plateau (adoption/growth-under-a-limit).
  's-curve': {
    caption: 'Slow start, a rapid middle, then a saturating plateau — the classic S of adoption and growth against a limit.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: an S-shaped adoption curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <line class="s-mean" x1="44" y1="42" x2="430" y2="42"/>
      <path class="s-proxy" d="M48,168 C150,166 176,158 214,110 C252,62 288,48 424,44"/>
      <text class="s-tick" x="430" y="38" text-anchor="end">ceiling</text>
      <text class="s-tick" x="44" y="196" text-anchor="start">time →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">adopted</text>
    </svg>`,
  },
  // Exponential growth: rises in proportion to its own size.
  'exp-growth': {
    caption: 'A quantity that grows in proportion to its size curves ever more steeply — small for a long while, then explosive.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: an exponential growth curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M48,172 C240,170 320,150 380,96 C404,74 418,44 424,30"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">time →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">amount</text>
    </svg>`,
  },
  // Exponential decay: falls by the same fraction each step (forgetting, learning-cost).
  'exp-decay': {
    caption: 'A quantity that falls by the same fraction each step drops fast at first, then flattens toward a floor.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: an exponential decay curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M48,36 C110,120 168,152 260,164 C330,172 384,173 424,174"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">time →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">amount</text>
    </svg>`,
  },
  // Diminishing returns: each added input buys less than the one before.
  'diminishing-returns': {
    caption: 'Output keeps rising but each additional unit of input buys less than the one before it — the curve flattens.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a diminishing-returns curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M48,172 C120,116 200,82 300,68 C356,60 400,58 424,57"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">input →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">output</text>
    </svg>`,
  },
  // Inverted U: benefit rises then falls — there is an optimum in the middle.
  'inverted-u': {
    caption: 'More is better only up to a point: benefit rises to a peak, then more of the same makes things worse.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: an inverted-U curve with a peak in the middle">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M48,170 C120,58 200,42 237,42 C274,42 354,58 424,170"/>
      <line class="s-mean" x1="237" y1="46" x2="237" y2="176"/>
      <text class="s-tick" x="237" y="192" text-anchor="middle">optimum</text>
      <text class="s-tick" x="44" y="204" text-anchor="start">more →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">outcome</text>
    </svg>`,
  },
  // Feedback loop: an output circles back to drive its own cause.
  'feedback-loop': {
    caption: 'An output feeds back to strengthen its own cause — a self-reinforcing loop that compounds over time.',
    svg: `<svg viewBox="0 0 460 200" role="img" aria-label="Schematic: a self-reinforcing feedback loop">
      <defs><marker id="s-fb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
      <circle class="s-dot-proxy" cx="150" cy="100" r="9"/>
      <circle class="s-dot-proxy" cx="330" cy="100" r="9"/>
      <path class="s-proxy" d="M166,86 C216,52 264,52 314,86" marker-end="url(#s-fb-arrow)"/>
      <path class="s-proxy" d="M314,114 C264,148 216,148 166,114" marker-end="url(#s-fb-arrow)"/>
      <text class="s-label" x="150" y="134" text-anchor="middle">cause</text>
      <text class="s-label" x="330" y="134" text-anchor="middle">effect</text>
      <text class="s-tick" x="240" y="48" text-anchor="middle">reinforces</text>
      <text class="s-tick" x="240" y="166" text-anchor="middle">drives more of</text>
    </svg>`,
  },
  // Network effect: value grows far faster than the number of members.
  'network-effect': {
    caption: 'Each new member can connect to every existing one, so a network’s connections — and its value — grow far faster than its size.',
    svg: `<svg viewBox="0 0 460 200" role="img" aria-label="Schematic: connections growing faster than members">
      <line class="s-net" x1="110" y1="100" x2="180" y2="100"/>
      <circle class="s-dot-proxy" cx="110" cy="100" r="7"/><circle class="s-dot-proxy" cx="180" cy="100" r="7"/>
      <text class="s-tick" x="145" y="150" text-anchor="middle">2 nodes · 1 link</text>
      <line class="s-net" x1="350" y1="54" x2="393.7" y2="85.8"/>
      <line class="s-net" x1="350" y1="54" x2="377" y2="137.2"/>
      <line class="s-net" x1="350" y1="54" x2="323" y2="137.2"/>
      <line class="s-net" x1="350" y1="54" x2="306.3" y2="85.8"/>
      <line class="s-net" x1="393.7" y1="85.8" x2="377" y2="137.2"/>
      <line class="s-net" x1="393.7" y1="85.8" x2="323" y2="137.2"/>
      <line class="s-net" x1="393.7" y1="85.8" x2="306.3" y2="85.8"/>
      <line class="s-net" x1="377" y1="137.2" x2="323" y2="137.2"/>
      <line class="s-net" x1="377" y1="137.2" x2="306.3" y2="85.8"/>
      <line class="s-net" x1="323" y1="137.2" x2="306.3" y2="85.8"/>
      <circle class="s-dot-proxy" cx="350" cy="54" r="7"/><circle class="s-dot-proxy" cx="393.7" cy="85.8" r="7"/><circle class="s-dot-proxy" cx="377" cy="137.2" r="7"/><circle class="s-dot-proxy" cx="323" cy="137.2" r="7"/><circle class="s-dot-proxy" cx="306.3" cy="85.8" r="7"/>
      <text class="s-tick" x="350" y="176" text-anchor="middle">5 nodes · 10 links</text>
    </svg>`,
  },
  // Threshold / tipping point: nothing much until a critical point, then a flip.
  'threshold': {
    caption: 'Below a critical point little changes; cross it and the response jumps — a threshold, or tipping point.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a step change at a critical threshold">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <line class="s-mean" x1="232" y1="40" x2="232" y2="176"/>
      <path class="s-proxy" d="M48,166 L226,166 C232,166 232,166 232,150 L232,64 C232,52 232,52 244,52 L424,52"/>
      <text class="s-tick" x="232" y="192" text-anchor="middle">threshold</text>
      <text class="s-tick" x="44" y="204" text-anchor="start">input →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">response</text>
    </svg>`,
  },
  // ---- structural shapes -------------------------------------------------
  // The curve shapes above only fit a law that describes a QUANTITY. Most of
  // philosophy, logic and psychology describes a STRUCTURE instead — an order of
  // stages, a loop, a fork, a gap between two things — and those pages have been
  // imageless because no photograph of an argument exists. These draw the
  // structure the entry already states, and carry the same "Schematic" label as
  // every other figure here, so none of them is passed off as an artifact.

  // Stages: an ordered progression, each resting on the one before it.
  'ladder': {
    caption: 'An ordered progression: each stage rests on the one below it and is reached in sequence rather than skipped.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: five ascending stages, each resting on the one below">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <rect class="s-bar" x="60" y="160" width="58" height="16"/>
      <rect class="s-bar" x="134" y="134" width="58" height="42"/>
      <rect class="s-bar" x="208" y="108" width="58" height="68"/>
      <rect class="s-bar" x="282" y="82" width="58" height="94"/>
      <rect class="s-bar" x="356" y="56" width="58" height="120"/>
      <path class="s-proxy" d="M89,150 L163,124 L237,98 L311,72 L385,46" fill="none"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">stage →</text>
    </svg>`,
  },
  // Cycle: the end condition recreates the starting condition.
  'cycle': {
    caption: 'A closed loop: the state at the end recreates the conditions at the start, so the sequence runs again instead of resolving.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: four stages arranged in a closed loop">
      <circle class="s-ring" cx="230" cy="100" r="66" fill="none"/>
      <circle class="s-dot" cx="230.0" cy="34.0" r="8"/>
      <circle class="s-dot" cx="296.0" cy="100.0" r="8"/>
      <circle class="s-dot" cx="230.0" cy="166.0" r="8"/>
      <circle class="s-dot" cx="164.0" cy="100.0" r="8"/>
      <path class="s-arrow-head" d="M230,26 l-9,8 l18,0 z"/>
      <text class="s-tick" x="230" y="196" text-anchor="middle">the loop closes on itself</text>
    </svg>`,
  },
  // Dichotomy: two options whose pull is mutually exclusive.
  'dichotomy': {
    caption: 'Two options pulling against each other: what is rational for one side is costly for the other, and both cannot be satisfied at once.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: two opposed boxes pulling against each other">
      <rect class="s-box" x="52" y="58" width="150" height="84" rx="3"/>
      <rect class="s-box" x="258" y="58" width="150" height="84" rx="3"/>
      <line class="s-axis" x1="208" y1="100" x2="252" y2="100"/>
      <path class="s-arrow-head" d="M208,100 l10,-6 l0,12 z"/>
      <path class="s-arrow-head" d="M252,100 l-10,-6 l0,12 z"/>
      <text class="s-tick" x="127" y="104" text-anchor="middle">one side</text>
      <text class="s-tick" x="333" y="104" text-anchor="middle">the other</text>
      <text class="s-tick" x="230" y="192" text-anchor="middle">a gain on one is a loss on the other</text>
    </svg>`,
  },
  // Gap: two things taken to be one thing come apart.
  'gap': {
    caption: 'Two things taken to be the same that are not: the claim and the case run apart, and the distance between them is the whole point.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: two lines diverging, with the gap between them marked">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-actual" d="M50,110 L424,110"/>
      <path class="s-proxy" d="M50,110 C170,110 300,58 424,42"/>
      <line class="s-mean" x1="424" y1="42" x2="424" y2="110"/>
      <text class="s-tick" x="414" y="80" text-anchor="end">the gap</text>
      <text class="s-tick" x="44" y="196" text-anchor="start">as it goes on →</text>
    </svg>`,
  },
  // Filter: many enter, few survive each successive constraint.
  'filter': {
    caption: 'A funnel of constraints: everything enters at the wide end and only what survives every stage comes out, so the survivors are not a fair sample of the entrants.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a funnel narrowing through successive stages">
      <rect class="s-bar" x="70" y="58" width="60" height="84" rx="2"/>
      <rect class="s-bar" x="148" y="71" width="60" height="58" rx="2"/>
      <rect class="s-bar" x="226" y="84" width="60" height="32" rx="2"/>
      <rect class="s-bar" x="304" y="97" width="60" height="6" rx="2"/>
      <path class="s-proxy" d="M70,100 L400,116" fill="none"/>
      <text class="s-tick" x="70" y="196" text-anchor="start">all of them</text>
      <text class="s-tick" x="404" y="196" text-anchor="end">what is left</text>
    </svg>`,
  },
  // Broken chain: an inference whose steps do not in fact connect.
  'broken-chain': {
    caption: 'A chain of reasoning with a link that does not hold: every step looks like the last, but one of them does not follow, and the conclusion inherits the break.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a chain of steps with one broken link">
      <rect class="s-box" x="40" y="76" width="76" height="48" rx="3"/>
      <rect class="s-box" x="146" y="76" width="76" height="48" rx="3"/>
      <rect class="s-box" x="252" y="76" width="76" height="48" rx="3"/>
      <rect class="s-box" x="358" y="76" width="76" height="48" rx="3"/>
      <line class="s-axis" x1="116" y1="100" x2="146" y2="100"/>
      <line class="s-axis" x1="328" y1="100" x2="358" y2="100"/>
      <line class="s-break" x1="222" y1="100" x2="252" y2="100"/>
      <path class="s-arrow-head" d="M146,100 l-10,-6 l0,12 z"/>
      <path class="s-arrow-head" d="M358,100 l-10,-6 l0,12 z"/>
      <text class="s-tick" x="237" y="66" text-anchor="middle">does not follow</text>
    </svg>`,
  },
  // Trade-off: gaining more of one thing costs you the other (a downward curve).
  'tradeoff': {
    caption: 'You can’t maximise both at once: push one up and the other slides down along the curve.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a downward-sloping trade-off curve">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M52,40 C150,54 250,140 424,168"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">more of one →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">the other</text>
    </svg>`,
  },
  // Linear: directly proportional — double the cause, double the effect.
  'linear': {
    caption: 'Directly proportional: double the input and you double the output — a straight line through the origin.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a straight-line, directly-proportional relationship">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <path class="s-proxy" d="M48,172 L424,44"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">cause →</text>
      <text class="s-tick" x="30" y="34" text-anchor="end" transform="rotate(-90 30 34)">effect</text>
    </svg>`,
  },
  // Oscillation: a quantity that swings back and forth around a level in cycles.
  'oscillation': {
    caption: 'A quantity that swings back and forth around a level, rising and falling in cycles rather than settling.',
    svg: `<svg viewBox="0 0 460 210" role="img" aria-label="Schematic: a wave oscillating around a midline">
      <line class="s-axis" x1="44" y1="24" x2="44" y2="176"/>
      <line class="s-axis" x1="44" y1="176" x2="430" y2="176"/>
      <line class="s-mean" x1="44" y1="100" x2="430" y2="100"/>
      <path class="s-proxy" d="M48,100.0 L53,88.3 L58,77.2 L64,67.1 L69,58.6 L74,52.1 L79,47.8 L85,46.1 L90,46.8 L95,50.1 L100,55.8 L105,63.5 L111,73.0 L116,83.8 L121,95.3 L126,107.0 L132,118.5 L137,129.0 L142,138.2 L147,145.5 L152,150.7 L158,153.5 L163,153.8 L168,151.5 L173,146.8 L179,139.8 L184,131.0 L189,120.7 L194,109.4 L199,97.6 L205,86.0 L210,75.1 L215,65.3 L220,57.2 L226,51.1 L231,47.3 L236,46.0 L241,47.3 L246,51.1 L252,57.2 L257,65.3 L262,75.1 L267,86.0 L273,97.6 L278,109.4 L283,120.7 L288,131.0 L293,139.8 L299,146.8 L304,151.5 L309,153.8 L314,153.5 L320,150.7 L325,145.5 L330,138.2 L335,129.0 L340,118.5 L346,107.0 L351,95.3 L356,83.8 L361,73.0 L367,63.5 L372,55.8 L377,50.1 L382,46.8 L387,46.1 L393,47.8 L398,52.1 L403,58.6 L408,67.1 L414,77.2 L419,88.3 L424,100.0"/>
      <text class="s-tick" x="44" y="196" text-anchor="start">time →</text>
    </svg>`,
  },
};

// Curated, hand-verified map of law slug -> canonical schematic shape, for laws
// that have a standard textbook depiction but don't set `schematic` in their
// entry. Kept conservative: a shape is assigned only where it genuinely IS the
// law's canonical picture (not a loose analogy), so nothing here misrepresents.
const SLUG_SHAPES = {
  'the-lump-of-labour-fallacy': 'broken-chain',
  'the-broken-window-fallacy': 'broken-chain',
  'the-nirvana-fallacy': 'broken-chain',
  'the-naturalistic-fallacy': 'broken-chain',
  'the-fallacy-fallacy': 'broken-chain',
  'the-genetic-fallacy': 'broken-chain',
  'the-intentional-fallacy': 'broken-chain',
  'the-mcnamara-fallacy': 'broken-chain',
  'the-problem-of-induction': 'broken-chain',
  'the-munchhausen-trilemma': 'broken-chain',
  'milankovitch-cycles': 'cycle',
  'the-life-cycle-hypothesis': 'cycle',
  'the-triffin-dilemma': 'dichotomy',
  'the-paradox-of-tragedy': 'dichotomy',
  'the-problem-of-other-minds': 'gap',
  'the-problem-of-universals': 'gap',
  'the-problem-of-the-criterion': 'gap',

  // ---- structural shapes: laws whose SHAPE is an order, a loop, a fork, a
  // gap or a broken inference rather than a curve. Assigned by hand, and only
  // where the structure is what the entry itself describes.
  'blooms-taxonomy': 'ladder',
  'eriksons-stages-of-psychosocial-development': 'ladder',
  'kohlbergs-stages-of-moral-development': 'ladder',
  'maslows-hierarchy-of-needs': 'ladder',
  'piagets-stages-of-cognitive-development': 'ladder',
  'the-kubler-ross-model': 'ladder',
  'the-ooda-loop': 'cycle',
  'moral-hazard': 'dichotomy',
  'the-free-rider-problem': 'dichotomy',
  'the-game-of-chicken': 'dichotomy',
  'the-principal-agent-problem': 'dichotomy',
  'the-prisoners-dilemma': 'dichotomy',
  'the-security-dilemma': 'dichotomy',
  'the-stag-hunt': 'dichotomy',
  'the-tragedy-of-the-commons': 'dichotomy',
  'the-analytic-synthetic-distinction': 'gap',
  'the-explanatory-gap': 'gap',
  'the-hard-problem-of-consciousness': 'gap',
  'the-is-ought-problem': 'gap',
  'the-planning-fallacy': 'gap',
  'survivorship-bias': 'filter',
  'the-anthropic-principle': 'filter',
  'the-great-filter': 'filter',
  'begging-the-question': 'broken-chain',
  'circular-reasoning': 'broken-chain',
  'equivocation': 'broken-chain',
  'moving-the-goalposts': 'broken-chain',
  'post-hoc-ergo-propter-hoc': 'broken-chain',
  'the-ad-hominem': 'broken-chain',
  'the-appeal-to-authority': 'broken-chain',
  'the-appeal-to-nature': 'broken-chain',
  'the-base-rate-fallacy': 'broken-chain',
  'the-false-dilemma': 'broken-chain',
  'the-gamblers-fallacy': 'broken-chain',
  'the-no-true-scotsman': 'broken-chain',
  'the-slippery-slope': 'broken-chain',
  'the-straw-man': 'broken-chain',
  'the-sunk-cost-fallacy': 'broken-chain',
  'the-texas-sharpshooter-fallacy': 'broken-chain',

  'central-limit-theorem': 'bell-curve',
  'students-t-distribution': 'bell-curve',
  'farrs-law': 'bell-curve',
  'zipfs-law': 'long-tail',
  'power-law-distribution': 'long-tail',
  'benfords-law': 'long-tail',
  'diffusion-of-innovations': 's-curve',
  'the-hill-equation': 's-curve',
  'the-oxygen-hemoglobin-dissociation-curve': 's-curve',
  'moores-law': 'exp-growth',
  'kryders-law': 'exp-growth',
  'the-rule-of-72': 'exp-growth',
  'the-malthusian-trap': 'exp-growth',
  'ebbinghaus-forgetting-curve': 'exp-decay',
  'beer-lambert-law': 'exp-decay',
  'newtons-law-of-cooling': 'exp-decay',
  'the-experience-curve': 'exp-decay',
  'wrights-law': 'exp-decay',
  'diminishing-marginal-utility': 'diminishing-returns',
  'the-law-of-diminishing-marginal-utility': 'diminishing-returns',
  'the-solow-swan-model': 'diminishing-returns',
  'yerkes-dodson-law': 'inverted-u',
  'the-golden-mean': 'inverted-u',
  'the-laffer-curve': 'inverted-u',
  'the-kuznets-curve': 'inverted-u',
  'the-environmental-kuznets-curve': 'inverted-u',
  'the-phillips-curve': 'tradeoff',
  'matthew-effect': 'feedback-loop',
  'preferential-attachment': 'feedback-loop',
  'cobra-effect': 'feedback-loop',
  'metcalfes-law': 'network-effect',
  'reeds-law': 'network-effect',
  'the-network-effect': 'network-effect',
  'the-doherty-threshold': 'threshold',
  'herd-immunity': 'threshold',
  'the-basic-reproduction-number': 'threshold',
  'escape-velocity': 'threshold',
  'griffiths-criterion': 'threshold',
  'the-error-catastrophe': 'threshold',
  'the-jeans-instability': 'threshold',
  'the-photoelectric-effect': 'threshold',
  'the-beveridge-curve': 'tradeoff',
  'michaelis-menten-kinetics': 'diminishing-returns',
  // linear — directly proportional relationships
  'hookes-law': 'linear',
  'ohms-law': 'linear',
  'darcys-law': 'linear',
  'faradays-laws-of-electrolysis': 'linear',
  'fouriers-law-of-heat-conduction': 'linear',
  'gay-lussacs-law': 'linear',
  'henrys-law': 'linear',
  'sarnoffs-law': 'linear',
  'stokes-law': 'linear',
  // oscillation — cyclic swings around a level
  'the-el-nino-southern-oscillation': 'oscillation',
  'the-foucault-pendulum': 'oscillation',
  'lotka-volterra-equations': 'oscillation',
};

/**
 * Resolve the schematic key for a law: an explicit `schematic` field wins;
 * otherwise fall back to the curated slug map. Returns undefined if neither.
 */
export function schematicForLaw(law) {
  if (!law) return undefined;
  return law.schematic || SLUG_SHAPES[law.slug];
}

// Concrete-colour stylesheet for embedding a schematic in a standalone SVG (the
// OG card) where the page's CSS classes aren't available. Axis/tick TEXT is
// hidden so only the shape reads — a decorative motif, not a labelled chart.
export const SCHEMATIC_OG_STYLE = `<style>
.s-axis{stroke:#4a4e59;stroke-width:2.4;fill:none}
.s-proxy{stroke:#e0a43f;stroke-width:5;fill:none;stroke-linecap:round;stroke-linejoin:round}
.s-goal{stroke:#c98b3a;stroke-width:5;fill:none;stroke-linecap:round}
.s-area{fill:#e0a43f;opacity:.14;stroke:none}
.s-mean{stroke:#565b67;stroke-width:2;stroke-dasharray:5 6;fill:none}
.s-net{stroke:#e0a43f;stroke-width:2.6;fill:none;opacity:.5}
.s-dot-proxy{fill:#e0a43f}.s-dot-goal{fill:#c98b3a}
.s-fill{fill:#e0a43f}.s-track{fill:#20242c;stroke:#2c313b}
.s-proxy-sw{fill:#e0a43f}.s-goal-sw{fill:#c98b3a}
.s-tick,.s-label,.s-inbar{display:none}
</style>`;

/**
 * Return a schematic as a nested <svg> positioned at (x,y) with width w, for
 * embedding in another SVG document. Pair it with SCHEMATIC_OG_STYLE (once, in
 * the host <svg>) so the s-* classes resolve. Returns '' for an unknown key.
 */
export function schematicOgSvg(key, { x = 0, y = 0, w = 380 } = {}) {
  const f = figures[key];
  if (!f) return '';
  const m = f.svg.match(/viewBox="([^"]+)"/);
  const vb = m ? m[1] : '0 0 460 210';
  const p = vb.split(/\s+/).map(Number);
  const vbw = p[2] || 460, vbh = p[3] || 210;
  const h = Math.round(w * (vbh / vbw));
  const inner = f.svg.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

/**
 * Return a figure block for a named schematic, or '' if the name is unknown.
 * The returned markup is a self-contained <figure> (no corpus text interpolated).
 */
export function schematicFigure(name) {
  const f = figures[name];
  if (!f) return '';
  return `      <figure class="sfig" data-reveal>
        <div class="sfig-plot">${f.svg}</div>
        <figcaption>${f.caption} <span class="s-illus">Schematic</span></figcaption>
      </figure>`;
}
