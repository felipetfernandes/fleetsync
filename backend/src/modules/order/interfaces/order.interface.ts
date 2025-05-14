export enum OrderType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  PERIODIC = 'PERIODIC',
}

export interface Order {
  id: string;
  type: OrderType;
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