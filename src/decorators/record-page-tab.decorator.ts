import {IGuanacooRecordPageTabOptions} from '../interfaces/record-page-tab-options.interface';

export const RecordPageTab = (
  options: Partial<IGuanacooRecordPageTabOptions> = {},
): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata('panel:record-page-tab', options || {}, target);
  };
};

export const getRecordPageTabOptions = (
  target: any,
): IGuanacooRecordPageTabOptions => {
  return Reflect.getMetadata('panel:record-page-tab', target);
};
