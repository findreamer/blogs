import { Injectable } from '@nestjs/common'
import { EmailService } from '../../services/email.service'
import { VERIFY_CODE_PREFIX, generateRandomNumber, hashPassword } from '../../utils/index'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@app/entities/user.entity'
import { CreateUserDto, LoginDto } from '@app/dtos/user.dto'
import { RedisService } from '@app/services/redis.service'
import { AuthService } from '@app/services/auth.service'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly emailService: EmailService,
        private readonly redisService: RedisService,
        private readonly authService: AuthService
    ) {

    }

    async sendVerifyCode(email: string) {
        const code = generateRandomNumber()
        const text = `您的验证码是:${code}，5分钟内有效`
        try {
            await this.emailService.sendEmail(email, 'jueyin注册', text)
            await this.redisService.set(`${VERIFY_CODE_PREFIX}:${email}`, code, 5 * 60)
            return code

        } catch (error) {
            return error
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { email, password, code } = createUserDto
        const redisCode = await this.redisService.get(`${VERIFY_CODE_PREFIX}:${email}`)
        if (!redisCode) {
            throw new Error('验证码已过期')
        }

        if (redisCode !== code) {
            throw new Error('验证码不正确')
        }

        const isEmailExist = await this.getUserByEmail(email)
        if (isEmailExist) {
            throw new Error('用户已存在')
        }

        const res = await this.userRepository.save({
            email,
            password: hashPassword(password, email),
            username: `用户${Date.now()}`
        })

        return res
    }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async login(user: LoginDto) {
        const entity = await this.getUserByEmailAndPassword(user.email, hashPassword(user.password, user.email))
        if (!entity) {
            throw new Error('邮箱或密码不正确')
        }

        const { id, email } = entity
        const token = this.authService.generateJwtToken({ id, email })
        return token
    }

    async getUserByEmailAndPassword(email: string, password: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email, password } })
    }

    async getUserInfo(userId: number): Promise<Omit<UserEntity, 'passsword'> | null> {
        const userInfo = await this.userRepository.findOne({ where: { id: userId } })
        if (!userInfo) {
            return null
        }
        delete userInfo.password
        return userInfo

    }
}
