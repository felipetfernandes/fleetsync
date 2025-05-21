import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateWorkshopDto {
  @ApiProperty({ example: 'Oficina São José' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12345678000190' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ example: 'Rua das Oficinas, 1000' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'oficina@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;  // <-- obrigatório para relacionar empresa

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ example: 'uuid-do-gerente', required: false })
  @IsOptional()
  @IsUUID()
  managerId?: string;
}
