// Generates public/icon-192.png and public/icon-512.png (PWA icons) with zero
// dependencies: graphite background, white bus glyph, MRT-green stripe.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const S = 512;
const px = Buffer.alloc(S * S * 3);
const BG = [15, 17, 21];
const WHITE = [245, 245, 244];
const GREEN = [0, 103, 71];

function set(x, y, [r, g, b]) {
  if (x < 0 || y < 0 || x >= S || y >= S) return;
  const i = (y * S + x) * 3;
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

rect(0, 0, S, S, BG);
roundRect(96, 110, 320, 230, 36, WHITE);   // body
rect(128, 150, 110, 84, BG);              // window 1
rect(274, 150, 110, 84, BG);              // window 2
rect(96, 268, 320, 22, GREEN);            // stripe
circle(170, 360, 32, WHITE);              // wheel 1
circle(342, 360, 32, WHITE);              // wheel 2
circle(170, 360, 13, BG);
circle(342, 360, 13, BG);
rect(0, S - 20, S, 20, GREEN);            // bottom accent

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
function encode(size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    const sy = Math.floor((y * S) / size);
    raw[y * (1 + size * 3)] = 0;
    for (let x = 0; x < size; x++) {
      const sx = Math.floor((x * S) / size);
      const si = (sy * S + sx) * 3;
      const di = y * (1 + size * 3) + 1 + x * 3;
      raw[di] = px[si]; raw[di + 1] = px[si + 1]; raw[di + 2] = px[si + 2];
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  const png = encode(size);
  writeFileSync(join(outDir, `icon-${size}.png`), png);
  console.log(`icon-${size}.png (${(png.length / 1024).toFixed(1)} KB)`);
}