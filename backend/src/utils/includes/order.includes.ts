import { Prisma } from '@prisma/client';

export function getOrderInclude(query: any): Prisma.OrderInclude {
  const include: Prisma.OrderInclude = {};

  if (query.orderItems) {
    include.OrderItems = true;
  }

  if (query.company) {
    include.company = true;
  }

  if (query.branch) {
    include.branch = true;
  }

  if (query.vehicle) {
    const vehicleIncludes = query.vehicle.split(',').map((s: string) => s.trim());
    const nestedVehicleInclude: Prisma.VehicleInclude = {};
    if (vehicleIncludes.includes('driver')) {
      nestedVehicleInclude.driver = true;
    }
    if (vehicleIncludes.includes('mileageHistory')) {
      nestedVehicleInclude.MileageHistory = true;
    }
    include.vehicle = { include: nestedVehicleInclude };
  }

  if (query.workshop) {
    const workshopIncludes = query.workshop.split(',').map((s: string) => s.trim());
    const nestedWorkshopInclude: Prisma.WorkshopInclude = {};
    if (workshopIncludes.includes('manager')) {
      nestedWorkshopInclude.manager = true;
    }
    include.workshop = { include: nestedWorkshopInclude };
  }

  return include;
}


