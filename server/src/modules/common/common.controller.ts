import { Controller, Post, UploadedFiles, UseInterceptors, UsePipes, Get, Query, Res } from '@nestjs/common'
import { MinioService } from '../../services/minio.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilePipe } from '../../pipes/file.pipe'
import { NoAuth } from '@app/decorators'
import axios, { AxiosResponse } from 'axios'
import type { Response } from 'express'

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


  @Get('download')
  @NoAuth()
  async download(@Query('name') name: string, @Res() res: Response) {
    const { url, stat } = await this.minioService.getFile(name)

    const response: AxiosResponse = await axios.get(url, { responseType: 'stream' })

    // 设置相应头，指定内容类型为流
    res.setHeader('Content-Type', stat.metaData['content-type'])

    // 将远程资源的流式数据传输到客户端
    response.data.pipe(res);
  }
}