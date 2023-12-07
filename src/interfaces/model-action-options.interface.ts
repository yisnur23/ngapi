import {IconsEnum} from '../enums/icons.enum';

export interface IGuanacooModelActionOptions {
  slug: string;
  label: string;
  labelCreateBtn?: string;
  labelGroupedLink?: string;

  iconName?: IconsEnum;

  ajaxForm: Array<any>;
}
