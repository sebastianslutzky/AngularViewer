
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
import EntityComponent from "../../components/entity/entity" ;
import FxService from  "../../services/fxService";
import {Http,HttpModule,Headers,RequestOptions,RequestMethod,RequestOptionsArgs} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map" ;
import { HttpClient } from '../../services/httpService';
import ServiceMenuComponent from '../../components/serviceMenuComponent/serviceMenuComponent';
import IMenuResourceLoaded from '../../events/IMenuResourceLoaded';

@Component({
  selector: 'auction-application', // <1>
  templateUrl: 'app/components/application/application.html', // <3>
  styleUrls: ['app/components/application/application.css'], // <4>
  encapsulation:ViewEncapsulation.None
})
export default class ApplicationComponent{ 
  pageResourceUrl: string= "http://localhost:8080/restful/services/";
  dataSource: Observable<any>; 
  @ViewChild('primaryMenu', {read: ViewContainerRef}) private _primaryMenu: ElementRef;
  @ViewChild('secondaryMenu', {read: ViewContainerRef}) private _secondaryMenu: ElementRef;
  @ViewChild('tertiaryMenu', {read: ViewContainerRef}) private _tertiaryMenu: ElementRef;
  

  constructor(public svc: FxService,
              private _cmpFctryRslvr: ComponentFactoryResolver,
              private http: Http,public http2: HttpClient){
      var invocation = new XMLHttpRequest();

      this.dataSource = this.http2.get(this.pageResourceUrl).map(res=>res.json());
  }

  ngOnInit(){
    this.dataSource.subscribe(data =>{
      var menuResources: Array<any> = data.value;
      for(var i=0;i<menuResources.length;i++){
        this.addTopMenuIfNeeded(menuResources[i])
        //create component dynamically
        //var cp = this.createComponent(this._primaryMenu,ServiceMenuComponent,menuResources[i]) as ComponentRef<ServiceMenuComponent>
         //this._primaryMenu.insert(cp.hostView);
      }

      /**
       * create method that
       * 1) receives a resource
       * 2) loads the resource
       * 3) if it has menues, add, else don't
       */
    });
  }

  addTopMenuIfNeeded(resource: any){
    var ds = this.http2.get(resource.href).map(x=>x.json());
    ds.subscribe(data=> {
      //any submenu?
      var parentMenu = this.chooseParentMenu(data);
      let members = data.members;
      let asArray = Object.keys(members).map(function(k) {return members[k]});
      this.actions = asArray;
      var cp = this.createComponent(parentMenu,ServiceMenuComponent,resource) as ComponentRef<ServiceMenuComponent>
      parentMenu.insert(cp.hostView);
    })
  }

  public createComponent (vCref: ViewContainerRef, type: any, inputData: any): ComponentRef {
      let inputProviders = Object.keys(inputData).map((inputName) => {
        return {
          provide: inputName, useValue: inputData[inputName]};});
      
    let  resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, 
        vCref.parentInjector);

    let factory = this._cmpFctryRslvr.resolveComponentFactory(type);

    // create component without adding it directly to the DOM
    let comp = factory.create(injector);

    return comp;
  }

  chooseParentMenu(resource: any):ElementRef{
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



