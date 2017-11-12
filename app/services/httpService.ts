import {Injectable} from "@angular/core";
import {Http,Headers,RequestOptions} from "@angular/http";


@Injectable()
export class HttpClient2 {

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('superadmin:pass')); 
  }

  addApacheIsisAccept(headers: Headers){
      headers.append('Accept','application/json;profile="urn:org.apache.isis/v1"')
  }

  get(url: string,isisHeader:boolean = false) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    if(isisHeader){
      this.addApacheIsisAccept(headers)
    }
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
}