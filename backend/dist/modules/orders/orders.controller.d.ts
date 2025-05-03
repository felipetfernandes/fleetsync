import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
export declare class OrderController {
    private readonly servicesService;
    constructor(servicesService: OrderService);
    create(createServiceDto: CreateOrderDto): Promise<{
        vehicle: {
            id: string;
            enterpriseId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            plate: string;
            chassi: string;
            model: string;
            brand: string;
            year: string;
            color: string;
        };
        workshop: {
            id: string;
            enterpriseId: string;
            cnpj: string;
            email: string;
            telephone: string;
            adress: string;
            name: string;
            password: string;
        };
        enterprise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cnpj: string;
            email: string;
            name: string;
            password: string;
            flat: string;
        };
    } & {
        id: string;
        vehicleId: string;
        workshopId: string;
        enterpriseId: string;
        description: string;
        type: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        serviceDate: Date;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        vehicle: {
            id: string;
            enterpriseId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            plate: string;
            chassi: string;
            model: string;
            brand: string;
            year: string;
            color: string;
        };
        workshop: {
            id: string;
            enterpriseId: string;
            cnpj: string;
            email: string;
            telephone: string;
            adress: string;
            name: string;
            password: string;
        };
        enterprise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cnpj: string;
            email: string;
            name: string;
            password: string;
            flat: string;
        };
    } & {
        id: string;
        vehicleId: string;
        workshopId: string;
        enterpriseId: string;
        description: string;
        type: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        serviceDate: Date;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        vehicle: {
            id: string;
            enterpriseId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            plate: string;
            chassi: string;
            model: string;
            brand: string;
            year: string;
            color: string;
        };
        workshop: {
            id: string;
            enterpriseId: string;
            cnpj: string;
            email: string;
            telephone: string;
            adress: string;
            name: string;
            password: string;
        };
        enterprise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cnpj: string;
            email: string;
            name: string;
            password: string;
            flat: string;
        };
    } & {
        id: string;
        vehicleId: string;
        workshopId: string;
        enterpriseId: string;
        description: string;
        type: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        serviceDate: Date;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateServiceDto: UpdateOrderDto): Promise<{
        vehicle: {
            id: string;
            enterpriseId: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            plate: string;
            chassi: string;
            model: string;
            brand: string;
            year: string;
            color: string;
        };
        workshop: {
            id: string;
            enterpriseId: string;
            cnpj: string;
            email: string;
            telephone: string;
            adress: string;
            name: string;
            password: string;
        };
        enterprise: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cnpj: string;
            email: string;
            name: string;
            password: string;
            flat: string;
        };
    } & {
        id: string;
        vehicleId: string;
        workshopId: string;
        enterpriseId: string;
        description: string;
        type: string;
        cost: import("@prisma/client/runtime/library").Decimal;
        serviceDate: Date;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
