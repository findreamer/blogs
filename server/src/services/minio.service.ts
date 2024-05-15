import { Injectable } from '@nestjs/common'
import { InjectMinio } from 'nestjs-minio'
import * as minio from 'minio'

@Injectable()
export class MinioService {
  private static readonly bucketName = 'jueyin'

  constructor(@InjectMinio() private readonly minioClient: minio.Client) {

  }
  async uploadFiles(file: UploadFile[]) {

    const upload = async (file: UploadFile) => {
      const res = await this.minioClient.putObject(
        MinioService.bucketName,
        file.originalname,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,  // 文件格式，用于存储下载
        }
      )

      return {
        ...res,
        originalname: file.originalname,
        url: `/api/common/download?name=${file.originalname}`
      }

    }

    const res = await Promise.all(file.map(upload))
    return res
  }

  async getFile(objectName: string) { }
}