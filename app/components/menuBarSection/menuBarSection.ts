import {NgModule,Component, Injector,ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '../../services/httpService';
import {Observable} from "rxjs/Observable";
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';

@Component({
  selector: 'menu-bar-section', 
  template: `
<div >
    <div *ngIf="!menuLoaded" class="fa fa-spinner fa-spin"></div>
    <div  *ngFor="let action of this.actions">
        <menu-action #ma [hidden]="hidden"[ResourceDescriptor]='action'></menu-action>
    </div>
    <li *ngIf="!NoDivision" class="divider"></li>
</div>
` ,
  encapsulation:ViewEncapsulation.None
})
export default class MenuBarSectionComponent{
    @Input()
    ResourceDescriptor: any;
    @Input()
    NoDivision:boolean;
    dataSource: Observable<any>; 
    actions: Array<any>=[];
    @Output()
    onMenuEntityLoaded: EventEmitter<IMenuResourceLoaded> = new EventEmitter();
    menuLoaded: boolean;
    
    get friendlyName(): String{
        return this.ResourceDescriptor.title
    }

    constructor(private http: HttpClient){}

    ngOnInit(){
        this.dataSource = this.http.get(this.ResourceDescriptor.href).map(x=>x.json());
        this.dataSource.subscribe(data=>
        {
            let members = data.members;
            let asArray = Object.keys(members).map(function(k) {return members[k]});
            this.actions = asArray;
            let resourceLoaded: IMenuResourceLoaded = {
                numberOfSubmenues: asArray.length
            };
            this.menuLoaded = true;
            this.onMenuEntityLoaded.emit(resourceLoaded);
        });
    }
}