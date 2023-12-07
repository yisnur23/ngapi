import {IGuanacooModel} from './model.interface';
import {IconsEnum} from '../enums/icons.enum';
import {IGuanacooMenuItem} from './menu-item.interface';
import {AppDto} from '../dto/app.dto';
import {IGuanacooGrid} from './grid.interface';

export interface IGuanacooApp {
  slug: string;
  label: string;
  iconName: IconsEnum;
  menuItems: Array<IGuanacooMenuItem>;

  // models?: Array<IGuanacooModel | object>,

  hasSlug(slug: string): boolean;

  hasAccess(user?: object): boolean;

  getPath(): string;

  getModelsServices(): Array<IGuanacooModel>;

  getModelServiceByClassRef(
    modelClassRef: IGuanacooModel | string,
  ): IGuanacooModel;

  getModelServiceBySlug(slug: string): IGuanacooModel | void;

  getGridsServices(): Array<IGuanacooGrid>;

  getGridServiceByClassRef(gridClassRef: any | string): IGuanacooGrid;

  getGridServiceBySlug(slug: string): IGuanacooGrid | void;

  getDto(): AppDto;

  getModelServiceByModelName(ref: string): IGuanacooModel | void;
}
