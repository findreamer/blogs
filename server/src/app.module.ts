import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './interceptors/ResponseInterceptor';
import { UserModule } from './modules/user/user.module';

const configService = new ConfigService()

/** 获取数据库配置 */
const getDatabaseConfig = () => {
  const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    autoLoadEntities: true

  }
  console.log('get config   => ', config)
  return TypeOrmModule.forRoot(config)
}


/** 获取 redis 配置 */
const getRedisConfig = () => {
  const host = configService.get<string>('REDIS_HOST', 'localhost')
  const port = configService.get<number>("REDIS_PORT", 6379)
  const password = configService.get<string>('REDIS_PASSWORD', "")

  return RedisModule.forRoot({
    type: "single",
    url: `redis://${host}:${port}`,
    options: {
      password,
      db: 2 //选择2数据库，Redis中数据库是0-16
    }
  })

}


@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    getDatabaseConfig(),
    getRedisConfig()
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ],
})


export class AppModule {


}
