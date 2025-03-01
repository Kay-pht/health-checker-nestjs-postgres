import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDashboardDto } from './dto/userDashboard.dto';
import { AllergyTypes, Result, UserAllergy } from '@prisma/client';
import { UserWithRelations } from 'src/types/userWithRelations';
import { AnalysisResult } from 'src/types/analysisResult';
import {
  // AllergyItemDto,
  AnalysisResultDto,
  UpdateUserDashboardDto,
} from './dto/update-userDashboard.dto';
import { UserInfoDto } from './dto/update-userDashboard.dto';
@Injectable()
export class UserDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserDashboardData(userId: string): Promise<UserDashboardDto> {
    const user = await this.getUserData(userId);
    return this.mapUserToDto(user);
  }

  async getUserData(userId: string): Promise<UserWithRelations> {
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
      return user;
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }

  private mapUserToDto(user: UserWithRelations): UserDashboardDto {
    return {
      allergyList: this.mapAllergies(user.UserAllergy),
      userInfo: {
        username: user.name,
        email: user.email,
      },
      analysisResults: this.mapAnalysisResults(user.Result),
    };
  }

  private mapAllergies(
    userAllergy: (UserAllergy & { allergy: AllergyTypes })[],
  ) {
    return userAllergy.map((allergy) => ({
      allergyId: allergy.allergyId,
      allergyName: allergy.allergy.name,
      severity: allergy.severity,
    }));
  }

  private mapAnalysisResults(results: Result[]): AnalysisResult[] {
    return results.map((result) => ({
      missingNutrients: result.missingNutrients,
      recommendedFoods: result.recommendedFoods,
      score: result.score,
    }));
  }

  async updateUserDashboardData(
    userId: string,
    updateUserDashboardDto: UpdateUserDashboardDto,
  ): Promise<UserDashboardDto> {
    try {
      await this.prismaService.$transaction(async (tx) => {
        if (updateUserDashboardDto.userInfo) {
          const dataToUpdate: UserInfoDto = {};

          if (updateUserDashboardDto.userInfo.name) {
            dataToUpdate.name = updateUserDashboardDto.userInfo.name;
          }
          if (updateUserDashboardDto.userInfo.email) {
            dataToUpdate.email = updateUserDashboardDto.userInfo.email;
          }
          if (updateUserDashboardDto.userInfo.password) {
            dataToUpdate.password = updateUserDashboardDto.userInfo.password;
          }

          await tx.user.update({
            where: { id: userId },
            data: dataToUpdate,
          });
        }
        if (updateUserDashboardDto.analysisResults) {
          const dataToUpdate: AnalysisResultDto = {
            id: updateUserDashboardDto.analysisResults.id,
          };

          if (updateUserDashboardDto.analysisResults.missingNutrients) {
            dataToUpdate.missingNutrients =
              updateUserDashboardDto.analysisResults.missingNutrients;
          }
          if (updateUserDashboardDto.analysisResults.recommendedFoods) {
            dataToUpdate.recommendedFoods =
              updateUserDashboardDto.analysisResults.recommendedFoods;
          }
          if (updateUserDashboardDto.analysisResults.score) {
            dataToUpdate.score = updateUserDashboardDto.analysisResults.score;
          }

          await tx.result.update({
            where: {
              id: updateUserDashboardDto.analysisResults.id,
              userId: userId,
            },
            data: dataToUpdate,
          });
        }
        // await this.updateUserAllergy(userId, updateUserDashboardDto.allergyList);
      });
      return this.getUserDashboardData(userId);
    } catch (error) {
      console.error('Error updating user dashboard data:', error);
      throw error;
    }
  }

  // async updateUserInfo(userId: string, userInfo: UserInfoDto): Promise<void> {
  //   const dataToUpdate: UserInfoDto = {};

  // if (userInfo.name) {
  //   dataToUpdate.name = userInfo.name;
  // }
  // if (userInfo.email) {
  //   dataToUpdate.email = userInfo.email;
  // }
  // if (userInfo.password) {
  //   dataToUpdate.password = userInfo.password;
  // }

  // await this.prismaService.user.update({
  //   where: { id: userId },
  //   data: dataToUpdate,
  // });
  // }

  // async updateAnalysisResults(
  //   userId: string,
  //   analysisResults: AnalysisResultDto,
  // ): Promise<void> {
  //   const dataToUpdate: AnalysisResultDto = {
  //     id: analysisResults.id,
  //   };

  //   if (analysisResults.missingNutrients) {
  //     dataToUpdate.missingNutrients = analysisResults.missingNutrients;
  //   }
  //   if (analysisResults.recommendedFoods) {
  //     dataToUpdate.recommendedFoods = analysisResults.recommendedFoods;
  //   }
  //   if (analysisResults.score) {
  //     dataToUpdate.score = analysisResults.score;
  //   }

  //   await this.prismaService.result.update({
  //     where: { id: analysisResults.id, userId: userId },
  //     data: dataToUpdate,
  //   });
  // }
}

// updateUserAllergy(userId: string, allergyList: AllergyItemDto[]) {}
