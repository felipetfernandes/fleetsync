import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class OrderQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
      type: String,
      description: "Placa do veiculo",
    })
  plate?: string;

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
      description: "Id da oficina",
    })
  workshopId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(["company", "branch", "vehicle", "workshop", "items"], { each: true })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description:
      "Relacionamentos a incluir: company, branch, vehicle, workshop, items",
  })
  @Transform(
    ({ value }) => value.split(",").map((v: string) => v.toLowerCase()),
    { toClassOnly: true }
  )
  include?: string[];
}
