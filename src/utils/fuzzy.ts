// Lightweight typo-tolerant matching (no dependencies).
// Handles case, number words ("mirpur ten" -> "mirpur 10"),
// prefixes, substrings and small edit-distance typos ("farmgat").

const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16',
};

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => NUMBER_WORDS[w] ?? w)
    .join(' ');
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/**
 * Score how well a query matches a target (0 = no match).
 * Tiers: exact 100 > prefix 80 > substring 60 > fuzzy 18-27.
 * Every query token must match some target token, so unrelated
 * multi-word queries never match by accident.
 */
export function fuzzyMatch(query: string, target: string): number {
  const q = normalizeText(query);
  const t = normalizeText(target);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;

  const qTokens = q.split(' ');
  const tTokens = t.split(' ');
  let total = 0;
  for (const qt of qTokens) {
    let best = 0;
    for (const tt of tTokens) {
      if (tt === qt) {
        best = Math.max(best, 3);
        continue;
      }
      if (qt.length >= 2 && tt.startsWith(qt)) {
        best = Math.max(best, 2);
        continue;
      }
      const tol = qt.length <= 3 ? 0 : qt.length <= 6 ? 1 : 2;
      if (tol > 0 && editDistance(qt, tt) <= tol) best = Math.max(best, 1);
    }
    if (best === 0) return 0;
    total += best;
  }
  return 15 + total * 3;
}