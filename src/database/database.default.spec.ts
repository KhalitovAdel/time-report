import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { DatabaseDefault } from './database.default';

@Entity()
class ExampleDatabase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;
}

describe('CRUD', () => {
  let repository: Repository<ExampleDatabase>;
  let doc: ExampleDatabase;
  let service: DatabaseDefault<ExampleDatabase, Omit<ExampleDatabase, 'id'>, Omit<ExampleDatabase, 'id'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([ExampleDatabase])],
    }).compile();
    const repositoryToken = getRepositoryToken(ExampleDatabase);
    repository = module.get(repositoryToken);
    service = new DatabaseDefault(repository);
  });

  afterEach(async () => {
    await repository.delete(doc.id);
  });

  test('should create works', async () => {
    doc = await service.create({ name: 'adel' });
    expect(doc).toBeDefined();
  });

  test('should update works', async () => {
    doc = await service.create({ name: 'adel' });
    const newName = 'lol';
    const updatedDoc = await service.update(doc.id, { name: newName }, ['name']);
    expect(updatedDoc.name).toBe(newName);
  });

  test('should find works', async () => {
    doc = await service.create({ name: 'adel' });
    const docum = await service.fetch(doc.id, ['name']);
    expect(docum).toBeDefined();
  });

  test('should delete works', async () => {
    doc = await service.create({ name: 'adel' });
    await service.delete(doc.id);
    const docum = await service.fetch(doc.id);
    expect(docum).not.toBeDefined();
  });

  test('should list works', async () => {
    doc = await service.create({ name: 'adel' });
    const result = await service.list({ take: 1 });
    expect(typeof result.count === 'number').toBe(true);
    expect(Array.isArray(result.document)).toBe(true);
  });
});
