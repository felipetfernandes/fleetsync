import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
} from "class-validator";
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
  @IsArray()
  @IsString({ each: true })
  @IsIn(["company", "branch", "manager", "orders"], { each: true })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description: "Relacionamentos a incluir: company, branch, manager, orders",
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
