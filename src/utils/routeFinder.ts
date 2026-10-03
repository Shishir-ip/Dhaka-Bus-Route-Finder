import { Bus, JourneyResult, JourneySegment, Location, BusRoute } from '../types';

// Configuration - STRICT LIMITS
const MAX_TRANSFERS = 2;
const MAX_RESULTS = 8;
const MAX_STATES_EXPLORED = 5000; // Hard limit to prevent freeze
const TRANSFER_PENALTY = 3;

// Pre-computed route data for efficiency
interface RouteData {
  bus: Bus;
  route: BusRoute;
  stops: string[]; // Pre-computed stop array
}

// Index structure
interface RouteIndex {
  // locationId -> routes that contain this location
  locationToRoutes: Map<string, RouteData[]>;
  // routeId -> route data
  routeById: Map<string, RouteData>;
}

// Search state - compact representation
interface SearchState {
  locationId: string;
  transfers: number;
  segments: JourneySegment[];
  visitedLocations: string[]; // Use array instead of Set for efficiency
  usedBusIds: string[]; // Use array instead of Set
  totalStops: number;
  cost: number; // For priority queue
}

// Visited state key for deduplication
type StateKey = string;

/**
 * Build efficient route index ONCE
 */
function buildRouteIndex(buses: Bus[]): RouteIndex {
  const locationToRoutes = new Map<string, RouteData[]>();
  const routeById = new Map<string, RouteData>();

  for (const bus of buses) {
    if (!bus.isActive) continue;

    for (const route of bus.routes) {
      // Validate route
      if (!route.stops || route.stops.length < 2) continue;

      // Pre-compute stops array ONCE
      const stops = route.stops.map(s => s.locationId);
      
      // Validate no duplicate consecutive stops
      let valid = true;
      for (let i = 1; i < stops.length; i++) {
        if (stops[i] === stops[i - 1]) {
          valid = false;
          break;
        }
      }
      if (!valid) continue;

      const routeData: RouteData = { bus, route, stops };
      routeById.set(route.id, routeData);

      // Index by location
      for (const locationId of stops) {
        if (!locationToRoutes.has(locationId)) {
          locationToRoutes.set(locationId, []);
        }
        locationToRoutes.get(locationId)!.push(routeData);
      }
    }
  }

  return { locationToRoutes, routeById };
}

/**
 * Check if travel is valid on route in given direction
 */
function canTravel(route: BusRoute, fromIdx: number, toIdx: number): boolean {
  if (fromIdx === toIdx) return false;
  
  switch (route.direction) {
    case 'both':
      return true;
    case 'up':
      return fromIdx < toIdx;
    case 'down':
      return fromIdx > toIdx;
    default:
      return false;
  }
}

/**
 * Get stops between indices (preserving direction)
 */
function getStopsBetween(stops: string[], fromIdx: number, toIdx: number, direction: string): string[] {
  if (direction === 'down' && fromIdx > toIdx) {
    return stops.slice(toIdx, fromIdx + 1).reverse();
  }
  return stops.slice(Math.min(fromIdx, toIdx), Math.max(fromIdx, toIdx) + 1);
}

/**
 * Calculate journey cost
 */
function calculateCost(totalStops: number, transfers: number): number {
  return totalStops + (transfers * TRANSFER_PENALTY);
}

/**
 * Create state key for visited tracking
 */
function createStateKey(locationId: string, transfers: number, usedBusIds: string[]): StateKey {
  // Sort bus IDs for consistent key
  const sortedBuses = [...usedBusIds].sort().join(',');
  return `${locationId}|${transfers}|${sortedBuses}`;
}

/**
 * Check if journey is duplicate
 */
function isDuplicate(j1: JourneyResult, j2: JourneyResult): boolean {
  if (j1.segments.length !== j2.segments.length) return false;
  
  for (let i = 0; i < j1.segments.length; i++) {
    if (j1.segments[i].bus.id !== j2.segments[i].bus.id) return false;
    if (j1.segments[i].boardStop !== j2.segments[i].boardStop) return false;
    if (j1.segments[i].alightStop !== j2.segments[i].alightStop) return false;
  }
  
  return true;
}

/**
 * Main route finding function - OPTIMIZED
 */
export function findRoutes(
  fromId: string,
  toId: string,
  buses: Bus[],
  getLocationById: (id: string) => Location | undefined
): JourneyResult[] {
  const startTime = performance.now();
  
  // Edge cases
  if (fromId === toId) return [];
  if (!fromId || !toId) return [];

  // Build index ONCE
  const index = buildRouteIndex(buses);
  
  // Validate locations exist
  if (!index.locationToRoutes.has(fromId) || !index.locationToRoutes.has(toId)) {
    return [];
  }

  const results: JourneyResult[] = [];
  const visited = new Map<StateKey, number>(); // stateKey -> best cost
  let statesExplored = 0;

  // Priority queue (simple array, sorted by cost)
  const queue: SearchState[] = [{
    locationId: fromId,
    transfers: 0,
    segments: [],
    visitedLocations: [fromId],
    usedBusIds: [],
    totalStops: 0,
    cost: 0,
  }];

  // BFS with priority and limits
  while (queue.length > 0 && statesExplored < MAX_STATES_EXPLORED) {
    // Get lowest cost state
    queue.sort((a, b) => a.cost - b.cost);
    const state = queue.shift()!;
    
    statesExplored++;

    // Check if reached destination
    if (state.locationId === toId && state.segments.length > 0) {
      const journey: JourneyResult = {
        type: state.transfers === 0 ? 'direct' : 'transfer',
        segments: state.segments,
        totalTransfers: state.transfers,
        totalStops: state.totalStops,
      };
      results.push(journey);
      
      // Early termination if we have enough good results
      if (results.length >= MAX_RESULTS * 2) break;
      continue;
    }

    // Skip if exceeded max transfers
    if (state.transfers > MAX_TRANSFERS) continue;

    // Skip if cost is too high
    if (state.totalStops > 50) continue; // Reasonable upper bound

    // Check visited state
    const stateKey = createStateKey(state.locationId, state.transfers, state.usedBusIds);
    const bestCost = visited.get(stateKey);
    if (bestCost !== undefined && bestCost <= state.cost) {
      continue; // Already found better path to this state
    }
    visited.set(stateKey, state.cost);

    // Get routes at current location
    const routesAtLocation = index.locationToRoutes.get(state.locationId) || [];

    // Explore each route
    for (const routeData of routesAtLocation) {
      const { bus, route, stops } = routeData;

      // Skip if already used this bus
      if (state.usedBusIds.includes(bus.id)) continue;

      // Find current location in route
      const fromIdx = stops.indexOf(state.locationId);
      if (fromIdx === -1) continue;

      // Try each reachable stop
      for (let toIdx = 0; toIdx < stops.length; toIdx++) {
        if (!canTravel(route, fromIdx, toIdx)) continue;

        const nextLocationId = stops[toIdx];

        // Skip if already visited (prevent loops)
        if (state.visitedLocations.includes(nextLocationId) && nextLocationId !== toId) {
          continue;
        }

        // Calculate segment
        const segmentStops = getStopsBetween(stops, fromIdx, toIdx, route.direction);
        const segment: JourneySegment = {
          bus,
          route,
          boardStop: state.locationId,
          alightStop: nextLocationId,
          stops: segmentStops,
          stopCount: segmentStops.length - 1,
        };

        // Create new state (efficient - reuse arrays where possible)
        const newVisitedLocations = [...state.visitedLocations, nextLocationId];
        const newUsedBusIds = [...state.usedBusIds, bus.id];
        const newSegments = [...state.segments, segment];
        const newTransfers = state.segments.length > 0 ? state.transfers + 1 : 0;
        const newTotalStops = state.totalStops + segment.stopCount;
        const newCost = calculateCost(newTotalStops, newTransfers);

        queue.push({
          locationId: nextLocationId,
          transfers: newTransfers,
          segments: newSegments,
          visitedLocations: newVisitedLocations,
          usedBusIds: newUsedBusIds,
          totalStops: newTotalStops,
          cost: newCost,
        });
      }
    }
  }

  // Remove duplicates
  const uniqueResults: JourneyResult[] = [];
  for (const journey of results) {
    if (!uniqueResults.some(j => isDuplicate(j, journey))) {
      uniqueResults.push(journey);
    }
  }

  // Find best direct for comparison
  const directJourneys = uniqueResults.filter(j => j.totalTransfers === 0);
  const bestDirect = directJourneys.length > 0
    ? directJourneys.reduce((best, j) => calculateCost(j.totalStops, 0) < calculateCost(best.totalStops, 0) ? j : best)
    : null;

  // Categorize results
  const categorized = uniqueResults.map(journey => {
    const cost = calculateCost(journey.totalStops, journey.totalTransfers);
    let category: 'recommended' | 'direct' | 'fewer_stops' | 'alternative' = 'alternative';
    let reason = '';

    if (journey.totalTransfers === 0) {
      category = 'direct';
      reason = 'Direct — no transfer';
    } else if (bestDirect && journey.totalStops < bestDirect.totalStops - 2) {
      category = 'fewer_stops';
      const saved = bestDirect.totalStops - journey.totalStops;
      reason = `${saved} fewer stops than direct`;
    } else if (cost <= (bestDirect ? calculateCost(bestDirect.totalStops, 0) : Infinity) + 2) {
      category = 'recommended';
      reason = journey.totalTransfers === 1 ? 'Simple 1-transfer route' : 'Efficient journey';
    } else {
      category = 'alternative';
      reason = 'Alternative route';
    }

    return { journey, cost, category, reason };
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

  // Limit and format results
  const finalResults = categorized.slice(0, MAX_RESULTS).map(c => ({
    ...c.journey,
    category: c.category,
    reason: c.reason,
  }));

  // Debug logging
  const endTime = performance.now();
  console.debug({
    searchTime: `${(endTime - startTime).toFixed(2)}ms`,
    statesExplored,
    resultsFound: finalResults.length,
    fromId,
    toId,
  });

  return finalResults;
}
