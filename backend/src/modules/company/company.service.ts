import { Inject, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { TENANT_PRISMA_CLIENT } from '../prisma-tenancy/prisma-tenancy.constants';
import { ExtendedTenantClient } from '../prisma-tenancy/prisma-tenancy.provider';

@Injectable()
export class CompanyService {
  constructor(@Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient) { }
  create(createCompanyDto: CreateCompanyDto) {
    return 'This action adds a new company';
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
