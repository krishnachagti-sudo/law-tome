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
    symbols: [{sym:'p', means:'Fraction of the work that parallelises'},{sym:'s', means:'Number of processors'}],
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
    symbols: [{sym:'r', means:'Growth rate per period', unit:'%'}],
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
    symbols: [{sym:'n', means:'Number of connected users'}],
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
    symbols: [{sym:'L', means:'Items in the system'},{sym:'lambda', means:'Arrival rate', unit:'per unit time'}],
    inputs: [
      { id: 'L', label: 'Items in the system', min: 1, max: 500, step: 1, value: 40, unit: '' },
      { id: 'lam', label: 'Arrivals per hour', min: 1, max: 500, step: 1, value: 20, unit: '/h' },
    ],
    outputs: [{ id: 'wait', label: 'Average time in the system', fmt: ' h' }],
  },
  'pareto-principle': {
    title: 'Try it',
    lede: 'What share of the total the top slice accounts for, on a Pareto distribution.',
    identity: 'share = 1 − (1 − top)^((log b) / (log a))',
    symbols: [{sym:'a', means:'Share of causes', unit:'%'},{sym:'b', means:'Share of effects', unit:'%'}],
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
    symbols: [{sym:'r', means:'Rank of the item'}],
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
    symbols: [{sym:'n', means:'People in the room'}],
    inputs: [{ id: 'n', label: 'People in the room', min: 2, max: 100, step: 1, value: 23, unit: '' }],
    outputs: [{ id: 'p', label: 'Chance of a shared birthday', fmt: '%' }],
  },
  'bayes-theorem': {
    title: 'Try it',
    lede: 'What a positive test actually tells you, once the base rate is taken into account.',
    identity: 'P(A|B) = P(B|A)·P(A) / P(B)',
    symbols: [{sym:'prior', means:'Base rate before testing', unit:'%'},{sym:'sens', means:'Sensitivity, true-positive rate', unit:'%'},{sym:'spec', means:'Specificity, true-negative rate', unit:'%'}],
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
    symbols: [{sym:'u, v', means:'The two vectors'},{sym:'<u,v>', means:'Their inner product'},{sym:'||u||', means:'Length of u'}],
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
    symbols: [{sym:'f', means:'A convex function; here x squared'},{sym:'E[X]', means:'The weighted average of the values'}],
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
    symbols: [{sym:'p', means:'Chance on a single try'},{sym:'n', means:'Number of tries'}],
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
    symbols: [{sym:'A', means:'Absorbance'},{sym:'e', means:'Molar absorptivity', unit:'1/(M.cm)'},{sym:'l', means:'Path length', unit:'cm'},{sym:'c', means:'Concentration', unit:'M'},{sym:'T', means:'Transmittance', unit:'%'}],
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
    symbols: [{sym:'P1, V1', means:'Pressure and volume before'},{sym:'P2, V2', means:'Pressure and volume after'}],
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
    symbols: [{sym:'theta', means:'Ramp angle', unit:'degrees'},{sym:'g', means:'Gravity', unit:'9.80665 m/s2'},{sym:'s', means:'Distance along the ramp', unit:'m'}],
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

  // ---- wave 2, 2026-09-09: ranking Tier-A pages with unambiguous closed forms ----
  'snells-law': {
    title: 'Try it', lede: 'Light bends at a boundary so that n sin(theta) is the same on both sides.',
    identity: 'n1 sin(t1) = n2 sin(t2)',
    symbols: [{sym:'n1, n2', means:'Refractive index of each medium'},
              {sym:'t1', means:'Angle of incidence', unit:'degrees'},
              {sym:'t2', means:'Angle of refraction', unit:'degrees'}],
    inputs: [{id:'n1',label:'Index, first medium',min:1,max:2.5,step:0.01,value:1},
             {id:'n2',label:'Index, second medium',min:1,max:2.5,step:0.01,value:1.33},
             {id:'t1',label:'Angle of incidence',min:0,max:89,step:1,value:30,unit:' deg'}],
    outputs: [{id:'t2',label:'Angle of refraction',fmt:' deg'},
              {id:'crit',label:'Critical angle (total internal reflection)',fmt:' deg'}],
  },
  'archimedes-principle': {
    title: 'Try it', lede: 'The upward force equals the weight of the fluid the object displaces.',
    identity: 'F = rho V g',
    symbols: [{sym:'rho', means:'Fluid density', unit:'kg/m3'},
              {sym:'V', means:'Displaced volume', unit:'m3'},
              {sym:'g', means:'Gravity', unit:'9.80665 m/s2'}],
    inputs: [{id:'rho',label:'Fluid density',min:100,max:14000,step:10,value:1000,unit:' kg/m3'},
             {id:'vol',label:'Displaced volume',min:0.001,max:2,step:0.001,value:0.05,unit:' m3'}],
    outputs: [{id:'f',label:'Buoyant force',fmt:' N'},
              {id:'mass',label:'Mass it can float',fmt:' kg'}],
  },
  'fouriers-law-of-heat-conduction': {
    title: 'Try it', lede: 'Heat flows down a temperature gradient in proportion to the material and the area.',
    identity: 'Q = k A dT / L',
    symbols: [{sym:'k', means:'Thermal conductivity', unit:'W/m.K'},
              {sym:'A', means:'Cross-sectional area', unit:'m2'},
              {sym:'dT', means:'Temperature difference', unit:'K'},
              {sym:'L', means:'Thickness', unit:'m'}],
    inputs: [{id:'k',label:'Thermal conductivity k',min:0.01,max:450,step:0.01,value:0.6,unit:' W/m.K',log:true},
             {id:'a',label:'Area A',min:0.01,max:20,step:0.01,value:1,unit:' m2'},
             {id:'dt',label:'Temperature difference',min:1,max:500,step:1,value:20,unit:' K'},
             {id:'l',label:'Thickness L',min:0.001,max:1,step:0.001,value:0.1,unit:' m'}],
    outputs: [{id:'q',label:'Heat flow',fmt:' W'},{id:'flux',label:'Heat flux',fmt:' W/m2'}],
  },
  'archards-wear-equation': {
    title: 'Try it', lede: 'Volume worn away rises with load and sliding distance, and falls with hardness.',
    identity: 'Q = K W L / H',
    symbols: [{sym:'K', means:'Dimensionless wear coefficient'},
              {sym:'W', means:'Normal load', unit:'N'},
              {sym:'L', means:'Sliding distance', unit:'m'},
              {sym:'H', means:'Hardness of the softer surface', unit:'Pa'}],
    inputs: [{id:'kk',label:'Wear coefficient K',min:0.000001,max:0.01,step:0.000001,value:0.0001,log:true},
             {id:'w',label:'Load W',min:1,max:5000,step:1,value:100,unit:' N'},
             {id:'l',label:'Sliding distance L',min:1,max:100000,step:1,value:1000,unit:' m',log:true},
             {id:'h',label:'Hardness H',min:10000000,max:10000000000,step:10000000,value:1000000000,unit:' Pa',log:true}],
    outputs: [{id:'v',label:'Volume worn',fmt:' mm3'}],
  },
  'braggs-law': {
    title: 'Try it', lede: 'Crystal planes reflect X-rays in phase only at angles where the path difference is a whole number of wavelengths.',
    identity: 'n lambda = 2 d sin(theta)',
    symbols: [{sym:'n', means:'Diffraction order'},
              {sym:'lambda', means:'Wavelength', unit:'nm'},
              {sym:'d', means:'Spacing between planes', unit:'nm'},
              {sym:'theta', means:'Glancing angle', unit:'degrees'}],
    inputs: [{id:'d',label:'Plane spacing d',min:0.05,max:2,step:0.001,value:0.282,unit:' nm'},
             {id:'lam',label:'Wavelength',min:0.01,max:2,step:0.001,value:0.154,unit:' nm'},
             {id:'n',label:'Order n',min:1,max:5,step:1,value:1}],
    outputs: [{id:'th',label:'Bragg angle',fmt:' deg'}],
  },
  'the-de-broglie-wavelength': {
    title: 'Try it', lede: 'Every moving particle has a wavelength, and it shrinks as momentum grows.',
    identity: 'lambda = h / (m v)',
    symbols: [{sym:'h', means:'Planck constant', unit:'6.62607015e-34 J.s'},
              {sym:'m', means:'Mass', unit:'kg'},
              {sym:'v', means:'Speed', unit:'m/s'}],
    inputs: [{id:'m',label:'Mass',min:0.000000000000000000000000000001,max:1,step:0.000000000000000000000000000001,value:0.000000000000000000000000000000910938,unit:' kg',log:true},
             {id:'v',label:'Speed',min:1,max:10000000,step:1,value:1000000,unit:' m/s',log:true}],
    outputs: [{id:'lam',label:'Wavelength',fmt:' nm'}],
  },
  'brewsters-angle': {
    title: 'Try it', lede: 'At one angle the reflected light is perfectly polarised, and it depends only on the two indices.',
    identity: 'theta_B = arctan(n2 / n1)',
    symbols: [{sym:'n1', means:'Index of the incident medium'},
              {sym:'n2', means:'Index of the second medium'}],
    inputs: [{id:'n1',label:'Index, first medium',min:1,max:2.5,step:0.01,value:1},
             {id:'n2',label:'Index, second medium',min:1,max:2.5,step:0.01,value:1.5}],
    outputs: [{id:'b',label:"Brewster's angle",fmt:' deg'},
              {id:'r',label:'Refraction angle there',fmt:' deg'}],
  },
  'newtons-law-of-cooling': {
    title: 'Try it', lede: 'The gap between an object and its surroundings decays exponentially.',
    identity: 'T(t) = Te + (T0 - Te) e^(-k t)',
    symbols: [{sym:'T0', means:'Starting temperature', unit:'degrees C'},
              {sym:'Te', means:'Surrounding temperature', unit:'degrees C'},
              {sym:'k', means:'Cooling constant', unit:'per minute'},
              {sym:'t', means:'Elapsed time', unit:'minutes'}],
    inputs: [{id:'t0',label:'Starting temperature',min:-50,max:300,step:1,value:90,unit:' C'},
             {id:'te',label:'Surrounding temperature',min:-50,max:100,step:1,value:20,unit:' C'},
             {id:'k',label:'Cooling constant k',min:0.001,max:1,step:0.001,value:0.05,unit:'/min'},
             {id:'t',label:'Time elapsed',min:0,max:240,step:1,value:20,unit:' min'}],
    outputs: [{id:'temp',label:'Temperature then',fmt:' C'},
              {id:'half',label:'Time to halve the gap',fmt:' min'}],
  },
  'raoults-law': {
    title: 'Try it', lede: 'A solvent’s vapour pressure falls in proportion to how much of it is actually solvent.',
    identity: 'P = x P0',
    symbols: [{sym:'x', means:'Mole fraction of the solvent'},
              {sym:'P0', means:'Vapour pressure of the pure solvent', unit:'kPa'}],
    inputs: [{id:'x',label:'Mole fraction of solvent',min:0,max:100,step:1,value:90,unit:'%'},
             {id:'p0',label:'Pure vapour pressure',min:1,max:200,step:1,value:101,unit:' kPa'}],
    outputs: [{id:'p',label:'Vapour pressure',fmt:' kPa'},
              {id:'drop',label:'Lowering',fmt:' kPa'}],
  },
  'the-langmuir-adsorption-isotherm': {
    title: 'Try it', lede: 'Coverage rises with pressure and saturates once the surface runs out of sites.',
    identity: 'theta = K P / (1 + K P)',
    symbols: [{sym:'K', means:'Adsorption equilibrium constant', unit:'1/kPa'},
              {sym:'P', means:'Pressure', unit:'kPa'},
              {sym:'theta', means:'Fraction of sites occupied'}],
    inputs: [{id:'k',label:'Constant K',min:0.001,max:10,step:0.001,value:0.1,unit:'/kPa',log:true},
             {id:'p',label:'Pressure P',min:0.1,max:500,step:0.1,value:20,unit:' kPa',log:true}],
    outputs: [{id:'th',label:'Surface coverage',fmt:'%'},
              {id:'phalf',label:'Pressure for half coverage',fmt:' kPa'}],
  },
  'the-law-of-total-probability': {
    title: 'Try it', lede: 'Split the world into two cases and the overall chance is the weighted sum of the two.',
    identity: 'P(A) = P(A|B) P(B) + P(A|B′) P(B′)',
    symbols: [{sym:'P(B)', means:'Chance of the first case'},
              {sym:'P(A|B)', means:'Chance of A within that case'},
              {sym:"P(A|B')", means:'Chance of A in the other case'}],
    inputs: [{id:'pb',label:'P(B)',min:0,max:100,step:1,value:30,unit:'%'},
             {id:'pab',label:'P(A given B)',min:0,max:100,step:1,value:80,unit:'%'},
             {id:'pab2',label:'P(A given not B)',min:0,max:100,step:1,value:10,unit:'%'}],
    outputs: [{id:'pa',label:'P(A)',fmt:'%'}],
  },
  'keplers-third-law': {
    title: 'Try it', lede: 'The square of the orbital period is proportional to the cube of the semi-major axis.',
    identity: 'T^2 = a^3   (T in years, a in AU)',
    symbols: [{sym:'T', means:'Orbital period', unit:'years'},
              {sym:'a', means:'Semi-major axis', unit:'AU'}],
    inputs: [{id:'a',label:'Semi-major axis',min:0.05,max:60,step:0.01,value:1,unit:' AU'}],
    outputs: [{id:'t',label:'Orbital period',fmt:' yr'},
              {id:'days',label:'In days',fmt:' d'}],
  },
  'matthiessens-rule': {
    title: 'Try it', lede: 'Total resistivity is the thermal part plus a residual that impurities set and cooling never removes.',
    identity: 'rho_total = rho_thermal + rho_residual',
    symbols: [{sym:'rho_thermal', means:'Temperature-dependent part', unit:'nOhm.m'},
              {sym:'rho_residual', means:'Impurity and defect part', unit:'nOhm.m'}],
    inputs: [{id:'rt',label:'Thermal part',min:0,max:200,step:0.1,value:16.8,unit:' nOhm.m'},
             {id:'rr',label:'Residual part',min:0,max:200,step:0.1,value:2,unit:' nOhm.m'}],
    outputs: [{id:'tot',label:'Total resistivity',fmt:' nOhm.m'},
              {id:'share',label:'Residual share',fmt:'%'}],
  },
  'faradays-laws-of-electrolysis': {
    title: 'Try it', lede: 'Mass deposited is set by the charge you pass and how many electrons each ion needs.',
    identity: 'm = Q M / (n F)',
    symbols: [{sym:'Q', means:'Charge passed', unit:'coulombs'},
              {sym:'M', means:'Molar mass', unit:'g/mol'},
              {sym:'n', means:'Electrons per ion'},
              {sym:'F', means:'Faraday constant', unit:'96485 C/mol'}],
    inputs: [{id:'i',label:'Current',min:0.1,max:100,step:0.1,value:2,unit:' A'},
             {id:'t',label:'Time',min:1,max:36000,step:1,value:3600,unit:' s',log:true},
             {id:'mm',label:'Molar mass',min:1,max:250,step:0.01,value:63.55,unit:' g/mol'},
             {id:'n',label:'Electrons per ion',min:1,max:6,step:1,value:2}],
    outputs: [{id:'m',label:'Mass deposited',fmt:' g'},{id:'q',label:'Charge passed',fmt:' C'}],
  },
  'the-venturi-effect': {
    title: 'Try it', lede: 'Narrow the pipe and the fluid speeds up, which drops the pressure exactly as Bernoulli requires.',
    identity: 'A1 v1 = A2 v2,   dP = (rho/2)(v2^2 - v1^2)',
    symbols: [{sym:'A1, A2', means:'Cross-sections, wide and narrow', unit:'cm2'},
              {sym:'v1, v2', means:'Speeds at each', unit:'m/s'},
              {sym:'rho', means:'Fluid density', unit:'kg/m3'}],
    inputs: [{id:'a1',label:'Wide cross-section',min:1,max:200,step:0.5,value:50,unit:' cm2'},
             {id:'a2',label:'Narrow cross-section',min:0.5,max:200,step:0.5,value:10,unit:' cm2'},
             {id:'v1',label:'Speed in the wide part',min:0.1,max:20,step:0.1,value:2,unit:' m/s'},
             {id:'rho',label:'Fluid density',min:1,max:14000,step:1,value:1000,unit:' kg/m3'}],
    outputs: [{id:'v2',label:'Speed in the throat',fmt:' m/s'},
              {id:'dp',label:'Pressure drop',fmt:' Pa'}],
  },
  'capillary-action': {
    title: 'Try it', lede: "Jurin's law: the narrower the tube, the higher the liquid climbs.",
    identity: 'h = 2 gamma cos(theta) / (rho g r)',
    symbols: [{sym:'gamma', means:'Surface tension', unit:'N/m'},
              {sym:'theta', means:'Contact angle', unit:'degrees'},
              {sym:'rho', means:'Liquid density', unit:'kg/m3'},
              {sym:'r', means:'Tube radius', unit:'m'}],
    inputs: [{id:'g',label:'Surface tension',min:0.01,max:0.5,step:0.001,value:0.0728,unit:' N/m'},
             {id:'th',label:'Contact angle',min:0,max:89,step:1,value:0,unit:' deg'},
             {id:'rho',label:'Density',min:100,max:14000,step:10,value:1000,unit:' kg/m3'},
             {id:'r',label:'Tube radius',min:0.00001,max:0.005,step:0.00001,value:0.0005,unit:' m',log:true}],
    outputs: [{id:'h',label:'Rise height',fmt:' mm'}],
  },

  // ---- wave 3, 2026-09-09 ----
  'the-van-t-hoff-equation': {
    title: 'Try it', lede: 'How an equilibrium constant shifts when you change the temperature.',
    identity: 'ln(K2/K1) = -(dH/R)(1/T2 - 1/T1)',
    symbols: [{sym:'K1, K2', means:'Equilibrium constant at each temperature'},
              {sym:'dH', means:'Enthalpy change', unit:'kJ/mol'},
              {sym:'R', means:'Gas constant', unit:'8.314 J/mol.K'},
              {sym:'T1, T2', means:'Temperatures', unit:'K'}],
    inputs: [{id:'k1',label:'K at the first temperature',min:0.001,max:1000,step:0.001,value:1,log:true},
             {id:'t1',label:'First temperature',min:200,max:1000,step:1,value:298,unit:' K'},
             {id:'t2',label:'Second temperature',min:200,max:1000,step:1,value:328,unit:' K'},
             {id:'dh',label:'Enthalpy change',min:-200,max:200,step:1,value:50,unit:' kJ/mol'}],
    outputs: [{id:'k2',label:'K at the second temperature'},{id:'fold',label:'Fold change',fmt:'x'}],
  },
  'the-eyring-equation': {
    title: 'Try it', lede: 'Reaction rate from the free energy of activation, with no fitted constants.',
    identity: 'k = (kB T / h) e^(-dG / R T)',
    symbols: [{sym:'kB', means:'Boltzmann constant', unit:'1.380649e-23 J/K'},
              {sym:'h', means:'Planck constant', unit:'6.62607015e-34 J.s'},
              {sym:'dG', means:'Free energy of activation', unit:'kJ/mol'},
              {sym:'T', means:'Temperature', unit:'K'}],
    inputs: [{id:'t',label:'Temperature',min:200,max:800,step:1,value:298,unit:' K'},
             {id:'dg',label:'Activation free energy',min:20,max:150,step:1,value:80,unit:' kJ/mol'}],
    outputs: [{id:'k',label:'Rate constant',fmt:' /s'},{id:'half',label:'Half-life',fmt:' s'}],
  },
  'fermats-little-theorem': {
    title: 'Try it', lede: 'For a prime p, a^(p-1) leaves remainder 1. When it does not, p cannot be prime. Try p = 561: it passes and is still composite, which is why this test alone never proves primality.',
    identity: 'a^(p-1) mod p = 1  when p is prime',
    symbols: [{sym:'a', means:'Base, not divisible by p'},{sym:'p', means:'The modulus being tested'}],
    inputs: [{id:'a',label:'Base a',min:2,max:60,step:1,value:2},
             {id:'p',label:'Modulus p',min:3,max:997,step:1,value:17}],
    outputs: [{id:'r',label:'a^(p-1) mod p',fmt:'int'},{id:'prime',label:'p is actually prime',fmt:'bool'}],
  },
  'helmholtz-resonance': {
    title: 'Try it', lede: 'The note a bottle plays, from the neck and the air inside it.',
    identity: 'f = (c / 2pi) sqrt(A / (V L))',
    symbols: [{sym:'c', means:'Speed of sound', unit:'343 m/s'},
              {sym:'A', means:'Neck cross-section', unit:'cm2'},
              {sym:'V', means:'Cavity volume', unit:'cm3'},
              {sym:'L', means:'Neck length', unit:'cm'}],
    inputs: [{id:'a',label:'Neck area',min:0.1,max:50,step:0.1,value:3,unit:' cm2'},
             {id:'v',label:'Cavity volume',min:10,max:5000,step:1,value:750,unit:' cm3'},
             {id:'l',label:'Neck length',min:0.5,max:30,step:0.1,value:5,unit:' cm'}],
    outputs: [{id:'f',label:'Resonant frequency',fmt:' Hz'}],
  },
  'the-clausius-clapeyron-relation': {
    title: 'Try it', lede: 'How a liquid’s vapour pressure climbs with temperature.',
    identity: 'ln(P2/P1) = -(dHvap/R)(1/T2 - 1/T1)',
    symbols: [{sym:'P1, P2', means:'Vapour pressure at each temperature', unit:'kPa'},
              {sym:'dHvap', means:'Enthalpy of vaporisation', unit:'kJ/mol'},
              {sym:'T1, T2', means:'Temperatures', unit:'K'}],
    inputs: [{id:'p1',label:'Known vapour pressure',min:0.1,max:200,step:0.1,value:101.3,unit:' kPa'},
             {id:'t1',label:'At this temperature',min:200,max:600,step:1,value:373,unit:' K'},
             {id:'t2',label:'Wanted at',min:200,max:600,step:1,value:353,unit:' K'},
             {id:'dh',label:'Enthalpy of vaporisation',min:5,max:100,step:0.1,value:40.7,unit:' kJ/mol'}],
    outputs: [{id:'p2',label:'Vapour pressure there',fmt:' kPa'}],
  },
  'henrys-law': {
    title: 'Try it', lede: 'Dissolved gas rises in direct proportion to the pressure above the liquid.',
    identity: 'C = kH P',
    symbols: [{sym:'kH', means:'Henry constant', unit:'mol/(L.atm)'},
              {sym:'P', means:'Partial pressure', unit:'atm'}],
    inputs: [{id:'kh',label:'Henry constant',min:0.0001,max:1,step:0.0001,value:0.00129,unit:' mol/L.atm',log:true},
             {id:'p',label:'Partial pressure',min:0.1,max:20,step:0.1,value:1,unit:' atm'}],
    outputs: [{id:'c',label:'Dissolved concentration',fmt:' mol/L'}],
  },
  'the-henderson-hasselbalch-equation': {
    title: 'Try it', lede: 'Buffer pH from the pKa and the ratio of base to acid.',
    identity: 'pH = pKa + log10([A-]/[HA])',
    symbols: [{sym:'pKa', means:'Acid dissociation constant, as -log10'},
              {sym:'[A-]/[HA]', means:'Ratio of conjugate base to acid'}],
    inputs: [{id:'pka',label:'pKa',min:0,max:14,step:0.01,value:4.76},
             {id:'ratio',label:'Base to acid ratio',min:0.01,max:100,step:0.01,value:1,log:true}],
    outputs: [{id:'ph',label:'pH'}],
  },
  'the-hall-petch-relationship': {
    title: 'Try it', lede: 'Finer grains make a metal stronger, as one over the square root of grain size.',
    identity: 'sigma_y = sigma_0 + k / sqrt(d)',
    symbols: [{sym:'sigma_0', means:'Friction stress', unit:'MPa'},
              {sym:'k', means:'Strengthening coefficient', unit:'MPa.um^0.5'},
              {sym:'d', means:'Grain diameter', unit:'um'}],
    inputs: [{id:'s0',label:'Friction stress',min:0,max:500,step:1,value:50,unit:' MPa'},
             {id:'k',label:'Coefficient k',min:1,max:2000,step:1,value:600,unit:''},
             {id:'d',label:'Grain size',min:0.01,max:500,step:0.01,value:25,unit:' um',log:true}],
    outputs: [{id:'sy',label:'Yield strength',fmt:' MPa'}],
  },
  'escape-velocity': {
    title: 'Try it', lede: 'The speed needed to leave for good, set only by mass and radius.',
    identity: 'v = sqrt(2 G M / r)',
    symbols: [{sym:'G', means:'Gravitational constant', unit:'6.674e-11'},
              {sym:'M', means:'Mass of the body', unit:'Earth masses'},
              {sym:'r', means:'Radius', unit:'Earth radii'}],
    inputs: [{id:'m',label:'Mass',min:0.001,max:400,step:0.001,value:1,unit:' Earths',log:true},
             {id:'r',label:'Radius',min:0.01,max:20,step:0.01,value:1,unit:' Earths',log:true}],
    outputs: [{id:'v',label:'Escape velocity',fmt:' km/s'}],
  },
  'wiens-displacement-law': {
    title: 'Try it', lede: 'Hotter things glow bluer: peak wavelength falls as one over temperature.',
    identity: 'lambda_max = b / T,  b = 2.897771955e-3 m.K',
    symbols: [{sym:'b', means:'Wien displacement constant', unit:'2.8978e-3 m.K'},
              {sym:'T', means:'Absolute temperature', unit:'K'}],
    inputs: [{id:'t',label:'Temperature',min:100,max:30000,step:10,value:5772,unit:' K',log:true}],
    outputs: [{id:'lam',label:'Peak wavelength',fmt:' nm'}],
  },
  'the-coupon-collectors-problem': {
    title: 'Try it', lede: 'How many random draws to collect the whole set: n times the nth harmonic number.',
    identity: 'E = n (1 + 1/2 + ... + 1/n)',
    symbols: [{sym:'n', means:'Number of distinct coupons'}],
    inputs: [{id:'n',label:'Distinct coupons',min:2,max:1000,step:1,value:50,log:true}],
    outputs: [{id:'e',label:'Expected draws'},{id:'per',label:'Draws per coupon',fmt:'x'}],
  },
  'the-square-cube-law': {
    title: 'Try it', lede: 'Double every length and area goes up fourfold while volume goes up eightfold, which is why size has limits.',
    identity: 'area ~ L^2,  volume ~ L^3',
    symbols: [{sym:'L', means:'Linear scale factor'}],
    inputs: [{id:'s',label:'Scale every length by',min:0.1,max:20,step:0.1,value:2,unit:'x'}],
    outputs: [{id:'a',label:'Area multiplies by',fmt:'x'},
              {id:'v',label:'Volume multiplies by',fmt:'x'},
              {id:'load',label:'Stress on the same cross-section',fmt:'x'}],
  },
  'the-wiedemann-franz-law': {
    title: 'Try it', lede: 'In a metal, thermal and electrical conductivity keep a fixed ratio set by temperature alone.',
    identity: 'kappa / sigma = L T,  L = 2.44e-8 W.Ohm/K^2',
    symbols: [{sym:'kappa', means:'Thermal conductivity', unit:'W/m.K'},
              {sym:'sigma', means:'Electrical conductivity', unit:'MS/m'},
              {sym:'L', means:'Lorenz number', unit:'2.44e-8'},
              {sym:'T', means:'Temperature', unit:'K'}],
    inputs: [{id:'sig',label:'Electrical conductivity',min:0.1,max:70,step:0.1,value:59.6,unit:' MS/m'},
             {id:'t',label:'Temperature',min:50,max:1000,step:1,value:300,unit:' K'}],
    outputs: [{id:'kap',label:'Predicted thermal conductivity',fmt:' W/m.K'}],
  },

  // ---- wave 4, 2026-09-09: quantitative entries outside the hard sciences ----
  'the-taylor-rule': {
    title: 'Try it', lede: 'The policy rate a central bank would set if it followed the rule mechanically.',
    identity: 'i = r* + pi + 0.5(pi - pi*) + 0.5 gap',
    symbols: [{sym:'r*', means:'Neutral real rate', unit:'%'},
              {sym:'pi', means:'Current inflation', unit:'%'},
              {sym:'pi*', means:'Inflation target', unit:'%'},
              {sym:'gap', means:'Output gap', unit:'%'}],
    inputs: [{id:'pi',label:'Current inflation',min:-2,max:15,step:0.1,value:3.2,unit:'%'},
             {id:'tgt',label:'Inflation target',min:0,max:6,step:0.1,value:2,unit:'%'},
             {id:'gap',label:'Output gap',min:-8,max:8,step:0.1,value:0,unit:'%'},
             {id:'r',label:'Neutral real rate',min:-2,max:5,step:0.1,value:2,unit:'%'}],
    outputs: [{id:'i',label:'Rule-implied policy rate',fmt:'%'},
              {id:'real',label:'Implied real rate',fmt:'%'}],
  },
  'reeds-law': {
    title: 'Try it', lede: 'Counting subgroups rather than links: value grows as two to the n, which dwarfs Metcalfe almost immediately.',
    identity: 'groups = 2^n - n - 1',
    symbols: [{sym:'n', means:'Members of the network'}],
    inputs: [{id:'n',label:'Members',min:2,max:40,step:1,value:10}],
    outputs: [{id:'g',label:'Possible subgroups',fmt:'int'},
              {id:'pairs',label:'Metcalfe pairs, for comparison',fmt:'int'},
              {id:'ratio',label:'Reed over Metcalfe',fmt:'x'}],
  },
  'dennard-scaling': {
    title: 'Try it', lede: 'Shrink every dimension by k and, in the classical regime, power density holds constant while speed rises.',
    identity: 'area ~ 1/k^2,  delay ~ 1/k,  power density ~ 1',
    symbols: [{sym:'k', means:'Linear shrink factor per generation'}],
    inputs: [{id:'k',label:'Shrink factor per generation',min:1.05,max:2,step:0.01,value:1.4},
             {id:'g',label:'Generations',min:1,max:10,step:1,value:3}],
    outputs: [{id:'dens',label:'Transistors per unit area',fmt:'x'},
              {id:'speed',label:'Clock speed',fmt:'x'},
              {id:'pd',label:'Power density (classical Dennard)',fmt:'x'}],
  },
  'cherenkov-radiation': {
    title: 'Try it', lede: 'Light cannot be outrun in a vacuum, but it can in water, and when it is the shockwave glows at a fixed angle.',
    identity: 'cos(theta) = 1 / (n beta),  threshold beta > 1/n',
    symbols: [{sym:'n', means:'Refractive index of the medium'},
              {sym:'beta', means:'Particle speed as a fraction of c'},
              {sym:'theta', means:'Cone half-angle', unit:'degrees'}],
    inputs: [{id:'n',label:'Refractive index',min:1,max:2.5,step:0.01,value:1.33},
             {id:'b',label:'Particle speed',min:0.5,max:0.9999,step:0.0001,value:0.9,unit:' c'}],
    outputs: [{id:'th',label:'Cone half-angle',fmt:' deg'},
              {id:'thr',label:'Threshold speed for this medium',fmt:' c'},
              {id:'glow',label:'Above threshold',fmt:'bool'}],
  },
  'cromwells-rule': {
    title: 'Try it', lede: 'Set the prior to exactly zero and no evidence, however strong, can ever move it. That is the whole rule.',
    identity: 'posterior odds = prior odds x likelihood ratio',
    symbols: [{sym:'prior', means:'Prior probability', unit:'%'},
              {sym:'LR', means:'Likelihood ratio of the evidence'}],
    inputs: [{id:'pr',label:'Prior probability',min:0,max:100,step:0.1,value:10,unit:'%'},
             {id:'lr',label:'Likelihood ratio',min:0.01,max:1000,step:0.01,value:50,log:true}],
    outputs: [{id:'post',label:'Posterior probability',fmt:'%'},
              {id:'moved',label:'Evidence moved the belief',fmt:'bool'}],
  },
  'the-minimax-theorem': {
    title: 'Try it', lede: 'Every finite two-player zero-sum game has one value both players can guarantee, and mixing is usually how.',
    identity: 'v = (ad - bc) / (a + d - b - c)',
    symbols: [{sym:'a, b', means:"Row player's payoff, first row"},
              {sym:'c, d', means:"Row player's payoff, second row"},
              {sym:'v', means:'Value of the game'}],
    inputs: [{id:'a',label:'Payoff, row 1 col 1',min:-10,max:10,step:1,value:3},
             {id:'b',label:'Payoff, row 1 col 2',min:-10,max:10,step:1,value:-1},
             {id:'c',label:'Payoff, row 2 col 1',min:-10,max:10,step:1,value:-2},
             {id:'d',label:'Payoff, row 2 col 2',min:-10,max:10,step:1,value:4}],
    outputs: [{id:'v',label:'Value of the game'},
              {id:'p',label:'Play row 1 this often',fmt:'%'},
              {id:'saddle',label:'Has a pure-strategy saddle point',fmt:'bool'}],
  },
  'simpsons-paradox': {
    title: 'Try it', lede: 'The second treatment is better in BOTH groups by a fixed margin. Move the allocations and watch it lose overall anyway.',
    identity: 'aggregate rate = weighted mean of the group rates',
    symbols: [{sym:'edge', means:'How much better B is inside each group', unit:'percentage points'},
              {sym:'alloc', means:'Share of each treatment put in the easy group', unit:'%'}],
    inputs: [{id:'easy',label:'Success rate, easy group (A)',min:1,max:95,step:1,value:80,unit:'%'},
             {id:'hard',label:'Success rate, hard group (A)',min:1,max:95,step:1,value:10,unit:'%'},
             {id:'edge',label:'B is better in each group by',min:0,max:20,step:1,value:5,unit:' pp'},
             {id:'aa',label:'Share of A in the easy group',min:0,max:100,step:1,value:50,unit:'%'},
             {id:'ab',label:'Share of B in the easy group',min:0,max:100,step:1,value:10,unit:'%'}],
    outputs: [{id:'ra',label:'A overall',fmt:'%'},
              {id:'rb',label:'B overall',fmt:'%'},
              {id:'rev',label:'Reversed: B better in both, worse overall',fmt:'bool'}],
  },
  // Deliberately absent: the Chinese Remainder Theorem is the highest-impression
  // page without a widget, but its inputs must be pairwise coprime moduli. A
  // slider that silently produces invalid input would teach the reader the
  // wrong thing about the theorem, so it stays prose.
  'the-chinese-remainder-theorem': null,
  'the-second-law-of-thermodynamics': null, // no single closed form — deliberately absent
};

/** Every slug this file claims to cover, including deliberate nulls, so the
 *  build can assert each one is a real law. */
export function widgetSlugs() {
  return Object.keys(WIDGETS);
}

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
  // The formula, stated. Search Console shows these pages ranking for queries
  // about the symbols and their units ("molar absorptivity", "n1 sin theta1"),
  // and the prose never wrote the identity down — only the widget note did, in
  // ASCII, at the bottom. A quantitative law should say what its terms mean.
  const symbols = (w.symbols || []).map((y) => `            <div class="wg-sym">
              <dt>${esc(y.sym)}</dt>
              <dd>${esc(y.means)}${y.unit ? ` <span class="wg-unit">${esc(y.unit)}</span>` : ''}</dd>
            </div>`).join('\n');
  const key = w.symbols && w.symbols.length
    ? `          <div class="wg-formula">
            <p class="wg-eq"><code>${esc(w.identity)}</code></p>
            <dl class="wg-syms">
${symbols}
            </dl>
          </div>`
    : '';
  return `        <div class="widget" data-widget="${esc(slug)}">
          <p class="wg-lede">${esc(w.lede)}</p>
${key}
${inputs}
${outs}
          <p class="wg-note">Computed live from <code>${esc(w.identity)}</code> — the law's own arithmetic, nothing fitted or predicted.</p>
        </div>`;
}
