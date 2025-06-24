import { IsOptional, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CompanyQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Branches",
  })
  branches?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Vehicles",
  })
  vehicles?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Users",
  })
  users?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Orders",
  })
  orders?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Workshops",
  })
  workshops?: boolean;
}
