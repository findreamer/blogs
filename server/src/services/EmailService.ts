import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'


@Injectable()
export class EmailService {
    private transporter: any
    private from: any

    constructor() {
        const configService = new ConfigService()
        const from = configService.get<string>('EMAIL', '')
        this.transporter = nodemailer.createTransport({
            host: configService.get<string>('EMAIL_HOST', 'smtp.163.com'), // SMTP主机地址
            port: 465, // SMTP端口号
            auth: {
                user: configService.get<string>('EMAIL', ''), // 发件人邮箱地址
                pass: configService.get<string>('EMAIL_SECERT', '') // 发件人邮箱密码
            }

        })
    }


    async sendEmail (to: string, subject: string, text: string):Promise<void> {
        const mailOptions = {
            from: this.from,
            to,
            subject,
            text,
        }

        await this.transporter.sendEmail(mailOptions)
    }
}