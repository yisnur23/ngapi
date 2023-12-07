import {Injectable} from '@nestjs/common';
import {IGuanacooApp} from '../interfaces/app.interface';
import {ModuleRef} from '@nestjs/core';
import {getModelToken} from '@nestjs/mongoose/dist/common/mongoose.utils';
import {IGuanacooModel} from '../interfaces/model.interface';

@Injectable()
export class PanelService {
    private apps: Array<IGuanacooApp> = [];
    private models: Array<IGuanacooModel> = [];

    constructor(private moduleRef: ModuleRef) {
    }

    getAppsServices(): Array<IGuanacooApp> {
        return this.apps;
    }

    getAppServiceBySlug(slug: string): IGuanacooApp | void {
        return this.apps.find((app) => app.hasSlug(slug));
    }

    getAppServiceFromToken(token: string): IGuanacooApp | void {
        return this.moduleRef.get(token, {strict: false});
    }

    getAppModelServiceByClassRef(appToken: string, modelClassRef: string | any) {
        return this.moduleRef.get(
            appToken +
            (typeof modelClassRef === 'string'
                ? modelClassRef
                : modelClassRef.name),
        );
    }

    getAppModelServiceByModelName(
        appToken: string,
        modelClassName: string,
    ): IGuanacooModel | void {
        const appService = this.getAppServiceFromToken(appToken);
        if (!appService) {
            return;
        }
        return appService.getModelsServices().find((model) => {
            return model.modelRef.name === modelClassName;
        });
    }

    getAppGridServiceByClassRef(appToken: string, gridClassRef: any) {
        return this.moduleRef.get(appToken + gridClassRef.name);
    }

    getAppQueryServiceByModelRef(appToken: string, modelClassRef: any) {
        return this.moduleRef.get(
            appToken + getModelToken(modelClassRef.name) + 'QueryService',
        );
    }

    getRef(ref: any) {
        return this.moduleRef.get(ref);
    }

    registerAppService(appService: IGuanacooApp) {
        this.apps.push(appService);
    }

    registerAppModelService(appToken: string, modelService: IGuanacooModel) {
        this.models.push(modelService);
    }

    getAuthGuard() {
        return this.moduleRef.get('GUANACOO_AUTH_GUARD')
    }
}
