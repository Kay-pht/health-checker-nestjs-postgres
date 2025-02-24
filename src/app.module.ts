import { Module } from '@nestjs/common';
import { CompletionModule } from './completion/completion.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CompletionModule, OpenaiModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
