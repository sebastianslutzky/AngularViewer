
/**
 * Represents an invoke-able menu action.
 *  @WebResources
 *  /services/%menu%/actions/%action% 
 * @Events
 *  actionInvoked
 */

import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {HttpClient} from '../../services/httpService';

@Component({
  selector: 'menu-action',
  template: `<li> <a class="dropdown-toggle"  data-toggle="dropdown" href="#">{{this.friendlyName}}</a></li>`,
  styles: ["a:hover { cursor: pointer; }"],
  encapsulation:ViewEncapsulation.None
})
export default class MenuActionComponent{ 
    @Input() 
    ServiceName: string;
    actionName: string;
    friendlyName: string;
    dataSource: Observable<any>; 
    fullResource: string;
    describedBy: any;

    @Input()
    ResourceDescriptor: any;


    @Input() 
    set ActionName(actionName: string){
        this.actionName = actionName;
        this.friendlyName = actionName;
    }

    @Output()
    actionInvoked: EventEmitter<IActionInvocationRequest> = new EventEmitter();

    invokeMethod(){
        let actionInvocation: IActionInvocationRequest = {
            actionName: this.ActionName 
        }

        this.actionInvoked.emit(actionInvocation)
    }

    constructor(private http: HttpClient){}


    ngOnInit(){
        this.dataSource = this.http.get(this.ResourceDescriptor.links[0].href).map(x=>x.json());

        this.dataSource.subscribe(data=>
            {
            this.fullResource = data.links;
            let links: Array<any> = data.links;
            this.describedBy = data.links.filter(function(item: any){return item.rel == "describedby"});
            this.http.get(this.describedBy[0].href).map(res=>res.json())
           .subscribe(describedBy => {
                    this.friendlyName = describedBy.extensions.friendlyName;
                });
            });

    }
    

}
