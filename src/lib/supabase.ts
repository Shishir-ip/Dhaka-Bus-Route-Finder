import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}

export const supabase = getSupabaseClient();

// ---------- Database row types ----------
export interface DBLocation {
  id: string;
  name_en: string;
  name_bn: string | null;
  aliases: string[] | null;
  google_maps_url: string | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface DBBusRoute {
  id: string;
  bus_id: string;
  direction: 'up' | 'down' | 'both';
  created_at: string;
  stops?: DBRouteStop[];
}

export interface DBRouteStop {
  id: string;
  route_id: string;
  location_id: string;
  stop_order: number;
  created_at: string;
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

// ---------- Error helper ----------
function dbError(error: { message: string; code?: string }, action: string): Error {
  let hint = '';
  if (error.code === 'PGRST204' || /column .* does not exist/i.test(error.message)) {
    hint = ' Your database schema is outdated — run the latest 01-supabase-schema.sql in the Supabase SQL Editor.';
  } else if (error.code === '42501' || /row-level security/i.test(error.message)) {
    hint = ' Row Level Security blocked this write. Make sure you are signed in with an admin account.';
  } else if (error.code === '23505') {
    hint = ' A record with this name already exists.';
  } else if (error.code === '23503') {
    hint = ' This record is still referenced by other data.';
  }
  return new Error(`${action}: ${error.message}${hint}`);
}

// ---------- Flat, paginated loading ----------
// Nested PostgREST embeds are silently capped (1000 rows by default), which
// truncated route stops for large datasets. We fetch each table flat with
// explicit pagination and assemble the graph on the client instead.
const PAGE_SIZE = 1000;

async function fetchAllRows<T>(table: string, orderCol: string): Promise<T[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const rows: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await client
      .from(table)
      .select('*')
      .order(orderCol)
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw dbError(error, `Failed to load ${table}`);
    if (data) rows.push(...(data as T[]));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

export interface GraphData {
  buses: DBBus[];
  locations: DBLocation[];
}

async function loadGraph(includeInactive: boolean): Promise<GraphData> {
  const [locations, buses, routes, stops] = await Promise.all([
    fetchAllRows<DBLocation>('locations', 'name_en'),
    fetchAllRows<DBBus>('buses', 'name_en'),
    fetchAllRows<DBBusRoute>('bus_routes', 'id'),
    fetchAllRows<DBRouteStop>('route_stops', 'id'),
  ]);

  const visibleLocations = includeInactive ? locations : locations.filter((l) => l.is_active);
  const visibleBuses = includeInactive ? buses : buses.filter((b) => b.is_active);
  const busIds = new Set(visibleBuses.map((b) => b.id));

  const stopsByRoute = new Map<string, DBRouteStop[]>();
  for (const s of stops) {
    const list = stopsByRoute.get(s.route_id);
    if (list) list.push(s);
    else stopsByRoute.set(s.route_id, [s]);
  }
  for (const list of stopsByRoute.values()) list.sort((a, b) => a.stop_order - b.stop_order);

  const routesByBus = new Map<string, DBBusRoute[]>();
  for (const r of routes) {
    if (!busIds.has(r.bus_id)) continue;
    r.stops = stopsByRoute.get(r.id) || [];
    const list = routesByBus.get(r.bus_id);
    if (list) list.push(r);
    else routesByBus.set(r.bus_id, [r]);
  }
  for (const b of visibleBuses) b.routes = routesByBus.get(b.id) || [];

  return { buses: visibleBuses, locations: visibleLocations };
}

export function fetchPublicData(): Promise<GraphData> {
  return loadGraph(false);
}

export function fetchAdminData(): Promise<GraphData> {
  return loadGraph(true);
}

export async function fetchStats() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const [busesRes, locationsRes, routesRes, stopsRes] = await Promise.all([
    client.from('buses').select('id', { count: 'exact', head: true }).eq('is_active', true),
    client.from('locations').select('id', { count: 'exact', head: true }).eq('is_active', true),
    client.from('bus_routes').select('id', { count: 'exact', head: true }),
    client.from('route_stops').select('id', { count: 'exact', head: true }),
  ]);
  const firstError = busesRes.error || locationsRes.error || routesRes.error || stopsRes.error;
  if (firstError) throw dbError(firstError, 'Failed to load stats');
  return {
    totalBuses: busesRes.count ?? 0,
    totalLocations: locationsRes.count ?? 0,
    totalRoutes: routesRes.count ?? 0,
    totalStops: stopsRes.count ?? 0,
  };
}

// ---------- Sanitizers (only real columns, correct types) ----------
const BUS_TEXT_FIELDS = ['name_en', 'name_bn', 'type', 'operating_hours', 'notes', 'image_url', 'description', 'service_type', 'condition_status'] as const;

function sanitizeBus(input: Partial<DBBus>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of BUS_TEXT_FIELDS) {
    const v = input[f];
    if (v === undefined) continue;
    const trimmed = typeof v === 'string' ? v.trim() : v;
    out[f] = trimmed === '' ? null : trimmed;
  }
  if (input.name_en !== undefined) out.name_en = String(input.name_en).trim(); // required, never null
  if (input.star_rating !== undefined) {
    const n = Number(input.star_rating);
    out.star_rating = Number.isFinite(n) ? Math.min(5, Math.max(0, Math.round(n * 10) / 10)) : 0;
  }
  if (input.total_reviews !== undefined) {
    const n = Number(input.total_reviews);
    out.total_reviews = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  }
  if (input.is_active !== undefined) out.is_active = Boolean(input.is_active);
  return out;
}

function sanitizeLocation(input: Partial<DBLocation>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.name_en !== undefined) out.name_en = String(input.name_en).trim();
  if (input.name_bn !== undefined) out.name_bn = input.name_bn?.trim() || null;
  if (input.aliases !== undefined) out.aliases = (input.aliases || []).map((a) => a.trim()).filter(Boolean);
  if (input.google_maps_url !== undefined) out.google_maps_url = input.google_maps_url?.trim() || null;
  if (input.lat !== undefined) out.lat = input.lat != null && Number.isFinite(Number(input.lat)) ? Number(input.lat) : null;
  if (input.lng !== undefined) out.lng = input.lng != null && Number.isFinite(Number(input.lng)) ? Number(input.lng) : null;
  if (input.is_active !== undefined) out.is_active = Boolean(input.is_active);
  return out;
}

// ---------- Bus CRUD ----------
export async function createBus(bus: Partial<DBBus>): Promise<DBBus> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('buses').insert(sanitizeBus(bus)).select().single();
  if (error) throw dbError(error, 'Failed to create bus');
  return data;
}

export async function updateBus(id: string, updates: Partial<DBBus>): Promise<DBBus> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const payload = sanitizeBus(updates);
  if (Object.keys(payload).length === 0) throw new Error('Nothing to update');
  const { data, error } = await client.from('buses').update(payload).eq('id', id).select().single();
  if (error) throw dbError(error, 'Failed to save bus');
  return data;
}

export async function deleteBus(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('buses').delete().eq('id', id);
  if (error) throw dbError(error, 'Failed to delete bus');
}

// ---------- Location CRUD ----------
export async function createLocation(location: Partial<DBLocation>): Promise<DBLocation> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('locations').insert(sanitizeLocation(location)).select().single();
  if (error) throw dbError(error, 'Failed to create location');
  return data;
}

export async function updateLocation(id: string, updates: Partial<DBLocation>): Promise<DBLocation> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('locations').update(sanitizeLocation(updates)).eq('id', id).select().single();
  if (error) throw dbError(error, 'Failed to save location');
  return data;
}

export async function deleteLocation(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('locations').delete().eq('id', id);
  if (error) throw dbError(error, 'Failed to delete location');
}

// ---------- Route / stop CRUD ----------
export async function createRoute(busId: string, direction: 'up' | 'down' | 'both'): Promise<DBBusRoute> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('bus_routes').insert({ bus_id: busId, direction }).select().single();
  if (error) throw dbError(error, 'Failed to create route');
  return data;
}

export async function deleteRoute(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('bus_routes').delete().eq('id', id);
  if (error) throw dbError(error, 'Failed to delete route');
}

export async function addRouteStop(routeId: string, locationId: string, order: number): Promise<DBRouteStop> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client
    .from('route_stops')
    .insert({ route_id: routeId, location_id: locationId, stop_order: order })
    .select()
    .single();
  if (error) throw dbError(error, 'Failed to add stop');
  return data;
}

export async function deleteRouteStop(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('route_stops').delete().eq('id', id);
  if (error) throw dbError(error, 'Failed to delete stop');
}

export async function updateRouteStopOrder(stops: { id: string; order: number }[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const results = await Promise.all(
    stops.map((s) => client.from('route_stops').update({ stop_order: s.order }).eq('id', s.id))
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw dbError(failed.error, 'Failed to reorder stops');
}

// ---------- App settings (admin-only table) ----------
export async function getAppSetting(key: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('app_settings').select('value').eq('key', key).maybeSingle();
  if (error) throw dbError(error, 'Failed to read setting');
  return data?.value ?? null;
}

export async function setAppSetting(key: string, value: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('app_settings').upsert({ key, value });
  if (error) throw dbError(error, 'Failed to save setting');
}

/**
 * Fire the Vercel deploy hook (if the admin saved one) so pre-rendered SEO
 * pages rebuild automatically after data edits. Returns true when triggered.
 */
export async function triggerSeoRebuild(): Promise<boolean> {
  let hook: string | null = null;
  try {
    hook = await getAppSetting('vercel_deploy_hook');
  } catch {
    return false; // table missing (04 SQL not run yet) — stay silent
  }
  if (!hook || !/^https:\/\/api\.vercel\.com\//.test(hook)) return false;
  try {
    await fetch(hook, { method: 'POST', mode: 'no-cors' });
    return true;
  } catch {
    return false;
  }
}

// ---------- Feedback ----------
export async function submitFeedback(feedback: { name?: string; email?: string; subject: string; message: string }): Promise<DBFeedback> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('feedback').insert(feedback).select().single();
  if (error) throw dbError(error, 'Failed to submit feedback');
  return data;
}

export async function fetchFeedback(): Promise<DBFeedback[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) throw dbError(error, 'Failed to load feedback');
  return data || [];
}

export async function updateFeedbackStatus(id: string, status: DBFeedback['status']): Promise<DBFeedback> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { data, error } = await client.from('feedback').update({ status }).eq('id', id).select().single();
  if (error) throw dbError(error, 'Failed to update feedback');
  return data;
}

export async function deleteFeedback(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured');
  const { error } = await client.from('feedback').delete().eq('id', id);
  if (error) throw dbError(error, 'Failed to delete feedback');
}