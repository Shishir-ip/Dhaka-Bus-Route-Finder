# Dhaka Bus Finder

Find the best bus between any two places in Dhaka — direct buses first, smart 1- and 2-transfer suggestions when no direct bus runs, ranked by stops, transfers and bus quality rating.

Built with React + TypeScript + Vite + Tailwind CSS, backed by Supabase.

## Features

- **Smart route search** — direct buses, 1-transfer and 2-transfer journeys, direction-aware
- **Ranked results** — fewer stops and fewer transfers win; admin-starred buses rank higher
- **Admin dashboard** — manage buses, routes, stops and locations; star-rate buses; handle feedback
- **Bilingual** — English / Bangla, light / dark theme
- **181 buses, 261 locations** preloaded via the SQL setup

## Setup

### 1. Supabase database

The SQL setup files are provided separately (not stored in this repo):

1. Open your Supabase project → **SQL Editor**.
2. Run `01-supabase-schema.sql` — this **resets** the app tables (`locations`, `buses`, `bus_routes`, `route_stops`, `feedback`) and recreates them with the correct schema, indexes and RLS policies. Existing data in these tables is deleted; Auth users are untouched.
3. Run `02-supabase-data.sql` — loads all 181 buses with complete routes and Bangla names.
4. Create your admin login: **Authentication → Users → Add user** (email + password). Use that account on the site's `/admin` page.
5. Recommended: **Authentication → Providers → Email** — turn **off** public sign-ups so only invited admins can write data.

### 2. Environment variables

Copy `.env.example` to `.env` for local development:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Find both values in Supabase → **Project Settings → API**. Use the **anon public** key only — never the service-role key in the browser.

On Vercel (or your host), set the same two variables in the project's Environment Variables, then redeploy.

### 3. Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
npm run typecheck  # TypeScript check
```

## How search works

1. All active buses and their ordered stops are loaded with paginated flat queries (no silent row caps).
2. Direct routes are collected first.
3. 1-transfer journeys are built by joining routes at shared stops, respecting route direction.
4. If few options exist, 2-transfer journeys are searched as a fallback.
5. Journeys are scored: `stops + 6 × transfers − 1.2 × average bus star rating`, deduplicated, and the best 12 are shown.

## Admin

- `/admin` → sign in with a Supabase Auth user.
- **Buses**: add/edit/delete, set a 0–5 star rating (better buses appear higher in search), toggle active.
- **Routes**: per bus, add route variants (both/up/down direction), add/reorder/delete stops.
- **Locations**: add/edit/delete with Bangla names and aliases.
- **Feedback**: review and resolve user submissions.

## Project structure

```
src/
  lib/supabase.ts        Supabase client, paginated data loading, sanitized CRUD
  utils/routeFinder.ts   transfer-aware search + ranking engine
  contexts/              data, language, theme providers
  components/            navbar, autocomplete, journey cards, timeline, stars, modal
  pages/                 home, buses, bus detail, locations, location detail,
                         about, feedback, admin, 404
```