import {Injectable} from '@angular/core';
import { HttpClient2 } from '../services/httpService';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigurationService {
    private _config: Object = null;
    private _env: Object = null;

    constructor(private http: HttpClient2){
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('app/config/env.json').map( res => res.json() )
            .subscribe( (envResponse) => {
                this._env = envResponse;
                let request:any = null;

               request = this.http.get('app/config/config.' + envResponse.env + '.json');

                if (request) {
                    request
                        .map( res => res.json() )
                        .subscribe((responseData) => {
                            this._config = responseData;
                            resolve(true);
                        });
                } else {
                    console.error('Env config file "env.json" is not valid');
                    resolve(true);
                }
            });

        });
    }

    getConfig(key: any):any{
        return  this._config[key];
    }
}