import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { UpdateWorkshopDto } from "./dto/update-workshop.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { WorkshopQueryDto } from "./dto/workshop-query.dto";
import { getWorkshopInclude } from "src/utils/includes/workshop.includes";
import { UserRole } from "@prisma/client";

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

// workshop/workshop.service.ts

async findAll(query: WorkshopQueryDto & { userId?: string; userRole?: UserRole; userBranchId?: number }) {

  const include = getWorkshopInclude(query)
  const where: any = {}

  // 1. Se for WORKSHOP_MANAGER, só mostra a oficina que ele gerencia
  if (query.userRole === UserRole.WORKSHOP_MANAGER && query.userId) {
    where.managerId = query.userId;
  }
  
  // 2. Se for BRANCH_MANAGER, mostra todas as oficinas da filial dele
  else if (query.userRole === UserRole.BRANCH_MANAGER && query.userBranchId) {
    where.branchId = query.userBranchId;
  }
  
  // 3. Se for ADMIN, mostra todas (sem filtro adicional)
  else {
  }

  // 4. Se vier branchId na query, sobrescreve
  if (query.branchId) {
    where.branchId = Number(query.branchId);
  }

  const workshops = await this.prisma.workshop.findMany({
    include,
    where,
  })

  return workshops;
}

  async findManyByBranch(query: WorkshopQueryDto) {
    const include = getWorkshopInclude(query)
    const where: any = {}

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) }
    }

    return this.prisma.workshop.findMany({
      where,
      include,
    })
  }

  findAllWithVehicles(companyId: string) {
    return this.prisma.workshop.findMany({
      where: { companyId },
      include: {
        orders: {
          where: { endDate: null },
          include: {
            vehicle: true,
          },
        },
      },
    })
  }

  async findOneWithVehicles(id: string) {
    const workshop = await this.prisma.workshop.findFirst({
      where: { id },
      include: {
        orders: {
          where: { endDate: null },
          include: {
            vehicle: true,
          },
        },
        company: true,
        branch: true,
        manager: true,
      },
    });

    if (!workshop) {
      throw new NotFoundException(`Oficina com ID ${id} não encontrada`);
    }

    return workshop;
  }

  async findOne({ id, query }: { id: string; query: WorkshopQueryDto }) {
    const include = getWorkshopInclude(query)

    const workshop = await this.prisma.workshop.findFirst({
      where: { id },
      include,
    })

    if (!workshop) {
      throw new NotFoundException(`Oficina com ID ${id} não encontrada`)
    }

    return workshop
  }

  async create(createWorkshopDto: CreateWorkshopDto) {
    const existingWorkshop = await this.prisma.workshop.findFirst({
      where: { cnpj: createWorkshopDto.cnpj },
    })

    if (existingWorkshop) {
      throw new ConflictException("Oficina já cadastrada com este CNPJ")
    }

    let companyId = createWorkshopDto.companyId
    let branchId = createWorkshopDto.branchId

    if (!companyId) {
      const company = await this.prisma.company.findFirst()
      if (!company) {
        throw new NotFoundException("Nenhuma empresa encontrada")
      }
      companyId = company.id
    }

    if (!branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: { companyId },
      })
      if (!branch) {
        throw new NotFoundException("Nenhuma filial encontrada")
      }
      branchId = branch.id
    }

    // Desestruturar para remover os IDs quando usando connect
    const { managerId, companyId: _, branchId: __, ...workshopData } = createWorkshopDto

    return this.prisma.workshop.create({
      data: {
        ...workshopData,
        company: { connect: { id: companyId } },
        branch: { connect: { id: branchId } },
        ...(managerId && { manager: { connect: { id: managerId } } }),
      },
    })
  }

  async update({ id, updateWorkshopDto }: { id: string; updateWorkshopDto: UpdateWorkshopDto }) {
    // Verificar se existe
    const existingWorkshop = await this.prisma.workshop.findFirst({ 
      where: { id } 
    });

    if (!existingWorkshop) {
      throw new NotFoundException('Oficina não encontrada');
    }

    const { companyId, branchId, managerId, ...rest } = updateWorkshopDto;
    
    const updateData: any = { ...rest };

    // Adicionar IDs diretamente (sem usar connect)
    if (companyId) {
      updateData.companyId = companyId;
    }

    if (branchId) {
      updateData.branchId = branchId;
    }

    if (managerId !== undefined) {
      updateData.managerId = managerId; // pode ser null para desvincular
    }

    // Usar updateMany
    const updateResult = await this.prisma.workshop.updateMany({
      where: { id },
      data: updateData
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Oficina não foi atualizada');
    }

    // Retornar a oficina atualizada
    return this.prisma.workshop.findFirst({
      where: { id },
      include: {
        company: true,
        branch: true,
        manager: true
      }
    });
  }

  async remove({ id, companyId }: { id: string; companyId: string }) {
    // Verificar se a oficina existe
    const existingWorkshop = await this.prisma.workshop.findFirst({
      where: { id }
    });

    if (!existingWorkshop) {
      throw new NotFoundException('Oficina não encontrada');
    }

    // Usar deleteMany para evitar problemas com multi-tenancy
    const deleteResult = await this.prisma.workshop.deleteMany({
      where: { id }
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Oficina não foi removida');
    }

    return { message: "Oficina removida com sucesso" };
  }
  
  async setManager(workshopId: string, managerId: string | null) {
    // Verificar se a oficina existe
    const workshop = await this.prisma.workshop.findFirst({
      where: { id: workshopId }
    });

    if (!workshop) {
      throw new NotFoundException('Oficina não encontrada');
    }

    // Se estiver vinculando um gerente, verificar se ele existe e é um WORKSHOP_MANAGER
    if (managerId) {
      const user = await this.prisma.user.findFirst({
        where: { 
          id: managerId,
          role: 'WORKSHOP_MANAGER'
        }
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado ou não é um gerente de oficina');
      }

      // Verificar se o usuário já gerencia outra oficina
      const existingWorkshop = await this.prisma.workshop.findFirst({
        where: { 
          managerId: managerId,
          NOT: { id: workshopId }
        }
      });

      if (existingWorkshop) {
        throw new ConflictException('Este usuário já gerencia outra oficina');
      }
    }

    // Usar updateMany para evitar problemas com multi-tenancy
    const updateResult = await this.prisma.workshop.updateMany({
      where: { id: workshopId },
      data: { managerId }
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Falha ao atualizar a oficina');
    }

    // Buscar e retornar a oficina atualizada
    return this.prisma.workshop.findFirst({
      where: { id: workshopId },
      include: {
        manager: true,
        company: true,
        branch: true
      }
    });
  }
}