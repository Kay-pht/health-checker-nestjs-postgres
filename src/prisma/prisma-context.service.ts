import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Injectable()
export class PrismaContextService {
  constructor(private readonly prismaService: PrismaService) {}
  async setCurrentUser<T>(userId: string, fn: () => Promise<T>): Promise<T> {
    await this.prismaService.setUserId(userId);
    try {
      return await fn();
    } finally {
      await this.prismaService.resetUserId();
    }
  }
}
