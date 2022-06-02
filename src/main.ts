import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);

  const config = new DocumentBuilder()
    .setTitle('Short-Link-Bot-API')
    .setDescription('Программный интерфейс для продвинутых.')
    .setVersion('1.0')
    .addTag('links')
    .build();
}
bootstrap();
