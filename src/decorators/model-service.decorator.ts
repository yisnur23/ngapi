import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const ModelService = createParamDecorator(
  (
    data: { appParam: string; gridParam: string } | void,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.modelService) {
      throw new Error('Model Service not exists on request object. ');
    }
    return request.modelService;
  },
);
