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
  is_active: boolean;
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
