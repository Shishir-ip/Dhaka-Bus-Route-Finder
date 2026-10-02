# Dhaka Bus Finder

A modern, production-ready web application for finding and exploring local buses and bus routes in Dhaka, Bangladesh.

## Features

- 🔍 **Smart Route Search** — Find buses between any two locations
- 🔄 **Transfer Detection** — Automatically suggests transfer routes when no direct bus exists
- 🗺️ **Visual Route Timeline** — Beautiful interactive route visualization
- 🌐 **Bilingual** — Full English and বাংলা (Bangla) support
- 🌓 **Dark/Light Mode** — System-aware with manual toggle
- 📱 **Mobile-First** — Optimized for phones, tablets, and desktops
- ⚡ **Fast** — Optimized for performance on mid-range devices
- 🔐 **Admin Dashboard** — Manage buses, routes, and locations

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS 4** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Supabase** for backend (database + auth)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works)

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/dhaka-bus-finder.git
cd dhaka-bus-finder

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
```

## Deployment (Vercel)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### Step 2: Set Up Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Locations table
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_bn TEXT,
  aliases TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buses table
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

-- Bus routes table
CREATE TABLE bus_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('up', 'down', 'both')) DEFAULT 'both',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route stops table
CREATE TABLE route_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id),
  stop_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_locations_name_en ON locations(name_en);
CREATE INDEX idx_locations_name_bn ON locations(name_bn);
CREATE INDEX idx_buses_name_en ON buses(name_en);
CREATE INDEX idx_buses_name_bn ON buses(name_bn);
CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_location_id ON route_stops(location_id);
CREATE INDEX idx_bus_routes_bus_id ON bus_routes(bus_id);

-- Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON buses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON bus_routes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON route_stops FOR SELECT USING (true);

-- Admin write access (requires authenticated user)
CREATE POLICY "Admin write access" ON locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON buses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON bus_routes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON route_stops FOR ALL USING (auth.role() = 'authenticated');
```

### Step 3: Import Initial Data

Use the Supabase dashboard or SQL to insert the initial bus and location data. The application includes a local dataset that serves as a fallback.

### Step 4: Set Environment Variables in Vercel

Go to your Vercel project settings > Environment Variables and add:

| Variable | Value | Where to find it |
|----------|-------|-----------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Your anon/public key | Supabase Dashboard > Settings > API |

**⚠️ NEVER add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables as it has full database access.**

### Step 5: Create Admin User

In Supabase Dashboard > Authentication > Users, create a new user with:
- Email: admin@yourdomain.com
- Password: (strong password)

### Step 6: Connect GitHub to Vercel

1. Push your code to GitHub
2. In Vercel, import the repository
3. Vercel will auto-detect the Vite configuration
4. Deploy

### Step 7: Managing Data After Deployment

After deployment, the admin can:
1. Go to `/admin` on the website
2. Log in with Supabase credentials
3. Add/edit/delete buses and routes
4. Manage locations
5. All changes are reflected immediately

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-side only, never expose to client |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── LocationAutocomplete.tsx
│   ├── RouteTimeline.tsx
│   └── JourneyCard.tsx
├── contexts/         # React contexts
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── data/             # Data layer
│   ├── buses.ts
│   ├── locations.ts
│   └── store.ts
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── BusesPage.tsx
│   ├── BusDetailPage.tsx
│   ├── LocationsPage.tsx
│   ├── LocationDetailPage.tsx
│   ├── AboutPage.tsx
│   ├── AdminPage.tsx
│   └── NotFoundPage.tsx
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   └── routeFinder.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Security Notes

- Never commit `.env.local` or any file with real credentials
- Use Supabase Row Level Security (RLS) for all tables
- The anon key is safe to expose in frontend code
- The service role key must NEVER be in frontend code
- Admin routes are protected by Supabase authentication

## License

MIT
