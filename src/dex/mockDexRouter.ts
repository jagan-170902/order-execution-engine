import { sleep } from '../utils/sleep';
import { OrderRequest } from '../types/order.types';
import { DexType } from '../generated/prisma/client';;

const basePrice = 1; // base mock price

function generateMockTxHash() {
  return `MOCK_TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export class MockDexRouter {
  async getRaydiumQuote(tokenIn: string, tokenOut: string, amount: number) {
    await sleep(200);
    return {
      dex: DexType.RAYDIUM,
      price: basePrice * (0.98 + Math.random() * 0.04),
      fee: 0.003,
      liquidity: 100000,
    };
  }

  async getMeteoraQuote(tokenIn: string, tokenOut: string, amount: number) {
    await sleep(200);
    return {
      dex: DexType.METEORA,
      price: basePrice * (0.97 + Math.random() * 0.05),
      fee: 0.002,
      liquidity: 120000,
    };
  }

  async executeSwap(dex: string, order: OrderRequest, finalPrice: number) {
    await sleep(2000 + Math.random() * 1000);
    return {
      txHash: generateMockTxHash(),
      executedPrice: finalPrice,
    };
  }
}
