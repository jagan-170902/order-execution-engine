Order Execution Engine (Mock DEX)

A backend service that simulates an order execution engine with asynchronous processing, DEX routing, and real-time status updates via WebSockets.

We chose Market Orders because they are the simplest to execute and best demonstrate the core responsibilities of an execution engine—routing, execution, status tracking, and real-time updates—without introducing price-matching complexity.

The same engine can be extended to support Limit Orders by adding price conditions before execution and Sniper Orders by introducing trigger-based execution logic that listens to price feeds before submitting the order.

This project uses a mock DEX implementation (Raydium & Meteora–like behavior) to demonstrate system design without relying on real blockchain execution.

🚀 Features

Market order execution (mock)

DEX price comparison & routing

Asynchronous order processing using BullMQ

Real-time order status updates via WebSockets

Redis-backed job queue

Clean job lifecycle management

🌐 Deployed URL

Backend API

https://order-execution-engine-vo12.onrender.com/api/orders/execute (POST)


WebSocket Endpoint

ws://order-execution-engine-vo12.onrender.com/ws?userId=1

Hosted on Render.com

🧠 Design Decisions
1. WebSocket Ownership (User-based)

WebSocket connections are associated with userId.

A user can place multiple orders

All order updates are pushed to the same user socket

Each message contains orderId

WebSocket URL

/ws?userId=1

2. Single Process Architecture

The following run in the same Node.js process:

Fastify HTTP server

WebSocket manager

BullMQ worker

This avoids WebSocket state desynchronization and simplifies message delivery.

3. Asynchronous Order Execution

Orders follow this lifecycle:

HTTP request received

Job added to BullMQ

Worker processes the job

Status updates emitted over WebSocket

4. Mock DEX Router

Two mock DEXes are simulated:

Raydium

Meteora

Each provides:

Slightly randomized prices

Different fees

Artificial network latency

The engine automatically selects the best route.

5. Queue Cleanup Strategy

Completed jobs are removed immediately

Failed jobs are retained (limited count) for debugging

Prevents Redis memory bloat.

6. Serverless Limitation

This project intentionally avoids serverless deployment because:

WebSockets need long-lived connections

BullMQ workers require persistent processes

🛠️ Tech Stack

Node.js + TypeScript

Fastify

@fastify/websocket

BullMQ

Redis

PostgreSQL (Prisma-ready)

📦 Setup Instructions
1. Clone the repository
git clone <repo-url>
cd order-execution-engine

2. Install dependencies
npm install

3. Environment variables

Create a .env file:

PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/db_name?schema=public"
REDIS_URL=redis://localhost:6379

4. Start Redis cli(use WSL for windows)

5. Run the server
npm run dev

📡 API Usage
➤ Create Order (HTTP)

Endpoint

POST https://order-execution-engine-vo12.onrender.com/api/orders/execute


Sample Request

{
  "userId": "1",
  "inputToken": "SOL",
  "outputToken": "USDC",
  "amount": 10
}


Sample Response

{
  "orderId": "order_abc123",
  "status": "pending"
}

🔌 WebSocket Events

Connect:

ws://order-execution-engine-vo12.onrender.com/ws?userId=1

Sample Messages

Connected

{
  "type": "connected",
  "userId": "1"
}


Order Routing

{
  "orderId": "order_abc123",
  "status": "routing"
}


Order Submitted

{
  "orderId": "order_abc123",
  "status": "submitted",
  "dex": "RAYDIUM",
  "price": 99.32
}


Order Confirmed

{
  "orderId": "order_abc123",
  "status": "confirmed",
  "dex": "RAYDIUM",
  "txHash": "0xMOCKTX123",
  "finalPrice": 99.18
}


Order Failed

{
  "orderId": "order_abc123",
  "status": "failed",
  "error": "Execution timeout"
}

📈 Future Improvements

JWT-authenticated WebSockets

Multi-instance scaling with Redis Pub/Sub

Order cancellation support

Metrics & tracing (OpenTelemetry)

Real DEX devnet integration