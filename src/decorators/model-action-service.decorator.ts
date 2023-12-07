import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const ModelActionService = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.modelActionService) {
      throw new Error('Model Action Service not exists on request object. ');
    }
    return request.modelActionService;
  },
);
