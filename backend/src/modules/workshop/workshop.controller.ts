import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { WorkshopService } from "./workshop.service";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { UpdateWorkshopDto } from "./dto/update-workshop.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";
import { WorkshopQueryDto } from "./dto/workshop-query.dto";

interface JwtPayload {
  userId: string;
  companyId: string;
}

@ApiTags("workshops")
@Controller("workshops")
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todos as oficinas" })
  findAll(@Query() query: WorkshopQueryDto) {
    return this.workshopService.findAll(query);
  }

  @Get("vehicles")
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar todos as oficinas com veículos" })
  findAllWithVehicles(@Req() req) {
    const { companyId } = req.user;
    return this.workshopService.findAllWithVehicles(companyId);
  }

  @Get(":id/vehicles")
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Listar veículos de uma oficina específica" })
  async findVehiclesByWorkshop(@Param("id") id: string) {
    return this.workshopService.findOneWithVehicles(id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  findOne(@Param("id") id: string, @Query() query: WorkshopQueryDto) {
    return this.workshopService.findOne({ id, query });
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Criar uma nova oficina" })
  @ApiResponse({ status: 201, description: "Oficina criada com sucesso" })
  @ApiResponse({ status: 409, description: "CNPJ já cadastrado" })
  create(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @Req() req: { user: JwtPayload }
  ) {
    const { companyId } = req.user;
    return this.workshopService.create({ ...createWorkshopDto, companyId });
  }

  // SIMPLIFICADO: Endpoint público para registro sem criar usuário
  @Post("register")
  @ApiOperation({ summary: "Registrar uma nova oficina (público)" })
  @ApiResponse({ 
    status: 201, 
    description: "Oficina registrada com sucesso" 
  })
  @ApiResponse({ status: 409, description: "CNPJ já cadastrado" })
  async register(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopService.create(createWorkshopDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Atualizar uma oficina" })
  @ApiResponse({ status: 200, description: "Oficina atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Oficina não encontrada" })
  update(
    @Param("id") id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @Req() req: { user: JwtPayload }
  ) {
    return this.workshopService.update({ id, updateWorkshopDto });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, TenantClsGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remover uma oficina" })
  @ApiResponse({ status: 200, description: "Oficina removida com sucesso" })
  @ApiResponse({ status: 404, description: "Oficina não encontrada" })
  remove(@Param("id") id: string, @Req() req: { user: JwtPayload }) {
    const { companyId } = req.user;
    return this.workshopService.remove({ id, companyId });
  }
   @Patch(":id/manager")
 @UseGuards(JwtAuthGuard, TenantClsGuard)
 @ApiBearerAuth()
 @ApiOperation({ summary: "Vincular ou desvincular gerente da oficina" })
 @ApiResponse({ status: 200, description: "Gerente vinculado com sucesso" })
 @ApiResponse({ status: 404, description: "Oficina ou usuário não encontrado" })
 async setManager(
  @Param("id") id: string,
  @Body() body: { managerId: string | null }
 ) {
  return this.workshopService.setManager(id, body.managerId);
}
}