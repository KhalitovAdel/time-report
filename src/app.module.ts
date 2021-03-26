import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { DatabaseModule } from './database/database.module';
import { DailyProductivityModule } from './daily-productivity/daily-productivity.module';

@Module({
  imports: [
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        conf: { useFilesystemPublicRoutes: false } as any,
      }),
    ),
    DatabaseModule,
    DailyProductivityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
