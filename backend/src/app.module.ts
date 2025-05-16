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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
