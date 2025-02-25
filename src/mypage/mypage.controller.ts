import { Controller, Get } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { HistoryDto } from 'src/completion/dto/history.dto';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get()
  async getMypageData(): Promise<HistoryDto[]> {
    try {
      const mypageData = await this.mypageService.getHistory();
      return mypageData;
    } catch (error) {
      console.error('Error fetching mypage data:', error);
      throw error;
    }
  }
}
