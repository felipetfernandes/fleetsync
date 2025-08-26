import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { VehicleQueryDto } from "./dto/vehicle-query.dto";
import { getVehicleInclude } from "src/utils/includes/vehicle.includes";

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async findAll(query: VehicleQueryDto) {
    const include = getVehicleInclude(query);
    const where: any = {};

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) };
    }

    if (query.status) {
      where.status = query.status;
    }

    return this.prisma.vehicle.findMany({
      where,
      include,
    });
  }

  // Método para encontrar um veículo pelo id
  async findOne({ plate, query }: { plate: string; query: VehicleQueryDto }) {
    const include = getVehicleInclude(query);

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { plate },
      include,
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo não encontrado`);
    }

    return vehicle;
  }

  // Método para criar um veículo
  async create(createVehicleDto: CreateVehicleDto) {
    // Verificar se a placa já existe
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: { plate: createVehicleDto.plate },
    });

    if (existingVehicle) {
      throw new ConflictException("Placa já está cadastrada");
    }

    const { companyId, branchId, driverId, ...rest } = createVehicleDto;

    return this.prisma.vehicle.create({
      data: {
        ...rest,
        mileageCurrent: rest.mileageStart,
        company: {
          connect: {
            id: createVehicleDto.companyId,
          },
        },
        branch: {
          connect: {
            id: createVehicleDto.branchId,
          },
        },
      },
    });
  }

  // Método para atualizar um veículo
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.prisma.vehicle.findUnique({
      where: { id },
    });

    const { companyId, branchId, driverId, ...rest } = updateVehicleDto;

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...rest,

        ...(companyId && {
          company: {
            connect: { id: companyId },
          },
        }),

        ...(branchId && {
          branch: {
            connect: { id: branchId },
          },
        }),

        ...(driverId && {
          driver: {
            connect: { id: driverId },
          },
        }),
      },
    });
  }

  // Método para remover um veículo
  async remove(plate: string) {
    await this.prisma.vehicle.findUnique({
      where: { plate },
    });

    await this.prisma.vehicle.delete({
      where: { plate },
    });

    return { message: "Veículo removido com sucesso" };
  }
}
