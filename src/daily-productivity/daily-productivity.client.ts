import { AxiosInstance } from 'axios';
import {
  DailyProductivityCreateDto,
  DailyProductivityDefaultParamDto,
  DailyProductivityListQueryDto,
  DailyProductivityResponseDto,
  DailyProductivityUpdateBodyDto,
} from './dto/daily-productivity.dto';
import { DailyProductivityEntity } from './daily-productivity.entity';
import { stringify } from 'qs';

export class DailyProductivityClient {
  protected url = 'daily-productivity';
  constructor(protected readonly http: AxiosInstance) {}

  create(data: DailyProductivityCreateDto) {
    return this.http
      .request<DailyProductivityEntity>({ method: 'POST', data, url: this.url })
      .then(({ data }) => data);
  }

  update(params: DailyProductivityDefaultParamDto & DailyProductivityUpdateBodyDto) {
    const { id, ...data } = params;
    return this.http
      .request<DailyProductivityEntity>({ method: 'PUT', data, url: this.url.concat('/', `${id}`) })
      .then(({ data }) => data);
  }

  list(params?: DailyProductivityListQueryDto) {
    return this.http
      .request<DailyProductivityResponseDto>({ method: 'GET', url: this.url + '/?' + stringify(params) })
      .then(({ data }) => data);
  }

  delete(params: DailyProductivityDefaultParamDto) {
    return this.http.request({ method: 'DELETE', url: this.url + '/' + params.id }).then(({ data }) => data);
  }
}
