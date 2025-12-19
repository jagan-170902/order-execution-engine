import { emitStatus } from './websocket.service';
import { updateStatus, incrementRetry } from '../db/order.repo';
import { MockDexRouter } from '../dex/mockdexRouter';
import { OrderRequest } from '../types/order.types';

const dexRouter = new MockDexRouter();

export async function executeOrder(orderId: string, payload: OrderRequest) {
  try {
    const userId = payload.userId;
    console.log("▶ executeOrder started:", orderId);

    /* ROUTING */
    emitStatus(userId, { orderId, status: "routing" });
    await updateStatus(orderId, "routing");

    const [raydium, meteora] = await Promise.all([
      dexRouter.getRaydiumQuote(
        payload.inputToken,
        payload.outputToken,
        payload.amount
      ),
      dexRouter.getMeteoraQuote(
        payload.inputToken,
        payload.outputToken,
        payload.amount
      ),
    ]);

    const bestRoute = raydium.price >= meteora.price ? raydium : meteora;

    /* BUILDING */
    emitStatus(userId, {
      orderId,
      status: "building",
      dex: bestRoute.dex,
      price: bestRoute.price,
    });

    await updateStatus(orderId, "building", {
      dex: bestRoute.dex,
      price: bestRoute.price,
    });

    /* SUBMISSION */
    emitStatus(userId, { orderId, status: 'submitted' });
    await updateStatus(orderId, "submitted");

    const result = await dexRouter.executeSwap(
      bestRoute.dex,
      payload,
      bestRoute.price
    );

    /* CONFIRMED */
    emitStatus(userId, {
      orderId,
      status: 'confirmed',
      txHash: result.txHash,
      finalPrice: result.executedPrice,
      dex: bestRoute.dex,
    });

    await updateStatus(orderId, "confirmed", {
      txHash: result.txHash,
    });

    console.log("✅ Order confirmed:", orderId);
  } catch (err: any) {
    await incrementRetry(orderId);

    emitStatus(orderId, {
      status: 'failed',
      error: err.message,
    });

    await updateStatus(orderId, 'failed', {
      failureReason: err.message,
    });

    throw err; // allows BullMQ retry
  }
}