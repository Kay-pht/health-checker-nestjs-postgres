import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private userId: string;

  async onModuleInit() {
    await this.$connect();
  }

  async setUserId(userId: string): Promise<void> {
    await this.$executeRawUnsafe(`SET app.current_user_id = '${userId}'`);
  }

  async resetUserId(): Promise<void> {
    await this.$executeRawUnsafe(`SET app.current_user_id = ''`);
  }
}
