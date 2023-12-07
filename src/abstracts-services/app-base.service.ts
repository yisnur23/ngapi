import {PanelService} from '../services/panel.service';
import {IGuanacooApp} from '../interfaces/app.interface';
import {IGuanacooMenuItem} from '../interfaces/menu-item.interface';
import {IGuanacooModel} from '../interfaces/model.interface';
import {AppDto} from '../dto/app.dto';
import {IGuanacooGrid} from '../interfaces/grid.interface';
import {IGuanacooAppOptions} from '../interfaces/app-options.interface';
import {MenuItemFunctionInterface} from '../interfaces';

export class GuanacooAppBase implements IGuanacooApp {
    public readonly slug;
    public readonly iconName;
    public readonly label;
    public readonly menuItems;

    private readonly models: Array<IGuanacooModel>;
    private readonly grids: Array<IGuanacooGrid>;

    constructor(
        private panelService: PanelService,
        private token: string,
        private metadata: IGuanacooAppOptions,
    ) {
        const {menuItems, models, grids, slug, label, iconName} = metadata;
        this.menuItems = this.prepareMenuItems(menuItems);
        this.grids = grids || [];
        this.models = models || [];

        this.label = label;
        this.iconName = iconName;
        this.slug = slug;

        this.panelService.registerAppService(this);
    }

    public hasSlug(slug: string) {
        return this.slug === slug;
    }

    public hasAccess() {
        return true;
    }

    public getPath(): string {
        return '/' + this.slug;
    }

    public getModelsServices(): Array<IGuanacooModel> {
        return this.models
            .map((modelClassRef) => this.getModelServiceByClassRef(modelClassRef))
            .filter((m) => m);
    }

    public getGridsServices(): Array<IGuanacooGrid> {
        return this.grids.map((grid) => {
            return this.panelService.getAppGridServiceByClassRef(this.token, grid);
        });
    }

    public getGridServiceByClassRef(gridClassRef: any | string): IGuanacooGrid {
        return this.panelService.getAppGridServiceByClassRef(
            this.token,
            gridClassRef,
        );
    }

    public getGridServiceBySlug(slug): IGuanacooGrid | void {
        return this.getGridsServices().find(
            (gridService) => gridService && gridService.hasSlug(slug),
        );
    }

    public getModelServiceByClassRef(
        modelClassRef: IGuanacooModel | string,
    ): IGuanacooModel {
        return this.panelService.getAppModelServiceByClassRef(
            this.token,
            modelClassRef,
        );
    }

    public getModelServiceBySlug(slug: string): IGuanacooModel | void {
        return this.getModelsServices().find((modelService) => {
            if (!modelService) {
                return false;
            }
            return modelService.hasSlug!(slug);
        });
    }

    public getModelServiceByModelName(modelName: string): IGuanacooModel | void {
        return this.panelService.getAppModelServiceByModelName(
            this.token,
            modelName,
        );
    }

    public getDto(): AppDto {
        return {
            slug: this.slug,
            link: this.getPath(),
            label: this.label,
            iconName: this.iconName,
        };
    }

    /**
     *
     *
     *
     *
     */
    private prepareMenuItems(
        menuItems: Array<IGuanacooMenuItem | MenuItemFunctionInterface> = [],
    ): Array<IGuanacooMenuItem> {
        const items: Array<IGuanacooMenuItem> = []
        for (const menuItem of menuItems) {
            if (typeof menuItem === 'function' && !menuItem.name) {
                items.push(menuItem(this.panelService, this));
            }
        }
        return items;
    }
}
