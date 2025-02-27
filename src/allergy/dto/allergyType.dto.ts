import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AllergyTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string;
}
