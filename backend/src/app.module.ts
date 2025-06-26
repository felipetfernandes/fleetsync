import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/user/users.module";
import { VehiclesModule } from "./modules/vehicle/vehicles.module";
import { OrderModule } from "./modules/order/orders.module";
import { CompanyModule } from "./modules/company/company.module";
import { BranchModule } from "./modules/branch/branch.module";
import { WorkshopModule } from "./modules/workshop/workshop.module";
import { ClsModule } from "nestjs-cls";
import { PrismaTenancyModule } from "./modules/prisma-tenancy/prisma-tenancy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
    PrismaModule,
    PrismaTenancyModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    OrderModule,
    CompanyModule,
    BranchModule,
    WorkshopModule,
  ],
})
export class AppModule {}
