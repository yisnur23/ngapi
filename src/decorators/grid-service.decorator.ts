import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GridService = createParamDecorator(
  (
    data: { appParam: string; gridParam: string } | void,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.gridService) {
      throw new Error('Grid Service not exists on request object. ');
    }
    return request.gridService;
  },
);
