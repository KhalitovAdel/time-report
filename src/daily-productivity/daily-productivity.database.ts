import { DatabaseDefault } from '../database/database.default';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyProductivityEntity } from './daily-productivity.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DailyProductivityCreateDto, DailyProductivityUpdateDto } from './dto/daily-productivity.dto';

@Injectable()
export class DailyProductivityDatabase extends DatabaseDefault<
  DailyProductivityEntity,
  DailyProductivityCreateDto,
  DailyProductivityUpdateDto
> {
  constructor(
    @InjectRepository(DailyProductivityEntity) protected readonly repository: Repository<DailyProductivityEntity>,
  ) {
    super(repository);
  }
}
