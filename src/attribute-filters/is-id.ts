import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {ModelAttributeFilter} from '../decorators/model-attribute-filter.decorator';
import mongoose from 'mongoose';

@ModelAttributeFilter({
    slug: 'is-id',
    label: 'Is #ID',
})
export class IsIdAttributeFilter extends ModelAttributeFilterBase {
    getQuery(value: any) {
        if (typeof value === 'string') {
            return new mongoose.Types.ObjectId(value);
        } else {
            return value
        }
    }
}
