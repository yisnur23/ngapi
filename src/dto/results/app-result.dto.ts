import {AppDto} from '../app.dto';
import {MenuListItemDto} from '../menu-list-item.dto';

export class AppResultDto {
  apps: Array<AppDto>;
  app: AppDto;
  menuItems: Array<MenuListItemDto>;
}
