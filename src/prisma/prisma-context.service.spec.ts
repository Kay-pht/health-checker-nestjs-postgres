import { Test } from '@nestjs/testing';
import { PrismaContextService } from './prisma-context.service';
import { PrismaService } from './prisma.service';

describe('PrismaContextService', () => {
  let prismaContextService: PrismaContextService;

  const mockPrismaService = {
    setUserId: jest.fn(),
    resetUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaContextService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    prismaContextService =
      module.get<PrismaContextService>(PrismaContextService);
  });

  it('should be defined', () => {
    expect(prismaContextService).toBeDefined();
  });

  describe('setCurrentUser', () => {
    it('should set the user id in the session variable', async () => {
      const userId = '12345678-1234-1234-1234-123456789012';
      await prismaContextService.setCurrentUser(userId, async () => {
        return await Promise.resolve('test');
      });

      expect(mockPrismaService.setUserId).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.resetUserId).toHaveBeenCalled();
    });

    it('should reset the user id in the session variable when the function throws an error', async () => {
      const userId = '12345678-1234-1234-1234-123456789012';
      await expect(
        prismaContextService.setCurrentUser(userId, async () => {
          await Promise.reject(new Error('test'));
        }),
      ).rejects.toThrow('test');

      expect(mockPrismaService.setUserId).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.resetUserId).toHaveBeenCalled();
    });
  });
});
