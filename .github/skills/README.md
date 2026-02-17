# GitHub Agentic Workflows Skills - Quick Reference

## Available Skills

All skills are located in `.github/skills/` and are designed to be agent-focused with actionable patterns, not documentation.

### 1. gh-aw-architecture.md (13KB)
**Focus**: Overall GitHub Agentic Workflows architecture

**Coverage**:
- Layered security model (Sandbox → Gateway → Firewall → Backend)
- Request flow patterns
- Multi-component integration
- Deployment patterns (Docker Compose, GitHub Actions)
- Monitoring and observability
- Troubleshooting workflows

**When to Use**: Understanding how all AW components work together, designing secure agent workflows

---

### 2. gh-aw-firewall.md (8.5KB)
**Focus**: Firewall security layer for agent network requests

**Coverage**:
- Domain filtering (allowlist/blocklist)
- Request inspection and sanitization
- Policy enforcement and rate limiting
- Compliance controls (GDPR, SOC2, ISO27001)
- Dynamic rule updates
- Incident response procedures

**When to Use**: Configuring network security, implementing compliance controls, blocking malicious domains

---

### 3. gh-aw-sandbox.md (11KB)
**Focus**: Isolated execution environments for agents

**Coverage**:
- Resource isolation (CPU, memory, disk)
- Filesystem access control
- Network configuration
- Secrets injection patterns
- Lifecycle management
- Workspace management

**When to Use**: Configuring agent runtime environments, managing resources, securing agent execution

---

### 4. mcp-gateway-configuration.md (6.5KB)
**Focus**: MCP Gateway configuration mastery

**Coverage**:
- TOML vs JSON stdin formats
- Server configuration (stdio, http)
- Environment variable patterns
- Validation rules
- Common mistakes and solutions

**When to Use**: Configuring MCP Gateway, setting up multi-server routing, managing environment variables

---

### 5. mcp-gateway-security.md (12KB)
**Focus**: Security and authentication for MCP Gateway

**Coverage**:
- MCP Specification 7.1 authentication
- Container isolation patterns
- Secrets management
- Session security
- Security best practices
- Monitoring and auditing

**When to Use**: Implementing authentication, managing secrets, securing MCP Gateway deployments

---

### 6. mcp-gateway-troubleshooting.md (16KB)
**Focus**: Debugging and issue resolution

**Coverage**:
- Log file analysis (unified, per-server)
- Debug logging with DEBUG environment variable
- Common issues (Docker, timeouts, auth, env vars)
- Performance diagnostics
- Health check monitoring
- Advanced debugging techniques

**When to Use**: Debugging MCP Gateway issues, analyzing logs, resolving connection problems

---

### 7. mcp-server-integration.md (13KB)
**Focus**: MCP server integration patterns

**Coverage**:
- MCP protocol fundamentals
- Tool discovery and invocation
- Multi-server orchestration
- Custom MCP server development
- Performance optimization
- Testing patterns

**When to Use**: Integrating MCP servers, building custom servers, optimizing performance

---

## Component Coverage

| Component | Skills |
|-----------|--------|
| **MCP Gateway (mcpg)** | mcp-gateway-configuration, mcp-gateway-security, mcp-gateway-troubleshooting |
| **Firewall (fw)** | gh-aw-firewall |
| **Sandbox** | gh-aw-sandbox |
| **Architecture** | gh-aw-architecture |
| **MCP Servers** | mcp-server-integration |

## Usage Patterns

### For Agents
Reference these skills when:
- Configuring GitHub Agentic Workflows components
- Implementing security controls
- Troubleshooting integration issues
- Designing multi-server workflows
- Optimizing performance

### For Development
- Use skills for configuration patterns
- Reference for integration procedures
- Follow security best practices
- Apply troubleshooting steps

### European Parliament Integration
All skills include European Parliament MCP server examples showing:
- Configuration for EP data access
- Firewall rules for Europa.eu domains
- Sandbox setup for article generation
- Multi-server workflows (GitHub + EP + Filesystem)

## Quick Start

1. **Architecture First**: Read `gh-aw-architecture.md` to understand overall system
2. **Component Setup**: Use `mcp-gateway-configuration.md` and `gh-aw-sandbox.md`
3. **Security**: Apply patterns from `mcp-gateway-security.md` and `gh-aw-firewall.md`
4. **Integration**: Follow `mcp-server-integration.md` for MCP servers
5. **Debug**: Use `mcp-gateway-troubleshooting.md` when issues arise

## Resources

- **GitHub AW**: https://github.com/github/gh-aw
- **MCP Gateway**: https://github.com/github/gh-aw-mcpg
- **Firewall**: https://github.com/github/gh-aw-firewall
- **MCP Spec**: https://github.com/modelcontextprotocol
- **EP MCP Server**: https://github.com/Hack23/European-Parliament-MCP-Server
