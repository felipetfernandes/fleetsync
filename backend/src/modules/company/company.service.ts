import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { TENANT_PRISMA_CLIENT } from '../prisma-tenancy/prisma-tenancy.constants';
import { ExtendedTenantClient } from '../prisma-tenancy/prisma-tenancy.provider';
import { CompanyQueryDto } from "./dto/company-query.dto";
import { companyAvailableIncludes } from "src/utils/includes/company.includes";

@Injectable()
export class CompanyService {
  constructor(@Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient) { }
  create(createCompanyDto: CreateCompanyDto) {
    return 'This action adds a new company';
  }

  findAll(include) {
    const include = buildPrismaInclude(
      query.include || [],
      companyAvailableIncludes
    );

    return this.prisma.branch.findMany({
      include,
    });
  }

  findOne({id, include} as {id: string, include: CompanyQueryDto}) {
  const include = buildPrismaInclude(
      query.include || [],
      companyAvailableIncludes
    );
  
    return this.prisma.company.findFirst({
      where: { id },
      include,
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
