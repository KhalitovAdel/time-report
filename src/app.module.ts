import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        conf: { useFilesystemPublicRoutes: false } as any,
      }),
    ),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
