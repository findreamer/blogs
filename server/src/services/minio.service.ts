import { Injectable } from '@nestjs/common'
import { InjectMinio } from 'nestjs-minio'
import * as minio from 'minio'

@Injectable()
export class MinioService {
  private static readonly bucketName = 'jueyin'

  constructor(@InjectMinio() private readonly minioClient: minio.Client) {

    async uploadFiles(file: UploadFile[]) { }

    async getFile(objectName: string) { }
  }
}