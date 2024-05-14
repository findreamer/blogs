import { SetMetadata } from '@nestjs/common'
//  SetMetadata ，它会为被这个装饰器修饰的类或方法加上一个 noAuth 属性
export const NoAuth = () => SetMetadata('noAuth', true)