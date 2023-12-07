import {PanelService} from '../services/panel.service';
import {IGuanacooGrid} from '../interfaces/grid.interface';
import {GridTabBase} from '../abstracts/grid-tab-base';
import {IGuanacooApp} from '../interfaces/app.interface';

export class GridTabGenerator extends GridTabBase {
  public static create(gridTab: {
    slug: string;
    label: string;
    model: any;
    filter?: any;
  }) {
    return (
      panelService: PanelService,
      gridService: IGuanacooGrid,
      appService: IGuanacooApp,
    ) => {
      return new GridTabGenerator(
        panelService,
        gridService,
        appService,
        gridTab,
      );
    };
  }
}
