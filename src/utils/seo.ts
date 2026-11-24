import { useEffect } from 'react';
import type { Bus, Location, JourneyResult } from '../types';
import { buildSlugMaps } from './slugs';
import { findRoutes } from './routeFinder';

export const SITE_URL = 'https://dhaka-bus-route-finder.vercel.app';
export const SITE_NAME = 'Dhaka Bus Finder';
export const OG_IMAGE = `${SITE_URL}/og.png`;

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
}

export interface GraphData {
  buses: Bus[];
  locations: Location[];
}

const KEYWORDS_BASE =
  'dhaka bus route, dhaka bus route finder, bus route dhaka, dhaka bus service, dhaka local bus, dhaka metro rail, mrt line 6, dhaka metro station, dhaka bus finder, bus kothay jabe, dhaka bus schedule, ঢাকা বাস রুট, ঢাকা বাস, মেট্রোরেল ঢাকা, বাস রুট ফাইন্ডার';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function estimateMinutes(j: JourneyResult): number {
  const ride = j.segments.reduce((a, s) => a + s.stopCount * (s.bus.type === 'Metro' ? 2 : 3.5), 0);
  return Math.round(ride + j.totalTransfers * 6);
}

/**
 * Rough fare estimate (BDT). Local buses ~৳2.5/stop (min ৳10); metro follows
 * the official ৳5/km distance bands (~৳6/station, ৳20 minimum, ৳100 max).
 * Always labelled "est" in the UI — actual fares vary by service and traffic.
 */
export function estimateFare(j: JourneyResult): number {
  return j.segments.reduce((a, s) => {
    if (s.bus.type === 'Metro') return a + Math.min(100, Math.max(20, Math.round(s.stopCount * 6 / 5) * 5));
    return a + Math.max(10, Math.round(s.stopCount * 2.5));
  }, 0);
}

// ---------- Page meta builders (shared by SSR head + client hook) ----------

export function homeMeta(data?: GraphData): PageMeta {
  const counts = data ? `${data.buses.length} buses & metro, ${data.locations.length} locations` : '182 buses & metro, 266 locations';
  return {
    title: 'Dhaka Bus Finder — Bus & Metro Route Finder for Dhaka City',
    description: `Find the best bus routes in Dhaka city. Search ${counts}, direct buses, MRT Line 6 metro and smart transfer journeys. Mirpur, Uttara, Gulshan, Dhanmondi, Motijheel, Farmgate and more — in English or Bangla.`,
    keywords: KEYWORDS_BASE,
  };
}

export function busMeta(bus: Bus, data: GraphData): PageMeta {
  const maps = buildSlugMaps(data.buses, data.locations);
  const route = bus.routes[0];
  const first = route?.stops[0] ? data.locations.find((l) => l.id === route.stops[0].locationId) : undefined;
  const last = route?.stops[route.stops.length - 1] ? data.locations.find((l) => l.id === route.stops[route.stops.length - 1].locationId) : undefined;
  const via = first && last ? ` from ${first.nameEn} to ${last.nameEn}` : '';
  const stopCount = route?.stops.length ?? 0;
  return {
    title: `${bus.nameEn} Bus Route & Stops${via} — Dhaka Bus Finder`,
    description: `${bus.nameEn} (${bus.nameBn}) bus route in Dhaka${via}: ${stopCount} stops, full stop list, operating hours${bus.operatingHours ? ` (${bus.operatingHours})` : ''} and service details. Plan your journey on Dhaka Bus Finder.`,
    keywords: `${bus.nameEn}, ${bus.nameEn} route, ${bus.nameEn} bus stops, ${bus.nameBn}, dhaka bus, ${KEYWORDS_BASE}`,
  };
}

export function locationMeta(loc: Location, data: GraphData): PageMeta {
  const busCount = data.buses.filter((b) => b.isActive && b.routes.some((r) => r.stops.some((s) => s.locationId === loc.id))).length;
  return {
    title: `${loc.nameEn} Bus Routes — ${busCount} Buses at ${loc.nameEn}, Dhaka`,
    description: `All bus routes serving ${loc.nameEn} (${loc.nameBn}) in Dhaka: ${busCount} buses stop here. See every bus, its full route and where it goes — plan trips from ${loc.nameEn} with Dhaka Bus Finder.`,
    keywords: `${loc.nameEn} bus, ${loc.nameEn} bus route, buses at ${loc.nameEn}, ${loc.nameBn}, dhaka bus, ${KEYWORDS_BASE}`,
  };
}

export function routeMeta(from: Location, to: Location, results: JourneyResult[]): PageMeta {
  const directs = results.filter((r) => r.totalTransfers === 0);
  const best = results[0];
  const directNames = directs.slice(0, 3).map((r) => r.segments[0].bus.nameEn).join(', ');
  const hasMetro = results.some((r) => r.segments.some((s) => s.bus.type === 'Metro'));
  const parts = [
    directs.length > 0 ? `${directs.length} direct bus${directs.length > 1 ? 'es' : ''} (${directNames})` : 'transfer options available',
    best ? `fastest journey ${best.totalStops} stops (~${estimateMinutes(best)} min)` : '',
    hasMetro ? 'MRT Line 6 metro option' : '',
  ].filter(Boolean);
  return {
    title: `${from.nameEn} to ${to.nameEn} Bus & Metro Route — Dhaka Bus Finder`,
    description: `How to go from ${from.nameEn} to ${to.nameEn} by bus or metro in Dhaka: ${parts.join('; ')}. Full stop lists, transfer points and ranked routes.`,
    keywords: `${from.nameEn} to ${to.nameEn} bus, ${from.nameEn} to ${to.nameEn} bus route, ${from.nameEn} ${to.nameEn} metro, how to go ${from.nameEn} to ${to.nameEn}, ${from.nameBn} থেকে ${to.nameBn} বাস, dhaka bus route, ${KEYWORDS_BASE}`,
  };
}

export function listMeta(kind: 'buses' | 'locations' | 'about' | 'feedback'): PageMeta {
  switch (kind) {
    case 'buses':
      return {
        title: 'All Dhaka Buses & Metro — Routes, Stops & Ratings | Dhaka Bus Finder',
        description: 'Browse every bus service and MRT Line 6 metro in Dhaka with routes, stops, operating hours and quality ratings. Search by name in English or Bangla.',
        keywords: `dhaka bus list, all buses in dhaka, dhaka bus service names, dhaka metro, ${KEYWORDS_BASE}`,
      };
    case 'locations':
      return {
        title: 'Dhaka Bus Stops & Locations — Every Served Area | Dhaka Bus Finder',
        description: 'Explore all bus stops and locations in Dhaka — Mirpur, Uttara, Gulshan, Dhanmondi, Mohammadpur, Motijheel, Farmgate, Gabtoli, Sayedabad, Jatrabari, Savar, Tongi and more.',
        keywords: `dhaka bus stops, dhaka bus stand, bus stop list dhaka, mirpur bus, uttara bus, motijheel bus, ${KEYWORDS_BASE}`,
      };
    case 'about':
      return {
        title: 'About Dhaka Bus Finder — Free Bus & Metro Route Planner',
        description: 'Dhaka Bus Finder is a free route planner for Dhaka city buses and MRT Line 6 metro. Find direct routes, smart transfers and ranked journeys — in English or Bangla.',
        keywords: KEYWORDS_BASE,
      };
    case 'feedback':
      return {
        title: 'Report a Wrong Bus Route — Dhaka Bus Finder Feedback',
        description: 'Found a wrong bus route, stop or name in Dhaka? Report it and we will fix the data. Community-maintained bus routes for Dhaka city.',
        keywords: `dhaka bus route correction, report bus route dhaka, ${KEYWORDS_BASE}`,
      };
  }
}

export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: 'How do I find bus routes in Dhaka?',
    a: 'Enter your origin and destination in Dhaka Bus Finder. It lists every direct bus, MRT Line 6 metro options and smart 1- or 2-transfer journeys, ranked by stops, transfers and service quality — with full stop lists for each route.',
  },
  {
    q: 'Which buses go from Mirpur to Motijheel?',
    a: 'Direct buses between Mirpur and Motijheel include Al Makka Bus, Bahon Bus, Best Transport and Hazi Transport. MRT Line 6 metro from Mirpur 10 to Motijheel is usually the fastest option — about 25 minutes, trains every 5–10 minutes.',
  },
  {
    q: 'Does Dhaka have a metro rail?',
    a: 'Yes. MRT Line 6 (Dhaka Metro Rail) runs from Uttara North to Motijheel with 16 stations, roughly 38 minutes end to end. Trains run 6:30 AM to 10:30 PM (Fridays from 3:00 PM), fare ৳20–100. Dhaka Bus Finder includes the metro in journey recommendations.',
  },
  {
    q: 'What if there is no direct bus between two places?',
    a: 'The finder automatically suggests transfer journeys — one bus to a shared hub, then a second (or third) bus to your destination. Transfer points are shown clearly, and you can switch to Bus-only mode to exclude the metro.',
  },
  {
    q: 'Is Dhaka Bus Finder free and available in Bangla?',
    a: 'Yes — completely free, with the full interface in both English and Bangla, light and dark themes, and works on any phone or computer.',
  },
];

// ---------- Structured data (JSON-LD) ----------

function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['Dhaka Bus Route Finder', 'ঢাকা বাস ফাইন্ডার'],
    url: SITE_URL,
    inLanguage: ['en', 'bn'],
    description: 'Bus and metro route finder for Dhaka city — direct buses, MRT Line 6 and smart transfer journeys.',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/favicon.svg` },
  };
}

function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function routeFaqPairs(from: Location, to: Location, results: JourneyResult[]): { q: string; a: string }[] {
  const directs = results.filter((r) => r.totalTransfers === 0);
  const best = results[0];
  const hasMetro = results.some((r) => r.segments.some((s) => s.bus.type === 'Metro'));
  const pairs: { q: string; a: string }[] = [];
  pairs.push({
    q: `Is there a direct bus from ${from.nameEn} to ${to.nameEn}?`,
    a: directs.length > 0
      ? `Yes. ${directs.length} direct bus${directs.length > 1 ? 'es' : ''} run from ${from.nameEn} to ${to.nameEn}, including ${directs.slice(0, 4).map((r) => r.segments[0].bus.nameEn).join(', ')}.`
      : best
      ? `No direct bus is listed. The best option is a ${best.totalTransfers}-transfer journey: ${best.segments.map((s) => s.bus.nameEn).join(', then ')}.`
      : `No bus journey between these places is listed in our database yet. Try nearby major stops.`,
  });
  if (best) {
    pairs.push({
      q: `How long does it take to go from ${from.nameEn} to ${to.nameEn} by bus?`,
      a: `The fastest listed journey is ${best.totalStops} stops, roughly ${estimateMinutes(best)} minutes including transfers. Dhaka traffic can vary this a lot — allow extra time at peak hours.`,
    });
  }
  pairs.push({
    q: `Can I take the metro from ${from.nameEn} to ${to.nameEn}?`,
    a: hasMetro
      ? `Yes — MRT Line 6 (Dhaka Metro Rail) is part of the recommended journeys between ${from.nameEn} and ${to.nameEn}. Metro trains run every 5–10 minutes, 6:30 AM to 10:30 PM (Fridays from 3:00 PM).`
      : `MRT Line 6 does not directly connect these two places. Check the nearest metro stations — Farmgate, Shahbag, Mirpur 10, Agargaon or Motijheel — and combine metro with a bus.`,
  });
  if (best) {
    pairs.push({
      q: `Which is the best bus from ${from.nameEn} to ${to.nameEn}?`,
      a: `Our top recommendation is ${best.segments.map((s) => s.bus.nameEn).join(' + ')} (${best.totalStops} stops, ${best.totalTransfers} transfer${best.totalTransfers === 1 ? '' : 's'}). Results are ranked by stops, transfers and service rating.`,
    });
  }
  pairs.push({
    q: `${from.nameBn} থেকে ${to.nameBn} কোন বাসে যাওয়া যায়?`,
    a: directs.length > 0
      ? `${from.nameBn} থেকে ${to.nameBn} সরাসরি ${directs.length}টি বাস চলে, যেমন ${directs.slice(0, 4).map((r) => r.segments[0].bus.nameBn).join(', ')}। সম্পূর্ণ স্টপ তালিকা ও র‍্যাঙ্ক করা ফলাফল এই পেজে আছে।`
      : best
      ? `সরাসরি বাস নেই; সবচেয়ে ভালো উপায় ${best.segments.map((s) => s.bus.nameBn).join(', তারপর ')} — মোট ${best.totalStops} স্টপ।`
      : `এই রুটে এখনো কোনো বাস তালিকাভুক্ত নেই। কাছের বড় স্টপ থেকে সার্চ করুন।`,
  });
  return pairs;
}

function faqJsonLd(pairs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({ '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: p.a } })),
  };
}

function busTripJsonLd(bus: Bus, first?: Location, last?: Location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BusTrip',
    name: `${bus.nameEn} — Dhaka`,
    busNumber: bus.nameEn,
    provider: { '@type': 'Organization', name: bus.nameEn },
    ...(first ? { departureBusStop: { '@type': 'BusStop', name: first.nameEn } } : {}),
    ...(last ? { arrivalBusStop: { '@type': 'BusStop', name: last.nameEn } } : {}),
  };
}

// ---------- Full <head> block for pre-rendering ----------

export function buildHead(url: string, data: GraphData): string {
  const path = url.split('?')[0].replace(/\/+$/, '') || '/';
  const maps = buildSlugMaps(data.buses, data.locations);
  let meta: PageMeta;
  const jsonLd: object[] = [websiteJsonLd()];

  const busMatch = path.match(/^\/bus\/([^/]+)$/);
  const locMatch = path.match(/^\/location\/([^/]+)$/);
  const routeMatch = path.match(/^\/route\/([^/]+)\/([^/]+)$/);

  if (path === '/') {
    meta = homeMeta(data);
    jsonLd.push(faqJsonLd(HOME_FAQ));
  } else if (path === '/buses' || path === '/locations' || path === '/about' || path === '/feedback') {
    meta = listMeta(path.slice(1) as 'buses' | 'locations' | 'about' | 'feedback');
  } else if (busMatch && maps.busBySlug.has(busMatch[1])) {
    const bus = maps.busBySlug.get(busMatch[1])!;
    meta = busMeta(bus, data);
    const route = bus.routes[0];
    const first = route?.stops[0] ? data.locations.find((l) => l.id === route.stops[0].locationId) : undefined;
    const last = route?.stops[route.stops.length - 1] ? data.locations.find((l) => l.id === route.stops[route.stops.length - 1].locationId) : undefined;
    jsonLd.push(busTripJsonLd(bus, first, last));
    jsonLd.push(breadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Buses', url: `${SITE_URL}/buses` },
      { name: bus.nameEn, url: `${SITE_URL}/bus/${busMatch[1]}` },
    ]));
  } else if (locMatch && maps.locationBySlug.has(locMatch[1])) {
    const loc = maps.locationBySlug.get(locMatch[1])!;
    meta = locationMeta(loc, data);
    jsonLd.push(breadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Locations', url: `${SITE_URL}/locations` },
      { name: loc.nameEn, url: `${SITE_URL}/location/${locMatch[1]}` },
    ]));
  } else if (routeMatch && maps.locationBySlug.has(routeMatch[1]) && maps.locationBySlug.has(routeMatch[2])) {
    const from = maps.locationBySlug.get(routeMatch[1])!;
    const to = maps.locationBySlug.get(routeMatch[2])!;
    const results = findRoutes(from.id, to.id, data.buses);
    meta = routeMeta(from, to, results);
    jsonLd.push(faqJsonLd(routeFaqPairs(from, to, results)));
    jsonLd.push(breadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Locations', url: `${SITE_URL}/locations` },
      { name: `${from.nameEn} to ${to.nameEn}`, url: `${SITE_URL}/route/${routeMatch[1]}/${routeMatch[2]}` },
    ]));
  } else {
    meta = { title: `${SITE_NAME} — Bus & Metro Route Finder for Dhaka`, description: homeMeta().description, noindex: true };
  }

  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.keywords ? `<meta name="keywords" content="${esc(meta.keywords)}" />` : '',
    `<meta name="robots" content="${meta.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="bn_BD" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...jsonLd.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`),
  ].filter(Boolean);
  return tags.join('\n    ');
}

// ---------- Client-side head updates (SPA navigation) ----------

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useSEO(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    setMetaTag('name', 'description', meta.description);
    setMetaTag('name', 'robots', meta.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    const url = `${SITE_URL}${window.location.pathname}`;
    setMetaTag('property', 'og:url', url);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [meta.title, meta.description, meta.noindex]);
}