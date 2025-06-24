import { Prisma } from '@prisma/client';

export function getCompanyInclude(query: any): Prisma.CompanyInclude {
  const include: Prisma.CompanyInclude = {};

  if (query.branches) {
    include.branches = true;
  }

  if (query.vehicles) {
    include.vehicles = true;
  }

  if (query.users) {
    include.users = true;
  }

  if (query.orders) {
    include.order = true;
  }

  if (query.workshops) {
    include.Workshop = true;
  }

  return include;
}


