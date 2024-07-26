import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const configService = app.get(ConfigService);

  const port = parseInt(configService.get<string>('APP_PORT'), 10) || 3001; // Fallback to 3000 if APP_PORT is not set

  await app.listen(port);
  //await app.listen(port, '127.0.0.1');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();