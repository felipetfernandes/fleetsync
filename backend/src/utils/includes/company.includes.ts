import { Prisma } from "@prisma/client";

export function getCompanyInclude(query: any): Prisma.CompanyInclude {
  const include: Prisma.CompanyInclude = {};

  if (query.branches) {
    include.branches = true;
  }

  if (query.vehicles) {
    const vehicleIncludes = query.vehicles
      .split(",")
      .map((s: string) => s.trim());
    const nestedVehicleInclude: Prisma.VehicleInclude = {};
    if (vehicleIncludes.includes("driver")) {
      nestedVehicleInclude.driver = true;
    }
    if (vehicleIncludes.includes("mileageHistory")) {
      nestedVehicleInclude.mileageHistory = true;
    }
    // Adicione outros includes aninhados para Vehicle aqui

    include.vehicles = { include: nestedVehicleInclude };
  }

  if (query.users) {
    include.users = true;
  }

  if (query.orders) {
    const orderIncludes = query.orders.split(",").map((s: string) => s.trim());
    const nestedOrderInclude: Prisma.OrderInclude = {};
    if (orderIncludes.includes("orderItems")) {
      nestedOrderInclude.orderItems = true;
    }
    if (orderIncludes.includes("vehicle")) {
      nestedOrderInclude.vehicle = true;
    }
    if (orderIncludes.includes("workshop")) {
      nestedOrderInclude.workshop = true;
    }
    if (orderIncludes.includes("branch")) {
      nestedOrderInclude.branch = true;
    }
    // Adicione outros includes aninhados para Order aqui

    include.orders = { include: nestedOrderInclude };
  }

  if (query.workshops) {
    const workshopsIncludes = query.workshops
      .split(",")
      .map((s: string) => s.trim());
    const nestedOrderInclude: Prisma.WorkshopInclude = {};
    if (workshopsIncludes.includes("orders")) {
      nestedOrderInclude.orders = true;
    }

    include.workshops = { include: nestedOrderInclude };
  }

  return include;
}
