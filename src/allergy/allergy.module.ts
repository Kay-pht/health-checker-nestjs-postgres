import { Module } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { AllergyController } from './allergy.controller';

@Module({
  controllers: [AllergyController],
  providers: [AllergyService],
})
export class AllergyModule {}
