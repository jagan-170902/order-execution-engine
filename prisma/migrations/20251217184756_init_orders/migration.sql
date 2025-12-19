-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'routing', 'building', 'submitted', 'confirmed', 'failed');

-- CreateEnum
CREATE TYPE "DexType" AS ENUM ('RAYDIUM', 'METEORA');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputToken" TEXT NOT NULL,
    "outputToken" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "slippage" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "dex" "DexType",
    "price" DOUBLE PRECISION,
    "txHash" TEXT,
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
