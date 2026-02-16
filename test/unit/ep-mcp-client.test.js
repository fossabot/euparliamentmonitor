/**
 * Unit tests for ep-mcp-client.js
 * Tests MCP client connection, retries, validation, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EuropeanParliamentMCPClient, getEPMCPClient, closeEPMCPClient } from '../../scripts/ep-mcp-client.js';
import { mockConsole } from '../helpers/test-utils.js';

describe('ep-mcp-client', () => {
  describe('EuropeanParliamentMCPClient', () => {
    let client;
    let consoleOutput;

    beforeEach(() => {
      consoleOutput = mockConsole();
      client = new EuropeanParliamentMCPClient();
    });

    afterEach(() => {
      consoleOutput.restore();
      if (client?.connected) {
        client.disconnect();
      }
    });

    describe('Constructor', () => {
      it('should initialize with default options', () => {
        expect(client.connected).toBe(false);
        expect(client.process).toBeNull();
        expect(client.requestId).toBe(0);
        expect(client.maxConnectionAttempts).toBe(3);
        expect(client.connectionRetryDelay).toBe(1000);
      });

      it('should accept custom options', () => {
        const customClient = new EuropeanParliamentMCPClient({
          serverPath: '/custom/path',
          maxConnectionAttempts: 5,
          connectionRetryDelay: 2000,
        });

        expect(customClient.serverPath).toBe('/custom/path');
        expect(customClient.maxConnectionAttempts).toBe(5);
        expect(customClient.connectionRetryDelay).toBe(2000);
      });

      it('should use environment variable for server path', () => {
        const originalPath = process.env.EP_MCP_SERVER_PATH;
        process.env.EP_MCP_SERVER_PATH = '/env/path';

        const envClient = new EuropeanParliamentMCPClient();
        expect(envClient.serverPath).toBe('/env/path');

        // Restore
        if (originalPath) {
          process.env.EP_MCP_SERVER_PATH = originalPath;
        } else {
          delete process.env.EP_MCP_SERVER_PATH;
        }
      });

      it('should initialize pending requests map', () => {
        expect(client.pendingRequests).toBeInstanceOf(Map);
        expect(client.pendingRequests.size).toBe(0);
      });
    });

    describe('Connection Management', () => {
      it('should handle connection failure gracefully', async () => {
        // This will fail because the server doesn't exist
        await expect(client.connect()).rejects.toThrow();
        expect(client.connected).toBe(false);
      });

      it('should not reconnect if already connected', async () => {
        client.connected = true;
        const initialAttempts = client.connectionAttempts;

        await client.connect();

        expect(client.connectionAttempts).toBe(initialAttempts);
      });

      it('should disconnect properly', () => {
        // Mock a connected state
        client.connected = true;
        client.process = { kill: vi.fn() };

        client.disconnect();

        expect(client.process.kill).toHaveBeenCalled();
        expect(client.connected).toBe(false);
        expect(client.process).toBeNull();
      });

      it('should handle disconnect when not connected', () => {
        client.disconnect();
        expect(client.connected).toBe(false);
      });
    });

    describe('Message Handling', () => {
      it('should handle valid JSON response messages', () => {
        const mockResolve = vi.fn();
        const mockReject = vi.fn();
        
        client.pendingRequests.set(1, { resolve: mockResolve, reject: mockReject });

        const message = JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          result: { data: 'test' },
        });

        client.handleMessage(message);

        expect(mockResolve).toHaveBeenCalledWith({ data: 'test' });
        expect(mockReject).not.toHaveBeenCalled();
        expect(client.pendingRequests.has(1)).toBe(false);
      });

      it('should handle error response messages', () => {
        const mockResolve = vi.fn();
        const mockReject = vi.fn();
        
        client.pendingRequests.set(1, { resolve: mockResolve, reject: mockReject });

        const message = JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          error: { message: 'Test error' },
        });

        client.handleMessage(message);

        expect(mockReject).toHaveBeenCalled();
        expect(mockResolve).not.toHaveBeenCalled();
        expect(client.pendingRequests.has(1)).toBe(false);
      });

      it('should handle notification messages without id', () => {
        const message = JSON.stringify({
          jsonrpc: '2.0',
          method: 'notification',
          params: { data: 'test' },
        });

        // Should not throw
        expect(() => client.handleMessage(message)).not.toThrow();
      });

      it('should handle invalid JSON gracefully', () => {
        const invalidMessage = '{ invalid json }';

        // Should not throw
        expect(() => client.handleMessage(invalidMessage)).not.toThrow();
        expect(consoleOutput.errors.length).toBeGreaterThan(0);
      });

      it('should ignore messages for unknown request IDs', () => {
        const message = JSON.stringify({
          jsonrpc: '2.0',
          id: 999,
          result: { data: 'test' },
        });

        // Should not throw
        expect(() => client.handleMessage(message)).not.toThrow();
      });
    });

    describe('Request Sending', () => {
      it('should throw error when not connected', async () => {
        await expect(client.sendRequest('test_method')).rejects.toThrow('Not connected to MCP server');
      });

      it('should increment request ID', async () => {
        client.connected = true;
        client.process = {
          stdin: {
            write: vi.fn(),
          },
        };

        const initialId = client.requestId;

        // Start request (will timeout, but that's OK for this test)
        const promise = client.sendRequest('test_method');
        
        expect(client.requestId).toBe(initialId + 1);

        // Clean up pending request
        client.pendingRequests.clear();
        await promise.catch(() => {});
      });

      it('should format request correctly', async () => {
        client.connected = true;
        const writeMock = vi.fn();
        client.process = {
          stdin: { write: writeMock },
        };

        // Start request
        const promise = client.sendRequest('test_method', { param: 'value' });

        // Check written message
        expect(writeMock).toHaveBeenCalled();
        const written = writeMock.mock.calls[0][0];
        const request = JSON.parse(written);

        expect(request.jsonrpc).toBe('2.0');
        expect(request.method).toBe('test_method');
        expect(request.params).toEqual({ param: 'value' });
        expect(request.id).toBeGreaterThan(0);

        // Clean up
        client.pendingRequests.clear();
        await promise.catch(() => {});
      });
    });

    describe('Tool Operations', () => {
      beforeEach(() => {
        client.connected = true;
        client.sendRequest = vi.fn().mockResolvedValue({ tools: [] });
      });

      it('should list tools', async () => {
        await client.listTools();
        expect(client.sendRequest).toHaveBeenCalledWith('tools/list');
      });

      it('should call tool with arguments', async () => {
        const args = { param: 'value' };
        await client.callTool('test_tool', args);
        
        expect(client.sendRequest).toHaveBeenCalledWith('tools/call', {
          name: 'test_tool',
          arguments: args,
        });
      });

      it('should get MEPs', async () => {
        const options = { country: 'DE', limit: 10 };
        await client.getMEPs(options);
        
        expect(client.sendRequest).toHaveBeenCalledWith('tools/call', {
          name: 'get_meps',
          arguments: options,
        });
      });
    });

    describe('European Parliament Data Methods', () => {
      beforeEach(() => {
        client.connected = true;
        client.callTool = vi.fn();
      });

      it('should get plenary sessions', async () => {
        client.callTool.mockResolvedValue({
          content: [{ type: 'text', text: '{"sessions": []}' }],
        });

        const options = { startDate: '2025-01-01', endDate: '2025-01-31' };
        await client.getPlenarySessions(options);

        expect(client.callTool).toHaveBeenCalledWith('get_plenary_sessions', options);
      });

      it('should handle missing plenary sessions tool gracefully', async () => {
        client.callTool.mockRejectedValue(new Error('Tool not available'));

        const result = await client.getPlenarySessions();

        expect(result).toEqual({
          content: [{ type: 'text', text: '{"sessions": []}' }],
        });
      });

      it('should search documents', async () => {
        client.callTool.mockResolvedValue({
          content: [{ type: 'text', text: '{"documents": []}' }],
        });

        const options = { query: 'climate', type: 'proposal' };
        await client.searchDocuments(options);

        expect(client.callTool).toHaveBeenCalledWith('search_documents', options);
      });

      it('should handle missing search documents tool gracefully', async () => {
        client.callTool.mockRejectedValue(new Error('Tool not available'));

        const result = await client.searchDocuments();

        expect(result).toEqual({
          content: [{ type: 'text', text: '{"documents": []}' }],
        });
      });

      it('should get parliamentary questions', async () => {
        client.callTool.mockResolvedValue({
          content: [{ type: 'text', text: '{"questions": []}' }],
        });

        const options = { type: 'written', limit: 20 };
        await client.getParliamentaryQuestions(options);

        expect(client.callTool).toHaveBeenCalledWith('get_parliamentary_questions', options);
      });

      it('should handle missing parliamentary questions tool gracefully', async () => {
        client.callTool.mockRejectedValue(new Error('Tool not available'));

        const result = await client.getParliamentaryQuestions();

        expect(result).toEqual({
          content: [{ type: 'text', text: '{"questions": []}' }],
        });
      });
    });

    describe('Retry Logic', () => {
      it('should retry connection on failure', async () => {
        const failingClient = new EuropeanParliamentMCPClient({
          maxConnectionAttempts: 2,
          connectionRetryDelay: 10,
        });

        await expect(failingClient.connect()).rejects.toThrow();
        expect(failingClient.connectionAttempts).toBe(2);
      });

      it('should reset connection attempts on success', async () => {
        client.connectionAttempts = 2;
        client._attemptConnection = vi.fn().mockResolvedValue();

        await client.connect();

        expect(client.connectionAttempts).toBe(0);
      });
    });
  });

  describe('Singleton Functions', () => {
    afterEach(async () => {
      await closeEPMCPClient();
    });

    it('should create singleton client instance', async () => {
      // Mock successful connection
      const mockConnect = vi.fn().mockResolvedValue();
      vi.spyOn(EuropeanParliamentMCPClient.prototype, 'connect').mockImplementation(mockConnect);

      const client1 = await getEPMCPClient();
      const client2 = await getEPMCPClient();

      expect(client1).toBe(client2);
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('should close singleton client', async () => {
      const mockConnect = vi.fn().mockResolvedValue();
      const mockDisconnect = vi.fn();
      
      vi.spyOn(EuropeanParliamentMCPClient.prototype, 'connect').mockImplementation(mockConnect);
      vi.spyOn(EuropeanParliamentMCPClient.prototype, 'disconnect').mockImplementation(mockDisconnect);

      await getEPMCPClient();
      await closeEPMCPClient();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle closing when no client exists', async () => {
      await expect(closeEPMCPClient()).resolves.not.toThrow();
    });
  });
});
