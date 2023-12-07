import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'is-not-in',
  label: 'Is not in',
  component: true,
})
export class IsNotInAttributeFilter extends ModelAttributeFilterBase {
  getQuery(value: string | string[]): object {
    if (typeof value === 'string') value = [value];
    return { $nin: value };
  }
}
