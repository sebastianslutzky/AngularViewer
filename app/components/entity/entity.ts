
import {NgModule,Component, ViewEncapsulation, Injector, Input, Output, EventEmitter} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


@Component({
  selector: 'entity', 
  template: `<div [ng2-draggable]="true"> <h1><b>{{title}}</b></h1><p>({{name}})</div>`,
  encapsulation:ViewEncapsulation.None
})
export default class EntityComponent{ 
    name: string;
    title: string;
  constructor(public injector: Injector){
    this.name = this.injector.get('name');
    this.title = this.injector.get('title');
  }
}
