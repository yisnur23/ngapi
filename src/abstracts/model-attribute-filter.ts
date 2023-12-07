import { IGuanacooModelAttributeFilterOptions } from '../interfaces/model-attribute-filter-options.interface';
import { ModelAttributeFiltersService } from '../services/model-attribute-filters.service';
import { ModelAttributeFilterDto } from '../dto/model-attribute-filter.dto';
import { getModelAttributeFilterOptions } from '../decorators/model-attribute-filter.decorator';
import {IGuanactoModelAttributeFilterObject} from "../interfaces/model-attribute-filter-object.interface";

export abstract class ModelAttributeFilterBase {
  public readonly slug: string;
  public readonly label: string;

  public readonly component: string | boolean | undefined;

  constructor(
    private modelAttributeFiltersService: ModelAttributeFiltersService,
    private options: IGuanacooModelAttributeFilterOptions,
  ) {
    const { slug, label, component } = options;
    this.slug = slug;
    this.label = label;
    this.component = component;
  }

  public getDto(): ModelAttributeFilterDto {
    return {
      slug: this.slug,
      label: this.label,
      component: this.component,
    };
  }

  public hasSlug(slug: string): boolean {
    return this.slug === slug;
  }

  public getQuery(value?: any): object {
    return {};
  }

  static filter(value?: any): IGuanactoModelAttributeFilterObject {
    const { slug } = getModelAttributeFilterOptions(this);
    return {
      slug,
      value,
    };
  }
}
