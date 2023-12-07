import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const AppService = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.appService) {
      throw new Error('App Service not exists on request object. ');
    }
    return request.appService;
  },
);
