import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type SupabaseConfigStatus = 'configured' | 'missing_url' | 'missing_key' | 'missing_both';

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  if (!supabaseUrl && !supabaseAnonKey) return 'missing_both';
  if (!supabaseUrl) return 'missing_url';
  if (!supabaseAnonKey) return 'missing_key';
  return 'configured';
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfigStatus() === 'configured';
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!_client) {
    _client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return _client;
}

// Convenience export
export const supabase = getSupabaseClient();

// Database types matching the schema
export interface DBLocation {
  id: string;
  name_en: string;
  name_bn: string | null;
  aliases: string[] | null;
  google_maps_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBFeedback {
  id: string;
  name: string | null;
  email: string | null;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export interface DBRouteStop {
  id: string;
  route_id: string;
  location_id: string;
  stop_order: number;
  created_at: string;
  location?: DBLocation;
}

export interface DBBusRoute {
  id: string;
  bus_id: string;
  direction: 'up' | 'down' | 'both';
  created_at: string;
  stops?: DBRouteStop[];
}

export interface DBBus {
  id: string;
  name_en: string;
  name_bn: string | null;
  type: string | null;
  operating_hours: string | null;
  notes: string | null;
  image_url: string | null;
  description: string | null;
  service_type: string | null;
  condition_status: string | null;
  star_rating: number | null;
  total_reviews: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  routes?: DBBusRoute[];
}

// Query helpers
export async function fetchAllBuses(): Promise<DBBus[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('buses')
    .select(`
      *,
      routes:bus_routes(
        *,
        stops:route_stops(
          *,
          location:locations(*)
        )
      )
    `)
    .eq('is_active', true)
    .order('name_en');

  if (error) throw error;
  return data || [];
}

export async function fetchAllLocations(): Promise<DBLocation[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('name_en');

  if (error) throw error;
  return data || [];
}

export async function fetchAllBusesAdmin(): Promise<DBBus[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('buses')
    .select(`
      *,
      routes:bus_routes(
        *,
        stops:route_stops(
          *,
          location:locations(*)
        )
      )
    `)
    .order('name_en');

  if (error) throw error;
  return data || [];
}

export async function fetchAllLocationsAdmin(): Promise<DBLocation[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('locations')
    .select('*')
    .order('name_en');

  if (error) throw error;
  return data || [];
}

export async function fetchStats() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const [busesRes, locationsRes, routesRes, stopsRes] = await Promise.all([
    client.from('buses').select('id', { count: 'exact', head: true }).eq('is_active', true),
    client.from('locations').select('id', { count: 'exact', head: true }).eq('is_active', true),
    client.from('bus_routes').select('id', { count: 'exact', head: true }),
    client.from('route_stops').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalBuses: busesRes.count ?? 0,
    totalLocations: locationsRes.count ?? 0,
    totalRoutes: routesRes.count ?? 0,
    totalStops: stopsRes.count ?? 0,
  };
}

// CRUD Operations for Buses
export async function createBus(bus: Partial<DBBus>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  
  // Only send fields that are defined
  const cleanData: any = {};
  if (bus.name_en !== undefined) cleanData.name_en = bus.name_en;
  if (bus.name_bn !== undefined) cleanData.name_bn = bus.name_bn;
  if (bus.type !== undefined) cleanData.type = bus.type;
  if (bus.operating_hours !== undefined) cleanData.operating_hours = bus.operating_hours;
  if (bus.notes !== undefined) cleanData.notes = bus.notes;
  if (bus.is_active !== undefined) cleanData.is_active = bus.is_active;
  if (bus.image_url !== undefined) cleanData.image_url = bus.image_url;
  if (bus.description !== undefined) cleanData.description = bus.description;
  if (bus.service_type !== undefined) cleanData.service_type = bus.service_type;
  if (bus.condition_status !== undefined) cleanData.condition_status = bus.condition_status;
  if (bus.star_rating !== undefined) cleanData.star_rating = bus.star_rating;
  if (bus.total_reviews !== undefined) cleanData.total_reviews = bus.total_reviews;
  
  const { data, error } = await client.from('buses').insert(cleanData).select().single();
  if (error) {
    console.error('Create bus error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function updateBus(id: string, updates: Partial<DBBus>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  
  // Only send fields that are defined (not undefined)
  const cleanUpdates: any = {};
  if (updates.name_en !== undefined) cleanUpdates.name_en = updates.name_en;
  if (updates.name_bn !== undefined) cleanUpdates.name_bn = updates.name_bn;
  if (updates.type !== undefined) cleanUpdates.type = updates.type;
  if (updates.operating_hours !== undefined) cleanUpdates.operating_hours = updates.operating_hours;
  if (updates.notes !== undefined) cleanUpdates.notes = updates.notes;
  if (updates.is_active !== undefined) cleanUpdates.is_active = updates.is_active;
  if (updates.image_url !== undefined) cleanUpdates.image_url = updates.image_url;
  if (updates.description !== undefined) cleanUpdates.description = updates.description;
  if (updates.service_type !== undefined) cleanUpdates.service_type = updates.service_type;
  if (updates.condition_status !== undefined) cleanUpdates.condition_status = updates.condition_status;
  if (updates.star_rating !== undefined) cleanUpdates.star_rating = updates.star_rating;
  if (updates.total_reviews !== undefined) cleanUpdates.total_reviews = updates.total_reviews;
  
  const { data, error } = await client.from('buses').update(cleanUpdates).eq('id', id).select().single();
  if (error) {
    console.error('Update bus error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteBus(id: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client.from('buses').delete().eq('id', id);
  if (error) throw error;
}

// CRUD Operations for Locations
export async function createLocation(location: Partial<DBLocation>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  
  // Only send fields that are defined
  const cleanData: any = {};
  if (location.name_en !== undefined) cleanData.name_en = location.name_en;
  if (location.name_bn !== undefined) cleanData.name_bn = location.name_bn;
  if (location.aliases !== undefined) cleanData.aliases = location.aliases;
  if (location.is_active !== undefined) cleanData.is_active = location.is_active;
  if (location.google_maps_url !== undefined) cleanData.google_maps_url = location.google_maps_url;
  
  const { data, error } = await client.from('locations').insert(cleanData).select().single();
  if (error) {
    console.error('Create location error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function updateLocation(id: string, updates: Partial<DBLocation>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  
  // Only send fields that are defined
  const cleanUpdates: any = {};
  if (updates.name_en !== undefined) cleanUpdates.name_en = updates.name_en;
  if (updates.name_bn !== undefined) cleanUpdates.name_bn = updates.name_bn;
  if (updates.aliases !== undefined) cleanUpdates.aliases = updates.aliases;
  if (updates.is_active !== undefined) cleanUpdates.is_active = updates.is_active;
  if (updates.google_maps_url !== undefined) cleanUpdates.google_maps_url = updates.google_maps_url;
  
  const { data, error } = await client.from('locations').update(cleanUpdates).eq('id', id).select().single();
  if (error) {
    console.error('Update location error:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteLocation(id: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client.from('locations').delete().eq('id', id);
  if (error) throw error;
}

// CRUD Operations for Routes
export async function createRoute(route: Partial<DBBusRoute>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('bus_routes').insert(route).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRoute(id: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client.from('bus_routes').delete().eq('id', id);
  if (error) throw error;
}

// CRUD Operations for Route Stops
export async function addRouteStop(stop: Partial<DBRouteStop>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('route_stops').insert(stop).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRouteStop(id: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client.from('route_stops').delete().eq('id', id);
  if (error) throw error;
}

export async function updateRouteStopOrder(routeId: string, stops: { id: string; order: number }[]) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  
  const promises = stops.map(stop =>
    client.from('route_stops').update({ stop_order: stop.order }).eq('id', stop.id)
  );
  
  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error);
  if (errors.length > 0) throw new Error('Failed to update stop order');
}

// Feedback Operations
export async function submitFeedback(feedback: { name?: string; email?: string; subject: string; message: string }) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('feedback').insert(feedback).select().single();
  if (error) throw error;
  return data;
}

export async function fetchFeedback() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateFeedbackStatus(id: string, status: 'new' | 'reviewed' | 'resolved' | 'dismissed') {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('feedback').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteFeedback(id: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client.from('feedback').delete().eq('id', id);
  if (error) throw error;
}
