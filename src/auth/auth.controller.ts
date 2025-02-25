import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { CredentialDto } from './dto/credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.authService.createUser(createUserDto);
      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('signin')
  async signIn(
    @Body() credentialDto: CredentialDto,
  ): Promise<{ token: string }> {
    try {
      const user = await this.authService.signIn(credentialDto);
      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
