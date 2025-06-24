import { Prisma } from '@prisma/client';

export function getUserInclude(query: any): Prisma.UserInclude {
  const include: Prisma.UserInclude = {};

  if (query.branch) {
    include.branch = true;
  }

  if (query.company) {
    include.Company = true;
  }

  if (query.vehicle) {
    const vehicleIncludes = query.vehicle.split(",").map((s: string) => s.trim());
    const nestedVehicleInclude: Prisma.VehicleInclude = {};
    if (vehicleIncludes.includes("mileageHistory")) {
      nestedVehicleInclude.MileageHistory = true;
    }
    include.Vehicle = { include: nestedVehicleInclude };
  }

  if (query.workshop) {
    const workshopIncludes = query.workshop.split(",").map((s: string) => s.trim());
    const nestedWorkshopInclude: Prisma.WorkshopInclude = {};
    if (workshopIncludes.includes("manager")) {
      nestedWorkshopInclude.manager = true;
    }
    include.Workshop = { include: nestedWorkshopInclude };
  }

  return include;
}


