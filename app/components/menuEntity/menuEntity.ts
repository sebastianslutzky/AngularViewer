/**
 * Represents a Menu class, containing one or more invoke-able menu actions
 *  @WebResources
 *  /services/%menu%
 * 
 * @Events
 *  onMenuEntityLoaded(numberOfActions)
 */
import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '../../services/httpService';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'menuEntity', 
  template: `<div *ngFor="let action of this.actions">
                <menu-action [ResourceDescriptor]='action'></menu-action>
            </div>` ,
  encapsulation:ViewEncapsulation.None
})
export default class MenuEntityComponent{

    @Input()
    ResourceDescriptor: any;

    dataSource: Observable<any>; 
    actions: Array<any>;

    constructor(private http: HttpClient){}

    @Output()
    onMenuEntityLoaded: EventEmitter<IMenuActionsExist> = new EventEmitter();

    ngOnInit(){

        this.dataSource = this.http.get(this.ResourceDescriptor.href).map(x=>x.json());

        //get resource & described by
        this.dataSource.subscribe(data=>
            {
            let members = data.members;
            let asArray = Object.keys(members).map(function(k) {return members[k]});
            this.actions = asArray;
            this.onMenuEntityLoaded.emit(this.actions.length);
            });
    }
}