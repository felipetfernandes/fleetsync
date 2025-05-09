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
  
  type Order = {
    id: string;
    description: string;
    type: "Manutenção Preventiva" | "Manutenção Corretiva" | "Manutenção Emergencial";
    cost: number;
    serviceDate: Date;
    status: "Agendado" | "Em Andamento" | "Concluído";
    createdAt: Date;
    updatedAt: Date;
    vehicle: Vehicle;
    workshop: Workshop;
    filial: string;
  };
