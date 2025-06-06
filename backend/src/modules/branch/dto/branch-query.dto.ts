import {
  IsArray,
  IsOptional,
  IsString,
  IsIn,
  ArrayNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class BranchQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(["vehicles", "workshops", "users", "company", "orders"], { each: true })
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: [String],
    description:
      "List of relationships to include (vehicle, workshops, users, company, orders)",
  })
  @Transform(
    ({ value }) => value.split(",").map((v: string) => v.toLowerCase()),
    { toClassOnly: true }
  )
  include?: string[];
}
