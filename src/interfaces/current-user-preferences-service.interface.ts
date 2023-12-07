import {IGuanacooApp} from './app.interface';

export interface IGuanacooCurrentUserPreferencesService {
  getAppService(): IGuanacooApp | void;

  get(key: string): Promise<any>;

  del(key: string): Promise<null>;

  set(key: string, value: any): Promise<any>;
}
