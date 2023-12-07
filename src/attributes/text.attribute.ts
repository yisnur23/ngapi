import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {StringContainsAttributeFilter} from '../attribute-filters/string-contains.attribute-filter';
import {IsIdAttributeFilter} from '../attribute-filters/is-id';

@ModelAttribute({
  slug: 'text',
  recordsTableFieldComponent: 'records-table-field-text',
  ajaxFormInputComponent: 'ajax-form-input-text',
  availableFilters: [
    IsNotNullAttributeFilter,
    IsNullAttributeFilter,
    StringContainsAttributeFilter,
    IsIdAttributeFilter,
  ],
})
export class TextAttribute extends ModelAttributeBase {}
