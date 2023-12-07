import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-true',
  label: 'Is TRUE',
})
export class IsTrueAttributeFilter extends ModelAttributeFilterBase {
  getQuery(): object {
    return { $eq: true };
  }
}
