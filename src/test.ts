// Test requests
const requests = [
    // List tools request
    {
        jsonrpc: "2.0",
        id: "1",
        method: "list_tools",
        params: {}
    },

    // Test flight positions request
    {
        jsonrpc: "2.0",
        id: "2",
        method: "call_tool",
        params: {
            name: "get_flight_positions",
            arguments: {
                airports: "KJFK,KLAX",
                limit: "5"
            }
        }
    },

    // Test flight ETA request
    {
        jsonrpc: "2.0",
        id: "3",
        method: "call_tool",
        params: {
            name: "get_flight_eta",
            arguments: {
                flightNumber: "UA123"
            }
        }
    }
];

// Print each request with a delay
requests.forEach((request, index) => {
    console.log(JSON.stringify(request));
}); 