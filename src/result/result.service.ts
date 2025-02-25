import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getResultById(id: string, userId: string): Promise<CreateResultDto> {
    const targetResult = await this.prismaService.result.findUnique({
      where: {
        id,
        userId,
      },
    });
    if (!targetResult) {
      throw new NotFoundException();
    }
    return {
      missingNutrients: targetResult.missingNutrients,
      recommendedFoods: targetResult.recommendedFoods,
      score: targetResult.score,
    };
  }
  // async delete(): Promise<{ count: number }> {
  //   const result = await this.prismaService.result.deleteMany({
  //     where: {
  //       userId: undefined,
  //     },
  //   });
  //   if (!result) {
  //     throw new NotFoundException();
  //   }
  //   return result;
  // }
}
