import type { Bus, Location } from '../types';

/** Great-circle distance in metres. */
export function haversineMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface NearbyHub {
  location: Location;
  meters: number;
  busCount: number;
}

/**
 * Nearest location that actually has bus service — used to rescue searches
 * that end at an unserved stop ("walk 400 m to Mirpur 10 instead").
 * Only locations with coordinates can participate.
 */
export function nearestServedHub(
  target: Location,
  locations: Location[],
  buses: Bus[],
  excludeIds: string[] = []
): NearbyHub | null {
  if (target.lat == null || target.lng == null) return null;
  const servedCount = new Map<string, number>();
  for (const bus of buses) {
    if (!bus.isActive) continue;
    const seen = new Set<string>();
    for (const r of bus.routes) for (const s of r.stops) seen.add(s.locationId);
    for (const id of seen) servedCount.set(id, (servedCount.get(id) || 0) + 1);
  }
  let best: NearbyHub | null = null;
  for (const loc of locations) {
    if (loc.id === target.id || excludeIds.includes(loc.id)) continue;
    if (loc.lat == null || loc.lng == null) continue;
    const count = servedCount.get(loc.id) || 0;
    if (count === 0) continue;
    const meters = haversineMeters(target.lat, target.lng, loc.lat, loc.lng);
    if (!best || meters < best.meters) best = { location: loc, meters, busCount: count };
  }
  return best;
}

export function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1)} km`;
}