import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { CreateVehicleDto } from "./dto/create-vehicle.dto"
import { UpdateVehicleDto } from "./dto/update-vehicle.dto"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    // // Verificar se a placa já existe
    // const existingVehicle = await this.prisma.vehicle.findUnique({
    //   where: { plate: createVehicleDto.plate },
    // })

    // if (existingVehicle) {
    //   throw new ConflictException("Placa já está em uso")
    // }

    // // Criar veículo
    // return this.prisma.vehicle.create({
    //   data: createVehicleDto,
    // })
  }

  async findAll() {
    // return this.prisma.vehicle.findMany()
  }

  async findOne(id: string) {
    // const vehicle = await this.prisma.vehicle.findUnique({
    //   where: { id },
    //   include: { services: true },
    // })

    // if (!vehicle) {
    //   throw new NotFoundException(`Veículo com ID ${id} não encontrado`)
    // }

    // return vehicle
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    // Verificar se o veículo existe
    // await this.findOne(id)

    // // Atualizar veículo
    // return this.prisma.vehicle.update({
    //   where: { id },
    //   data: updateVehicleDto,
    // })
  }

  async remove(id: string) {
    // Verificar se o veículo existe
    // await this.findOne(id)

    // // Remover veículo
    // await this.prisma.vehicle.delete({
    //   where: { id },
    // })

    // return { message: "Veículo removido com sucesso" }
  }
}
