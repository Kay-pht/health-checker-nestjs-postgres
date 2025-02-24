import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [OpenaiService],
  providers: [OpenaiService],
})
export class OpenaiModule {}
