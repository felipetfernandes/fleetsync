import {
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  Body,
  Get,
  Req,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(204)
  @ApiOperation({ summary: "Autenticar usuário" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 204, description: "Usuário autenticado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const loginResult = await this.authService.login(loginDto);

    res.cookie("access_token", loginResult.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(200)
  @ApiOperation({ summary: "Meus dados" })
  @ApiResponse({
    status: 200,
    description: "Informaões do usuário autenticado",
  })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async me(@Req() req): Promise<any> {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @HttpCode(200)
  @ApiOperation({ summary: "Logout do sistema" })
  @ApiResponse({
    status: 200,
    description: "Usuário deslogado com sucesso",
  })
  async logout(@Res({ passthrough: true }) res): Promise<any> {
    res.clearCookie('access_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return { message: 'Logout realizado com sucesso' };
  }
}
