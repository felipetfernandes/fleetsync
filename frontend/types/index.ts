// Tipos de dados
enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  WORKSHOP_MANAGER = 'WORKSHOP_MANAGER',
}

enum OrderType {
  PREVENTIVE,
  CORRECTIVE,
  PERIODIC,
}

enum VehicleStatus {
  AVAILABLE,
  UNAVAILABLE,
  MAINTENANCE,
}

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
};


type Order = {
  id: string;
  type: OrderType
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
};

type Company = {
  id: string;
  name: string;
  cnpj: string;
  assetCount: number;
  createdAt: string; // ou Date, se estiver parseando
  updatedAt: string;
};
