import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class ServicesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(createServiceDto: CreateServiceDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
