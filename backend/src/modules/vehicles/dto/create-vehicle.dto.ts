import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateVehicleDto {
  @ApiProperty({ example: "ABC1234" })
  @IsString()
  @IsNotEmpty()
  plate: string

  @ApiProperty({ example: "Hilux" })
  @IsString()
  @IsNotEmpty()
  model: string

  @ApiProperty({ example: "Toyota" })
  @IsString()
  @IsNotEmpty()
  brand: string

  @ApiProperty({ example: "2022" })
  @IsString()
  @IsNotEmpty()
  year: string

  @ApiProperty({ example: "Prata" })
  @IsString()
  @IsNotEmpty()
  color: string

  @ApiProperty({ example: "9BWHE21JX24060960", required: false })
  @IsString()
  @IsOptional()
  chassi?: string

  @ApiProperty({ example: "Ativo", required: false })
  @IsString()
  @IsOptional()
  status?: string
}
