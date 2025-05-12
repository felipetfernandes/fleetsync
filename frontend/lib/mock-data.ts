// Dados mock
export const mockEnterprise: Enterprise = {
  id: "ent1",
  name: "Transportes Brasil Ltda.",
  cnpj: "12.345.678/0001-90",
  address: "Av. Paulista, 1000, São Paulo - SP",
  phone: "(11) 3456-7890",
  email: "contato@transportesbrasil.com",
  website: "www.transportesbrasil.com",
  logo: "/placeholder.svg?height=80&width=80",
};

export const mockFiliais: Branch[] = [
  {
    id: "fil1",
    name: "São Paulo",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3456-7890",
    email: "sp@transportesbrasil.com",
    manager: "Roberto Almeida",
  },
  {
    id: "fil2",
    name: "Rio de Janeiro",
    address: "Av. Rio Branco, 500",
    city: "Rio de Janeiro",
    state: "RJ",
    phone: "(21) 3456-7890",
    email: "rj@transportesbrasil.com",
    manager: "Juliana Lima",
  },
];

export const mockUsers: User[] = [
  // Administradores
  {
    id: "adm1",
    name: "Carlos Silva",
    email: "carlos.silva@transportesbrasil.com",
    role: "admin",
    phone: "(11) 98765-4321",
    department: "Gestão de Frota",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "adm2",
    name: "Ana Oliveira",
    email: "ana.oliveira@transportesbrasil.com",
    role: "admin",
    phone: "(11) 98765-4322",
    department: "Operações",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "adm3",
    name: "Pedro Santos",
    email: "pedro.santos@transportesbrasil.com",
    role: "admin",
    phone: "(21) 98765-4323",
    department: "Manutenção",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // Motoristas
  {
    id: "drv1",
    name: "João Pereira",
    email: "joao.pereira@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-1111",
    licenseNumber: "12345678901",
    licenseCategory: "D",
  },
  {
    id: "drv2",
    name: "Maria Costa",
    email: "maria.costa@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-2222",
    licenseNumber: "23456789012",
    licenseCategory: "B",
  },
  {
    id: "drv3",
    name: "Roberto Almeida",
    email: "roberto.almeida@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-3333",
    licenseNumber: "34567890123",
    licenseCategory: "D",
  },
  {
    id: "drv4",
    name: "Juliana Lima",
    email: "juliana.lima@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98765-4444",
    licenseNumber: "45678901234",
    licenseCategory: "B",
  },
  {
    id: "drv5",
    name: "Fernando Gomes",
    email: "fernando.gomes@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98765-5555",
    licenseNumber: "56789012345",
    licenseCategory: "C",
  },
  {
    id: "drv6",
    name: "Luciana Martins",
    email: "luciana.martins@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-6666",
    licenseNumber: "67890123456",
    licenseCategory: "B",
  },
  {
    id: "drv7",
    name: "Ricardo Souza",
    email: "ricardo.souza@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-7777",
    licenseNumber: "78901234567",
    licenseCategory: "D",
  },
  {
    id: "drv8",
    name: "Camila Ferreira",
    email: "camila.ferreira@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98765-8888",
    licenseNumber: "89012345678",
    licenseCategory: "B",
  },
  {
    id: "drv9",
    name: "Marcelo Ribeiro",
    email: "marcelo.ribeiro@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98765-9999",
    licenseNumber: "90123456789",
    licenseCategory: "C",
  },
  {
    id: "drv10",
    name: "Patricia Mendes",
    email: "patricia.mendes@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98765-0000",
    licenseNumber: "01234567890",
    licenseCategory: "B",
  },
  {
    id: "drv11",
    name: "Lucas Oliveira",
    email: "lucas.oliveira@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98764-1111",
    licenseNumber: "12345678902",
    licenseCategory: "D",
  },
  {
    id: "drv12",
    name: "Amanda Santos",
    email: "amanda.santos@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98764-2222",
    licenseNumber: "23456789013",
    licenseCategory: "B",
  },
  {
    id: "drv13",
    name: "Bruno Costa",
    email: "bruno.costa@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98764-3333",
    licenseNumber: "34567890124",
    licenseCategory: "C",
  },
  {
    id: "drv14",
    name: "Carla Pereira",
    email: "carla.pereira@transportesbrasil.com",
    role: "driver",
    phone: "(11) 98764-4444",
    licenseNumber: "45678901235",
    licenseCategory: "B",
  },
  {
    id: "drv15",
    name: "Daniel Lima",
    email: "daniel.lima@transportesbrasil.com",
    role: "driver",
    phone: "(21) 98764-5555",
    licenseNumber: "56789012346",
    licenseCategory: "D",
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    plate: "ABC1234",
    branch: "São Paulo",
    model: "Corolla",
    brand: "Toyota",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Preto",
    renavam: "12345678901",
    chassi: "9BRBL9BF1K0123456",
    status: "Ativo",
    driverId: "drv1",
    acquisition: {
      date: new Date("2021-06-15"),
      type: "Compra",
      value: 120000.0,
      supplier: "Concessionária Toyota",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "123456789",
        validUntil: new Date("2025-06-15"),
        value: 3500.0,
      },
      ipva: {
        paid: true,
        value: 2800.0,
        dueDate: new Date("2025-04-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-09-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 5850.25,
      maintenanceCount: 8,
      daysInMaintenance: 14,
      lastMaintenance: new Date("2025-03-10"),
      fuelConsumption: 11.5,
      mileage: 28500,
      availability: 96,
    },
  },
  {
    id: "v2",
    plate: "DEF5678",
    branch: "Rio de Janeiro",
    model: "Civic",
    brand: "Honda",
    yearModelo: "2021",
    yearFabricacao: "2020",
    color: "Branco",
    renavam: "98765432101",
    chassi: "93HGK5830MZ123456",
    status: "Ativo",
    driverId: "drv2",
    acquisition: {
      date: new Date("2020-11-10"),
      type: "Compra",
      value: 110000.0,
      supplier: "Concessionária Honda",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "987654321",
        validUntil: new Date("2025-11-10"),
        value: 3200.0,
      },
      ipva: {
        paid: true,
        value: 2600.0,
        dueDate: new Date("2025-03-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-08-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 4320.75,
      maintenanceCount: 6,
      daysInMaintenance: 10,
      lastMaintenance: new Date("2025-02-15"),
      fuelConsumption: 12.8,
      mileage: 32100,
      availability: 98,
    },
  },
  {
    id: "v3",
    plate: "GHI9012",
    branch: "São Paulo",
    model: "Compass",
    brand: "Jeep",
    yearModelo: "2023",
    yearFabricacao: "2022",
    color: "Cinza",
    renavam: "45678901234",
    chassi: "8AJYZ59G6K0123456",
    status: "Manutenção",
    driverId: "drv3",
    acquisition: {
      date: new Date("2022-08-20"),
      type: "Compra",
      value: 150000.0,
      supplier: "Concessionária Jeep",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "456789012",
        validUntil: new Date("2025-08-20"),
        value: 4200.0,
      },
      ipva: {
        paid: true,
        value: 3200.0,
        dueDate: new Date("2025-05-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-10-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 3150.5,
      maintenanceCount: 4,
      daysInMaintenance: 8,
      lastMaintenance: new Date("2025-04-05"),
      fuelConsumption: 9.5,
      mileage: 18500,
      availability: 92,
    },
  },
  {
    id: "v4",
    plate: "JKL3456",
    branch: "Rio de Janeiro",
    model: "Onix",
    brand: "Chevrolet",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Vermelho",
    renavam: "56789012345",
    chassi: "9BGKS48G0MG123456",
    status: "Ativo",
    driverId: "drv4",
    acquisition: {
      date: new Date("2021-09-05"),
      type: "Compra",
      value: 85000.0,
      supplier: "Concessionária Chevrolet",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "567890123",
        validUntil: new Date("2025-09-05"),
        value: 2800.0,
      },
      ipva: {
        paid: true,
        value: 1900.0,
        dueDate: new Date("2025-02-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-07-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 2850.25,
      maintenanceCount: 5,
      daysInMaintenance: 7,
      lastMaintenance: new Date("2025-01-20"),
      fuelConsumption: 13.2,
      mileage: 25800,
      availability: 97,
    },
  },
  {
    id: "v5",
    plate: "MNO7890",
    branch: "São Paulo",
    model: "HB20",
    brand: "Hyundai",
    yearModelo: "2021",
    yearFabricacao: "2020",
    color: "Prata",
    renavam: "67890123456",
    chassi: "9BHBG51DAMB123456",
    status: "Ativo",
    driverId: "drv5",
    acquisition: {
      date: new Date("2020-12-10"),
      type: "Compra",
      value: 78000.0,
      supplier: "Concessionária Hyundai",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "678901234",
        validUntil: new Date("2025-12-10"),
        value: 2600.0,
      },
      ipva: {
        paid: true,
        value: 1750.0,
        dueDate: new Date("2025-03-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-08-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 2450.75,
      maintenanceCount: 4,
      daysInMaintenance: 6,
      lastMaintenance: new Date("2025-02-05"),
      fuelConsumption: 14.5,
      mileage: 31200,
      availability: 98,
    },
  },
  {
    id: "v6",
    plate: "PQR1234",
    branch: "Rio de Janeiro",
    model: "Renegade",
    brand: "Jeep",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Verde",
    renavam: "78901234567",
    chassi: "8AJYZ59G6K0234567",
    status: "Ativo",
    driverId: "drv6",
    acquisition: {
      date: new Date("2021-07-15"),
      type: "Compra",
      value: 130000.0,
      supplier: "Concessionária Jeep",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "789012345",
        validUntil: new Date("2025-07-15"),
        value: 3800.0,
      },
      ipva: {
        paid: true,
        value: 2900.0,
        dueDate: new Date("2025-04-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-09-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 3950.5,
      maintenanceCount: 5,
      daysInMaintenance: 9,
      lastMaintenance: new Date("2025-03-25"),
      fuelConsumption: 10.2,
      mileage: 22500,
      availability: 95,
    },
  },
  {
    id: "v7",
    plate: "STU5678",
    branch: "São Paulo",
    model: "Cruze",
    brand: "Chevrolet",
    yearModelo: "2021",
    yearFabricacao: "2020",
    color: "Azul",
    renavam: "89012345678",
    chassi: "9BGKS48G0MG234567",
    status: "Ativo",
    driverId: "drv7",
    acquisition: {
      date: new Date("2020-10-20"),
      type: "Compra",
      value: 105000.0,
      supplier: "Concessionária Chevrolet",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "890123456",
        validUntil: new Date("2025-10-20"),
        value: 3300.0,
      },
      ipva: {
        paid: true,
        value: 2400.0,
        dueDate: new Date("2025-02-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-07-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 4150.25,
      maintenanceCount: 6,
      daysInMaintenance: 11,
      lastMaintenance: new Date("2025-01-15"),
      fuelConsumption: 11.8,
      mileage: 33500,
      availability: 94,
    },
  },
  {
    id: "v8",
    plate: "VWX9012",
    branch: "Rio de Janeiro",
    model: "Tucson",
    brand: "Hyundai",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Preto",
    renavam: "90123456789",
    chassi: "9BHBG51DAMB234567",
    status: "Manutenção",
    driverId: "drv8",
    acquisition: {
      date: new Date("2021-08-10"),
      type: "Compra",
      value: 140000.0,
      supplier: "Concessionária Hyundai",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "901234567",
        validUntil: new Date("2025-08-10"),
        value: 4000.0,
      },
      ipva: {
        paid: true,
        value: 3100.0,
        dueDate: new Date("2025-05-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-10-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 5250.75,
      maintenanceCount: 7,
      daysInMaintenance: 13,
      lastMaintenance: new Date("2025-04-10"),
      fuelConsumption: 9.8,
      mileage: 26800,
      availability: 91,
    },
  },
  {
    id: "v9",
    plate: "YZA3456",
    branch: "São Paulo",
    model: "Kicks",
    brand: "Nissan",
    yearModelo: "2023",
    yearFabricacao: "2022",
    color: "Branco",
    renavam: "01234567890",
    chassi: "94DVAN23UNB123456",
    status: "Ativo",
    driverId: "drv9",
    acquisition: {
      date: new Date("2022-09-15"),
      type: "Compra",
      value: 125000.0,
      supplier: "Concessionária Nissan",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "012345678",
        validUntil: new Date("2025-09-15"),
        value: 3700.0,
      },
      ipva: {
        paid: true,
        value: 2750.0,
        dueDate: new Date("2025-06-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-11-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 2850.5,
      maintenanceCount: 3,
      daysInMaintenance: 5,
      lastMaintenance: new Date("2025-03-20"),
      fuelConsumption: 12.5,
      mileage: 15800,
      availability: 98,
    },
  },
  {
    id: "v10",
    plate: "BCD7890",
    branch: "Rio de Janeiro",
    model: "T-Cross",
    brand: "Volkswagen",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Prata",
    renavam: "12345678902",
    chassi: "9BWGS45U0MT123456",
    status: "Ativo",
    driverId: "drv10",
    acquisition: {
      date: new Date("2021-10-05"),
      type: "Compra",
      value: 115000.0,
      supplier: "Concessionária Volkswagen",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "123456780",
        validUntil: new Date("2025-10-05"),
        value: 3400.0,
      },
      ipva: {
        paid: true,
        value: 2550.0,
        dueDate: new Date("2025-02-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-07-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 3650.25,
      maintenanceCount: 5,
      daysInMaintenance: 8,
      lastMaintenance: new Date("2025-02-25"),
      fuelConsumption: 11.2,
      mileage: 24500,
      availability: 96,
    },
  },
  {
    id: "v11",
    plate: "EFG1234",
    branch: "São Paulo",
    model: "Ranger",
    brand: "Ford",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Preto",
    renavam: "23456789013",
    chassi: "8AFAR23N9MJ123456",
    status: "Ativo",
    driverId: "drv11",
    acquisition: {
      date: new Date("2021-11-15"),
      type: "Compra",
      value: 180000.0,
      supplier: "Concessionária Ford",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "234567891",
        validUntil: new Date("2025-11-15"),
        value: 5200.0,
      },
      ipva: {
        paid: true,
        value: 3800.0,
        dueDate: new Date("2025-03-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-08-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 6250.75,
      maintenanceCount: 7,
      daysInMaintenance: 12,
      lastMaintenance: new Date("2025-03-05"),
      fuelConsumption: 8.5,
      mileage: 29800,
      availability: 93,
    },
  },
  {
    id: "v12",
    plate: "HIJ5678",
    branch: "Rio de Janeiro",
    model: "Hilux",
    brand: "Toyota",
    yearModelo: "2023",
    yearFabricacao: "2022",
    color: "Prata",
    renavam: "34567890124",
    chassi: "8AJYZ59G6K0345678",
    status: "Ativo",
    driverId: "drv12",
    acquisition: {
      date: new Date("2022-07-20"),
      type: "Compra",
      value: 220000.0,
      supplier: "Concessionária Toyota",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "345678902",
        validUntil: new Date("2025-07-20"),
        value: 6500.0,
      },
      ipva: {
        paid: true,
        value: 4500.0,
        dueDate: new Date("2025-05-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-10-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 7150.5,
      maintenanceCount: 6,
      daysInMaintenance: 10,
      lastMaintenance: new Date("2025-04-15"),
      fuelConsumption: 7.8,
      mileage: 21500,
      availability: 95,
    },
  },
  {
    id: "v13",
    plate: "KLM9012",
    branch: "São Paulo",
    model: "Polo",
    brand: "Volkswagen",
    yearModelo: "2021",
    yearFabricacao: "2020",
    color: "Branco",
    renavam: "45678901235",
    chassi: "9BWGS45U0MT234567",
    status: "Inativo",
    driverId: "drv13",
    acquisition: {
      date: new Date("2020-09-10"),
      type: "Compra",
      value: 75000.0,
      supplier: "Concessionária Volkswagen",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "456789013",
        validUntil: new Date("2025-09-10"),
        value: 2400.0,
      },
      ipva: {
        paid: false,
        value: 1650.0,
        dueDate: new Date("2025-02-15"),
      },
      licensing: {
        paid: false,
        value: 98.0,
        dueDate: new Date("2025-07-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 3250.25,
      maintenanceCount: 5,
      daysInMaintenance: 9,
      lastMaintenance: new Date("2024-12-10"),
      fuelConsumption: 13.5,
      mileage: 28200,
      availability: 85,
    },
  },
  {
    id: "v14",
    plate: "NOP3456",
    branch: "Rio de Janeiro",
    model: "Creta",
    brand: "Hyundai",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Cinza",
    renavam: "56789012346",
    chassi: "9BHBG51DAMB345678",
    status: "Ativo",
    driverId: "drv14",
    acquisition: {
      date: new Date("2021-08-15"),
      type: "Compra",
      value: 110000.0,
      supplier: "Concessionária Hyundai",
    },
    documents: {
      insurance: {
        company: "Seguradora ABC",
        policy: "567890124",
        validUntil: new Date("2025-08-15"),
        value: 3300.0,
      },
      ipva: {
        paid: true,
        value: 2450.0,
        dueDate: new Date("2025-05-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-10-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 4050.75,
      maintenanceCount: 6,
      daysInMaintenance: 11,
      lastMaintenance: new Date("2025-03-15"),
      fuelConsumption: 10.8,
      mileage: 25600,
      availability: 94,
    },
  },
  {
    id: "v15",
    plate: "QRS7890",
    branch: "São Paulo",
    model: "Toro",
    brand: "Fiat",
    yearModelo: "2023",
    yearFabricacao: "2022",
    color: "Vermelho",
    renavam: "67890123457",
    chassi: "9BD226S3VNP123456",
    status: "Ativo",
    driverId: "drv15",
    acquisition: {
      date: new Date("2022-10-05"),
      type: "Compra",
      value: 145000.0,
      supplier: "Concessionária Fiat",
    },
    documents: {
      insurance: {
        company: "Seguradora XYZ",
        policy: "678901235",
        validUntil: new Date("2025-10-05"),
        value: 4200.0,
      },
      ipva: {
        paid: true,
        value: 3200.0,
        dueDate: new Date("2025-06-15"),
      },
      licensing: {
        paid: true,
        value: 98.0,
        dueDate: new Date("2025-11-30"),
      },
    },
    stats: {
      totalMaintenanceCost: 3850.5,
      maintenanceCount: 4,
      daysInMaintenance: 7,
      lastMaintenance: new Date("2025-04-05"),
      fuelConsumption: 9.2,
      mileage: 18500,
      availability: 97,
    },
  },
];

export const mockWorkshops: Workshop[] = [
  {
    id: "w1",
    name: "Auto Center Express",
    cnpj: "12.345.678/0001-90",
    email: "contato@autocenterexpress.com",
    telephone: "(11) 3456-7890",
    adress: "Av. Paulista, 1000, São Paulo - SP",
    rating: 4.8,
    ordersCount: 28,
    vehiclesInMaintenance: [
      {
        id: "v3",
        plate: "GHI9012",
        model: "Compass",
        brand: "Jeep",
        color: "Cinza",
        status: "Manutenção",
        serviceDescription: "Revisão de 30.000 km",
      },
    ],
  },
  {
    id: "w2",
    name: "Mecânica Precisão",
    cnpj: "98.765.432/0001-10",
    email: "atendimento@mecanicaprecisao.com",
    telephone: "(11) 2345-6789",
    adress: "Rua Augusta, 500, São Paulo - SP",
    rating: 4.6,
    ordersCount: 22,
    vehiclesInMaintenance: [
      {
        id: "v8",
        plate: "VWX9012",
        model: "Tucson",
        brand: "Hyundai",
        color: "Preto",
        status: "Manutenção",
        serviceDescription: "Reparo no sistema de freios",
      },
    ],
  },
  {
    id: "w3",
    name: "Oficina Central",
    cnpj: "45.678.901/0001-23",
    email: "contato@oficinacentral.com",
    telephone: "(21) 3456-7890",
    adress: "Av. Rio Branco, 150, Rio de Janeiro - RJ",
    rating: 4.5,
    ordersCount: 19,
    vehiclesInMaintenance: [],
  },
  {
    id: "w4",
    name: "Auto Elétrica Confiança",
    cnpj: "34.567.890/0001-12",
    email: "servicos@autoeletricaconfianca.com",
    telephone: "(31) 2345-6789",
    adress: "Av. Afonso Pena, 2000, Belo Horizonte - MG",
    rating: 4.7,
    ordersCount: 15,
    vehiclesInMaintenance: [],
  },
  {
    id: "w5",
    name: "Centro Automotivo Rápido",
    cnpj: "23.456.789/0001-34",
    email: "contato@centroautomotivo.com",
    telephone: "(11) 4567-8901",
    adress: "Av. Rebouças, 800, São Paulo - SP",
    rating: 4.3,
    ordersCount: 12,
    vehiclesInMaintenance: [],
  },
  {
    id: "w6",
    name: "Oficina do João",
    cnpj: "12.345.678/0001-45",
    email: "contato@oficinadojoao.com",
    telephone: "(21) 5678-9012",
    adress: "Rua da Passagem, 123, Rio de Janeiro - RJ",
    rating: 4.4,
    ordersCount: 10,
    vehiclesInMaintenance: [],
  },
  {
    id: "w7",
    name: "Mecânica Especializada",
    cnpj: "34.567.890/0001-56",
    email: "contato@mecanicaespecializada.com",
    telephone: "(11) 6789-0123",
    adress: "Av. Santo Amaro, 500, São Paulo - SP",
    rating: 4.2,
    ordersCount: 8,
    vehiclesInMaintenance: [],
  },
  {
    id: "w8",
    name: "Auto Service Premium",
    cnpj: "45.678.901/0001-67",
    email: "contato@autoservicepremium.com",
    telephone: "(21) 7890-1234",
    adress: "Av. das Américas, 2000, Rio de Janeiro - RJ",
    rating: 4.9,
    ordersCount: 14,
    vehiclesInMaintenance: [],
  },
  {
    id: "w9",
    name: "Oficina Multimarcas",
    cnpj: "56.789.012/0001-78",
    email: "contato@multimarcas.com",
    telephone: "(11) 8901-2345",
    adress: "Rua Vergueiro, 1500, São Paulo - SP",
    rating: 4.1,
    ordersCount: 7,
    vehiclesInMaintenance: [],
  },
  {
    id: "w10",
    name: "Centro de Reparos Automotivos",
    cnpj: "67.890.123/0001-89",
    email: "contato@centrodereparos.com",
    telephone: "(21) 9012-3456",
    adress: "Rua Barata Ribeiro, 300, Rio de Janeiro - RJ",
    rating: 4.0,
    ordersCount: 5,
    vehiclesInMaintenance: [],
  },
];

export const mockOrders: ServiceOrder[] = [
  {
    id: "ord123456",
    description:
      "Revisão completa do motor e substituição de componentes desgastados",
    type: "Manutenção Preventiva",
    cost: 1250.75,
    serviceDate: new Date("2025-05-15T10:00:00"),
    status: "Em Andamento",
    createdAt: new Date("2025-05-01T14:30:00"),
    updatedAt: new Date("2025-05-10T09:15:00"),
    vehicleId: "v1",
    driverId: "drv1",
    workshopId: "w1",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh1",
        status: "Agendado",
        date: new Date("2025-05-01T14:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh2",
        status: "Veículo Entregue",
        date: new Date("2025-05-15T08:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh3",
        status: "Em Andamento",
        date: new Date("2025-05-15T10:30:00"),
        description: "Início dos trabalhos de manutenção",
      },
    ],
  },
  {
    id: "ord123457",
    description: "Troca de embreagem e revisão do sistema de transmissão",
    type: "Manutenção Corretiva",
    cost: 980.0,
    serviceDate: new Date("2025-05-18T09:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-05T10:20:00"),
    updatedAt: new Date("2025-05-05T10:20:00"),
    vehicleId: "v2",
    driverId: "drv2",
    workshopId: "w2",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh4",
        status: "Agendado",
        date: new Date("2025-05-05T10:20:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123458",
    description: "Reparo no sistema de freios e substituição de pastilhas",
    type: "Manutenção Corretiva",
    cost: 750.5,
    serviceDate: new Date("2025-05-10T14:00:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-02T09:30:00"),
    updatedAt: new Date("2025-05-10T16:45:00"),
    vehicleId: "v3",
    driverId: "drv3",
    workshopId: "w3",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh5",
        status: "Agendado",
        date: new Date("2025-05-02T09:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh6",
        status: "Veículo Entregue",
        date: new Date("2025-05-10T13:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh7",
        status: "Em Andamento",
        date: new Date("2025-05-10T14:15:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh8",
        status: "Concluído",
        date: new Date("2025-05-10T16:45:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123459",
    description: "Reparo no sistema elétrico e substituição de bateria",
    type: "Manutenção Emergencial",
    cost: 420.0,
    serviceDate: new Date("2025-05-08T11:30:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-07T16:15:00"),
    updatedAt: new Date("2025-05-08T14:20:00"),
    vehicleId: "v4",
    driverId: "drv4",
    workshopId: "w4",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh9",
        status: "Agendado",
        date: new Date("2025-05-07T16:15:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh10",
        status: "Veículo Entregue",
        date: new Date("2025-05-08T11:15:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh11",
        status: "Em Andamento",
        date: new Date("2025-05-08T11:45:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh12",
        status: "Concluído",
        date: new Date("2025-05-08T14:20:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123460",
    description: "Troca de óleo e filtros",
    type: "Manutenção Preventiva",
    cost: 350.0,
    serviceDate: new Date("2025-05-20T10:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-10T11:30:00"),
    updatedAt: new Date("2025-05-10T11:30:00"),
    vehicleId: "v5",
    driverId: "drv5",
    workshopId: "w1",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh13",
        status: "Agendado",
        date: new Date("2025-05-10T11:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123461",
    description: "Alinhamento, balanceamento e troca de pneus",
    type: "Manutenção Preventiva",
    cost: 890.0,
    serviceDate: new Date("2025-05-12T14:30:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-03T09:45:00"),
    updatedAt: new Date("2025-05-12T17:10:00"),
    vehicleId: "v6",
    driverId: "drv6",
    workshopId: "w2",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh14",
        status: "Agendado",
        date: new Date("2025-05-03T09:45:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh15",
        status: "Veículo Entregue",
        date: new Date("2025-05-12T14:15:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh16",
        status: "Em Andamento",
        date: new Date("2025-05-12T14:45:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh17",
        status: "Concluído",
        date: new Date("2025-05-12T17:10:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123462",
    description: "Reparo no ar condicionado",
    type: "Manutenção Corretiva",
    cost: 580.0,
    serviceDate: new Date("2025-05-25T09:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-11T14:20:00"),
    updatedAt: new Date("2025-05-11T14:20:00"),
    vehicleId: "v7",
    driverId: "drv7",
    workshopId: "w4",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh18",
        status: "Agendado",
        date: new Date("2025-05-11T14:20:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123463",
    description: "Revisão de 30.000 km",
    type: "Manutenção Preventiva",
    cost: 1100.0,
    serviceDate: new Date("2025-05-05T10:30:00"),
    status: "Concluído",
    createdAt: new Date("2025-04-28T11:15:00"),
    updatedAt: new Date("2025-05-05T14:40:00"),
    vehicleId: "v8",
    driverId: "drv8",
    workshopId: "w3",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh19",
        status: "Agendado",
        date: new Date("2025-04-28T11:15:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh20",
        status: "Veículo Entregue",
        date: new Date("2025-05-05T10:15:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh21",
        status: "Em Andamento",
        date: new Date("2025-05-05T10:45:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh22",
        status: "Concluído",
        date: new Date("2025-05-05T14:40:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123464",
    description: "Substituição da correia dentada",
    type: "Manutenção Preventiva",
    cost: 720.0,
    serviceDate: new Date("2025-05-22T11:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-12T10:30:00"),
    updatedAt: new Date("2025-05-12T10:30:00"),
    vehicleId: "v9",
    driverId: "drv9",
    workshopId: "w5",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh23",
        status: "Agendado",
        date: new Date("2025-05-12T10:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123465",
    description: "Reparo na suspensão",
    type: "Manutenção Corretiva",
    cost: 950.0,
    serviceDate: new Date("2025-05-14T09:30:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-08T15:45:00"),
    updatedAt: new Date("2025-05-14T13:20:00"),
    vehicleId: "v10",
    driverId: "drv10",
    workshopId: "w6",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh24",
        status: "Agendado",
        date: new Date("2025-05-08T15:45:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh25",
        status: "Veículo Entregue",
        date: new Date("2025-05-14T09:15:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh26",
        status: "Em Andamento",
        date: new Date("2025-05-14T09:45:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh27",
        status: "Concluído",
        date: new Date("2025-05-14T13:20:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123466",
    description: "Troca de amortecedores",
    type: "Manutenção Corretiva",
    cost: 1200.0,
    serviceDate: new Date("2025-05-28T14:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-13T11:30:00"),
    updatedAt: new Date("2025-05-13T11:30:00"),
    vehicleId: "v11",
    driverId: "drv11",
    workshopId: "w7",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh28",
        status: "Agendado",
        date: new Date("2025-05-13T11:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123467",
    description: "Revisão do sistema de injeção eletrônica",
    type: "Manutenção Preventiva",
    cost: 680.0,
    serviceDate: new Date("2025-05-16T10:00:00"),
    status: "Em Andamento",
    createdAt: new Date("2025-05-09T14:15:00"),
    updatedAt: new Date("2025-05-16T10:30:00"),
    vehicleId: "v12",
    driverId: "drv12",
    workshopId: "w8",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh29",
        status: "Agendado",
        date: new Date("2025-05-09T14:15:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh30",
        status: "Veículo Entregue",
        date: new Date("2025-05-16T09:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh31",
        status: "Em Andamento",
        date: new Date("2025-05-16T10:30:00"),
        description: "Início dos trabalhos de manutenção",
      },
    ],
  },
  {
    id: "ord123468",
    description: "Reparo na caixa de câmbio",
    type: "Manutenção Corretiva",
    cost: 1800.0,
    serviceDate: new Date("2025-05-06T09:00:00"),
    status: "Concluído",
    createdAt: new Date("2025-04-30T10:45:00"),
    updatedAt: new Date("2025-05-06T16:30:00"),
    vehicleId: "v13",
    driverId: "drv13",
    workshopId: "w9",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh32",
        status: "Agendado",
        date: new Date("2025-04-30T10:45:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh33",
        status: "Veículo Entregue",
        date: new Date("2025-05-06T08:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh34",
        status: "Em Andamento",
        date: new Date("2025-05-06T09:15:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh35",
        status: "Concluído",
        date: new Date("2025-05-06T16:30:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123469",
    description: "Troca de pastilhas de freio",
    type: "Manutenção Preventiva",
    cost: 380.0,
    serviceDate: new Date("2025-05-30T11:30:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-14T09:30:00"),
    updatedAt: new Date("2025-05-14T09:30:00"),
    vehicleId: "v14",
    driverId: "drv14",
    workshopId: "w10",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh36",
        status: "Agendado",
        date: new Date("2025-05-14T09:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123470",
    description: "Revisão completa para viagem",
    type: "Manutenção Preventiva",
    cost: 950.0,
    serviceDate: new Date("2025-05-19T14:00:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-12T15:30:00"),
    updatedAt: new Date("2025-05-12T15:30:00"),
    vehicleId: "v15",
    driverId: "drv15",
    workshopId: "w1",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh37",
        status: "Agendado",
        date: new Date("2025-05-12T15:30:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123471",
    description: "Substituição do radiador",
    type: "Manutenção Corretiva",
    cost: 780.0,
    serviceDate: new Date("2025-05-07T10:00:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-02T14:15:00"),
    updatedAt: new Date("2025-05-07T13:45:00"),
    vehicleId: "v1",
    driverId: "drv1",
    workshopId: "w2",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh38",
        status: "Agendado",
        date: new Date("2025-05-02T14:15:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh39",
        status: "Veículo Entregue",
        date: new Date("2025-05-07T09:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh40",
        status: "Em Andamento",
        date: new Date("2025-05-07T10:15:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh41",
        status: "Concluído",
        date: new Date("2025-05-07T13:45:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123472",
    description: "Troca de velas e cabos de ignição",
    type: "Manutenção Preventiva",
    cost: 420.0,
    serviceDate: new Date("2025-05-09T15:30:00"),
    status: "Concluído",
    createdAt: new Date("2025-05-04T11:20:00"),
    updatedAt: new Date("2025-05-09T17:15:00"),
    vehicleId: "v2",
    driverId: "drv2",
    workshopId: "w3",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh42",
        status: "Agendado",
        date: new Date("2025-05-04T11:20:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh43",
        status: "Veículo Entregue",
        date: new Date("2025-05-09T15:15:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh44",
        status: "Em Andamento",
        date: new Date("2025-05-09T15:45:00"),
        description: "Início dos trabalhos de manutenção",
      },
      {
        id: "sh45",
        status: "Concluído",
        date: new Date("2025-05-09T17:15:00"),
        description: "Serviço concluído e veículo pronto para retirada",
      },
    ],
  },
  {
    id: "ord123473",
    description: "Reparo no sistema de direção hidráulica",
    type: "Manutenção Corretiva",
    cost: 850.0,
    serviceDate: new Date("2025-05-23T10:30:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-15T14:45:00"),
    updatedAt: new Date("2025-05-15T14:45:00"),
    vehicleId: "v3",
    driverId: "drv3",
    workshopId: "w4",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh46",
        status: "Agendado",
        date: new Date("2025-05-15T14:45:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
  {
    id: "ord123474",
    description: "Substituição da bomba de combustível",
    type: "Manutenção Corretiva",
    cost: 920.0,
    serviceDate: new Date("2025-05-17T09:00:00"),
    status: "Em Andamento",
    createdAt: new Date("2025-05-10T10:15:00"),
    updatedAt: new Date("2025-05-17T09:30:00"),
    vehicleId: "v4",
    driverId: "drv4",
    workshopId: "w5",
    filialId: "fil2",
    statusHistory: [
      {
        id: "sh47",
        status: "Agendado",
        date: new Date("2025-05-10T10:15:00"),
        description: "Ordem de serviço criada e agendada",
      },
      {
        id: "sh48",
        status: "Veículo Entregue",
        date: new Date("2025-05-17T08:45:00"),
        description: "Veículo entregue na oficina",
      },
      {
        id: "sh49",
        status: "Em Andamento",
        date: new Date("2025-05-17T09:30:00"),
        description: "Início dos trabalhos de manutenção",
      },
    ],
  },
  {
    id: "ord123475",
    description: "Revisão do sistema de arrefecimento",
    type: "Manutenção Preventiva",
    cost: 480.0,
    serviceDate: new Date("2025-05-26T14:30:00"),
    status: "Agendado",
    createdAt: new Date("2025-05-16T11:45:00"),
    updatedAt: new Date("2025-05-16T11:45:00"),
    vehicleId: "v5",
    driverId: "drv5",
    workshopId: "w6",
    filialId: "fil1",
    statusHistory: [
      {
        id: "sh50",
        status: "Agendado",
        date: new Date("2025-05-16T11:45:00"),
        description: "Ordem de serviço criada e agendada",
      },
    ],
  },
];

// Funções de busca para cada página

// Dashboard
export function getDashboardData() {
  const totalVehicles = mockVehicles.length;
  const vehiclesInMaintenance = mockVehicles.filter(
    (v) => v.status === "Manutenção"
  ).length;
  const activeWorkshops = mockWorkshops.length;
  const pendingOrders = mockOrders.filter(
    (o) => o.status === "Agendado" || o.status === "Em Andamento"
  ).length;
  const completedOrders = mockOrders.filter(
    (o) => o.status === "Concluído"
  ).length;

  const totalCostThisMonth = mockOrders.reduce(
    (acc, order) => acc + order.cost,
    0
  );

  const vehiclesByStatus = [
    {
      status: "Ativo",
      count: mockVehicles.filter((v) => v.status === "Ativo").length,
      color: "bg-emerald-500",
    },
    {
      status: "Em Manutenção",
      count: mockVehicles.filter((v) => v.status === "Manutenção").length,
      color: "bg-amber-500",
    },
    {
      status: "Inativo",
      count: mockVehicles.filter((v) => v.status === "Inativo").length,
      color: "bg-rose-500",
    },
  ];

  const recentOrders = mockOrders
    .sort((a, b) => b.serviceDate.getTime() - a.serviceDate.getTime())
    .slice(0, 4)
    .map((order) => {
      const vehicle = mockVehicles.find((v) => v.id === order.vehicleId)!;
      const workshop = mockWorkshops.find((w) => w.id === order.workshopId)!;

      return {
        id: order.id,
        vehiclePlate: vehicle.plate,
        vehicleModel: vehicle.model,
        workshopName: workshop.name,
        serviceType: order.type,
        status: order.status,
        date: order.serviceDate.toLocaleDateString("pt-BR"),
        cost: order.cost,
      };
    });

  const topWorkshops = mockWorkshops
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .slice(0, 4)
    .map((workshop) => ({
      name: workshop.name,
      ordersCount: workshop.ordersCount,
      rating: workshop.rating,
    }));

  // Dados simulados para gráficos
  const monthlyExpenses = [
    { month: "Jan", value: 12500 },
    { month: "Fev", value: 10800 },
    { month: "Mar", value: 14200 },
    { month: "Abr", value: 11500 },
    { month: "Mai", value: 15750 },
  ];

  const maintenanceByType = [
    { type: "Preventiva", percentage: 45 },
    { type: "Corretiva", percentage: 30 },
    { type: "Emergencial", percentage: 15 },
    { type: "Revisão", percentage: 10 },
  ];

  return {
    stats: {
      totalVehicles,
      vehiclesInMaintenance,
      activeWorkshops,
      pendingOrders,
      completedOrders,
      totalCostThisMonth,
    },
    vehiclesByStatus,
    recentOrders,
    topWorkshops,
    monthlyExpenses,
    maintenanceByType,
  };
}

// Página de Frota
export function getFleetData() {
  return mockVehicles;
}

// Página de Veículo Específico
export function getVehicleData(plate: string) {
  const vehicle = mockVehicles.find((v) => v.plate === plate);
  if (!vehicle) return null;

  const driver = mockUsers.find((u) => u.id === vehicle.driverId);

  return {
    ...vehicle,
    driver,
  };
}

export function getVehicleOrders(vehicleId: string) {
  return mockOrders
    .filter((o) => o.vehicleId === vehicleId)
    .map((order) => {
      const workshop = mockWorkshops.find((w) => w.id === order.workshopId)!;

      return {
        ...order,
        workshop,
      };
    });
}

// Página de Oficinas
export function getWorkshopsData() {
  return mockWorkshops;
}

// Página de Ordens
export function getOrdersData() {
  return mockOrders.map((order) => {
    const vehicle = mockVehicles.find((v) => v.id === order.vehicleId)!;
    const driver = mockUsers.find((u) => u.id === order.driverId)!;
    const workshop = mockWorkshops.find((w) => w.id === order.workshopId)!;
    const filial = mockFiliais.find((f) => f.id === order.filialId)!;

    return {
      ...order,
      vehicle: {
        id: vehicle.id,
        plate: vehicle.plate,
        model: vehicle.model,
        brand: vehicle.brand,
      },
      driver: {
        id: driver.id,
        name: driver.name,
      },
      workshop: {
        id: workshop.id,
        name: workshop.name,
      },
      filial: filial.name,
    };
  });
}

// Página de Ordem Específica
export function getOrderData(orderId: string) {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return null;

  const vehicle = mockVehicles.find((v) => v.id === order.vehicleId)!;
  const driver = mockUsers.find((u) => u.id === order.driverId)!;
  const workshop = mockWorkshops.find((w) => w.id === order.workshopId)!;
  const filial = mockFiliais.find((f) => f.id === order.filialId)!;
  const enterprise = mockEnterprise;

  return {
    ...order,
    vehicle,
    driver,
    workshop,
    filial,
    enterprise,
  };
}

// Dados para formulários
export function getFormSelectData() {
  return {
    vehicles: mockVehicles.map((v) => ({
      plate: v.plate,
      model: v.model,
      brand: v.brand,
    })),
    drivers: mockUsers
      .filter((u) => u.role === "driver")
      .map((d) => ({
        id: d.id,
        name: d.name,
      })),
    workshops: mockWorkshops.map((w) => ({
      id: w.id,
      name: w.name,
    })),
    filiais: mockFiliais.map((f) => f.name),
    serviceTypes: [
      "Manutenção Preventiva",
      "Manutenção Corretiva",
      "Manutenção Emergencial",
      "Revisão Programada",
      "Troca de Óleo",
      "Alinhamento e Balanceamento",
    ],
    orderStatus: [
      "Agendado",
      "Veículo Entregue",
      "Em Andamento",
      "Concluído",
      "Cancelado",
    ],
  };
}

// Função para buscar veículo por placa
export function findVehicleByPlate(plate: string) {
  return mockVehicles.find((v) => v.plate === plate);
}

// Função para buscar ordens de um veículo específico por placa
export function getOrdersByVehiclePlate(plate: string) {
  const vehicle = findVehicleByPlate(plate);
  if (!vehicle) return [];

  return getVehicleOrders(vehicle.id);
}

// Função para buscar usuário atual (simulado)
export function getCurrentUser() {
  return {
    ...mockUsers[0],
    notifications: 3,
  };
}
