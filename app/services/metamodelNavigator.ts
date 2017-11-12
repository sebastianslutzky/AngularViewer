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
            throw('rel not found: ' + rel)
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


export interface IActionResultResource extends IRestResource{
    resulttype: string
    result: IResourceLink[]
}

export interface IXActionResultListItem {
    $$href: string
    $$title: string
    $$intanceId: string
}

export class XActionResultList{
   XListItems: IXActionResultListItem[]
   PropertyNames: string[]
   ROResult: IActionResultResource 


   constructor(result: any[]){
      this.ROResult = result.splice(-1,1)[0].$$ro;
      this.XListItems = result

      this.PropertyNames = this.getPropertyNames()
   }

   private getPropertyNames() :string[]{
      if(this.XListItems.length == 0){
          return [] 
      }

      //get names from first item
      let allKeys = Object.keys(this.XListItems[0])
      return allKeys.filter(function(item:string){return !item.startsWith('$$')})
   }
}