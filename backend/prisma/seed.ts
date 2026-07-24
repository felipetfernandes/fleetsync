import {
  PrismaClient,
  OrderType,
  OrderStatus,
  UserRole,
  VehicleStatus,
} from "@prisma/client";
// Import pt_BR locale
import { en, Faker, pt_BR } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

// Initialize Faker with pt_BR locale
const faker = new Faker({ locale: [pt_BR, en] });

const prisma = new PrismaClient();

// --- Configuration ---
const DEFAULT_PASSWORD = "password123"; // IMPORTANT: Change this to a secure password in your actual use case!
const SALT_ROUNDS = 10;

// Helper function to get random enum value
function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
}

// Helper function to generate dates in the last 3 months
function getDateInLast3Months(): Date {
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  // Ensure generated date is not in the future relative to 'today'
  const date = faker.date.between({ from: threeMonthsAgo, to: today });
  return date > today ? today : date;
}

async function main() {
  console.log("Start seeding ...");
  console.log(`Using locale: ${faker.location}`); // Log the used locale

  // Hash the default password
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
  console.log("Default password hashed.");

  // --- Clean Database (optional, but recommended for repeatable seeds) ---
  console.log("Cleaning database...");
  // Delete in reverse order of dependency to avoid foreign key constraints
  await prisma.orderItem.deleteMany({});
  console.log("Deleted OrderItems");
  await prisma.order.deleteMany({});
  console.log("Deleted Orders");
  await prisma.mileageHistory.deleteMany({});
  console.log("Deleted MileageHistory");
  // Nullify relations before deleting related records
  // Important: Update vehicles to remove driver link *before* deleting users
  await prisma.vehicle.updateMany({ data: { driverId: null } });
  console.log("Nullified vehicle driver links");
  // Important: Update workshops to remove manager link *before* deleting users
  await prisma.workshop.updateMany({ data: { managerId: null } });
  console.log("Nullified workshop manager links");
  await prisma.user.deleteMany({});
  console.log("Deleted Users");
  await prisma.vehicle.deleteMany({});
  console.log("Deleted Vehicles");
  await prisma.workshop.deleteMany({});
  console.log("Deleted Workshops");
  await prisma.branch.deleteMany({});
  console.log("Deleted Branches");
  await prisma.company.deleteMany({});
  console.log("Deleted Companies");
  console.log("Database cleaned.");

  // --- 1. Create Company ---
  console.log("Creating company...");
  const company = await prisma.company.create({
    data: {
      name: faker.company.name(),
      cnpj: faker.string.numeric(14), // Simple numeric CNPJ for example
    },
  });
  console.log(`Created company with id: ${company.id}`);

  // --- 2. Create Branches ---
  console.log("Creating branches...");
  const branches = [];
  for (let i = 0; i < 5; i++) {
    const branch = await prisma.branch.create({
      data: {
        name: `Filial ${faker.location.city()} ${i + 1}`,
        city: faker.location.city(),
        companyId: company.id,
      },
    });
    branches.push(branch);
    console.log(`Created branch: ${branch.name} (ID: ${branch.id})`);
  }
  console.log(`Created ${branches.length} branches.`);

  // --- 3. Create Workshops ---
  console.log("Creating workshops...");
  const workshops = [];
  for (const branch of branches) {
    for (let i = 0; i < 5; i++) {
      const workshop = await prisma.workshop.create({
        // managerId will be updated after manager user is created
        data: {
          name: faker.company.name() + " Oficina",
          cnpj: faker.string.numeric(14) + i + branch.id, // Ensure uniqueness
          address: faker.location.streetAddress(), // Should work now with pt_BR
          phone: faker.phone.number({ style: "international" }),
          email: faker.internet.email({
            firstName: "oficina",
            lastName: `${branch.id}-${i}`,
          }), // Ensure uniqueness
          // password: hashedPassword, // Use hashed password
          companyId: company.id,
          branchId: branch.id,
        },
      });
      workshops.push(workshop);
      // console.log(`Created workshop with id: ${workshop.id} for branch ${branch.id}`);
    }
  }
  console.log(`Created ${workshops.length} workshops.`);

  // --- 4. Create Users ---
  console.log("Creating users...");
  const users = [];
  const driversData = []; // Store driver data before creation
  const workshopManagers = [];

  // Admin (1)
  const adminUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: `admin@${company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      phone: faker.phone.number({ style: "international" }), // Ensure format
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      companyId: company.id,
    },
  });
  users.push(adminUser);
  console.log(`Created ADMIN user: ${adminUser.email}`);

  // Branch Managers (1 per Branch = 5)
  for (const branch of branches) {
    const branchManager = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({
          firstName: "gerente",
          lastName: `filial${branch.id}`,
        }),
        phone: faker.phone.number({ style: "international" }),
        password: hashedPassword,
        role: UserRole.BRANCH_MANAGER,
        emailVerified: true,
        companyId: company.id,
        branchId: branch.id,
      },
    });
    users.push(branchManager);
    console.log(
      `Created BRANCH_MANAGER user: ${branchManager.email} for branch ${branch.id}`
    );
  }

  // Workshop Managers (1 per Workshop = 25)
  for (const workshop of workshops) {
    const workshopManager = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({
          firstName: "gerente",
          lastName: `oficina${workshop.id}`,
        }),
        phone: faker.phone.number({ style: "international" }),
        password: hashedPassword,
        role: UserRole.WORKSHOP_MANAGER,
        emailVerified: true,
        companyId: company.id,
        branchId: workshop.branchId, // Manager in the same branch as workshop
        // Workshop relation (managerId) updated below
      },
    });
    users.push(workshopManager);
    workshopManagers.push(workshopManager);
    // Update workshop with managerId
    await prisma.workshop.update({
      where: { id: workshop.id },
      data: { managerId: workshopManager.id },
    });
    console.log(
      `Created WORKSHOP_MANAGER user: ${workshopManager.email} for workshop ${workshop.id}`
    );
  }

  // Prepare Drivers Data (1 per Vehicle = 100)
  console.log(
    "Generating driver data (will create users and assign to vehicles later)..."
  );
  for (let i = 0; i < 100; i++) {
    const driverData = {
      name: faker.person.fullName(),
      email: faker.internet.email({ firstName: "motorista", lastName: `${i}` }),
      phone: faker.phone.number({ style: "international" }),
      password: hashedPassword,
      role: UserRole.DRIVER,
      emailVerified: faker.datatype.boolean(0.8), // 80% verified
      licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
      licenseCategory: faker.helpers.arrayElement([
        "A",
        "B",
        "C",
        "D",
        "E",
        "AB",
        "AC",
        "AD",
        "AE",
      ]),
      licenseExpiration: faker.date.future({ years: 5 }),
      companyId: company.id,
      // branchId will be set when assigning to a vehicle
    };
    driversData.push(driverData);
  }
  console.log(`Prepared data for 100 DRIVER users.`);

  // --- 5. Create Vehicles (100 total) and Assign Drivers ---
  console.log("Creating vehicles and assigning drivers...");
  const vehicles = [];
  let driverDataIndex = 0; // To assign drivers sequentially

  for (const branch of branches) {
    for (let i = 0; i < 20; i++) {
      const manufactureYear = faker.number.int({ min: 2010, max: 2024 });
      const modelYear = faker.number.int({ min: manufactureYear, max: 2024 });
      const mileageStart = faker.number.int({ min: 1000, max: 50000 });
      const mileageCurrent =
        mileageStart + faker.number.int({ min: 5000, max: 150000 });
      const purchaseDate = faker.date.past({ years: 5 });
      const status = faker.helpers.weightedArrayElement([
        { weight: 7, value: VehicleStatus.AVAILABLE },
        { weight: 1.5, value: VehicleStatus.UNAVAILABLE },
        { weight: 1.5, value: VehicleStatus.MAINTENANCE },
      ]);

      // Create the driver user first, ensuring they belong to the vehicle's branch
      const currentDriverData = driversData[driverDataIndex];
      const driverUser = await prisma.user.create({
        data: {
          ...currentDriverData,
          branchId: branch.id, // Assign driver to the vehicle's branch
        },
      });
      users.push(driverUser); // Add to the main users list
      // console.log(`Created DRIVER user: ${driverUser.email} assigned to Branch ${branch.id}`);

      const vehicle = await prisma.vehicle.create({
        data: {
          plate: faker.vehicle.vrm() + driverDataIndex, // Ensure uniqueness
          brand: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          modelYear: modelYear,
          manufactureYear: manufactureYear,
          color: faker.vehicle.color(),
          renavam: faker.string.numeric(11) + driverDataIndex, // Ensure uniqueness
          chassis: faker.vehicle.vin() + driverDataIndex, // Ensure uniqueness
          status: status,
          purchaseDate: purchaseDate,
          purchaseType: faker.helpers.arrayElement([
            "Novo",
            "Usado",
            "Leasing",
          ]),
          purchaseValue: parseFloat(
            faker.finance.amount({ min: 30000, max: 250000, dec: 2 })
          ),
          seller: faker.company.name(),
          mileageStart: mileageStart,
          mileageCurrent: mileageCurrent,
          insuranceProvider: faker.company.name(),
          insurancePolicy: faker.string.alphanumeric(15),
          insuranceExpires: faker.date.future({ years: 1 }),
          insuranceValue: parseFloat(
            faker.finance.amount({ min: 500, max: 5000, dec: 2 })
          ),
          ipvaStatus: faker.helpers.arrayElement([
            "Pago",
            "Pendente",
            "Vencido",
          ]),
          ipvaValue: parseFloat(
            faker.finance.amount({ min: 300, max: 3000, dec: 2 })
          ),
          ipvaDueDate: faker.date.future({ years: 1 }),
          licenseStatus: faker.helpers.arrayElement([
            "Válido",
            "Vencido",
            "Pendente",
          ]),
          licenseValue: parseFloat(
            faker.finance.amount({ min: 100, max: 500, dec: 2 })
          ),
          licenseDueDate: faker.date.future({ years: 1 }),
          companyId: company.id,
          branchId: branch.id,
          driverId: driverUser.id, // Assign the created driver
        },
      });
      vehicles.push(vehicle);
      driverDataIndex++; // Move to the next driver
      // console.log(`Created vehicle with id: ${vehicle.id} for branch ${branch.id}, assigned driver ${driverUser.id}`);
    }
  }
  console.log(
    `Created ${vehicles.length} vehicles and assigned a unique driver to each.`
  );

  // --- 6. Create Mileage History ---
  console.log("Creating mileage history...");
  const currentMonth = new Date().getMonth(); // 0-indexed
  const currentYear = new Date().getFullYear();
  let mileageHistoryCount = 0;

  for (const vehicle of vehicles) {
    let lastMileage = vehicle.mileageStart;
    for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
      // Last 3 months
      const date = new Date(currentYear, currentMonth - monthOffset, 1);
      // Adjust year if month calculation goes into the previous year
      const targetMonth = date.getMonth(); // 0-indexed
      const targetYear = date.getFullYear();

      // Ensure mileage increases logically, ending near currentMileage
      let monthMileageIncrease;
      if (monthOffset === 0) {
        // Current month (or most recent of the 3)
        monthMileageIncrease = vehicle.mileageCurrent - lastMileage;
      } else {
        // Distribute remaining mileage increase somewhat evenly
        const remainingMonths = monthOffset + 1;
        const totalIncreaseNeeded = vehicle.mileageCurrent - lastMileage;
        const avgIncrease =
          totalIncreaseNeeded > 0 ? totalIncreaseNeeded / remainingMonths : 0;
        monthMileageIncrease = faker.number.int({
          min: Math.max(0, Math.floor(avgIncrease * 0.5)),
          max: Math.max(100, Math.ceil(avgIncrease * 1.5)),
        });
      }
      // Ensure increase is not negative and doesn't overshoot total
      monthMileageIncrease = Math.max(0, monthMileageIncrease);
      if (
        lastMileage + monthMileageIncrease > vehicle.mileageCurrent &&
        monthOffset !== 0
      ) {
        monthMileageIncrease = Math.max(
          0,
          vehicle.mileageCurrent - lastMileage - 100 * monthOffset
        ); // Leave some room
      }
      // Prevent negative mileage
      monthMileageIncrease = Math.max(0, monthMileageIncrease);

      const currentMonthMileage = lastMileage + monthMileageIncrease;

      // Ensure final month reaches currentMileage if possible
      const finalMileage =
        monthOffset === 0
          ? Math.max(currentMonthMileage, vehicle.mileageCurrent)
          : currentMonthMileage;

      await prisma.mileageHistory.create({
        data: {
          mileage: finalMileage,
          month: targetMonth + 1, // Store as 1-indexed
          year: targetYear,
          vehicleId: vehicle.id,
        },
      });
      mileageHistoryCount++;
      lastMileage = finalMileage; // Update for next iteration
    }
    // console.log(`Created mileage history for vehicle ${vehicle.id}`);
  }
  console.log(
    `Created ${mileageHistoryCount} mileage history records for all vehicles.`
  );

  // --- 7. Create Orders ---
  console.log("Creating orders...");
  const orders = [];
  for (let i = 0; i < 100; i++) {
    const orderType = getRandomEnumValue(OrderType);
    const orderStatus = getRandomEnumValue(OrderStatus);
    const startDate = getDateInLast3Months();
    let endDate: Date | null = null;

    // Ensure endDate is valid based on status and startDate
    if (
      orderStatus === OrderStatus.COMPLETED ||
      orderStatus === OrderStatus.CANCELLED
    ) {
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + 1); // Ensure end date is after start date
      const maxEndDate = new Date();
      if (minEndDate <= maxEndDate) {
        endDate = faker.date.between({ from: minEndDate, to: maxEndDate });
      } else {
        endDate = minEndDate; // If start date is today, end date is tomorrow (or adjust logic)
      }
    }

    const randomVehicle = faker.helpers.arrayElement(vehicles);
    // Ensure workshop is in the same branch as the vehicle for consistency
    const possibleWorkshops = workshops.filter(
      (w) => w.branchId === randomVehicle.branchId
    );
    const randomWorkshop = faker.helpers.arrayElement(
      possibleWorkshops.length > 0 ? possibleWorkshops : workshops
    ); // Fallback if no workshop in branch

    const order = await prisma.order.create({
      data: {
        type: orderType,
        status: orderStatus,
        description: faker.lorem.sentence(),
        startDate: startDate,
        endDate: endDate,
        totalCost: 0, // Will be updated after items are created
        companyId: company.id,
        branchId: randomVehicle.branchId, // Order in the same branch as the vehicle
        vehicleId: randomVehicle.id,
        workshopId: randomWorkshop.id,
      },
    });
    orders.push(order);
    // console.log(`Created order with id: ${order.id}`);
  }
  console.log(`Created ${orders.length} orders.`);

  // --- 8. Create Order Items & Update Order Total Cost ---
  console.log("Creating order items and updating order costs...");
  let orderItemCount = 0;
  for (const order of orders) {
    let orderTotalCost = 0;
    const itemCount = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < itemCount; i++) {
      const cost = parseFloat(
        faker.finance.amount({ min: 50, max: 1000, dec: 2 })
      );
      const laborCost = parseFloat(
        faker.finance.amount({ min: 50, max: 500, dec: 2 })
      );
      const totalItemCost = cost + laborCost;
      await prisma.orderItem.create({
        data: {
          description: faker.commerce.productName() + " serviço/peça",
          cost: cost,
          laborCost: laborCost,
          totalCost: totalItemCost,
          orderId: order.id,
        },
      });
      orderTotalCost += totalItemCost;
      orderItemCount++;
      // console.log(`Created order item for order ${order.id}`);
    }
    // Update the order's total cost
    await prisma.order.update({
      where: { id: order.id },
      data: { totalCost: parseFloat(orderTotalCost.toFixed(2)) },
    });
    // console.log(`Updated total cost for order ${order.id}`);
  }
  console.log(
    `Created ${orderItemCount} order items and updated costs for all orders.`
  );

  console.log("Seeding finished successfully!");
}

main()
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });
