import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { CreateVehicleDto } from "./dto/create-vehicle.dto"
import { UpdateVehicleDto } from "./dto/update-vehicle.dto"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plate: createVehicleDto.plate },
    });

    if (existingVehicle) {
      throw new ConflictException("Placa já está em uso");
    }

    return this.prisma.vehicle.create({
      data: createVehicleDto,
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany();
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { services: true }, // ajuste conforme suas relações
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id); // dispara NotFoundException se não existir

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // dispara NotFoundException se não existir

    await this.prisma.vehicle.delete({
      where: { id },
    });

    return { message: "Veículo removido com sucesso" };
  }
}
