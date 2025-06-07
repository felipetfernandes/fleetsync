import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";
import { VehicleQueryDto } from "./dto/vehicle-query.dto";

@ApiTags("vehicles")
@Controller("vehicles")
@UseGuards(JwtAuthGuard, TenantClsGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo veículo" })
  @ApiResponse({ status: 201, description: "Veículo criado com sucesso" })
  @ApiResponse({ status: 409, description: "Placa já está em uso" })
  create(@Body() createVehiclePayload: CreateVehicleDto, @Req() req) {
    const { companyId } = req.user;

    return this.vehiclesService.create({
      ...createVehiclePayload,
      companyId,
    });
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os veículos" })
  findAll(@Query() query: VehicleQueryDto) {
    return this.vehiclesService.findAll(query);
  }

  @Get(":plate")
  @ApiOperation({ summary: "Buscar um veículo pela Placa" })
  @ApiResponse({ status: 200, description: "Veículo encontrado" })
  @ApiResponse({ status: 404, description: "Veículo não encontrado" })
  findOne(@Param("plate") plate: string, @Query() query: VehicleQueryDto) {
    return this.vehiclesService.findOne({ plate, query });
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um veículo" })
  @ApiResponse({ status: 200, description: "Veículo atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Veículo não encontrado" })
  update(@Param("id") id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(":plate")
  @ApiOperation({ summary: "Remover um veículo" })
  @ApiResponse({ status: 200, description: "Veículo removido com sucesso" })
  @ApiResponse({ status: 404, description: "Veículo não encontrado" })
  remove(@Param("plate") plate: string, @Req() req) {
    if (req.user.role !== "ADMIN") {
      throw new Error("Apenas administradores podem remover veículos");
    }
    return this.vehiclesService.remove(plate);
  }
}
