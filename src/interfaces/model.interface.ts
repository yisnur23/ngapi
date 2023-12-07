import {Schema} from 'mongoose';
import {IconsEnum} from '../enums/icons.enum';
import {ModelDto} from '../dto/model.dto';
import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelActionBaseService} from '../abstracts-services/model-action-base.service';
import {RecordPageBaseService} from '../abstracts-services/record-page-base.service';
import {IGuanacooModelQuery} from "./model-query.interface";

export interface IGuanacooModel {
  label?: string;
  plural?: string;
  slug?: string;
  iconName?: IconsEnum;
  schema?: Schema;
  filters?: Array<any>;

  modelRef?: any;

  hasSlug?(slug: string);

  get attributes();

  find(query?: IGuanacooModelQuery): Promise<Array<any>>;

  findById(id: string, select: Array<string>);

  count(query?: IGuanacooModelQuery): Promise<number>;

  getModelActionsServices(): Array<ModelActionBaseService>;

  getFilterServiceByClassRef(filterClassRef: any);

  getDto(): ModelDto;

  getAttributeByPath(slug: string): ModelAttributeBase | void;

  getAttribute(attributeSlug: string): ModelAttributeBase | void;

  getModelActionServiceBySlug(
    actionSlug: string,
  ): ModelActionBaseService | void;

  getRecordPages(): Array<RecordPageBaseService>;
}
