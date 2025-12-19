import { prisma } from './prisma';
import { OrderStatus, DexType } from '@prisma/client';

export async function createOrder(orderId: string, payload: any) {
  return prisma.order.create({
    data: {
      id: orderId,
      userId: payload.userId,
      inputToken: payload.inputToken,
      outputToken: payload.outputToken,
      amount: payload.amount,
      slippage: payload.slippage ?? 0.005,
      status: 'pending',
    }
  });
}

export async function updateStatus(
  orderId: string,
  status: OrderStatus,
  extra?: Partial<{
    dex: DexType;
    price: number;
    txHash: string;
    failureReason: string;
  }>
) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...extra
    }
  });
}

export async function incrementRetry(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      retryCount: { increment: 1 }
    }
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId }
  });
}
