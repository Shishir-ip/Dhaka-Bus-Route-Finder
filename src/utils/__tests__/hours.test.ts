import { describe, it, expect } from 'vitest';
import { parseOperatingHours, isRunningNow, minutesUntilClose, formatMinutes } from '../hours';
import type { Bus } from '../../types';

const bus = (hours?: string): Bus => ({
  id: 'x', nameEn: 'X', nameBn: 'X', isActive: true, routes: [], operatingHours: hours,
});

describe('parseOperatingHours', () => {
  it('parses the standard format', () => {
    expect(parseOperatingHours('6:00 AM - 10:00 PM')).toEqual({ open: 360, close: 1320, friOpen: undefined });
  });
  it('parses short format', () => {
    expect(parseOperatingHours('6 AM - 12 PM')).toEqual({ open: 360, close: 720, friOpen: undefined });
  });
  it('parses metro Friday start', () => {
    const p = parseOperatingHours('6:30 AM - 10:30 PM (Fri from 3:00 PM)')!;
    expect(p.open).toBe(390);
    expect(p.close).toBe(1350);
    expect(p.friOpen).toBe(900);
  });
  it('overnight wraps close past midnight', () => {
    const p = parseOperatingHours('6 AM - 12 AM')!;
    expect(p.close).toBe(1440);
  });
  it('unknown formats return null', () => {
    expect(parseOperatingHours(undefined)).toBeNull();
    expect(parseOperatingHours('all day')).toBeNull();
  });
});

describe('isRunningNow', () => {
  const at = (minutes: number, weekday = 'Sat') => ({ minutes, weekday });
  it('inside and outside service hours', () => {
    const b = bus('6:00 AM - 10:00 PM');
    expect(isRunningNow(b, at(600))).toBe(true); // 10 AM
    expect(isRunningNow(b, at(300))).toBe(false); // 5 AM
    expect(isRunningNow(b, at(1380))).toBe(false); // 11 PM
  });
  it('metro starts 3 PM on Friday', () => {
    const m = bus('6:30 AM - 10:30 PM (Fri from 3:00 PM)');
    expect(isRunningNow(m, at(600, 'Fri'))).toBe(false);
    expect(isRunningNow(m, at(960, 'Fri'))).toBe(true);
    expect(isRunningNow(m, at(600, 'Sat'))).toBe(true);
  });
  it('unknown hours are treated as running', () => {
    expect(isRunningNow(bus(undefined), at(100))).toBe(true);
  });
});

describe('minutesUntilClose / formatMinutes', () => {
  it('counts down to close', () => {
    const b = bus('6:00 AM - 10:00 PM');
    expect(minutesUntilClose(b, { minutes: 1290, weekday: 'Sat' })).toBe(30);
    expect(minutesUntilClose(b, { minutes: 200, weekday: 'Sat' })).toBeNull();
  });
  it('formats 12h clock', () => {
    expect(formatMinutes(1320)).toBe('10:00 PM');
    expect(formatMinutes(390)).toBe('6:30 AM');
    expect(formatMinutes(0)).toBe('12:00 AM');
  });
});