import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cfg from 'config';

//TODO: how to reload more fast without nodemon?
async function bootstrap() {
  const server = await NestFactory.create(AppModule);

  await server.listen(cfg.get('http.port'));
}
bootstrap();
