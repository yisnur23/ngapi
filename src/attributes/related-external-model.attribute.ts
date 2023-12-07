import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {ModelAttributeFiltersService} from '../services/model-attribute-filters.service';
import {GuanacooModelBaseService} from '../abstracts-services/model-base.service';
import {IGuanacooModelAttributeOptions} from '../interfaces/model-attribute-options.interface';
import {IGuanacooModel} from '../interfaces/model.interface';
import {IGuanacooApp} from '../interfaces/app.interface';

@ModelAttribute({
  slug: 'related-external-model',
  recordsTableFieldComponent: 'records-table-field-related-external',
  availableFilters: [IsNullAttributeFilter, IsNotNullAttributeFilter],
})
export class RelatedExternalModelAttribute extends ModelAttributeBase {
  public readonly externalModel;
  public readonly relatedApp;

  constructor(
    protected readonly modelAttributeFiltersService: ModelAttributeFiltersService,
    protected readonly modelService: GuanacooModelBaseService,
    options: IGuanacooModelAttributeOptions,
    config: {
      label: string;
      slug: string;
      required: boolean;
      displayKey: boolean;
      externalModel: IGuanacooModel;
      relatedApp: IGuanacooApp;
    },
  ) {
    super(modelAttributeFiltersService, modelService, options, config);
    this.externalModel = config.externalModel;
    this.relatedApp = config.relatedApp;
  }
}
