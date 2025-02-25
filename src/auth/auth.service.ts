import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { CredentialDto } from './dto/credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/types/jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async signIn(credentialDto: CredentialDto): Promise<{ token: string }> {
    const { email, password } = credentialDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id,
        username: user.name,
      };

      const token = this.jwtService.sign(payload);
      return { token };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
