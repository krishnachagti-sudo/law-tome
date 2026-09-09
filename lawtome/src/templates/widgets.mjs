// Playable laws: for the handful whose formula is unambiguous and whose
// behaviour is the interesting part, a slider that computes it live.
//
// This is the one thing here that is written rather than harvested, and the
// line is worth stating: the ARITHMETIC is the law's own, taken from the same
// defining formula shown above it on the page, and the widget only evaluates
// it. It invents no data, fits no curve to anything, and predicts nothing. Each
// entry names the identity it computes so a reader can check the sum by hand.
//
// Deliberately a short list. A slider under a law whose formula is contested,
// dimensional, or merely illustrative would imply a precision the entry does
// not have, so only laws with a single agreed closed form appear.

const WIDGETS = {
  'amdahls-law': {
    title: 'Try it',
    lede: 'How much faster a program can get when only part of it parallelises.',
    identity: 'speedup = 1 / ((1 − p) + p / s)',
    inputs: [
      { id: 'p', label: 'Parallel portion', min: 0, max: 100, step: 1, value: 90, unit: '%' },
      { id: 's', label: 'Processors', min: 1, max: 4096, step: 1, value: 64, unit: '×', log: true },
    ],
    outputs: [
      { id: 'speedup', label: 'Speed-up', fmt: '×' },
      { id: 'ceiling', label: 'Ceiling with infinite processors', fmt: '×' },
    ],
  },
  'the-rule-of-72': {
    title: 'Try it',
    lede: 'How long a quantity takes to double at a steady growth rate.',
    identity: 'years ≈ 72 / rate',
    inputs: [{ id: 'r', label: 'Growth per year', min: 0.5, max: 30, step: 0.5, value: 7, unit: '%' }],
    outputs: [
      { id: 'approx', label: 'Doubling time (rule of 72)', fmt: ' yrs' },
      { id: 'exact', label: 'Doubling time (exact)', fmt: ' yrs' },
    ],
  },
  'metcalfes-law': {
    title: 'Try it',
    lede: 'The number of possible connections in a network of n members.',
    identity: 'connections = n(n − 1) / 2',
    inputs: [{ id: 'n', label: 'Members', min: 2, max: 100000, step: 1, value: 1000, unit: '', log: true }],
    outputs: [
      { id: 'links', label: 'Possible connections', fmt: '' },
      { id: 'perhead', label: 'Connections per member', fmt: '' },
    ],
  },
  'littles-law': {
    title: 'Try it',
    lede: 'How long things wait, given how fast they arrive and how many are in the system.',
    identity: 'W = L / λ',
    inputs: [
      { id: 'L', label: 'Items in the system', min: 1, max: 500, step: 1, value: 40, unit: '' },
      { id: 'lam', label: 'Arrivals per hour', min: 1, max: 500, step: 1, value: 20, unit: '/h' },
    ],
    outputs: [{ id: 'wait', label: 'Average time in the system', fmt: ' h' }],
  },
  'the-pareto-principle': {
    title: 'Try it',
    lede: 'What share of the total the top slice accounts for, on a Pareto distribution.',
    identity: 'share = 1 − (1 − top)^((log b) / (log a))',
    inputs: [
      { id: 'top', label: 'Top share of causes', min: 1, max: 50, step: 1, value: 20, unit: '%' },
      { id: 'a', label: 'The classic split — causes', min: 5, max: 45, step: 1, value: 20, unit: '%' },
      { id: 'b', label: 'The classic split — effects', min: 55, max: 95, step: 1, value: 80, unit: '%' },
    ],
    outputs: [{ id: 'share', label: 'Share of effects from that top slice', fmt: '%' }],
  },
  'zipfs-law': {
    title: 'Try it',
    lede: 'How often the nth most common word appears, relative to the most common one.',
    identity: 'frequency(rank) ∝ 1 / rank',
    inputs: [{ id: 'rank', label: 'Rank of the word', min: 1, max: 10000, step: 1, value: 10, unit: '', log: true }],
    outputs: [
      { id: 'rel', label: 'Frequency, as a share of the commonest word', fmt: '%' },
      { id: 'ratio', label: 'The commonest word is this many times more frequent', fmt: '×' },
    ],
  },
  'the-birthday-problem': {
    title: 'Try it',
    lede: 'The chance that two people in a room share a birthday.',
    identity: 'P = 1 − (365! / (365 − n)!) / 365ⁿ',
    inputs: [{ id: 'n', label: 'People in the room', min: 2, max: 100, step: 1, value: 23, unit: '' }],
    outputs: [{ id: 'p', label: 'Chance of a shared birthday', fmt: '%' }],
  },
  'bayes-theorem': {
    title: 'Try it',
    lede: 'What a positive test actually tells you, once the base rate is taken into account.',
    identity: 'P(A|B) = P(B|A)·P(A) / P(B)',
    inputs: [
      { id: 'prior', label: 'Base rate in the population', min: 0.01, max: 50, step: 0.01, value: 1, unit: '%' },
      { id: 'sens', label: 'Test detects it (sensitivity)', min: 50, max: 100, step: 0.5, value: 99, unit: '%' },
      { id: 'spec', label: 'Test is right when negative (specificity)', min: 50, max: 100, step: 0.5, value: 95, unit: '%' },
    ],
    outputs: [
      { id: 'post', label: 'Chance you actually have it, given a positive', fmt: '%' },
      { id: 'fp', label: 'False positives per true positive', fmt: '' },
    ],
  },
  // ---- added 2026-09-09, chosen from Search Console rather than by instinct ----
  // These six are the highest-impression law pages that already rank and whose
  // defining formula is unambiguous. Each computes the law's own arithmetic.
  'the-cauchy-schwarz-inequality': {
    title: 'Try it',
    lede: 'Move two vectors and watch the inner product stay under the product of their lengths.',
    identity: '|<u,v>| <= ||u|| ||v||',
    inputs: [
      { id: 'ux', label: 'u, x component', min: -10, max: 10, step: 0.1, value: 3 },
      { id: 'uy', label: 'u, y component', min: -10, max: 10, step: 0.1, value: 4 },
      { id: 'vx', label: 'v, x component', min: -10, max: 10, step: 0.1, value: 2 },
      { id: 'vy', label: 'v, y component', min: -10, max: 10, step: 0.1, value: 6 },
    ],
    outputs: [
      { id: 'dot', label: 'Inner product |<u,v>|' },
      { id: 'prod', label: 'Product of lengths ||u|| ||v||' },
      { id: 'slack', label: 'Slack between them' },
    ],
  },
  'jensens-inequality': {
    title: 'Try it',
    lede: 'For the convex function x squared, the function of the average never exceeds the average of the function.',
    identity: 'f(E[X]) <= E[f(X)],  f(x) = x^2',
    inputs: [
      { id: 'x1', label: 'First value', min: -10, max: 10, step: 0.1, value: -4 },
      { id: 'x2', label: 'Second value', min: -10, max: 10, step: 0.1, value: 6 },
      { id: 'w', label: 'Weight on the first', min: 0, max: 100, step: 1, value: 50, unit: '%' },
    ],
    outputs: [
      { id: 'fmean', label: 'f of the average' },
      { id: 'meanf', label: 'Average of f' },
      { id: 'gap', label: 'Jensen gap' },
    ],
  },
  'the-law-of-truly-large-numbers': {
    title: 'Try it',
    lede: 'How quickly a one-in-a-million event becomes near certain once there are enough chances.',
    identity: 'P(at least one) = 1 - (1 - p)^n',
    inputs: [
      { id: 'odds', label: 'Odds of one chance', min: 10, max: 10000000, step: 1, value: 1000000, unit: '', log: true },
      { id: 'n', label: 'Number of chances', min: 1, max: 10000000, step: 1, value: 1000000, unit: '', log: true },
    ],
    outputs: [
      { id: 'p', label: 'Chance it happens at least once', fmt: '%' },
      { id: 'exp', label: 'Expected number of times', fmt: '' },
    ],
  },
  'beer-lambert-law': {
    title: 'Try it',
    lede: 'Absorbance rises in proportion to concentration and path length; transmitted light falls away as a power of ten.',
    identity: 'A = e l c,  T = 10^(-A)',
    inputs: [
      { id: 'e', label: 'Molar absorptivity e', min: 1, max: 100000, step: 1, value: 10000, unit: '', log: true },
      { id: 'l', label: 'Path length l', min: 0.1, max: 10, step: 0.1, value: 1, unit: ' cm' },
      { id: 'c', label: 'Concentration c', min: 0.000001, max: 0.001, step: 0.000001, value: 0.00005, unit: ' M' },
    ],
    outputs: [
      { id: 'a', label: 'Absorbance A' },
      { id: 't', label: 'Transmittance T', fmt: '%' },
    ],
  },
  'boyles-law': {
    title: 'Try it',
    lede: 'Squeeze a fixed amount of gas at constant temperature and the pressure rises in exact inverse proportion.',
    identity: 'P1 V1 = P2 V2',
    inputs: [
      { id: 'p1', label: 'Starting pressure P1', min: 0.1, max: 20, step: 0.1, value: 1, unit: ' atm' },
      { id: 'v1', label: 'Starting volume V1', min: 0.1, max: 20, step: 0.1, value: 10, unit: ' L' },
      { id: 'v2', label: 'New volume V2', min: 0.1, max: 20, step: 0.1, value: 2, unit: ' L' },
    ],
    outputs: [
      { id: 'p2', label: 'New pressure P2', fmt: ' atm' },
      { id: 'ratio', label: 'Compression ratio', fmt: 'x' },
    ],
  },
  'galileos-inclined-plane': {
    title: 'Try it',
    lede: 'Tilt the ramp. The ball accelerates at g sin theta, and the distance it covers grows as the square of the time.',
    identity: 'a = g sin(theta),  s = (1/2) a t^2',
    inputs: [
      { id: 'ang', label: 'Ramp angle', min: 1, max: 90, step: 1, value: 30, unit: ' deg' },
      { id: 'len', label: 'Ramp length', min: 0.1, max: 20, step: 0.1, value: 2, unit: ' m' },
    ],
    outputs: [
      { id: 'acc', label: 'Acceleration along the ramp', fmt: ' m/s2' },
      { id: 'time', label: 'Time to the bottom', fmt: ' s' },
      { id: 'vel', label: 'Speed at the bottom', fmt: ' m/s' },
    ],
  },
  // Deliberately absent: the Chinese Remainder Theorem is the highest-impression
  // page without a widget, but its inputs must be pairwise coprime moduli. A
  // slider that silently produces invalid input would teach the reader the
  // wrong thing about the theorem, so it stays prose.
  'the-chinese-remainder-theorem': null,
  'the-second-law-of-thermodynamics': null, // no single closed form — deliberately absent
};

export function widgetFor(slug) {
  return WIDGETS[slug] || null;
}

/** Server-rendered shell. assets/widget.js does the arithmetic. */
export function widgetBlock(slug) {
  const w = widgetFor(slug);
  if (!w) return '';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // A log slider carries POSITIONS 0..1000 and its real range in data-min/max.
  // Emitting the true range and converting on the client conflates the two: a
  // value of 64 on a 1..4096 track is position 1.5%, and Amdahl's law then
  // reports 1.1x where it should say 7.9x. The default's position is computed
  // here so the initial render already agrees with the arithmetic.
  const logPos = (v, min, max) =>
    Math.round(1000 * (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)));
  const inputs = w.inputs.map((i) => {
    const attrs = i.log
      ? `min="0" max="1000" step="1" value="${logPos(i.value, i.min, i.max)}"`
        + ` data-log="1" data-min="${i.min}" data-max="${i.max}"`
      : `min="${i.min}" max="${i.max}" step="${i.step}" value="${i.value}"`;
    return `          <label class="wg-in">
            <span class="wg-lab">${esc(i.label)}</span>
            <input type="range" ${attrs} data-w="${esc(i.id)}" data-unit="${esc(i.unit || '')}" aria-label="${esc(i.label)}">
            <output data-wout="${esc(i.id)}">${i.value}${esc(i.unit || '')}</output>
          </label>`;
  }).join('\n');
  // The unit lives in an attribute, never scraped back out of the rendered text:
  // reading it from the placeholder made the em dash itself the unit.
  const outs = w.outputs.map((o) => `          <div class="wg-res">
            <span class="wg-res-lab">${esc(o.label)}</span>
            <span class="wg-res-v" data-wres="${esc(o.id)}" data-unit="${esc(o.fmt || '')}">—</span>
          </div>`).join('\n');
  return `        <div class="widget" data-widget="${esc(slug)}">
          <p class="wg-lede">${esc(w.lede)}</p>
${inputs}
${outs}
          <p class="wg-note">Computed live from <code>${esc(w.identity)}</code> — the law's own arithmetic, nothing fitted or predicted.</p>
        </div>`;
}
