import { Inject, Injectable } from '@nestjs/common';
import { IStorageStrategy } from './interfaces/storage-strategy.interface';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  constructor(
    @Inject('STORAGE_STRATEGY') private readonly storage: IStorageStrategy,
  ) {}

  async createImage(file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${uuidv4()}.webp`;

    return await this.storage.save(buffer, fileName);
  }
}
