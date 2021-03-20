import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RenderInterceptor } from './@interceptors/Render.interceptor';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseInterceptors(new RenderInterceptor('home'))
  getHello() {
    return { name: 'adel' };
  }
}
