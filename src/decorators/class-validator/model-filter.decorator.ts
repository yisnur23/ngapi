import {IGuanacooModelFilterOptions} from '../../interfaces/model-filter-options.interface';

export const ModelFilter = (
  options: Partial<IGuanacooModelFilterOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:model-filter', options || {}, target);
  };
};

export const getModelFilterOptions = (
  target: any,
): IGuanacooModelFilterOptions => {
  return Reflect.getMetadata('panel:model-filter', target);
};
