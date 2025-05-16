import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { vehicleId, workshopId, companyId, ...orderData } = createOrderDto;

    // Verificar se o veículo existe
    const vehicle = await this.prismaService.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${vehicleId} não encontrado`);
    }

    // Verificar se a oficina existe
    const workshop = await this.prismaService.workshop.findUnique({
      where: { id: workshopId },
    });
    if (!workshop) {
      throw new NotFoundException(
        `Oficina com ID ${workshopId} não encontrada`
      );
    }

    // Verificar se a empresa existe
    const enterprise = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
    if (!enterprise) {
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
    }

    // Criar ordem de serviço
    /*return this.prismaService.order.create({
      data: {
        ...orderData,
        vehicle: { connect: { id: vehicleId } },
        workshop: { connect: { id: workshopId } },
        company: { connect: { id: companyId } },
      },
      include: {
        vehicle: true,
        workshop: true,
        enterprise: true,
      },
    })
    */
    return null;
  }

  async findAll() {
    return this.prismaService.order.findMany({
      include: { vehicle: true, workshop: true, company: true },
    });
  }

  async findOne(id: string) {
    const service = await this.prismaService.order.findUnique({
      where: { id },
      include: { vehicle: true, workshop: true, company: true },
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return service;
  }

  async update(id: string, updateDto: UpdateOrderDto) {
    // Verificar se a ordem existe
    await this.findOne(id);

    const { vehicleId, workshopId, companyId, ...rest } = updateDto;

    const data: any = { ...rest };

    // Validar e conectar veículo se necessário
    if (vehicleId) {
      const vehicle = await this.prismaService.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!vehicle)
        throw new NotFoundException(
          `Veículo com ID ${vehicleId} não encontrado`
        );
      data.vehicle = { connect: { id: vehicleId } };
    }

    // Validar e conectar oficina se necessário
    if (workshopId) {
      const workshop = await this.prismaService.workshop.findUnique({
        where: { id: workshopId },
      });
      if (!workshop)
        throw new NotFoundException(
          `Oficina com ID ${workshopId} não encontrada`
        );
      data.workshop = { connect: { id: workshopId } };
    }

    // Validar e conectar empresa se necessário
    if (companyId) {
      const enterprise = await this.prismaService.company.findUnique({
        where: { id: companyId },
      });
      if (!enterprise)
        throw new NotFoundException(
          `Empresa com ID ${companyId} não encontrada`
        );
      data.enterprise = { connect: { id: companyId } };
    }

    // Atualizar ordem
    return this.prismaService.order.update({
      where: { id },
      data,
      include: { vehicle: true, workshop: true, company: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.order.delete({
      where: { id },
    });

    return { message: "Serviço removido com sucesso" };
  }
}
