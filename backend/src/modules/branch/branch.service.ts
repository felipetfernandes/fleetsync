import { Inject, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { TENANT_PRISMA_CLIENT } from '../prisma-tenancy/prisma-tenancy.constants';
import { ExtendedTenantClient } from '../prisma-tenancy/prisma-tenancy.provider';
import { BranchQueryDto } from './dto/branch-query.dto';

@Injectable()
export class BranchService {
  constructor(@Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient) { }
  
  create(createBranchDto: CreateBranchDto) {
    return this.prisma.branch.create({ data: createBranchDto });
  }

  async findAll(query: BranchQueryDto) {
    return this.prisma.branch.findMany({
      include: {
        vehicles: query.vehicles === 'true',
        workshops: query.workshops === 'true',
        users: query.users === 'true',
        company: query.company === 'true',
        Order: query.orders === 'true'
      }
    });
  }

  async findOne(id: number, query: BranchQueryDto) {
    return this.prisma.branch.findFirst({
      where: { id },
      include: {
        vehicles: query.vehicles === 'true',
        workshops: query.workshops === 'true',
        users: query.users === 'true',
        company: query.company === 'true',
        Order: query.orders === 'true'
      }
    })
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return this.prisma.branch.update({
      where: { id },
      data: {...updateBranchDto}
    })
  }

  remove(id: number) {
    return this.prisma.branch.delete({ where: { id } });
  }
}
