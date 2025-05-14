export interface OrderItem {
  id: string;
  description: string;
  cost: number;
  laborCost: number;
  totalCost: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}