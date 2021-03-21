import { DailyProductivityEntity } from '../daily-productivity.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNumber, IsOptional, Validate } from 'class-validator';
import { ValidDate } from '../../@validators/valid-date.validator';

export class DailyProductivityCreateDto extends OmitType(DailyProductivityEntity, ['id'] as const) {}

export class DailyProductivityUpdateDto extends OmitType(DailyProductivityEntity, ['day', 'start', 'finish'] as const) {
  @ApiProperty()
  @IsNumber()
  finish: number;
}

export class DailyProductivityDefaultParamDto extends OmitType(DailyProductivityUpdateDto, ['finish'] as const) {}
export class DailyProductivityUpdateBodyDto extends OmitType(DailyProductivityUpdateDto, ['id'] as const) {}

export class DailyProductivityListQueryDto {
  @ApiProperty()
  @IsOptional()
  @Validate(ValidDate, { each: true })
  day?: string[];
}
