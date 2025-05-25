import { OrderType, OrderStatus } from '@prisma/client';

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  description: string;
  startDate: Date;
  endDate?: Date;
  totalCost: number;
  companyId: string;
  branchId: number;
  vehicleId: string;
  workshopId: string;
  createdAt: Date;
  updatedAt: Date;
}
