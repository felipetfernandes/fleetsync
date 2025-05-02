import { VehiclesService } from "./vehicles.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto): Promise<void>;
    findAll(): Promise<void>;
    findOne(id: string): Promise<void>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<void>;
    remove(id: string): Promise<void>;
}
