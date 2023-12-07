import {Body, Controller, Get, Param, Post, Query, UseGuards, ValidationPipe, VERSION_NEUTRAL,} from '@nestjs/common';
import {PanelService} from '../services/panel.service';
import {ApiBadRequestResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {AppService} from '../decorators/app-service.decorator';
import {IGuanacooApp} from '../interfaces/app.interface';
import {ModelAttributeFiltersService} from '../services/model-attribute-filters.service';
import {ModelSearchDto} from '../dto/model-search.dto';
import {AppModelsResultDto} from '../dto/results/app-models-result.dto';
import {IGuanacooModel} from '../interfaces/model.interface';
import {ModelService} from '../decorators/model-service.decorator';
import {AppModelSearchResultDto} from '../dto/results/app-model-search-result.dto';
import {ModelActionBaseService} from '../abstracts-services/model-action-base.service';
import {ModelActionService} from '../decorators/model-action-service.decorator';
import {AuthGuard} from "../guards/auth.guard";

@ApiTags('Guanacoo - Models')
@Controller({
  version: VERSION_NEUTRAL,
})
@UseGuards(AuthGuard)
export class ModelsController {
  constructor(
    private readonly panelService: PanelService,
    private readonly modelAttributeFiltersService: ModelAttributeFiltersService,
  ) {}

  @Get('apps/:app/model/:model/record/:id/page')
  async getRecordPage(
    @AppService() appService: IGuanacooApp,
    @ModelService() modelService: IGuanacooModel,
    @Param('id') recordId: string,
  ): Promise<any> {
    const attributes = modelService.attributes.map((a) => a.slug);
    const record = await modelService.findById(recordId, attributes);

    console.log('get record page', recordId, record, attributes);

    return {
      record,
      recordPage: 'upcoming-webinar',
    };
  }

  @Get('apps/:app/model')
  async getAppModels(
    @AppService() appService: IGuanacooApp,
  ): Promise<AppModelsResultDto> {
    const models = appService.getModelsServices() || [];
    const recordPages = models
      .map((modelService) =>
        modelService.getRecordPages().map((recordPage) => recordPage.getDto()),
      )
      .flat();
    const modelsActions = models
      .map((modelService) =>
        modelService.getModelActionsServices().map((ma) => ma.getDto()),
      )
      .flat();
    const modelsAttributes = models
      .map((modelService) =>
        (modelService.attributes || []).map((a) => a.getDto()),
      )
      .flat();

    const attributeFilters = this.modelAttributeFiltersService
      .getModelAttributeFilters()
      .map((attributeFilter) => attributeFilter.getDto());

    return {
      models: models.map((m) => m.getDto()),
      modelsActions,
      modelsAttributes,
      recordPages,
      attributeFilters,
    };
  }

  @Post('apps/:app/model/:model/model-action/:modelAction')
  async doModelAction(
    @AppService() appService: IGuanacooApp,
    @ModelService() modelService: IGuanacooModel,
    @ModelActionService() modelActionService: ModelActionBaseService,
    @Body() body: any,
  ): Promise<any> {
    console.log('do model action', body, modelActionService);

    return {};
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Get('apps/:app/model/:model/search')
  async search(
    @AppService() appService: IGuanacooApp,
    @ModelService() modelService: IGuanacooModel,
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        skipUndefinedProperties: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: ModelSearchDto,
  ): Promise<AppModelSearchResultDto> {
    // query.select = ['createdAt', 'attender.status', 'attender.emailAddress', 'attender.user.role', 'attender.webinar', 'attender.webinar.status', 'attender.webinar.slug', 'attender.webinar.streamHLS', 'webinar', 'webinar.title', 'webinar.slug']

    const records = await modelService.find(query);
    const count = await modelService.count(query);

    return {
      records,
      count,
    };
  }
}
