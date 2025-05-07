type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: string;
  manufactureYear: string;
  color: string;
  renavam: string;
  chassi: string;
  branch: string;
  driver: string;
  status: string;
};

type Workshop = {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  telephone: string;
  adress: string;
  vehiclesInMaintenance: Array<Vehicle>;
};

