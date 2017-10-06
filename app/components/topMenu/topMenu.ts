
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
import {IMenuResourceLoaded} from '../../events/IMenuResourceLoaded';
import "rxjs/add/operator/map" ;

@Component({
  selector: 'top-menu', 
  template: `<li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="javascript:;">
            <span>{{this.name}}</span><span class="caret"></span>
        </a>
    <ul class="dropdown-menu scrollable-menu multi-level top-menu-contacts" role="menu">
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
    positionKnown: boolean;

    @Output()
    onTopMenuObsolete: EventEmitter<number> = new EventEmitter();

    @Output()
    onMenuPositionKnown: EventEmitter<number> = new EventEmitter();

    @Input()
    name: string;

    @Input()
    items: Array<any>;



    handleMenuLoaded(event: IMenuResourceLoaded){
        this.anythingLoaded = event.numberOfSubmenues > 0;
        this.subMenues++;
        if(this.subMenues === this.items.length && event.numberOfSubmenues ==0){
            this.onTopMenuObsolete.emit();
        }

        if(this.positionKnown){
            console.info("position already known for " + this.name + " skipping onMenuPositionKnown event....")
            return
        }
        this.positionKnown = true;
        this.onMenuPositionKnown.emit(event.menuPosition);
    }

    constructor(private client: HttpClient){
    }

}
