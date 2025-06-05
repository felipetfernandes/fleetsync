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
import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard, TenantClsGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo serviço" })
  @ApiResponse({ status: 201, description: "Serviço criado com sucesso" })
  @ApiResponse({ status: 404, description: "Veículo não encontrado" })
  create(@Body() createServiceDto: CreateOrderDto, @Req() req) {
    const { companyId } = req.user;
    return this.ordersService.create(createServiceDto, companyId);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os serviços" })
  findAll(@Req() req, @Query("plate") plate?: string) {
    if (plate) return this.ordersService.findAllByPlate(plate);
    const { companyId } = req.user;
    return this.ordersService.findAll(companyId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um serviço pelo ID" })
  @ApiResponse({ status: 200, description: "Serviço encontrado" })
  @ApiResponse({ status: 404, description: "Serviço não encontrado" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um serviço" })
  @ApiResponse({ status: 200, description: "Serviço atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Serviço não encontrado" })
  update(@Param("id") id: string, @Body() updateServiceDto: UpdateOrderDto, @Req() req) {
    const { companyId } = req.user;
    return this.ordersService.update(id, updateServiceDto, companyId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remover um serviço" })
  @ApiResponse({ status: 200, description: "Serviço removido com sucesso" })
  @ApiResponse({ status: 404, description: "Serviço não encontrado" })
  remove(@Param("id") id: string) {
    return this.ordersService.remove(id);
  }
}
