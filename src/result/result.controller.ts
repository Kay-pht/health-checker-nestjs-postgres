import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from 'src/types/requestUser';
import { Request as ExpressRequest } from 'express';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getResult(
    @Request() req: ExpressRequest & { user: RequestUser },
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateResultDto> {
    try {
      const result = await this.resultService.getResultById(
        id,
        req.user.userId,
      );
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
