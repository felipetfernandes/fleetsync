import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  HttpCode,
  Body,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Autenticar usuário" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Usuário autenticado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const loginResult = await this.authService.login(loginDto);

    // Enviando o token como cookie
    res.cookie("access_token", loginResult.access_token, {
      httpOnly: false,
      secure: true, // HTTPS em produção
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });

    // Retornando apenas dados do usuário (sem o token)
    return loginResult;
  }
}
