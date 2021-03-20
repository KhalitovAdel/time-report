import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import cfg from 'config';

@Injectable()
export class RenderInterceptor implements NestInterceptor {
  constructor(protected readonly template: string) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const isRender = !request?.query?.hasOwnProperty(cfg.get<string>('http.jsonQueryKey'));
    const result = await next.handle().toPromise();
    return isRender ? response.render(this.template) : result;
  }
}
