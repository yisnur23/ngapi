import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';

@ModelAttributeFilter({
  slug: 'string-contains',
  label: 'String contains',
  component: true,
})
export class StringContainsAttributeFilter extends ModelAttributeFilterBase {
  getQuery(value: any): object {
    return { $regex: value };
  }
}
