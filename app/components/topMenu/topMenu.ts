
/**
 * Contains a collection of menu entities. It monitors if one of this menu entities are empty of actions, and notifies so if true. 
 *  @WebResources
 *  None 
 * 
 * @Events
 * onTopMenuObsolete 
 * 
 * NOTE: consider merging this class up (to the application) and/or down (to the menu entity)
 */

import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HttpClient } from '../../services/httpService';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map" ;

@Component({
  selector: 'top-menu', 
  template: `<li><a class="dropdown-toggle" data-toggle="dropdown" href="#">{{this.name}}</a>
    <ul class="dropdown-menu">
        <div *ngFor="let menuItem of this.items" >
            <menuEntity [ResourceDescriptor]='menuItem' (onMenuEntityLoaded)="handleMenuLoaded($event)"></menuEntity>
        </div>
    </ul>
  </li>
  `,
  encapsulation:ViewEncapsulation.None
})

export default class TopMenuComponent{ 
    dataSource: Observable<any>;
    subMenues: number = 0;
    anythingLoaded: boolean;

    @Output()
    onTopMenuObsolete: EventEmitter<number> = new EventEmitter();

    @Input()
    name: string;

    @Input()
    items: Array<any>;

    handleMenuLoaded(event: number){
        this.anythingLoaded = event > 0;
        this.subMenues++;
        if(this.subMenues === this.items.length && event ==0){
            this.onTopMenuObsolete.emit();
        }
    }

    constructor(private client: HttpClient){
    }

}
