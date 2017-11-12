import {Injectable,Output,EventEmitter} from '@angular/core';
import { HttpClient2 } from '../services/httpService';
import { MetamodelNavigator ,IResourceLink, IRestResource, IActionResultResource} from '../services/metamodelNavigator';

@Injectable()
export class ActionInvokerService {
    constructor(private http: HttpClient2,private metamodel: MetamodelNavigator){}

    @Output()
    actionInvoked: EventEmitter<IActionInvoked> =new EventEmitter();

    //TODO: it will need to receive the full resource (including describedBy link, to get params)
    public invokeAction(actionResource: IRestResource): any{
        var invoke: IResourceLink = this.metamodel.getInvoke(actionResource);

        //Action invocation (will need to be a safe call, with proper error handling)
        if(this.metamodel.isGET(invoke)){
            this.http.get(invoke.href,true).map(x=>x.json()). subscribe(data=>
             {
                 let arg = new ActionInvokedArg();
                 arg.Result = data;

                let event: IActionInvoked = {
                    Arg : arg
                }

                console.log(data);

            this.actionInvoked.emit(event)
            })
            return null;
        }
        throw `Only GET invocations supported, not ...${invoke.method}`
    }
}

export class ActionInvokedArg{
    Result: IActionResultResource;
}

export interface IActionInvoked{
    Arg: ActionInvokedArg
}
