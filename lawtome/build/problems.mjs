// Problem themes — /situations/ cut into landing pages people can actually reach.
//
// 581 authored situations currently live on one 486 KB page grouped by the
// answering law's FIELD. That grouping is honest but it is the wrong axis: a
// reader with a problem does not know it is an economics problem. What they type
// is "why do metrics stop working" or "why does the meeting fill the hour".
//
// So: ~20 themes, each named after the problem rather than the discipline. The
// theme list below is authored — twenty judgement calls, stated openly — but the
// ASSIGNMENT of 581 situations to those themes is computed by matching the
// situation's own words and its authored `cues` against the theme's vocabulary.
// Nobody hand-sorted 581 rows, so nobody can quietly file a row where it flatters
// a page. A situation that matches nothing stays on the hub and gets no theme
// page; a situation that matches two goes to the stronger match only, because a
// row appearing on three pages is a directory, not an answer.
//
// Nothing here invents content. Every row is an authored situation pointing at an
// existing sourced entry; this module only decides which page it appears on.

/**
 * The themes, in display order.
 *
 * `keywords` is matched against the situation sentence and its cues. Multi-word
 * keywords match as phrases. The vocabulary is deliberately concrete — "deadline"
 * and "estimate" rather than "planning" — because an abstract keyword pulls in
 * everything and produces a page about nothing.
 *
 * `question` is the page's lede question, and is the thing a reader might have
 * typed. It is not a claim, so it costs us nothing to phrase it as they would.
 */
export const THEMES = [
  {
    slug: 'metrics-and-targets',
    title: 'Metrics and targets',
    question: 'Why does a number stop meaning anything once you aim at it?',
    keywords: ['metric', 'measure', 'target', 'kpi', 'quota', 'score', 'scores', 'ranking', 'rank',
      'gamed', 'gaming', 'game the', 'indicator', 'benchmark', 'quantif', 'statistic', 'audit'],
  },
  {
    slug: 'incentives-and-rewards',
    title: 'Incentives and rewards',
    question: 'Why do rewards so often produce the opposite of what they were meant to?',
    keywords: ['incentive', 'reward', 'bonus', 'bounty', 'pay', 'wages', 'salary', 'commission',
      'motivation', 'punish', 'penalty', 'perverse', 'backfire'],
  },
  {
    slug: 'deadlines-and-estimates',
    title: 'Deadlines and estimates',
    question: 'Why is the work always late even when the estimate was generous?',
    keywords: ['deadline', 'estimate', 'schedule', 'late', 'overrun', 'behind schedule', 'planning',
      'time available', 'fills the', 'takes longer', 'delay', 'budget overrun', 'timeline'],
  },
  {
    slug: 'meetings-and-committees',
    title: 'Meetings and committees',
    question: 'Why does the committee spend longest on the smallest decision?',
    // Not "consensus": it is as much a distributed-systems word as a committee
    // one, and it pulled Two Generals onto a page about bikeshedding.
    keywords: ['meeting', 'committee', 'agenda', 'discussion', 'vote', 'voting',
      'board', 'trivial', 'bikeshed', 'group decision', 'deliberat'],
  },
  {
    slug: 'organisations-and-hierarchy',
    title: 'Organisations and hierarchy',
    question: 'Why does the organisation end up structured like nobody intended?',
    keywords: ['organisation', 'organization', 'hierarchy', 'manager', 'management', 'promotion',
      'promoted', 'bureaucra', 'headcount', 'staff', 'department', 'chain of command',
      'reporting', 'org chart', 'employee', 'workforce', 'competence'],
  },
  {
    slug: 'software-and-systems',
    title: 'Software and systems',
    question: 'Why does the system get slower, bigger and more fragile every release?',
    keywords: ['software', 'code', 'program', 'bug', 'compiler', 'release', 'refactor', 'legacy',
      'api', 'database', 'server', 'cache', 'latency', 'throughput', 'distributed', 'protocol',
      'architecture', 'abstraction', 'interface', 'hardware', 'memory', 'processor', 'chip'],
  },
  {
    slug: 'growth-and-scale',
    title: 'Growth and scale',
    question: 'Why does the thing that worked small stop working large?',
    keywords: ['scale', 'scaling', 'growth', 'grows', 'exponential', 'doubling', 'compound',
      'bigger', 'size', 'capacity', 'population', 'expansion', 'saturat', 'diminishing'],
  },
  {
    slug: 'risk-and-failure',
    title: 'Risk and failure',
    question: 'Why does the accident come from the part nobody was watching?',
    keywords: ['risk', 'failure', 'fails', 'accident', 'disaster', 'safety', 'catastroph',
      'error', 'mistake', 'goes wrong', 'breaks', 'fragile', 'collapse', 'crisis', 'outage'],
  },
  {
    slug: 'evidence-and-proof',
    title: 'Evidence and proof',
    question: 'How much does this finding actually prove?',
    keywords: ['evidence', 'proof', 'prove', 'hypothesis', 'experiment', 'replicat', 'study',
      'trial', 'sample', 'data', 'test result', 'falsif', 'peer review', 'publication',
      'significan', 'p-value', 'confound'],
  },
  {
    slug: 'statistics-and-chance',
    title: 'Statistics and chance',
    question: 'Why does the number look impressive until you check the base rate?',
    keywords: ['probability', 'chance', 'random', 'coincidence', 'average', 'mean', 'regression',
      'correlation', 'base rate', 'distribution', 'statistic', 'odds', 'likelihood',
      'frequency', 'variance', 'sampling'],
  },
  {
    slug: 'memory-and-attention',
    title: 'Memory and attention',
    question: 'Why do you remember the wrong part of it?',
    keywords: ['memory', 'remember', 'recall', 'forget', 'attention', 'notice', 'distract',
      'focus', 'rehears', 'learning curve', 'repetition', 'primacy', 'recency'],
  },
  {
    slug: 'judgement-and-bias',
    title: 'Judgement and bias',
    question: 'Why does the confident answer keep turning out to be the wrong one?',
    keywords: ['bias', 'judgement', 'judgment', 'overconfiden', 'confident', 'assume', 'assumption',
      'stereotype', 'first impression', 'anchor', 'framing', 'heuristic', 'intuition',
      'gut feeling', 'jump to'],
  },
  {
    slug: 'persuasion-and-argument',
    title: 'Persuasion and argument',
    question: 'Why does the weaker argument keep winning the room?',
    keywords: ['argument', 'persuasion', 'persuade', 'debate', 'rhetoric', 'fallacy', 'convince',
      'rebut', 'straw man', 'appeal to', 'claim', 'assert', 'burden of proof', 'disagree'],
  },
  {
    slug: 'crowds-and-conformity',
    title: 'Crowds and conformity',
    question: 'Why does everyone agree in the room and disagree in the corridor?',
    keywords: ['crowd', 'conform', 'group', 'majority', 'peer pressure', 'bystander', 'herd',
      'social proof', 'norm', 'everyone else', 'popular', 'bandwagon', 'silence'],
  },
  {
    slug: 'markets-and-prices',
    title: 'Markets and prices',
    question: 'Why does the price move the opposite way to the story about it?',
    keywords: ['price', 'prices', 'market', 'demand', 'supply', 'cost', 'money', 'currency',
      'inflation', 'trade', 'buyer', 'seller', 'consumer', 'profit', 'invest', 'auction'],
  },
  {
    slug: 'competition-and-strategy',
    title: 'Competition and strategy',
    question: 'Why does the winning move stop working once everyone plays it?',
    keywords: ['competition', 'compete', 'strategy', 'rival', 'arms race', 'escalation',
      'negotiation', 'bargain', 'game theory', 'cooperat', 'defect', 'advantage', 'monopol'],
  },
  {
    slug: 'rules-and-policy',
    title: 'Rules and policy',
    question: 'Why does the rule outlive the reason for it?',
    keywords: ['rule', 'policy', 'regulation', 'law that', 'legal', 'compliance', 'procedure',
      'enforce', 'government', 'legislat', 'court', 'justice', 'rights', 'contract'],
  },
  {
    slug: 'design-and-interfaces',
    title: 'Design and interfaces',
    question: 'Why is the obvious design the one people get wrong?',
    keywords: ['design', 'interface', 'button', 'layout', 'usability', 'user', 'menu', 'screen',
      'typography', 'colour', 'color', 'visual', 'aesthetic', 'affordance', 'click'],
  },
  {
    slug: 'language-and-meaning',
    title: 'Language and meaning',
    question: 'Why do two people use the same word and mean different things?',
    keywords: ['language', 'word', 'meaning', 'translat', 'definition', 'ambigu', 'vocabulary',
      'grammar', 'speech', 'sentence', 'name for', 'terminology', 'jargon', 'metaphor'],
  },
  {
    slug: 'information-and-media',
    title: 'Information and media',
    question: 'Why does the false version travel further than the correction?',
    keywords: ['media', 'news', 'headline', 'rumour', 'rumor', 'misinformation', 'spread',
      'viral', 'broadcast', 'audience', 'coverage', 'publish', 'story', 'attention economy',
      'platform', 'algorithm', 'feed'],
  },
];

/** The smallest theme worth its own page. Below this it is a list, not a page. */
export const THEME_MIN = 8;

/**
 * A keyword must start at a word boundary, but may run on at the end.
 *
 * That asymmetry is deliberate and it is load-bearing. Several keywords above
 * are stems — `complexit`, `replicat`, `quantif` — which only work if the match
 * is allowed to continue past the keyword. Allowing it to START mid-word instead
 * produced the failure this rule exists for: the cue "franklin" contains "rank",
 * so a situation about the X-ray photograph that settled the structure of DNA was
 * filed under Metrics and targets. Substring matching on a 2,058-word cue
 * vocabulary will always find something.
 */
const matchers = new WeakMap();
function rx(theme) {
  let m = matchers.get(theme);
  if (!m) {
    m = theme.keywords.map((k) => new RegExp(`(^|[^a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'));
    matchers.set(theme, m);
  }
  return m;
}

/**
 * Score one situation against one theme.
 *
 * A hit in the situation's own sentence counts double a hit in its cues: the
 * sentence is what the reader reads, the cues are search hints that were written
 * to be generous. Weighting them equally lets a cue list drag a row onto a page
 * whose wording it does not actually match.
 *
 * @param {{situation:string, cues?:string[]}} s
 * @param {{keywords:string[]}} theme
 * @returns {number}
 */
export function score(s, theme) {
  const text = String((s && s.situation) || '');
  const cues = (Array.isArray(s && s.cues) ? s.cues : []).join(' ');
  let n = 0;
  for (const re of rx(theme)) {
    if (re.test(text)) n += 2;
    else if (re.test(cues)) n += 1;
  }
  return n;
}

/**
 * Assign each situation to at most one theme.
 *
 * Ties break toward the earlier theme in THEMES, which is stable and arbitrary
 * rather than stable and flattering — the order is a display choice made before
 * any assignment was seen.
 *
 * @param {object[]} raw authored situation rows (situation, law, cues).
 * @param {object[]} [themes]
 * @returns {{assigned: Map<string, object[]>, unassigned: object[]}}
 */
export function assign(raw = [], themes = THEMES) {
  const assigned = new Map(themes.map((t) => [t.slug, []]));
  const unassigned = [];
  for (const s of Array.isArray(raw) ? raw : []) {
    if (!s || !s.situation) continue;
    let best = null;
    let bestN = 0;
    for (const t of themes) {
      const n = score(s, t);
      if (n > bestN) { bestN = n; best = t; }
    }
    if (best) assigned.get(best.slug).push(s);
    else unassigned.push(s);
  }
  return { assigned, unassigned };
}

/**
 * Build the theme pages' data, resolved against the corpus.
 *
 * @param {object[]} raw authored situation rows.
 * @param {Object<string,object>} byslug corpus laws keyed by slug.
 * @param {object} [o]
 * @returns {{themes: object[], unassigned: number, covered: number}}
 */
export function problems(raw = [], byslug = {}, { min = THEME_MIN, themes = THEMES } = {}) {
  const { assigned, unassigned } = assign(raw, themes);
  const out = [];
  let covered = 0;
  for (const t of themes) {
    const rows = (assigned.get(t.slug) || [])
      .map((s) => ({ situation: s.situation, law: byslug[s.law] }))
      .filter((r) => r.law);
    if (rows.length < min) continue;
    covered += rows.length;
    const fields = new Set(rows.map((r) => r.law.category).filter(Boolean));
    out.push({ ...t, rows, count: rows.length, fields: fields.size });
  }
  return { themes: out, unassigned: unassigned.length, covered };
}

/** Base-relative path for a theme page. */
export function problemPath(theme) {
  return `situations/${theme.slug}/`;
}
