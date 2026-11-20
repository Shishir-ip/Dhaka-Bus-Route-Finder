# Dhaka Bus Finder

Find the best way between any two places in Dhaka — buses and MRT Line 6 metro together, direct routes first, smart 1- and 2-transfer suggestions when no direct option runs, ranked by time, transfers and quality rating.

Built with React + TypeScript + Vite + Tailwind CSS, backed by Supabase.

## Features

- **Smart route search** — direct buses, 1-transfer and 2-transfer journeys, direction-aware
- **MRT Line 6 integrated** — all 16 metro stations; bus↔metro transfers at shared hubs; metro ranks high by default, with a **Bus + Metro / Bus only** toggle
- **Ranked results** — fewer stops and transfers win; metro stops count as half (they're faster); admin-starred buses rank higher
- **Typo-tolerant search** — "farmgat", "mirpur ten", "uttara nort" all find the right place
- **Instant loads** — data cached in localStorage (stale-while-revalidate), refreshed quietly in the background
- **Admin dashboard** — manage buses, routes, stops and locations; star-rate buses; handle feedback
- **Report wrong route** — one click on any bus page opens a pre-filled feedback form
- **Bilingual** — English / Bangla, light / dark theme
- **182 services (181 buses + MRT Line 6), 266 locations** preloaded via the SQL setup

## Setup

### 1. Supabase database

The SQL setup files are provided separately (not stored in this repo):

1. Open your Supabase project → **SQL Editor**.
2. Run `01-supabase-schema.sql` — this **resets** the app tables (`locations`, `buses`, `bus_routes`, `route_stops`, `feedback`) and recreates them with the correct schema, indexes and RLS policies. Existing data in these tables is deleted; Auth users are untouched.
3. Run `02-supabase-data.sql` — loads all 181 buses plus MRT Line 6 with complete routes and Bangla names.
   - Already ran the older 02 file? Just run `03-mrt-line6.sql` instead — it adds only the metro (idempotent, safe to re-run).
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

1. All active services and their ordered stops are loaded with paginated flat queries (no silent row caps), cached in localStorage and revalidated in the background.
2. Direct routes are collected first.
3. 1-transfer journeys are built by joining routes at shared stops, respecting route direction — including bus↔metro transfers.
4. If few options exist, 2-transfer journeys are searched as a fallback.
5. Journeys are scored: `weighted stops + 8 × transfers − 1.2 × average star rating` (a metro stop counts as 0.5), deduplicated, and the best 12 are shown. The best direct options are always kept visible.
6. The **Bus only** toggle removes the metro from search entirely; the choice is remembered.

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
  utils/routeFinder.ts   transfer-aware search + ranking engine (bus + metro)
  utils/fuzzy.ts         typo-tolerant matching (edit distance + number words)
  contexts/              data (with localStorage cache), language, theme providers
  components/            navbar, autocomplete, journey cards, timeline, stars, modal
  pages/                 home, buses, bus detail, locations, location detail,
                         about, feedback, admin, 404
```