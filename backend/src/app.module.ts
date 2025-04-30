import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { VehiclesModule } from "./modules/vehicles/vehicles.module"
import { OrderModule } from "./modules/orders/orders.module"

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
  ],
})
export class AppModule {}
