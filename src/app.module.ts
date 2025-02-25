import { Module } from '@nestjs/common';
import { CompletionModule } from './completion/completion.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    CompletionModule,
    OpenaiModule,
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
