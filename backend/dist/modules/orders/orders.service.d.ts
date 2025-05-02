import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class OrderService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<void>;
    findAll(): Promise<void>;
    findOne(id: string): Promise<void>;
    update(id: string, updateServiceDto: UpdateOrderDto): Promise<void>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
