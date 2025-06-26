import { IsOptional, IsString, IsIn, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { VehicleStatus } from "@prisma/client";

export class VehicleQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "Id da filial",
  })
  branchId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "Status do veiculo (AVAILABLE, UNAVAILABLE, MAINTENANCE)",
  })
  @IsIn(Object.values(VehicleStatus), {
    each: true,
  })
  @Transform(({ value }) => value.toUpperCase())
  status?: VehicleStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamento com Company",
  })
  company?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamento com Branch",
  })
  branch?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description:
      "Incluir relacionamento com Driver e seus sub-relacionamentos (ex: 'branch,company')",
  })
  driver?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description:
      "Incluir relacionamento com Orders e seus sub-relacionamentos (ex: 'branch,company,workshop,orderItems')",
  })
  orders?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamento com MileageHistory",
  })
  mileageHistory?: boolean;
}
