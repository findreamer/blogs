import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {Connection} from 'typeorm'

const getDatabaseConfig = () => {
  const configService = new ConfigService()
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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    getDatabaseConfig()
  ],
  controllers: [],
  providers: [],
})


export class AppModule {

  constructor(private readonly connection: Connection) {
    this.connection.connect().then(() => {
      console.log('success')
    }).catch(err => {
      console.log('fail')
    })
  }
 }
