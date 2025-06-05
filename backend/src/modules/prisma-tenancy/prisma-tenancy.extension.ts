import { Prisma } from "@prisma/client";
import { ClsService } from "nestjs-cls";

export function createTenantExtension(cls: ClsService) {
  return Prisma.defineExtension({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const companyId = cls.get("TENANT_COMPANY_ID");
          const branchId = cls.get("TENANT_BRANCH_ID");
          const workshopId = cls.get("TENANT_WORKSHOP_ID");
          const userRole = cls.get("TENANT_USER_ROLE");

          if (!companyId) {
            console.log(
              "[Prisma Extension] No companyId in CLS. Skipping filter."
            );
            return query(args);
          }

          const filterableOperations = [
            "findUnique",
            "findUniqueOrThrow",
            "findFirst",
            "findFirstOrThrow",
            "findMany",
            "update",
            "updateMany",
            "upsert",
            "delete",
            "deleteMany",
            "count",
            "aggregate",
            "groupBy",
          ];

          if (!filterableOperations.includes(operation)) {
            console.log(
              `[Prisma Extension] Operation ${operation} does not support 'where' filtering. Skipping.`
            );
            return query(args);
          }

          let tenantFilter: any = {};
          let applyFilterToModel = false;

          switch (model) {
            case "Branch":
              if (operation === "findFirst") {
                tenantFilter.companyId = companyId;
                applyFilterToModel = true;
                break;
              }
              tenantFilter.companyId = companyId;
              if (branchId) tenantFilter.id = branchId;
              applyFilterToModel = true;
              break;
            case "Vehicle":
            case "Workshop":
            case "Order":
            case "User":
              tenantFilter.companyId = companyId;
              if (branchId) tenantFilter.branchId = branchId;
              if (["Workshop", "Order"].includes(model) && workshopId) {
                tenantFilter.workshopId = workshopId;
              }
              applyFilterToModel = true;
              break;

            case "Company":
              applyFilterToModel = false;
              break;

            default:
              console.warn(
                `[Prisma Extension] Unknown model ${model}. Skipping tenant filter by default.`
              );
              applyFilterToModel = false;
              break;
          }

          if (!applyFilterToModel) {
            return query(args);
          }

          const currentArgs =
            args && typeof args === "object" ? { ...args } : {};
          const existingWhere = (currentArgs as any).where;

          if (existingWhere) {
            (currentArgs as any).where = {
              AND: [existingWhere, tenantFilter],
            };
          } else {
            (currentArgs as any).where = tenantFilter;
          }

          return query(currentArgs);
        },
      },
    },
  });
}
