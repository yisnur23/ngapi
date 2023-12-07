import {IGuanacooModelAttributeFilterOptions} from '../interfaces/model-attribute-filter-options.interface';

export const ModelAttributeFilter = (
  options: Partial<IGuanacooModelAttributeFilterOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(
      'panel:model-attribute-filter',
      options || {},
      target,
    );
  };
};

export const getModelAttributeFilterOptions = (
  target: any,
): IGuanacooModelAttributeFilterOptions => {
  return Reflect.getMetadata('panel:model-attribute-filter', target);
};
