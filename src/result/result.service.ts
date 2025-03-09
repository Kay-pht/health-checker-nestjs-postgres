import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';
import { PrismaContextService } from 'src/prisma/prisma-context.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaContextService: PrismaContextService,
  ) {}

  async getResultById(id: string, userId: string): Promise<CreateResultDto> {
    const targetResult = await this.prismaContextService.setCurrentUser(
      userId,
      async () =>
        this.prismaService.result.findUnique({
          where: {
            id,
            userId,
          },
        }),
    );
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
