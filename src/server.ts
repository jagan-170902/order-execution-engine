import 'dotenv/config';
import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import orderRoutes from './api/order.routes';
import { registerWebSocket } from './ws';
import './queue/order.worker';

(async () => {
  const app = Fastify({ logger: true });

  await app.register(websocket);
  await app.register(orderRoutes);
  await app.register(registerWebSocket);

  const PORT = process.env.PORT || 3000;
  try {
    await app.listen({ port: Number(PORT) });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
