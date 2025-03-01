import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

// ネストされたDTOクラスを作成
export class UserInfoDto extends PartialType(CreateUserDto) {}

export class AllergyItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  allergyId?: string;
}

export class AnalysisResultDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  missingNutrients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendedFoods?: string[];

  @IsOptional()
  @IsNumber()
  score?: number;
}

export class UpdateUserDashboardDto {
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo?: UserInfoDto;

  @ValidateNested({ each: true })
  @Type(() => AllergyItemDto)
  @IsOptional()
  allergyList?: AllergyItemDto[];

  @ValidateNested()
  @Type(() => AnalysisResultDto)
  @IsOptional()
  analysisResults?: AnalysisResultDto;
}
