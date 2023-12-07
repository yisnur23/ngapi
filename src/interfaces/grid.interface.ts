import {GridTabGenerator} from '../generators/grid-tab.generator';
import {GridDto} from '../dto/grid.dto';
import {IGuanacooCurrentUserPreferencesService} from './current-user-preferences-service.interface';

export interface IGuanacooGrid {
  slug: string;

  getPath(): string;

  getUrl(): string;

  getTabs(): Array<GridTabGenerator>;

  getDto(): Promise<{ slug: string; url: string }>;

  userGetDto(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
  ): Promise<GridDto>;

  getTabBySlug(slug: string): GridTabGenerator;

  hasSlug(slug): boolean;
}
