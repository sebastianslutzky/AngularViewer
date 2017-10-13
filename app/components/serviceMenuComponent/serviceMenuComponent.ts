/**
 * Represents a Menu class, containing one or more invoke-able menu actions
 *  @WebResources
 *  /services/%menu%
 * 
 * @Events
 *  onMenuEntityLoaded(numberOfActions)
 */
import {NgModule,Component, Injector,ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '../../services/httpService';
import {Observable} from "rxjs/Observable";
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';

@Component({
  selector: 'service-menu-component', 
  template: `
<div [hidden]="hidden">
  <div  *ngFor="let action of this.actions">
  <menu-action #ma [ResourceDescriptor]='action'></menu-action>
</div>
    <li class="divider"></li>
</div>
` ,
  encapsulation:ViewEncapsulation.None
})
export default class ServiceMenuComponent{
    friendlyName: string;
    href: string;
    @Input()
    hidden: boolean;
    dataSource: Observable<any>; 
    @Output()
    onMenuEntityLoaded: EventEmitter<IMenuResourceLoaded> = new EventEmitter();
    action: Array<any>;

    constructor(public injector: Injector, public http: HttpClient){
        this.hidden = true;
        //todo: get friendly name when resource loaded
        this.friendlyName = this.injector.get("title");
        this.href = this.injector.get("href");
        this.dataSource = this.http.get(this.href).map(x=>x.json());
        //get resource & described by
        this.dataSource.subscribe(data=>
        {
            let members = data.members;
            let asArray = Object.keys(members).map(function(k) {return members[k]});
            this.actions = asArray;

            let resourceLoaded: IMenuResourceLoaded = {
                numberOfSubmenues: asArray.length,
                menuPosition:  this.getMenuBar(data)
            };

            if(this.actions.length > 0){
                this.hidden = false;
            }

            this.onMenuEntityLoaded.emit(resourceLoaded);
        });
    }


    getMenuBar(resource: any):number{
        if(resource.extensions && resource.extensions.menuBar)
        {
            var menuBar = resource.extensions.menuBar
            switch(menuBar){
                case "PRIMARY":
                    return 1
                case "SECONDARY":
                    return 2
                case "TERTIARY":
                    return 3
            }
            throw ("Unknown menuBar " + menuBar)
        }
    }
}