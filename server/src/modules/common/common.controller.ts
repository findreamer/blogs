import { Controller, Post, UploadedFiles, UseInterceptors, UsePipes, Get, Query } from '@nestjs/common'
import { MinioService } from '../../services/minio.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilePipe } from '../../pipes/file.pipe'
import { NoAuth } from '@app/decorators'
@Controller('common')
export class CommonController {
  constructor(private readonly minioService: MinioService) { }

  @Post('upload')
  // 使用内置zhuan shi qi
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new FilePipe())
  async upload(@UploadedFiles() files: UploadFile[]) {
    return await this.minioService.uploadFiles(files);
  }

  @Get('getFile')
  @NoAuth()
  async getFile(@Query('name') name: string) {
    const { url } = await this.minioService.getFile(name)
    return url
  }


}