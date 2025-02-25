import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';
import { OpenaiModule } from 'src/openai/openai.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [OpenaiModule, PrismaModule],
  controllers: [CompletionController],
  providers: [CompletionService],
})
export class CompletionModule {}
