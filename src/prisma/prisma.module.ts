import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaContextService } from './prisma-context.service';

@Module({
  providers: [PrismaService, PrismaContextService],
  exports: [PrismaService, PrismaContextService],
})
export class PrismaModule {}
