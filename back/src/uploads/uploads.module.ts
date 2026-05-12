import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { LocalStorageService } from './strategies/local-storage.strategy';

@Module({
  controllers: [UploadsController],
  providers: [
    {
      provide: 'STORAGE_STRATEGY',
      useClass: LocalStorageService
    },
    UploadsService
  ],
})
export class UploadsModule {}
