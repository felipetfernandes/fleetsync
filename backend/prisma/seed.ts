import { PrismaClient, OrderType, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");
  for (let i = 1; i <= 2; i++) {
    const company = await prisma.company.create({
      data: {
        name: `Empresa ${i}`,
        cnpj: `0000000000000${i}`,
      },
    });

    const branches = await Promise.all(
      Array.from({ length: 5 }).map((_, j) =>
        prisma.branch.create({
          data: {
            name: `Filial ${j + 1} - Empresa ${i}`,
            city: `Cidade ${j + 1}`,
            companyId: company.id,
          },
        })
      )
    );

    const adminUser = await prisma.user.create({
      data: {
        name: `Admin Empresa ${i}`,
        email: `admin${i}@empresa.com`,
        phone: `1190000000${i}`,
        password: bcrypt.hashSync("admin123", 10),
        role: UserRole.ADMIN,
        companyId: company.id,
        branchId: branches[0].id,
      },
    });

    const drivers = await Promise.all(
      Array.from({ length: 5 }).map((_, d) =>
        prisma.user.create({
          data: {
            name: `Motorista ${d + 1} - Empresa ${i}`,
            email: `motorista${d + 1}@empresa${i}.com`,
            phone: `1190000010${i}${d}`,
            password: bcrypt.hashSync("motorista123", 10),
            role: UserRole.DRIVER,
            companyId: company.id,
            branchId: branches[d % 5].id,
            licenseNumber: `LIC${i}${d}`,
            licenseCategory: "B",
            licenseExpiration: new Date("2026-12-31"),
          },
        })
      )
    );

    const workshops = await Promise.all(
      Array.from({ length: 5 }).map((_, w) =>
        prisma.workshop.create({
          data: {
            name: `Oficina ${w + 1} - Empresa ${i}`,
            cnpj: `1234567890000${i}${w}`,
            address: `Rua Oficina ${w + 1}`,
            phone: `1199999999${i}${w}`,
            email: `oficina${w + 1}@empresa${i}.com`,
            password: bcrypt.hashSync("oficina123", 10),
            branchId: branches[w % 5].id,
          },
        })
      )
    );

    const vehicles = await Promise.all(
      Array.from({ length: 25 }).map((_, v) =>
        prisma.vehicle.create({
          data: {
            plate: `ABC${i}${v.toString().padStart(3, "0")}`,
            brand: "MarcaX",
            model: `Modelo${v}`,
            modelYear: 2020,
            manufactureYear: 2019,
            color: "Branco",
            renavam: `RENAVAM${i}${v}`,
            chassis: `CHASSIS${i}${v}`,
            status: "ATIVO",
            purchaseDate: new Date("2022-01-01"),
            purchaseType: "FINANCIADO",
            purchaseValue: 50000 + v * 1000,
            seller: "Revenda Y",
            mileageStart: 10000,
            mileageCurrent: 15000 + v * 100,

            insuranceProvider: "Seguradora Z",
            insurancePolicy: `POL${i}${v}`,
            insuranceExpires: new Date("2025-12-31"),
            insuranceValue: 1200 + v * 10,

            ipvaStatus: "PAGO",
            ipvaValue: 1500,
            ipvaDueDate: new Date("2025-04-01"),

            licenseStatus: "EM DIA",
            licenseValue: 500,
            licenseDueDate: new Date("2025-06-01"),

            companyId: company.id,
            branchId: branches[v % 5].id,
            driverId: drivers[v % 5].id,
          },
        })
      )
    );

    await Promise.all(
      vehicles.map((vehicle) =>
        prisma.mileageHistory.create({
          data: {
            mileage: vehicle.mileageCurrent,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            vehicleId: vehicle.id,
          },
        })
      )
    );

    await Promise.all(
      Array.from({ length: 40 }).map(async (_, o) => {
        const vehicle = vehicles[o % 25];
        const branch = branches[o % 5];
        const workshop = workshops[o % 5];

        const order = await prisma.order.create({
          data: {
            type: [
              OrderType.CORRECTIVE,
              OrderType.PREVENTIVE,
              OrderType.PERIODIC,
            ][o % 3],
            description: `Manutenção ${o + 1} da Empresa ${i}`,
            startDate: new Date(new Date().getTime() - (60 - o) * 86400000),
            endDate: new Date(),
            totalCost: 1000 + o * 50,
            companyId: company.id,
            branchId: branch.id,
            vehicleId: vehicle.id,
            workshopId: workshop.id,
          },
        });

        await prisma.orderItem.create({
          data: {
            description: `Item da OS ${o + 1}`,
            cost: 400,
            laborCost: 200,
            totalCost: 600,
            orderId: order.id,
          },
        });
      })
    );
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
