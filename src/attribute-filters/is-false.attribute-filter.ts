import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-false',
  label: 'Is FALSE',
})
export class IsFalseAttributeFilter extends ModelAttributeFilterBase {
  getQuery(): object {
    return { $eq: false };
  }
}
