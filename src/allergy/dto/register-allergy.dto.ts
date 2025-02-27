import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterAllergyDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  allergies: { [key: string]: string };
}
