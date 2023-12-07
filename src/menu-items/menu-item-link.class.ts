import {IGuanacooMenuItem} from '../interfaces/menu-item.interface';
import {IconsEnum} from '../enums/icons.enum';
import {IGuanacooApp} from '../interfaces/app.interface';
import {PanelService} from '../services/panel.service';

export class MenuItemLink implements IGuanacooMenuItem {
  public path;

  public label;

  public iconName;

  constructor(
    private panelService: PanelService,
    private appService: IGuanacooApp,
    menuItem: {
      path: string;
      label: string;
      iconName?: IconsEnum;
      submenu?: Array<object | IGuanacooMenuItem>;
    },
  ) {
    const { path, label, iconName } = menuItem;
    this.path = path;
    this.label = label;
    this.iconName = iconName;
  }

  public static create(menuItem: {
    path: string;
    label: string;
    iconName?: IconsEnum;
    submenu?: Array<object | IGuanacooMenuItem>;
  }) {
    return (panelService: PanelService, appService: IGuanacooApp) => {
      return new MenuItemLink(panelService, appService, menuItem);
    };
  }

  public getUrl(): string {
    return this.appService.getPath() + this.path;
  }

  public getDto() {
    return {
      label: this.label,
      url: this.getUrl(),
      iconName: this.iconName,
    };
  }
}
