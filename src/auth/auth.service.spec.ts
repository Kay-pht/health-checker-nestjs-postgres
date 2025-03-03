import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const createUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const hashedPassword = await authService.hashPassword(
        createUserDto.password,
      );
      expect(hashedPassword).not.toBe(createUserDto.password);
      expect(await bcrypt.compare(createUserDto.password, hashedPassword)).toBe(
        true,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user and hash the password', async () => {
      (prismaService.user.create as jest.Mock).mockResolvedValueOnce({
        name: createUserDto.name,
        email: createUserDto.email,
        password: await authService.hashPassword(createUserDto.password),
      });
      const result = await authService.createUser(createUserDto);

      expect(result.name).toBe(createUserDto.name);
      expect(result.email).toBe(createUserDto.email);
      expect(
        await bcrypt.compare(createUserDto.password, result.password),
      ).toBe(true);
    });
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      const credentialDto = {
        email: createUserDto.email,
        password: createUserDto.password,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        password: await authService.hashPassword(createUserDto.password),
      });
      (jwtService.sign as jest.Mock).mockReturnValueOnce('token');

      const result = await authService.signIn(credentialDto);

      // eslint-disable-next-line
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        username: createUserDto.name,
      });
      expect(result.token).toBe('token');
    });
  });
});
