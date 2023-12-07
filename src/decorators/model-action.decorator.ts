import {IGuanacooModelActionOptions} from '../interfaces/model-action-options.interface';

export const ModelAction = (
  options: Partial<IGuanacooModelActionOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:model-action', options || {}, target);
  };
};

export const getModelActionOptions = (
  target: any,
): IGuanacooModelActionOptions => {
  return Reflect.getMetadata('panel:model-action', target);
};
