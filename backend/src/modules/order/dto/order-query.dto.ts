import { IsOptional, IsString, IsBoolean } from "class-validator";
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
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiPropertyOptional({
    type: Boolean,
    description: "Incluir relacionamento com OrderItems",
  })
  orderItems?: boolean;

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
      "Incluir relacionamento com Vehicle e seus sub-relacionamentos (ex: 'driver,mileageHistory')",
  })
  vehicle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description:
      "Incluir relacionamento com Workshop e seus sub-relacionamentos (ex: 'manager')",
  })
  workshop?: string;
}
