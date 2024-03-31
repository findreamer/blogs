/**
 * 全局数据验证器
 */

import { HttpException, HttpStatus, ValidationPipe} from '@nestjs/common'

export class GlobalValidationPips extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            },
            exceptionFactory: (errors) => {
                let message = []
                errors.forEach(error => {
                    const constraints = error.constraints || {}
                    message.push(...Object.values(constraints))
                })
                return new HttpException(message.join(';'), HttpStatus.BAD_REQUEST)
            }
        })
    }
}