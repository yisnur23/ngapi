import {ModelAttributeBase} from '../abstracts/model-attribute';
import {ModelAttribute} from '../decorators/model-attribute.decorator';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {ModelAttributeFiltersService} from '../services/model-attribute-filters.service';
import {GuanacooModelBaseService} from '../abstracts-services/model-base.service';
import {IGuanacooModelAttributeOptions} from '../interfaces/model-attribute-options.interface';
import {IGuanacooModel} from '../interfaces/model.interface';
import {IGuanacooModelQuery} from '../interfaces/model-query.interface';

@ModelAttribute({
  slug: 'related-model',
  recordsTableFieldComponent: 'records-table-field-related',
  availableFilters: [IsNullAttributeFilter, IsNotNullAttributeFilter],
})
export class RelatedModelAttribute extends ModelAttributeBase {
  public readonly relatedModel;

  constructor(
    protected readonly modelAttributeFiltersService: ModelAttributeFiltersService,
    protected readonly modelService: GuanacooModelBaseService,
    options: IGuanacooModelAttributeOptions,
    config: {
      label: string;
      slug: string;
      required: boolean;
      displayKey: boolean;
      relatedModel: IGuanacooModel;
    },
  ) {
    super(modelAttributeFiltersService, modelService, options, config);
    const { relatedModel, label, slug } = config;
    this.relatedModel = relatedModel;
    if (!label || label === slug) {
      this.label = this.relatedModel.label;
    }
  }

  public getQueryAggregationNested(
    query: IGuanacooModelQuery,
    ancestorsAttributes: Array<string> = [],
  ) {
    return this.relatedModel.getQueryAggregationNested(
      query,
      ancestorsAttributes,
    );
  }

  public getTransformAttributes(ancestorsAttributes: Array<string>) {
    const prefixedExtAttribute =
      (ancestorsAttributes.length
        ? ancestorsAttributes.join('Ext.') + 'Ext.'
        : '') + this.slug;
    const prefixedAttribute =
      (ancestorsAttributes.length ? ancestorsAttributes.join('.') + '.' : '') +
      this.slug;

    const transformAttributes: object = {};
    transformAttributes[prefixedExtAttribute] =
      '$' + prefixedAttribute + '.' + this.relatedModel.displayKey;
    transformAttributes[prefixedExtAttribute + 'Id'] =
      '$' + prefixedAttribute + '._id';
    // transformAttributes[prefixedExtAttribute + 'Ext'] = '$' + prefixedAttribute + ''
    transformAttributes[prefixedExtAttribute + 'Model'] =
      this.relatedModel.slug;

    // console.log('transformAttributes from', ancestorsAttributes, '/', this.slug, transformAttributes)
    return transformAttributes;
  }

  public getLookupAggregation(path: Array<string> = []): any {
    const { collection: from } = this.relatedModel.schema?.options;
    const prefixedAttribute =
      (path.length ? path.join('.') + '.' : '') + this.slug;

    if (!from) {
      console.log(
        'froooom',
        from,
        'relatedmodel',
        this.slug,
        this.relatedModel.schema,
      );
      return [];
    }

    return [
      {
        $lookup: {
          from,
          localField: prefixedAttribute,
          foreignField: '_id',
          as: prefixedAttribute,
        },
      },
      {
        $unwind: {
          path: '$' + prefixedAttribute,
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }

  public getNestedAttributeByPath(path: string): ModelAttributeBase | void {
    return this.relatedModel.getAttributeByPath(path);
  }

  public getDto() {
    return {
      label: this.label,
      slug: this.slug,
      sortable: true,
      model: this.modelService.slug,
      nested: this.relatedModel.slug,
      displayKey: this.displayKey,
      availableFilters: this.availableFilters.map((af) => af.slug),
    };
  }
}
