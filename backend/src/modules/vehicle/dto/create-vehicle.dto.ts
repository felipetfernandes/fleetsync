import { IsString, IsInt, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  plate: string;

  @ApiProperty()
  @IsInt()
  branchId: number;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsInt()
  modelYear: number;

  @ApiProperty()
  @IsInt()
  manufactureYear: number;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsString()
  renavam: string;

  @ApiProperty()
  @IsString()
  chassis: string;

  @ApiProperty({ enum: VehicleStatus })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @ApiProperty()
  @IsInt()
  mileageStart: number;

  // Campos opcionais
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  purchaseType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  mileageCurrent?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  driverId?: string;
}
