import { Bus, JourneyResult, JourneySegment, Location, BusRoute } from '../types';

// Configuration
const MAX_TRANSFERS = 2;
const MAX_RESULTS = 8;
const TRANSFER_PENALTY = 3;
const SEARCH_TIMEOUT_MS = 5000; // 5 second timeout

interface RouteInfo {
  bus: Bus;
  route: BusRoute;
  stops: string[];
}

interface SearchResult {
  journey: JourneyResult;
  cost: number;
}

/**
 * Simple, guaranteed-to-complete route finder
 */
export function findRoutes(
  fromId: string,
  toId: string,
  buses: Bus[],
  getLocationById: (id: string) => Location | undefined
): JourneyResult[] {
  const startTime = Date.now();
  
  console.log('[RouteFinder] Starting search:', { fromId, toId, busCount: buses.length });

  // Edge cases
  if (fromId === toId) {
    console.log('[RouteFinder] Same origin and destination');
    return [];
  }

  if (!fromId || !toId) {
    console.log('[RouteFinder] Missing fromId or toId');
    return [];
  }

  try {
    // Build simple index
    const locationToRoutes = new Map<string, RouteInfo[]>();
    
    for (const bus of buses) {
      if (!bus.isActive || !bus.routes) continue;

      for (const route of bus.routes) {
        if (!route.stops || route.stops.length < 2) continue;

        const stops = route.stops.map(s => s.locationId).filter(id => id);
        if (stops.length < 2) continue;

        const routeInfo: RouteInfo = { bus, route, stops };

        for (const stopId of stops) {
          if (!locationToRoutes.has(stopId)) {
            locationToRoutes.set(stopId, []);
          }
          locationToRoutes.get(stopId)!.push(routeInfo);
        }
      }
    }

    console.log('[RouteFinder] Index built:', { locations: locationToRoutes.size });

    // Check if locations exist
    if (!locationToRoutes.has(fromId)) {
      console.log('[RouteFinder] Origin not found in routes');
      return [];
    }
    if (!locationToRoutes.has(toId)) {
      console.log('[RouteFinder] Destination not found in routes');
      return [];
    }

    const results: SearchResult[] = [];

    // Find direct routes
    console.log('[RouteFinder] Searching for direct routes...');
    const directRoutes = locationToRoutes.get(fromId) || [];
    
    for (const routeInfo of directRoutes) {
      // Timeout check
      if (Date.now() - startTime > SEARCH_TIMEOUT_MS) {
        console.log('[RouteFinder] Timeout reached during direct search');
        break;
      }

      const { bus, route, stops } = routeInfo;
      const fromIdx = stops.indexOf(fromId);
      const toIdx = stops.indexOf(toId);

      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) continue;

      // Check direction
      let isValid = false;
      if (route.direction === 'both') {
        isValid = true;
      } else if (route.direction === 'up' && fromIdx < toIdx) {
        isValid = true;
      } else if (route.direction === 'down' && fromIdx > toIdx) {
        isValid = true;
      }

      if (!isValid) continue;

      // Create segment
      const startIdx = Math.min(fromIdx, toIdx);
      const endIdx = Math.max(fromIdx, toIdx);
      const segmentStops = stops.slice(startIdx, endIdx + 1);

      const segment: JourneySegment = {
        bus,
        route,
        boardStop: fromId,
        alightStop: toId,
        stops: segmentStops,
        stopCount: segmentStops.length - 1,
      };

      const journey: JourneyResult = {
        type: 'direct',
        segments: [segment],
        totalTransfers: 0,
        totalStops: segmentStops.length - 1,
      };

      results.push({ journey, cost: journey.totalStops });
    }

    console.log('[RouteFinder] Direct routes found:', results.length);

    // Find 1-transfer routes
    if (results.length < MAX_RESULTS) {
      console.log('[RouteFinder] Searching for 1-transfer routes...');
      
      const fromRoutes = locationToRoutes.get(fromId) || [];
      
      for (const route1Info of fromRoutes) {
        if (Date.now() - startTime > SEARCH_TIMEOUT_MS) {
          console.log('[RouteFinder] Timeout reached during 1-transfer search');
          break;
        }

        const { bus: bus1, route: route1, stops: stops1 } = route1Info;
        const fromIdx = stops1.indexOf(fromId);
        if (fromIdx === -1) continue;

        // Try each stop on route1 as transfer point
        for (let i = 0; i < stops1.length; i++) {
          if (Date.now() - startTime > SEARCH_TIMEOUT_MS) break;

          const transferStop = stops1[i];
          if (transferStop === fromId || transferStop === toId) continue;

          // Check if we can reach transfer stop
          let canReachTransfer = false;
          if (route1.direction === 'both') {
            canReachTransfer = true;
          } else if (route1.direction === 'up' && fromIdx < i) {
            canReachTransfer = true;
          } else if (route1.direction === 'down' && fromIdx > i) {
            canReachTransfer = true;
          }

          if (!canReachTransfer) continue;

          // Find routes from transfer stop to destination
          const transferRoutes = locationToRoutes.get(transferStop) || [];
          
          for (const route2Info of transferRoutes) {
            if (Date.now() - startTime > SEARCH_TIMEOUT_MS) break;

            const { bus: bus2, route: route2, stops: stops2 } = route2Info;
            
            // Must be different bus
            if (bus1.id === bus2.id) continue;

            const transferIdx = stops2.indexOf(transferStop);
            const toIdx2 = stops2.indexOf(toId);

            if (transferIdx === -1 || toIdx2 === -1 || transferIdx === toIdx2) continue;

            // Check direction
            let canReachDest = false;
            if (route2.direction === 'both') {
              canReachDest = true;
            } else if (route2.direction === 'up' && transferIdx < toIdx2) {
              canReachDest = true;
            } else if (route2.direction === 'down' && transferIdx > toIdx2) {
              canReachDest = true;
            }

            if (!canReachDest) continue;

            // Create segments
            const start1 = Math.min(fromIdx, i);
            const end1 = Math.max(fromIdx, i);
            const seg1Stops = stops1.slice(start1, end1 + 1);

            const start2 = Math.min(transferIdx, toIdx2);
            const end2 = Math.max(transferIdx, toIdx2);
            const seg2Stops = stops2.slice(start2, end2 + 1);

            const segment1: JourneySegment = {
              bus: bus1,
              route: route1,
              boardStop: fromId,
              alightStop: transferStop,
              stops: seg1Stops,
              stopCount: seg1Stops.length - 1,
            };

            const segment2: JourneySegment = {
              bus: bus2,
              route: route2,
              boardStop: transferStop,
              alightStop: toId,
              stops: seg2Stops,
              stopCount: seg2Stops.length - 1,
            };

            const totalStops = seg1Stops.length - 1 + seg2Stops.length - 1;

            const journey: JourneyResult = {
              type: 'transfer',
              segments: [segment1, segment2],
              totalTransfers: 1,
              totalStops,
            };

            const cost = totalStops + TRANSFER_PENALTY;
            results.push({ journey, cost });

            // Limit results
            if (results.length >= MAX_RESULTS * 3) break;
          }

          if (results.length >= MAX_RESULTS * 3) break;
        }

        if (results.length >= MAX_RESULTS * 3) break;
      }

      console.log('[RouteFinder] Total routes found:', results.length);
    }

    // Remove duplicates
    const uniqueResults: SearchResult[] = [];
    for (const result of results) {
      const isDupe = uniqueResults.some(r => {
        if (r.journey.segments.length !== result.journey.segments.length) return false;
        for (let i = 0; i < r.journey.segments.length; i++) {
          if (r.journey.segments[i].bus.id !== result.journey.segments[i].bus.id) return false;
          if (r.journey.segments[i].boardStop !== result.journey.segments[i].boardStop) return false;
          if (r.journey.segments[i].alightStop !== result.journey.segments[i].alightStop) return false;
        }
        return true;
      });

      if (!isDupe) {
        uniqueResults.push(result);
      }
    }

    // Find best direct
    const directResults = uniqueResults.filter(r => r.journey.totalTransfers === 0);
    const bestDirect = directResults.length > 0
      ? directResults.reduce((best, r) => r.cost < best.cost ? r : best)
      : null;

    // Categorize
    const categorized = uniqueResults.map(result => {
      let category: 'recommended' | 'direct' | 'fewer_stops' | 'alternative' = 'alternative';
      let reason = '';

      if (result.journey.totalTransfers === 0) {
        category = 'direct';
        reason = 'Direct — no transfer';
      } else if (bestDirect && result.journey.totalStops < bestDirect.journey.totalStops - 2) {
        category = 'fewer_stops';
        const saved = bestDirect.journey.totalStops - result.journey.totalStops;
        reason = `${saved} fewer stops than direct`;
      } else if (result.cost <= (bestDirect ? bestDirect.cost : Infinity) + 2) {
        category = 'recommended';
        reason = result.journey.totalTransfers === 1 ? 'Simple 1-transfer route' : 'Efficient journey';
      } else {
        category = 'alternative';
        reason = 'Alternative route';
      }

      return { ...result, category, reason };
    });

    // Sort by cost
    categorized.sort((a, b) => a.cost - b.cost);

    // Ensure we have a recommended
    if (categorized.length > 0 && !categorized.some(c => c.category === 'recommended')) {
      categorized[0].category = 'recommended';
      categorized[0].reason = categorized[0].journey.totalTransfers === 0
        ? 'Direct — no transfer'
        : 'Recommended journey';
    }

    // Limit and format
    const finalResults = categorized.slice(0, MAX_RESULTS).map(c => ({
      ...c.journey,
      category: c.category,
      reason: c.reason,
    }));

    const elapsed = Date.now() - startTime;
    console.log('[RouteFinder] Search complete:', {
      time: `${elapsed}ms`,
      results: finalResults.length,
    });

    return finalResults;

  } catch (error) {
    console.error('[RouteFinder] Error during search:', error);
    return [];
  }
}
