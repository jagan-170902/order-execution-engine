import { FastifyInstance } from 'fastify';
import { v4 as uuid } from 'uuid';
import { orderQueue } from '../queue/order.queue';
import { createOrder } from '../db/order.repo';

export default async function routes(app: FastifyInstance) {
  // HTTP POST to create order
  app.post('/api/orders/execute', async (req, reply) => {
    try {
      console.log('api hit');
      const orderId = uuid();
      const payload = req.body as any;

      await createOrder(orderId, payload);

      console.log('orderQueue hit');
      await orderQueue.add(
        'execute-order',
        { orderId, payload },
        { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
      );

      return { orderId, status: 'pending' };
    } catch (err) {
      console.error('❌ Error in /api/orders/execute:', err);
      return reply.status(500).send({
        status: 'error',
        message: (err as Error).message,
      });
    }
  });
}