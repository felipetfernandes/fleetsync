/*import { PrismaClient, OrderType, UserRole, VehicleStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Limpando dados ...`);

  await prisma.orderItem.deleteMany();
await prisma.order.deleteMany();
await prisma.mileageHistory.deleteMany();
await prisma.vehicle.deleteMany();
await prisma.workshop.deleteMany();
await prisma.user.deleteMany();
await prisma.branch.deleteMany();
await prisma.company.deleteMany();

  
  console.log(`Start seeding ...`);
  const company = await prisma.company.create({
    data: {
      name: faker.company.name(),
      cnpj: faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString(),
    },
  });

  // Cria 3 administradores
  await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          password: bcrypt.hashSync('teste123', 10),
          role: UserRole.ADMIN,
          companyId: company.id,
        },
      })
    )
  );

  // Cria 10 branches
  const branches = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.branch.create({
        data: {
          name: faker.company.name(),
          city: faker.location.city(),
          companyId: company.id,
        },
      })
    )
  );

  const vehiclesWithoutOrders: any[] = [];
  const vehicles: any[] = [];

  for (let i = 0; i < 100; i++) {
    const branch = branches[Math.floor(i / 10)];

    // Cria o motorista
    const driver = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: bcrypt.hashSync('teste123', 10),
        role: UserRole.DRIVER,
        companyId: company.id,
        branchId: branch.id,
        licenseNumber: faker.string.alphanumeric(10),
        licenseCategory: 'B',
        licenseExpiration: faker.date.future(),
      },
    });

    // Cria o veículo
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: faker.vehicle.vrm(),
        brand: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        modelYear: faker.number.int({ min: 2015, max: 2024 }),
        manufactureYear: faker.number.int({ min: 2015, max: 2024 }),
        color: faker.color.human(),
        renavam: faker.string.numeric(11),
        chassis: faker.string.alphanumeric(17),
        status: VehicleStatus.AVAILABLE,
        mileageStart: faker.number.int({ min: 0, max: 20000 }),
        mileageCurrent: faker.number.int({ min: 20001, max: 100000 }),
        purchaseDate: faker.date.past({ years: 5 }),
        purchaseType: 'Financiado',
        purchaseValue: faker.number.float({ min: 20000, max: 100000}),
        seller: faker.company.name(),
        insuranceProvider: faker.company.name(),
        insurancePolicy: faker.string.alphanumeric(10),
        insuranceExpires: faker.date.future(),
        insuranceValue: faker.number.float({ min: 1000, max: 3000}),
        ipvaStatus: 'Pago',
        ipvaValue: faker.number.float({ min: 500, max: 2000}),
        ipvaDueDate: faker.date.future(),
        licenseStatus: 'Regular',
        licenseValue: faker.number.float({ min: 200, max: 800}),
        licenseDueDate: faker.date.future(),
        driverId: driver.id,
        companyId: company.id,
        branchId: branch.id,
      },
    });

    vehicles.push(vehicle);
    if (i < 20) vehiclesWithoutOrders.push(vehicle);
  }

  // Cria workshops (5 por branch = 50)
  const allWorkshops: any[] = [];

  for (const branch of branches) {
    for (let i = 0; i < 5; i++) {
      const manager = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          password: bcrypt.hashSync('teste123', 10),
          role: UserRole.WORKSHOP_MANAGER,
          companyId: company.id,
          branchId: branch.id,
        },
      });

      const workshop = await prisma.workshop.create({
        data: {
          name: faker.company.name(),
          cnpj: faker.string.numeric(14),
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('teste123', 10),
          companyId: company.id,
          branchId: branch.id,
          managerId: manager.id,
        },
      });

      allWorkshops.push(workshop);
    }
  }

  // Cria 20 ordens por branch (200 no total)
  for (const branch of branches) {
    const branchVehicles = vehicles.filter(v => v.branchId === branch.id).slice(0, 8); // 8 veículos usados por branch
    const branchWorkshops = allWorkshops.filter(w => w.branchId === branch.id);

    for (let i = 0; i < 20; i++) {
      const vehicle = faker.helpers.arrayElement(branchVehicles);
      const workshop = faker.helpers.arrayElement(branchWorkshops);

      const order = await prisma.order.create({
        data: {
          type: faker.helpers.enumValue(OrderType),
          description: faker.vehicle.vehicle(),
          startDate: faker.date.recent({ days: 30 }),
          endDate: faker.date.future(),
          totalCost: faker.number.float({ min: 500, max: 3000}),
          companyId: company.id,
          branchId: branch.id,
          vehicleId: vehicle.id,
          workshopId: workshop.id,
        },
      });

      await prisma.orderItem.createMany({
        data: Array.from({ length: 3 }).map(() => ({
          description: faker.commerce.productDescription(),
          cost: faker.number.float({ min: 100, max: 500}),
          laborCost: faker.number.float({ min: 100, max: 500}),
          totalCost: faker.number.float({ min: 200, max: 1000}),
          orderId: order.id,
        })),
      });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
  */
