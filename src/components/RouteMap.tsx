import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapStop {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Schematic route map on OpenStreetMap tiles (free, no API key).
 * Only stops with coordinates are drawn; the line connects them in order.
 */
export default function RouteMap({ stops }: { stops: MapStop[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || stops.length < 2) return;
    const map = L.map(ref.current, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const points: L.LatLngExpression[] = stops.map((s) => [s.lat, s.lng]);
    L.polyline(points, { color: '#006747', weight: 4, opacity: 0.85 }).addTo(map);
    stops.forEach((s, i) => {
      const endpoint = i === 0 || i === stops.length - 1;
      L.circleMarker([s.lat, s.lng], {
        radius: endpoint ? 7 : 5,
        color: '#006747',
        weight: 2,
        fillColor: endpoint ? '#10b981' : '#ffffff',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(`${i + 1}. ${s.name}`);
    });
    map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    return () => {
      map.remove();
    };
  }, [stops]);

  if (stops.length < 2) return null;
  return <div ref={ref} className="h-72 rounded-xl border border-gray-200 dark:border-gray-800 z-0" aria-label="Route map" />;
}