import { Prisma } from "@prisma/client";

export function getWorkshopInclude(
  query: any,
): Prisma.WorkshopDefaultArgs["include"] {
  const include: Prisma.WorkshopInclude = {};

  if (query.company) {
    include.company = true;
  }

  if (query.branch) {
    include.branch = true;
  }

  if (query.manager) {
    const managerIncludes = query.managercd 
      .split(",")
      .map((s: string) => s.trim());
    const nestedManagerInclude: Prisma.UserInclude = {};
    if (managerIncludes.includes("branch")) {
      nestedManagerInclude.branch = true;
    }
    if (managerIncludes.includes("company")) {
      nestedManagerInclude.company = true;
    }
    include.manager = { include: nestedManagerInclude };
  }

  if (query.orders) {
    include.orders = true;
  }

  return include;
}
