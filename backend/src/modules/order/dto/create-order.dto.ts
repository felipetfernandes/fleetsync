import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderType } from '../interfaces/order.interface';

export class CreateOrderDto {
  @ApiProperty({ example: 'PREVENTIVE', enum: OrderType })
  @IsEnum(OrderType)
  @IsNotEmpty()
  type: OrderType;

  @ApiProperty({ example: 'Troca de óleo e filtros' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2025-05-01T09:00:00Z' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2025-05-03T17:00:00Z', required: false })
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: 1200.50 })
  @IsNumber()
  @IsNotEmpty()
  totalCost: number;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  branchId: number;

  @ApiProperty({ example: 'uuid-do-veiculo' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: 'uuid-da-oficina' })
  @IsString()
  @IsNotEmpty()
  workshopId: string;
}