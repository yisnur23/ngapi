import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {IsTrueAttributeFilter} from '../attribute-filters/is-true.attribute-filter';
import {IsFalseAttributeFilter} from '../attribute-filters/is-false.attribute-filter';

@ModelAttribute({
  slug: 'boolean',
  recordsTableFieldComponent: 'records-table-field-boolean',
  ajaxFormInputComponent: 'ajax-form-input-boolean',
  availableFilters: [
    IsNullAttributeFilter,
    IsNotNullAttributeFilter,
    IsTrueAttributeFilter,
    IsFalseAttributeFilter,
  ],
})
export class BooleanAttribute extends ModelAttributeBase {}
