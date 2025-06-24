import { OrderStatus, OrderType, UserRole } from "./enums";

// Tipos de dados
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseExpiration?: Date;
  branchId: number;
  createdAt: Date;
  updatedAt: Date;
  Vehicle?: Vehicle;
  Workshop?: Workshop;
  Branch?: Branch;
}

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  manufactureYear: number;
  color: string;
  renavam: string;
  chassis: string;
  status: string;
  purchaseDate: Date;
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
  driver: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    licenseNumber?: string;
    licenseCategory?: string;
    licenseExpiration?: Date;
  };
}

type Workshop = {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  manager: string | null;
  order: Order[];
};

type OrderItemForm = {
  id: string;
  description: string;
  cost: string;       // armazenado como string para facilitar uso com input
  laborCost: string;  // idem
};

type Order = {
  id: string;
  type: OrderType;
  status: OrderStatus;
  description: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  companyId: string;
  branchId: number;
  vehicleId: string;
  workshopId: string;
  createdAt: string;
  updatedAt: string;
  workshop: Workshop;
  company: Company;
  vehicle: Vehicle;
  branch: Branch;
  items: OrderItemForm[];
};

type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  manager: string;
  users: User[];
  vehicles: Vehicle[];
  workshops: Workshop[];
  Order: Order[];
};

type Company = {
  id: string;
  name: string;
  cnpj: string;
  assetCount: number;
  createdAt: string; // ou Date, se estiver parseando
  updatedAt: string;
};

export type {
  User,
  Vehicle,
  Workshop,
  Order,
  Branch,
  Company,
  OrderItemForm,
};