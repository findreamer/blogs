import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from '@nestjs-modules/ioredis'
import { APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { ResponseInterceptor } from './interceptors/ResponseInterceptor';
import { UserModule } from './modules/user/user.module';
import { GlobalValidationPips } from './pipes/global-validation.pipe';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { JwtModule } from '@nestjs/jwt'
import { AuthMiddleware } from './middilewares/auth. middleware';
import { NestMinioModule } from 'nestjs-minio'
import { AuthService } from './services/auth.service'
import { AuthGuard } from './guards/auth.guard'
import { CommonModule } from './modules/common/common.module'
import { ArticleModule } from './modules/article/article.module'
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
  // console.log('get config   => ', config)
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


/** 获取 minio 配置 */
const getMinioConfig = () => {
  const configService = new ConfigService()
  const endPoint = configService.get<string>('MINIO_ENDPOINT', 'localhost');
  const accessKey = configService.get<string>('MINIO_ACCESSKEY', 'accessKey');
  const secretKey = configService.get<string>('MINIO_SECRET_KEY', 'secretKey');

  return NestMinioModule.register({
    isGlobal: true,
    endPoint,
    port: 9000,
    accessKey,
    secretKey,
    useSSL: false
  })
}

@Module({
  imports: [UserModule,
    CommonModule,
    ArticleModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    getDatabaseConfig(),
    getRedisConfig(),
    getMinioConfig(),
    JwtModule.register({})
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalExceptionFilter
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPips
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    AuthService
  ],
})


export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
