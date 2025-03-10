import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaService.$executeRawUnsafe = jest.fn().mockResolvedValue(undefined);
    prismaService.$connect = jest.fn().mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('setUserId', () => {
    it('should set the user id in the session variable', async () => {
      const userId = '12345678-1234-1234-1234-123456789012';
      await prismaService.setUserId(userId);
      // eslint-disable-next-line
      expect(prismaService.$executeRawUnsafe).toHaveBeenCalledWith(
        `SET app.current_user_id = '${userId}'`,
      );
    });
  });

  describe('resetUserId', () => {
    it('should reset the user id in the session variable', async () => {
      await prismaService.resetUserId();
      // eslint-disable-next-line
      expect(prismaService.$executeRawUnsafe).toHaveBeenCalledWith(
        `SET app.current_user_id = ''`,
      );
    });
  });
});
