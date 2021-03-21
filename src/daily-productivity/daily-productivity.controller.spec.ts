import { Test, TestingModule } from '@nestjs/testing';
import { DailyProductivityModule } from './daily-productivity.module';
import { DailyProductivityDatabase } from './daily-productivity.database';
import { DailyProductivityEntity } from './daily-productivity.entity';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import moment from 'moment';
import { DailyProductivityCreateDto, DailyProductivityUpdateBodyDto } from './dto/daily-productivity.dto';
import { DatabaseModule } from '../database/database.module';
import { stringify } from 'qs';

describe('CRUD', () => {
  let db: DailyProductivityDatabase;
  let document: DailyProductivityEntity;
  let app: INestApplication;
  const successCreatePayload = Object.freeze({
    start: moment().add(-2, 'hours').unix(),
    day: moment().format('DD.MM.YYYY'),
  } as DailyProductivityCreateDto);

  jest.setTimeout(1000 * 60 * 60 * 2);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DailyProductivityModule, DatabaseModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    db = app.get<DailyProductivityDatabase, DailyProductivityDatabase>(DailyProductivityDatabase);
  });

  afterEach(async () => {
    await db.delete(document.id);
  });

  test('should create works', async () => {
    const result = await request(app.getHttpServer())
      .post('/daily-productivity')
      .send(successCreatePayload)
      .then(({ body }) => (document = body));
    expect(result).toBeDefined();
  });

  //TODO: Need to serialized result, why typeorm return bigint as string
  test('should update works', async () => {
    const result = await request(app.getHttpServer())
      .post('/daily-productivity')
      .send(successCreatePayload)
      .then(({ body }) => (document = body));

    const updatedResult = await request(app.getHttpServer())
      .put(`/daily-productivity/${result.id}`)
      .send({ finish: moment().add(2, 'hours').unix() } as DailyProductivityUpdateBodyDto)
      .then(({ body }) => body);

    expect(updatedResult).toBeDefined();
  });

  test('should list work', async () => {
    const doc = await request(app.getHttpServer())
      .post('/daily-productivity')
      .send(successCreatePayload)
      .then(({ body }) => (document = body));
    const query = stringify({ day: [successCreatePayload.day] });

    const result = await request(app.getHttpServer())
      .get(`/daily-productivity/?${query}`)
      .then(({ body }) => body);
    expect(doc).toBeDefined();
    expect(result.count).toBeDefined();
  });
});
