// Build-time pre-renderer: generates static HTML for every bus, location and
// popular journey page, plus sitemap.xml. This is what makes the SPA fully
// indexable with per-page titles, meta descriptions and structured data.
//
// Data source (first available wins):
//   1. PRERENDER_DATA_FILE env var -> local dataset JSON (offline builds)
//   2. VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY -> live public data (Vercel)
// If neither exists, pre-rendering is skipped and the SPA still builds.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://dhaka-bus-route-finder.vercel.app';
const PAGE_SIZE = 1000;
const MAX_ROUTE_PAGES = 1200;

const { render, findRoutes, buildSlugMaps } = await import(pathToFileURL(join(dist, 'server', 'entry-server.js')).href);

// ---------- Data loading ----------
async function fetchTable(sb, table, orderCol) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await sb.from(table).select('*').order(orderCol).range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

function assemble(locations, buses, routes, stops) {
  const stopsByRoute = new Map();
  for (const s of stops) {
    if (!stopsByRoute.has(s.route_id)) stopsByRoute.set(s.route_id, []);
    stopsByRoute.get(s.route_id).push(s);
  }
  for (const list of stopsByRoute.values()) list.sort((a, b) => a.stop_order - b.stop_order);
  const routesByBus = new Map();
  for (const r of routes) {
    r.stops = stopsByRoute.get(r.id) || [];
    if (!routesByBus.has(r.bus_id)) routesByBus.set(r.bus_id, []);
    routesByBus.get(r.bus_id).push(r);
  }
  for (const b of buses) b.routes = routesByBus.get(b.id) || [];
  return { locations, buses };
}

function toAppTypes({ locations, buses }) {
  const appLocations = locations.map((l) => ({
    id: l.id,
    nameEn: l.name_en,
    nameBn: l.name_bn || l.name_en,
    aliases: l.aliases || [],
    googleMapsUrl: l.google_maps_url || undefined,
  }));
  const appBuses = buses.map((b) => ({
    id: b.id,
    nameEn: b.name_en,
    nameBn: b.name_bn || b.name_en,
    type: b.type || undefined,
    operatingHours: b.operating_hours || undefined,
    notes: b.notes || undefined,
    imageUrl: b.image_url || undefined,
    description: b.description || undefined,
    serviceType: b.service_type || undefined,
    conditionStatus: b.condition_status || undefined,
    starRating: b.star_rating != null ? Number(b.star_rating) : undefined,
    totalReviews: b.total_reviews != null ? Number(b.total_reviews) : undefined,
    isActive: b.is_active !== false,
    routes: (b.routes || []).map((r) => ({
      id: r.id,
      busId: b.id,
      direction: r.direction || 'both',
      stops: [...(r.stops || [])]
        .sort((a, b2) => (a.stop_order ?? a.order ?? 0) - (b2.stop_order ?? b2.order ?? 0))
        .map((s) => ({ locationId: s.location_id || s.locationId, order: s.stop_order ?? s.order ?? 0 })),
    })),
  }));
  return { buses: appBuses, locations: appLocations };
}

async function loadData() {
  const file = process.env.PRERENDER_DATA_FILE;
  if (file && existsSync(file)) {
    console.log(`[prerender] using local data file: ${file}`);
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    // dataset.json stores stops as plain location-id arrays
    const buses = raw.buses.map((b) => ({
      ...b,
      routes: b.routes.map((r) => ({ ...r, stops: r.stops.map((id, i) => ({ location_id: id, stop_order: i + 1 })) })),
    }));
    return toAppTypes({ locations: raw.locations, buses });
  }
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    console.log('[prerender] fetching live public data from Supabase…');
    const sb = createClient(url, key);
    const [locations, buses, routes, stops] = await Promise.all([
      fetchTable(sb, 'locations', 'name_en'),
      fetchTable(sb, 'buses', 'name_en'),
      fetchTable(sb, 'bus_routes', 'id'),
      fetchTable(sb, 'route_stops', 'id'),
    ]);
    const activeBuses = buses.filter((b) => b.is_active);
    const activeLocations = locations.filter((l) => l.is_active);
    return toAppTypes(assemble(activeLocations, activeBuses, routes, stops));
  }
  return null;
}

// ---------- Main ----------
const data = await loadData();
if (!data) {
  console.warn('[prerender] no data source (set PRERENDER_DATA_FILE or VITE_SUPABASE_* env vars) — skipping pre-render. SPA build is still valid.');
  process.exit(0);
}
console.log(`[prerender] data: ${data.buses.length} services, ${data.locations.length} locations`);

const maps = buildSlugMaps(data.buses, data.locations);
const urls = ['/', '/buses', '/locations', '/about', '/feedback'];
for (const bus of data.buses) urls.push(`/bus/${maps.busSlugById.get(bus.id)}`);
for (const loc of data.locations) urls.push(`/location/${maps.locationSlugById.get(loc.id)}`);

// Popular journey pages: top hubs by connectivity + every metro station.
const counts = new Map();
for (const b of data.buses) {
  if (!b.isActive) continue;
  for (const r of b.routes) for (const id of new Set(r.stops.map((s) => s.locationId))) counts.set(id, (counts.get(id) || 0) + 1);
}
const hubIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 22).map(([id]) => id);
for (const b of data.buses) {
  if (b.type === 'Metro') for (const r of b.routes) for (const s of r.stops) if (!hubIds.includes(s.locationId)) hubIds.push(s.locationId);
}
const hubs = hubIds.map((id) => data.locations.find((l) => l.id === id)).filter(Boolean);
let routePages = 0;
for (const a of hubs) {
  for (const b of hubs) {
    if (a.id === b.id || routePages >= MAX_ROUTE_PAGES) continue;
    if (findRoutes(a.id, b.id, data.buses).length === 0) continue;
    urls.push(`/route/${maps.locationSlugById.get(a.id)}/${maps.locationSlugById.get(b.id)}`);
    routePages++;
  }
}
console.log(`[prerender] ${urls.length} pages (${routePages} journey pages)`);

// Strip the template's default dynamic head tags; each page injects its own.
const template = readFileSync(join(dist, 'index.html'), 'utf8')
  .replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/<meta name="description"[^>]*>/, '')
  .replace(/<meta name="keywords"[^>]*>/, '')
  .replace(/<meta property="og:[^"]*"[^>]*>/g, '')
  .replace(/<meta name="twitter:[^"]*"[^>]*>/g, '')
  .replace(/<link rel="canonical"[^>]*>/, '');

const today = new Date().toISOString().slice(0, 10);
let written = 0;
for (const url of urls) {
  const { html, head } = render(url, data);
  const out = template
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const file = url === '/' ? join(dist, 'index.html') : join(dist, `${url.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  written++;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const priority = u === '/' ? '1.0' : u.startsWith('/route/') ? '0.8' : u.startsWith('/bus/') ? '0.7' : '0.6';
    return `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
console.log(`[prerender] done: ${written} HTML pages + sitemap.xml (${urls.length} URLs)`);