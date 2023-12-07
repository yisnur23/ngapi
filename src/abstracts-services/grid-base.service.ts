import {PanelService} from '../services/panel.service';
import {IGuanacooApp} from '../interfaces/app.interface';
import {IGuanacooGrid} from '../interfaces/grid.interface';
import {GridTabGenerator} from '../generators/grid-tab.generator';
import {IGuanacooGridOptions} from '../interfaces/grid-options.interface';
import {getGridTabOptions} from '../decorators/grid-tab.decorator';
import {IGuanacooCurrentUserPreferencesService} from '../interfaces/current-user-preferences-service.interface';

export abstract class GuanacooGridBaseService implements IGuanacooGrid {
  public slug;
  public tabs;

  private _tabs;

  constructor(
    private panelService: PanelService,
    private appService: IGuanacooApp,
    private token: string,
    private grid: IGuanacooGridOptions,
  ) {
    const { slug, tabs } = this.grid;
    this.slug = slug;
    this.tabs = tabs;
  }

  public getPath(): string {
    return '/grid/' + this.slug;
  }

  public getTabs(): Array<GridTabGenerator> {
    if (this._tabs) return this._tabs;
    this._tabs = (this.tabs || []).map((tab) => {
      if (typeof tab === 'function' && !tab.name) {
        return tab(this.panelService, this, this.appService);
      } else {
        const gridTabOptions = getGridTabOptions(tab);
        return new tab(
          this.panelService,
          this,
          this.appService,
          gridTabOptions,
        );
      }
    });
    return this._tabs;
  }

  public getTabBySlug(slug: string): GridTabGenerator {
    if (!this._tabs) this.getTabs();
    return (this._tabs || []).find((tab) => tab.slug === slug);
  }

  public getUrl(): string {
    return this.appService.getPath() + this.getPath();
  }

  public hasSlug(slug): boolean {
    return slug === this.slug;
  }

  public async userGetDto(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
  ): Promise<{ slug: string; url: string; tabs: Array<any> }> {
    const grid = await this.getDto();
    const tabs: Array<any> = [];
    for (const tab of this.getTabs()) {
      const preferenceBaseName = `app:${this.appService.slug}-grid:${this.slug}-tab:${tab.slug}`;
      const userColumns =
        (await currentUserPreferencesService.get(
          `${preferenceBaseName}-columns`,
        )) || [];
      const userColumnsWidths =
        (await currentUserPreferencesService.get(
          `${preferenceBaseName}-columnswidth`,
        )) || {};
      const tabDto = await tab.getDto(userColumns, userColumnsWidths);
      tabs.push(tabDto);
    }
    return {
      ...grid,
      tabs,
    };
  }

  public async getDto(): Promise<{ slug: string; url: string }> {
    return {
      slug: this.slug,
      url: this.appService.getPath() + this.getPath(),
    };
  }
}
