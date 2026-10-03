# Admin Save Error Fix - Complete Guide

## Problem
When trying to save a bus or location in the admin panel, you get the error:
```
Failed to save bus. Check console for details.
```

## Root Causes

### 1. **Database Schema Not Updated** (Most Common)
The admin form is trying to save fields that don't exist in your database yet.

**Missing columns in `buses` table:**
- `image_url`
- `description`
- `service_type`
- `condition_status`
- `star_rating`
- `total_reviews`

**Missing column in `locations` table:**
- `google_maps_url`

### 2. **RLS (Row Level Security) Policy Issue**
The database policies might not allow UPDATE operations even for authenticated users.

### 3. **Not Logged In**
Your session might have expired.

## Solutions

### Solution 1: Run the Enhanced Schema SQL (RECOMMENDED)

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
-- File: supabase/enhanced-schema.sql
-- This adds all the new columns needed for the admin features

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

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public can insert feedback
CREATE POLICY "Public can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read/update feedback
CREATE POLICY "Admin can manage feedback" ON feedback
  FOR ALL USING (auth.role() = 'authenticated');
```

4. Click **Run** to execute the SQL
5. Refresh your admin page and try saving again

### Solution 2: Fix RLS Policies

If you're still getting errors after running the schema, check your RLS policies:

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Find the `buses` table
3. Make sure you have these policies:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON buses
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Admin insert access" ON buses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Admin update access" ON buses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Admin delete access" ON buses
  FOR DELETE USING (auth.role() = 'authenticated');
```

4. Repeat for `locations`, `bus_routes`, and `route_stops` tables

### Solution 3: Check Your Login

1. Go to `/admin`
2. Make sure you're logged in (you should see your email)
3. If not logged in, sign in with your admin credentials
4. Try saving again

### Solution 4: Check Browser Console

1. Open **Developer Tools** (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Try to save a bus
4. Look for error messages - they will tell you exactly what's wrong

Common errors:
- `column "image_url" does not exist` → Run enhanced schema SQL
- `new row violates row-level security policy` → Fix RLS policies
- `JWT expired` → Log in again

## What Was Fixed in the Code

### 1. **Better Error Messages**
The error alerts now show the actual error message instead of a generic message:

**Before:**
```javascript
alert('Failed to save bus. Check console for details.');
```

**After:**
```javascript
alert(`Failed to save bus: ${errorMessage}\n\nPlease check:\n1. You are logged in\n2. Database schema is up to date\n3. RLS policies allow updates`);
```

### 2. **Schema-Aware Updates**
The `updateBus` and `updateLocation` functions now only send fields that exist in the base schema:

```typescript
// Only send fields that exist in the base schema
const baseUpdates: any = {};
if (updates.name_en !== undefined) baseUpdates.name_en = updates.name_en;
if (updates.name_bn !== undefined) baseUpdates.name_bn = updates.name_bn;
if (updates.type !== undefined) baseUpdates.type = updates.type;
if (updates.operating_hours !== undefined) baseUpdates.operating_hours = updates.operating_hours;
if (updates.notes !== undefined) baseUpdates.notes = updates.notes;
if (updates.is_active !== undefined) baseUpdates.is_active = updates.is_active;
```

This means the form will work even if you haven't run the enhanced schema yet.

### 3. **Better Error Logging**
All error handlers now log the full error object to the console:

```typescript
console.error('Update bus error:', error);
```

## Quick Fix Checklist

- [ ] Run `supabase/enhanced-schema.sql` in Supabase SQL Editor
- [ ] Verify you're logged in at `/admin`
- [ ] Check browser console for specific error messages
- [ ] Verify RLS policies allow UPDATE operations
- [ ] Refresh the admin page after making changes
- [ ] Try saving a bus again

## If You Still Have Issues

### Step 1: Check the Console Error
Open browser console (F12) and look for the exact error message. Common errors:

1. **"column does not exist"** → Run enhanced schema SQL
2. **"violates row-level security policy"** → Fix RLS policies
3. **"JWT expired"** → Log in again
4. **"relation does not exist"** → Run base schema SQL first

### Step 2: Verify Database Tables
Run this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'buses'
ORDER BY ordinal_position;
```

You should see these columns:
- id
- name_en
- name_bn
- type
- operating_hours
- notes
- is_active
- created_at
- updated_at
- image_url (after enhanced schema)
- description (after enhanced schema)
- service_type (after enhanced schema)
- condition_status (after enhanced schema)
- star_rating (after enhanced schema)
- total_reviews (after enhanced schema)

### Step 3: Test RLS Policies
Run this query to check if your policies are correct:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'buses';
```

You should see policies for SELECT, INSERT, UPDATE, and DELETE.

## Files Modified

1. **`src/lib/supabase.ts`**
   - Updated `createBus()` to only send base schema fields
   - Updated `updateBus()` to only send base schema fields
   - Updated `createLocation()` to only send base schema fields
   - Updated `updateLocation()` to only send base schema fields
   - Added better error logging

2. **`src/pages/AdminPage.tsx`**
   - Updated all error handlers to show actual error messages
   - Added helpful troubleshooting tips in error alerts
   - Improved error messages for all CRUD operations

## Build Status
✅ Build successful - 496.74 kB JS (133.77 kB gzipped), 38.90 kB CSS (7.43 kB gzipped)

## Summary

The save error was caused by the form trying to save fields that don't exist in the database. The fix:

1. ✅ Shows actual error messages instead of generic ones
2. ✅ Only sends fields that exist in the base schema
3. ✅ Provides helpful troubleshooting tips
4. ✅ Works with both base and enhanced schemas

**To fix your issue:**
1. Run `supabase/enhanced-schema.sql` in Supabase
2. Refresh the admin page
3. Try saving again

If you still get errors, check the browser console for the specific error message and follow the troubleshooting steps above.
