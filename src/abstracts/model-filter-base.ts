import { PanelService } from '../services/panel.service';
import { IGuanacooModel } from '../interfaces/model.interface';
import { IGuanacooModelFilterOptions } from '../interfaces/model-filter-options.interface';

export class ModelFilterBase {
  public slug;
  public criteria;
  public sort;

  constructor(
    private panelService: PanelService,
    private modelService: IGuanacooModel,
    private options: IGuanacooModelFilterOptions,
  ) {
    const { slug, criteria, sort } = options;
    this.slug = slug;
    this.criteria = criteria;
    this.sort = sort;
  }

  public hasSlug(slug): boolean {
    return this.slug === slug;
  }
}
