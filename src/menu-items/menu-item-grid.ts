import {IGuanacooApp} from '../interfaces/app.interface';
import {IGuanacooMenuItem} from '../interfaces/menu-item.interface';
import {IconsEnum} from '../enums/icons.enum';
import {PanelService} from '../services/panel.service';
import {MenuItemFunctionInterface} from '../interfaces/menu-item-function.interface';

export class MenuItemGrid implements IGuanacooMenuItem {
  public url;
  public label;
  public iconName;
  public path;

  constructor(
    private panelService: PanelService,
    private appService: IGuanacooApp,
    private gridClassRef: any,
    menuItem: {
      label: string;
      iconName?: IconsEnum;
      submenu?: Array<object | IGuanacooMenuItem>;
    },
  ) {
    const { label, iconName } = menuItem;
    this.label = label;
    this.iconName = iconName;
  }

  public static create(
    gridClassRef: any,
    label: string,
    iconName?: IconsEnum,
  ): MenuItemFunctionInterface {
    return (
      panelService: PanelService,
      appService: IGuanacooApp,
    ): IGuanacooMenuItem => {
      return new MenuItemGrid(panelService, appService, gridClassRef, {
        label,
        iconName,
      });
    };
  }

  public getDto() {
    const gridService = this.appService.getGridServiceByClassRef(
      this.gridClassRef,
    );
    return {
      label: this.label,
      url: this.appService.getPath() + gridService.getPath(),
      iconName: this.iconName,
    };
  }
}
