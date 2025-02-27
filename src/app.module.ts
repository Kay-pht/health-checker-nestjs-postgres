import { Module } from '@nestjs/common';
import { CompletionModule } from './completion/completion.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MypageModule } from './mypage/mypage.module';
import { ResultModule } from './result/result.module';
import { AuthModule } from './auth/auth.module';
import { AllergyModule } from './allergy/allergy.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    CompletionModule,
    OpenaiModule,
    ConfigModule.forRoot(),
    PrismaModule,
    MypageModule,
    ResultModule,
    AuthModule,
    AllergyModule,
    GeminiModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
