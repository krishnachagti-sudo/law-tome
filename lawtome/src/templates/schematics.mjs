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
};

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
