import { Bus, JourneyResult, JourneySegment, Location, BusRoute } from '../types';

// Configuration with safety limits
const MAX_TRANSFERS = 2;
const MAX_RESULTS = 10;
const TRANSFER_PENALTY = 3;
const MAX_STATES_EXPLORED = 10000; // Hard limit to prevent freeze
const SEARCH_TIMEOUT_MS = 3000; // 3 second timeout

interface RouteInfo {
  bus: Bus;
  route: BusRoute;
  stops: string[];
}

/**
 * Check if we can travel from one index to another on a route
 */
function canTravel(route: BusRoute, fromIdx: number, toIdx: number): boolean {
  if (fromIdx === toIdx) return false;
  
  if (route.direction === 'both') return true;
  if (route.direction === 'up') return fromIdx < toIdx;
  if (route.direction === 'down') return fromIdx > toIdx;
  
  return false;
}

/**
 * Get stops between two indices (in correct order)
 */
function getStopsBetween(stops: string[], fromIdx: number, toIdx: number, direction: string): string[] {
  if (direction === 'down' && fromIdx > toIdx) {
    return stops.slice(toIdx, fromIdx + 1).reverse();
  }
  return stops.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
}

/**
 * Build route index - maps each location to all routes passing through it
 */
function buildRouteIndex(buses: Bus[]): Map<string, RouteInfo[]> {
  const index = new Map<string, RouteInfo[]>();
  
  for (const bus of buses) {
    if (!bus.isActive || !bus.routes) continue;
    
    for (const route of bus.routes) {
      if (!route.stops || route.stops.length < 2) continue;
      
      const stops = route.stops.map(s => s.locationId).filter(id => id);
      if (stops.length < 2) continue;
      
      const routeInfo: RouteInfo = { bus, route, stops };
      
      // Add this route to each location it passes through
      for (const stopId of stops) {
        if (!index.has(stopId)) {
          index.set(stopId, []);
        }
        index.get(stopId)!.push(routeInfo);
      }
    }
  }
  
  return index;
}

/**
 * Find all direct routes from origin to destination
 */
function findDirectRoutes(
  fromId: string,
  toId: string,
  routeIndex: Map<string, RouteInfo[]>
): JourneyResult[] {
  const results: JourneyResult[] = [];
  const routesFromOrigin = routeIndex.get(fromId) || [];
  
  for (const routeInfo of routesFromOrigin) {
    const { bus, route, stops } = routeInfo;
    const fromIdx = stops.indexOf(fromId);
    const toIdx = stops.indexOf(toId);
    
    if (fromIdx === -1 || toIdx === -1) continue;
    if (!canTravel(route, fromIdx, toIdx)) continue;
    
    const segmentStops = getStopsBetween(stops, fromIdx, toIdx, route.direction);
    
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
  
  return results;
}

/**
 * Find 1-transfer routes with performance limits
 */
function findOneTransferRoutes(
  fromId: string,
  toId: string,
  routeIndex: Map<string, RouteInfo[]>,
  startTime: number,
  statesExplored: { count: number }
): JourneyResult[] {
  const results: JourneyResult[] = [];
  const routesFromOrigin = routeIndex.get(fromId) || [];
  
  for (const route1Info of routesFromOrigin) {
    // Check timeout and state limit
    if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
      break;
    }
    
    const { bus: bus1, route: route1, stops: stops1 } = route1Info;
    const fromIdx = stops1.indexOf(fromId);
    if (fromIdx === -1) continue;
    
    // Try each stop on route1 as a potential transfer point
    for (let i = 0; i < stops1.length; i++) {
      if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
        break;
      }
      
      const transferStop = stops1[i];
      
      // Skip if it's origin or destination
      if (transferStop === fromId || transferStop === toId) continue;
      
      // Check if we can reach this transfer stop from origin
      if (!canTravel(route1, fromIdx, i)) continue;
      
      statesExplored.count++;
      
      // Find all routes from transfer stop to destination
      const routesFromTransfer = routeIndex.get(transferStop) || [];
      
      for (const route2Info of routesFromTransfer) {
        if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
          break;
        }
        
        const { bus: bus2, route: route2, stops: stops2 } = route2Info;
        
        // Must be different bus
        if (bus1.id === bus2.id) continue;
        
        const transferIdx = stops2.indexOf(transferStop);
        const toIdx = stops2.indexOf(toId);
        
        if (transferIdx === -1 || toIdx === -1) continue;
        if (!canTravel(route2, transferIdx, toIdx)) continue;
        
        statesExplored.count++;
        
        // Create segments
        const seg1Stops = getStopsBetween(stops1, fromIdx, i, route1.direction);
        const seg2Stops = getStopsBetween(stops2, transferIdx, toIdx, route2.direction);
        
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
        
        results.push({
          type: 'transfer',
          segments: [segment1, segment2],
          totalTransfers: 1,
          totalStops,
        });
        
        // Early termination if we have enough results
        if (results.length >= 50) break;
      }
      
      if (results.length >= 50) break;
    }
    
    if (results.length >= 50) break;
  }
  
  return results;
}

/**
 * Find 2-transfer routes with performance limits
 */
function findTwoTransferRoutes(
  fromId: string,
  toId: string,
  routeIndex: Map<string, RouteInfo[]>,
  startTime: number,
  statesExplored: { count: number }
): JourneyResult[] {
  const results: JourneyResult[] = [];
  const routesFromOrigin = routeIndex.get(fromId) || [];
  
  for (const route1Info of routesFromOrigin) {
    if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
      break;
    }
    
    const { bus: bus1, route: route1, stops: stops1 } = route1Info;
    const fromIdx = stops1.indexOf(fromId);
    if (fromIdx === -1) continue;
    
    // Try each stop on route1 as first transfer point
    for (let i = 0; i < stops1.length; i++) {
      if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
        break;
      }
      
      const transfer1 = stops1[i];
      if (transfer1 === fromId || transfer1 === toId) continue;
      if (!canTravel(route1, fromIdx, i)) continue;
      
      statesExplored.count++;
      
      // Find routes from first transfer point
      const routesFromTransfer1 = routeIndex.get(transfer1) || [];
      
      for (const route2Info of routesFromTransfer1) {
        if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
          break;
        }
        
        const { bus: bus2, route: route2, stops: stops2 } = route2Info;
        
        if (bus1.id === bus2.id) continue;
        
        const transfer1Idx = stops2.indexOf(transfer1);
        if (transfer1Idx === -1) continue;
        
        // Try each stop on route2 as second transfer point
        for (let j = 0; j < stops2.length; j++) {
          if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
            break;
          }
          
          const transfer2 = stops2[j];
          if (transfer2 === fromId || transfer2 === toId || transfer2 === transfer1) continue;
          if (!canTravel(route2, transfer1Idx, j)) continue;
          
          statesExplored.count++;
          
          // Find routes from second transfer point to destination
          const routesFromTransfer2 = routeIndex.get(transfer2) || [];
          
          for (const route3Info of routesFromTransfer2) {
            if (Date.now() - startTime > SEARCH_TIMEOUT_MS || statesExplored.count > MAX_STATES_EXPLORED) {
              break;
            }
            
            const { bus: bus3, route: route3, stops: stops3 } = route3Info;
            
            if (bus1.id === bus3.id || bus2.id === bus3.id) continue;
            
            const transfer2Idx = stops3.indexOf(transfer2);
            const toIdx = stops3.indexOf(toId);
            
            if (transfer2Idx === -1 || toIdx === -1) continue;
            if (!canTravel(route3, transfer2Idx, toIdx)) continue;
            
            statesExplored.count++;
            
            // Create segments
            const seg1Stops = getStopsBetween(stops1, fromIdx, i, route1.direction);
            const seg2Stops = getStopsBetween(stops2, transfer1Idx, j, route2.direction);
            const seg3Stops = getStopsBetween(stops3, transfer2Idx, toIdx, route3.direction);
            
            const segment1: JourneySegment = {
              bus: bus1,
              route: route1,
              boardStop: fromId,
              alightStop: transfer1,
              stops: seg1Stops,
              stopCount: seg1Stops.length - 1,
            };
            
            const segment2: JourneySegment = {
              bus: bus2,
              route: route2,
              boardStop: transfer1,
              alightStop: transfer2,
              stops: seg2Stops,
              stopCount: seg2Stops.length - 1,
            };
            
            const segment3: JourneySegment = {
              bus: bus3,
              route: route3,
              boardStop: transfer2,
              alightStop: toId,
              stops: seg3Stops,
              stopCount: seg3Stops.length - 1,
            };
            
            const totalStops = seg1Stops.length - 1 + seg2Stops.length - 1 + seg3Stops.length - 1;
            
            results.push({
              type: 'transfer',
              segments: [segment1, segment2, segment3],
              totalTransfers: 2,
              totalStops,
            });
            
            // Early termination
            if (results.length >= 30) break;
          }
          
          if (results.length >= 30) break;
        }
        
        if (results.length >= 30) break;
      }
      
      if (results.length >= 30) break;
    }
    
    if (results.length >= 30) break;
  }
  
  return results;
}

/**
 * Remove duplicate journeys
 */
function removeDuplicates(journeys: JourneyResult[]): JourneyResult[] {
  const unique: JourneyResult[] = [];
  
  for (const journey of journeys) {
    const isDuplicate = unique.some(u => {
      if (u.segments.length !== journey.segments.length) return false;
      
      for (let i = 0; i < u.segments.length; i++) {
        if (u.segments[i].bus.id !== journey.segments[i].bus.id) return false;
        if (u.segments[i].boardStop !== journey.segments[i].boardStop) return false;
        if (u.segments[i].alightStop !== journey.segments[i].alightStop) return false;
      }
      
      return true;
    });
    
    if (!isDuplicate) {
      unique.push(journey);
    }
  }
  
  return unique;
}

/**
 * Main route finding function with performance safeguards
 */
export function findRoutes(
  fromId: string,
  toId: string,
  buses: Bus[],
  getLocationById: (id: string) => Location | undefined
): JourneyResult[] {
  const startTime = Date.now();
  const statesExplored = { count: 0 };
  
  console.log('[RouteFinder] Starting search:', { fromId, toId, busCount: buses.length });
  
  // Edge cases
  if (fromId === toId) return [];
  if (!fromId || !toId) return [];
  
  try {
    // Build route index
    const routeIndex = buildRouteIndex(buses);
    console.log('[RouteFinder] Route index built:', { locations: routeIndex.size });
    
    // Check if locations exist
    if (!routeIndex.has(fromId)) {
      console.log('[RouteFinder] Origin not found in any route');
      return [];
    }
    if (!routeIndex.has(toId)) {
      console.log('[RouteFinder] Destination not found in any route');
      return [];
    }
    
    // Find all route types with performance limits
    console.log('[RouteFinder] Finding direct routes...');
    const directRoutes = findDirectRoutes(fromId, toId, routeIndex);
    console.log('[RouteFinder] Direct routes found:', directRoutes.length);
    
    console.log('[RouteFinder] Finding 1-transfer routes...');
    const oneTransferRoutes = findOneTransferRoutes(fromId, toId, routeIndex, startTime, statesExplored);
    console.log('[RouteFinder] 1-transfer routes found:', oneTransferRoutes.length);
    
    console.log('[RouteFinder] Finding 2-transfer routes...');
    const twoTransferRoutes = findTwoTransferRoutes(fromId, toId, routeIndex, startTime, statesExplored);
    console.log('[RouteFinder] 2-transfer routes found:', twoTransferRoutes.length);
    
    // Combine all results
    let allRoutes = [
      ...directRoutes,
      ...oneTransferRoutes,
      ...twoTransferRoutes,
    ];
    
    console.log('[RouteFinder] Total routes before dedup:', allRoutes.length);
    
    // Remove duplicates
    allRoutes = removeDuplicates(allRoutes);
    console.log('[RouteFinder] Total routes after dedup:', allRoutes.length);
    
    // Find best direct route for comparison
    const directOnly = allRoutes.filter(r => r.totalTransfers === 0);
    const bestDirect = directOnly.length > 0
      ? directOnly.reduce((best, r) => r.totalStops < best.totalStops ? r : best)
      : null;
    
    // Categorize and score
    const categorized = allRoutes.map(journey => {
      const cost = journey.totalStops + (journey.totalTransfers * TRANSFER_PENALTY);
      let category: 'recommended' | 'direct' | 'fewer_stops' | 'alternative' = 'alternative';
      let reason = '';
      
      if (journey.totalTransfers === 0) {
        category = 'direct';
        reason = 'Direct — no transfer';
      } else if (bestDirect && journey.totalStops < bestDirect.totalStops - 2) {
        category = 'fewer_stops';
        const saved = bestDirect.totalStops - journey.totalStops;
        reason = `${saved} fewer stops than direct`;
      } else if (cost <= (bestDirect ? bestDirect.totalStops : Infinity) + 2) {
        category = 'recommended';
        reason = journey.totalTransfers === 1 ? 'Simple 1-transfer route' : 'Efficient journey';
      } else {
        category = 'alternative';
        reason = 'Alternative route';
      }
      
      return { journey, cost, category, reason };
    });
    
    // Sort by cost (lower is better)
    categorized.sort((a, b) => a.cost - b.cost);
    
    // Ensure we have a recommended
    if (categorized.length > 0 && !categorized.some(c => c.category === 'recommended')) {
      categorized[0].category = 'recommended';
      categorized[0].reason = categorized[0].journey.totalTransfers === 0
        ? 'Direct — no transfer'
        : 'Recommended journey';
    }
    
    // Limit results
    const finalResults = categorized.slice(0, MAX_RESULTS).map(c => ({
      ...c.journey,
      category: c.category,
      reason: c.reason,
    }));
    
    const elapsed = Date.now() - startTime;
    console.log('[RouteFinder] Search complete:', {
      time: `${elapsed}ms`,
      statesExplored: statesExplored.count,
      results: finalResults.length,
    });
    
    return finalResults;
    
  } catch (error) {
    console.error('[RouteFinder] Error during search:', error);
    return [];
  }
}
