import {Body, Controller, Get, Inject, Param, Post, UseGuards, VERSION_NEUTRAL,} from '@nestjs/common';
import {IGuanacooApp} from '../interfaces/app.interface';
import {AppService} from '../decorators/app-service.decorator';
import {GridService} from '../decorators/grid-service.decorator';
import {IGuanacooGrid} from '../interfaces/grid.interface';
import {GridTabParam} from '../decorators/grid-tab-param.decorator';
import {GridTabBase} from '../abstracts/grid-tab-base';
import {GridDto} from '../dto/grid.dto';
import {AppGridsResultDto} from '../dto/results/app-grids-result.dto';
import {ApiTags} from '@nestjs/swagger';
import {IGuanacooCurrentUserPreferencesService} from '../interfaces/current-user-preferences-service.interface';
import {AuthGuard} from "../guards/auth.guard";

@ApiTags('Guanacoo - Grids')
@Controller({
  version: VERSION_NEUTRAL,
})
@UseGuards(AuthGuard)
export class GridsController {
  constructor(
    @Inject('GuanacooCurrentUserPreferencesService')
    private currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
  ) {}

  @Get('apps/:app/grid')
  async getAppGrids(
    @AppService() appService: IGuanacooApp,
  ): Promise<AppGridsResultDto> {
    const grids = await Promise.all(
      appService
        .getGridsServices()
        .map((gridService) =>
          gridService.userGetDto(this.currentUserPreferencesService),
        ),
    );

    return { grids };
  }

  @Post('apps/:app/grid/:grid/tab/:tab/column/add')
  async addColumnToGridTab(
    @GridService() gridService: IGuanacooGrid,
    @GridTabParam() gridTab: GridTabBase,
    @Body('attributes') attributesSlug: string,
  ): Promise<GridDto> {
    for (const attributeSlug of attributesSlug) {
      await gridTab.userAddColumn(
        this.currentUserPreferencesService,
        attributeSlug,
      );
    }
    return gridService.userGetDto(this.currentUserPreferencesService);
  }

  @Post('apps/:app/grid/:grid/tab/:tab/reorder')
  async reorderColumnGrid(
    @GridTabParam() gridTab: GridTabBase,
    @Body('order') order: object,
  ): Promise<Array<string>> {
    const newOrder = {};
    Object.keys(order).forEach((attribute) => {
      const num = Number(order[attribute]);
      newOrder[num] = attribute;
    });
    return gridTab.userReorderColumns(
      this.currentUserPreferencesService,
      Object.values(newOrder),
    );
  }

  @Post('apps/:app/grid/:grid/tab/:tab/column/set-width')
  async saveColumnGridWidth(
    @GridTabParam() gridTab: GridTabBase,
    @Body('attribute') attributePath: string,
    @Body('width') width: number,
  ): Promise<object> {
    return gridTab.userSaveColumnWidth(
      this.currentUserPreferencesService,
      attributePath,
      width,
    );
  }

  @Post('apps/:app/grid/:grid/tab/:tab/column/:column/remove')
  async removeColumnFromGridTab(
    @GridTabParam() gridTab: GridTabBase,
    @Param('column') attributeSlug: string,
  ): Promise<Array<string | void>> {
    return gridTab.userRemoveColumn(
      this.currentUserPreferencesService,
      attributeSlug,
    );
  }

  @Post('apps/:app/grid/:grid/tab/:tab/reset')
  async resetGridTab(
    @GridService() gridService: IGuanacooGrid,
    @GridTabParam() gridTab: GridTabBase,
  ): Promise<GridDto> {
    await gridTab.userResetColumns(this.currentUserPreferencesService);
    return await gridService.userGetDto(this.currentUserPreferencesService);
  }
}
