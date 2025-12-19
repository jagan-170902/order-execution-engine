import { FastifyInstance } from 'fastify';
import { v4 as uuid } from 'uuid';
import { orderQueue } from '../queue/order.queue';
import { createOrder } from '../db/order.repo';

export default async function routes(app: FastifyInstance) {
  // HTTP POST to create order
  app.post('/api/orders/execute', async (req, reply) => {
    try {
      const { userId, inputToken, outputToken, amount } = req.body as any;

      if (!userId || !inputToken || !outputToken || amount == null) {
        return reply.status(400).send({
          status: "error",
          message:
            "Missing required fields: userId, inputToken, outputToken, amount",
        });
      }

      if (typeof amount !== "number" || amount <= 0) {
        return reply.status(400).send({
          status: "error",
          message: "amount must be a positive number",
        });
      }
      
      const orderId = uuid();
      const payload = req.body as any;

      await createOrder(orderId, payload);

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