import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getSummary(req: Request) {
    const userData = req['user'];
    const userId = userData.sub;

    const dreams = await this.prisma.dream.findMany({
      where: { userId },
      include: { analysis: true },
    });

    const totalDreams = dreams.length;
    const emotionCount: Record<string, number> = {};
    let dreamsWithEmotions = 0;

    for (const dream of dreams) {
      const emotions = dream.analysis?.emotions;
      if (emotions && Array.isArray(emotions) && emotions.length > 0) {
        dreamsWithEmotions++;
        for (const emotion of emotions) {
          if (typeof emotion === 'string') {
            emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
          }
        }
      }
    }

    // Sort emotions by count, get top 5
    const topEmotions = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion, count }));

    return {
      totalDreams,
      topEmotions,
      dreamsWithEmotions,
    };
  }
}
