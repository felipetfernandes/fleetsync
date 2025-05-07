import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsOptional } from "class-validator"

export class CreateVehicleDto {
  @ApiProperty({ example: "MNO5P12" })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ example: "Fazer" })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: "Yamaha" })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: "2021" })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ example: "Azul" })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: "9C6RG1710M0001234" })
  @IsString()
  @IsOptional()
  chassi: string;

  @ApiProperty({ example: "Ativo", required: false, default: "Ativo" })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: "<enterprise_id>"})
  @IsString()
  @IsNotEmpty()
  enterpriseId: string;
}
