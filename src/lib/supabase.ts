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
  const { data, error } = await client.from('buses').insert(bus).select().single();
  if (error) throw error;
  return data;
}

export async function updateBus(id: string, updates: Partial<DBBus>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('buses').update(updates).eq('id', id).select().single();
  if (error) throw error;
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
  const { data, error } = await client.from('locations').insert(location).select().single();
  if (error) throw error;
  return data;
}

export async function updateLocation(id: string, updates: Partial<DBLocation>) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.from('locations').update(updates).eq('id', id).select().single();
  if (error) throw error;
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
