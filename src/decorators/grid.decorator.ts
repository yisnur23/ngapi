import {IGuanacooGridOptions} from '../interfaces/grid-options.interface';

export const Grid = (
  options: Partial<IGuanacooGridOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:grid', options || {}, target);
  };
};

export const getGridOptions = (target: any): IGuanacooGridOptions => {
  return Reflect.getMetadata('panel:grid', target);
};
