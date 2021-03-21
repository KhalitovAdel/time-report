import { Injectable } from '@nestjs/common';
import { DailyProductivityDatabase } from './daily-productivity.database';
import { DailyProductivityCreateDto, DailyProductivityUpdateDto } from './dto/daily-productivity.dto';

@Injectable()
export class DailyProductivityService {
  constructor(protected readonly db: DailyProductivityDatabase) {}

  public async create(params: DailyProductivityCreateDto) {
    const todayIsProgress = !params.finish
      ? await this.db.list({ where: { day: params.day } }).then(({ count }) => !!count)
      : false;
    if (todayIsProgress)
      throw new Error('Cannot create new productivity without finish param, while have active productivity.');
    return this.db.create(params);
  }

  public async update(params: DailyProductivityUpdateDto) {
    const { id, ...other } = params;
    const productivity = await this.db.fetch(id);
    if (params.finish <= productivity?.start)
      throw new Error('The finish date is incorrect, it must be greater than the start date.');
    return this.db.update(id, other);
  }
}
