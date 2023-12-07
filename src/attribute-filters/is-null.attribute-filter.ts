import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-null',
  label: 'Is NULL',
})
export class IsNullAttributeFilter extends ModelAttributeFilterBase {
  getQuery(): object {
    return { $in: [null, '', 0, {}] };
  }
}
