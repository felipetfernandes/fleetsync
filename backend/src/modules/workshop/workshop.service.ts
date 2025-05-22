import { Injectable } from "@nestjs/common";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { UpdateWorkshopDto } from "./dto/update-workshop.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) {}
  create(createWorkshopDto: CreateWorkshopDto) {
    return "This action adds a new workshop";
  }

  async findAll(companyId) {
    return await this.prisma.workshop.findMany({ where: { companyId }, 
      include: {
        order: true,
      }
 });
  }

  async findAllByBranch({
    branchId,
    companyId,
  }: {
    branchId: number;
    companyId: string;
  }) {
    return await this.prisma.workshop.findMany({
      where: { branchId, companyId },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} workshop`;
  }

  update(id: number, updateWorkshopDto: UpdateWorkshopDto) {
    return `This action updates a #${id} workshop`;
  }

  remove(id: number) {
    return `This action removes a #${id} workshop`;
  }
}
