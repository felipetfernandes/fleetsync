import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'Troca de óleo' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @IsNotEmpty()
  laborCost: number;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @IsNotEmpty()
  totalCost: number;
}
