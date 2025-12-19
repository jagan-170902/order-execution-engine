import { FastifyInstance } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import { registerSocket, removeSocket } from './services/websocket.service';

export async function registerWebSocket(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (connection: SocketStream, request) => {
    // Read userId from query string
    const query = request.query as { userId?: string };
    const userId = query.userId;

    if (!userId) {
      console.log('WebSocket connection rejected: missing userId');
      connection.socket.close(1008, 'Missing userId');
      return;
    }

    const ws = connection.socket;

    registerSocket(userId, ws);

    ws.send(JSON.stringify({
      type: 'connected',
      userId,
    }));

    ws.on('close', () => {
      removeSocket(userId);
      console.log(`🔌 WebSocket closed for user ${userId}`);
    });
  });
}