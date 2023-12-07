import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';

@ModelAttribute({
  slug: 'url',
  recordsTableFieldComponent: 'records-table-field-url',
  availableFilters: ['is-not-null', 'is-null', 'contains'],
})
export class UrlAttribute extends ModelAttributeBase {}
