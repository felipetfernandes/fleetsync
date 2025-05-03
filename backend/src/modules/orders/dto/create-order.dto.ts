import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsUUID } from "class-validator"
import { Type } from "class-transformer"

export class CreateOrderDto {
  @ApiProperty({ example: "uuid-do-veiculo" })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string

  @ApiProperty({ example: "uuid-da-oficina" })
  @IsUUID()
  @IsNotEmpty()
  workshopId: string

  @ApiProperty({ example: "uuid-da-empresa" })
  @IsUUID()
  @IsNotEmpty()
  enterpriseId: string

  @ApiProperty({ example: "Troca de óleo e filtros" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: "Manutenção Preventiva" })
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty({ example: 450.0 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number

  @ApiProperty({ example: "2023-04-15T10:00:00Z" })
  @IsDateString()
  @IsNotEmpty()
  serviceDate: Date

  @ApiProperty({ example: "Agendado", required: false })
  @IsString()
  @IsOptional()
  status?: string
}
