import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDashboardDto } from './dto/userDashboard.dto';

@Injectable()
export class UserDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserDashboardData(userId: string): Promise<UserDashboardDto> {
    try {
      // findUniqueはfindFirstに比べて、パフォーマンス面で有利なので、一意なデータを取得する場合に使用する
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          Result: true,
          UserAllergy: {
            include: {
              allergy: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        allergyList: user.UserAllergy.map((allergy) => ({
          allergyId: allergy.allergy.id,
          allergyName: allergy.allergy.name,
          severity: allergy.severity,
        })),
        userInfo: {
          username: user.name,
          email: user.email,
        },
        analysisResults: user.Result.map((result) => ({
          missingNutrients: result.missingNutrients,
          recommendedFoods: result.recommendedFoods,
          score: result.score,
        })),
      };
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }
}
