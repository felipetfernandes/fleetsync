import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.['access_token']; // nome do cookie com JWT
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || 'sua-chave-secreta',
    });
  }

  async validate(payload: any) {
    return payload; // será atribuído ao `req.user` ou `req.account` no guard
  }
}
