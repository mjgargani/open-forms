import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { join } from 'path';
import { IStorageStrategy } from '../interfaces/storage-strategy.interface';

@Injectable()
export class LocalStorageService implements IStorageStrategy {
  async save(file: Buffer, fileName: string): Promise<string> {
    const uploadPath = join(process.cwd(), 'uploads');
    await fs.mkdir(uploadPath, { recursive: true });
    const fullPath = join(uploadPath, fileName);
    
    await fs.writeFile(fullPath, file);
    return `/uploads/${fileName}`;
  }
}