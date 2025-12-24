import { Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Manual trigger for testing
  // In production, add authentication guard!
  @Post('reset-monthly-limits')
  async manualResetMonthlyLimits() {
    await this.tasksService.manualResetMonthlyLimits();
    return { message: 'Monthly reset triggered successfully' };
  }

  @Post('check-expired')
  async manualCheckExpired() {
    await this.tasksService.checkExpiredSubscriptions();
    return { message: 'Expired subscriptions check triggered successfully' };
  }
}
