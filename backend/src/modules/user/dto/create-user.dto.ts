import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { UserRole } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+5511987654321' })
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'DRIVER', enum: UserRole })
  @IsEnum(UserRole)
  role: keyof typeof UserRole;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ example: '12345678900', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ example: 'B', required: false })
  @IsOptional()
  @IsString()
  licenseCategory?: string;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', required: false })
  @IsOptional()
  licenseExpiration?: Date;
}
