import {
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class BranchQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({ type: Boolean, description: "Incluir relacionamento com Company" })
  company?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Vehicles e seus sub-relacionamentos (ex: 'driver,mileageHistory')" })
  vehicles?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Orders e seus sub-relacionamentos (ex: 'orderItems,vehicle')" })
  orders?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({ type: Boolean, description: "Incluir relacionamento com Workshops" })
  workshops?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({ type: Boolean, description: "Incluir relacionamento com Users" })
  users?: boolean;
}
