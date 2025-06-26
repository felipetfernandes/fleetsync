import { IsOptional, IsBoolean, IsString } from "class-validator";
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
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description:
      "Incluir relacionamento com Vehicles e seus sub-relacionamentos (ex: 'driver,mileageHistory')",
  })
  vehicles?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamentos com Users",
  })
  users?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Orders e seus sub-relacionamentos (ex: 'orderItems,vehicle')" })
  orders?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Workshops e seus sub-relacionamentos (ex: 'orders')" })
  workshops?: string;
}
