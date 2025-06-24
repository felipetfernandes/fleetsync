import { Prisma } from '@prisma/client';

export function getWorkshopInclude(query: any): Prisma.WorkshopInclude {
  const include: Prisma.WorkshopInclude = {};

  if (query.company) {
    include.company = true;
  }

  if (query.branch) {
    include.branch = true;
  }

  if (query.manager) {
    const managerIncludes = query.manager.split(',').map((s: string) => s.trim());
    const nestedManagerInclude: Prisma.UserInclude = {};
    if (managerIncludes.includes('branch')) {
      nestedManagerInclude.branch = true;
    }
    if (managerIncludes.includes('company')) {
      nestedManagerInclude.Company = true;
    }
    include.manager = { include: nestedManagerInclude };
  }

  if (query.orders) {
    include.order = true;
  }

  return include;
}


