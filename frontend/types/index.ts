// Tipos de dados
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "driver";
  avatar?: string;
  phone: string;
  department?: string;
  licenseNumber?: string;
  licenseCategory?: string;
};

type Vehicle = {
  id: string;
  plate: string;
  branch: string;
  model: string;
  brand: string;
  yearModelo: string;
  yearFabricacao: string;
  color: string;
  renavam: string;
  chassi: string;
  status: "Ativo" | "Manutenção" | "Inativo";
  driverId: string;
  acquisition: {
    date: Date;
    type: string;
    value: number;
    supplier: string;
  };
  documents: {
    insurance: {
      company: string;
      policy: string;
      validUntil: Date;
      value: number;
    };
    ipva: {
      paid: boolean;
      value: number;
      dueDate: Date;
    };
    licensing: {
      paid: boolean;
      value: number;
      dueDate: Date;
    };
  };
  stats: {
    totalMaintenanceCost: number;
    maintenanceCount: number;
    daysInMaintenance: number;
    lastMaintenance: Date;
    fuelConsumption: number;
    mileage: number;
    availability: number;
  };
};

type Workshop = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  telephone: string;
  adress: string;
  rating: number;
  ordersCount: number;
  vehiclesInMaintenance: {
    id: string;
    plate: string;
    model: string;
    brand: string;
    color: string;
    status: string;
    serviceDescription: string;
  }[];
};

type ServiceOrder = {
  id: string;
  description: string;
  type: string;
  cost: number;
  serviceDate: Date;
  status:
    | "Agendado"
    | "Veículo Entregue"
    | "Em Andamento"
    | "Concluído"
    | "Cancelado";
  createdAt: Date;
  updatedAt: Date;
  vehicleId: string;
  driverId: string;
  workshopId: string;
  filialId: string;
  notes?: string;
  statusHistory: {
    id: string;
    status: string;
    date: Date;
    description: string;
  }[];
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

type Enterprise = {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
};
