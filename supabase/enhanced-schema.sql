-- =====================================================
-- Dhaka Bus Finder — ENHANCED SCHEMA
-- Run this to add new fields for admin features
-- =====================================================

-- Add new columns to buses table
ALTER TABLE buses ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS condition_status TEXT DEFAULT 'Good';
ALTER TABLE buses ADD COLUMN IF NOT EXISTS star_rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add google_maps_url to locations
ALTER TABLE locations ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public can insert feedback
CREATE POLICY "Public can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read/update feedback
CREATE POLICY "Admin can manage feedback" ON feedback
  FOR ALL USING (auth.role() = 'authenticated');

-- Update existing policies for new columns
-- (No changes needed - existing policies cover all columns)
