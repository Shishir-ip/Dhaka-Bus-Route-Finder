-- =====================================================
-- Add Additional Bus Fields
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add
-- the additional fields needed for the admin interface
-- =====================================================

-- Add new columns to buses table
ALTER TABLE buses ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'Regular';
ALTER TABLE buses ADD COLUMN IF NOT EXISTS condition_status TEXT DEFAULT 'Good';
ALTER TABLE buses ADD COLUMN IF NOT EXISTS star_rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add google_maps_url to locations table
ALTER TABLE locations ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Create feedback table if it doesn't exist
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

-- Enable RLS for feedback table
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public can insert feedback
CREATE POLICY "feedback_public_insert" ON feedback
  FOR INSERT WITH CHECK (true);

-- Public can read feedback (for admin to view)
CREATE POLICY "feedback_public_read" ON feedback
  FOR SELECT USING (true);

-- Authenticated users can update feedback
CREATE POLICY "feedback_auth_update" ON feedback
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete feedback
CREATE POLICY "feedback_auth_delete" ON feedback
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
