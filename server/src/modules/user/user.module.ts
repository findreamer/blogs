import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { EmailService } from '@app/services/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, EmailService]
})
export class UserModule { }