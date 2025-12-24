import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTANT: Apply raw body handler BEFORE other middleware
  app.use(
    '/api/stripe/webhook',
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Apply JSON parser for all other routes
  app.use(json());

  // CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix('api');

  // Start server
  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 Server running on http://localhost:3000');
  console.log('📡 Webhook endpoint: http://localhost:3000/api/stripe/webhook');
}
bootstrap();
