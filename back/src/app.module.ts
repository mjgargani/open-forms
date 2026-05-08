import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'media'),
      serveRoot: '/media'
    }), 
    PrismaModule, 
    ConfigModule.forRoot(), 
    FormsModule, 
    SubmissionsModule, 
    UploadsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
