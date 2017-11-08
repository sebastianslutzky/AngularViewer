
import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


@Component({
  selector: 'entity', // <1>
  templateUrl: 'app/components/entity/entity.html', // <3>
  encapsulation:ViewEncapsulation.None
})
export default class EntityComponent{ 
}