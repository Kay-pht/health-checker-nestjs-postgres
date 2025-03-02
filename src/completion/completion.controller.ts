import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CreateResultDto } from './dto/create-result.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from 'src/types/requestUser';

@Controller('completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  postAnalyzeAnswer(
    @Body('answer') answer: string,
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<CreateResultDto> {
    return this.completionService.getAnalysis(answer, req.user.userId);
  }
}
