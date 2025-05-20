export enum VehicleStatus {
  AVAILABLE,
  UNAVAILABLE,
  MAINTENANCE,
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  manufactureYear: number;
  color: string;
  renavam: string;
  chassis: string;
  status: VehicleStatus;
  purchaseDate?: Date;
  purchaseType?: string;
  purchaseValue?: number;
  seller?: string;
  mileageStart: number;
  mileageCurrent: number;
  insuranceProvider?: string;
  insurancePolicy?: string;
  insuranceExpires?: Date;
  insuranceValue?: number;
  ipvaStatus?: string;
  ipvaValue?: number;
  ipvaDueDate?: Date;
  licenseStatus?: string;
  licenseValue?: number;
  licenseDueDate?: Date;
  companyId: string;
  branchId: number;
  driverId?: string;
  createdAt: Date;
  updatedAt: Date;
}
