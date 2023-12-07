import {PanelService} from '../services/panel.service';
import {IGuanacooModel} from '../interfaces/model.interface';
import {ModelDto} from '../dto/model.dto';
import {getMetadataStorage} from 'class-validator';
import {IGuanacooModelOptions} from '../interfaces/model-options.interface';
import {getModelFilterOptions} from '../decorators/class-validator/model-filter.decorator';
import {ModelAttributeFiltersService} from '../services/model-attribute-filters.service';
import {TextAttribute} from '../attributes/text.attribute';
import {ModelAttributeBase} from '../abstracts/model-attribute';
import {getModelAttributeOptions} from '../decorators/model-attribute.decorator';
import {UrlAttribute} from '../attributes/url.attribute';
import {DatetimeAttribute} from '../attributes/datetime.attribute';
import {ArrayAttribute} from '../attributes/array.attribute';
import {BooleanAttribute} from '../attributes/boolean.attribute';
import {ListAttribute} from '../attributes/list.attribute';
import {IGuanacooModelQuery} from '../interfaces/model-query.interface';
import {RelatedModelAttribute} from '../attributes/related-model.attribute';
import {RelatedExternalModelAttribute} from '../attributes/related-external-model.attribute';
import {ModelActionBaseService} from './model-action-base.service';
import {getRecordPageOptions} from '../decorators/record-page.decorator';
import {RecordPageBaseService} from './record-page-base.service';
import {inspect} from "util";
import {ConsoleLogger} from "@nestjs/common";

export abstract class GuanacooModelBaseService implements IGuanacooModel {
    public slug;
    public label;
    public plural;
    public schema;
    public iconName;
    public filters;
    public recordPages;
    public modelRef;
    public displayKey;

    private _queryService;
    private _attributes: Array<ModelAttributeBase> = [];
    private modelActions;

    private readonly logger = new ConsoleLogger();

    constructor(
        private panelService: PanelService,
        private modelAttributeFiltersService: ModelAttributeFiltersService,
        private appToken: string,
        private token: string,
        private options: IGuanacooModelOptions,
    ) {
        const {
            slug,
            label,
            plural,
            filters,
            recordPages,
            schema,
            displayKey,
            iconName,
            query: modelRef,
            modelActions,
        } = options;
        this.slug = slug;
        this.label = label;
        this.plural = plural || label;
        this.schema = schema;
        this.displayKey = displayKey || '_id';
        this.iconName = iconName;
        this.filters = filters ? this.prepareFilters(filters) : [];
        this.recordPages = recordPages ? this.prepareRecordPages(recordPages) : [];
        this.modelRef = modelRef;

        this.modelActions = modelActions;

        this.panelService.registerAppModelService(this.appToken, this);

        this.logger.setContext(token);
        this.logger.log(`Model: ${token} created`);
    }

    public get attributes() {
        if (this._attributes.length) return this._attributes;

        const validationMetadatas =
            getMetadataStorage().getTargetValidationMetadatas(
                this.modelRef,
                this.modelRef.name,
                true,
                false,
            );
        const validations =
            getMetadataStorage().groupByPropertyName(validationMetadatas);

        Object.keys(this.schema.paths).forEach((key) => {
            if (key === this.schema.options?.versionKey) {
                return;
            }

            const attribute = this.schema.paths[key];
            const {
                options: {label, required, ref},
                instance,
            } = attribute;
            const defaultAttribute = {
                label: label || key,
                slug: key,
                required,
                displayKey: this.displayKey === key,
            };

            const attrs: any = {};
            let contraintsNames: Array<string> = [];
            let modelAttribute: ModelAttributeBase | void;

            if (validations[key]) {
                for (const i in validations[key]) {
                    const validation = validations[key][i];
                    const constraints =
                        getMetadataStorage().getTargetValidatorConstraints(
                            validation.constraintCls,
                        );
                    contraintsNames = contraintsNames.concat(
                        constraints.map((c) => c.name),
                    );

                    if (instance === 'String') {
                        if (contraintsNames.includes('IsList')) {
                            attrs.IsList = true;
                            attrs.list = validation.constraints;
                        }
                    }
                }
            }

            if (key === '_id') {
                modelAttribute = new TextAttribute(
                    this.modelAttributeFiltersService,
                    this,
                    getModelAttributeOptions(TextAttribute),
                    defaultAttribute,
                );
            } else if (instance === 'ObjectID') {
                const relatedModel = this.panelService.getAppModelServiceByModelName(
                    this.appToken,
                    ref,
                );
                if (relatedModel) {
                    modelAttribute = new RelatedModelAttribute(
                        this.modelAttributeFiltersService,
                        this,
                        getModelAttributeOptions(RelatedModelAttribute),
                        {
                            ...defaultAttribute,
                            relatedModel,
                        },
                    );
                } else if (attribute.options?.modelFromApp) {
                    const relatedApp = this.panelService.getAppServiceBySlug(
                        attribute.options.modelFromApp,
                    );
                    if (relatedApp) {
                        const externalModel = relatedApp.getModelServiceByModelName(ref);
                        if (externalModel) {
                            modelAttribute = new RelatedExternalModelAttribute(
                                this.modelAttributeFiltersService,
                                this,
                                getModelAttributeOptions(RelatedExternalModelAttribute),
                                {
                                    ...defaultAttribute,
                                    relatedApp,
                                    externalModel,
                                },
                            );
                        }
                    }
                }
            } else if (instance === 'Boolean') {
                modelAttribute = new BooleanAttribute(
                    this.modelAttributeFiltersService,
                    this,
                    getModelAttributeOptions(BooleanAttribute),
                    defaultAttribute,
                );
            } else if (instance === 'String') {
                if (attrs.IsList) {
                    modelAttribute = new ListAttribute(
                        this.modelAttributeFiltersService,
                        this,
                        getModelAttributeOptions(ListAttribute),
                        {
                            ...defaultAttribute,
                            list: attrs.list,
                        },
                    );
                } else if (contraintsNames.includes('isUrl')) {
                    modelAttribute = new UrlAttribute(
                        this.modelAttributeFiltersService,
                        this,
                        getModelAttributeOptions(UrlAttribute),
                        defaultAttribute,
                    );
                } else {
                    modelAttribute = new TextAttribute(
                        this.modelAttributeFiltersService,
                        this,
                        getModelAttributeOptions(TextAttribute),
                        defaultAttribute,
                    );
                }
            } else if (instance === 'Array') {
                modelAttribute = new ArrayAttribute(
                    this.modelAttributeFiltersService,
                    this,
                    getModelAttributeOptions(ArrayAttribute),
                    defaultAttribute,
                );
            } else if (instance === 'Number') {
                if (contraintsNames.includes('IsTimestamp')) {
                    modelAttribute = new DatetimeAttribute(
                        this.modelAttributeFiltersService,
                        this,
                        getModelAttributeOptions(DatetimeAttribute),
                        defaultAttribute,
                    );
                }
            }

            modelAttribute = modelAttribute ? modelAttribute : new TextAttribute(
                this.modelAttributeFiltersService,
                this,
                getModelAttributeOptions(TextAttribute),
                defaultAttribute,
            );

            this._attributes.push(modelAttribute);
        });

        return this._attributes;
    }

    public getAttributeByPath(path: string): ModelAttributeBase | void {
        const suffix = path.split('.');
        const thisLevelSlug = suffix.shift();
        if (!thisLevelSlug) {
            return;
        }
        const attribute = this.getAttribute(thisLevelSlug);
        if (attribute && !suffix.length) {
            return attribute;
        } else if (attribute && suffix.length) {
            return attribute.getNestedAttributeByPath(suffix.join('.'));
        }
        return;
    }

    public getAttribute(attributeSlug: string): ModelAttributeBase | void {
        return this.attributes.find((attribute) => attribute.slug == attributeSlug);
    }

    public hasSlug(slug: string) {
        return this.slug === slug;
    }

    async findById(id: string, select?: string[]) {
        const records = await this.find({
            select,
            userFilters: {
                _id: {
                    slug: 'is-id',
                    value: id,
                },
            },
            limit: 1,
        });
        return records.shift();
    }

    async find(query?: IGuanacooModelQuery): Promise<Array<any>> {
        const {limit, page, sort, filter, include, debug} = query || {};

        let aggregation: Array<any> = [];

        const includeMatch: object = {}
        if (include && Object.keys(include).length) {
            for (const attribute of Object.keys(include)) {
                if (this.getAttribute(attribute)) {
                    Object.assign(includeMatch, this.convertFilterToCriteria(attribute, include[attribute]) || {})
                }
            }
            aggregation.push({$match: includeMatch})
        }

        const queryAggregation: Array<any> = this.getQueryAggregation(query || {})
        if (queryAggregation.length) {
            aggregation = aggregation.concat(queryAggregation)
        }

        if (sort) {
            aggregation.push({$sort: sort});
        } else if (filter) {
            const defaultSort = this.getFilterDefaultSort(filter);
            if (Object.keys(defaultSort).length) {
                aggregation.push({$sort: defaultSort});
            }
        }

        if (Number(limit) > 0) {
            if (Number(page) > 0) {
                aggregation.push({$skip: (Number(page) - 1) * Number(limit)});
            }
            aggregation.push({$limit: Number(limit)});
        }

        if (debug) {
            this.logger.debug(`FIND\n-> query: ${inspect(query, false, null)}\n--> aggregate: ${inspect(aggregation, false, null)}`)
        }

        const results = await this.queryService.aggregate(aggregation);

        return results;
    }

    public async count(query?: IGuanacooModelQuery): Promise<number> {
        const select: string[] = ['_id'];
        const aggregation: Array<any> = this.getQueryAggregation({
            ...query,
            select,
        });
        return this.queryService
            .aggregate(aggregation)
            .count('count')
            .then((r) => r[0]?.count || 0);
    }

    public getModelActionsServices(): Array<ModelActionBaseService> {
        return (this.modelActions || []).map((modelActionRef) => {
            return this.panelService.getRef(
                this.token + 'ModelAction' + modelActionRef.name,
            );
        });
    }

    public getModelActionServiceBySlug(
        actionSlug: string,
    ): ModelActionBaseService | void {
        return this.getModelActionsServices().find(
            (modelActionService) =>
                modelActionService && modelActionService.slug === actionSlug,
        );
    }

    public getFilterServiceByClassRef(filterClassRef: any) {
        if (!filterClassRef) return;
        const {slug} = getModelFilterOptions(filterClassRef);
        return this.filters.find((filter) => {
            return filter.hasSlug(slug);
        });
    }

    getDto(): ModelDto {
        return {
            slug: this.slug,
            label: this.label,
            plural: this.plural,
        };
    }

    /**
     *
     * @private
     *
     *
     *
     *
     *
     *
     */
    private get queryService() {
        if (this._queryService) return this._queryService;
        this._queryService = this.panelService.getAppQueryServiceByModelRef(
            this.appToken,
            this.modelRef,
        );
        return this._queryService;
    }

    /**
     *
     * @param query
     * @private
     *
     *
     */
    private getQueryAggregation(query: IGuanacooModelQuery): Array<any> {
        const {filter, search} = query;
        const select: string[] = query.select || this.attributes.map((a) => a.slug);
        const userFilters: object = query.userFilters || {};

        const userFiltersMatch: object = {};
        if (userFilters && Object.keys(userFilters).length) {
            Object.keys(userFilters).forEach((attribute) => {
                select.push(attribute);
                Object.assign(
                    userFiltersMatch,
                    this.convertFilterToCriteria(attribute, userFilters[attribute]) ||
                    {},
                );
            });
        }

        const filterMatch: object = {};
        const filterCriteria = this.getQueryCriteria(filter);
        if (filter && Object.keys(filterCriteria).length) {
            Object.keys(filterCriteria).forEach((attribute) => {
                select.push(attribute);
                Object.assign(
                    filterMatch,
                    this.convertFilterToCriteria(
                        attribute,
                        filterCriteria[attribute],
                    ) || {},
                );
            });
        }

        const aggregationNested = this.getQueryAggregationNested({
            ...query,
            select,
        });

        let {transformAttributes} = aggregationNested;
        const {lookups} = aggregationNested;

        if (!transformAttributes) {
            transformAttributes = {};
        }
        // console.log('lookups', lookups)
        // console.log('select', query.select)
        // console.log('userFiltersMatch', userFiltersMatch)
        // console.log('transformAttributes', transformAttributes)

        const aggregation: Array<any> = lookups || [];

        if (search) {
            aggregation.push({
                $match: {
                    $text: {
                        $search: search,
                    },
                },
            });
        }

        if (Object.keys(filterMatch).length) {
            aggregation.push({
                $match: filterMatch,
            });
        }

        if (Object.keys(userFiltersMatch).length) {
            aggregation.push({
                $match: userFiltersMatch,
            });
        }

        transformAttributes['model'] = this.slug;
        transformAttributes['displayKey'] = '$' + this.displayKey;

        const project: object = {_id: 1};
        for (const path in transformAttributes) {
            project[path] = 1;
        }
        if (transformAttributes && Object.keys(transformAttributes).length) {
            aggregation.push({$addFields: transformAttributes});
        }
        aggregation.push({$project: project});

        return aggregation;
    }

    public getQueryAggregationNested(
        query: IGuanacooModelQuery,
        ancestorsAttributes: Array<string> = [],
    ) {
        const {select} = query;
        let transformAttributes: object = {};
        let lookups: Array<any> = [];

        if (!select) {
            return {};
        }

        const thisLevelAttributesSlugs = select.map((path) => {
            return path.split('.')[0];
        });

        const thisLevelAttributes = this.attributes.filter((attribute) => {
            return thisLevelAttributesSlugs.includes(attribute.slug);
        });

        for (const attribute of thisLevelAttributes) {
            const thisLevelAttributeLookups =
                attribute.getLookupAggregation(ancestorsAttributes);

            if (!thisLevelAttributeLookups.length) {
                transformAttributes = Object.assign(
                    transformAttributes,
                    attribute.getTransformAttributes(ancestorsAttributes),
                );
                continue;
            }

            const nextLevelAttributesSlugs = select
                .filter((path) => path.split('.')[0] === attribute.slug)
                .map((path) => {
                    return path.split('.').slice(1).join('.');
                })
                .filter((as) => as && as.length);

            lookups = lookups.concat(thisLevelAttributeLookups);

            transformAttributes = Object.assign(
                transformAttributes,
                attribute.getTransformAttributes(ancestorsAttributes),
            );

            if (nextLevelAttributesSlugs.length) {
                const {
                    lookups: nestedLookups,
                    transformAttributes: nestedTransformAttributes,
                } = attribute.getQueryAggregationNested(
                    {
                        ...query,
                        select: nextLevelAttributesSlugs,
                    },
                    ancestorsAttributes.concat(attribute.slug),
                );

                transformAttributes = Object.assign(
                    transformAttributes,
                    nestedTransformAttributes,
                );

                if (nestedLookups && nestedLookups.length) {
                    lookups = lookups.concat(nestedLookups);
                }
            }
        }

        return {
            lookups,
            transformAttributes,
        };
    }

    public getRecordPages(): Array<RecordPageBaseService> {
        return this.recordPages;
    }

    private convertFilterToCriteria(
        attribute: string,
        userFilter: { slug: string; value: any },
    ) {
        const {slug, value} = userFilter;
        const filter = this.modelAttributeFiltersService.getFilterBySlug(slug);
        if (!filter) {
            return {};
        }
        return {[attribute]: filter.getQuery(value)};
    }

    private getQueryCriteria(filterSlug) {
        if (!filterSlug) return {};
        const filter = this.filters.find((f) => f.slug === filterSlug);
        if (filter) {
            return filter.criteria;
        } else {
            return {};
        }
    }

    private getFilterDefaultSort(filterSlug) {
        if (!filterSlug) return {};
        const filter = this.filters.find((f) => f.slug === filterSlug);
        if (filter && filter.sort) {
            return filter.sort;
        } else {
            return {};
        }
    }

    private prepareFilters(filters: Array<any>) {
        return (filters || []).map((filter) => {
            const options = getModelFilterOptions(filter);
            if (typeof filter === 'function' && filter.name) {
                return new filter(this.panelService, this, options);
            }
        });
    }

    private prepareRecordPages(recordPages: Array<any>) {
        return (recordPages || []).map((recordPage) => {
            const options = getRecordPageOptions(recordPage);
            if (typeof recordPage === 'function' && recordPage.name) {
                return new recordPage(this.panelService, this, options);
            }
        });
    }
}
