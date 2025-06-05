import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, TenantClsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo usuário" })
  @ApiResponse({ status: 201, description: "Usuário criado com sucesso" })
  @ApiResponse({ status: 409, description: "Email já está em uso" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: "Listar todos os usuários" })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Buscar um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Atualizar um usuário" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remover um usuário" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
