import {IconsEnum} from '../enums/icons.enum';

export interface IGuanacooMenuItem {
  path?: string;

  label: string;

  iconName?: IconsEnum;

  exact?: boolean;

  submenu?: Array<IGuanacooMenuItem>;

  getDto(): any;
}
