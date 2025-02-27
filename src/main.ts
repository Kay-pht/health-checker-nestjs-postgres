import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validateEnv } from './config/env.validation';

async function bootstrap() {
  // アプリケーション起動前に環境変数を検証
  validateEnv();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // グローバルプレフィックスを設定
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
