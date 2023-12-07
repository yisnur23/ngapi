import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GridTabParam = createParamDecorator(
  (property: string | void, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.gridService) {
      throw new Error('Grid Service not exists on request object. ');
    }

    const tabSlug = request.params[property || 'tab'];
    if (!tabSlug) {
      throw new Error('Tab slug not exists on request object. ');
    }

    request.gridTab = request.gridService.getTabBySlug(tabSlug);

    return request.gridTab;
  },
);
