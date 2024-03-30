import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags, ApiParam } from '@nestjs/swagger'


@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }


    /** 获取验证码 */
    @Get('getVerifyCode')
    @ApiParam({
       name: 'email',
       required: true,
       description: '接收验证码邮箱',
       schema: {
        pattern: '/^[^\s@]+@[^\s@]+\.[^\s@]+$/i'
       }
    })
    async getVerifyCode(@Query('email') email: string): Promise<string> {
        const code = await this.userService.sendVerifyCode(email)
        return code
    }
}


