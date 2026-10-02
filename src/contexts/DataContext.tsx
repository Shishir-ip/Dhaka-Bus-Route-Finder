import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  getSupabaseConfigStatus,
  fetchAllBuses,
  fetchAllLocations,
  DBBus,
  DBLocation,
  DBBusRoute,
  DBRouteStop,
} from '../lib/supabase';
import { Bus, Location, BusRoute, RouteStop } from '../types';

// Convert DB types to app types
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
    starRating: db.star_rating || undefined,
    totalReviews: db.total_reviews || undefined,
    isActive: db.is_active,
    routes: (db.routes || []).map((route: DBBusRoute) => ({
      id: route.id,
      busId: route.bus_id,
      direction: route.direction,
      stops: (route.stops || [])
        .sort((a: DBRouteStop, b: DBRouteStop) => a.stop_order - b.stop_order)
        .map((stop: DBRouteStop) => ({
          locationId: stop.location_id,
          order: stop.stop_order,
        })),
    })),
  };
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
  searchBuses: (query: string, lang: 'en' | 'bn') => Bus[];
  getBusBySlug: (slug: string) => Bus | undefined;
  getLocationBySlug: (slug: string) => Location | undefined;
  getBusRouteSlug: (bus: Bus) => string;
  getLocationSlug: (location: Location) => string;
  getLocationsForBus: (bus: Bus) => Location[];
  getBusesForLocation: (locationId: string) => Bus[];
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

    // Check configuration first
    const status = getSupabaseConfigStatus();
    if (status !== 'configured') {
      const messages: Record<string, string> = {
        missing_both: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
        missing_url: 'Supabase URL not configured. Please set VITE_SUPABASE_URL environment variable.',
        missing_key: 'Supabase anon key not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.',
      };
      setConfigError(messages[status] || 'Supabase configuration error.');
      setLoading(false);
      return;
    }

    setConfigError(null);

    try {
      const [dbBuses, dbLocations] = await Promise.all([
        fetchAllBuses(),
        fetchAllLocations(),
      ]);

      setBuses(dbBuses.map(convertBus));
      setLocations(dbLocations.map(convertLocation));
    } catch (err: any) {
      console.error('Failed to fetch data from Supabase:', err);
      setError(err.message || 'Failed to load data from database. Please check your Supabase configuration and RLS policies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper functions
  const getLocationById = useCallback((id: string) => {
    return locations.find(l => l.id === id);
  }, [locations]);

  const getBusById = useCallback((id: string) => {
    return buses.find(b => b.id === id);
  }, [buses]);

  const searchLocations = useCallback((query: string, lang: 'en' | 'bn') => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return locations.filter(loc => {
      const name = lang === 'bn' ? loc.nameBn : loc.nameEn;
      const altName = lang === 'bn' ? loc.nameEn : loc.nameBn;
      if (name.toLowerCase().includes(q)) return true;
      if (altName.toLowerCase().includes(q)) return true;
      if (loc.aliases.some(a => a.toLowerCase().includes(q))) return true;
      return false;
    }).slice(0, 10);
  }, [locations]);

  const searchBuses = useCallback((query: string, lang: 'en' | 'bn') => {
    if (!query.trim()) return buses.filter(b => b.isActive);
    const q = query.toLowerCase().trim();
    return buses.filter(bus => {
      if (!bus.isActive) return false;
      const name = lang === 'bn' ? bus.nameBn : bus.nameEn;
      const altName = lang === 'bn' ? bus.nameEn : bus.nameBn;
      if (name.toLowerCase().includes(q)) return true;
      if (altName.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [buses]);

  const getBusRouteSlug = useCallback((bus: Bus) => {
    return bus.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }, []);

  const getLocationSlug = useCallback((location: Location) => {
    return location.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }, []);

  const getBusBySlug = useCallback((slug: string) => {
    return buses.find(b => getBusRouteSlug(b) === slug);
  }, [buses, getBusRouteSlug]);

  const getLocationBySlug = useCallback((slug: string) => {
    return locations.find(l => getLocationSlug(l) === slug);
  }, [locations, getLocationSlug]);

  const getLocationsForBus = useCallback((bus: Bus) => {
    const locationIds = new Set<string>();
    bus.routes.forEach(route => {
      route.stops.forEach(stop => locationIds.add(stop.locationId));
    });
    return Array.from(locationIds)
      .map(id => getLocationById(id))
      .filter((l): l is Location => l !== undefined);
  }, [getLocationById]);

  const getBusesForLocation = useCallback((locationId: string) => {
    return buses.filter(bus => {
      if (!bus.isActive) return false;
      return bus.routes.some(route =>
        route.stops.some(stop => stop.locationId === locationId)
      );
    });
  }, [buses]);

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
    searchBuses,
    getBusBySlug,
    getLocationBySlug,
    getBusRouteSlug,
    getLocationSlug,
    getLocationsForBus,
    getBusesForLocation,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
