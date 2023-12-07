import {PanelService} from '../services/panel.service';
import {IGuanacooModelActionOptions} from '../interfaces/model-action-options.interface';
import {IGuanacooModel} from '../interfaces/model.interface';
import {IGuanacooApp} from '../interfaces/app.interface';

export class ModelActionBaseService {
  public readonly slug;
  public readonly iconName;
  public readonly label;
  public readonly labelCreateBtn;
  public readonly labelGroupedLink;
  public readonly ajaxForm: Array<any>;

  constructor(
    private panelService: PanelService,
    private appService: IGuanacooApp,
    private modelService: IGuanacooModel,
    private token: string,
    private options: IGuanacooModelActionOptions,
  ) {
    const {
      slug,
      label,
      iconName,
      labelCreateBtn,
      labelGroupedLink,
      ajaxForm,
    } = options;
    this.slug = slug;
    this.label = label || this.slug;
    this.labelCreateBtn = labelCreateBtn || this.label;
    this.labelGroupedLink = labelGroupedLink || this.labelCreateBtn;
    this.iconName = iconName;
    this.ajaxForm = ajaxForm || [];
  }

  getDto() {
    return {
      model: this.modelService.slug,
      slug: this.slug,
      label: this.label,
      btnGroup: 'create',
      actionBtn: {
        component: 'btn',
        className: 'success',
        label: this.labelCreateBtn, // 'Create new webinar',
        href:
          this.appService.getPath() +
          '/model/' +
          this.modelService.slug +
          '/action/' +
          this.slug,
      },
      groupedItem: {
        label: this.labelGroupedLink,
      },
      ajaxForm: this.resolveAjaxFormComponents(this.ajaxForm),
    };
  }

  private resolveAjaxFormComponents(components: Array<any>) {
    return components
      .map((component) => {
        const { attribute: attributeSlug } = component;
        if (attributeSlug) {
          const attribute = this.modelService.getAttribute(attributeSlug);
          if (attribute) {
            return attribute.getAjaxFormInputDto();
          }
        } else {
          return component;
        }
      })
      .filter((a) => a);
  }
}
