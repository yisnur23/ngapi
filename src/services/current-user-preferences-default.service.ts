import {Inject, Injectable, Scope} from '@nestjs/common';
import {IGuanacooCurrentUserPreferencesService} from '../interfaces/current-user-preferences-service.interface';
import {PanelService} from './panel.service';
import {REQUEST} from '@nestjs/core';
import {Request} from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserPreferencesDefaultService
  implements IGuanacooCurrentUserPreferencesService
{
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @Inject(PanelService) private readonly panelService: PanelService,
  ) {}

  getAppService() {
    const { app } = this.req.params || {};
    if (!app) return;
    return this.panelService.getAppServiceBySlug(app);
  }

  async get() {
    return null;
  }

  async del() {
    return null;
  }

  async set() {
    return null;
  }

  private get userId() {
    return null;
  }
}
