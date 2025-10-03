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
    try {
      this.logger.log("=== CREATE ORDER SERVICE ===")
      this.logger.log(`Company ID: ${companyId}`)
      this.logger.log(`Create DTO: ${JSON.stringify(createOrderDto, null, 2)}`)

      const { vehicleId, workshopId, branchId, items, ...orderData } = createOrderDto

      // Verificar se o veículo existe
      this.logger.log(`Checking if vehicle exists: ${vehicleId}`)
      const vehicle = await this.prisma.vehicle.findFirst({
        where: { id: vehicleId },
      })
      if (!vehicle) {
        this.logger.error(`Vehicle ${vehicleId} not found`)
        throw new NotFoundException(`Veículo com ID ${vehicleId} não encontrado`)
      }
      this.logger.log(`Vehicle found: ${vehicle.plate}`)

      // Verificar se a oficina existe
      this.logger.log(`Checking if workshop exists: ${workshopId}`)
      const workshop = await this.prisma.workshop.findFirst({
        where: { id: workshopId },
      })
      if (!workshop) {
        this.logger.error(`Workshop ${workshopId} not found`)
        throw new NotFoundException(`Oficina com ID ${workshopId} não encontrada`)
      }
      this.logger.log(`Workshop found: ${workshop.name}`)

      // Verificar se a empresa existe
      this.logger.log(`Checking if company exists: ${companyId}`)
      const enterprise = await this.prisma.company.findFirst({
        where: { id: companyId },
      })
      if (!enterprise) {
        this.logger.error(`Company ${companyId} not found`)
        throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`)
      }
      this.logger.log(`Company found: ${enterprise.name}`)

      // Verificar se a filial existe
      this.logger.log(`Checking if branch exists: ${branchId}`)
      const branch = await this.prisma.branch.findFirst({
        where: { id: Number(branchId) },
      })
      if (!branch) {
        this.logger.error(`Branch ${branchId} not found`)
        throw new NotFoundException(`Filial com ID ${branchId} não encontrada`)
      }
      this.logger.log(`Branch found: ${branch.name}`)

      // Criar ordem de serviço
      this.logger.log("Creating order...")
      this.logger.log(`Order data: ${JSON.stringify(orderData, null, 2)}`)

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
      })

      this.logger.log(`Order created successfully: ${order.id}`)

      if (items && items.length > 0) {
        this.logger.log(`Creating ${items.length} order items...`)
        this.logger.log(`Items data: ${JSON.stringify(items, null, 2)}`)

        await this.prisma.orderItem.createMany({
          data: items.map((item) => ({
            orderId: order.id,
            description: item.description,
            cost: item.cost,
            laborCost: item.laborCost,
            totalCost: item.totalCost,
          })),
        })

        this.logger.log("Order items created successfully")

        // Retornar a ordem com os items incluídos
        const finalOrder = await this.prisma.order.findFirst({
          where: { id: order.id },
          include: {
            vehicle: true,
            workshop: true,
            company: true,
            branch: true,
            orderItems: true,
          },
        })

        this.logger.log("Order creation completed successfully")
        return finalOrder
      }

      this.logger.log("Order creation completed successfully (no items)")
      return order
    } catch (error) {
      this.logger.error("=== ERROR IN CREATE ORDER ===")
      this.logger.error(`Error message: ${error.message}`)
      this.logger.error(`Error stack: ${error.stack}`)

      // Log específico para erros do Prisma
      if (error.code) {
        this.logger.error(`Prisma error code: ${error.code}`)
        this.logger.error(`Prisma error meta: ${JSON.stringify(error.meta)}`)
      }

      throw error
    }
  }

  async findAll(query: OrderQueryDto) {
    const include = getOrderInclude(query)
    const where: any = {}

    if (query.plate) {
      where.vehicle = { plate: query.plate }
    }

    if (query.workshopId) {
      where.workshop = { id: query.workshopId }
    }

    if (query.branchId) {
      where.branch = { id: Number(query.branchId) }
    }

    // Criar um include que sempre tenha vehicle e workshop
    const defaultInclude: Prisma.OrderInclude = {
      vehicle: true,
      workshop: true,
      ...include,
    }

    return this.prisma.order.findMany({
      where,
      include: defaultInclude,
    })
  }

  async findOne({ id, query }: { id: string; query: OrderQueryDto }) {
    const include = getOrderInclude(query)

    // Criar um include que sempre tenha vehicle e workshop
    const defaultInclude: Prisma.OrderInclude = {
      vehicle: true,
      workshop: true,
      ...include,
    }

    const service = await this.prisma.order.findFirst({
      where: { id },
      include: defaultInclude,
    })

    if (!service) {
      throw new NotFoundException(`Ordem de serviço não encontrada`)
    }

    return service
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      this.logger.log("=== UPDATE ORDER SERVICE ===")
      this.logger.log(`Order ID: ${id}`)
      this.logger.log(`Update DTO: ${JSON.stringify(updateOrderDto)}`)

      // Verificar se a ordem existe
      this.logger.log("Checking if order exists...")
      const existingOrder = await this.prisma.order.findFirst({
        where: { id },
      })

      if (!existingOrder) {
        this.logger.error(`Order ${id} not found`)
        throw new NotFoundException("Ordem de serviço não encontrada")
      }

      this.logger.log(`Existing order found: ${existingOrder.id}`)

      // Processar dados de atualização
      const dataToUpdate: any = { ...updateOrderDto }

      this.logger.log("Processing update data...")

      // Se está atualizando para COMPLETED, adicionar a data de finalização
      if (updateOrderDto.status === "COMPLETED" && !updateOrderDto.endDate) {
        dataToUpdate.endDate = new Date()
        this.logger.log("Adding endDate for COMPLETED status")
      }

      // Converter datas se necessário
      if (dataToUpdate.startDate) {
        dataToUpdate.startDate = new Date(dataToUpdate.startDate)
        this.logger.log(`Converting startDate: ${dataToUpdate.startDate}`)
      }

      if (dataToUpdate.endDate) {
        dataToUpdate.endDate = new Date(dataToUpdate.endDate)
        this.logger.log(`Converting endDate: ${dataToUpdate.endDate}`)
      }

      this.logger.log(`Final data to update: ${JSON.stringify(dataToUpdate)}`)

      // Executar update usando updateMany para contornar o problema de tenancy
      this.logger.log("Executing database update...")
      const updateResult = await this.prisma.order.updateMany({
        where: { id },
        data: dataToUpdate,
      })

      if (updateResult.count === 0) {
        throw new NotFoundException("Ordem de serviço não encontrada ou não foi possível atualizar")
      }

      this.logger.log("Update successful, fetching updated order...")

      if (updateOrderDto.status) {
        const vehicleId = existingOrder.vehicleId

        if (updateOrderDto.status === "COMPLETED" || updateOrderDto.status === "CANCELLED") {
          // Ordem finalizada ou cancelada - veículo volta para AVAILABLE
          this.logger.log(`Updating vehicle ${vehicleId} status to AVAILABLE (order ${updateOrderDto.status})`)
          await this.prisma.vehicle.updateMany({
            where: { id: vehicleId },
            data: { status: "AVAILABLE" },
          })
          this.logger.log(`Vehicle status updated to AVAILABLE`)
        } else if (updateOrderDto.status === "IN_PROGRESS") {
          // Ordem em progresso - veículo vai para MAINTENANCE
          this.logger.log(`Updating vehicle ${vehicleId} status to MAINTENANCE`)
          await this.prisma.vehicle.updateMany({
            where: { id: vehicleId },
            data: { status: "MAINTENANCE" },
          })
          this.logger.log(`Vehicle status updated to MAINTENANCE`)
        }
      }

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
      })

      this.logger.log(`Update completed for order ${id}`)
      return updatedOrder
    } catch (error) {
      this.logger.error(`Error in update service for order ${id}:`, error.stack)

      // Log específico para erros do Prisma
      if (error.code) {
        this.logger.error(`Prisma error code: ${error.code}`)
        this.logger.error(`Prisma error message: ${error.message}`)
      }

      throw error
    }
  }

  async remove(id: string, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException("Apenas administradores podem remover ordens de serviço")
    }

    // Verificar se a ordem existe antes de tentar deletar
    const existingOrder = await this.prisma.order.findFirst({
      where: { id },
    })

    if (!existingOrder) {
      throw new NotFoundException("Ordem de serviço não encontrada")
    }

    return this.prisma.order.delete({
      where: { id },
    })
  }
}