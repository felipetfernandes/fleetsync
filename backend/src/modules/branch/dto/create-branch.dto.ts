import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchBodyDto {
  @ApiProperty({ example: 'Filial Centro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;
}

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