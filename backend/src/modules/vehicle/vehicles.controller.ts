import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { VehiclesService } from "./vehicles.service"
import { CreateVehicleDto } from "./dto/create-vehicle.dto"
import { UpdateVehicleDto } from "./dto/update-vehicle.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("vehicles")
@Controller("vehicles")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({ status: 201, description: 'Veículo criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Placa já está em uso' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os veículos" })
  findAll(@Req() req) {
    const companyId = req.user.companyId
    return this.vehiclesService.findManyByCompany(companyId)
  }

  @Get(':plate')
  @ApiOperation({ summary: 'Buscar um veículo pelo Placa' })
  @ApiResponse({ status: 200, description: 'Veículo encontrado' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  findOne(@Param('plate') plate: string) {
    return this.vehiclesService.findOne(plate);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um veículo" })
  @ApiResponse({ status: 200, description: "Veículo atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Veículo não encontrado" })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um veículo' })
  @ApiResponse({ status: 200, description: 'Veículo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
