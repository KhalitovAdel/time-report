import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsOptional, Validate } from 'class-validator';
import { ValidDate } from '../@validators/valid-date.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const fromNullableStringToInt = (value: null | string) => {
  return typeof value === 'string' ? parseFloat(value) : value;
};

@Entity()
export class DailyProductivityEntity {
  @ApiProperty()
  @Transform(({ value }) => fromNullableStringToInt(value))
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNumber()
  @Column({
    type: 'bigint',
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return fromNullableStringToInt(value);
      },
    },
  })
  start: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Column({
    type: 'bigint',
    default: null,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return fromNullableStringToInt(value);
      },
    },
  })
  finish?: number;

  @ApiProperty()
  @Validate(ValidDate)
  @Column({ type: 'text' })
  day: string;
}
