import { Prisma } from "@prisma/client";

export function getBranchInclude(query: any): Prisma.BranchInclude {
  const include: Prisma.BranchInclude = {};

  if (query.company) {
    include.company = true;
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
    // Adicione outros includes aninhados para Order aqui

    include.orders = { include: nestedOrderInclude };
  }

  if (query.workshops) {
    include.workshops = true;
  }

  if (query.users) {
    include.users = true;
  }

  return include;
}
