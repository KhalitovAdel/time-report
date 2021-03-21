import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProductivityEntity } from './daily-productivity.entity';
import { DailyProductivityDatabase } from './daily-productivity.database';
import { DailyProductivityService } from './daily-productivity.service';
import { DailyProductivityController } from './daily-productivity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyProductivityEntity])],
  providers: [DailyProductivityDatabase, DailyProductivityService],
  controllers: [DailyProductivityController],
  exports: [DailyProductivityService],
})
export class DailyProductivityModule {}
