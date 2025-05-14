import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMileageHistoryDto {
  @ApiProperty({ example: 123456 })
  @IsNotEmpty()
  mileage: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  month: number;

  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 'uuid-do-veiculo' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;
}