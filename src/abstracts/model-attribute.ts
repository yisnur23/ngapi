import { IGuanacooModelAttributeOptions } from '../interfaces/model-attribute-options.interface';
import { GuanacooModelBaseService } from '../abstracts-services/model-base.service';
import { ModelAttributeFiltersService } from '../services/model-attribute-filters.service';
import { ModelAttributeFilterBase } from './model-attribute-filter';
import { IGuanacooModelQuery } from '../interfaces/model-query.interface';

export abstract class ModelAttributeBase {
  protected modelAttributeSlug: string;

  public label: string;
  public slug: string;
  public displayKey: boolean;

  public required: boolean;

  public recordsTableFieldComponent: string;
  public ajaxFormInputComponent: string;
  public availableFilters: Array<ModelAttributeFilterBase>;

  constructor(
    protected readonly modelAttributeFiltersService: ModelAttributeFiltersService,
    protected readonly modelService: GuanacooModelBaseService,
    options: IGuanacooModelAttributeOptions,
    config: {
      label: string;
      slug: string;
      required: boolean;
      displayKey: boolean;
    },
  ) {
    const { label, slug, required, displayKey } = config;
    const {
      slug: modelAttributeSlug,
      recordsTableFieldComponent,
      ajaxFormInputComponent,
      availableFilters,
    } = options;

    this.label = label;
    this.slug = slug;
    this.required = required;
    this.displayKey = displayKey;

    this.modelAttributeSlug = modelAttributeSlug;
    this.recordsTableFieldComponent = recordsTableFieldComponent;
    this.ajaxFormInputComponent = ajaxFormInputComponent;

    this.availableFilters = this.resolveFilters(availableFilters);
  }

  public getQueryAggregationNested(
    query: IGuanacooModelQuery,
    ancestorsAttributes: Array<string> = [],
  ) {
    return this.modelService.getQueryAggregationNested(
      query,
      ancestorsAttributes,
    );
  }

  public getAjaxFormInputDto() {
    const rules: any = {};
    if (this.required) {
      rules.required = true;
    }
    return {
      attribute: this.slug,
      fieldName: this.slug,
      component: this.ajaxFormInputComponent,
      label: this.label,
      rules,
    };
  }

  public getColumnDto(path: string, customWidth: number) {
    return {
      header: this.label,
      attribute: this.slug,
      path,
      displayKey: !path.length ? this.displayKey : false,
      sortable: true,
      width: customWidth || 200,
      recordsTableFieldComponent: this.recordsTableFieldComponent,
      availableFilters: this.availableFilters.map((af) => af.slug),
    };
  }

  public getDto() {
    return {
      label: this.label,
      slug: this.slug,
      sortable: true,
      model: this.modelService.slug,
      nested: false,
      displayKey: this.displayKey,
      availableFilters: this.availableFilters.map((af) => af.slug),
    };
  }

  protected resolveFilters(availableFilters) {
    return availableFilters
      .map((af) => {
        if (typeof af === 'string') {
          return this.modelAttributeFiltersService.getFilterBySlug(af);
        } else {
          return this.modelAttributeFiltersService.getFilterByClassRef(af);
        }
      })
      .filter((af) => af);
  }

  public getLookupAggregation(path: Array<string> = []) {
    path = [];
    return [];
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
    transformAttributes[prefixedExtAttribute] = '$' + prefixedAttribute;
    return transformAttributes;
  }

  public getNestedAttributeByPath(path: string): ModelAttributeBase | void {
    path = '';
    return;
  }
}
