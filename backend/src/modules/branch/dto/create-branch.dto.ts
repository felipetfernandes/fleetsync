import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Filial SP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}