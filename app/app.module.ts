import { NgModule }      from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Routes,RouterModule } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {myComponents} from "./componentList";
import ApplicationComponent from "./components/application/application";
import EntityComponent from "./components/entity/entity";
import FxService from "./services/fxService";
import {Draggable} from '../node_modules/ng2draggable/draggable.directive';
import { HttpClient2 } from './services/httpService';
import { MetamodelNavigator } from './services/metamodelNavigator';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigurationService } from './services/configurationService';
import { ActionInvokerService } from './services/actionInvokerService';

@NgModule({
    imports:      [ BrowserModule , FormsModule, ReactiveFormsModule, HttpModule],
    declarations: [...myComponents],
    providers:    [
                    {provide: APP_INITIALIZER, useFactory:(config: ConfigurationService)=>()=>config.load(),deps: [ConfigurationService], multi: true},
                   {provide: LocationStrategy, useClass: HashLocationStrategy},
                   {provide: FxService, useClass: FxService},
                   {provide: MetamodelNavigator, useClass: MetamodelNavigator},
                   {provide: HttpClient2, useClass: HttpClient2},
                   {provide: ConfigurationService, useClass: ConfigurationService},
                   {provide: ActionInvokerService, useClass: ActionInvokerService},
                ],
     bootstrap:    [ ApplicationComponent ],
     entryComponents: [EntityComponent]


})
export class AppModule { }
