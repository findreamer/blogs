import { Controller, Get, HttpException, HttpStatus, Query , Req} from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags, ApiQuery } from '@nestjs/swagger'
import { Request } from 'express';
import { checkEmail } from '../../utils'


@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }


    /** 获取验证码 */
    @Get('getVerifyCode')
    @ApiQuery({
       name: 'email',
       required: true,
       description: '接收验证码邮箱',
       schema: {
        pattern: '/^[^\s@]+@[^\s@]+\.[^\s@]+$/i'
       }
      
    })
    async getVerifyCode(@Query('email') email: string, @Req() request: Request): Promise<string> {
        console.log('email ==> ',email, request.query)

        if (checkEmail(email)) {
            const code = await this.userService.sendVerifyCode(email)
            return code
        } else {
            /** 校验格式不正确 */
            throw new HttpException('输入邮箱格式不正确', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        
    }
}


