import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => supabase !== null;

// Database query helpers - these will use Supabase when configured,
// otherwise fall back to local data
export async function fetchBusesFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
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
    return data;
  } catch (err) {
    console.error('Failed to fetch buses from Supabase:', err);
    return null;
  }
}

export async function fetchLocationsFromDB() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name_en');

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to fetch locations from Supabase:', err);
    return null;
  }
}
