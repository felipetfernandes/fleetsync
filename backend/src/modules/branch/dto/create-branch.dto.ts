import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Filial Centro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'uuid-company-id' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}