import {IGuanacooAppOptions} from '../interfaces/app-options.interface';

export const App = (
  options: Partial<IGuanacooAppOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:app', options || {}, target);
  };
};

export const getAppOptions = (target: any): IGuanacooAppOptions => {
  return Reflect.getMetadata('panel:app', target);
};
