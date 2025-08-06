import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { UpdateWorkshopDto } from "./dto/update-workshop.dto";
import { RegisterWorkshopDto } from "./dto/register-workshop.dto";
import * as bcrypt from "bcrypt";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { WorkshopQueryDto } from "./dto/workshop-query.dto";
import { getWorkshopInclude } from "src/utils/includes/workshop.includes";
import { UsersService } from "../user/users.service";

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async findAll(query: WorkshopQueryDto) {
    const include = getWorkshopInclude(query);
    const where: any = {};

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) };
    }

    return await this.prisma.workshop.findMany({
      include,
      where,
    });
  }

  async findManyByBranch(query: WorkshopQueryDto) {
    const include = getWorkshopInclude(query);
    const where: any = {};

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) };
    }

    return this.prisma.workshop.findMany({
      where,
      include,
    });
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
    });
  }

  async findOne({ id, query }: { id: string; query: WorkshopQueryDto }) {
    const include = getWorkshopInclude(query);

    const workshop = await this.prisma.workshop.findFirst({
      where: { id },
      include,
    });

    if (!workshop) {
      throw new NotFoundException(`Oficina com ID ${id} não encontrada`);
    }

    return workshop;
  }

  // ✅ MÉTODO MODIFICADO
  async register(registerWorkshopDto: RegisterWorkshopDto, companyId?: string) {
    // Verifica se já existe oficina com este CNPJ
    const existingWorkshop = await this.prisma.workshop.findFirst({
      where: { cnpj: registerWorkshopDto.cnpj },
    });

    if (existingWorkshop) {
      throw new ConflictException("Oficina já cadastrada com este CNPJ");
    }

    // ✅ Verifica se já existe usuário com este email
    const existingUser = await this.prisma.user.findFirst({
      where: { email: registerWorkshopDto.email },
    });

    if (existingUser) {
      throw new ConflictException("Já existe um usuário com este email");
    }

    const company = companyId
      ? await this.prisma.company.findFirst({ where: { id: companyId } })
      : await this.prisma.company.findFirst();

    if (!company) {
      throw new NotFoundException(
        "Nenhuma empresa encontrada para associar à oficina"
      );
    }

    const defaultBranch = await this.prisma.branch.findFirst({
      where: { companyId: company.id },
    });

    if (!defaultBranch) {
      throw new NotFoundException(
        "Nenhuma filial encontrada para associar à oficina"
      );
    }

    if (!registerWorkshopDto.password) {
      throw new Error("A senha é obrigatória para o cadastro de oficinas");
    }

    const hashedPassword = await bcrypt.hash(registerWorkshopDto.password, 10);

    // ✅ 1. Criar o usuário primeiro
    const user = await this.prisma.user.create({
      data: {
        name: registerWorkshopDto.name,
        email: registerWorkshopDto.email,
        phone: registerWorkshopDto.phone,
        password: hashedPassword,
        role: 'WORKSHOP_MANAGER',              // ← Role correta!
        company: { connect: { id: company.id } },
        branch: { connect: { id: defaultBranch.id } },
        emailVerified: true, // Ou false, dependendo do seu fluxo
      },
    });

    // ✅ 2. Criar a oficina linkada ao usuário
    const workshop = await this.prisma.workshop.create({
      data: {
        name: registerWorkshopDto.name,
        cnpj: registerWorkshopDto.cnpj,
        email: registerWorkshopDto.email,
        phone: registerWorkshopDto.phone,
        address: registerWorkshopDto.address,
        password: hashedPassword, // Mantendo por compatibilidade
        company: { connect: { id: company.id } },
        branch: { connect: { id: defaultBranch.id } },
        manager: { connect: { id: user.id } },  // ← Link com o usuário!
      },
    });

    return { user, workshop }; // ✅ Retorna ambos
  }

  async create(createWorkshopDto: CreateWorkshopDto) {
    const existingWorkshop = await this.prisma.workshop.findFirst({
      where: { cnpj: createWorkshopDto.cnpj },
    });

    if (existingWorkshop) {
      throw new ConflictException("Oficina já cadastrada com este CNPJ");
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

  async update({ id, updateWorkshopDto }: {id: string, updateWorkshopDto: UpdateWorkshopDto}) {
    await this.prisma.workshop.findFirst({ where: { id } });

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

  async remove({ id, companyId }: { id: string; companyId: string }) {
    await this.prisma.workshop.delete({
      where: { id, companyId },
    });

    return { message: "Oficina removida com sucesso" };
  }
}