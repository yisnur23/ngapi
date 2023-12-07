import {Controller, Get, Inject, UseGuards, VERSION_NEUTRAL} from '@nestjs/common';
import {PanelService} from '../services/panel.service';
import {IGuanacooApp} from '../interfaces/app.interface';
import {AppsResultDto} from '../dto/results/apps-result.dto';
import {AppResultDto} from '../dto/results/app-result.dto';
import {AppService} from '../decorators/app-service.decorator';
import {User} from '../decorators/user.decorator';
import {ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse,} from '@nestjs/swagger';
import {IGuanacooCurrentUserPreferencesService} from '../interfaces/current-user-preferences-service.interface';
import {AuthGuard} from "../guards/auth.guard";

@ApiBearerAuth()
@ApiTags('Guanacoo - Apps')
@Controller({
  version: VERSION_NEUTRAL,
})
@UseGuards(AuthGuard)
export class AppsController {
  constructor(
    private readonly panelService: PanelService,
    @Inject('GuanacooCurrentUserPreferencesService')
    private currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
  ) {}

  @ApiOkResponse({ description: 'Apps', type: AppsResultDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('apps')
  async apps(): Promise<AppsResultDto> {
    const apps: Array<IGuanacooApp> = this.panelService.getAppsServices();
    return {
      apps: apps.map((app) => app.getDto()),
    };
  }

  @ApiOkResponse({ description: 'App - Settings', type: AppResultDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('apps/:app')
  async app(
    @AppService() appService: IGuanacooApp,
    @User() user: object,
  ): Promise<AppResultDto> {
    const apps: Array<IGuanacooApp> = this.panelService.getAppsServices();
    const menu = appService.menuItems;

    return {
      app: appService.getDto(),
      apps: apps.map((app) => app.getDto()),
      menuItems: menu.map((m) => m.getDto()),
    };
  }
}
