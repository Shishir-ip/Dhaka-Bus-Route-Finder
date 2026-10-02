export interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  aliases: string[];
}

export interface BusRoute {
  id: string;
  busId: string;
  direction: 'up' | 'down' | 'both';
  stops: RouteStop[];
}

export interface RouteStop {
  locationId: string;
  order: number;
}

export interface Bus {
  id: string;
  nameEn: string;
  nameBn: string;
  type?: string;
  operatingHours?: string;
  routes: BusRoute[];
  isActive: boolean;
}

export interface JourneyResult {
  type: 'direct' | 'transfer';
  segments: JourneySegment[];
  totalTransfers: number;
  totalStops: number;
}

export interface JourneySegment {
  bus: Bus;
  route: BusRoute;
  boardStop: string;
  alightStop: string;
  stops: string[];
  stopCount: number;
}

export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';
