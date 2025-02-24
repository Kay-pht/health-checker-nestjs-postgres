import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenaiModule],
  controllers: [CompletionController],
  providers: [CompletionService],
})
export class CompletionModule {}
