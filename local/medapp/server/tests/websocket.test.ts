import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { WebSocket, WebSocketServer } from 'ws';
import { db } from '../db';
import mongoose from 'mongoose';
import { createServer } from 'http';

describe('WebSocket Server Integration Tests', () => {
  let wss: WebSocketServer;
  let server: any;
  let clientSocket: WebSocket;
  const PORT = 8080;
  const WS_URL = `ws://localhost:${PORT}`;

  beforeAll(async () => {
    // Connect to test database
    await db.connect();
    // Create HTTP server
    server = createServer();
    // Create WebSocket server
    wss = new WebSocketServer({ server });
    server.listen(PORT);

    // Setup WebSocket server handlers
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        // Echo the message back
        ws.send(message.toString());
      });
    });
  });

  afterAll(async () => {
    // Cleanup
    await db.close();
    wss.close();
    server.close();
  });

  beforeEach(async () => {
    // Create a new client connection before each test
    clientSocket = new WebSocket(WS_URL);
    // Wait for connection to be established
    await new Promise((resolve) => {
      clientSocket.on('open', resolve);
    });
  });

  afterEach(() => {
    // Close client connection after each test
    clientSocket.close();
  });

  it('should establish WebSocket connection successfully', async () => {
    expect(clientSocket.readyState).toBe(WebSocket.OPEN);
  });

  it('should handle message exchange correctly', async () => {
    const testMessage = 'Hello WebSocket';
    
    const messagePromise = new Promise<string>((resolve) => {
      clientSocket.once('message', (data) => {
        resolve(data.toString());
      });
    });

    clientSocket.send(testMessage);
    const response = await messagePromise;
    expect(response).toBe(testMessage);
  });

  it('should maintain database connection throughout WebSocket communication', async () => {
    expect(mongoose.connection.readyState).toBe(1); // Connected
  });

  it('should handle multiple concurrent connections', async () => {
    const numConnections = 3;
    const connections = await Promise.all(
      Array(numConnections).fill(null).map(async () => {
        const ws = new WebSocket(WS_URL);
        await new Promise((resolve) => ws.on('open', resolve));
        return ws;
      })
    );

    expect(wss.clients.size).toBe(numConnections + 1); // +1 for the existing client

    // Cleanup
    connections.forEach(ws => ws.close());
  });

  it('should handle connection closure gracefully', async () => {
    const closePromise = new Promise<void>((resolve) => {
      clientSocket.once('close', () => {
        resolve();
      });
    });
    
    clientSocket.close();
    await closePromise;
    expect(clientSocket.readyState).toBe(WebSocket.CLOSED);
  });
});