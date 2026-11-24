import type { Bus, BusRoute, JourneyResult, JourneySegment } from '../types';

// ---------- Tuning ----------
const MAX_RESULTS = 12; // cap for 2-transfer fallback combos
const TRANSFER_PENALTY = 8; // extra cost per transfer (in "stop equivalents")
const STAR_BONUS = 1.2; // cost reduction per star of the buses used
const ONE_TRANSFER_SAFETY_CAP = 6000; // enumeration guard; time budget is the real limit
const TWO_TRANSFER_CAP = 300;
const TIME_BUDGET_MS = 1500;
const MIN_RESULTS_BEFORE_TWO_TRANSFER = 4;
// Metro stops are ~2 min apart vs ~4+ min for buses in Dhaka traffic,
// so a metro stop counts as half a bus stop when scoring journeys.
const METRO_STOP_WEIGHT = 0.5;

interface RouteInfo {
  bus: Bus;
  route: BusRoute;
  stops: string[];
}

interface Leg {
  info: RouteInfo;
  fromIdx: number;
  toIdx: number;
}

function canTravel(route: BusRoute, fromIdx: number, toIdx: number): boolean {
  if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return false;
  if (route.direction === 'both') return true;
  if (route.direction === 'up') return fromIdx < toIdx;
  if (route.direction === 'down') return fromIdx > toIdx;
  return false;
}

/**
 * Best board/alight pair for a route. Loop routes can visit the same stop
 * twice; indexOf would lock onto the first occurrence and overcount stops
 * (or miss a valid direction). Scan every occurrence pair and keep the
 * shortest ride that is actually travelable.
 */
function bestPair(info: RouteInfo, fromId: string, toId: string): { fromIdx: number; toIdx: number } | null {
  const { stops, route } = info;
  let best: { fromIdx: number; toIdx: number } | null = null;
  let bestDist = Infinity;
  for (let a = 0; a < stops.length; a++) {
    if (stops[a] !== fromId) continue;
    for (let b = 0; b < stops.length; b++) {
      if (stops[b] !== toId || !canTravel(route, a, b)) continue;
      const dist = Math.abs(a - b);
      if (dist < bestDist) {
        bestDist = dist;
        best = { fromIdx: a, toIdx: b };
      }
    }
  }
  return best;
}

function makeSegment(info: RouteInfo, fromIdx: number, toIdx: number): JourneySegment {
  const { bus, route, stops } = info;
  const lo = Math.min(fromIdx, toIdx);
  const hi = Math.max(fromIdx, toIdx);
  let segmentStops = stops.slice(lo, hi + 1);
  if (route.direction === 'down' && fromIdx > toIdx) segmentStops = segmentStops.reverse();
  return {
    bus,
    route,
    boardStop: stops[fromIdx],
    alightStop: stops[toIdx],
    stops: segmentStops,
    stopCount: segmentStops.length - 1,
  };
}

function makeJourney(legs: Leg[]): JourneyResult {
  const segments = legs.map((l) => makeSegment(l.info, l.fromIdx, l.toIdx));
  const totalStops = segments.reduce((a, s) => a + s.stopCount, 0);
  const totalTransfers = segments.length - 1;
  const starSum = segments.reduce((a, s) => a + (s.bus.starRating || 0), 0);
  const avgStar = starSum / segments.length;
  const weightedStops = segments.reduce((a, s) => a + s.stopCount * (s.bus.type === 'Metro' ? METRO_STOP_WEIGHT : 1), 0);
  const score = weightedStops + totalTransfers * TRANSFER_PENALTY - avgStar * STAR_BONUS;
  return {
    type: totalTransfers === 0 ? 'direct' : 'transfer',
    segments,
    totalTransfers,
    totalStops,
    score,
  };
}

function journeyKey(j: JourneyResult): string {
  return j.segments.map((s) => `${s.bus.id}:${s.boardStop}:${s.alightStop}`).join('|');
}

function busSequenceKey(j: JourneyResult): string {
  return j.segments.map((s) => s.bus.id).join('>');
}

/** Build location -> routes index for active buses with usable routes. */
function buildIndex(buses: Bus[]): Map<string, RouteInfo[]> {
  const index = new Map<string, RouteInfo[]>();
  for (const bus of buses) {
    if (!bus.isActive || !bus.routes) continue;
    for (const route of bus.routes) {
      if (!route.stops || route.stops.length < 2) continue;
      const stops = route.stops.map((s) => s.locationId).filter(Boolean);
      if (stops.length < 2) continue;
      const info: RouteInfo = { bus, route, stops };
      for (const id of new Set(stops)) {
        const list = index.get(id);
        if (list) list.push(info);
        else index.set(id, [info]);
      }
    }
  }
  return index;
}

/** Quick check used by the home page for popular-route chips. */
export function hasDirectBus(fromId: string, toId: string, buses: Bus[]): boolean {
  if (!fromId || !toId || fromId === toId) return false;
  for (const bus of buses) {
    if (!bus.isActive) continue;
    for (const route of bus.routes || []) {
      const ids = route.stops.map((s) => s.locationId);
      const a = ids.indexOf(fromId);
      const b = ids.indexOf(toId);
      if (a !== -1 && b !== -1 && canTravel(route, a, b)) return true;
    }
  }
  return false;
}

/**
 * Find journeys between two locations:
 *  - all direct buses
 *  - 1-transfer combinations (always)
 *  - 2-transfer combinations (fallback when few options exist)
 * Results are ranked by stops + transfer penalty, with a bonus for
 * admin-starred buses, so better buses surface higher.
 */
export function findRoutes(fromId: string, toId: string, buses: Bus[]): JourneyResult[] {
  if (!fromId || !toId || fromId === toId) return [];
  const start = Date.now();
  const overBudget = () => Date.now() - start > TIME_BUDGET_MS;

  const index = buildIndex(buses);
  const originRoutes = index.get(fromId);
  if (!originRoutes || !index.has(toId)) return [];

  const candidates: JourneyResult[] = [];
  const seen = new Set<string>();
  const push = (j: JourneyResult) => {
    const k = journeyKey(j);
    if (seen.has(k)) return;
    seen.add(k);
    candidates.push(j);
  };

  // ----- Direct: every bus that serves both stops, best variant per bus -----
  const directByBus = new Map<string, JourneyResult>();
  for (const info of originRoutes) {
    const pair = bestPair(info, fromId, toId);
    if (!pair) continue;
    const j = makeJourney([{ info, fromIdx: pair.fromIdx, toIdx: pair.toIdx }]);
    const prev = directByBus.get(info.bus.id);
    if (!prev || j.score < prev.score) directByBus.set(info.bus.id, j);
  }
  for (const j of directByBus.values()) push(j);

  // ----- Last-leg index: location -> EVERY bus that reaches the destination -----
  // Keeping all legs (not just the 2 shortest) is what lets riders see every
  // possible second bus after a transfer, not only the "best" ones.
  const destRoutes = new Map<string, Leg[]>();
  for (const [loc, infos] of index) {
    if (loc === toId || loc === fromId) continue;
    const legs: Leg[] = [];
    const usedBuses = new Set<string>();
    for (const info of infos) {
      if (usedBuses.has(info.bus.id)) continue;
      const pair = bestPair(info, loc, toId);
      if (pair) {
        legs.push({ info, fromIdx: pair.fromIdx, toIdx: pair.toIdx });
        usedBuses.add(info.bus.id);
      }
    }
    if (legs.length) {
      legs.sort((x, y) => Math.abs(x.toIdx - x.fromIdx) - Math.abs(y.toIdx - y.fromIdx));
      destRoutes.set(loc, legs);
    }
  }

  // ----- 1 transfer: every first bus x every second bus that connects -----
  let oneCount = 0;
  outerOne: for (const info1 of originRoutes) {
    const fromOccurrences: number[] = [];
    for (let k = 0; k < info1.stops.length; k++) if (info1.stops[k] === fromId) fromOccurrences.push(k);
    for (let i = 0; i < info1.stops.length; i++) {
      const t = info1.stops[i];
      if (t === fromId || t === toId) continue;
      // Nearest boardable occurrence of the origin (loop routes visit stops twice).
      let fromIdx = -1;
      let bestDist = Infinity;
      for (const k of fromOccurrences) {
        if (!canTravel(info1.route, k, i)) continue;
        const dist = Math.abs(i - k);
        if (dist < bestDist) { bestDist = dist; fromIdx = k; }
      }
      if (fromIdx === -1) continue;
      const lastLegs = destRoutes.get(t);
      if (!lastLegs) continue;
      for (const leg2 of lastLegs) {
        if (leg2.info.bus.id === info1.bus.id) continue;
        push(makeJourney([{ info: info1, fromIdx, toIdx: i }, leg2]));
        if (++oneCount >= ONE_TRANSFER_SAFETY_CAP || overBudget()) break outerOne;
      }
    }
  }

  // ----- 2 transfers (fallback) -----
  const directAndOne = candidates.length;
  if (directAndOne < MIN_RESULTS_BEFORE_TWO_TRANSFER && !overBudget()) {
    // Forward index: location -> best first legs from the origin.
    const forward = new Map<string, Leg[]>();
    for (const info1 of originRoutes) {
      const fromIdx = info1.stops.indexOf(fromId);
      for (let i = 0; i < info1.stops.length; i++) {
        const t = info1.stops[i];
        if (t === fromId || t === toId || !canTravel(info1.route, fromIdx, i)) continue;
        const leg: Leg = { info: info1, fromIdx, toIdx: i };
        const list = forward.get(t);
        if (list) {
          if (list.length < 2 && !list.some((l) => l.info.bus.id === info1.bus.id)) list.push(leg);
        } else forward.set(t, [leg]);
      }
    }

    let twoCount = 0;
    outerTwo: for (const [t1, firstLegs] of forward) {
      const midRoutes = index.get(t1) || [];
      for (const leg1 of firstLegs) {
        for (const info2 of midRoutes) {
          if (info2.bus.id === leg1.info.bus.id) continue;
          const a2 = info2.stops.indexOf(t1);
          if (a2 === -1) continue;
          for (let j = 0; j < info2.stops.length; j++) {
            const t2 = info2.stops[j];
            if (t2 === fromId || t2 === toId || t2 === t1 || !canTravel(info2.route, a2, j)) continue;
            const lastLegs = destRoutes.get(t2);
            if (!lastLegs) continue;
            for (const leg3 of lastLegs) {
              if (leg3.info.bus.id === leg1.info.bus.id || leg3.info.bus.id === info2.bus.id) continue;
              push(makeJourney([leg1, { info: info2, fromIdx: a2, toIdx: j }, leg3]));
              if (++twoCount >= TWO_TRANSFER_CAP || overBudget()) break outerTwo;
            }
          }
        }
      }
    }
  }

  if (candidates.length === 0) return [];

  // One card per bus combination: keep the best transfer point for each
  // bus sequence (fewest stops), so every distinct pairing is shown once.
  const bySequence = new Map<string, JourneyResult>();
  for (const j of candidates) {
    const k = busSequenceKey(j);
    const prev = bySequence.get(k);
    if (!prev || j.totalStops < prev.totalStops || (j.totalStops === prev.totalStops && j.score < prev.score)) {
      bySequence.set(k, j);
    }
  }
  const trimmed = [...bySequence.values()];

  // Detour penalty: a transfer journey that rides far more stops than the
  // best direct bus (or the best journey overall) is a detour, not a real
  // alternative. Keep it listed — riders asked for every option — but sink
  // it below sensible choices instead of letting it clutter the top.
  const bestDirectStops = trimmed
    .filter((j) => j.totalTransfers === 0)
    .reduce((m, j) => Math.min(m, j.totalStops), Infinity);
  const baseline = bestDirectStops !== Infinity
    ? bestDirectStops
    : trimmed.reduce((m, j) => Math.min(m, j.totalStops), Infinity);
  for (const j of trimmed) {
    if (j.totalTransfers > 0 && j.totalStops > baseline) {
      j.score += (j.totalStops - baseline) * 0.5;
    }
  }

  trimmed.sort((a, b) => a.score - b.score || a.totalStops - b.totalStops || a.totalTransfers - b.totalTransfers);

  // Show every direct bus AND every 1-transfer bus combination — riders
  // expect all possible ways, not a curated subset. Only the 2-transfer
  // fallback (used when almost nothing connects) is capped.
  const directs = trimmed.filter((j) => j.totalTransfers === 0);
  const oneTransfers = trimmed.filter((j) => j.totalTransfers === 1);
  const twoTransfers = trimmed.filter((j) => j.totalTransfers === 2);
  const results = [...directs, ...oneTransfers, ...twoTransfers.slice(0, MAX_RESULTS)];
  results.sort((a, b) => a.score - b.score || a.totalStops - b.totalStops || a.totalTransfers - b.totalTransfers);

  results.forEach((j, i) => {
    if (i === 0) {
      j.category = 'recommended';
      j.reason = j.totalTransfers === 0 ? 'Direct — no transfer' : `${j.totalTransfers} transfer${j.totalTransfers > 1 ? 's' : ''} — best overall`;
    } else if (j.totalTransfers === 0) {
      j.category = 'direct';
      j.reason = 'Direct — no transfer';
    } else if (bestDirectStops !== Infinity && j.totalStops < bestDirectStops - 2) {
      j.category = 'fewer_stops';
      j.reason = `${bestDirectStops - j.totalStops} fewer stops than the best direct bus`;
    } else {
      j.category = 'alternative';
      j.reason = 'Alternative option';
    }
  });

  return results;
}