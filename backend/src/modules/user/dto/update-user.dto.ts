import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  IsNumber,
  IsPhoneNumber,
  IsUUID,
} from "class-validator";
import { UserRole } from "../interfaces/user.interface";

export class UpdateUserDto {
  @ApiProperty({ example: "João da Silva", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "joao@email.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "(11) 99999-9999", required: false })
  @IsOptional()
  @IsPhoneNumber("BR", {
    message: "Telefone deve estar no formato brasileiro válido"
  })
  phone?: string;

  @ApiProperty({ example: "senhaSegura123", required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: "DRIVER", enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: keyof typeof UserRole;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  branchId?: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", required: false })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiProperty({ example: "12345678900", required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ example: "B", required: false })
  @IsOptional()
  @IsString()
  licenseCategory?: string;

  @ApiProperty({ example: "2026-12-31T00:00:00.000Z", required: false })
  @IsOptional()
  @IsDateString()
  licenseExpiration?: Date;
}