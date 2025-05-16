import { Module } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { OrderController } from "./orders.controller";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { VehiclesModule } from "../vehicle/vehicles.module";
import { CompanyModule } from "../company/company.module";

@Module({
  imports: [PrismaModule, CompanyModule, VehiclesModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
