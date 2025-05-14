import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateVehicleDto {
  @ApiProperty({ example: 'MNO5P12' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ example: 'Yamaha' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Fazer' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2023 })
  @IsNotEmpty()
  modelYear: number;

  @ApiProperty({ example: 2022 })
  @IsNotEmpty()
  manufactureYear: number;

  @ApiProperty({ example: 'Preta' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: '12345678910' })
  @IsString()
  @IsNotEmpty()
  renavam: string;

  @ApiProperty({ example: '9BWZZZ377VT004251' })
  @IsString()
  @IsNotEmpty()
  chassis: string;

  @ApiProperty({ example: 'active' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 100 })
  mileageStart: number;

  @ApiProperty({ example: 1500 })
  mileageCurrent: number;

  @ApiProperty({ example: 'uuid-da-empresa' })
  companyId: string;

  @ApiProperty({ example: 1 })
  branchId: number;

  @ApiProperty({ required: false, example: 'uuid-do-motorista' })
  driverId?: string;
}