export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ApiResponse {
  contents: {
    uri: string;
    mimeType: string;
    text: string;
  }[];
}

/**
 * Flightradar24 API Types
 */

export interface FlightPosition {
  fr24_id: string;
  hex: string;
  callsign: string;
  lat: number;
  lon: number;
  track: number;
  alt: number;
  gspeed: number;
  vspeed: number;
  squawk: string;
  timestamp: string;
  source: 'ADSB' | 'MLAT' | 'ESTIMATED';
}

export interface FlightPositionsResponse {
  data: FlightPosition[];
}

export interface FlightETA {
  flight_number: string;
  departure: {
    airport: string;
    scheduled: string;
    actual: string;
    delay?: number;
  };
  arrival: {
    airport: string;
    scheduled: string;
    estimated: string;
    delay?: number;
  };
  status: 'scheduled' | 'active' | 'landed' | 'cancelled';
}

export interface FlightETAResponse {
  data: FlightETA;
}

export interface FlightTrackingParams {
  bounds?: string;
  flights?: string;
  callsigns?: string;
  registrations?: string;
  painted_as?: string;
  operating_as?: string;
  airports?: string;
  routes?: string;
  aircraft?: string;
  altitude_ranges?: string;
  squawks?: string;
  categories?: string;
  data_sources?: string;
  airspaces?: string;
  limit?: number;
}

/**
 * Validates flight tracking parameters
 */
export function isValidFlightTrackingParams(params: unknown): params is FlightTrackingParams {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const typedParams = params as Record<string, unknown>;

  // Check that at least one valid parameter is provided
  const validParams = [
    'bounds', 'flights', 'callsigns', 'registrations', 'painted_as',
    'operating_as', 'airports', 'routes', 'aircraft', 'altitude_ranges',
    'squawks', 'categories', 'data_sources', 'airspaces', 'limit'
  ];

  const hasValidParam = validParams.some(param => {
    const value = typedParams[param];
    if (param === 'limit') {
      return typeof value === 'number' && value > 0;
    }
    return typeof value === 'string' && value.length > 0;
  });

  return hasValidParam;
}

export enum FlightCategory {
  PASSENGER = 'P',
  CARGO = 'C',
  MILITARY_AND_GOVERNMENT = 'M',
  BUSINESS_JETS = 'J',
  GENERAL_AVIATION = 'T',
  HELICOPTERS = 'H',
  LIGHTER_THAN_AIR = 'B',
  GLIDERS = 'G',
  DRONES = 'D',
  GROUND_VEHICLES = 'V',
  OTHER = 'O',
  NON_CATEGORIZED = 'N'
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}