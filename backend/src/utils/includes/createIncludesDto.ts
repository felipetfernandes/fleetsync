import { IsArray, IsIn, IsOptional, ArrayUnique } from "class-validator";
import { Transform } from "class-transformer";

export function createIncludesDto(availableIncludes: string[]) {
  class IncludesDto {
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsIn(availableIncludes, { each: true })
    @Transform(({ value }) => {
      if (typeof value === "string") {
        return value.split(",").map((v) => v.trim());
      }
      return value;
    })
    include?: string[];
  }
  return IncludesDto;
}
