import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
export declare class OrderController {
    private readonly servicesService;
    constructor(servicesService: OrderService);
    create(createServiceDto: CreateOrderDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateServiceDto: UpdateOrderDto): any;
    remove(id: string): any;
}
