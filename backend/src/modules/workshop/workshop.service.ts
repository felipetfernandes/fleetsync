import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.workshop.findMany();
  }

  async findByCompany(companyId: string) {
    return this.prisma.workshop.findMany({
      where: { companyId },
    });
  }

  async findByBranch(branchId: number) {
    return this.prisma.workshop.findMany({
      where: { branchId },
    });
  }

  async findOne(id: string) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!workshop) {
      throw new NotFoundException(`Oficina com ID ${id} não encontrada`);
    }

    return workshop;
  }

  async create(createWorkshopDto: CreateWorkshopDto) {
    const existingWorkshop = await this.prisma.workshop.findUnique({
      where: { cnpj: createWorkshopDto.cnpj },
    });

    if (existingWorkshop) {
      throw new ConflictException('Oficina já cadastrada com este CNPJ');
    }

    // Extrai companyId, branchId e managerId do DTO
    const { companyId, branchId, managerId, ...rest } = createWorkshopDto;

    return this.prisma.workshop.create({
      data: {
        ...rest,
        company: { connect: { id: companyId } },   // conecta empresa via relacionamento
        branch: { connect: { id: branchId } },
        ...(managerId && { manager: { connect: { id: managerId } } }),
      },
    });
  }

  async update(id: string, updateWorkshopDto: UpdateWorkshopDto) {
    await this.findOne(id);

    const { companyId, branchId, managerId, ...rest } = updateWorkshopDto;

    return this.prisma.workshop.update({
      where: { id },
      data: {
        ...rest,
        ...(branchId && { branch: { connect: { id: branchId } } }),
        ...(managerId && { manager: { connect: { id: managerId } } }),
      },
    });
  }


  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.workshop.delete({
      where: { id },
    });

    return { message: 'Oficina removida com sucesso' };
  }
}
