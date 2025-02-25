import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
  async getResult(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateResultDto> {
    try {
      const result = await this.resultService.getResultById(id);
      return result;
    } catch (error) {
      console.error('Error fetching result:', error);
      throw error;
    }
  }
  // @Delete('delete')
  // async deleteResult(): Promise<{ count: number }> {
  //   try {
  //     const result = await this.resultService.delete();
  //     return result;
  //   } catch (error) {
  //     console.error('Error fetching result:', error);
  //     throw error;
  //   }
  // }
}
