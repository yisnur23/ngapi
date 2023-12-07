import {Inject} from '@nestjs/common';
import {PanelService} from '../services/panel.service';
import {ModuleRef} from '@nestjs/core';

export const InjectAppModel = (): any => {
  const injectYourService = Inject(ModuleRef);

  console.log('aaa', injectYourService);
  return (target: object, key, index) => {
    console.log('bbb key/index', key, index);

    const type =
      PanelService || Reflect.getMetadata('design:type', target, key);

    let dependencies = Reflect.getMetadata('self:paramtypes', target) || [];
    dependencies = [...dependencies, { index, param: type }];
    console.log('dependencies', dependencies);
    Reflect.defineMetadata('self:paramtypes', dependencies, target);
    return;

    // injectYourService(target, key);
    // const type = Reflect.getMetadata('design:type', target, key);
    // // const panelService = Inject(target)(PanelService, 'panelService')
    // console.log('PANEL SERVICE IN INJECTOR MY', type)
    // return;
  };
};
