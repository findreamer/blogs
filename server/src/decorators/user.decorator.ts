import { ExecutionContext, createParamDecorator } from '@nestjs/common'

/** 获取用户信息参数装饰器 */
export const User = createParamDecorator((key: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  if (!key) {
    return request.user
  }
  return request.user ? request.user[key] : null
})