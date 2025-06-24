import { IsOptional, IsString, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class WorkshopQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "Id da filial",
  })
  branchId?: string;

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
      "Incluir relacionamento com Manager e seus sub-relacionamentos (ex: 'branch,company')",
  })
  manager?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamento com Orders",
  })
  orders?: boolean;
}
