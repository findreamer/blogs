import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { generateRandomNumber } from '../utils'
import path from 'path'

@Injectable()
export class FilePipe implements PipeTransform {
  transform(files: UploadFile[]) {
    const arr = files.map((file) => {
      const ext = path.extname(file.originalname);
      return {
        ...file,
        originalname: `${Date.now()}${generateRandomNumber()}${ext}`,
      };
    });
    return arr;
  }
}