import { Controller, Post, UseGuards, Request, Res, HttpCode } from "@nestjs/common"
import { Response } from "express"
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { LoginDto } from "./dto/login.dto"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Autenticar usuário" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Usuário autenticado com sucesso" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async login(@Request() req, @Res({ passthrough: true }) res: Response): Promise<any> {
    const loginResult = await this.authService.login(req.user)

    // Enviando o token como cookie
    res.cookie("token", loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS em produção
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    })

    // Retornando apenas dados do usuário (sem o token)
    return loginResult.user
  }
}
