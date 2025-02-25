import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MypageController],
  providers: [MypageService],
})
export class MypageModule {}
