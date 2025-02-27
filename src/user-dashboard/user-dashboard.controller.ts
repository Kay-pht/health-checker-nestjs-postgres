import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDashboardService } from './user-dashboard.service';
import { RequestUser } from 'src/types/requestUser';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { Request } from '@nestjs/common';
import { UserDashboardDto } from './dto/userDashboard.dto';

@Controller('user-dashboard')
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserDashboardData(
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<UserDashboardDto> {
    try {
      const userDashboardData =
        await this.userDashboardService.getUserDashboardData(req.user.userId);
      return userDashboardData;
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }
}
