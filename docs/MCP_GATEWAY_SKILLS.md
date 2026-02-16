# MCP Gateway Skills - Comprehensive Reference

## Overview

The **MCP Gateway** (gh-aw-mcpg) is a production-grade proxy server for Model Context Protocol (MCP) servers. It provides routing, aggregation, and management of multiple MCP backend servers in sandboxed environments, particularly for GitHub Agentic Workflows.

**Repository**: https://github.com/github/gh-aw-mcpg

**Key Technologies**:
- **Language**: Go 1.25.0
- **Protocol**: JSON-RPC 2.0 over stdio
- **Transport**: Stdio (Docker containers), HTTP
- **Configuration**: TOML files, JSON stdin
- **Security**: API key authentication (MCP spec 7.1)

## Architecture

### Gateway Modes

#### 1. Routed Mode (Default)
Each backend server accessible at its own endpoint:
- **Pattern**: `/mcp/{serverID}`
- **Example**: `POST /mcp/github`, `POST /mcp/slack`
- **Use Case**: Multiple independent MCP servers with distinct capabilities

#### 2. Unified Mode
Single endpoint for all servers:
- **Pattern**: `/mcp`
- **Routing**: Gateway routes to first configured server
- **Use Case**: Simple single-server setups or transparent proxying

### Transport Types

| Transport | Description | Configuration Field | Use Case |
|-----------|-------------|-------------------|----------|
| **stdio** | Standard input/output via Docker containers | `container` | Default, sandboxed MCP servers |
| **http** | HTTP endpoint | `url` | Remote MCP servers, existing services |
| **local** | Alias for stdio (backward compatibility) | `container` | Legacy configurations |

### Connection Management

**Session Pooling**:
- Each session maintains persistent connections to backend servers
- Backend processes are reused across multiple requests
- Stdio pipes remain open for the session lifetime
- Efficient resource usage with automatic cleanup

**Example Flow**:
```
Client Request 1 (session abc):
  → Gateway launches: docker run -i github-mcp-server
  → Stores connection in pool["github"]["abc"]
  → Sends initialize via stdio
  → Returns response

Client Request 2 (session abc):
  → Gateway retrieves existing connection from pool
  → SAME Docker process, SAME stdio connection
  → Sends tools/list via same connection
  → Returns response
```

## Configuration Formats

### TOML Format (`config.toml`)

**Use Case**: File-based configuration, explicit control over command and arguments

**Structure**:
```toml
[gateway]
port = 3000
api_key = "your-api-key"
domain = "localhost"
startup_timeout = 60
tool_timeout = 120
payload_dir = "/tmp/jq-payloads"

[servers.github]
command = "docker"
args = ["run", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "-i", "ghcr.io/github/github-mcp-server:latest"]

[servers.filesystem]
command = "node"
args = ["/path/to/filesystem-server.js"]

[servers.slack]
command = "docker"
args = ["run", "--rm", "-i", "ghcr.io/example/slack-mcp-server:latest"]
```

**Key Features**:
- Direct `command` and `args` specification
- Maximum flexibility for any command (docker, node, python, etc.)
- Environment variables via `-e` flags in args
- Explicit control over Docker run parameters

### JSON Stdin Format

**Use Case**: Dynamic configuration, GitHub Actions workflows, programmatic generation

**Complete Specification**: See [MCP Gateway Configuration Reference](https://github.com/github/gh-aw/blob/main/docs/src/content/docs/reference/mcp-gateway.md)

**Structure**:
```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "container": "ghcr.io/github/github-mcp-server:latest",
      "entrypoint": "/custom/entrypoint.sh",
      "entrypointArgs": ["--verbose"],
      "mounts": [
        "/host/config:/app/config:ro",
        "/host/data:/app/data:rw"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "",
        "EXPANDED_VAR": "${MY_HOME}/config"
      }
    },
    "http-service": {
      "type": "http",
      "url": "https://mcp-server.example.com:8080"
    }
  },
  "gateway": {
    "port": 8080,
    "apiKey": "your-api-key",
    "domain": "localhost",
    "startupTimeout": 30,
    "toolTimeout": 60,
    "payloadDir": "/tmp/jq-payloads"
  }
}
```

**Key Features**:
- Automatic Docker wrapping: `docker run --rm -i <container>`
- Environment variable expansion: `${VAR_NAME}` (fails if undefined)
- Custom entrypoints and arguments
- Volume mounts with ro/rw modes
- HTTP server support

### Server Configuration Fields

#### Required Fields

**For stdio servers**:
- `container` (required in JSON format): Docker container image
  - Example: `"ghcr.io/github/github-mcp-server:latest"`
  - Auto-wrapped as `docker run --rm -i <container>`

**For http servers**:
- `url` (required): HTTP endpoint URL
  - Example: `"https://mcp-server.example.com:8080"`

#### Optional Fields

**`type`** (optional): Transport type
- Values: `"stdio"`, `"http"`, `"local"` (alias for stdio)
- Default: `"stdio"`

**`entrypoint`** (optional): Custom container entrypoint
- Overrides default container entrypoint
- Applied as `--entrypoint` flag to Docker

**`entrypointArgs`** (optional): Arguments for entrypoint
- Array of strings passed after container image
- Example: `["--verbose", "--debug"]`

**`mounts`** (optional): Volume mounts for container
- Format: `"source:dest:mode"`
- `source`: Host path (supports `${VAR}` expansion)
- `dest`: Container path
- `mode`: `"ro"` (read-only) or `"rw"` (read-write)
- Example: `["/host/config:/app/config:ro", "/host/data:/app/data:rw"]`

**`env`** (optional): Environment variables
- Empty string `""`: Passthrough from host
- Explicit value: `"value"`
- Expansion: `"${VAR_NAME}"` (fails if undefined)

### Gateway Configuration Fields

**`port`** (optional): Gateway HTTP port
- Range: 1-65535
- Default: From `--listen` flag

**`apiKey`** (optional): API key for authentication
- Required for authentication to be enabled
- Used with `Authorization: <apiKey>` header

**`domain`** (optional): Gateway domain
- Allowed: `"localhost"`, `"host.docker.internal"`

**`startupTimeout`** (optional): Backend startup timeout in seconds
- Must be positive integer
- Default: 60

**`toolTimeout`** (optional): Tool execution timeout in seconds
- Must be positive integer
- Default: 120

**`payloadDir`** (optional): Directory for large payload storage
- Default: `/tmp/jq-payloads`
- Organized by session: `{payloadDir}/{sessionID}/{queryID}/payload.json`

## Validation and Error Handling

### Configuration Validation

**Spec-Compliant Validation** with fail-fast error messages:

1. **Parse Errors with Precise Location**:
   ```bash
   Error: failed to parse TOML at line 2, column 6: expected '.' or '=', but got '3' instead
   ```

2. **Unknown Key Detection** (typo detection):
   ```
   [WARN] [config] Unknown configuration key 'gateway.prot' - check for typos
   [WARN] [config] Unknown configuration key 'gateway.startup_timout' - check for typos
   ```

3. **Required Field Validation**:
   - JSON format: stdio servers must have `container`, http servers must have `url`
   - No `command` field support in JSON (use `container` instead)

4. **Variable Expansion Validation**:
   - `${VAR_NAME}` fails fast if variable undefined
   - Used in: env values, mount paths
   - Example: `"${GITHUB_CONFIG_DIR}/config.json"`

5. **Type Normalization**:
   - Empty/"local" type → automatically normalized to "stdio"
   - Backward compatibility maintained

6. **Mount Validation**:
   - Format: `"source:dest:mode"`
   - Mode must be `"ro"` or `"rw"`
   - Source and destination cannot be empty

### Enhanced Error Debugging

Command failures include comprehensive context:
- **Full Command**: Complete command, arguments, and environment
- **Troubleshooting Suggestions**:
  - Docker daemon connectivity checks
  - Container image availability
  - Network connectivity issues
  - MCP protocol compatibility checks

**Example Error Output**:
```
[ERROR] [launcher] Failed to start backend server 'github'
Command: docker run --rm -i ghcr.io/github/github-mcp-server:latest
Error: Cannot connect to Docker daemon
Troubleshooting:
  1. Check Docker daemon is running: docker info
  2. Verify Docker socket: ls -la /var/run/docker.sock
  3. Check container exists: docker pull ghcr.io/github/github-mcp-server:latest
```

## Environment Variables

### Required for Production (Containerized Mode)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MCP_GATEWAY_PORT` | Gateway listening port | `8080` | Yes |
| `MCP_GATEWAY_DOMAIN` | Gateway domain name | `localhost` | Yes |
| `MCP_GATEWAY_API_KEY` | API authentication key | `your-secret-key` | Yes |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_GATEWAY_LOG_DIR` | Log file directory | `/tmp/gh-aw/mcp-logs` |
| `MCP_GATEWAY_PAYLOAD_DIR` | Large payload storage | `/tmp/jq-payloads` |
| `MCP_GATEWAY_PAYLOAD_SIZE_THRESHOLD` | Payload threshold (bytes) | `10240` |
| `DEBUG` | Debug logging patterns | (disabled) |
| `DEBUG_COLORS` | Colored debug output | Auto-detect |
| `DOCKER_HOST` | Docker daemon socket | `/var/run/docker.sock` |
| `DOCKER_API_VERSION` | Docker API version | Auto-negotiate |

### Variable Expansion Features

**Passthrough**: Set value to empty string (`""`) to pass from host
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": ""
  }
}
```

**Expansion**: Use `${VAR_NAME}` for dynamic substitution
```json
{
  "env": {
    "CONFIG_PATH": "${HOME}/.config/mcp",
    "DATA_DIR": "${MCP_DATA_ROOT}/storage"
  }
}
```

**Validation**: Fails immediately if variable undefined
```
Error: environment variable 'MCP_DATA_ROOT' is not defined
```

## Logging and Debugging

### Log Files

Default location: `/tmp/gh-aw/mcp-logs/` (configurable via `MCP_GATEWAY_LOG_DIR` or `--log-dir`)

**Generated Files**:

1. **`mcp-gateway.log`** - Unified log with all gateway messages
2. **`{serverID}.log`** - Per-server logs (e.g., `github.log`, `slack.log`)
3. **`gateway.md`** - Markdown-formatted logs for GitHub workflow previews
4. **`rpc-messages.jsonl`** - Machine-readable RPC message logs
5. **`tools.json`** - Available tools from all backend MCP servers

**Log Directory Structure**:
```
/tmp/gh-aw/mcp-logs/
├── mcp-gateway.log      # All messages
├── github.log           # Only GitHub server logs
├── slack.log            # Only Slack server logs
├── notion.log           # Only Notion server logs
├── gateway.md           # Markdown format
├── rpc-messages.jsonl   # RPC messages
└── tools.json           # Available tools
```

### Logging Categories

**Operational Events**:
- `startup` - Gateway initialization and configuration
- `shutdown` - Graceful shutdown events
- `client` - MCP client interactions and requests
- `backend` - Backend MCP server operations
- `auth` - Authentication events (success and failures)

**Log Format**:
```
[2026-01-08T23:00:00Z] [INFO] [startup] Starting MCPG with config: config.toml
[2026-01-08T23:00:01Z] [INFO] [backend] Launching MCP backend server: github
[2026-01-08T23:00:02Z] [INFO] [client] New MCP client connection, session=abc123
[2026-01-08T23:00:03Z] [ERROR] [auth] Authentication failed: invalid API key
```

### Debug Logging

**Enable via `DEBUG` environment variable**:

```bash
# Enable all debug logs
DEBUG=* ./awmg --config config.toml

# Enable specific packages
DEBUG=server:* ./awmg --config config.toml

# Enable multiple packages
DEBUG=server:*,launcher:* ./awmg --config config.toml

# Exclude specific loggers
DEBUG=*,-launcher:test ./awmg --config config.toml

# Disable colors
DEBUG_COLORS=0 DEBUG=* ./awmg --config config.toml
```

**Debug Output Features**:
- **Time Diff**: Shows elapsed time between calls (`+50ms`, `+2.5s`)
- **Auto-Colors**: Each namespace gets consistent color
- **Pattern Matching**: Wildcards (`*`) and exclusions (`-pattern`)
- **Zero Overhead**: Only computed when DEBUG matches namespace

### Per-ServerID Logs

Each backend MCP server gets its own log file for easier troubleshooting:

**Benefits**:
- Debug issues with specific backend servers
- View all activity for one server without filtering
- Identify which server is causing problems
- Troubleshoot server-specific configuration issues

**Example**: Viewing only GitHub MCP server logs:
```bash
tail -f /tmp/gh-aw/mcp-logs/github.log
```

### Tools Catalog (`tools.json`)

The gateway maintains a catalog of all available tools:

**Location**: `{log_dir}/tools.json`

**Structure**:
```json
{
  "servers": {
    "github": [
      {"name": "search_code", "description": "Search for code in repositories"},
      {"name": "get_file_contents", "description": "Get the contents of a file"}
    ],
    "slack": [
      {"name": "send_message", "description": "Send a message to a Slack channel"}
    ]
  }
}
```

**Use Cases**:
- Discovering available tools across all configured servers
- Monitoring gateway capabilities
- Client tool discovery

## Large Payload Handling

### Payload Threshold

**Configuration**:
- CLI flag: `--payload-size-threshold <bytes>` (default: 10240)
- Environment variable: `MCP_GATEWAY_PAYLOAD_SIZE_THRESHOLD=<bytes>`
- **Not** supported in JSON stdin format

**Behavior**:
- Payloads **larger** than threshold: stored to disk, return metadata
- Payloads **smaller than or equal**: returned inline

### Payload Storage

**Directory Structure**:
```
{payloadDir}/{sessionID}/{queryID}/payload.json
```

**Example**:
```
/tmp/jq-payloads/
└── abc123-session/
    ├── query-001/
    │   └── payload.json
    └── query-002/
        └── payload.json
```

### Payload Metadata Response

When payload exceeds threshold, gateway returns:

```json
{
  "payloadPreview": "First 500 characters of JSON...",
  "payloadSchema": {
    "type": "object",
    "properties": {
      "items": {"type": "array"},
      "count": {"type": "number"}
    }
  },
  "payloadPath": "/tmp/jq-payloads/abc123-session/query-001/payload.json",
  "queryID": "query-001",
  "originalSize": 52480,
  "truncated": true
}
```

**Important Notes**:
- `payload.json` contains **complete original response data** in valid JSON
- `payloadSchema` shows **structure and types** (NOT actual data values)
- `payloadPreview` shows first 500 characters for quick reference
- To access full data, read JSON file at `payloadPath`

### Session-Specific Mounting

Agents can mount their session-specific subdirectory:

```yaml
volumes:
  - /tmp/jq-payloads/${SESSION_ID}:/app/payloads:ro
```

This allows agents to read full payload files while maintaining session isolation.

## Security Features

### Authentication

**MCP Specification 7.1 Compliance**:

**Authorization Header Format**:
- Per MCP spec 7.1: Plain API key (NOT Bearer scheme)
- Format: `Authorization: <api-key>`
- Example: `Authorization: my-secret-api-key-123`

**Configuration**:
- Set via `MCP_GATEWAY_API_KEY` environment variable
- When configured: all endpoints except `/health` require authentication
- When not configured: authentication disabled

**Example Request**:
```bash
curl -X POST http://localhost:8000/mcp/github \
  -H "Authorization: my-api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'
```

### Session Management

**Session ID Extraction**:
- Extracted from Authorization header value
- Used for connection pooling
- Maintains persistent backend connections per session

**Connection Lifecycle**:
1. Client sends request with Authorization header
2. Gateway extracts session ID
3. Reuses existing backend connection or creates new
4. Maintains connection for session lifetime
5. Cleans up on session end

### Container Isolation

**Docker Security**:
- All stdio backend servers run in Docker containers
- No direct command execution
- Isolated filesystem and network
- Resource limits can be applied via Docker

**Container Detection**:
- Automatic detection of containerized environments
- Security warnings when running in containers
- Validation checks for Docker socket access

## Docker Integration

### Containerized Deployment

**Required Docker Flags**:
```bash
docker run --rm -i \
  -e MCP_GATEWAY_PORT=8000 \
  -e MCP_GATEWAY_DOMAIN=localhost \
  -e MCP_GATEWAY_API_KEY=your-secret-key \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /path/to/logs:/tmp/gh-aw/mcp-logs \
  -p 8000:8000 \
  ghcr.io/github/gh-aw-mcpg:latest < config.json
```

**Flag Purposes**:
- `-i`: Required for JSON stdin configuration
- `-v /var/run/docker.sock`: Required for spawning backend MCP servers
- `-v /path/to/logs`: Optional but recommended for persistent logs
- `-p <host>:<container>`: Port mapping must match `MCP_GATEWAY_PORT`

### Validation Checks (Containerized Mode)

| Check | Description | Action on Failure |
|-------|-------------|-------------------|
| Docker Socket | Verifies Docker daemon accessible | Exit with error |
| Environment Variables | Checks required env vars set | Exit with error |
| Port Mapping | Verifies container port mapped | Exit with error |
| Stdin Interactive | Ensures `-i` flag used | Exit with error |
| Log Directory Mount | Verifies log directory mounted | Warning (logs won't persist) |

### Docker-in-Docker Pattern

Gateway uses Docker-in-Docker to launch backend MCP servers:

**Architecture**:
```
Host Machine
└── Gateway Container
    ├── MCP Gateway Process
    └── Docker Socket Mount
        └── Backend MCP Containers (siblings on host)
```

**Benefits**:
- Clean separation of concerns
- Standard Docker networking
- Resource isolation per backend
- Easy scaling and management

## API Endpoints

### Routed Mode (Default)

**Pattern**: `POST /mcp/{serverID}`

**Example**:
```bash
# GitHub MCP server
curl -X POST http://localhost:8000/mcp/github \
  -H "Authorization: my-api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'

# Slack MCP server
curl -X POST http://localhost:8000/mcp/slack \
  -H "Authorization: my-api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "send_message"}, "id": 2}'
```

### Unified Mode

**Pattern**: `POST /mcp`

**Routing**: Gateway routes to first configured server

**Example**:
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Authorization: my-api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'
```

### Health Check

**Pattern**: `GET /health`

**Response**: `OK` (no authentication required)

**Example**:
```bash
curl http://localhost:8000/health
# Returns: OK
```

## MCP Methods

Supported JSON-RPC 2.0 methods (forwarded to backend servers):

- `tools/list` - List available tools
- `tools/call` - Call a tool with parameters
- `initialize` - Initialize MCP connection
- Custom methods (forwarded as-is)

**Example `tools/list` Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

**Example `tools/call` Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "search_code",
    "arguments": {
      "query": "function main",
      "repo": "owner/repo"
    }
  },
  "id": 2
}
```

## Production Deployment Patterns

### GitHub Actions Integration

**Example Workflow**:
```yaml
name: MCP Gateway Deployment

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Generate MCP Config
        run: |
          cat > config.json <<EOF
          {
            "mcpServers": {
              "github": {
                "type": "stdio",
                "container": "ghcr.io/github/github-mcp-server:latest",
                "env": {
                  "GITHUB_PERSONAL_ACCESS_TOKEN": ""
                }
              }
            }
          }
          EOF
      
      - name: Start MCP Gateway
        run: |
          docker run -d --name mcp-gateway \
            -e MCP_GATEWAY_PORT=8000 \
            -e MCP_GATEWAY_DOMAIN=localhost \
            -e MCP_GATEWAY_API_KEY=${{ secrets.MCP_API_KEY }} \
            -e GITHUB_PERSONAL_ACCESS_TOKEN=${{ secrets.GITHUB_TOKEN }} \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v $PWD/logs:/tmp/gh-aw/mcp-logs \
            -p 8000:8000 \
            ghcr.io/github/gh-aw-mcpg:latest < config.json
      
      - name: Test Gateway
        run: |
          curl -f http://localhost:8000/health
          curl -X POST http://localhost:8000/mcp/github \
            -H "Authorization: ${{ secrets.MCP_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'
```

### Multi-Server Configuration

**Example**: GitHub + Slack + Filesystem MCP servers

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "container": "ghcr.io/github/github-mcp-server:latest",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    },
    "slack": {
      "type": "stdio",
      "container": "ghcr.io/example/slack-mcp-server:latest",
      "env": {
        "SLACK_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    },
    "filesystem": {
      "type": "stdio",
      "container": "ghcr.io/modelcontextprotocol/filesystem-server:latest",
      "mounts": [
        "/host/workspace:/workspace:rw"
      ]
    }
  },
  "gateway": {
    "port": 8000,
    "apiKey": "production-api-key",
    "startupTimeout": 45,
    "toolTimeout": 90
  }
}
```

### High Availability Setup

**Load Balancer + Multiple Instances**:
```yaml
services:
  gateway-1:
    image: ghcr.io/github/gh-aw-mcpg:latest
    environment:
      - MCP_GATEWAY_PORT=8000
      - MCP_GATEWAY_API_KEY=${API_KEY}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs/gateway-1:/tmp/gh-aw/mcp-logs
    ports:
      - "8001:8000"
  
  gateway-2:
    image: ghcr.io/github/gh-aw-mcpg:latest
    environment:
      - MCP_GATEWAY_PORT=8000
      - MCP_GATEWAY_API_KEY=${API_KEY}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs/gateway-2:/tmp/gh-aw/mcp-logs
    ports:
      - "8002:8000"
  
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - gateway-1
      - gateway-2
```

## Troubleshooting

### Common Issues

#### 1. Docker Daemon Connection Failed

**Symptom**: `Cannot connect to Docker daemon`

**Solutions**:
```bash
# Check Docker daemon is running
docker info

# Verify Docker socket exists
ls -la /var/run/docker.sock

# Check permissions
sudo chmod 666 /var/run/docker.sock

# In containers, ensure socket is mounted
docker run -v /var/run/docker.sock:/var/run/docker.sock ...
```

#### 2. Backend Server Startup Timeout

**Symptom**: `Backend server 'github' failed to start within timeout`

**Solutions**:
```bash
# Increase startup timeout
export MCP_GATEWAY_STARTUP_TIMEOUT=90
# or in config
"gateway": {"startupTimeout": 90}

# Check container image exists
docker pull ghcr.io/github/github-mcp-server:latest

# Test container directly
docker run --rm -i ghcr.io/github/github-mcp-server:latest
```

#### 3. Authentication Failed

**Symptom**: `Authentication failed: invalid API key`

**Solutions**:
```bash
# Check API key is set
echo $MCP_GATEWAY_API_KEY

# Verify header format (plain key, not Bearer)
Authorization: your-api-key

# NOT this:
Authorization: Bearer your-api-key
```

#### 4. Environment Variable Not Expanded

**Symptom**: `environment variable 'VAR_NAME' is not defined`

**Solutions**:
```bash
# Check variable is exported
export VAR_NAME="value"
env | grep VAR_NAME

# Use passthrough for optional variables
"env": {"VAR_NAME": ""}

# Provide fallback in shell
export VAR_NAME="${VAR_NAME:-default_value}"
```

#### 5. Log Directory Not Writable

**Symptom**: `Failed to create log directory, falling back to stdout`

**Solutions**:
```bash
# Create directory with proper permissions
sudo mkdir -p /tmp/gh-aw/mcp-logs
sudo chmod 777 /tmp/gh-aw/mcp-logs

# Or use alternative directory
export MCP_GATEWAY_LOG_DIR=/home/user/logs

# In Docker, mount the directory
-v /path/on/host:/tmp/gh-aw/mcp-logs
```

### Debug Mode

Enable comprehensive debug logging:

```bash
# All debug output
DEBUG=* ./awmg --config config.toml

# Server and launcher only
DEBUG=server:*,launcher:* ./awmg --config config.toml

# With colored output
DEBUG_COLORS=1 DEBUG=* ./awmg --config config.toml

# To file (disable colors automatically)
DEBUG=* ./awmg --config config.toml 2> debug.log
```

### Health Check Monitoring

**Simple Health Check**:
```bash
#!/bin/bash
if curl -f http://localhost:8000/health; then
  echo "Gateway is healthy"
  exit 0
else
  echo "Gateway is unhealthy"
  exit 1
fi
```

**Advanced Health Check with Tool Test**:
```bash
#!/bin/bash
# Check health endpoint
curl -f http://localhost:8000/health || exit 1

# Test actual MCP functionality
RESPONSE=$(curl -s -X POST http://localhost:8000/mcp/github \
  -H "Authorization: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}')

# Verify response contains tools
if echo "$RESPONSE" | jq -e '.result.tools | length > 0' > /dev/null; then
  echo "Gateway is healthy and functional"
  exit 0
else
  echo "Gateway responded but no tools available"
  exit 1
fi
```

## MCP Server Compatibility

### Verified Servers

| Server | Transport | Status | Configuration |
|--------|-----------|--------|---------------|
| **GitHub MCP** | Stdio (Docker) | Production ready | `ghcr.io/github/github-mcp-server:latest` |
| **Serena MCP** | Stdio (Docker) | Production ready | `ghcr.io/github/serena-mcp-server:latest` |

### Test Results

**GitHub MCP Server**:
- ✅ Full test suite validation (direct and gateway)
- ✅ Repository operations, issue management, search functionality
- ✅ Production deployment validated

**Serena MCP Server**:
- ✅ 68/68 direct connection tests passed (100%)
- ✅ All gateway integration tests passed
- ✅ Multi-language support (Go, Java, JavaScript, Python)
- ✅ 29 tools tested and validated

### Adding New MCP Servers

**Requirements**:
1. Server must support MCP protocol (JSON-RPC 2.0)
2. Must work via stdio transport OR HTTP endpoint
3. Docker container available (for stdio)

**Configuration Example**:
```json
{
  "mcpServers": {
    "custom-server": {
      "type": "stdio",
      "container": "ghcr.io/your-org/custom-mcp-server:latest",
      "env": {
        "API_KEY": "${CUSTOM_SERVER_API_KEY}",
        "CONFIG_PATH": "/app/config"
      },
      "mounts": [
        "${CONFIG_DIR}:/app/config:ro"
      ]
    }
  }
}
```

**Testing**:
```bash
# Test direct container execution
docker run --rm -i ghcr.io/your-org/custom-mcp-server:latest <<EOF
{"jsonrpc": "2.0", "method": "initialize", "params": {"protocolVersion": "1.0"}, "id": 1}
EOF

# Test via gateway
curl -X POST http://localhost:8000/mcp/custom-server \
  -H "Authorization: api-key" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}'
```

## Best Practices

### Configuration Management

1. **Use TOML for static configs**: File-based, version controlled
2. **Use JSON stdin for dynamic configs**: Generated programmatically
3. **Store secrets in environment variables**: Never hardcode API keys
4. **Use variable expansion**: `${VAR_NAME}` for flexibility
5. **Validate configs before deployment**: Gateway provides detailed errors

### Security

1. **Always use API key authentication in production**
2. **Rotate API keys regularly**
3. **Use readonly mounts when possible**: `mode: "ro"`
4. **Limit container resource usage**: Apply Docker resource limits
5. **Monitor authentication failures**: Check logs for suspicious activity

### Performance

1. **Use session pooling**: Reuse connections within sessions
2. **Configure appropriate timeouts**: Balance between reliability and performance
3. **Monitor backend health**: Watch server-specific logs
4. **Set payload thresholds**: Balance between memory and disk usage
5. **Scale horizontally**: Run multiple gateway instances behind load balancer

### Monitoring

1. **Check log files regularly**: Especially per-server logs
2. **Monitor `tools.json`**: Verify all expected tools available
3. **Set up health checks**: Automated monitoring with alerts
4. **Track RPC messages**: Use `rpc-messages.jsonl` for analysis
5. **Review payload storage**: Monitor disk usage in payload directory

### Development

1. **Enable debug logging**: `DEBUG=* ./awmg ...`
2. **Test with curl first**: Verify requests before integration
3. **Use per-server logs**: Easier debugging of specific backends
4. **Check validation errors**: Gateway provides detailed feedback
5. **Test backend independently**: Verify Docker containers work directly

## Resources

- **GitHub Repository**: https://github.com/github/gh-aw-mcpg
- **Configuration Spec**: [MCP Gateway Reference](https://github.com/github/gh-aw/blob/main/docs/src/content/docs/reference/mcp-gateway.md)
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **GitHub Agentic Workflows**: https://github.com/github/gh-aw
- **Docker Documentation**: https://docs.docker.com

## Summary

The MCP Gateway provides a robust, production-ready solution for managing multiple MCP servers in sandboxed environments. Key strengths:

- **Flexible Configuration**: TOML files or JSON stdin with full validation
- **Multiple Transport Types**: Stdio (Docker), HTTP
- **Session Management**: Efficient connection pooling and reuse
- **Comprehensive Logging**: Unified and per-server logs with multiple formats
- **Security**: API key authentication, container isolation
- **Large Payload Handling**: Disk storage with session-specific organization
- **Enhanced Debugging**: Detailed error context and troubleshooting suggestions
- **Production Ready**: Tested with GitHub and Serena MCP servers

Use this reference when implementing MCP Gateway integrations, troubleshooting issues, or designing multi-server MCP architectures.
