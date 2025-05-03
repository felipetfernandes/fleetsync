"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrderService = class OrderService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createOrderDto) {
        const { vehicleId, workshopId, enterpriseId, ...orderData } = createOrderDto;
        const vehicle = await this.prismaService.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Veículo com ID ${vehicleId} não encontrado`);
        }
        const workshop = await this.prismaService.workshop.findUnique({
            where: { id: workshopId },
        });
        if (!workshop) {
            throw new common_1.NotFoundException(`Oficina com ID ${workshopId} não encontrada`);
        }
        const enterprise = await this.prismaService.enterprise.findUnique({
            where: { id: enterpriseId },
        });
        if (!enterprise) {
            throw new common_1.NotFoundException(`Empresa com ID ${enterpriseId} não encontrada`);
        }
        return this.prismaService.order.create({
            data: {
                ...orderData,
                vehicle: { connect: { id: vehicleId } },
                workshop: { connect: { id: workshopId } },
                enterprise: { connect: { id: enterpriseId } },
            },
            include: {
                vehicle: true,
                workshop: true,
                enterprise: true,
            },
        });
    }
    async findAll() {
        return this.prismaService.order.findMany({
            include: { vehicle: true, workshop: true, enterprise: true },
        });
    }
    async findOne(id) {
        const service = await this.prismaService.order.findUnique({
            where: { id },
            include: { vehicle: true, workshop: true, enterprise: true },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Serviço com ID ${id} não encontrado`);
        }
        return service;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const { vehicleId, workshopId, enterpriseId, ...rest } = updateDto;
        const data = { ...rest };
        if (vehicleId) {
            const vehicle = await this.prismaService.vehicle.findUnique({ where: { id: vehicleId } });
            if (!vehicle)
                throw new common_1.NotFoundException(`Veículo com ID ${vehicleId} não encontrado`);
            data.vehicle = { connect: { id: vehicleId } };
        }
        if (workshopId) {
            const workshop = await this.prismaService.workshop.findUnique({ where: { id: workshopId } });
            if (!workshop)
                throw new common_1.NotFoundException(`Oficina com ID ${workshopId} não encontrada`);
            data.workshop = { connect: { id: workshopId } };
        }
        if (enterpriseId) {
            const enterprise = await this.prismaService.enterprise.findUnique({ where: { id: enterpriseId } });
            if (!enterprise)
                throw new common_1.NotFoundException(`Empresa com ID ${enterpriseId} não encontrada`);
            data.enterprise = { connect: { id: enterpriseId } };
        }
        return this.prismaService.order.update({
            where: { id },
            data,
            include: { vehicle: true, workshop: true, enterprise: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prismaService.order.delete({
            where: { id },
        });
        return { message: "Serviço removido com sucesso" };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=orders.service.js.map