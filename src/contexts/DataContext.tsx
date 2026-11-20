import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  getSupabaseConfigStatus,
  fetchPublicData,
  DBBus,
  DBLocation,
  DBBusRoute,
  DBRouteStop,
} from '../lib/supabase';
import type { Bus, Location } from '../types';

function convertLocation(db: DBLocation): Location {
  return {
    id: db.id,
    nameEn: db.name_en,
    nameBn: db.name_bn || db.name_en,
    aliases: db.aliases || [],
    googleMapsUrl: db.google_maps_url || undefined,
  };
}

function convertBus(db: DBBus): Bus {
  return {
    id: db.id,
    nameEn: db.name_en,
    nameBn: db.name_bn || db.name_en,
    type: db.type || undefined,
    operatingHours: db.operating_hours || undefined,
    notes: db.notes || undefined,
    imageUrl: db.image_url || undefined,
    description: db.description || undefined,
    serviceType: db.service_type || undefined,
    conditionStatus: db.condition_status || undefined,
    starRating: db.star_rating != null ? Number(db.star_rating) : undefined,
    totalReviews: db.total_reviews != null ? Number(db.total_reviews) : undefined,
    isActive: db.is_active,
    routes: (db.routes || []).map((route: DBBusRoute) => ({
      id: route.id,
      busId: route.bus_id,
      direction: route.direction,
      stops: [...(route.stops || [])]
        .sort((a: DBRouteStop, b: DBRouteStop) => a.stop_order - b.stop_order)
        .map((stop: DBRouteStop) => ({ locationId: stop.location_id, order: stop.stop_order })),
    })),
  };
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface DataContextType {
  buses: Bus[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  configError: string | null;
  refetch: () => Promise<void>;
  getLocationById: (id: string) => Location | undefined;
  getBusById: (id: string) => Bus | undefined;
  searchLocations: (query: string, lang: 'en' | 'bn') => Location[];
  getBusBySlug: (slug: string) => Bus | undefined;
  getLocationBySlug: (slug: string) => Location | undefined;
  getBusRouteSlug: (bus: Bus) => string;
  getLocationSlug: (location: Location) => string;
  getBusesForLocation: (locationId: string) => Bus[];
  getLocationsForBus: (bus: Bus) => Location[];
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const status = getSupabaseConfigStatus();
    if (status !== 'configured') {
      const messages: Record<string, string> = {
        missing_both: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        missing_url: 'Supabase URL is missing. Set VITE_SUPABASE_URL.',
        missing_key: 'Supabase anon key is missing. Set VITE_SUPABASE_ANON_KEY.',
      };
      setConfigError(messages[status] || 'Supabase configuration error.');
      setLoading(false);
      return;
    }
    setConfigError(null);
    try {
      const { buses: dbBuses, locations: dbLocations } = await fetchPublicData();
      setBuses(dbBuses.map(convertBus));
      setLocations(dbLocations.map(convertLocation));
    } catch (err) {
      console.error('Failed to fetch data from Supabase:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data from the database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------- Indexes (built once per data change) ----------
  const locationById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);
  const busById = useMemo(() => new Map(buses.map((b) => [b.id, b])), [buses]);

  const busesByLocation = useMemo(() => {
    const map = new Map<string, Bus[]>();
    for (const bus of buses) {
      if (!bus.isActive) continue;
      const served = new Set<string>();
      for (const route of bus.routes) for (const stop of route.stops) served.add(stop.locationId);
      for (const id of served) {
        const list = map.get(id);
        if (list) list.push(bus);
        else map.set(id, [bus]);
      }
    }
    return map;
  }, [buses]);

  // Unique slugs (duplicate names get a numeric suffix)
  const { busSlugById, busBySlug, locationSlugById, locationBySlug } = useMemo(() => {
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
  }, [buses, locations]);

  const getLocationById = useCallback((id: string) => locationById.get(id), [locationById]);
  const getBusById = useCallback((id: string) => busById.get(id), [busById]);
  const getBusBySlug = useCallback((slug: string) => busBySlug.get(slug), [busBySlug]);
  const getLocationBySlug = useCallback((slug: string) => locationBySlug.get(slug), [locationBySlug]);
  const getBusRouteSlug = useCallback((bus: Bus) => busSlugById.get(bus.id) || slugify(bus.nameEn), [busSlugById]);
  const getLocationSlug = useCallback((loc: Location) => locationSlugById.get(loc.id) || slugify(loc.nameEn), [locationSlugById]);
  const getBusesForLocation = useCallback((locationId: string) => busesByLocation.get(locationId) || [], [busesByLocation]);

  const getLocationsForBus = useCallback(
    (bus: Bus) => {
      const ids = new Set<string>();
      for (const route of bus.routes) for (const stop of route.stops) ids.add(stop.locationId);
      return [...ids].map((id) => locationById.get(id)).filter((l): l is Location => Boolean(l));
    },
    [locationById]
  );

  const searchLocations = useCallback(
    (query: string, lang: 'en' | 'bn'): Location[] => {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      const scored: { loc: Location; score: number }[] = [];
      for (const loc of locations) {
        const primary = (lang === 'bn' ? loc.nameBn : loc.nameEn).toLowerCase();
        const secondary = (lang === 'bn' ? loc.nameEn : loc.nameBn).toLowerCase();
        let score = 0;
        if (primary === q) score = 100;
        else if (primary.startsWith(q)) score = 80;
        else if (primary.includes(q)) score = 60;
        else if (secondary.startsWith(q)) score = 50;
        else if (secondary.includes(q)) score = 40;
        else if (loc.aliases.some((a) => a.toLowerCase().includes(q))) score = 30;
        if (score > 0) scored.push({ loc, score });
      }
      scored.sort((a, b) => b.score - a.score || a.loc.nameEn.localeCompare(b.loc.nameEn));
      return scored.slice(0, 8).map((s) => s.loc);
    },
    [locations]
  );

  const value: DataContextType = {
    buses,
    locations,
    loading,
    error,
    configError,
    refetch: fetchData,
    getLocationById,
    getBusById,
    searchLocations,
    getBusBySlug,
    getLocationBySlug,
    getBusRouteSlug,
    getLocationSlug,
    getBusesForLocation,
    getLocationsForBus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}