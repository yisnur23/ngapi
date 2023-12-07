import {IconsEnum} from '../enums/icons.enum';
import {Schema} from 'mongoose';

export interface IGuanacooModelOptions {
  slug: string;
  label: string;
  plural: string;
  displayKey: string;
  schema: Schema;
  query: any;
  iconName?: IconsEnum;
  filters?: Array<any>;
  modelActions?: Array<any>;
  recordPages?: Array<any>;
}
