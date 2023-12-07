import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('User not exists on request object. ');
    }
    return request.user;
  },
);
