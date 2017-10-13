
import {NgModule,Component, Injector,ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';

@Component({
  selector: 'menu-bar', 
  template: `
    <div  *ngFor="let section of this._sections;let i=index" >
    <menu-bar-section [NoDivision]='isLast(i)' [ResourceDescriptor]='section' (onMenuEntityLoaded)="handleMenuLoaded($event,i)"></menu-bar-section>
  </div>
` ,
  encapsulation:ViewEncapsulation.None
})
export default class MenuBarComponent{
    _sections :Array<any> = []

    addSection(section: any){
        this._sections.push(section)
    }

    handleMenuLoaded(event: IMenuResourceLoaded,i:number){
        if(event.numberOfSubmenues ==0)
        {
            this._sections.splice(i,1);
        }
    }

    isLast(index:number):boolean{
        return index == this._sections.length -1
    }
}