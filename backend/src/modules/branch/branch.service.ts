import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { BranchQueryDto } from "./dto/branch-query.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class BranchService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  create(createBranchDto: CreateBranchDto, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      return new UnauthorizedException(
        "Apenas administradores podem criar filiais"
      );
    }
    return this.prisma.branch.create({ data: createBranchDto });
  }

  async findAll(query: BranchQueryDto) {
    const includeItems = query.include || [];

    return this.prisma.branch.findMany({
      include: {
        vehicles: includeItems.includes('vehicle'), 
        workshops: includeItems.includes('workshops'), 
        users: includeItems.includes('users'), 
        company: includeItems.includes('company'), 
        Order: includeItems.includes('orders'),
      },
    });
  }

  async findOne(id: number, query: BranchQueryDto) {
    const includeItems = query.include || [];

    const branch = this.prisma.branch.findMany({
      include: {
        vehicles: includeItems.includes('vehicle'), 
        workshops: includeItems.includes('workshops'), 
        users: includeItems.includes('users'), 
        company: includeItems.includes('company'), 
        Order: includeItems.includes('orders'),
      },
    });
}

    if (!branch) return new NotFoundException("Filial não encontrada");

    return branch;
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    try {
    return this.prisma.branch.update({
      where: { id },
      data: { ...updateBranchDto },
    });
    } catch (error) {
      return new NotFoundException("Filial não encontrada");
    }
  }

  async remove(id: number, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      return new UnauthorizedException(
        "Apenas administradores podem remover filiais"
      );
    }
    return this.prisma.branch.delete({ where: { id } });
  }
}
