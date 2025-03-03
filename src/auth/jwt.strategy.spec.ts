import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let prismaService: PrismaService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('validate', () => {
    const payload = {
      sub: '1',
      username: 'John Doe',
    };
    it('should validate the payload', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(true);
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        userName: payload.username,
      });
      // eslint-disable-next-line
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should throw an UnauthorizedException if the user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(false);
      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
