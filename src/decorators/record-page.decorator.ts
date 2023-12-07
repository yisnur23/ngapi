import {IGuanacooRecordPageOptions} from '../interfaces/record-page-options.interface';

export const RecordPage = (
  options: Partial<IGuanacooRecordPageOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:record-page', options || {}, target);
  };
};

export const getRecordPageOptions = (
  target: any,
): IGuanacooRecordPageOptions => {
  return Reflect.getMetadata('panel:record-page', target);
};
