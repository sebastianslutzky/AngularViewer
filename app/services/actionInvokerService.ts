import {Injectable} from '@angular/core';
import { HttpClient2 } from '../services/httpService';

@Injectable()
export class ActionInvokerService {
    constructor(private http: HttpClient2){
    }

    public invokeAction(actionResource: any): any{
        console.log("invoking....");
        console.log(actionResource);
        console.log(actionResource.links[0].method)
        var link = actionResource.links[0];

        var url: string = link.href;
        var method: string = link.method;
        //TODO:use method variable instead
        this.http.get(url);
        //TODO NEXT:
        /**
         * 1 - do get call to get action resource
         * 2 - invoke action calling action invoke
         * 3 - change logic to that action resource is fully loaded by menuaction (after rendering)
         */
    }
}