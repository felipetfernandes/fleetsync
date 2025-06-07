import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { buildPrismaInclude } from "src/utils/includes/prisma-includes.util";
import { orderAvailableIncludes } from "src/utils/includes/order.includes";
import { OrderQueryDto } from "./dto/order-query.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class OrderService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async create(createOrderDto: CreateOrderDto, companyId: string) {
    const { vehicleId, workshopId, branchId, items, ...orderData } =
      createOrderDto;

    // Verificar se o veículo existe
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${vehicleId} não encontrado`);
    }

    // Verificar se a oficina existe
    const workshop = await this.prisma.workshop.findUnique({
      where: { id: workshopId },
    });
    if (!workshop) {
      throw new NotFoundException(
        `Oficina com ID ${workshopId} não encontrada`
      );
    }

    // Verificar se a empresa existe
    const enterprise = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!enterprise) {
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
    }

    // Criar ordem de serviço
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        vehicle: { connect: { id: vehicleId } },
        workshop: { connect: { id: workshopId } },
        company: { connect: { id: companyId } },
        branch: { connect: { id: Number(branchId) } },
      },
      include: {
        vehicle: true,
        workshop: true,
        company: true,
        branch: true,
      },
    });

    await this.prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId: order.id,
        description: item.description,
        cost: item.cost,
        laborCost: item.laborCost,
        totalCost: item.totalCost,
      })),
    });

    return null;
  }

  async findAll(query: OrderQueryDto) {
    const include = buildPrismaInclude(
      query.include || [],
      orderAvailableIncludes
    );
    const where: any = {};

    if (query.plate) {
      where.vehicle = { plate: query.plate };
    }

    if (query.workshopId) {
      where.workshop = { id: query.workshopId };
    }

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) };
    }

    return this.prisma.order.findMany({
      where,
      include,
    });
  }

  async findOne({ id, query }: { id: string; query: OrderQueryDto }) {
    const include = buildPrismaInclude(
      query.include || [],
      orderAvailableIncludes
    );

    const service = await this.prisma.order.findFirst({
      where: { id },
      include,
    });

    if (!service) {
      throw new NotFoundException(`Ordem de serviço não encontrada`);
    }

    return service;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      return this.prisma.order.update({
        where: { id },
        data: { ...updateOrderDto },
      });
    } catch (error) {
      return new NotFoundException("Ordem de serviço não encontrada");
    }
  }

  async remove(id: string, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      return new UnauthorizedException(
        "Apenas administradores podem remover filiais"
      );
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
