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

    //todo: find user service from home page (with rels)http://localhost:8080/restful/user
    public getMeInvocation():string{
        return  this.buildUrl("services/isissecurity.MeService/actions/me/invoke");
    }

    public getFromRel(resource: IRestResource, rel: string): IResourceLink{
        var link: IResourceLink =  resource.links.filter(function(item:any){return item.rel.startsWith(rel)})[0];
        if(!link){
            //uncomment to debug bad rel
            //console.log("resource not found:" + rel);
            //console.log(resource);
        }
        return link;
    }

    public getDescribedBy(resource:IRestResource):IResourceLink{
        return this.getFromRel(resource,"describedby")
    }

    public getDetails(resource:IRestResource):IResourceLink{
        return this.getFromRel(resource,"urn:org.restfulobjects:rels/details")
    }

    public getInvoke(resource:IRestResource):IResourceLink{
        return this.getFromRel(resource,"urn:org.restfulobjects:rels/invoke")
    }

    public isGET(link: IResourceLink){
        return link.method === "GET";
    }

    public isPOST(link: IResourceLink){
        return link.method === "POST";
    }
}

export interface IResourceLink{
    rel:string;
    href: string;
    method: string;
}

export interface IRestResource{
    links:IResourceLink[];
}
