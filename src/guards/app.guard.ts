import {BadRequestException, CanActivate, ExecutionContext, Inject, Injectable,} from '@nestjs/common';
import {Observable} from 'rxjs';
import {PanelService} from '../services/panel.service';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    @Inject(PanelService) private readonly panelService: PanelService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { app: appSlug } = request.params;

    if (!appSlug) {
      return false;
    }

    const appService = this.panelService.getAppServiceBySlug(appSlug);

    if (!appService) {
      return false;
    }

    if (!appService.hasAccess()) {
      throw new BadRequestException({
        error: 'Invalid access',
        errorCode: 'invalid_access',
      });
    }

    request.appService = appService;

    console.log('app guard - request user', request.user);

    return true;
  }
}
