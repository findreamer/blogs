import { Module } from '@nestjs/common'
import { MinioService } from '../../services/minio.service'
import { CommonService } from './common.service'
import { CommonController } from './common.controller'

@Module({
  controllers: [CommonController],
  providers: [CommonService, MinioService]
})
export class CommonModule {

}