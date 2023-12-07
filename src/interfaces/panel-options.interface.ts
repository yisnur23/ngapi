import {IGuanacooApp} from './app.interface';
import {Type} from '@nestjs/common';

export interface IGuanacooPanelOptions {
  apps: (Partial<IGuanacooApp> | Type)[];
  userPreferences?: any;
  authGuard?: any;
}
