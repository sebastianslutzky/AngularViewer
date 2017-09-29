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
import { HttpClient } from './services/httpService';

@NgModule({
    imports:      [ BrowserModule , FormsModule, ReactiveFormsModule, HttpModule],
    declarations: [...myComponents],
    providers:    [
                   {provide: LocationStrategy, useClass: HashLocationStrategy},
                   {provide: FxService, useClass: FxService},
                   {provide: HttpClient, useClass: HttpClient}],
    entryComponents: [EntityComponent],
     bootstrap:    [ ApplicationComponent ]
})
export class AppModule { }
