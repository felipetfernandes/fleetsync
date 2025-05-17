import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para encontrar todos os veículos
  async findAll() {
    return this.prisma.vehicle.findMany();
  }

  async findManyByCompany(companyId: string) {
    return this.prisma.vehicle.findMany({
      where: { companyId },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            licenseNumber: true,
            licenseCategory: true,
            licenseExpiration: true,
          },
        },
      },
    });
  }

  // Método para encontrar um veículo pelo id
  async findOne(plate: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plate },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            licenseNumber: true,
            licenseCategory: true,
            licenseExpiration: true,
          },
        },
      }
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${plate} não encontrado`);
    }

    return vehicle;
  }

  // Método para criar um veículo
  async create(createVehicleDto: CreateVehicleDto) {
    // Verificar se a placa já existe
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plate: createVehicleDto.plate },
    });

    if (existingVehicle) {
      throw new ConflictException("Placa já está cadastrada");
    }

    // Criar veículo e associar à empresa
    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
      },
    });
  }

  // Método para atualizar um veículo
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  // Método para remover um veículo
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.vehicle.delete({
      where: { id },
    });

    return { message: "Veículo removido com sucesso" };
  }
}
