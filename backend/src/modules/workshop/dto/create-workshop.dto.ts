import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from "class-validator"

export class CreateWorkshopDto {
  @ApiProperty({ example: "Oficina São José" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "12345678000190" })
  @IsString()
  @IsNotEmpty()
  cnpj: string

  @ApiProperty({ example: "Rua das Oficinas, 1000" })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ example: "+5511999999999" })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiProperty({ example: "oficina@email.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ 
    example: "uuid-da-empresa", 
    required: false,
    description: "ID da empresa. Se não fornecido, usa a primeira empresa disponível"
  })
  @IsOptional()
  @IsUUID()
  companyId?: string

  @ApiProperty({ 
    example: 1, 
    required: false,
    description: "ID da filial. Se não fornecido, usa a primeira filial da empresa"
  })
  @IsOptional()
  @IsNumber()
  branchId?: number

  @ApiProperty({ 
    example: "uuid-do-gerente", 
    required: false,
    description: "ID do usuário gerente existente para vincular à oficina"
  })
  @IsOptional()
  @IsUUID()
  managerId?: string
}