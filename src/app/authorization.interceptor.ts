import {Injectable} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from "@services/config.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor
{
    constructor(private config: ConfigService)
    {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
    {
        if(this.config.authToken === null)
        {
            return next.handle(request);
        }

        return next.handle(request.clone({
            setHeaders: {
                "Authorization": `Token ${this.config.authToken}`
            }
        }));
    }
}
