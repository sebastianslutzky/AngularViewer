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
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';

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
    onMenuEntityLoaded: EventEmitter<IMenuResourceLoaded> = new EventEmitter();

    ngOnInit(){

        this.dataSource = this.http.get(this.ResourceDescriptor.href).map(x=>x.json());

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