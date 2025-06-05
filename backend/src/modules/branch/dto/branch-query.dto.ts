import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BranchQueryDto {
  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ type: String, description: 'Incluir veículos relacionados' })
  vehicles?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ type: String, description: 'Incluir oficinas relacionadas' })
  workshops?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ type: String, description: 'Incluir usuários relacionados' })
  users?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ type: String, description: 'Incluir a empresa relacionada' })
  company?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ type: String, description: 'Incluir ordens relacionadas' })
  orders?: string;
}
