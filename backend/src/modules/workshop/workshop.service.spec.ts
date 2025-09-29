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

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async findAll(query: WorkshopQueryDto) {
    const include = getWorkshopInclude(query)
    const where: any = {}

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) }
    }

    return await this.prisma.workshop.findMany({
      include,
      where,
    })
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
    await this.prisma.workshop.findFirst({ where: { id } })

    const { companyId, branchId, managerId, ...rest } = updateWorkshopDto

    return this.prisma.workshop.update({
      where: { id },
      data: {
        ...rest,
        ...(branchId && { branch: { connect: { id: branchId } } }),
        ...(managerId && { manager: { connect: { id: managerId } } }),
        ...(companyId && { company: { connect: { id: companyId } } }),
      },
    })
  }

  async remove({ id, companyId }: { id: string; companyId: string }) {
    await this.prisma.workshop.delete({
      where: { id, companyId },
    })

    return { message: "Oficina removida com sucesso" }
  }
}