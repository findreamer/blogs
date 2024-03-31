import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { EmailService } from '@app/services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from '@app/entities/user.entity';
import { RedisService } from '@app/services/redis.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, EmailService, RedisService]
})
export class UserModule { }