import { Controller } from '@nestjs/common';
import { AllergyService } from './allergy.service';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}
}
