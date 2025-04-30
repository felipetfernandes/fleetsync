import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // // Verificar se o veículo existe
    // const vehicle = await this.prismaService.vehicle.findUnique({
    //   where: { id: createOrderDto.vehicleId },
    // })

    // if (!vehicle) {
    //   throw new NotFoundException(`Veículo com não encontrado`)
    // }

    // // Criar serviço
    // return this.prismaService.order.create({
    //   data: createOrderDto,
    // })
  }

  async findAll() {
    // return this.prismaService.order.findMany()
  }

  async findOne(id: string) {
    // const service = await this.prismaService.order.findUnique({
    //   where: { id },
    // })

    // if (!service) {
    //   throw new NotFoundException(`Serviço com ID ${id} não encontrado`)
    // }

    // return service
  }

  async update(id: string, updateServiceDto: UpdateOrderDto) {
    // Verificar se o serviço existe
    // await this.findOne(id)

    // // Se estiver atualizando o veículo, verificar se o veículo existe
    // if (updateServiceDto.vehicleId) {
    //   const vehicle = await this.prismaService.vehicle.findUnique({
    //     where: { id: updateServiceDto.vehicleId },
    //   })

    //   if (!vehicle) {
    //     throw new NotFoundException(`Veículo com ID ${updateServiceDto.vehicleId} não encontrado`)
    //   }
    // }

    // // Atualizar serviço
    // return this.prismaService.service.update({
    //   where: { id },
    //   data: updateServiceDto,
    //   include: { vehicle: true },
    // })
  }

  async remove(id: string) {
    // Verificar se o serviço existe
    // await this.findOne(id)

    // // Remover serviço
    // await this.prismaService.service.delete({
    //   where: { id },
    // })

    return { message: "Serviço removido com sucesso" }
  }
}
