import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { RegisterWorkshopDto } from './dto/register-workshop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface JwtPayload {
  userId: string;
  companyId: string;
}

@ApiTags('workshops')
@Controller('workshops')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as oficinas da empresa' })
  findAll(@Req() req: { user: JwtPayload }) {
    const { companyId } = req.user;
    return this.workshopService.findByCompany(companyId);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar oficinas por empresa' })
  findByCompany(@Param('companyId') companyId: string) {
    return this.workshopService.findByCompany(companyId);
  }

  @Get('branch/:branchId')
  @ApiOperation({ summary: 'Listar oficinas por filial' })
  findByBranch(@Param('branchId') branchId: number) {
    return this.workshopService.findByBranch(branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma oficina pelo ID' })
  @ApiResponse({ status: 200, description: 'Oficina encontrada' })
  @ApiResponse({ status: 404, description: 'Oficina não encontrada' })
  findOne(@Param('id') id: string) {
    return this.workshopService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova oficina com todos os detalhes' })
  @ApiResponse({ status: 201, description: 'Oficina criada com sucesso' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  create(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @Req() req: { user: JwtPayload }
  ) {
    const { companyId } = req.user;
    return this.workshopService.create({ ...createWorkshopDto, companyId });
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar uma nova oficina de forma simplificada' })
  @ApiResponse({ status: 201, description: 'Oficina registrada com sucesso' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  register(
    @Body() registerWorkshopDto: RegisterWorkshopDto,
    @Req() req: { user: JwtPayload }
  ) {
    const { companyId } = req.user;
    return this.workshopService.register(registerWorkshopDto, companyId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma oficina' })
  @ApiResponse({ status: 200, description: 'Oficina atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Oficina não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
    @Req() req: { user: JwtPayload }
  ) {
    const { companyId } = req.user;
    return this.workshopService.update(id, { ...updateWorkshopDto, companyId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma oficina' })
  @ApiResponse({ status: 200, description: 'Oficina removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Oficina não encontrada' })
  remove(@Param('id') id: string) {
    return this.workshopService.remove(id);
  }
}
