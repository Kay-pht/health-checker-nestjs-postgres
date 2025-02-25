import { Injectable } from '@nestjs/common';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MypageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHistory(): Promise<CreateResultDto[]> {
    const historyResults = await this.prismaService.result.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!historyResults) {
      return [];
    }
    return historyResults.map((result) => ({
      missingNutrients: result.missingNutrients,
      recommendedFoods: result.recommendedFoods,
      score: result.score,
      createdAt: result.createdAt,
    }));
  }
}
