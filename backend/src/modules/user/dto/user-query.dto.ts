import {
  IsOptional,
  IsString,
  IsIn,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: "Id da filial",
  })
  branchId?: string;

  @IsOptional()
  @IsIn(Object.values(UserRole), {
    each: true,
  })
  @ApiPropertyOptional({
    type: String,
    description:
      "Função do usuário (DRIVER, ADMIN, WORKSHOP_MANAGER, BRANCH_MANAGER)",
  })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({ type: Boolean, description: "Incluir relacionamento com Branch" })
  branch?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiPropertyOptional({ type: Boolean, description: "Incluir relacionamento com Company" })
  company?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Vehicle e seus sub-relacionamentos (ex: 'mileageHistory')" })
  vehicle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "Incluir relacionamento com Workshop e seus sub-relacionamentos (ex: 'manager')" })
  workshop?: string;
}
