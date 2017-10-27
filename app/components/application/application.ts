
/**
 * The entry point of the application. Represents the root workspace for the domain. 
 * 
 * @Children
 * Top Menu (collection): a list of menus listed in the services resource.
 * If one of the Top Menus emits the event onTopMenuObsolete, the top menu will be removed from the DOM
 * 
 *  @configurationService
 *  /services
 * 
 */

import {Component, ViewEncapsulation,ViewChild,ViewChildren,ElementRef,ComponentRef, 
  ViewContainerRef,ReflectiveInjector,ComponentFactoryResolver} from '@angular/core';
import FxService from  "../../services/fxService";
import {Http,HttpModule,Headers,RequestOptions,RequestMethod,RequestOptionsArgs} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map" ;
import { HttpClient2 } from '../../services/httpService';
import { MetamodelNavigator } from '../../services/metamodelNavigator';
import { ConfigurationService } from '../../services/configurationService';
import IMenuResourceLoaded from '../../events/IMenuResourceLoaded';
import MenuBarComponent from '../../components/menuBar/menuBar';
declare var $:JQueryStatic;

@Component({
  selector: 'application', // <1>
  templateUrl: 'app/components/application/application.html', // <3>
  styleUrls: ['app/components/application/application.css'], // <4>
  encapsulation:ViewEncapsulation.None
})
export default class ApplicationComponent{ 

  dataSource: Observable<any>; 
  userNameSource: Observable<any>; 
  @ViewChild('primaryMenu') private _primaryMenu: MenuBarComponent;
  @ViewChild('secondaryMenu') private _secondaryMenu: MenuBarComponent;
  @ViewChild('tertiaryMenu') private _tertiaryMenu: MenuBarComponent;
  private primaryMenuTitle: string;
  private secondaryMenuTitle: string;
  private userFirstName: string;
  private appName: string;
  
  constructor(public svc: FxService,
              private _cmpFctryRslvr: ComponentFactoryResolver,
              private http: Http,public http2: HttpClient2,
              private metamodel: MetamodelNavigator,
            private config: ConfigurationService){
      var invocation = new XMLHttpRequest();

      this.dataSource = this.http2.get(this.metamodel.getServicesUrl()).map(res=>res.json());
      this.userNameSource = this.http2.get(this.metamodel.getMeInvocation()).map(res=>res.json());
      this.appName = config.getConfig("applicationName","Home Page")
  }

  ngOnInit(){

    $('title').text(this.config.getConfig("pageTitle"),"Home Page");

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
                if(!this.primaryMenuTitle){
                  this.primaryMenuTitle = resource.title;
                }
                return this._primaryMenu ;
            case "SECONDARY":
                if(!this.secondaryMenuTitle){
                  this.secondaryMenuTitle = resource.title;
                }
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



