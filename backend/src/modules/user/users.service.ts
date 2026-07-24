import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  Logger,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { SafeSelectUserDto } from "./dto/safe-select-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";
import { getUserInclude } from "src/utils/includes/user.includes";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException("Email já está em uso")
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // Criar objeto de dados sem os campos de ID quando usando connect
    const { companyId, branchId, password, ...userData } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        company: companyId ? { connect: { id: companyId } } : undefined,
        branch: branchId ? { connect: { id: branchId } } : undefined,
      },
    })

    // Remover a senha do objeto retornado
    const { password: _, ...result } = user
    return result
  }

  async findAll(query: UserQueryDto) {
    const include = getUserInclude(query)
    const where: any = {}

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) }
    }

    if (query.role) {
      where.role = query.role
    }

    return this.prisma.user.findMany({
      select: { ...SafeSelectUserDto, ...include },
      where,
    })
  }

  async findOne({ id, query }: { id: string; query: UserQueryDto }) {
    const include = getUserInclude(query)

    const user = await this.prisma.user.findFirst({
      select: { ...SafeSelectUserDto, ...include },
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`Usuário não encontrado`)
    }

    return user
  }

  async findByEmail({ email, query }: { email: string; query: UserQueryDto }) {
    const include = getUserInclude(query)

    return this.prisma.user.findFirst({
      select: { ...SafeSelectUserDto, ...include },
      where: { email },
    })
  }

  async authUser({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findFirst({ where: { email } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    // Usar updateMany para evitar problemas com multi-tenant
    const updateResult = await this.prisma.user.updateMany({
      where: { id },
      data: updateUserDto,
    })

    if (updateResult.count === 0) {
      throw new NotFoundException('Usuário não encontrado')
    }

    // Buscar o usuário atualizado para retornar
    const updatedUser = await this.prisma.user.findFirst({
      where: { id },
    })

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const { password, ...result } = updatedUser
    return result
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: {
          vehicle: true,
          workshop: true,
        },
      })

      if (!user) {
        throw new NotFoundException("Usuário não encontrado")
      }

      // Se o usuário é um driver, remover a associação do veículo
      if (user.vehicle) {
        // Usar updateMany para evitar problemas com multi-tenant
        await this.prisma.vehicle.updateMany({
          where: { id: user.vehicle.id },
          data: { driverId: null },
        })
      }

      // Se o usuário é um manager de oficina, remover a associação
      if (user.workshop) {
        // Usar updateMany para evitar problemas com multi-tenant
        await this.prisma.workshop.updateMany({
          where: { id: user.workshop.id },
          data: { managerId: null },
        })
      }

      // Deletar o usuário
      await this.prisma.user.delete({
        where: { id },
      })

      return { message: "Usuário removido com sucesso" }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.error("Erro ao remover usuário:", error)
      throw new Error("Erro interno ao remover usuário")
    }
  }
}