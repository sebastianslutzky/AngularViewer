
import {NgModule,Component, ViewEncapsulation, Input, Output, EventEmitter,Injector, OnInit} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MetamodelNavigator,IRestResource, XActionResultList } from '../../services/metamodelNavigator';
import {Ng2TableModule} from 'ng2-table/ng2-table'
@Component({
  selector: 'entity', // <1>
  templateUrl: 'app/components/entity/entity.html', // <3>
  encapsulation:ViewEncapsulation.None
})
export default class EntityComponent implements OnInit{ 
  _resource:XActionResultList

  public columns : any[] 
  public rows : any[] 

  constructor(public injector: Injector){
    let rawResult  = this.injector.get('actionResource').Result;

    //todo: move to specialised class that decides how to cast result based on type
    this._resource = new XActionResultList(rawResult);
    this.rows  = this._resource.XListItems
    this.columns = this._resource.PropertyNames.map(function(item){return{name: item}})
  }

  ngOnInit(): void {
    
  }

  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-bordered']
  };
  
}