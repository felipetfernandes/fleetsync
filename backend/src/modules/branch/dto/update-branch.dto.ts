import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBranchDto {
  @ApiProperty({ example: 'Filial Centro', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'São Paulo', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'uuid-company-id', required: false })
  @IsOptional()
  @IsString()
  companyId?: string;
}