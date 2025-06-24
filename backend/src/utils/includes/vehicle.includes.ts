import { Prisma } from '@prisma/client';

export function getVehicleInclude(query: any): Prisma.VehicleInclude {
  const include: Prisma.VehicleInclude = {};

  if (query.company) {
    include.company = true;
  }

  if (query.branch) {
    include.branch = true;
  }

  if (query.driver) {
    const driverIncludes = query.driver.split(',').map((s: string) => s.trim());
    const nestedDriverInclude: Prisma.UserInclude = {};
    if (driverIncludes.includes('branch')) {
      nestedDriverInclude.branch = true;
    }
    if (driverIncludes.includes('company')) {
      nestedDriverInclude.Company = true;
    }
    include.driver = { include: nestedDriverInclude };
  }

  if (query.orders) {
    include.order = true;
  }

  if (query.mileageHistory) {
    include.MileageHistory = true;
  }

  return include;
}


