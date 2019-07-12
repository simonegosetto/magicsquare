import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';
import { IGatewayResponse } from '../interfaces/gateway-response';
import { Users } from '../interfaces/users';
import { Device } from '@ionic-native/device/ngx';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    constructor(private _http: HttpClient,
                public platform: Platform,
                public loading: LoadingService,
                public toast: ToastService,
                private _device: Device
    ) { }

    private online = false;
    public http_json_headers = new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Allow-Origin', '*');
    public user: Users;
    private logged = true;
    public _config = {
        GTW_DBOX: environment.backendUrl + '/FD_DataServiceGatewayUUID.php'
    };
    public data = {
        IdClienteGenerico: 'XXX',
        nazioniList: []
    };

    //////////////////////// GLOBAL FUNCTION /////////////////////////

    public callGateway(process, params, loader = true, loaderDuration = 2000): Observable<IGatewayResponse> {
        if (loader) { this.loading.present(loaderDuration); }
        return this._http.post<IGatewayResponse>(
            this._config.GTW_DBOX + '?gest=2',
            {
                process: process,
                params: params,
                token: this.uuid()
            },
            {
                headers: this.http_json_headers
            }
        ).pipe(
            catchError(this.error_handler)
        );
    }

    public checkUser(): boolean {
        if (this.user !== undefined && this.user !== null && localStorage.getItem('token') !== null && localStorage.getItem('user') !== null) {
            this.logged = true;
            return true;
        } else {
            this.logged = false;
            return false;
        }
    }

   //////////////////////// UTILITY /////////////////////////

    public focusInput(input) {
        input.setFocus();
    }

    public isnull(value, replace = '') {
        if (value === null || value === undefined || value === 'null') {
            if (replace !== null && replace !== undefined) {
                return replace;
            }
            return '';
        }
        return value;
    }

    public checkConnection(): boolean {
        const networkState = navigator['connection'].type || navigator['connection'].effectiveType;

        const Connection = window['Connection'] || {
            'CELL'     : 'cellular',
            'CELL_2G'  : '2g',
            'CELL_3G'  : '3g',
            'CELL_4G'  : '4g',
            'ETHERNET' : 'ethernet',
            'NONE'     : 'none',
            'UNKNOWN'  : 'unknown',
            'WIFI'     : 'wif'
        };

        const states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        this.online = !(networkState === Connection.NONE);

        return this.online;
    }

    public isApp(): boolean {
        return (
            document.URL.indexOf('http://localhost') === 0 ||
            document.URL.indexOf('ionic') === 0 ||
            document.URL.indexOf('https://localhost') === 0
        ); // && !isDevMode();
    }

    public isBrowser(): boolean {
        return !this.isApp();
    }

    public isIOS(): boolean {
        return this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone');
    }

    public isOnline(): boolean {
        return this.online;
    }

    public isDesktop(): boolean {
        return this.platform.is('desktop');
    }

    public isLogged(): boolean {
        return this.logged;
    }

    public uuid() {
        if (!this.isOnline()) {
            return 'OFFLINE';
        } else if (isDevMode()) {
            return 'DEV';
        } else {
            return this._device.uuid;
        }
    }

    //////////////////////// INIT /////////////////////////

    public init() {
        this.checkUser();
    }

    //////////////////////// DATA /////////////////////////

    sendUUID() {
        this.callGateway('CXlS+LdceFm9nhFxNmW0rVMhYIScZP3DpSf4odckC/8tWy0tSVYtWy0waux6dCHH/Fq0llCR4C04IRRHCa4DtDZfLhtkVFFalg@@',
            '\'' + this.uuid() + '\'', false).subscribe(data => {
            if (data.hasOwnProperty('error')) {
                this.toast.present(data.error);
                return;
            }
            this.logged = true;
            this.user = data.recordset[0];
            localStorage.setItem('token', this.user.UUID);
            localStorage.setItem('user', JSON.stringify(this.user));
            },
        error => this.toast.present(error.message, 5000));
    }

    //////////////////////// ERROR ENDLER /////////////////////////

    public error_handler(error: HttpErrorResponse) {
        console.log('errore ', error.message);
        if (this.loading !== undefined) {
            this.loading.dismiss();
        }
        if (this.toast) {
            this.toast.present(error.message || 'Errore Generico', 3000);
        }
        return throwError(error.message || 'Errore Generico');
    }

    ///////////////////////////////////////////////////////////////

}
