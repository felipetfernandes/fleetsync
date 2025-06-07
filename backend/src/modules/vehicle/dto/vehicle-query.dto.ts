import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
} from "class-validator";
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
  @IsArray()
  @IsString({ each: true })
  @IsIn(["company", "branch", "driver", "orders", "mileagehistory"], {
    each: true,
  })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description:
      "Relacionamentos a incluir: company, branch, driver, orders, mileageHistory",
  })
  @Transform(
    ({ value }) =>
      typeof value === "string"
        ? value.split(",").map((v: string) => v.trim().toLowerCase())
        : value,
    { toClassOnly: true }
  )
  include?: string[];
}
