import { Inject, Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { TENANT_PRISMA_CLIENT } from "../prisma-tenancy/prisma-tenancy.constants";
import { ExtendedTenantClient } from "../prisma-tenancy/prisma-tenancy.provider";
import { CompanyQueryDto } from "./dto/company-query.dto";
import { getCompanyInclude } from "src/utils/includes/company.includes";

@Injectable()
export class CompanyService {
  constructor(
    @Inject(TENANT_PRISMA_CLIENT) private readonly prisma: ExtendedTenantClient
  ) {}
  create(createCompanyDto: CreateCompanyDto) {
    return "This action adds a new company";
  }

  findAll(query) {
    const include = getCompanyInclude(query);

    return this.prisma.branch.findMany({
      include,
    });
  }

  findOne({ id, query }: { id: string; query: CompanyQueryDto }) {
    const include = getCompanyInclude(query);

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
