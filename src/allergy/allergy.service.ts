import { Injectable } from '@nestjs/common';
import { AllergyTypes } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AllergyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAllergyType(name: string): Promise<AllergyTypes> {
    try {
      const allergyType = await this.prismaService.allergyTypes.create({
        data: {
          name,
        },
      });
      return allergyType;
    } catch (error) {
      console.error('failed to create allergy type', error);
      throw error;
    }
  }

  async registerUserAllergyInfo(
    userId: string,
    allergies: { [key: string]: string },
  ) {
    try {
      // 既存のユーザーアレルギー情報を削除（更新のため）
      await this.prismaService.userAllergy.deleteMany({
        where: { userId },
      });

      // 新しいアレルギー情報を登録
      const allergyEntries = Object.entries(allergies);

      // アレルギー情報がない場合は早期リターン
      if (allergyEntries.length === 0) {
        return {
          success: true,
          message: 'アレルギー情報が更新されました（登録なし）',
        };
      }

      // 各アレルギー情報をデータベースに保存
      const createPromises = allergyEntries.map(([allergyId, severity]) => {
        return this.prismaService.userAllergy.create({
          data: {
            userId,
            allergyId,
            severity,
          },
        });
      });

      // すべての保存処理を並行して実行
      await Promise.all(createPromises);

      return {
        success: true,
        message: 'アレルギー情報が登録されました',
        count: allergyEntries.length,
      };
    } catch (error) {
      console.error('アレルギー情報の登録中にエラーが発生しました:', error);
      throw error;
    }
  }
}
