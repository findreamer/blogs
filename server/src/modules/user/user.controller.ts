import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger'
import { Request } from 'express';
import { checkEmail } from '../../utils'
import { CreateUserDto } from '@app/dtos/user.dto';
import { UserEntity } from '@app/entities/user.entity';


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


    })
    async getVerifyCode(@Query('email') email: string): Promise<string> {
        if (!email) {
            throw new HttpException('邮箱不能为空', HttpStatus.BAD_REQUEST)
        }

        if (checkEmail(email)) {
            const code = await this.userService.sendVerifyCode(email)
            return code
        } else {
            /** 校验格式不正确 */
            throw new HttpException('输入邮箱格式不正确', HttpStatus.UNPROCESSABLE_ENTITY)
        }

    }

    @Post('register')
    @ApiBody({
       type: CreateUserDto,
       description: "注册用户",
      
    })
    async register(@Body() user: CreateUserDto): Promise<UserEntity | Error> {
        try {
            const res = await this.userService.createUser(user)
            return res

        } catch (error) {
            throw new HttpException(error, 500)
        }
    }
}


