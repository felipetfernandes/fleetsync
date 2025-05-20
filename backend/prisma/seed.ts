import {
  PrismaClient,
  UserRole,
  VehicleStatus,
  OrderType,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = bcrypt.hashSync("senha123", 10);

function generatePhone(
  companyIndex: number,
  branchIndex: number,
  userIndex: number
) {
  return `119${companyIndex}${branchIndex.toString().padStart(2, "0")}${userIndex.toString().padStart(4, "0")}`;
}

function generatePlate(branchId: number, vehicleIndex: number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetter = () => letters[Math.floor(Math.random() * letters.length)];
  return `${randLetter()}${randLetter()}${randLetter()}${branchId}${vehicleIndex}XZ`.toUpperCase();
}

function generateRenavam(branchId: number, vehicleIndex: number) {
  return `12345678${branchId.toString().padStart(2, "0")}${vehicleIndex.toString().padStart(2, "0")}`;
}

function generateChassis(branchId: number, vehicleIndex: number) {
  return `CHS${branchId.toString().padStart(2, "0")}${vehicleIndex.toString().padStart(2, "0")}XYZ123`;
}

async function main() {
  console.log("Limpar banco de dados...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.company.deleteMany();

  console.log("Iniciando seed...");

  for (let c = 1; c <= 2; c++) {
    // Criar company
    const company = await prisma.company.create({
      data: {
        name: `Empresa Seed ${c}`,
        cnpj: `00.000.${c}00/000${c}-00`,
        assetCount: 0,
      },
    });

    // Criar 2 admins para company
    const adminsData = [];
    for (let a = 1; a <= 2; a++) {
      adminsData.push({
        name: `Admin ${a} Empresa ${c}`,
        email: `admin${a}_company${c}@example.com`,
        phone: generatePhone(c, 0, a),
        password: DEFAULT_PASSWORD,
        role: UserRole.ADMIN,
        companyId: company.id,
        emailVerified: true,
      });
    }
    await prisma.user.createMany({ data: adminsData });

    // Criar 5 branches da company
    const branchesData = [];
    for (let b = 1; b <= 5; b++) {
      branchesData.push({
        name: `Filial ${b} Empresa ${c}`,
        city: `Cidade ${b}`,
        companyId: company.id,
      });
    }
    const branches = await Promise.all(
      branchesData.map((branch) => prisma.branch.create({ data: branch }))
    );

    let totalVehiclesCompany = 0;

    for (const branch of branches) {
      // Criar 10 workshops da branch
      const workshopsData = [];
      for (let w = 1; w <= 10; w++) {
        workshopsData.push({
          name: `Workshop ${w} Filial ${branch.id}`,
          cnpj: `000000000000${c}${branch.id}${w}`,
          address: `Rua Workshop ${w}, nº ${w}`,
          phone: generatePhone(c, branch.id, w),
          email: `workshop${w}_branch${branch.id}@example.com`,
          password: DEFAULT_PASSWORD,
          branchId: branch.id,
        });
      }
      const workshops = await Promise.all(
        workshopsData.map((ws) => prisma.workshop.create({ data: ws }))
      );

      // Criar 20 motoristas para a branch (cada um será driver de um veículo)
      const driversData = [];
      for (let v = 1; v <= 20; v++) {
        driversData.push({
          name: `Motorista ${v} Filial ${branch.id}`,
          email: `driver${v}_branch${branch.id}@example.com`,
          phone: generatePhone(c, branch.id, 20 + v),
          password: DEFAULT_PASSWORD,
          role: UserRole.DRIVER,
          companyId: company.id,
          branchId: branch.id,
          emailVerified: true,
          licenseNumber: `CNH${branch.id}${v}`,
          licenseCategory: "B",
          licenseExpiration: new Date(
            new Date().setFullYear(new Date().getFullYear() + 3)
          ),
        });
      }
      const drivers = await Promise.all(
        driversData.map((driver) => prisma.user.create({ data: driver }))
      );

      // Criar 20 veículos para a branch, cada um vinculado a um motorista
      const vehiclesData = [];
      for (let v = 1; v <= 20; v++) {
        vehiclesData.push({
          plate: generatePlate(branch.id, v),
          brand: `Marca${v}`,
          model: `Modelo${v}`,
          modelYear: 2020 + (v % 4),
          manufactureYear: 2019 + (v % 5),
          color: ["Preto", "Branco", "Prata", "Vermelho"][v % 4],
          renavam: generateRenavam(branch.id, v),
          chassis: generateChassis(branch.id, v),
          status:
            v % 3 === 0 ? VehicleStatus.MAINTENANCE : VehicleStatus.AVAILABLE,
          mileageStart: 0,
          mileageCurrent: v * 1000,
          companyId: company.id,
          branchId: branch.id,
          driverId: drivers[v - 1].id,
          purchaseDate: new Date(
            new Date().setFullYear(new Date().getFullYear() - 2)
          ),
          purchaseType: "Compra",
          purchaseValue: 50000 + v * 1000,
          seller: "Fornecedor X",
          insuranceProvider: "Seguradora Y",
          insurancePolicy: `POL${v}${branch.id}`,
          insuranceExpires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          insuranceValue: 3000 + v * 100,
          ipvaStatus: "Pago",
          ipvaValue: 1500,
          ipvaDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          licenseStatus: "Ativo",
          licenseValue: 200,
          licenseDueDate: new Date(
            new Date().setMonth(new Date().getMonth() + 2)
          ),
        });
      }
      const vehicles = await Promise.all(
        vehiclesData.map((vehicle) => prisma.vehicle.create({ data: vehicle }))
      );

      totalVehiclesCompany += vehicles.length;

      // Criar 2 orders para a branch, associando veículos e workshops
      const ordersData = [];
      for (let o = 1; o <= 2; o++) {
        ordersData.push({
          type: o % 2 === 0 ? OrderType.CORRECTIVE : OrderType.PREVENTIVE,
          description: `Ordem ${o} da Filial ${branch.id}`,
          startDate: new Date(),
          totalCost: 1000 + o * 500,
          companyId: company.id,
          branchId: branch.id,
          vehicleId: vehicles[o - 1].id,
          workshopId: workshops[o - 1].id,
        });
      }
      await Promise.all(
        ordersData.map((order) => prisma.order.create({ data: order }))
      );
    }

    // Atualizar assetCount da company (total de veículos)
    await prisma.company.update({
      where: { id: company.id },
      data: { assetCount: totalVehiclesCompany },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
