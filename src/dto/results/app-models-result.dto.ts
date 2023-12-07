import {ModelDto} from '../model.dto';
import {ModelAttributeFilterDto} from '../model-attribute-filter.dto';

export class AppModelsResultDto {
  models: Array<ModelDto>;
  modelsActions: Array<any>;
  modelsAttributes: Array<any>;
  recordPages: Array<any>;
  attributeFilters: Array<ModelAttributeFilterDto>;
}
