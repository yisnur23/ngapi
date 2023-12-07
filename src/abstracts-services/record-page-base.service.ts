import {PanelService} from '../services/panel.service';
import {IGuanacooModel} from '../interfaces/model.interface';
import {IGuanacooRecordPageOptions} from '../interfaces/record-page-options.interface';
import {getRecordPageTabOptions} from '../decorators/record-page-tab.decorator';

export class RecordPageBaseService {
  public slug;
  public tabs;

  constructor(
    private readonly panelService: PanelService,
    private readonly modelService: IGuanacooModel,
    private options: IGuanacooRecordPageOptions,
  ) {
    const { slug, tabs } = options;
    this.slug = slug;
    this.tabs = this.prepareTabs(tabs);
  }

  public getDto() {
    return {
      slug: this.slug,
      model: this.modelService.slug,
      tabs: this.tabs.map((tab) => tab.getDto()),
    };
  }

  private prepareTabs(tabs: Array<any>) {
    return (tabs || []).map((tab) => {
      const options = getRecordPageTabOptions(tab);
      if (typeof tab === 'function' && tab.name) {
        return new tab(this.panelService, this, this.modelService, options);
      }
    });
  }
}
