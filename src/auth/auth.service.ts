import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { CredentialDto } from './dto/credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../types/jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This email address is already in use');
      }
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    // The default salt rounds is 10
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async signIn(credentialDto: CredentialDto): Promise<{ token: string }> {
    const { email, password } = credentialDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (user && (await this.isPasswordValid(password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id,
        username: user.name,
      };

      const token = this.jwtService.sign(payload);
      return { token };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async isPasswordValid(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
