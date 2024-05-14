import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
// Reflector是一个帮助类，用于提取并获取元数据
import { Reflector } from '@nestjs/core';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    // 是否不需要登陆
    const noAuth = this.reflector.get<boolean>('noAuth', context.getHandler())

    // 首先判断一下这个接口需不需要登录态，如果不需要，直接放行；如果需要且当前登录态还没过期，则放行；否则抛出一个未登录的401异常。
    if (noAuth) {
      return true
    } else {
      const isExpire = request.user && request.user.exp < Date.now()

      if (!request.user || isExpire) {
        throw new UnauthorizedException('未登录');
      }

      return true
    }
  }
}