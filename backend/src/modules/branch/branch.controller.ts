import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { BranchService } from "./branch.service";
import { CreateBranchBodyDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";
import { BranchQueryDto } from "./dto/branch-query.dto";

@ApiTags("branchs")
@Controller("branchs")
@UseGuards(JwtAuthGuard, TenantClsGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiOperation({ summary: "Criar uma nova filial" })
  @ApiResponse({ status: 200, description: "Filial criada com sucesso" })
  @ApiResponse({
    status: 401,
    description: "Apenas administradores podem criar filiais",
  })
  @Post()
  create(@Body() createBranchBodyDto: CreateBranchBodyDto, @Req() req) {
    const { companyId, role } = req.user;
    const createBranchDto = { ...createBranchBodyDto, companyId };
    return this.branchService.create(createBranchDto, role);
  }

  @ApiOperation({ summary: "Listar todos as filiais" })
  @ApiResponse({ status: 200, description: "Filiais listadas com sucesso" })
  @Get()
  findAll(@Query() query: BranchQueryDto) {
    return this.branchService.findAll(query);
  }

  @ApiOperation({ summary: "Encontrar uma filial pelo id" })
  @ApiResponse({ status: 200, description: "Filial encontrada com sucesso" })
  @Get(":id")
  findOne(@Param("id") id: string, @Query() query: BranchQueryDto) {
    return this.branchService.findOne(+id, query);
  }

  @ApiOperation({ summary: "Atualizar uma filial pelo id" })
  @ApiResponse({ status: 200, description: "Filial atualizada com sucesso" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @ApiOperation({ summary: "Deletar uma filial pelo id" })
  @ApiResponse({ status: 200, description: "Filial deletada com sucesso" })
  @ApiResponse({
    status: 401,
    description: "Apenas administradores podem remover filiais",
  })
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req) {
    const { role } = req.user;
    return this.branchService.remove(+id, role);
  }
}
