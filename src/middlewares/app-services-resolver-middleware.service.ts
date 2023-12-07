import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Response} from 'express';
import {PanelService} from '../services/panel.service';

@Injectable()
export class AppServicesResolverMiddleware implements NestMiddleware {
  constructor(
    @Inject(PanelService) private readonly panelService: PanelService,
  ) {}

  use(req: /*Request*/ any, res: Response, next: NextFunction) {

    const {
      app: appSlug,
      grid: gridSlug,
      model: modelSlug,
      modelAction: modelActionSlug,
    } = req.params;

    if (!appSlug) {
      return next();
    }
    const appService = this.panelService.getAppServiceBySlug(appSlug);
    if (!appService) {
      return false;
    }
    req.appService = appService;

    if (gridSlug) {
      req.gridService = appService.getGridServiceBySlug(gridSlug);
    }

    if (modelSlug) {
      req.modelService = appService.getModelServiceBySlug(modelSlug);
      if (req.modelService && modelActionSlug) {
        req.modelActionService =
          req.modelService.getModelActionServiceBySlug(modelActionSlug);
      }
    }

    next();
  }
}
