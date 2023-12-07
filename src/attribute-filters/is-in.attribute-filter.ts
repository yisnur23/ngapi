import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-in',
  label: 'Is in',
  component: true,
})
export class IsInAttributeFilter extends ModelAttributeFilterBase {
  getQuery(value: string | string[]): object {
    if (typeof value === 'string') value = [value];
    return { $in: value };
  }
}
