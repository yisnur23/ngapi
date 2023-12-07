import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IGuanacooModelAttributeOptions} from '../interfaces/model-attribute-options.interface';
import {ModelAttributeFiltersService} from '../services/model-attribute-filters.service';
import {GuanacooModelBaseService} from '../abstracts-services/model-base.service';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsInAttributeFilter} from '../attribute-filters/is-in.attribute-filter';
import {IsNotInAttributeFilter} from "../attribute-filters/is-not-in.attribute-filter";

@ModelAttribute({
  slug: 'list',
  recordsTableFieldComponent: 'records-table-field-badge',
  availableFilters: [
    IsNotNullAttributeFilter,
    IsNullAttributeFilter,
    IsInAttributeFilter,
    IsNotInAttributeFilter
  ],
})
export class ListAttribute extends ModelAttributeBase {
  public readonly list;

  constructor(
    protected readonly modelAttributeFiltersService: ModelAttributeFiltersService,
    protected readonly modelService: GuanacooModelBaseService,
    options: IGuanacooModelAttributeOptions,
    config: {
      label: string;
      slug: string;
      required: boolean;
      displayKey: boolean;
      list: Array<any>;
    },
  ) {
    super(modelAttributeFiltersService, modelService, options, config);
    this.list = config.list;
  }

  public getColumnDto(path, customWidth: number) {
    return Object.assign(super.getColumnDto(path, customWidth), {
      list: this.list,
    });
  }

  public getDto() {
    return Object.assign(super.getDto(), { list: this.list });
  }
}
