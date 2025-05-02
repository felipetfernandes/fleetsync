import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class VehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createVehicleDto: CreateVehicleDto): Promise<void>;
    findAll(): Promise<void>;
    findOne(id: string): Promise<void>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<void>;
    remove(id: string): Promise<void>;
}
