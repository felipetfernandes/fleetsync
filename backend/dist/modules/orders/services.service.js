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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ServicesService = class ServicesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createServiceDto) {
        const vehicle = await this.prismaService.vehicles.findUnique({
            where: { id: createServiceDto.vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Veículo com ID ${createServiceDto.vehicleId} não encontrado`);
        }
        return this.prismaService.services_order.create({
            data: createServiceDto,
            include: { vehicle: true },
        });
    }
    async findAll() {
        return this.prismaService.services_order.findMany({
            include: { vehicle: true },
        });
    }
    async findOne(id) {
        const service = await this.prismaService.services_order.findUnique({
            where: { id },
            include: { vehicle: true },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Serviço com ID ${id} não encontrado`);
        }
        return service;
    }
    async update(id, updateServiceDto) {
        await this.findOne(id);
        if (updateServiceDto.vehicleId) {
            const vehicle = await this.prismaService.vehicle.findUnique({
                where: { id: updateServiceDto.vehicleId },
            });
            if (!vehicle) {
                throw new common_1.NotFoundException(`Veículo com ID ${updateServiceDto.vehicleId} não encontrado`);
            }
        }
        return this.prismaService.service.update({
            where: { id },
            data: updateServiceDto,
            include: { vehicle: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prismaService.service.delete({
            where: { id },
        });
        return { message: "Serviço removido com sucesso" };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map