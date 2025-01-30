# Flightradar24 MCP Server 🛩️
[![smithery badge](https://smithery.ai/badge/flightradar24-mcp-server)](https://smithery.ai/server/flightradar24-mcp-server)

A Claude Desktop MCP server that helps you track flights in real-time using Flightradar24 data. Perfect for aviation enthusiasts, travel planners, or anyone curious about flights overhead!

## What Can This Do? ✨

- 🔍 Track any flight in real-time
- ⏰ Get arrival and departure times for specific flights
- 🌉 View the status of flights at an airport
- 🚨 Monitor emergency flights

<img width="1466" alt="Anthropic Claude MCP Hackathon - FlightRadar24 MCP server" src="https://github.com/user-attachments/assets/719444ae-2c8b-4441-84f8-5150337d871f" />

## Setup Guide 🚀

### 1. Prerequisites
- [Claude Desktop](https://claude.ai/desktop) installed on your computer
- A Flightradar24 API key (get one from [Flightradar24's website](https://www.flightradar24.com/premium))*

### 2. Installation

### Installing via Smithery

To install Flightradar24 Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/flightradar24-mcp-server):

```bash
npx -y @smithery/cli install flightradar24-mcp-server --client claude
```

1. Clone this repository somewhere on your computer:
   ```bash
   git clone https://github.com/sunsetcoder/flightradar24-mcp-server.git
   ```

2. Install dependencies & build the project:
   ```bash
   cd flightradar24-mcp-server
   npm install
   npm run build
   ```

### 3. Integration with Claude Desktop

1. Open your Claude Desktop configuration file:
   ```
   # On Mac:
   ~/Library/Application Support/Claude/claude_desktop_config.json
   
   # On Windows:
   %APPDATA%/Claude/claude_desktop_config.json
   ```

2. Add the following to the `mcpServers` object in your config:
   ```json
   {
     "mcpServers": {
       "flightradar24-server": {
         "command": "node",
         "args": [
           "/Users/<username>/<FULL_PATH...>/flightradar24-mcp-server/dist/index.js"
         ],
         "env": {
           "FR24_API_KEY": "your_api_key_here",
           "FR24_API_URL": "https://fr24api.flightradar24.com"
         }
       }
     }
   }
   ```

3. Important Steps:
   - Replace `/FULL/PATH/TO/flightradar24-mcp-server` with the actual full path to where you cloned the repository
   - Add your Flightradar24 API key in the `env` section
   - Make sure to use forward slashes (`/`) in the path, even on Windows

4. Restart Claude Desktop for the changes to take effect

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual Flightradar24 API key:
   ```env
   FR24_API_KEY=your_actual_api_key_here
   ```

Note: Never commit your actual API key to version control. The `.env` file is ignored by git for security reasons.

## Let's Try It Out! 🎮

Once the server is configured, you can ask Claude questions like:

1. "What's the ETA for United Airlines flight UA123?"
2. "Show me all flights currently at SFO"
3. "Are there any emergency flights in the area?"
4. "Show me all international flights arriving at SFO in the next 2 hours"
5. "How many commercial flights are currently over the Pacific Ocean?"
6. "Identify any flights that have declared an emergency in the California region"

Example conversation with Claude:
```
You: What's the status of flight UA123?
Claude: Let me check that for you...
[Claude will use the MCP server to fetch real-time flight information]
```

## Common Questions & Troubleshooting 🤔

### "Claude can't connect to the server"
- Check if the path in `claude_desktop_config.json` is correct
- Make sure you're using the full absolute path
- Verify your API key is correct
- Try restarting Claude Desktop

### "The server isn't responding"
- Make sure your Flightradar24 API key is valid
- Check if the API URL is correct
- Look for any error messages in server logs

### FlightRadar API Access
- Note: Using Flightradar24's API requires a [subscription](https://fr24api.flightradar24.com/subscriptions-and-credits)

## Need More Help? 🆘

1. Make sure Claude Desktop is properly installed
2. Verify your Flightradar24 API key is active
3. Check the path in your configuration file is correct
4. Look for error messages in MCP server logs

## License 📄

MIT

---

Made with ❤️ for aviation enthusiasts
