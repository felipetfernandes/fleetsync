import { IsBooleanString, IsOptional } from 'class-validator';

export class BranchQueryDto {
  @IsOptional()
  @IsBooleanString()
  vehicles?: string;

  @IsOptional()
  @IsBooleanString()
  workshops?: string;

  @IsOptional()
  @IsBooleanString()
  users?: string;

  @IsOptional()
  @IsBooleanString()
  company?: string;

  @IsOptional()
  @IsBooleanString()
  orders?: string;
}
