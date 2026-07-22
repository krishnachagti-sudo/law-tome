// Pure helpers for the "law of the day" + "name that law" quiz (no I/O).
//
// The interactive quiz and the daily pick live in src/assets/quiz.js (browser),
// which mirrors dayIndex() exactly so the Node test and the client agree on which
// law is "today". Keeping the selection here (pure, deterministic) means the pick
// depends only on the date — the same day always yields the same law, and no
// randomness leaks into the build (Math.random/Date.now are unavailable anyway).

/**
 * Deterministic index into a list of `count` items for a given date string
 * (any stable per-day key, e.g. "2026-07-22"). Same date + same count => same
 * index. Uses a small rolling string hash mod count.
 * @param {string} dateStr a per-day key (YYYY-MM-DD).
 * @param {number} count number of items to choose from.
 * @returns {number} an index in [0, count), or 0 when count < 1.
 */
export function dayIndex(dateStr, count) {
  const n = Number(count) || 0;
  if (n < 1) return 0;
  const s = String(dateStr || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % n;
}
