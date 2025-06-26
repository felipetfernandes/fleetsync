import { Prisma } from "@prisma/client";

export function getVehicleInclude(query: any): Prisma.VehicleInclude {
  const include: Prisma.VehicleInclude = {};

  if (query.company) {
    include.company = true;
  }

  if (query.branch) {
    include.branch = true;
  }

  if (query.driver) {
    const driverIncludes = query.driver.split(",").map((s: string) => s.trim());
    const nestedDriverInclude: Prisma.UserInclude = {};
    if (driverIncludes.includes("branch")) {
      nestedDriverInclude.branch = true;
    }
    if (driverIncludes.includes("company")) {
      nestedDriverInclude.company = true;
    }
    include.driver = { include: nestedDriverInclude };
  }

  if (query.orders) {
    const orderIncludes = query.orders.split(",").map((s: string) => s.trim());
    const nestedOrderInclude: Prisma.OrderInclude = {};
    if (orderIncludes.includes("orderItems")) {
      nestedOrderInclude.orderItems = true;
    }
    if (orderIncludes.includes("branch")) {
      nestedOrderInclude.branch = true;
    }
    if (orderIncludes.includes("company")) {
      nestedOrderInclude.company = true;
    }
    if (orderIncludes.includes("workshop")) {
      nestedOrderInclude.workshop = true;
    }

    include.orders = { include: nestedOrderInclude };
  }

  if (query.mileageHistory) {
    include.mileageHistory = true;
  }

  return include;
}
