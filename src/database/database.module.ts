import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import cfg from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: cfg.get('db.host'),
      port: cfg.get('db.port'),
      username: cfg.get('db.username'),
      password: cfg.get('db.password'),
      database: cfg.get('db.database'),
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
