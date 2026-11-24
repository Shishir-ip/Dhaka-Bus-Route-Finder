// Route-finder regression suite, run against the real consolidated network
// (tests/fixtures/network.json — 182 services, 266 locations, 3661 stops).
// The completeness sweeps are the guard against the "hidden bus" bugs:
// every direct bus and every feasible 1-transfer pairing must be shown.
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { findRoutes, hasDirectBus } from '../routeFinder';
import { fuzzyMatch, editDistance } from '../fuzzy';
import type { Bus, Location } from '../../types';

interface RawBus {
  id: string; name_en: string; name_bn: string | null; type: string | null;
  operating_hours: string | null; star_rating: number | null; total_reviews: number | null;
  is_active: boolean; routes: { id: string; direction: 'up' | 'down' | 'both'; stops: string[] }[];
}
const raw = JSON.parse(readFileSync(new URL('../../../tests/fixtures/network.json', import.meta.url), 'utf8')) as {
  locations: (Location & { name_en: string; name_bn: string })[];
  buses: RawBus[];
};
const locById = new Map(raw.locations.map((l) => [l.id, l]));
const idByName = new Map(raw.locations.map((l) => [l.name_en, l.id]));
const name = (id: string) => locById.get(id)?.name_en ?? id;

const buses: Bus[] = raw.buses.map((b) => ({
  id: b.id,
  nameEn: b.name_en,
  nameBn: b.name_bn || b.name_en,
  type: b.type || undefined,
  operatingHours: b.operating_hours || undefined,
  starRating: b.star_rating || 0,
  totalReviews: b.total_reviews || 0,
  isActive: b.is_active,
  routes: b.routes.map((r) => ({
    id: r.id, busId: b.id, direction: r.direction,
    stops: r.stops.map((s, i) => ({ locationId: s, order: i + 1 })),
  })),
}));

describe('direct searches', () => {
  for (const [a, b] of [['Mirpur 10', 'Motijheel'], ['Gabtoli', 'Gulistan'], ['Farmgate', 'Shahbag'], ['Savar', 'Technical']]) {
    it(`${a} -> ${b} finds direct buses fast`, () => {
      const t0 = Date.now();
      const res = findRoutes(idByName.get(a)!, idByName.get(b)!, buses);
      expect(Date.now() - t0).toBeLessThan(1500);
      expect(res.length).toBeGreaterThan(0);
      expect(res.some((r) => r.totalTransfers === 0)).toBe(true);
    });
  }
});

describe('transfer searches', () => {
  for (const [a, b] of [['Shia Masjid', 'Tongi'], ['Dhaka EPZ', 'Motijheel'], ['Ghatar Char', 'Chandra'], ['Bosila', 'Tongi']]) {
    it(`${a} -> ${b} finds journeys`, () => {
      const from = idByName.get(a)!, to = idByName.get(b)!;
      const res = findRoutes(from, to, buses);
      expect(res.length).toBeGreaterThan(0);
      expect(hasDirectBus(from, to, buses) || res.some((r) => r.totalTransfers >= 1)).toBe(true);
    });
  }
});

describe('edge cases', () => {
  it('unreachable pair returns 0', () => {
    expect(findRoutes(idByName.get('Meghna Ghat')!, idByName.get('Nandan Park')!, buses)).toHaveLength(0);
  });
  it('same origin/destination -> []', () => {
    expect(findRoutes(idByName.get('Paltan')!, idByName.get('Paltan')!, buses)).toHaveLength(0);
  });
  it('unknown id -> []', () => {
    expect(findRoutes('nope', idByName.get('Paltan')!, buses)).toHaveLength(0);
  });
  it('empty buses -> []', () => {
    expect(findRoutes(idByName.get('Paltan')!, idByName.get('Shahbag')!, [])).toHaveLength(0);
  });
});

describe('direction awareness', () => {
  const synthetic: Bus[] = [{
    id: 'b1', nameEn: 'One Way', nameBn: 'One Way', isActive: true, starRating: 0,
    routes: [{ id: 'r1', busId: 'b1', direction: 'up', stops: ['A', 'B', 'C'].map((x, i) => ({ locationId: x, order: i + 1 })) }],
  }];
  it('up route: A->C found, C->A not', () => {
    expect(findRoutes('A', 'C', synthetic)).toHaveLength(1);
    expect(findRoutes('C', 'A', synthetic)).toHaveLength(0);
  });
  it('both route: C->A found', () => {
    synthetic[0].routes[0].direction = 'both';
    expect(findRoutes('C', 'A', synthetic)).toHaveLength(1);
  });
});

describe('star ranking', () => {
  const busOnly = buses.filter((b) => b.type !== 'Metro');
  const from = idByName.get('Mirpur 10')!, to = idByName.get('Motijheel')!;
  it('5-star direct bus becomes top result', () => {
    const base = findRoutes(from, to, busOnly);
    const bestDirect = base.filter((r) => r.totalTransfers === 0).sort((a, b) => a.totalStops - b.totalStops)[0];
    const starred = busOnly.map((b) => (b.id === bestDirect.segments[0].bus.id ? { ...b, starRating: 5 } : b));
    const after = findRoutes(from, to, starred);
    expect(after[0].segments[0].bus.id).toBe(bestDirect.segments[0].bus.id);
  });
  it('unrated search still returns results', () => {
    expect(findRoutes(from, to, busOnly.map((b) => ({ ...b, starRating: 0 }))).length).toBeGreaterThan(0);
  });
});

describe('MRT Line 6', () => {
  const metro = buses.find((b) => b.nameEn === 'MRT Line 6')!;
  it('has 16 stations, type Metro, 5 stars', () => {
    expect(metro.routes[0].stops).toHaveLength(16);
    expect(metro.type).toBe('Metro');
    expect(metro.starRating).toBe(5);
  });
  it('Uttara North -> Motijheel: metro top recommendation', () => {
    const res = findRoutes(idByName.get('Uttara North')!, idByName.get('Motijheel')!, buses);
    expect(res[0].segments[0].bus.nameEn).toBe('MRT Line 6');
    expect(res[0].totalTransfers).toBe(0);
  });
  it('Mirpur 10 -> Motijheel: metro ranks first', () => {
    const res = findRoutes(idByName.get('Mirpur 10')!, idByName.get('Motijheel')!, buses);
    expect(res[0].segments[0].bus.nameEn).toBe('MRT Line 6');
  });
  it('bus-only mode excludes metro', () => {
    const busOnly = buses.filter((b) => b.type !== 'Metro');
    const res = findRoutes(idByName.get('Uttara North')!, idByName.get('Motijheel')!, busOnly);
    expect(res.every((r) => r.segments.every((s) => s.bus.type !== 'Metro'))).toBe(true);
  });
  it('bus+metro combo found (Shia Masjid -> Dhaka University)', () => {
    const res = findRoutes(idByName.get('Shia Masjid')!, idByName.get('Dhaka University')!, buses);
    expect(res.some((r) => r.segments.some((s) => s.bus.type === 'Metro'))).toBe(true);
  });
});

describe('fuzzy matching', () => {
  it('exact and prefix', () => {
    expect(fuzzyMatch('shahbag', 'Shahbag')).toBe(100);
    expect(fuzzyMatch('gulshan', 'Gulshan 1')).toBeGreaterThanOrEqual(80);
  });
  it('typos and number words', () => {
    expect(fuzzyMatch('farmgat', 'Farmgate')).toBeGreaterThan(0);
    expect(fuzzyMatch('bonani', 'Banani')).toBeGreaterThan(0);
    expect(fuzzyMatch('uttara nort', 'Uttara North')).toBeGreaterThan(0);
    expect(fuzzyMatch('mirpur ten', 'Mirpur 10')).toBe(100);
    expect(fuzzyMatch('motijhil', 'Motijheel')).toBeGreaterThan(0);
  });
  it('no false positives', () => {
    expect(fuzzyMatch('xyzabc', 'Farmgate')).toBe(0);
    expect(fuzzyMatch('mirpur', 'Banani')).toBe(0);
    expect(editDistance('kitten', 'sitting')).toBe(3);
  });
});

describe('direct-bus completeness (no bus ever hidden)', () => {
  it('Mirpur 10 -> Kuril shows all 17 direct buses incl. Rajdhani Super', () => {
    const from = idByName.get('Mirpur 10')!, to = idByName.get('Kuril Bishwa Road')!;
    const res = findRoutes(from, to, buses);
    const shown = new Set(res.filter((r) => r.totalTransfers === 0).map((r) => r.segments[0].bus.id));
    const expected = buses.filter((b) => b.isActive && b.routes.some((r) => {
      const ids = r.stops.map((s) => s.locationId);
      return ids.includes(from) && ids.includes(to);
    }));
    expect(expected.length).toBeGreaterThanOrEqual(17);
    for (const b of expected) expect(shown.has(b.id), `missing ${b.nameEn}`).toBe(true);
  });

  it('sweep: every direct bus visible across all hub pairs', () => {
    const counts = new Map<string, number>();
    for (const b of buses) for (const r of b.routes) for (const s of new Set(r.stops.map((x) => x.locationId))) counts.set(s, (counts.get(s) || 0) + 1);
    const hubs = raw.locations.filter((l) => (counts.get(l.id) || 0) >= 20).map((l) => l.id);
    let pairs = 0;
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const a = hubs[i], b = hubs[j];
        const expected = buses.filter((bus) => bus.isActive && bus.routes.some((r) => {
          const ids = r.stops.map((s) => s.locationId);
          return ids.includes(a) && ids.includes(b);
        }));
        if (!expected.length) continue;
        const res = findRoutes(a, b, buses);
        const shown = new Set(res.filter((x) => x.totalTransfers === 0).map((x) => x.segments[0].bus.id));
        for (const bus of expected) {
          expect(shown.has(bus.id), `${name(a)} -> ${name(b)}: missing ${bus.nameEn}`).toBe(true);
        }
        pairs++;
      }
    }
    expect(pairs).toBeGreaterThan(2000);
  });
});

describe('transfer completeness (every bus combination shown)', () => {
  it('Mirpur 14 -> Kuril: Alif Bus 1 pairs with every Kuril bus', () => {
    const from = idByName.get('Mirpur 14')!, to = idByName.get('Kuril Bishwa Road')!;
    const m10 = idByName.get('Mirpur 10')!;
    const res = findRoutes(from, to, buses);
    const seqs = new Set(res.filter((r) => r.totalTransfers === 1).map((r) => r.segments.map((s) => s.bus.id).join('>')));
    const alif = buses.find((b) => b.nameEn === 'Alif Bus 1')!;
    const secondLegs = buses.filter((b) => b.isActive && b.routes.some((r) => {
      const ids = r.stops.map((s) => s.locationId);
      return ids.includes(m10) && ids.includes(to);
    }));
    for (const b of secondLegs) {
      if (b.id === alif.id) continue;
      expect(seqs.has(`${alif.id}>${b.id}`), `missing Alif + ${b.nameEn}`).toBe(true);
    }
  });

  it('sweep: all feasible 1-transfer pairings visible (250 transfer-only pairs)', () => {
    const serves = (bus: Bus, loc: string) => bus.routes.some((r) => r.stops.some((s) => s.locationId === loc));
    const stopSet = (bus: Bus) => new Set(bus.routes.flatMap((r) => r.stops.map((s) => s.locationId)));
    const active = buses.filter((b) => b.isActive);
    const locs = raw.locations.map((l) => l.id);
    let checked = 0;
    outer: for (let i = 0; i < locs.length; i++) {
      for (let j = i + 1; j < locs.length; j++) {
        const a = locs[i], b = locs[j];
        const firstBuses = active.filter((bus) => serves(bus, a));
        const lastBuses = active.filter((bus) => serves(bus, b));
        if (!firstBuses.length || !lastBuses.length || firstBuses.length > 8) continue;
        if (firstBuses.some((bus) => serves(bus, b))) continue;
        const expected: string[] = [];
        for (const f of firstBuses) {
          const fs = stopSet(f);
          for (const l of lastBuses) {
            if (l.id === f.id) continue;
            const ls = stopSet(l);
            let shared = false;
            for (const s of fs) if (s !== a && s !== b && ls.has(s)) { shared = true; break; }
            if (shared) expected.push(`${f.id}>${l.id}`);
          }
        }
        if (!expected.length) continue;
        const res = findRoutes(a, b, buses);
        const got = new Set(res.filter((x) => x.totalTransfers === 1).map((x) => x.segments.map((s) => s.bus.id).join('>')));
        for (const k of expected) {
          expect(got.has(k), `${name(a)} -> ${name(b)}: missing ${k.split('>').map((id) => buses.find((x) => x.id === id)?.nameEn).join(' + ')}`).toBe(true);
        }
        if (++checked >= 250) break outer;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });
});

describe('loop routes', () => {
  const loop: Bus[] = [{
    id: 'L', nameEn: 'Loop Bus', nameBn: 'Loop Bus', isActive: true, starRating: 0,
    routes: [{ id: 'lr', busId: 'L', direction: 'both', stops: ['A', 'B', 'C', 'B', 'D'].map((x, i) => ({ locationId: x, order: i + 1 })) }],
  }];
  it('uses the nearest occurrence pair', () => {
    expect(findRoutes('B', 'D', loop)[0].totalStops).toBe(1);
    expect(findRoutes('A', 'B', loop)[0].totalStops).toBe(1);
  });
});

describe('2-transfer fallback', () => {
  it('produces journeys for low-connectivity pairs', () => {
    const counts = new Map<string, number>();
    for (const b of buses) for (const r of b.routes) for (const s of new Set(r.stops.map((x) => x.locationId))) counts.set(s, (counts.get(s) || 0) + 1);
    const rare = raw.locations.filter((l) => (counts.get(l.id) || 0) <= 3).map((l) => l.id);
    const hubs = raw.locations.filter((l) => (counts.get(l.id) || 0) >= 30).map((l) => l.id);
    let twoFound = 0, searched = 0;
    for (let i = 0; i < rare.length && searched < 120; i++) {
      for (let j = 0; j < hubs.length && searched < 120; j += 3) {
        const res = findRoutes(rare[i], hubs[j], buses);
        searched++;
        if (res.some((r) => r.totalTransfers === 2)) twoFound++;
      }
    }
    expect(twoFound).toBeGreaterThan(0);
  });
});