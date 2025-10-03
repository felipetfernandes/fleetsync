import { Prisma } from '@prisma/client';

export function getUserInclude(query: any): Prisma.UserInclude {
  const include: Prisma.UserInclude = {};

  if (query.branch) {
    include.branch = true;
  }

  if (query.company) {
    include.company = true;
  }

  if (query.vehicle) {
    const vehicleIncludes = query.vehicle.split(",").map((s: string) => s.trim());
    const nestedVehicleInclude: Prisma.VehicleInclude = {};
    if (vehicleIncludes.includes("mileageHistory")) {
      nestedVehicleInclude.mileageHistory = true;
    }
    if (vehicleIncludes.includes("orders")) {
      nestedVehicleInclude.orders = true;
    }
    if (vehicleIncludes.includes("driver")) {
      nestedVehicleInclude.driver = true;
    }
    include.vehicle = { include: nestedVehicleInclude };
  }

  if (query.workshop) {
    const workshopIncludes = query.workshop.split(",").map((s: string) => s.trim());
    const nestedWorkshopInclude: Prisma.WorkshopInclude = {};
    if (workshopIncludes.includes("manager")) {
      nestedWorkshopInclude.manager = true;
    }
	
    if (workshopIncludes.includes("company")) {
      nestedWorkshopInclude.company = true;
    }
    
    if (workshopIncludes.includes("branch")) {
      nestedWorkshopInclude.branch = true;
    }
    
    if (workshopIncludes.includes("orders")) {
      nestedWorkshopInclude.orders = true;
    }
    include.workshop = { include: nestedWorkshopInclude };
  }

  return include;
}


