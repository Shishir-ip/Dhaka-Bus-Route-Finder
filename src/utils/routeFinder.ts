import { Bus, JourneyResult, JourneySegment, Location } from '../types';

export function findRoutes(
  fromId: string,
  toId: string,
  buses: Bus[],
  getLocationById: (id: string) => Location | undefined
): JourneyResult[] {
  const results: JourneyResult[] = [];

  // Find direct buses
  const directResults = findDirectBuses(fromId, toId, buses);
  results.push(...directResults);

  // Find transfer buses (max 1 transfer)
  if (directResults.length === 0) {
    const transferResults = findTransferBuses(fromId, toId, buses);
    results.push(...transferResults);
  }

  // Sort results: direct first, then by fewer stops
  results.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'direct' ? -1 : 1;
    if (a.totalTransfers !== b.totalTransfers) return a.totalTransfers - b.totalTransfers;
    return a.totalStops - b.totalStops;
  });

  return results;
}

function findDirectBuses(fromId: string, toId: string, buses: Bus[]): JourneyResult[] {
  const results: JourneyResult[] = [];
  const activeBuses = buses.filter(b => b.isActive);

  for (const bus of activeBuses) {
    for (const route of bus.routes) {
      const stops = route.stops.map(s => s.locationId);
      const fromIndex = stops.indexOf(fromId);
      const toIndex = stops.indexOf(toId);

      if (fromIndex === -1 || toIndex === -1) continue;
      if (fromIndex === toIndex) continue;

      let isDirect = false;

      if (route.direction === 'both') {
        isDirect = true;
      } else if (route.direction === 'up' && fromIndex < toIndex) {
        isDirect = true;
      } else if (route.direction === 'down' && fromIndex > toIndex) {
        isDirect = true;
      }

      if (isDirect) {
        const startIdx = Math.min(fromIndex, toIndex);
        const endIdx = Math.max(fromIndex, toIndex);
        const segmentStops = stops.slice(startIdx, endIdx + 1);

        const segment: JourneySegment = {
          bus,
          route,
          boardStop: fromId,
          alightStop: toId,
          stops: segmentStops,
          stopCount: segmentStops.length - 1,
        };

        results.push({
          type: 'direct',
          segments: [segment],
          totalTransfers: 0,
          totalStops: segmentStops.length - 1,
        });
      }
    }
  }

  return results;
}

function findTransferBuses(fromId: string, toId: string, buses: Bus[], maxTransfers: number = 1): JourneyResult[] {
  const results: JourneyResult[] = [];
  const activeBuses = buses.filter(b => b.isActive);

  // Find all intermediate stops reachable from origin
  const fromBuses = new Map<string, { bus: Bus; routeIndex: number }[]>();

  for (const bus of activeBuses) {
    for (let routeIdx = 0; routeIdx < bus.routes.length; routeIdx++) {
      const route = bus.routes[routeIdx];
      const stops = route.stops.map(s => s.locationId);
      const fromIndex = stops.indexOf(fromId);
      if (fromIndex === -1) continue;

      // All stops reachable from origin on this bus
      for (let i = 0; i < stops.length; i++) {
        if (i === fromIndex) continue;
        const canReach = route.direction === 'both' ||
          (route.direction === 'up' && fromIndex < i) ||
          (route.direction === 'down' && fromIndex > i);

        if (canReach) {
          const stopId = stops[i];
          if (!fromBuses.has(stopId)) fromBuses.set(stopId, []);
          fromBuses.get(stopId)!.push({ bus, routeIndex: routeIdx });
        }
      }
    }
  }

  // For each intermediate stop, check if any bus can reach destination
  for (const [transferStopId] of fromBuses) {
    if (transferStopId === fromId || transferStopId === toId) continue;

    for (const bus of activeBuses) {
      for (const route of bus.routes) {
        const stops = route.stops.map(s => s.locationId);
        const transferIndex = stops.indexOf(transferStopId);
        const toIndex = stops.indexOf(toId);

        if (transferIndex === -1 || toIndex === -1) continue;

        const canReach = route.direction === 'both' ||
          (route.direction === 'up' && transferIndex < toIndex) ||
          (route.direction === 'down' && transferIndex > toIndex);

        if (!canReach) continue;

        // Check if the first bus is different from the second bus
        const fromOptions = fromBuses.get(transferStopId) || [];
        for (const fromOption of fromOptions) {
          if (fromOption.bus.id === bus.id) continue;

          const fromStops = fromOption.bus.routes[fromOption.routeIndex].stops.map(s => s.locationId);
          const fromIdx = fromStops.indexOf(fromId);
          const transferIdx = fromStops.indexOf(transferStopId);

          const start1 = Math.min(fromIdx, transferIdx);
          const end1 = Math.max(fromIdx, transferIdx);
          const seg1Stops = fromStops.slice(start1, end1 + 1);

          const start2 = Math.min(transferIndex, toIndex);
          const end2 = Math.max(transferIndex, toIndex);
          const seg2Stops = stops.slice(start2, end2 + 1);

          const segment1: JourneySegment = {
            bus: fromOption.bus,
            route: fromOption.bus.routes[fromOption.routeIndex],
            boardStop: fromId,
            alightStop: transferStopId,
            stops: seg1Stops,
            stopCount: seg1Stops.length - 1,
          };

          const segment2: JourneySegment = {
            bus,
            route,
            boardStop: transferStopId,
            alightStop: toId,
            stops: seg2Stops,
            stopCount: seg2Stops.length - 1,
          };

          const totalStops = seg1Stops.length - 1 + seg2Stops.length - 1;

          // Avoid duplicates
          const exists = results.some(r =>
            r.segments.length === 2 &&
            r.segments[0].bus.id === fromOption.bus.id &&
            r.segments[1].bus.id === bus.id &&
            r.segments[0].alightStop === transferStopId
          );

          if (!exists) {
            results.push({
              type: 'transfer',
              segments: [segment1, segment2],
              totalTransfers: 1,
              totalStops,
            });
          }
        }
      }
    }
  }

  // Sort by total stops and limit
  results.sort((a, b) => a.totalStops - b.totalStops);
  return results.slice(0, 5);
}
