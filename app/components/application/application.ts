
/**
 * The entry point of the application. Represents the root workspace for the domain. 
 * 
 * @Children
 * Top Menu (collection): a list of menus listed in the services resource.
 * If one of the Top Menus emits the event onTopMenuObsolete, the top menu will be removed from the DOM
 * 
 *  @WebResources
 *  /services
 * 
 */

import {Component, ViewEncapsulation,ViewChild,ViewChildren,ElementRef,ComponentRef, 
  ViewContainerRef,ReflectiveInjector,ComponentFactoryResolver} from '@angular/core';
import FxService from  "../../services/fxService";
import {Http,HttpModule,Headers,RequestOptions,RequestMethod,RequestOptionsArgs} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map" ;
import { HttpClient } from '../../services/httpService';
import IMenuResourceLoaded from '../../events/IMenuResourceLoaded';
import MenuBarComponent from '../../components/menuBar/menuBar';

@Component({
  selector: 'auction-application', // <1>
  templateUrl: 'app/components/application/application.html', // <3>
  styleUrls: ['app/components/application/application.css'], // <4>
  encapsulation:ViewEncapsulation.None
})
export default class ApplicationComponent{ 
  pageResourceUrl: string= "http://localhost:8080/restful/services/";
  userNameUrl: string= "http://localhost:8080/restful/services/isissecurity.MeService/actions/me/invoke";

  dataSource: Observable<any>; 
  userNameSource: Observable<any>; 
  @ViewChild('primaryMenu') private _primaryMenu: MenuBarComponent;
  @ViewChild('secondaryMenu') private _secondaryMenu: MenuBarComponent;
  @ViewChild('tertiaryMenu') private _tertiaryMenu: MenuBarComponent;
  private topMenuNames:{[key:string]:string;} ={}
  private userFirstName: string;
  
  constructor(public svc: FxService,
              private _cmpFctryRslvr: ComponentFactoryResolver,
              private http: Http,public http2: HttpClient){
      var invocation = new XMLHttpRequest();

      this.dataSource = this.http2.get(this.pageResourceUrl).map(res=>res.json());
      this.userNameSource = this.http2.get(this.userNameUrl).map(res=>res.json());
  }

  ngOnInit(){
    this.dataSource.subscribe(data =>{
      var menuResources: Array<any> = data.value;

      for(var i=0;i<menuResources.length;i++){
        this.addTopMenuIfNeeded(menuResources[i])
      }
    });

    this.userNameSource.subscribe(data =>{
      this.userFirstName = data.result.members.name.value;
    })
  }

  addTopMenuIfNeeded(resource: any){
    var ds = this.http2.get(resource.href).map(x=>x.json());
    ds.subscribe(data=> {
      let asArray = Object.keys(data.members).map(function(k) {return data.members[k]});

      if(asArray.length > 1)
      {
        this.chooseParentMenu(data).addSection(resource)
      }
    })
  }

  chooseParentMenu(resource: any):MenuBarComponent{
    if(resource.extensions && resource.extensions.menuBar)
    {
        var menuBar = resource.extensions.menuBar
        switch(menuBar){
            case "PRIMARY":
                return this._primaryMenu ;
            case "SECONDARY":
                return this._secondaryMenu ;
            case "TERTIARY":
                return this._tertiaryMenu ;
        }
        throw ("Unknown menuBar " + menuBar)
    }
}

//todo: use userprofile service if present
//https://trello.com/c/i0bTNecz/25-try-to-use-userprofileservice-if-it-exist
  getTertiartyHeader() : string{
    return "Hi " + this.userFirstName + "!"
  }
}



