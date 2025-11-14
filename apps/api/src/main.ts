import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(json({ limit: '60mb' }));

  const port = configService.get<number>('api.port') ?? 3000;
  await app.listen(port);
}
bootstrap().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
