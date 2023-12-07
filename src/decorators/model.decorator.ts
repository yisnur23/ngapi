import {IGuanacooModelOptions} from '../interfaces/model-options.interface';

export const Model = (
  options: Partial<IGuanacooModelOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:model', options || {}, target);
  };
};

export const getModelOptions = (target: any): IGuanacooModelOptions => {
  return Reflect.getMetadata('panel:model', target);
};
