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

  async create(createVehicleDto: CreateVehicleDto) {
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

  // ✅ MÉTODO UPDATE COMPLETAMENTE REESCRITO
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
 

    // 1. Verificar se o veículo existe usando findFirst
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: { id },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }


    // 2. Preparar os dados de atualização (sem relações)
    const { companyId, branchId, driverId, ...rest } = updateVehicleDto;
    
    const updateData: any = { ...rest };

    // 3. Adicionar IDs das relações diretamente (não usar connect)
    if (companyId) {
      updateData.companyId = companyId;
    }

    if (branchId) {
      updateData.branchId = branchId;
    }

    if (driverId) {
      updateData.driverId = driverId;
    } else if (driverId === null || driverId === undefined) {
      // Se driverId for null/undefined, remover a associação
      updateData.driverId = null;
    }

    // 4. Usar updateMany em vez de update
    const updateResult = await this.prisma.vehicle.updateMany({
      where: { id },
      data: updateData,
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Veículo não foi atualizado');
    }

    // 5. Buscar e retornar o veículo atualizado
    const updatedVehicle = await this.prisma.vehicle.findFirst({
      where: { id },
      include: {
        company: true,
        branch: true,
        driver: true,
      },
    });

    return updatedVehicle;
  }

  async remove(plate: string) {
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: { plate },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    // Usar deleteMany em vez de delete
    const deleteResult = await this.prisma.vehicle.deleteMany({
      where: { plate },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('Veículo não foi removido');
    }

    return { message: "Veículo removido com sucesso" };
  }
  
  async setDriver(vehicleId: string, driverId: string | null) {
  // Verificar se o veículo existe
  const vehicle = await this.prisma.vehicle.findFirst({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    throw new NotFoundException('Veículo não encontrado');
  }

  // Se estiver vinculando um motorista, verificar se ele existe e é um DRIVER
  if (driverId) {
    const user = await this.prisma.user.findFirst({
      where: { 
        id: driverId,
        role: 'DRIVER'
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou não é um motorista');
    }

    // Verificar se o usuário já dirige outro veículo
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: { 
        driverId: driverId,
        NOT: { id: vehicleId }
      }
    });

    if (existingVehicle) {
      throw new ConflictException('Este motorista já está vinculado a outro veículo');
    }
  }

  // Fazer o update
  const updateResult = await this.prisma.vehicle.updateMany({
  where: { id: vehicleId },
  data: { driverId }
 });
}
  
}