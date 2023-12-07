import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-not-null',
  label: 'Is not NULL',
})
export class IsNotNullAttributeFilter extends ModelAttributeFilterBase {
  getQuery(): object {
    return { $not: { $in: [null, '', 0, {}] } };
  }
}
