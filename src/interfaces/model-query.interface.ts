export interface IGuanacooModelQuery {
  limit?: number;
  select?: Array<string>;
  filter?: string;
  userFilters?: object;
  include?: object;
  search?: string;
  page?: number;
  sort?: object;
  debug?: boolean;
}
