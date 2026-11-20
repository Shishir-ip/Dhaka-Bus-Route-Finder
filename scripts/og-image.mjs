// Generates public/og.png (1200x630 social share card) with zero dependencies:
// graphite background, white bus glyph, emerald metro line with station dots.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1200, H = 630;
const px = Buffer.alloc(W * H * 3);

const BG = [15, 17, 21];        // graphite
const WHITE = [245, 245, 244];  // soft white
const GREEN = [0, 103, 71];     // MRT Line 6 green
const GREEN_SOFT = [16, 185, 129];

function set(x, y, [r, g, b]) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
}
function rect(x0, y0, w, h, c) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, c);
}
function roundRect(x0, y0, w, h, rad, c) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const dx = Math.max(x0 + rad - x, x - (x0 + w - 1 - rad), 0);
      const dy = Math.max(y0 + rad - y, y - (y0 + h - 1 - rad), 0);
      if (dx * dx + dy * dy <= rad * rad) set(x, y, c);
    }
  }
}
function circle(cx, cy, r, c) {
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
    if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, c);
  }
}
function hline(x0, x1, y, thick, c) { rect(x0, y - thick / 2, x1 - x0, thick, c); }

// Background
rect(0, 0, W, H, BG);

// Bus glyph (left)
roundRect(110, 150, 250, 170, 26, WHITE);          // body
rect(135, 180, 85, 62, BG);                        // window 1
rect(240, 180, 85, 62, BG);                        // window 2
rect(110, 262, 250, 16, GREEN);                    // accent stripe
circle(165, 330, 24, WHITE);                       // wheel 1
circle(305, 330, 24, WHITE);                       // wheel 2
circle(165, 330, 10, BG);
circle(305, 330, 10, BG);

// Metro line motif (right + bottom): line with station dots
hline(470, 1090, 235, 12, GREEN);
const stations = [470, 573, 676, 779, 882, 985, 1090];
for (const sx of stations) {
  circle(sx, 235, 17, WHITE);
  circle(sx, 235, 9, GREEN_SOFT);
}
// vertical connector down to a second line (transfer motif)
rect(773, 235, 12, 150, GREEN);
hline(470, 1090, 385, 12, GREEN);
for (const sx of [470, 676, 882, 1090]) {
  circle(sx, 385, 17, WHITE);
  circle(sx, 385, 9, GREEN_SOFT);
}
circle(779, 385, 22, WHITE);                       // transfer hub
circle(779, 385, 12, GREEN);

// Bottom accent bar
rect(0, H - 14, W, 14, GREEN);

// ---------- PNG encoding ----------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 2;  // color type RGB
// scanlines with filter byte 0
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0;
  px.copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'og.png'), png);
console.log(`og.png written (${(png.length / 1024).toFixed(1)} KB, ${W}x${H})`);