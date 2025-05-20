import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateCompanyDto {
  @ApiProperty({ example: 'ACME Corp', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '12.345.678/0001-90', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  assetCount?: number;
}