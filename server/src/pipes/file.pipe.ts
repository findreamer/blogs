import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { generateRandomNumber } from '../utils'
import * as path from 'path';

@Injectable()
export class FilePipe implements PipeTransform {
  transform(files: UploadFile[]) {
    console.log('files => ', files)
    const arr = files.map((file) => {
      const ext = path.extname(file.originalname);
      return {
        ...file,
        originalname: `${file.originalname}_${Date.now()}${generateRandomNumber()}${ext}`,
      };
    });
    return arr;
  }
}