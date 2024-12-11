#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
  ListToolsRequest,
  CallToolRequest
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import {
  FlightTrackingParams,
  FlightPositionsResponse,
  FlightETAResponse,
  isValidFlightTrackingParams
} from './types.js';
import { env } from './config.js';

// API client configuration
const fr24Client = axios.create({
  baseURL: env.FR24_API_URL,
  headers: {
    'Accept': 'application/json',
    'Accept-Version': 'v1',
    'Authorization': `Bearer ${env.FR24_API_KEY}`
  }
});

/**
 * MCP Server implementation for Flightradar24 API
 * Provides tools for tracking flights and monitoring air traffic
 */
class FlightTrackingServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      { name: 'flightradar24-server', version: '1.0.0' },
      {
        capabilities: {
          tools: {},
          jsonrpc: true  // Add this to enable JSON-RPC support
        }
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupToolHandlers();
  }

  /**
   * Configure available tools and their handlers
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async (request: ListToolsRequest) => ({
      tools: [
        {
          name: 'get_flight_positions',
          description: 'Get real-time flight positions with various filtering options',
          inputSchema: {
            type: 'object',
            properties: {
              airports: { type: 'string', description: 'Comma-separated list of airport ICAO codes' },
              bounds: { type: 'string', description: 'Geographical bounds (lat1,lon1,lat2,lon2)' },
              categories: { type: 'string', description: 'Aircraft categories (P,C,J)' },
              limit: { type: 'number', description: 'Maximum number of results' }
            }
          }
        },
        {
          name: 'get_flight_eta',
          description: 'Get estimated arrival time for a specific flight',
          inputSchema: {
            type: 'object',
            properties: {
              flightNumber: {
                type: 'string',
                description: 'Flight number (e.g., UA123)',
                pattern: '^[A-Z0-9]{2,8}$'
              }
            },
            required: ['flightNumber']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      try {
        const toolName = request.params.name;
        const toolArgs = request.params.arguments;

        switch (toolName) {
          case 'get_flight_positions': {
            const params: FlightTrackingParams = {
              ...toolArgs,
              limit: toolArgs?.limit ? parseInt(toolArgs.limit as string) : undefined
            };

            if (!isValidFlightTrackingParams(params)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'Invalid or missing query parameters. At least one valid parameter is required.'
              );
            }

            const response = await fr24Client.get<FlightPositionsResponse>(
              '/api/live/flight-positions/light',
              { params }
            );

            return {
              content: [{
                type: "text",
                text: JSON.stringify(response.data, null, 2)
              }]
            };
          }

          case 'get_flight_eta': {
            const { flightNumber } = toolArgs || {};
            const flightNumberStr = String(flightNumber || '');

            if (!flightNumberStr || !/^[A-Z0-9]{2,8}$/.test(flightNumberStr)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'Invalid flight number format'
              );
            }

            const response = await fr24Client.get<FlightETAResponse>(
              '/api/flights/detail',
              {
                params: {
                  flight: flightNumberStr,
                  format: 'eta'
                }
              }
            );

            return {
              content: [{
                type: "text",
                text: JSON.stringify(response.data, null, 2)
              }]
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${toolName}`
            );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            isError: true,
            content: [{
              type: "text",
              text: `Flightradar24 API error: ${error.response?.data?.message || error.message || 'Unknown error'}`
            }]
          };
        }
        throw error;
      }
    });
  }

  /**
   * Start the MCP server using stdio transport
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Create and start the server
const server = new FlightTrackingServer();
server.run().catch(console.error);
//console.log(env.FR24_API_KEY)
//console.log(env.FR24_API_URL)