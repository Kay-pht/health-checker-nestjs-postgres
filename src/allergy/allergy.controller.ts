import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from 'src/types/requestUser';
import { RegisterAllergyDto } from './dto/register-allergy.dto';
import { AllergyTypeDto } from './dto/allergyType.dto';
import { AllergyTypes } from '@prisma/client';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post('types')
  @UseGuards(AuthGuard('jwt'))
  async registerAllergyType(
    @Body() allergyTypeDto: AllergyTypeDto,
  ): Promise<AllergyTypes> {
    const data = await this.allergyService.createAllergyType(
      allergyTypeDto.name,
    );
    return data;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async registerUserAllergies(
    @Request() req: ExpressRequest & { user: RequestUser },
    @Body() registerAllergyDto: RegisterAllergyDto,
  ): Promise<any> {
    const data = await this.allergyService.registerUserAllergyInfo(
      req.user.userId,
      registerAllergyDto.allergies,
    );
    return data;
  }
}
