import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'


@Injectable()
export class EmailService {
    private transporter: any
    private from: any

    constructor() {
        const configService = new ConfigService()
        this.from = configService.get<string>('EMAIL', '')
        
        this.transporter = nodemailer.createTransport({
            host: configService.get<string>('EMAIL_HOST', 'smtp.163.com'), // SMTP主机地址
            port: 465, // SMTP端口号
            secure: true,
            auth: {
                user: configService.get<string>('EMAIL', ''), // 发件人邮箱地址
                pass: configService.get<string>('EMAIL_SECERT', '') // 发件人邮箱密码
            }

        })
    }


    async sendEmail (to: string, subject: string, text: string):Promise<void> {
        if (!to) return Promise.reject('请输入收件人邮箱地址！')
        
        const mailOptions = {
            from: this.from,
            to,
            subject,
            text,
        }

        try {
            const res = await this.transporter.sendMail(mailOptions)
            return Promise.resolve(res)
        } catch (error) {
            console.log(error)
            return Promise.reject('发送消息失败')
        }
    }
}