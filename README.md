# Dhaka Bus Finder

Find the best way between any two places in Dhaka — buses and MRT Line 6 metro together, direct routes first, smart 1- and 2-transfer suggestions when no direct option runs, ranked by time, transfers and quality rating.

Built with React + TypeScript + Vite + Tailwind CSS, backed by Supabase.

## Features

- **Smart route search** — every direct bus and every feasible transfer combination is shown (nothing hidden), direction-aware, with a detour penalty so roundabout routes rank last
- **MRT Line 6 integrated** — all 16 metro stations; bus↔metro transfers at shared hubs; metro ranks high by default, with a **Bus + Metro / Bus only** toggle
- **Ranked results** — fewer stops and transfers win; metro stops count as half (they're faster); admin-starred buses rank higher; transfer-hub chips ("via Mirpur 10 · 17") and **Show more** keep long lists readable
- **Running now filter** — parses operating hours; hides buses that aren't running at the current time and warns about last-bus times (Friday metro start handled)
- **Duration + fare estimates** — "~42 min · ৳60" badges on every journey card
- **Typo-tolerant search** — "farmgat", "mirpur ten", "uttara nort" all find the right place
- **Nearest-hub rescue** — if a place has no service, suggests the closest served hub with walking distance
- **Route maps** — Leaflet + OpenStreetMap on bus pages (no API key); coordinates for major hubs and all metro stations
- **Instant loads + offline** — data cached in localStorage; PWA installable with an offline app shell
- **Recent searches + shareable links** — `/?from=mirpur-10&to=motijheel` opens with results loaded
- **Admin dashboard** — manage buses, routes, stops and locations; star-rate buses; **paste-a-route** (paste `A ⇄ B ⇄ C` stop lists); handle feedback; one-click SEO rebuild via Vercel deploy hook
- **Admin security** — RLS allowlist: only listed admin users can write data
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
4. Run `04-admin-security.sql` — **edit the placeholder email first** (`CHANGE_ME@example.com` → your admin login email). Creates the admin allowlist (only you can edit data) and the `app_settings` table used by the deploy-hook feature.
5. Run `05-location-coords.sql` — adds `lat`/`lng` columns and coordinates for major hubs + all metro stations (powers maps and nearest-hub suggestions). Idempotent.
6. Create your admin login: **Authentication → Users → Add user** (email + password). Use that account on the site's `/admin` page.
7. Recommended: **Authentication → Providers → Email** — turn **off** public sign-ups so only invited admins can write data.
8. Optional auto-SEO-rebuild: Vercel → Project → **Settings → Git → Deploy Hooks** → create a hook for `main`, copy the URL, and paste it into the **SEO auto-rebuild** field on `/admin`. Every data save then triggers a rebuild of the pre-rendered SEO pages automatically.

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
npm run build      # production build + SSR pre-render of all pages + sitemap
npm run build:spa  # SPA-only build (no pre-render)
npm run typecheck  # TypeScript check
npm test           # Vitest regression suite (40 tests incl. full-network completeness sweeps)
npm run og         # regenerate public/og.png social share card
npm run icons      # regenerate PWA icons
```

The full build pre-renders ~1500 static HTML pages (every bus, location and popular
journey) with per-page titles, meta descriptions, canonical URLs, Open Graph tags
and JSON-LD structured data (WebSite, BusTrip, BreadcrumbList, FAQPage). It needs
data at build time: on Vercel it reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
automatically; locally you can point `PRERENDER_DATA_FILE` at a dataset JSON.
Without either, the build still succeeds as a normal SPA.

## SEO

- Pre-rendered HTML for every route — fully indexable without JavaScript
- Journey pages at `/route/<from>/<to>` targeting "X to Y bus" searches, with FAQ rich results and a Bangla content block for Bangla queries
- `sitemap.xml` (all pages) + `robots.txt` generated at build time
- Real 404s: unknown URLs serve a styled `404.html` (no soft-404 penalty); admin page is `noindex`
- Google Search Console verification file in `public/`
- Internal linking: stops ↔ buses ↔ locations ↔ journey pages, popular-area footer links
- PWA: installable, offline app shell via service worker
- Springy CSS-only micro-interactions; respects `prefers-reduced-motion`

## How search works

1. All active services and their ordered stops are loaded with paginated flat queries (no silent row caps), cached in localStorage and revalidated in the background.
2. Direct routes are collected first — **every** bus serving both stops is shown.
3. 1-transfer journeys enumerate **every feasible bus pairing** at every shared stop, respecting route direction — including bus↔metro transfers.
4. If no direct or 1-transfer option exists, 2-transfer journeys are searched as a fallback.
5. Journeys are scored: `weighted stops + 8 × transfers − 1.2 × average star rating + detour penalty` (a metro stop counts as 0.5). Results are grouped by transfer hub; the first screenful is shown with **Show more** for the rest — nothing is hidden.
6. The **Bus only** toggle removes the metro; **Running now** hides services outside their operating hours. Both choices are remembered.
7. If an endpoint has no service at all, the nearest served hub is suggested with walking distance.

## Admin

- `/admin` → sign in with a Supabase Auth user **listed in `admin_users`** (see `04-admin-security.sql`).
- **Buses**: add/edit/delete, set a 0–5 star rating (better buses appear higher in search), toggle active.
- **Routes**: per bus, add route variants (both/up/down direction), add/reorder/delete stops, or **paste a whole stop list** (`A ⇄ B ⇄ C`, also accepts `→`, `,` or newlines).
- **Locations**: add/edit/delete with Bangla names, aliases and optional lat/lng coordinates.
- **Feedback**: review and resolve user submissions.
- **SEO auto-rebuild**: save a Vercel deploy hook once; every data change then rebuilds the pre-rendered pages.

## Tests & CI

`npm test` runs the Vitest suite against the real network snapshot in
`tests/fixtures/network.json` — including exhaustive sweeps proving no direct bus
and no feasible transfer pairing is ever hidden. GitHub Actions
(`.github/workflows/ci.yml`) runs typecheck + tests + full build on every push.

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