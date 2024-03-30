import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }


    /** 获取验证码 */
    @Get('getVerifyCode')
    async getVerifyCode(@Query('email') email: string): Promise<string> {
        const code = await this.userService.sendVerifyCode(email)
        return code
    }
}


