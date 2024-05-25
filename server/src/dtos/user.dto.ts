import { IsEmail, IsEmpty, IsNotEmpty, Length, isEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @IsNotEmpty({
        message: '邮箱不能为空'
    })

    @IsEmail({}, {
        message: "邮箱格式不正确"
    })
    @ApiProperty({ description: '注册邮箱' })
    email: string


    @IsNotEmpty({
        message: '密码不能为空'
    })
    @Length(6, 30, {
        message: '密码最小长度为6位，最大长度为30位'
    })
    @ApiProperty({ description: '用户密码' })
    password: string


    @IsNotEmpty({
        message: '验证码不能为空'
    })
    @ApiProperty({ description: '验证码' })
    code?: string
}

export class LoginDto {
    @IsNotEmpty({
        message: '邮箱不能为空'
    })
    email: string

    @IsNotEmpty({
        message: "密码不能为空"
    })
    password: string
}

export class UpdateUserInfoDto {
    @IsNotEmpty({
        message: "用户名不可为空"
    })
    username: string

    @IsNotEmpty({
        message: "头像不可为空"
    })
    avatar: string

    info?: string
}
