import { Injectable } from '@nestjs/common'
import { EmailService } from '../../services/EmailService'
import { generateRandomNumber } from '../../utils/index'

@Injectable()
export class UserService {
    constructor(private readonly emailService: EmailService) {

    }

    async sendVerifyCode(email: string) {
        const code = generateRandomNumber()
        const text = `您的验证码是:${code}，5分钟内有效`
        await this.emailService.sendEmail(email, 'jueyin注册', text)
        return code
    }
}