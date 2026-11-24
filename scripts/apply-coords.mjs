// Applies scripts/coords.mjs to the local dataset fixture and generates the
// incremental Supabase migration (05-location-coords.sql). Run: node scripts/apply-coords.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COORDS } from './coords.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const datasetPath = process.env.PRERENDER_DATA_FILE || 'C:/Users/SHISHIR/AppData/Local/Temp/qwenwork/busdata/dataset.json';
const data = JSON.parse(readFileSync(datasetPath, 'utf8'));

const names = new Set(data.locations.map((l) => l.name_en));
let applied = 0;
const unmatched = [];
for (const [name, [lat, lng]] of Object.entries(COORDS)) {
  if (!names.has(name)) { unmatched.push(name); continue; }
  const loc = data.locations.find((l) => l.name_en === name);
  loc.lat = lat;
  loc.lng = lng;
  applied++;
}
writeFileSync(datasetPath, JSON.stringify(data));
mkdirSync(join(root, 'tests', 'fixtures'), { recursive: true });
writeFileSync(join(root, 'tests', 'fixtures', 'network.json'), JSON.stringify(data));
console.log(`coords applied: ${applied}/${Object.keys(COORDS).length}; fixture written`);
if (unmatched.length) console.log('unmatched names:', unmatched.join(', '));

const esc = (s) => s.replace(/'/g, "''");
const updates = Object.entries(COORDS)
  .filter(([name]) => names.has(name))
  .map(([name, [lat, lng]]) => `UPDATE locations SET lat = ${lat}, lng = ${lng} WHERE name_en = '${esc(name)}';`)
  .join('\n');
const sql = `-- =====================================================
-- Dhaka Bus Finder — 05 LOCATION COORDINATES (incremental)
-- =====================================================
-- Adds approximate coordinates for major hubs + all MRT Line 6 stations.
-- Powers nearest-hub suggestions and the bus route map.
-- Idempotent: safe to run more than once.
-- =====================================================

ALTER TABLE locations ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS lng double precision;

${updates}
`;
const outDir = join(root, '..', 'supabase-sql');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, '05-location-coords.sql'), sql);
console.log('05-location-coords.sql written');