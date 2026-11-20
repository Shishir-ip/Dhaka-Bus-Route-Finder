import type { Bus, BusRoute, JourneyResult, JourneySegment } from '../types';

// ---------- Tuning ----------
const MAX_RESULTS = 12;
const TRANSFER_PENALTY = 8; // extra cost per transfer (in "stop equivalents")
const STAR_BONUS = 1.2; // cost reduction per star of the buses used
const DIRECT_SLOTS = 3; // best direct buses always kept in the results
const ONE_TRANSFER_CAP = 400;
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

  // ----- Direct -----
  for (const info of originRoutes) {
    const a = info.stops.indexOf(fromId);
    const b = info.stops.indexOf(toId);
    if (canTravel(info.route, a, b)) push(makeJourney([{ info, fromIdx: a, toIdx: b }]));
  }

  // ----- Last-leg index: location -> best routes that reach the destination -----
  const destRoutes = new Map<string, Leg[]>();
  for (const [loc, infos] of index) {
    if (loc === toId || loc === fromId) continue;
    const legs: Leg[] = [];
    for (const info of infos) {
      const a = info.stops.indexOf(loc);
      const b = info.stops.indexOf(toId);
      if (canTravel(info.route, a, b)) legs.push({ info, fromIdx: a, toIdx: b });
    }
    if (legs.length) {
      legs.sort((x, y) => Math.abs(x.toIdx - x.fromIdx) - Math.abs(y.toIdx - y.fromIdx));
      destRoutes.set(loc, legs.slice(0, 2));
    }
  }

  // ----- 1 transfer -----
  let oneCount = 0;
  outerOne: for (const info1 of originRoutes) {
    const fromIdx = info1.stops.indexOf(fromId);
    for (let i = 0; i < info1.stops.length; i++) {
      const t = info1.stops[i];
      if (t === fromId || t === toId || !canTravel(info1.route, fromIdx, i)) continue;
      const lastLegs = destRoutes.get(t);
      if (!lastLegs) continue;
      for (const leg2 of lastLegs) {
        if (leg2.info.bus.id === info1.bus.id) continue;
        push(makeJourney([{ info: info1, fromIdx, toIdx: i }, leg2]));
        if (++oneCount >= ONE_TRANSFER_CAP || overBudget()) break outerOne;
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

  // Keep at most 2 variants per bus sequence (different transfer points),
  // preferring the one with fewer stops.
  const bySequence = new Map<string, JourneyResult[]>();
  for (const j of candidates) {
    const k = busSequenceKey(j);
    const list = bySequence.get(k);
    if (list) list.push(j);
    else bySequence.set(k, [j]);
  }
  const trimmed: JourneyResult[] = [];
  for (const list of bySequence.values()) {
    list.sort((a, b) => a.totalStops - b.totalStops || a.score - b.score);
    trimmed.push(...list.slice(0, 2));
  }

  trimmed.sort((a, b) => a.score - b.score || a.totalStops - b.totalStops || a.totalTransfers - b.totalTransfers);

  // Take the best-scored journeys, but always keep the best direct buses
  // visible — riders expect to see direct options even when a transfer
  // happens to be shorter.
  const results = trimmed.slice(0, MAX_RESULTS);
  const included = new Set(results.map(journeyKey));
  const bestDirects = trimmed.filter((j) => j.totalTransfers === 0).slice(0, DIRECT_SLOTS);
  for (const d of bestDirects) {
    if (included.has(journeyKey(d))) continue;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].totalTransfers > 0) {
        results[i] = d;
        included.add(journeyKey(d));
        break;
      }
    }
  }
  results.sort((a, b) => a.score - b.score || a.totalStops - b.totalStops || a.totalTransfers - b.totalTransfers);

  const bestDirectStops = results.filter((j) => j.totalTransfers === 0).reduce((m, j) => Math.min(m, j.totalStops), Infinity);

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