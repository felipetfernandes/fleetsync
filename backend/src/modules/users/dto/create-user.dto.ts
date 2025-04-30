import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ example: "usuario@exemplo.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "senha123" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: "João Silva" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "admin", enum: ["admin", "user"] })
  @IsString()
  @IsNotEmpty()
  @IsIn(["admin", "user"])
  role: string
}
