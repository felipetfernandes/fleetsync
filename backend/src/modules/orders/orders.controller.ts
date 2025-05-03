import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { OrderService } from "./orders.service"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("services")
@Controller("services")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly servicesService: OrderService) {}

  @Post()
@ApiOperation({ summary: 'Criar um novo serviço' })
@ApiResponse({ status: 201, description: 'Serviço criado com sucesso' })
@ApiResponse({ status: 404, description: 'Veículo não encontrado' })
create(@Body() createServiceDto: CreateOrderDto) {
  return this.servicesService.create(createServiceDto);
}

@Get()
@ApiOperation({ summary: "Listar todos os serviços" })
findAll() {
  return this.servicesService.findAll();
}

@Get(':id')
@ApiOperation({ summary: 'Buscar um serviço pelo ID' })
@ApiResponse({ status: 200, description: 'Serviço encontrado' })
@ApiResponse({ status: 404, description: 'Serviço não encontrado' })
findOne(@Param('id') id: string) {
  return this.servicesService.findOne(id);
}

@Patch(":id")
@ApiOperation({ summary: "Atualizar um serviço" })
@ApiResponse({ status: 200, description: "Serviço atualizado com sucesso" })
@ApiResponse({ status: 404, description: "Serviço não encontrado" })
update(@Param('id') id: string, @Body() updateServiceDto: UpdateOrderDto) {
  return this.servicesService.update(id, updateServiceDto);
}

@Delete(':id')
@ApiOperation({ summary: 'Remover um serviço' })
@ApiResponse({ status: 200, description: 'Serviço removido com sucesso' })
@ApiResponse({ status: 404, description: 'Serviço não encontrado' })
remove(@Param('id') id: string) {
  return this.servicesService.remove(id);
}

}
