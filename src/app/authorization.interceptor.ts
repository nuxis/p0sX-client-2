import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor
{
    private token?: string = undefined;

    constructor()
    {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
    {
        if(this.token == undefined)
        {
            this.loadToken();
        }
        return next.handle(request.clone({
            setHeaders: {
                "Authorization": `Token ${this.token}`
            }
        }));
    }

    private loadToken()
    {
        window.localStorage.setItem("token", "bff7df00159b27b3f77d68d8014b8d2ee86fd448");
        this.token = window.localStorage.getItem("token") ?? undefined;
    }
}
