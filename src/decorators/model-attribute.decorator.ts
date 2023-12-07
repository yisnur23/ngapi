import {IGuanacooModelAttributeOptions} from '../interfaces/model-attribute-options.interface';

export const ModelAttribute = (
  options: Partial<IGuanacooModelAttributeOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:model-attribute', options || {}, target);
  };
};

export const getModelAttributeOptions = (
  target: any,
): IGuanacooModelAttributeOptions => {
  return Reflect.getMetadata('panel:model-attribute', target);
};
