
import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter,Injector} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MetamodelNavigator,IRestResource } from '../../services/metamodelNavigator';

@Component({
  selector: 'entity', // <1>
  templateUrl: 'app/components/entity/entity.html', // <3>
  encapsulation:ViewEncapsulation.None
})
export default class EntityComponent{ 
  _resource:IRestResource

  constructor(public injector: Injector){
    this._resource = this.injector.get('actionResource');
    
  }
}