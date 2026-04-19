import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [FormsModule, PrismaModule, ConfigModule.forRoot(), QuestionsModule, OptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
