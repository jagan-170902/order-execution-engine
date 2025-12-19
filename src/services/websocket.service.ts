import WebSocket from 'ws';

const clients = new Map<string, WebSocket>(); // userId -> socket

export function registerSocket(userId: string, ws: WebSocket) {
  clients.set(userId, ws);
}

export function removeSocket(userId: string) {
  clients.delete(userId);
}

export function getSocket(userId: string) {
  return clients.get(userId);
}

export function emitStatus(userId: string, payload: any) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}