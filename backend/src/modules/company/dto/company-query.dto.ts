import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CompanyQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(["branches", "vehicles", "users", "orders", "workshops"], {
    each: true,
  })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description:
      "Relacionamentos a incluir: branches, vehicles, users, orders, workshops",
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
