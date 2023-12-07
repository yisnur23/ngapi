import {PanelService} from '../services';
import {IGuanacooApp} from './app.interface';
import {IGuanacooMenuItem} from './menu-item.interface';

export type MenuItemFunctionInterface = (
  panelService: PanelService,
  appService: IGuanacooApp,
) => IGuanacooMenuItem;
