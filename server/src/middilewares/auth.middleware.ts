import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import * as cookieParser from 'cookie-parser';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    // 读取cookie，并设置到req
    cookieParser()(req, res, () => { });

    const token = req.cookies['token']

    if (token) {
      // 解析token
      const decoded = await this.authService.decodeJwtToken(token)
      req['user'] = decoded
    }

    next()
  }
}