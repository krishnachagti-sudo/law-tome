// When each entry's DATA last changed, from git history (backlog B10).
//
// The feed was ordered by entry number, a proxy for "recently added" that says
// nothing about an entry revised last week because its evidence moved — and
// "we update when the evidence updates" is only checkable if the feed shows it.
//
// Not the lastmod manifest. That tracks the rendered page, so a template edit
// re-dates all 1,116 entries at once; on the day this was written every law
// page carried the same date for exactly that reason. This reads the history
// of src/data/laws/, where one file is one entry, so a date here means the
// entry itself was edited.
//
// It refuses rather than guesses. In a shallow clone (CI's default checkout,
// and any `--depth` clone) history stops at the cut, and every entry would
// appear to have changed in the oldest commit present. So a shallow or
// git-less checkout returns null and the feed keeps its old order.

import { execFileSync } from 'node:child_process';

/**
 * @param {string} dataDir the directory of per-entry JSON files
 * @returns {Map<string,string>|null} slug -> ISO date of the last commit that
 *   touched that entry's file, or null when complete history is not available
 */
export function changeDates(dataDir) {
  const git = (args) => execFileSync('git', args, { cwd: dataDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() !== 'false') return null;
    // One pass, newest first: the first date seen for a file is its last change.
    const out = git(['log', '--format=%x00%cI', '--name-only', '--relative', '--', '.']);
    const dates = new Map();
    let current = null;
    for (const line of out.split('\n')) {
      if (line.startsWith('\u0000')) { current = line.slice(1).trim(); continue; }
      const f = line.trim();
      if (!f || !current || !f.endsWith('.json')) continue;
      const slug = f.replace(/\.json$/, '').split('/').pop();
      if (!dates.has(slug)) dates.set(slug, current);
    }
    return dates.size ? dates : null;
  } catch {
    return null;
  }
}
