/**
 * @module MCP Client for European Parliament
 * @description Client for connecting to European-Parliament-MCP-Server
 * 
 * This module provides a client interface for communicating with the
 * European Parliament MCP Server to retrieve parliamentary data.
 * 
 * @author Hack23 AB
 * @license Apache-2.0
 */

import { spawn } from 'child_process';

/**
 * MCP Client for European Parliament data access
 */
export class EuropeanParliamentMCPClient {
  constructor(options = {}) {
    this.serverPath = options.serverPath || 'european-parliament-mcp';
    this.connected = false;
    this.process = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  /**
   * Connect to the MCP server
   */
  async connect() {
    if (this.connected) {
      return;
    }

    console.log('🔌 Connecting to European Parliament MCP Server...');
    
    try {
      // Spawn the MCP server process
      this.process = spawn('node', [this.serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Handle stdout (MCP protocol messages)
      this.process.stdout.on('data', (data) => {
        this.handleMessage(data.toString());
      });

      // Handle stderr (logging)
      this.process.stderr.on('data', (data) => {
        console.error(`MCP Server: ${data.toString()}`);
      });

      // Handle process exit
      this.process.on('close', (code) => {
        console.log(`MCP Server exited with code ${code}`);
        this.connected = false;
      });

      this.connected = true;
      console.log('✅ Connected to European Parliament MCP Server');
    } catch (error) {
      console.error('❌ Failed to connect to MCP server:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.connected = false;
  }

  /**
   * Handle incoming messages from MCP server
   */
  handleMessage(data) {
    try {
      const lines = data.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const message = JSON.parse(line);
        
        if (message.id && this.pendingRequests.has(message.id)) {
          const { resolve, reject } = this.pendingRequests.get(message.id);
          this.pendingRequests.delete(message.id);
          
          if (message.error) {
            reject(new Error(message.error.message));
          } else {
            resolve(message.result);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing MCP message:', error);
    }
  }

  /**
   * Send a request to the MCP server
   */
  async sendRequest(method, params = {}) {
    if (!this.connected) {
      throw new Error('Not connected to MCP server');
    }

    const id = ++this.requestId;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      const message = JSON.stringify(request) + '\n';
      this.process.stdin.write(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  /**
   * List available MCP tools
   */
  async listTools() {
    return this.sendRequest('tools/list');
  }

  /**
   * Call an MCP tool
   */
  async callTool(name, args = {}) {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  /**
   * Get Members of European Parliament
   * @param {Object} options - Filter options
   * @param {string} options.country - ISO country code
   * @param {string} options.group - Political group
   * @param {number} options.limit - Result limit
   */
  async getMEPs(options = {}) {
    const result = await this.callTool('get_meps', options);
    return result;
  }

  /**
   * Get plenary sessions
   * @param {Object} options - Filter options
   * @param {string} options.startDate - Start date (YYYY-MM-DD)
   * @param {string} options.endDate - End date (YYYY-MM-DD)
   * @param {number} options.limit - Result limit
   */
  async getPlenarySessions(options = {}) {
    try {
      const result = await this.callTool('get_plenary_sessions', options);
      return result;
    } catch (error) {
      // Tool might not be implemented yet, return empty array
      console.warn('get_plenary_sessions not available:', error.message);
      return { content: [{ type: 'text', text: '{"sessions": []}' }] };
    }
  }

  /**
   * Search legislative documents
   * @param {Object} options - Search options
   * @param {string} options.query - Search query
   * @param {string} options.type - Document type
   * @param {number} options.limit - Result limit
   */
  async searchDocuments(options = {}) {
    try {
      const result = await this.callTool('search_documents', options);
      return result;
    } catch (error) {
      // Tool might not be implemented yet, return empty array
      console.warn('search_documents not available:', error.message);
      return { content: [{ type: 'text', text: '{"documents": []}' }] };
    }
  }

  /**
   * Get parliamentary questions
   * @param {Object} options - Filter options
   * @param {string} options.type - Question type (written/oral)
   * @param {string} options.startDate - Start date
   * @param {number} options.limit - Result limit
   */
  async getParliamentaryQuestions(options = {}) {
    try {
      const result = await this.callTool('get_parliamentary_questions', options);
      return result;
    } catch (error) {
      // Tool might not be implemented yet, return empty array
      console.warn('get_parliamentary_questions not available:', error.message);
      return { content: [{ type: 'text', text: '{"questions": []}' }] };
    }
  }
}

// Export singleton instance
let clientInstance = null;

export async function getEPMCPClient(options = {}) {
  if (!clientInstance) {
    clientInstance = new EuropeanParliamentMCPClient(options);
    await clientInstance.connect();
  }
  return clientInstance;
}

export async function closeEPMCPClient() {
  if (clientInstance) {
    await clientInstance.disconnect();
    clientInstance = null;
  }
}
