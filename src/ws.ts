import { FastifyInstance } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import { registerSocket, removeSocket } from './services/websocket.service';

export async function registerWebSocket(app: FastifyInstance) {
  app.get('/ws/:userId', { websocket: true }, (connection: SocketStream, request) => {
    const { userId } = request.params as { userId: string };
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