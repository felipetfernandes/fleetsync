import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from "@nestjs/common";
import { WorkshopService } from "./workshop.service";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { UpdateWorkshopDto } from "./dto/update-workshop.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("workshops")
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Post()
  create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopService.create(createWorkshopDto);
  }

  @Get()
  findAll(@Req() req, @Query('branchId') branchId?: string) {
    const { companyId } = req.user;
    if (!branchId) return this.workshopService.findAll(companyId);

    return this.workshopService.findAllByBranch({branchId: Number(branchId), companyId});
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.workshopService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto
  ) {
    return this.workshopService.update(+id, updateWorkshopDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workshopService.remove(+id);
  }
}
