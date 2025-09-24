import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { getOrderInclude } from "src/utils/includes/order.includes";
import { OrderQueryDto } from "./dto/order-query.dto";
import { UserRole, Prisma } from "@prisma/client";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}

  async create(createOrderDto: CreateOrderDto, companyId: string) {
    const { vehicleId, workshopId, branchId, items, ...orderData } =
      createOrderDto;

    // Verificar se o veículo existe
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${vehicleId} não encontrado`);
    }

    // Verificar se a oficina existe
    const workshop = await this.prisma.workshop.findFirst({
      where: { id: workshopId },
    });
    if (!workshop) {
      throw new NotFoundException(
        `Oficina com ID ${workshopId} não encontrada`
      );
    }

    // Verificar se a empresa existe
    const enterprise = await this.prisma.company.findFirst({
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
        orderItems: true,
      },
    });

    if (items && items.length > 0) {
      await this.prisma.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          description: item.description,
          cost: item.cost,
          laborCost: item.laborCost,
          totalCost: item.totalCost,
        })),
      });

      // Retornar a ordem com os items incluídos
      return this.prisma.order.findUnique({
        where: { id: order.id },
        include: {
          vehicle: true,
          workshop: true,
          company: true,
          branch: true,
          orderItems: true,
        },
      });
    }

    return order;
  }

  async findAll(query: OrderQueryDto) {
    const include = getOrderInclude(query);
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

    // Criar um include que sempre tenha vehicle e workshop
    const defaultInclude: Prisma.OrderInclude = {
      vehicle: true,
      workshop: true,
      ...include,
    };

    return this.prisma.order.findMany({
      where,
      include: defaultInclude,
    });
  }

  async findOne({ id, query }: { id: string; query: OrderQueryDto }) {
    const include = getOrderInclude(query);

    // Criar um include que sempre tenha vehicle e workshop
    const defaultInclude: Prisma.OrderInclude = {
      vehicle: true,
      workshop: true,
      ...include,
    };

    const service = await this.prisma.order.findFirst({
      where: { id },
      include: defaultInclude,
    });

    if (!service) {
      throw new NotFoundException(`Ordem de serviço não encontrada`);
    }

    return service;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      this.logger.log('=== UPDATE ORDER SERVICE ===');
      this.logger.log(`Order ID: ${id}`);
      this.logger.log(`Update DTO: ${JSON.stringify(updateOrderDto)}`);

      // Verificar se a ordem existe
      this.logger.log('Checking if order exists...');
      const existingOrder = await this.prisma.order.findFirst({
        where: { id },
      });

      if (!existingOrder) {
        this.logger.error(`Order ${id} not found`);
        throw new NotFoundException("Ordem de serviço não encontrada");
      }

      this.logger.log(`Existing order found: ${existingOrder.id}`);

      // Processar dados de atualização
      const dataToUpdate: any = { ...updateOrderDto };

      this.logger.log('Processing update data...');

      // Se está atualizando para COMPLETED, adicionar a data de finalização
      if (updateOrderDto.status === 'COMPLETED' && !updateOrderDto.endDate) {
        dataToUpdate.endDate = new Date();
        this.logger.log('Adding endDate for COMPLETED status');
      }

      // Converter datas se necessário
      if (dataToUpdate.startDate) {
        dataToUpdate.startDate = new Date(dataToUpdate.startDate);
        this.logger.log(`Converting startDate: ${dataToUpdate.startDate}`);
      }
      
      if (dataToUpdate.endDate) {
        dataToUpdate.endDate = new Date(dataToUpdate.endDate);
        this.logger.log(`Converting endDate: ${dataToUpdate.endDate}`);
      }

      this.logger.log(`Final data to update: ${JSON.stringify(dataToUpdate)}`);

      // Executar update usando updateMany para contornar o problema de tenancy
      this.logger.log('Executing database update...');
      const updateResult = await this.prisma.order.updateMany({
        where: { id },
        data: dataToUpdate,
      });

      if (updateResult.count === 0) {
        throw new NotFoundException("Ordem de serviço não encontrada ou não foi possível atualizar");
      }

      this.logger.log('Update successful, fetching updated order...');

      // Buscar a ordem atualizada com todos os relacionamentos
      const updatedOrder = await this.prisma.order.findFirst({
        where: { id },
        include: {
          vehicle: true,
          workshop: true,
          company: true,
          branch: true,
          orderItems: true,
        },
      });

      this.logger.log(`Update completed for order ${id}`);
      return updatedOrder;

    } catch (error) {
      this.logger.error(`Error in update service for order ${id}:`, error.stack);
      
      // Log específico para erros do Prisma
      if (error.code) {
        this.logger.error(`Prisma error code: ${error.code}`);
        this.logger.error(`Prisma error message: ${error.message}`);
      }
      
      throw error;
    }
  }

  async remove(id: string, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        "Apenas administradores podem remover ordens de serviço"
      );
    }

    // Verificar se a ordem existe antes de tentar deletar
    const existingOrder = await this.prisma.order.findFirst({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada");
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}