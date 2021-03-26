import { DailyProductivityEntity } from '../../../src/daily-productivity/daily-productivity.entity';
import Timeout = NodeJS.Timeout;

export interface TimeMetricState {
  entities: DailyProductivityEntity[];
  currentDay: string;
  timezone: number;
  currentTime: number;
  interval?: Timeout;
}
