import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';

@ModelAttribute({
  slug: 'array',
  recordsTableFieldComponent: 'records-table-field-hidden',
  availableFilters: [IsNullAttributeFilter, IsNotNullAttributeFilter],
})
export class ArrayAttribute extends ModelAttributeBase {}
