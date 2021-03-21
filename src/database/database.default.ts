import { Repository } from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export class DatabaseDefault<ENTITY, CREATE, UPDATE> {
  constructor(protected readonly repository: Repository<ENTITY>) {}

  async create(params: CREATE, options?: SaveOptions) {
    return this.repository.save(params);
  }

  async update(id: number, toUpdate: QueryDeepPartialEntity<UPDATE>, select?: (keyof ENTITY)[]): Promise<ENTITY> {
    return this.repository
      .createQueryBuilder()
      .update()
      .set(toUpdate as any)
      .where('id = :id', { id })
      .returning((select as any) || '*')
      .execute()
      .then(({ raw }) => raw?.find((el) => el));
  }

  fetch(id: number, select?: (keyof ENTITY)[]): Promise<ENTITY> {
    return this.repository.findOne(id, { select }) as any;
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }

  async list(options?: FindManyOptions<ENTITY>) {
    const [document, count] = await this.repository.findAndCount(options);
    return {
      document: document || [],
      count: count || 0,
    };
  }
}
