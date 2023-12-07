import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {lastValueFrom, Observable} from 'rxjs';
import {PanelService} from "../services";

@Injectable()
export class AuthGuard implements CanActivate {

    public constructor(
        private readonly panelService: PanelService
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const guards = [ this.panelService.getAuthGuard() ]
        if (guards) {
            for (const guard of guards) {
                const result = guard.canActivate(context);
                if (await this.pickResult(result)) {
                    continue;
                }
                return false;
            }
        }
        return true;
    }

    public async pickResult(
        result: boolean | Promise<boolean> | Observable<boolean>,
    ): Promise<boolean> {
        if (result instanceof Observable) {
            return lastValueFrom(result);
        }
        return result;
    }
}
