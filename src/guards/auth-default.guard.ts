import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

@Injectable()
export class AuthDefaultGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean {
        return false;
    }
}
