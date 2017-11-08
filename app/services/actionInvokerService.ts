import {Injectable,Output,EventEmitter} from '@angular/core';
import { HttpClient2 } from '../services/httpService';
import { MetamodelNavigator ,IResourceLink} from '../services/metamodelNavigator';

@Injectable()
export class ActionInvokerService {
    constructor(private http: HttpClient2,private metamodel: MetamodelNavigator){
    }

    @Output()
    actionInvoked: EventEmitter<IActionInvoked> =new EventEmitter();

    public invokeAction(actionResource: any): any{
        var invoke: IResourceLink = this.metamodel.getInvoke(actionResource);

        if(this.metamodel.isGET(invoke)){
            this.http.get(invoke.href).map(x=>x.json()). subscribe(data=>
             {
                 let arg = new ActionInvokedArg();
                 arg.Result = data;

                let argument: IActionInvoked = {
                    Arg : arg
                }

            this.actionInvoked.emit(argument)
            };
            return null;
        }
        throw `Only GET invocations supported, not ...${invoke.method}`
    }
}

export class ActionInvokedArg{
    Result: any;
}

export interface IActionInvoked{
    Arg: ActionInvokedArg
}