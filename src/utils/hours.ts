import type { Bus } from '../types';

// Operating hours in the data look like:
//   "6:00 AM - 10:00 PM"
//   "6 AM - 12 PM"
//   "6:30 AM - 10:30 PM (Fri from 3:00 PM)"
export interface ParsedHours {
  open: number; // minutes from midnight
  close: number; // may exceed 1440 for overnight service
  friOpen?: number; // Friday-only later start (metro)
}

function toMinutes(h: string, m: string | undefined, ampm: string): number {
  let hour = parseInt(h, 10) % 12;
  if (ampm.toUpperCase() === 'PM') hour += 12;
  return hour * 60 + (m ? parseInt(m, 10) : 0);
}

export function parseOperatingHours(text?: string): ParsedHours | null {
  if (!text) return null;
  const range = text.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*(?:-|–|—|to)\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!range) return null;
  const open = toMinutes(range[1], range[2], range[3]);
  let close = toMinutes(range[4], range[5], range[6]);
  if (close <= open) close += 1440; // overnight (e.g. 6 AM - 12 AM)
  const fri = text.match(/Fri(?:day)?s?\s+from\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  return { open, close, friOpen: fri ? toMinutes(fri[1], fri[2], fri[3]) : undefined };
}

/** Current wall-clock time in Dhaka (the service timezone), independent of the device clock zone. */
export function dhakaNow(): { minutes: number; weekday: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const hour = parseInt(get('hour'), 10) % 24;
  return { minutes: hour * 60 + parseInt(get('minute'), 10), weekday: get('weekday') };
}

function effectiveOpen(parsed: ParsedHours, weekday: string): number {
  return weekday === 'Fri' && parsed.friOpen !== undefined ? parsed.friOpen : parsed.open;
}

/** Unknown hours are treated as "running" — we never hide a bus we can't verify. */
export function isRunningNow(bus: Bus, now = dhakaNow()): boolean {
  const parsed = parseOperatingHours(bus.operatingHours);
  if (!parsed) return true;
  const open = effectiveOpen(parsed, now.weekday);
  const m = now.minutes;
  if (parsed.close > 1440) return m >= open || m < parsed.close - 1440;
  return m >= open && m < parsed.close;
}

/** Minutes until service ends today (null when hours unknown or not running). */
export function minutesUntilClose(bus: Bus, now = dhakaNow()): number | null {
  const parsed = parseOperatingHours(bus.operatingHours);
  if (!parsed) return null;
  const open = effectiveOpen(parsed, now.weekday);
  const m = now.minutes;
  const running = parsed.close > 1440 ? m >= open || m < parsed.close - 1440 : m >= open && m < parsed.close;
  if (!running) return null;
  // After midnight on an overnight service, the end is the wrapped close time.
  const end = parsed.close > 1440 && m < parsed.close - 1440 ? parsed.close - 1440 : parsed.close;
  return end - m;
}

export function formatMinutes(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
}