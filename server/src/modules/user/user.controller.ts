import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiTags, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger'
import { Response } from 'express';
import { checkEmail } from '../../utils'
import { CreateUserDto, LoginDto, UpdateUserInfoDto } from '@app/dtos/user.dto';
import { NoAuth, User } from '../../decorators'

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
    @NoAuth()
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
    @NoAuth()
    async register(@Body() user: CreateUserDto, @Res() res: Response): Promise<boolean | Error> {
        try {
            const userInfo = await this.userService.createUser(user)
            delete userInfo.password

            res.status(200).json({
                message: 'success',
                data: userInfo,
                status: 200
            })
            return true

        } catch (error) {
            throw new HttpException(error, 500)
        }
    }

    @Post('login')
    @NoAuth()
    async login(@Body() user: LoginDto, @Res() res: Response): Promise<boolean> {
        const token = this.userService.login(user)
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({
            message: 'success',
            data: true,
            status: 200
        })
        return true
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('token')
        res.send(200)
    }

    @Get('getUserInfo')
    async getUserInfo(@User('id') userId: number) {
        return await this.userService.getUserInfo(userId)
    }

    @Post('updateUserInfo')
    async updateUserInfo(@Body() userInfo: UpdateUserInfoDto, @User('id') userId: number): Promise<boolean> {

        try {
            await this.userService.updateUserInfo(userId, userInfo)

            return true
        } catch (error) {
            return false
        }


    }


}


