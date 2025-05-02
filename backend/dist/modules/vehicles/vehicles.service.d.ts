import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class VehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        plate: string;
        model: string;
        brand: string;
        year: string;
        color: string;
        chassi: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        enterpriseId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        plate: string;
        model: string;
        brand: string;
        year: string;
        color: string;
        chassi: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        enterpriseId: string;
    }>;
    create(createVehicleDto: CreateVehicleDto): Promise<{
        id: string;
        plate: string;
        model: string;
        brand: string;
        year: string;
        color: string;
        chassi: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        enterpriseId: string;
    }>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<{
        id: string;
        plate: string;
        model: string;
        brand: string;
        year: string;
        color: string;
        chassi: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        enterpriseId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
