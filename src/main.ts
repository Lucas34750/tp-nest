import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/Logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  const port=process.env.PORT ?? 3000;
  app.use(new LoggerMiddleware().use);
  await app.listen(port);
  console.log(`Conservatoire API is running on: http://localhost:${port}`);
}
bootstrap();
