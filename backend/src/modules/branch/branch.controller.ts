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
import { BranchService } from "./branch.service";
import { CreateBranchBodyDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantClsGuard } from "../auth/guards/tenant-cls.guard";
import { BranchQueryDto } from "./dto/branch-query.dto";

@ApiTags("branchs")
@Controller("branchs")
@UseGuards(JwtAuthGuard, TenantClsGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() createBranchBodyDto: CreateBranchBodyDto, @Req() req) {
    if (req.user.role === 'ADMIN') {
      const createBranchDto = {...createBranchBodyDto, companyId: req.user.companyId};
      return this.branchService.create(createBranchDto);
    }
  }

  @Get()
  @ApiOperation({ summary: "Listar todos as Filiais" })
  findAll(@Query() query: BranchQueryDto) {
    return this.branchService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Query() query: BranchQueryDto) {
    return this.branchService.findOne(+id, query);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.branchService.remove(+id);
  }
}
