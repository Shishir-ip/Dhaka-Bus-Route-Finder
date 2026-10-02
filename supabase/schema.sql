-- =====================================================
-- Dhaka Bus Finder — Database Schema for Supabase
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up
-- the database schema for the bus finder application.
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_bn TEXT,
  aliases TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BUSES TABLE
-- =====================================================
CREATE TABLE buses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_bn TEXT,
  type TEXT,
  operating_hours TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BUS ROUTES TABLE
-- Each bus can have multiple routes (e.g., different
-- directions or variants)
-- =====================================================
CREATE TABLE bus_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE NOT NULL,
  direction TEXT CHECK (direction IN ('up', 'down', 'both')) DEFAULT 'both',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROUTE STOPS TABLE
-- Ordered stops for each route
-- =====================================================
CREATE TABLE route_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  stop_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_locations_name_en ON locations(lower(name_en));
CREATE INDEX idx_locations_name_bn ON locations(name_bn);
CREATE INDEX idx_locations_active ON locations(is_active) WHERE is_active = true;

CREATE INDEX idx_buses_name_en ON buses(lower(name_en));
CREATE INDEX idx_buses_name_bn ON buses(name_bn);
CREATE INDEX idx_buses_active ON buses(is_active) WHERE is_active = true;

CREATE INDEX idx_bus_routes_bus_id ON bus_routes(bus_id);

CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_location_id ON route_stops(location_id);
CREATE INDEX idx_route_stops_order ON route_stops(route_id, stop_order);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (true);

CREATE POLICY "buses_public_read" ON buses
  FOR SELECT USING (is_active = true);

CREATE POLICY "bus_routes_public_read" ON bus_routes
  FOR SELECT USING (true);

CREATE POLICY "route_stops_public_read" ON route_stops
  FOR SELECT USING (true);

-- Admin write access (requires authenticated user)
-- In production, you may want to check for specific admin role
CREATE POLICY "locations_admin_write" ON locations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "buses_admin_write" ON buses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "bus_routes_admin_write" ON bus_routes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "route_stops_admin_write" ON route_stops
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- AUTO-UPDATE updated_at TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at
  BEFORE UPDATE ON buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERT (example locations)
-- =====================================================
-- Insert initial locations
INSERT INTO locations (name_en, name_bn, aliases) VALUES
  ('Gabtoli', 'গাবতলী', ARRAY['gabtoli', 'gabtali']),
  ('Technical', 'টেকনিক্যাল', ARRAY['technical', 'teknikal']),
  ('Mirpur 1', 'মিরপুর ১', ARRAY['mirpur 1', 'mirpur one', 'mp1']),
  ('Mirpur 2', 'মিরপুর ২', ARRAY['mirpur 2', 'mirpur two', 'mp2']),
  ('Mirpur 10', 'মিরপুর ১০', ARRAY['mirpur 10', 'mirpur ten', 'mp10']),
  ('Mirpur 11', 'মিরপুর ১১', ARRAY['mirpur 11', 'mirpur eleven', 'mp11']),
  ('Mirpur 12', 'মিরপুর ১২', ARRAY['mirpur 12', 'mirpur twelve', 'mp12']),
  ('Mirpur 14', 'মিরপুর ১৪', ARRAY['mirpur 14', 'mp14']),
  ('Purobi', 'পূরবী', ARRAY['purobi', 'purbabi']),
  ('Kalshi', 'কালশী', ARRAY['kalshi', 'kalsi']),
  ('ECB Square', 'ইসিবি স্কয়ার', ARRAY['ecb', 'ecb square', 'ecb chattar']),
  ('Airport', 'বিমানবন্দর', ARRAY['airport', 'biomanbodor', 'zia airport']),
  ('Kuril Bishwa Road', 'কুড়িল বিশ্ব রোড', ARRAY['kuril', 'kuril bishwa road', 'kuril bissho road']),
  ('Bashundhara', 'বসুন্ধরা', ARRAY['bashundhara', 'basundhara']),
  ('Badda', 'বাড্ডা', ARRAY['badda', 'badda link road']),
  ('Mohakhali', 'মোহাখালী', ARRAY['mohakhali', 'mohakhali doa']),
  ('Farmgate', 'ফার্মগেট', ARRAY['farmgate', 'farm gate']),
  ('Kawran Bazar', 'কারওয়ান বাজার', ARRAY['kawran bazar', 'kawran bazaar']),
  ('Shahbagh', 'শাহবাগ', ARRAY['shahbag', 'shahbagh']),
  ('Motijheel', 'মতিঝিল', ARRAY['motijheel', 'motijhil']),
  ('Gulistan', 'গুলিস্তান', ARRAY['gulistan']),
  ('Sayeedabad', 'সায়দাবাদ', ARRAY['sayeedabad', 'saidabad']),
  ('Jatrabari', 'যাত্রাবাড়ী', ARRAY['jatrabari', 'jatrbari']),
  ('Uttara', 'উত্তরা', ARRAY['uttara', 'uttara sector']),
  ('Dhanmondi', 'ধানমন্ডি', ARRAY['dhanmondi', 'dhanmondi 27']),
  ('Mohammadpur', 'মোহাম্মদপুর', ARRAY['mohammadpur', 'mohammadpur bus stand']),
  ('Gulshan 1', 'গুলশান ১', ARRAY['gulshan 1', 'gulshan one', 'gulshan']),
  ('Banani', 'বনানী', ARRAY['banani', 'banani 11']),
  ('Rampura', 'রামপুরা', ARRAY['rampura', 'rampura bridge']),
  ('Malibagh', 'মালিবাগ', ARRAY['malibagh']),
  ('Kamalapur', 'কমলাপুর', ARRAY['kamalapur', 'kamalapur station']),
  ('Shyamoli', 'শ্যামলী', ARRAY['shyamoli', 'shyamoli square']),
  ('Agargaon', 'আগারগাঁও', ARRAY['agargaon', 'agar gaon']),
  ('Tejgaon', 'তেজগাঁও', ARRAY['tejgaon', 'tejgaon industrial area']),
  ('Savar', 'সাভার', ARRAY['savar', 'savar bus stand']),
  ('Tongi', 'টঙ্গী', ARRAY['tongi', 'tongi station']),
  ('Gazipur', 'গাজীপুর', ARRAY['gazipur', 'gazipur chowrasta']),
  ('Narayanganj', 'নারায়ণগঞ্জ', ARRAY['narayanganj', 'narayanganj ghat']);

-- Note: Full bus data should be inserted via the admin dashboard
-- or through a data import script after the schema is set up.
