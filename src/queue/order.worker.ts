import { Worker } from 'bullmq';
import { connection } from './order.queue';
import { executeOrder } from '../services/execution.service';

console.log('🟢 Worker starting...');

new Worker(
  "orders",
  async (job) => {
    console.log(`📥 Worker received job: ${job.data.orderId}`);
    const { orderId, payload } = job.data;
    await executeOrder(orderId, payload);
    console.log(`✅ Job completed: ${orderId}`);
  },
  {
    connection,
    concurrency: 10,
    removeOnComplete: {
      count: 0, // remove immediately after completion
    },
    removeOnFail: {
      count: 100, // keep last 10 failed jobs (optional)
    },
  }
);