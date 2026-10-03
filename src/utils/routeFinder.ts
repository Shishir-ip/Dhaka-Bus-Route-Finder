import { Bus, JourneyResult, JourneySegment, Location, BusRoute } from '../types';

// Configuration
const MAX_TRANSFERS = 2; // Maximum number of transfers to search
const MAX_RESULTS = 8; // Maximum results to return
const TRANSFER_PENALTY = 3; // Penalty for each transfer in scoring

// Journey state for BFS search
interface JourneyState {
  currentLocation: string;
  destination: string;
  segments: JourneySegment[];
  visitedLocations: Set<string>;
  usedBuses: Set<string>;
  totalStops: number;
  totalTransfers: number;
}

// Route graph index for efficient searching
interface RouteGraph {
  // locationId -> array of { bus, route, stopIndex }
  locationToRoutes: Map<string, Array<{
    bus: Bus;
    route: BusRoute;
    stopIndex: number;
  }>>;
}

/**
 * Build an efficient index of the route network
 */
function buildRouteGraph(buses: Bus[]): RouteGraph {
  const locationToRoutes = new Map<string, Array<{
    bus: Bus;
    route: BusRoute;
    stopIndex: number;
  }>>();

  for (const bus of buses) {
    if (!bus.isActive) continue;

    for (const route of bus.routes) {
      for (let i = 0; i < route.stops.length; i++) {
        const locationId = route.stops[i].locationId;
        
        if (!locationToRoutes.has(locationId)) {
          locationToRoutes.set(locationId, []);
        }
        
        locationToRoutes.get(locationId)!.push({
          bus,
          route,
          stopIndex: i,
        });
      }
    }
  }

  return { locationToRoutes };
}

/**
 * Check if we can travel from one stop to another on a route
 */
function canTravelOnRoute(
  route: BusRoute,
  fromIndex: number,
  toIndex: number
): boolean {
  if (fromIndex === toIndex) return false;

  if (route.direction === 'both') {
    return true;
  } else if (route.direction === 'up') {
    return fromIndex < toIndex;
  } else if (route.direction === 'down') {
    return fromIndex > toIndex;
  }

  return false;
}

/**
 * Get the stops between two indices on a route
 */
function getStopsBetween(
  route: BusRoute,
  fromIndex: number,
  toIndex: number
): string[] {
  const stops = route.stops.map(s => s.locationId);
  
  if (route.direction === 'down' && fromIndex > toIndex) {
    // Reverse direction
    return stops.slice(toIndex, fromIndex + 1).reverse();
  } else {
    // Forward direction
    return stops.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
  }
}

/**
 * Calculate journey score (lower is better)
 */
function calculateScore(journey: JourneyResult): number {
  // Base score is total stops
  let score = journey.totalStops;
  
  // Add penalty for each transfer
  score += journey.totalTransfers * TRANSFER_PENALTY;
  
  // Small penalty for number of buses (encourages simpler journeys)
  score += journey.segments.length * 0.5;
  
  return score;
}

/**
 * Check if two journeys are duplicates
 */
function isDuplicate(j1: JourneyResult, j2: JourneyResult): boolean {
  if (j1.segments.length !== j2.segments.length) return false;
  
  for (let i = 0; i < j1.segments.length; i++) {
    const s1 = j1.segments[i];
    const s2 = j2.segments[i];
    
    if (s1.bus.id !== s2.bus.id) return false;
    if (s1.boardStop !== s2.boardStop) return false;
    if (s1.alightStop !== s2.alightStop) return false;
  }
  
  return true;
}

/**
 * Find all routes from origin to destination
 */
export function findRoutes(
  fromId: string,
  toId: string,
  buses: Bus[],
  getLocationById: (id: string) => Location | undefined
): JourneyResult[] {
  // Edge cases
  if (fromId === toId) return [];
  
  // Build route graph
  const graph = buildRouteGraph(buses);
  
  // Find all possible journeys using BFS
  const allJourneys: JourneyResult[] = [];
  
  // BFS queue
  const queue: JourneyState[] = [{
    currentLocation: fromId,
    destination: toId,
    segments: [],
    visitedLocations: new Set([fromId]),
    usedBuses: new Set(),
    totalStops: 0,
    totalTransfers: 0,
  }];
  
  while (queue.length > 0) {
    const state = queue.shift()!;
    
    // If we've reached the destination, save this journey
    if (state.currentLocation === toId && state.segments.length > 0) {
      const journey: JourneyResult = {
        type: state.totalTransfers === 0 ? 'direct' : 'transfer',
        segments: state.segments,
        totalTransfers: state.totalTransfers,
        totalStops: state.totalStops,
      };
      
      allJourneys.push(journey);
      continue; // Don't explore further from destination
    }
    
    // If we've exceeded max transfers, stop exploring
    if (state.totalTransfers > MAX_TRANSFERS) continue;
    
    // Get all routes that pass through current location
    const routesAtLocation = graph.locationToRoutes.get(state.currentLocation) || [];
    
    for (const { bus, route, stopIndex: fromStopIndex } of routesAtLocation) {
      // Skip if we've already used this bus
      if (state.usedBuses.has(bus.id)) continue;
      
      // Try to reach destination or intermediate stops
      const routeStops = route.stops.map(s => s.locationId);
      
      for (let toStopIndex = 0; toStopIndex < routeStops.length; toStopIndex++) {
        const nextLocation = routeStops[toStopIndex];
        
        // Skip if we can't travel to this stop
        if (!canTravelOnRoute(route, fromStopIndex, toStopIndex)) continue;
        
        // Skip if we've visited this location (prevent loops)
        if (state.visitedLocations.has(nextLocation) && nextLocation !== toId) continue;
        
        // Create new segment
        const stops = getStopsBetween(route, fromStopIndex, toStopIndex);
        const segment: JourneySegment = {
          bus,
          route,
          boardStop: state.currentLocation,
          alightStop: nextLocation,
          stops,
          stopCount: stops.length - 1,
        };
        
        // Create new state
        const newVisited = new Set(state.visitedLocations);
        newVisited.add(nextLocation);
        
        const newUsedBuses = new Set(state.usedBuses);
        newUsedBuses.add(bus.id);
        
        const newSegments = [...state.segments, segment];
        const newTransfers = state.segments.length > 0 ? state.totalTransfers + 1 : 0;
        
        queue.push({
          currentLocation: nextLocation,
          destination: toId,
          segments: newSegments,
          visitedLocations: newVisited,
          usedBuses: newUsedBuses,
          totalStops: state.totalStops + segment.stopCount,
          totalTransfers: newTransfers,
        });
      }
    }
  }
  
  // Remove duplicates
  const uniqueJourneys: JourneyResult[] = [];
  for (const journey of allJourneys) {
    const isDupe = uniqueJourneys.some(j => isDuplicate(j, journey));
    if (!isDupe) {
      uniqueJourneys.push(journey);
    }
  }
  
  // Find best direct journey (if any)
  const directJourneys = uniqueJourneys.filter(j => j.totalTransfers === 0);
  const bestDirect = directJourneys.length > 0
    ? directJourneys.reduce((best, j) => calculateScore(j) < calculateScore(best) ? j : best)
    : null;
  
  // Categorize and score all journeys
  const categorizedJourneys = uniqueJourneys.map(journey => {
    const score = calculateScore(journey);
    let category: 'recommended' | 'direct' | 'fewer_stops' | 'alternative' = 'alternative';
    let reason = '';
    
    // Determine category
    if (journey.totalTransfers === 0) {
      category = 'direct';
      reason = 'Direct — no transfer';
    } else if (bestDirect && journey.totalStops < bestDirect.totalStops - 2) {
      // Significantly fewer stops (more than 2 stops saved)
      category = 'fewer_stops';
      const saved = bestDirect.totalStops - journey.totalStops;
      reason = `${saved} fewer stops than direct`;
    } else if (score <= (bestDirect ? calculateScore(bestDirect) : Infinity) + 2) {
      // Good score, close to best
      category = 'recommended';
      if (journey.totalTransfers === 1) {
        reason = 'Simple 1-transfer route';
      } else {
        reason = 'Efficient journey';
      }
    } else {
      category = 'alternative';
      reason = 'Alternative route';
    }
    
    return { journey, score, category, reason };
  });
  
  // Sort by score
  categorizedJourneys.sort((a, b) => a.score - b.score);
  
  // Ensure we have a recommended journey
  if (categorizedJourneys.length > 0 && !categorizedJourneys.some(j => j.category === 'recommended')) {
    categorizedJourneys[0].category = 'recommended';
    categorizedJourneys[0].reason = categorizedJourneys[0].journey.totalTransfers === 0
      ? 'Direct — no transfer'
      : 'Recommended journey';
  }
  
  // Limit results
  const finalResults = categorizedJourneys.slice(0, MAX_RESULTS).map(cj => ({
    ...cj.journey,
    category: cj.category,
    reason: cj.reason,
  }));
  
  return finalResults;
}
