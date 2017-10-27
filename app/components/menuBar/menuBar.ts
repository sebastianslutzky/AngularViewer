
import {NgModule,Component, Injector,ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';

@Component({
  selector: 'menu-bar', 
  template: `
              <ul class="nav navbar-nav {{MenuType}}">
               <li class="dropdown">
                  <a tabindex="-1" 
                      href="javascript:;" 
                      class="dropdown-toggle" 
                      data-toggle="dropdown" >
                      <span>{{_resource.named}}</span> 

                <span class="caret"></span></a>
                <ul class="dropdown-menu scrollable-menu multi-level top-menu-contacts" role="menu">
    <div  *ngFor="let section of _resource.section;let i=index" >
    <menu-bar-section [NoDivision]='isLast(i)' [ResourceDescriptor]='section' (onMenuEntityLoaded)="handleMenuLoaded($event,i)"></menu-bar-section>
  </div>
                  </ul>
                </li>
              </ul>
` ,
  encapsulation:ViewEncapsulation.None
})
export default class MenuBarComponent{
    _sections :Array<any> = []

    constructor(){
        console.log("constructor or menuBar")
    }

    public _resource: any;
    @Input()
    set Resource(val: any){
        console.log("setting resource:");
        console.log(val);
        //console.log(val.section);

        this._resource = val;
    }

    @Input()
    MenuType: string;

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