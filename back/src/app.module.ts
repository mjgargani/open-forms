import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { UploadsModule } from './uploads/uploads.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AnswersModule } from './answers/answers.module';

@Module({
  imports: [FormsModule, PrismaModule, ConfigModule.forRoot(), QuestionsModule, OptionsModule, UploadsModule, SubmissionsModule, AnswersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
