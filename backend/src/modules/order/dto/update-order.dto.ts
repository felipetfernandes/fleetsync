import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsNumber, IsString } from "class-validator";
import { OrderStatus, OrderType } from "@prisma/client";

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: "PREVENTIVE", enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @ApiPropertyOptional({ example: "COMPLETED", enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: "Troca de óleo e filtros" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "2025-05-01T09:00:00Z" })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: "2025-05-03T17:00:00Z" })
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ example: 1200.5 })
  @IsOptional()
  @IsNumber()
  totalCost?: number;

}