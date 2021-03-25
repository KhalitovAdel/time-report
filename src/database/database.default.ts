import { Repository } from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export class DatabaseDefault<ENTITY, CREATE, UPDATE> {
  constructor(protected readonly repository: Repository<ENTITY>) {}

  async create(params: CREATE, options?: SaveOptions) {
    return this.repository.save(params, options);
  }

  async update(id: number, toUpdate: DeepPartial<UPDATE>, options?: SaveOptions): Promise<ENTITY> {
    const currentValue = await this.repository.findOne(id);
    if (!currentValue) throw new Error(`Document with id=${id} not found in database.`);
    return this.repository.save(
      {
        ...currentValue,
        ...toUpdate,
      },
      options,
    );
  }

  fetch(id: number, select?: (keyof ENTITY)[]) {
    return this.repository.findOne(id, { select }) as Promise<ENTITY>;
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
