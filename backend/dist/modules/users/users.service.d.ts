import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<void>;
    findAll(): Promise<{
        name: string;
        email: string;
        role: string;
        id: string;
        enterpriseId: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        email: string;
        role: string;
        id: string;
        enterpriseId: string;
    }>;
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        password: string;
        role: string;
        id: string;
        enterpriseId: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        role: string;
        id: string;
        enterpriseId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
