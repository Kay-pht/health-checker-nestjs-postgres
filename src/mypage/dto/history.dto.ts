import { IsDate, IsInt, IsString } from 'class-validator';

export class HistoryDto {
  @IsString({ each: true })
  missingNutrients: string[];

  @IsString({ each: true })
  recommendedFoods: string[];

  @IsInt()
  score: number;

  @IsDate()
  createdAt: Date;
}
