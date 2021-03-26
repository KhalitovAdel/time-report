import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DailyProductivityDatabase } from './daily-productivity.database';
import { DailyProductivityService } from './daily-productivity.service';
import {
  DailyProductivityCreateDto,
  DailyProductivityDefaultParamDto,
  DailyProductivityListQueryDto,
  DailyProductivityResponseDto,
  DailyProductivityUpdateBodyDto,
} from './dto/daily-productivity.dto';
import { HttpExceptionFilter } from '../@filters/http-exception.filter';
import { In } from 'typeorm';

@Controller('daily-productivity')
export class DailyProductivityController {
  constructor(protected readonly db: DailyProductivityDatabase, protected readonly service: DailyProductivityService) {}

  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  create(@Body() body: DailyProductivityCreateDto) {
    return this.service.create(body);
  }

  @UseFilters(new HttpExceptionFilter())
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param() param: DailyProductivityDefaultParamDto, @Body() body: DailyProductivityUpdateBodyDto) {
    return this.service.update({ ...param, ...body });
  }

  @UseFilters(new HttpExceptionFilter())
  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  list(@Query() query: DailyProductivityListQueryDto): Promise<DailyProductivityResponseDto> {
    const where = Array.isArray(query.day) ? [{ day: In(query.day) }] : [];
    console.log(query);
    return this.db.list(...(where as any));
  }

  @UseFilters(new HttpExceptionFilter())
  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  delete(@Param() param: DailyProductivityDefaultParamDto) {
    return this.db.delete(param.id);
  }
}
