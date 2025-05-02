import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
