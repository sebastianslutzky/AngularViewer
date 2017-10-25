
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
import {HttpClient2} from '../../services/httpService';

@Component({
  selector: 'menu-action',
  template: `<li> 
        <div *ngIf="!menuLoaded" class="fa fa-spinner fa-spin"></div>
        <a class="menuLink noVeil"  href="#">
            <span class="{{styleIcons(this.friendlyName)}}"> </span>
            <span class="menuLinkLabel">{{this.friendlyName}}</span>
        </a></li>`,
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
    menuLoaded: boolean;


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


    //todo: move to injected Icons svc
    styleIcons(text: string){
       return "fa fa-fw " + this.findFaClass(text) + " fontAwesomeIcon"
    }

    findFaClass(text: string):string{
        if(!text){
            return '';
        }

         var cssClassFaPatterns = {
            "also.*": "fa-file-o",
            "add.*": "fa-plus-square",
            "remove.*": "fa-minus-square",
            "update.*": "fa-edit",
            "edit.*": "fa-edit",
            "change.*": "fa-edit",
            "delete.*": "fa-trash",
            "move.*": "fa-exchange",
            "first.*": "fa-star",
            "find.*": "fa-search",
            "lookup.*": "fa-search",
            "clear.*": "fa-remove",
            "previous.*": "fa-step-backward",
            "next.*": "fa-step-forward",
            "list.*": "fa-list",
            "all.*": "fa-list",
            "download.*": "fa-download",
            "upload.*": "fa-upload",
            "execute.*": "fa-bolt",
            "run.*": "fa-bolt",
            "calculate.*": "fa-calculator",
            "verify.*": "fa-check-circle",
            "refresh.*": "fa-refresh",
             "install.*":"fa-wrench",
         }

         var keys = Object.keys(cssClassFaPatterns);
         for(var i=0;i<keys.length;i++){
             var key:string = keys[i];
           if(text.toLowerCase().match(key)) {
               return cssClassFaPatterns[key];
           }
         }
         return ""
    }

    constructor(private http: HttpClient2){}


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
                    this.menuLoaded = true;
                });
            });

    }
}
