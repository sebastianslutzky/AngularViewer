import {Injectable} from "@angular/core";
import { HttpClient2 } from '../services/httpService';
import { ConfigurationService } from '../services/configurationService';


@Injectable()
export class MetamodelNavigator {

    private rootUrl:string;

    constructor(private http: HttpClient2,private config: ConfigurationService){ 
        //todo: get from configuration service
        var host = this.config.getConfig("host");
        var port = this.config.getConfig("port");
        var apiRoot = this.config.getConfig("apiRoot");

        this.rootUrl = "http://" + host + ":" + port + "/" + apiRoot;
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