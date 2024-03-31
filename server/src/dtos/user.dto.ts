import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class CreateUserDto {
    @IsNotEmpty({
        message: '邮箱不能为空'
    })

    @IsEmail({}, {
        message: "邮箱格式不正确"
    })
    @ApiProperty({description: '注册邮箱'})
    email: string


    @IsNotEmpty({
        message: '密码不能为空'
    })
    @Length(6,30,{
        message: '密码最小长度为6位，最大长度为30位'
    })
    @ApiProperty({description: '用户密码'})
    password: string


    @IsNotEmpty({
        message: '验证码不能为空'
    })
    @ApiProperty({description: '验证码'})
    code?: string
}