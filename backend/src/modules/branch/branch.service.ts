import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { BranchQueryDto } from "./dto/branch-query.dto";
import { UserRole } from "@prisma/client";
import { getBranchInclude } from "src/utils/includes/branch.includes";

@Injectable()
export class BranchService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async create(createBranchDto: CreateBranchDto, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        "Apenas administradores podem criar filiais"
      );
    }
    return this.prisma.branch.create({ data: createBranchDto });
  }

  async findAll(query: BranchQueryDto) {
    const include = getBranchInclude(query);

    return this.prisma.branch.findMany({
      include,
    });
  }

  async findOne(id: number, query: BranchQueryDto) {
    const include = getBranchInclude(query);

    const branch = await this.prisma.branch.findFirst({
      where: { id },
      include,
    });

    if (!branch) {
      throw new NotFoundException("Filial não encontrada");
    }

    return branch;
  }

  async findOrdersByBranch(branchId: number) {
    // Primeiro, verifica se a filial existe
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException(`Filial com ID ${branchId} não encontrada`);
    }

    // Busca as ordens da filial
    return this.prisma.order.findMany({
      where: { branchId },
      include: {
        vehicle: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                role: true,
              },
            },
          },
        },
        workshop: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findTeamByBranch(branchId: number) {
    // Primeiro, verifica se a filial existe
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new NotFoundException(`Filial com ID ${branchId} não encontrada`);
    }

    // Busca os usuários da filial
    return this.prisma.user.findMany({
      where: { branchId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        licenseNumber: true,
        licenseCategory: true,
        licenseExpiration: true,
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true,
            brand: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    try {
      const branch = await this.prisma.branch.findUnique({
        where: { id },
      });

      if (!branch) {
        throw new NotFoundException("Filial não encontrada");
      }

      return this.prisma.branch.update({
        where: { id },
        data: { ...updateBranchDto },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException("Erro ao atualizar filial");
    }
  }

  async remove(id: number, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        "Apenas administradores podem remover filiais"
      );
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException("Filial não encontrada");
    }

    return this.prisma.branch.delete({ where: { id } });
  }
}