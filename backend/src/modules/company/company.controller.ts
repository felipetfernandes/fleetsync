import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyQueryDto } from "./dto/company-query.dto";

@ApiTags("company")
@UseGuards(JwtAuthGuard, TenantClsGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @ApiOperation({ summary: "Listar todos as companhias" })
  @ApiResponse({ status: 200, description: "Companhias listadas com sucesso" })
  @Get()
  findAll(@Query() includes: BranchQueryDto) {
    return this.companyService.findAll(includes);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() includes: BranchQueryDto) {
    return this.companyService.findOne(+id, includes);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
