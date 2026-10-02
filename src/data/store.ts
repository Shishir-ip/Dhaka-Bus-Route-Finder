import { buses } from './buses';
import { locations } from './locations';
import { Bus, Location } from '../types';

export { buses, locations };

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(l => l.id === id);
};

export const getBusById = (id: string): Bus | undefined => {
  return buses.find(b => b.id === id);
};

export const searchLocations = (query: string, lang: 'en' | 'bn' = 'en'): Location[] => {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return locations.filter(loc => {
    const name = lang === 'bn' ? loc.nameBn : loc.nameEn;
    const altName = lang === 'bn' ? loc.nameEn : loc.nameBn;
    if (name.toLowerCase().includes(q)) return true;
    if (altName.toLowerCase().includes(q)) return true;
    if (loc.aliases.some(a => a.toLowerCase().includes(q))) return true;
    return false;
  });
};

export const searchBuses = (query: string, lang: 'en' | 'bn' = 'en'): Bus[] => {
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
};

export const getLocationsForBus = (bus: Bus): Location[] => {
  const locationIds = new Set<string>();
  bus.routes.forEach(route => {
    route.stops.forEach(stop => locationIds.add(stop.locationId));
  });
  return Array.from(locationIds)
    .map(id => getLocationById(id))
    .filter((l): l is Location => l !== undefined);
};

export const getBusesForLocation = (locationId: string): Bus[] => {
  return buses.filter(bus => {
    if (!bus.isActive) return false;
    return bus.routes.some(route =>
      route.stops.some(stop => stop.locationId === locationId)
    );
  });
};

export const getBusRouteSlug = (bus: Bus): string => {
  return bus.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

export const getLocationSlug = (location: Location): string => {
  return location.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

export const getBusBySlug = (slug: string): Bus | undefined => {
  return buses.find(b => getBusRouteSlug(b) === slug);
};

export const getLocationBySlug = (slug: string): Location | undefined => {
  return locations.find(l => getLocationSlug(l) === slug);
};
