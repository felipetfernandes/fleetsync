import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
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
  @IsArray()
  @IsString({ each: true })
  @IsIn(["company", "branch", "vehicle", "workshop"], {
    each: true,
  })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description:
      "Relacionamentos a incluir: company, branch, vehicle, workshop",
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
