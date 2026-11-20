import type { Bus, Location } from '../types';

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export interface SlugMaps {
  busSlugById: Map<string, string>;
  busBySlug: Map<string, Bus>;
  locationSlugById: Map<string, string>;
  locationBySlug: Map<string, Location>;
}

/** Unique slugs: duplicate base names get a numeric suffix. */
export function buildSlugMaps(buses: Bus[], locations: Location[]): SlugMaps {
  const busSlugById = new Map<string, string>();
  const busBySlug = new Map<string, Bus>();
  const usedBus = new Map<string, number>();
  for (const bus of buses) {
    const base = slugify(bus.nameEn) || bus.id;
    const n = usedBus.get(base) || 0;
    usedBus.set(base, n + 1);
    const slug = n === 0 ? base : `${base}-${n + 1}`;
    busSlugById.set(bus.id, slug);
    busBySlug.set(slug, bus);
  }
  const locationSlugById = new Map<string, string>();
  const locationBySlug = new Map<string, Location>();
  const usedLoc = new Map<string, number>();
  for (const loc of locations) {
    const base = slugify(loc.nameEn) || loc.id;
    const n = usedLoc.get(base) || 0;
    usedLoc.set(base, n + 1);
    const slug = n === 0 ? base : `${base}-${n + 1}`;
    locationSlugById.set(loc.id, slug);
    locationBySlug.set(slug, loc);
  }
  return { busSlugById, busBySlug, locationSlugById, locationBySlug };
}