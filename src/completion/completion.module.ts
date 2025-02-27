import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';
import { OpenaiModule } from 'src/openai/openai.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [OpenaiModule, PrismaModule, AuthModule, GeminiModule],
  controllers: [CompletionController],
  providers: [CompletionService],
})
export class CompletionModule {}
