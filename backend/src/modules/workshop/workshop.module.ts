import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [WorkshopController],
  providers: [WorkshopService, PrismaService],
})
export class WorkshopModule {}
