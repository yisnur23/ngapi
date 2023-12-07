import { PanelService } from '../services/panel.service';
import { IGuanacooModel } from '../interfaces/model.interface';
import { RecordPageBaseService } from '../abstracts-services/record-page-base.service';
import { IGuanacooRecordPageTabOptions } from '../interfaces/record-page-tab-options.interface';

export class RecordPageTabBase {
  public slug;
  public label;

  constructor(
    private readonly panelService: PanelService,
    private readonly recordPage: RecordPageBaseService,
    private readonly modelService: IGuanacooModel,
    private options: IGuanacooRecordPageTabOptions,
  ) {
    const { slug, label } = options;
    this.slug = slug;
    this.label = label;
  }

  public getDto() {
    return {
      slug: this.slug,
      label: this.label,
    };
  }
}
