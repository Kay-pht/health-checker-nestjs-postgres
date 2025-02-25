import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { HistoryDto } from 'src/completion/dto/history.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from 'src/types/requestUser';
import { Request as ExpressRequest } from 'express';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMypageData(
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<HistoryDto[]> {
    try {
      const mypageData = await this.mypageService.getHistory(req.user.userId);
      return mypageData;
    } catch (error) {
      console.error('Error fetching mypage data:', error);
      throw error;
    }
  }
}
