
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

@Component({
  selector: 'auction-application', // <1>
  templateUrl: 'app/components/application/application.html', // <3>
  styleUrls: ['app/components/application/application.css'], // <4>
  encapsulation:ViewEncapsulation.None
})
export default class ApplicationComponent{ 
  dataSource: Observable<any>; 
  menus: any;

  pageResourceUrl: string= "http://localhost:8080/restful/services/";

  topMenus: Array<Array<string>>;

  menuItems(menu: string){
    var ret =  this.menus[menu];
    return ret;
  }
  //TO BE USED FOR ACTION RESULTS
   @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: ElementRef;


handleOnTopMenuObsolete(i: number){
  this.topMenus[0].splice(i, 1);
}

handleOnMenuPositionKnown(position: number, i: number){
  if(i > 1){
    var toRelocate = this.topMenus[0].splice(i, 1);
    if(position == 3){
      console.log("rendering tertiary: " + toRelocate)
    }
    this.topMenus[position -1].push(toRelocate[0]);
  }
}

  constructor(public svc: FxService,
              private _cmpFctryRslvr: ComponentFactoryResolver,
              private http: Http,public http2: HttpClient){
      var invocation = new XMLHttpRequest();

      this.dataSource = this.http2.get(this.pageResourceUrl).map(res=>res.json());
  }
/**
 * 1) loads services, turns them into this.menus and indexes it by unique name (topMenuCategories)
 * 2) renders each menucategory as an item in primary. 
 * 3) adds a topmenuentity for each entry in topMenuCategories/menus 
 * 
 * consider
 * 1) repeat 1 but add "bucket to the indexation". 
 *    - add a buckets[1-3] index when indexing
 *    - access with getPrimaryMenus(), getSecondaryMenus() etc
 *    - when raise obsolete event with bucket number
 */
  ngOnInit(){
        this.topMenus = new Array<Array<string>>();
        for(var i=0;i<3;i++){
          this.topMenus.push(new Array<string>());
        }

    this.dataSource.subscribe(data =>{
        this.menus = data.value;
        var allMenus: Array<any> = data.value;
        this.menus = allMenus.reduce(function(r,a){
          r[a.title]= r[a.title]||[];
          r[a.title].push(a);
          return r;
        },[]);

        //determine what object E
        this.topMenus[0] = Object.keys(this.menus);
    });
    
    var layoutResource = this.http2.get("")
  }

  menuCategories(){
    let catNames = this.menus.map(m => m.title);
    return Array.from(new Set(catNames));
  }

  invokeActionHandler(event: IActionInvocationRequest){
    //create EntityComponent and render here
    let resultEntity = this.svc.invokeRootAction(event.actionName);
    if(resultEntity){
      let cmp = this.createComponent(this._placeHolder, EntityComponent,resultEntity);
      this._placeHolder.insert(cmp.hostView);
    }
  }

  //TODO: Move to ComponentFactory service
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
}

