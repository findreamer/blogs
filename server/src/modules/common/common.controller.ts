import { Controller, Post, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common'
import { MinioService } from '../../services/minio.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilePipe } from '../../pipes/file.pipe'
@Controller('common')
export class CommonController {
  constructor(private readonly minioService: MinioService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  @UsePipes(new FilePipe())
  async upload(@UploadedFiles() files: UploadFile[]) {

  }
}