import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
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
import { UserQueryDto } from "./dto/user-query.dto";

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
  
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Buscar usuário logado com suas relações" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  findMe(@Req() req) {
    const { userId } = req.user;
    
    const query: UserQueryDto = {
      branch: true,
      company: true,
      workshop: "manager,company,branch",
    };
    
    return this.usersService.findOne({ id: userId, query });
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: "Listar todos os usuários" })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get("id/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Buscar um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  findOne(@Param("id") id: string, @Query() query: UserQueryDto) {
    return this.usersService.findOne({id, query});
  }

  @Get("email/:email")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Buscar um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário encontrado" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  findOneByEmail(@Param("email") email: string, @Query() query: UserQueryDto) {
    return this.usersService.findByEmail({email, query});
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Atualizar um usuário" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remover um usuário" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
