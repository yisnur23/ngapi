import {
    ConsoleLogger,
    DynamicModule,
    Global,
    Inject,
    MiddlewareConsumer,
    Module,
    OnModuleInit,
    Provider,
    Scope,
} from '@nestjs/common';
import {ModelsController} from './controllers/models.controller';
import {IGuanacooPanelOptions} from './interfaces/panel-options.interface';
import {PanelService} from './services/panel.service';
import {AppsController} from './controllers/apps.controller';
import {getAppOptions} from './decorators/app.decorator';
import {IGuanacooApp} from './interfaces/app.interface';
import {getModelToken} from '@nestjs/mongoose/dist/common/mongoose.utils';
import {getModelOptions} from './decorators/model.decorator';
import {getGridOptions} from './decorators/grid.decorator';
import {getModelActionOptions} from './decorators/model-action.decorator';
import {GridsController} from './controllers/grids.controller';
import {ModelAttributeFiltersService} from './services/model-attribute-filters.service';
import {AppServicesResolverMiddleware} from './middlewares/app-services-resolver-middleware.service';
import {ModuleRef} from '@nestjs/core';
import {CurrentUserPreferencesDefaultService} from './services/current-user-preferences-default.service';
import {AuthDefaultGuard} from "./guards/auth-default.guard";

function createAppModelProvider(
    modelClassRef: any,
    appToken: string,
): Array<Provider> {
    const modelRefToken = modelClassRef.name;
    const modelServiceToken = appToken + modelRefToken;

    const modelOptions = getModelOptions(modelClassRef);
    const {modelActions} = modelOptions;

    if (!modelOptions) {
        throw new Error(
            'Panel model: ' + modelRefToken + ' is not decorated with @Model.',
        );
    }
    if (!modelOptions.query) {
        throw new Error(
            'Panel model: ' + modelRefToken + ' has not defined query property.',
        );
    }
    if (!modelOptions.schema) {
        throw new Error(
            'Panel model: ' + modelRefToken + ' has not defined schema property.',
        );
    }

    if (!modelOptions.slug) {
        modelOptions.slug = modelRefToken.toLowerCase();
    }
    if (!modelOptions.label) {
        modelOptions.label = modelRefToken;
    }
    if (!modelOptions.plural) {
        modelOptions.plural = modelOptions.label + 's';
    }

    const modelActionsProviders = (modelActions || []).map((modelActionRef) => {
        const modelActionServiceToken =
            modelServiceToken + 'ModelAction' + modelActionRef.name;
        const modelActionOptions = getModelActionOptions(modelActionRef);
        return {
            provide: modelActionServiceToken,
            useFactory: (panelService, appService, modelService) => {
                return new modelActionRef(
                    panelService,
                    appService,
                    modelService,
                    modelActionServiceToken,
                    modelActionOptions,
                );
            },
            inject: [PanelService, appToken, modelServiceToken],
        };
    });

    return [
        {
            provide: modelServiceToken,
            useFactory: (panelService, modelAttributeFiltersService) => {
                return new modelClassRef(
                    panelService,
                    modelAttributeFiltersService,
                    appToken,
                    modelServiceToken,
                    modelOptions,
                );
            },
            inject: [PanelService, ModelAttributeFiltersService],
        },
        {
            provide: modelServiceToken + 'QueryService',
            useExisting: getModelToken(modelOptions.query.name),
        },
        ...modelActionsProviders,
    ];
}

function createAppGridProvider(
    gridClassRef: any,
    appToken: string,
): Array<Provider> {
    const gridRefToken = gridClassRef.name;
    const gridServiceToken = appToken + gridRefToken;

    const gridOptions = getGridOptions(gridClassRef);

    if (!gridOptions.slug) {
        gridOptions.slug = gridRefToken.toLowerCase();
    }
    if (!gridOptions.label) {
        gridOptions.label = gridRefToken;
    }

    return [
        {
            provide: gridServiceToken,
            useFactory: (panelService, appService) => {
                return new gridClassRef(
                    panelService,
                    appService,
                    gridServiceToken,
                    gridOptions,
                );
            },
            inject: [PanelService, appToken],
        },
    ];
}

function createProviders(appClassRef): Array<Provider<IGuanacooApp>> {
    const appToken = appClassRef.name;
    const options = getAppOptions(appClassRef);

    if (!options) {
        throw new Error(
            'Panel app: ' + appToken + ' is not decorated with @Model.',
        );
    }

    const {models, grids} = options;

    if (!options.slug) {
        options.slug = appToken.toLowerCase();
    }
    if (!options.label) {
        options.label = appToken;
    }

    const gridProviders = (grids || []).map((gridClassRef) =>
        createAppGridProvider(gridClassRef, appToken),
    );
    const modelProviders = (models || []).map((modelClassRef) =>
        createAppModelProvider(modelClassRef, appToken),
    );

    return [
        {
            provide: appToken,
            useFactory: (panelService) => {
                return new appClassRef(panelService, appToken, options);
            },
            inject: [PanelService],
        },
        ...modelProviders.flat(),
        ...gridProviders.flat(),
    ];
}

@Global()
@Module({})
export class PanelModule implements OnModuleInit {

    private readonly logger = new ConsoleLogger(PanelModule.name);

    constructor(
        @Inject(PanelService) private panelService: PanelService,
        private moduleRef: ModuleRef
    ) {
        this.logger.log('Initializing Panel Module')
    }

    static forRoot(options: IGuanacooPanelOptions): DynamicModule {
        const {apps, userPreferences, authGuard} = options;
        const appProviders = apps.map((app) => createProviders(app)).flat();

        const providers: Provider[] = [
            PanelService,
            ModelAttributeFiltersService,
            {
                provide: 'GUANACOO_AUTH_GUARD',
                useClass: authGuard ? authGuard : AuthDefaultGuard
            },
            {
                provide: 'GuanacooCurrentUserPreferencesService',
                useClass: userPreferences
                    ? userPreferences
                    : CurrentUserPreferencesDefaultService,
                scope: Scope.REQUEST,
            },
            ...appProviders,
        ];

        return {
            global: true,
            module: PanelModule,
            providers,
            controllers: [ModelsController, AppsController, GridsController],
            exports: [PanelService, ModelAttributeFiltersService, ...providers],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AppServicesResolverMiddleware).forRoutes(GridsController);
        consumer.apply(AppServicesResolverMiddleware).forRoutes(ModelsController);
        consumer.apply(AppServicesResolverMiddleware).forRoutes(AppsController);
    }

    public async onModuleInit(): Promise<void> {
        console.log('Panel Module Init')
    }
}
