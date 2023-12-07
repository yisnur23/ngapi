import {IconsEnum} from '../enums/icons.enum';
import {IGuanacooMenuItem} from './menu-item.interface';
import {MenuItemFunctionInterface} from './menu-item-function.interface';

export interface IGuanacooAppOptions {
  slug: string;
  label: string;
  iconName?: IconsEnum;
  menuItems?: Array<IGuanacooMenuItem | MenuItemFunctionInterface>;
  models?: Array<any>;
  grids?: Array<any>;
}
