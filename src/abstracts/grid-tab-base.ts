import { PanelService } from '../services/panel.service';
import { IGuanacooGrid } from '../interfaces/grid.interface';
import { ModelAttributeBase } from './model-attribute';
import { IGuanacooCurrentUserPreferencesService } from '../interfaces/current-user-preferences-service.interface';
import { IGuanacooApp } from '../interfaces/app.interface';

export abstract class GridTabBase {
  public slug;
  public label;
  public defaultColumns;

  private _modelRef;
  private _filterRef;

  constructor(
    private readonly panelService: PanelService,
    private readonly gridService: IGuanacooGrid,
    private readonly appService: IGuanacooApp,
    tab: {
      slug: string;
      label: string;
      model: any;
      filter?: any;
      defaultColumns?: Array<string>;
    },
  ) {
    const { slug, label, model, filter, defaultColumns } = tab;
    this.slug = slug;
    this.label = label;
    this.defaultColumns = defaultColumns;

    if ((!model && !filter) || (!model && !filter.model)) {
      throw new Error(
        'Tab grid: ' +
          label +
          ' (' +
          slug +
          ') is invalid. Please provide model or filter with model.',
      );
    }

    this._modelRef = model;
    if (filter) {
      this._filterRef = filter;
    }
  }

  public filterAttributes(
    attrs?: Array<string>,
  ): Array<ModelAttributeBase | void> {
    const modelService = this.appService.getModelServiceByClassRef(
      this._modelRef,
    );

    if (!attrs || !attrs.length) return modelService.attributes;

    const filtered = attrs
      .map((slug) => modelService && modelService.getAttributeByPath(slug))
      .filter((a) => a);

    if (!filtered.length) return modelService.attributes;

    return filtered;
  }

  public async getDto(getColumns: Array<string>, customWidths: object) {
    if (!getColumns || !getColumns.length) {
      getColumns = this.defaultColumns || [];
    }

    const modelService = this.appService.getModelServiceByClassRef(
      this._modelRef,
    );
    const { slug: filterSlug } =
      modelService.getFilterServiceByClassRef(this._filterRef) || {};

    const countBadge = await modelService.count({ filter: filterSlug });

    const columns: Array<object> = [];
    for (const path of getColumns) {
      const attribute = modelService.getAttributeByPath(path);
      if (attribute) {
        const attributePath = path.split('.').slice(0, -1);
        const columnDto = attribute.getColumnDto(
          attributePath.join('.'),
          customWidths[path] || 200,
        );
        if (columnDto) {
          columns.push(columnDto);
        }
      }
    }

    return {
      url: this.gridService.getUrl() + '/' + this.slug,
      label: this.label,
      slug: this.slug,
      model: modelService.slug,
      filter: filterSlug,
      columns,
      badges: [
        { label: countBadge, pill: true, className: 'light', countBadge: true },
      ],
    };
  }

  public async userAddColumn(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
    attributeSlug: string,
  ) {
    this.validateAttribute(attributeSlug);

    const userPreferenceGridTabColumnsKey =
      'app:' +
      this.appService.slug +
      '-grid:' +
      this.gridService.slug +
      '-tab:' +
      this.slug +
      '-columns';

    let currentUserColumns =
      (await currentUserPreferencesService.get(
        userPreferenceGridTabColumnsKey,
      )) || [];
    if (!currentUserColumns || !currentUserColumns.length) {
      currentUserColumns = this.defaultColumns || [];
    }
    currentUserColumns.push(attributeSlug);

    await currentUserPreferencesService.set(
      userPreferenceGridTabColumnsKey,
      currentUserColumns,
    );
  }

  public async userReorderColumns(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
    newOrder: any[],
  ): Promise<Array<string>> {

    const filterAttributes = this.filterAttributes();
    const currentColumns = filterAttributes
      ? filterAttributes.map((a) => a && a.slug)
      : [];
    const sortedColumns = newOrder.filter((slug) =>
      currentColumns.includes(slug),
    );

    await currentUserPreferencesService.set(
      'app:' +
        this.appService.slug +
        '-grid:' +
        this.gridService.slug +
        '-tab:' +
        this.slug +
        '-columns',
      sortedColumns,
    );

    return sortedColumns;
  }

  public async userSaveColumnWidth(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
    attributeSlug: string,
    width: number,
  ): Promise<object> {
    this.validateAttribute(attributeSlug);

    const key =
      'app:' +
      this.appService.slug +
      '-grid:' +
      this.gridService.slug +
      '-tab:' +
      this.slug +
      '-columnswidth';

    const gridTabColumnsWidths =
      (await currentUserPreferencesService.get(key)) || {};
    gridTabColumnsWidths[attributeSlug] = Number(width);
    await currentUserPreferencesService.set(key, gridTabColumnsWidths);
    return gridTabColumnsWidths;
  }

  public async userRemoveColumn(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
    attributeSlug: string,
  ): Promise<Array<string | void>> {
    this.validateAttribute(attributeSlug);

    const key =
      'app:' +
      this.appService.slug +
      '-grid:' +
      this.gridService.slug +
      '-tab:' +
      this.slug +
      '-columns';

    const gridTabColumns = (await currentUserPreferencesService.get(key)) || [];
    const filterAttributes = this.filterAttributes(gridTabColumns);
    const currentColumns = filterAttributes
      ? filterAttributes.map((a) => a && a.slug)
      : [];
    const filteredColumns = currentColumns.filter(
      (attribute) => attribute !== attributeSlug,
    );

    await currentUserPreferencesService.set(key, filteredColumns);

    return filteredColumns;
  }

  public async userResetColumns(
    currentUserPreferencesService: IGuanacooCurrentUserPreferencesService,
  ) {
    await currentUserPreferencesService.del(
      'app:' +
        this.appService.slug +
        '-grid:' +
        this.gridService.slug +
        '-tab:' +
        this.slug +
        '-columns',
    );
    await currentUserPreferencesService.del(
      'app:' +
        this.appService.slug +
        '-grid:' +
        this.gridService.slug +
        '-tab:' +
        this.slug +
        '-columnswidth',
    );
  }

  private validateAttribute(attributeSlug: string) {
    const modelService = this.appService.getModelServiceByClassRef(
      this._modelRef,
    );
    const attribute = modelService.getAttributeByPath(attributeSlug);
    if (!attribute) {
      throw new Error(
        'Attribute with slug: ' + attributeSlug + ' cannot be use in grid tab.',
      );
    }
    return true;
  }
}
