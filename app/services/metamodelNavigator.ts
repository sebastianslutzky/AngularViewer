import {Injectable} from "@angular/core";


@Injectable()
export class MetamodelNavigator {

    private rootUrl:string;

    constructor(){ 
        //todo: get from configuration service
        this.rootUrl = "http://localhost:8080/restful";
    }

    private buildUrl(endpoint: string): string{
        return this.rootUrl + '/'+ endpoint ;
    }

    public getServicesUrl(): string{
        return this.buildUrl("services");
    }

    public getMeInvocation():string{
        return  this.buildUrl("services/isissecurity.MeService/actions/me/invoke");
    }


}