import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";

@Injectable()
export class UsersService {
  constructor(@Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient) { }

  async create(createUserDto: CreateUserDto) {
    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Criar usuário
    /* const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        company: createUserDto.companyId ? { connect: { id: createUserDto.companyId } } : undefined,
        branch: createUserDto.branchId ? { connect: { id: createUserDto.branchId } } : undefined,
      },
    });

    // Remover a senha do objeto retornado
    const { password, ...result } = user;
    return result;
    */
    return null;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verificar se o usuário existe
    await this.findOne(id);

    // Se estiver atualizando a senha, fazer o hash
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualizar usuário
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: string) {
    // Verificar se o usuário existe
    await this.findOne(id);

    // Remover usuário
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: "Usuário removido com sucesso" };
  }
}
