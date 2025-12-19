export type OrderStatus =
  | 'pending'
  | 'routing'
  | 'building'
  | 'submitted'
  | 'confirmed'
  | 'failed';

export interface OrderRequest {
  userId: string;
  inputToken: string;
  outputToken: string;
  amount: number;
  slippage: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
}