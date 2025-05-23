import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { RegisterWorkshopDto } from './dto/register-workshop.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WorkshopService {
  constructor(private readonly prisma: PrismaService) { }

  async findByCompany(companyId: string) {
    return this.prisma.workshop.findMany({
      where: { companyId },
      include: { order: true },
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
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!workshop) {
      throw new NotFoundException(`Oficina com ID ${id} não encontrada`);
    }

    return workshop;
  }

  async register(registerWorkshopDto: RegisterWorkshopDto, companyId?: string) {
    const existingWorkshop = await this.prisma.workshop.findUnique({
      where: { cnpj: registerWorkshopDto.cnpj },
    });

    if (existingWorkshop) {
      throw new ConflictException('Oficina já cadastrada com este CNPJ');
    }

    const company = companyId
      ? await this.prisma.company.findUnique({ where: { id: companyId } })
      : await this.prisma.company.findFirst();

    if (!company) {
      throw new NotFoundException('Nenhuma empresa encontrada para associar à oficina');
    }

    const defaultBranch = await this.prisma.branch.findFirst({
      where: { companyId: company.id },
    });

    if (!defaultBranch) {
      throw new NotFoundException('Nenhuma filial encontrada para associar à oficina');
    }

    if (!registerWorkshopDto.password) {
      throw new Error('A senha é obrigatória para o cadastro de oficinas');
    }

    const hashedPassword = await bcrypt.hash(registerWorkshopDto.password, 10);

    return this.prisma.workshop.create({
      data: {
        name: registerWorkshopDto.name,
        cnpj: registerWorkshopDto.cnpj,
        email: registerWorkshopDto.email,
        phone: registerWorkshopDto.phone,
        address: registerWorkshopDto.address,
        password: hashedPassword,
        company: { connect: { id: company.id } },
        branch: { connect: { id: defaultBranch.id } },
      },
    });
  }

  async create(createWorkshopDto: CreateWorkshopDto) {
    const existingWorkshop = await this.prisma.workshop.findUnique({
      where: { cnpj: createWorkshopDto.cnpj },
    });

    if (existingWorkshop) {
      throw new ConflictException('Oficina já cadastrada com este CNPJ');
    }

    const { companyId, branchId, managerId, ...rest } = createWorkshopDto;

    return this.prisma.workshop.create({
      data: {
        ...rest,
        company: { connect: { id: companyId } },
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
        ...(companyId && { company: { connect: { id: companyId } } }),
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
