import {Inject, Injectable} from '@nestjs/common';
import {PanelService} from './panel.service';
import {ModelAttributeFilterBase} from '../abstracts/model-attribute-filter';
import {IsNullAttributeFilter} from '../attribute-filters/is-null.attribute-filter';
import {IsNotNullAttributeFilter} from '../attribute-filters/is-not-null.attribute-filter';
import {StringContainsAttributeFilter} from '../attribute-filters/string-contains.attribute-filter';
import {getModelAttributeFilterOptions} from '../decorators/model-attribute-filter.decorator';
import {IsFalseAttributeFilter} from '../attribute-filters/is-false.attribute-filter';
import {IsTrueAttributeFilter} from '../attribute-filters/is-true.attribute-filter';
import {IsIdAttributeFilter} from '../attribute-filters/is-id';
import {IsInAttributeFilter} from '../attribute-filters/is-in.attribute-filter';
import {IsNotInAttributeFilter} from "../attribute-filters/is-not-in.attribute-filter";

@Injectable()
export class ModelAttributeFiltersService {
  private _attributeFilters: Array<ModelAttributeFilterBase> = [];

  constructor(@Inject(PanelService) private panelService: PanelService) {
    this.registerDefaultModelAttributeFilters();
  }

  getModelAttributeFilters(): Array<ModelAttributeFilterBase> {
    if (!this._attributeFilters.length) {
      this.registerDefaultModelAttributeFilters();
    }
    return this._attributeFilters;
  }

  getFilterBySlug(slug: string) {
    return this._attributeFilters.find((attributeFilter) =>
      attributeFilter.hasSlug(slug),
    );
  }

  getFilterByClassRef(modelAttributeClassRef: any) {
    const { slug } = getModelAttributeFilterOptions(modelAttributeClassRef);
    return this.getFilterBySlug(slug);
  }

  private registerDefaultModelAttributeFilters() {
    const classes = [
      IsNullAttributeFilter,
      IsNotNullAttributeFilter,
      StringContainsAttributeFilter,
      IsFalseAttributeFilter,
      IsTrueAttributeFilter,
      IsIdAttributeFilter,
      IsInAttributeFilter,
      IsNotInAttributeFilter
    ];
    for (const c of classes) {
      this._attributeFilters.push(
        new c(this, getModelAttributeFilterOptions(c)),
      );
    }
  }
}
