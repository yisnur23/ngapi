import IGuanacooGridTabOptions from '../interfaces/grid-tab-options.interface';

export const GridTab = (
  options: Partial<IGuanacooGridTabOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:grid-tab', options || {}, target);
  };
};

export const getGridTabOptions = (target: any): IGuanacooGridTabOptions => {
  return Reflect.getMetadata('panel:grid-tab', target);
};
