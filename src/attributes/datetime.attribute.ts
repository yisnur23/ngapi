import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';

@ModelAttribute({
  slug: 'datetime',
  recordsTableFieldComponent: 'records-table-field-datetime',
  availableFilters: ['is-not-null', 'is-null'],
})
export class DatetimeAttribute extends ModelAttributeBase {}
